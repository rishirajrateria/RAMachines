#!/usr/bin/env node
/**
 * scripts/optimize-images.mjs — ADR-0009 §1: responsive, modern image variants.
 *
 * For every source image under `public/{photos,products,categories,certs,about}`
 * this emits, alongside the original:
 *   - AVIF at quality ~50 / effort 6, and WebP at quality ~72, at widths
 *     640 / 1024 / 1600 / 1920 — each capped (never upscaled) at the source's own
 *     width, then de-duplicated.
 *   - a 20px-wide base64 WebP data URI (LQIP) for the blurred loading placeholder.
 *
 * Output files go to `public/_img/...` (see VARIANT_DIR below); the source file
 * itself is never touched or renamed — ADR-0008 "keep every existing filename".
 *
 * SPEED. This is by far the most expensive step in the build: ~1085 variants,
 * and a cold run took ~40 MINUTES, which was the entire Vercel build time (one
 * deploy hit the 45-minute limit and failed). Three things fix that:
 *
 *   1. Images encode CONCURRENTLY, one worker per core, with libvips' own
 *      threading turned down to 1 so the two don't oversubscribe each other.
 *      Many medium images in parallel beats one image at a time.
 *   2. AVIF effort drops 6 -> 4 (sharp's own default). Effort 6 costs roughly
 *      double the CPU for a couple of percent of file size.
 *   3. Freshness is keyed on a HASH OF THE SOURCE BYTES, recorded in the
 *      manifest — not on mtimes. mtimes do not survive a git clone, so an
 *      mtime check re-encodes everything on every CI machine even when the
 *      outputs are right there. With a content hash, a build whose sources
 *      haven't changed does no encoding at all.
 *
 * Because of (3) the generated tree and the manifest are COMMITTED, so a deploy
 * never encodes anything and `next build` is the whole build. Regenerate with
 * `npm run optimize:images` after changing any source image, and commit both.
 *
 * Writes `lib/image-manifest.json`:
 *   {
 *     "/photos/hero-home.webp": {
 *       "width": 1920, "height": 1080, "lqip": "data:image/webp;base64,...",
 *       "variants": {
 *         "avif": [{ "w": 640, "src": "/photos/hero-home-640.avif" }, ...],
 *         "webp": [{ "w": 640, "src": "/photos/hero-home-640.webp" }, ...]
 *       }
 *     }, ...
 *   }
 *
 * Run via `npm run optimize:images`, wired into `npm run build` before `next build`.
 */
import { readdir, stat, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { availableParallelism } from "node:os";
import { dirname, join, extname, basename, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// One image per worker, one libvips thread per image. Letting both layers use
// every core at once just makes them fight over the same ones.
sharp.concurrency(1);
const WORKERS = Math.max(1, Math.min(availableParallelism(), 8));

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIRS = ["photos", "products", "categories", "certs", "about"];
const TARGET_WIDTHS = [640, 1024, 1600, 1920];
// effort 4 is sharp's default; 6 roughly doubles CPU for ~2% of file size.
const AVIF_OPTS = { quality: 50, effort: 4 };
const WEBP_OPTS = { quality: 72 };
const LQIP_WIDTH = 20;

// Generated variants are written to a dedicated tree (`public/_img/...`), never beside
// their source. Keeping them in their own directory means the build can tell source from
// output by LOCATION rather than by filename pattern — a filename rule is unsafe here
// because legitimate sources carry digit groups too (e.g. `iso-9001-2015.webp` ends in
// what looks exactly like a `-<width>` suffix). One ignore rule (`public/_img/`) covers
// every derivative, and a re-run can never re-ingest its own output.
const VARIANT_DIR = "_img";

const SOURCE_EXT_RE = /\.(webp|png|jpe?g)$/i;

async function findSources(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === VARIANT_DIR) continue; // never treat generated output as input
      files.push(...(await findSources(full)));
    } else if (SOURCE_EXT_RE.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function hashFile(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex").slice(0, 16);
}

/**
 * A cached manifest entry is reusable only if the source is byte-identical AND
 * every file it promises is actually on disk — otherwise a half-deleted tree
 * would be reported as up to date and the page would 404 its own images.
 */
function entryIsUsable(entry, hash, publicRoot) {
  if (!entry || entry.hash !== hash || !entry.variants) return false;
  for (const format of ["avif", "webp"]) {
    for (const v of entry.variants[format] ?? []) {
      if (!existsSync(join(publicRoot, v.src.replace(/^\//, "")))) return false;
    }
  }
  return !!entry.lqip;
}

async function processImage(srcPath, publicRoot, srcHash) {
  const image = sharp(srcPath);
  const meta = await image.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  const dir = dirname(srcPath);
  const ext = extname(srcPath);
  const name = basename(srcPath, ext);
  const relDir = dir.slice(publicRoot.length).split("\\").join("/") || "";
  const publicSrc = `${relDir}/${name}${ext}`.replace(/\/{2,}/g, "/");

  const widths = [...new Set(TARGET_WIDTHS.map((w) => Math.min(w, width || w)))].sort((a, b) => a - b);

  const variants = { avif: [], webp: [] };
  let built = 0;
  let skipped = 0;

  const outDir = join(publicRoot, VARIANT_DIR, relDir.replace(/^\//, ""));
  const outRel = `/${VARIANT_DIR}${relDir}`.replace(/\/{2,}/g, "/");
  await mkdir(outDir, { recursive: true });

  for (const w of widths) {
    const avifPath = join(outDir, `${name}-${w}.avif`);
    const webpPath = join(outDir, `${name}-${w}.webp`);

    await sharp(srcPath).resize({ width: w }).avif(AVIF_OPTS).toFile(avifPath);
    await sharp(srcPath).resize({ width: w }).webp(WEBP_OPTS).toFile(webpPath);
    built += 2;

    variants.avif.push({ w, src: `${outRel}/${name}-${w}.avif`.replace(/\/{2,}/g, "/") });
    variants.webp.push({ w, src: `${outRel}/${name}-${w}.webp`.replace(/\/{2,}/g, "/") });
  }

  // LQIP: tiny, cheap, always recomputed.
  const lqipBuffer = await sharp(srcPath)
    .resize({ width: LQIP_WIDTH })
    .webp({ quality: 40 })
    .toBuffer();
  const lqip = `data:image/webp;base64,${lqipBuffer.toString("base64")}`;

  return { publicSrc, entry: { hash: srcHash, width, height, lqip, variants }, built, skipped };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A source image can be mid-write from an unrelated generator script sharing
// this checkout (e.g. scripts/generate-photos.mjs, which this script never
// owns or blocks on) — sharp then sees a half-written file and throws. One
// short retry clears that up; if it still fails the source is genuinely
// broken, so skip it (logged) rather than aborting every other image.
async function processImageSafe(src, publicRoot, srcHash) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await processImage(src, publicRoot, srcHash);
    } catch (err) {
      if (attempt === 2) {
        console.warn(`[optimize-images] skipped ${src}: ${err.message}`);
        return null;
      }
      await sleep(300);
    }
  }
  return null;
}

async function main() {
  const start = Date.now();
  const publicRoot = join(ROOT, "public");
  const manifestPath = join(ROOT, "lib", "image-manifest.json");

  /** Last run's manifest, if any — the cache that lets an unchanged build do nothing. */
  let previous = {};
  try {
    previous = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    previous = {};
  }

  // Collect every source first, so the work can be spread across workers.
  const sources = [];
  for (const sourceDir of SOURCE_DIRS) {
    const dir = join(publicRoot, sourceDir);
    if (!existsSync(dir)) continue;
    sources.push(...(await findSources(dir)));
  }
  sources.sort();

  const manifest = {};
  let totalBuilt = 0;
  let reused = 0;
  let totalFailed = 0;

  let next = 0;
  async function worker() {
    for (;;) {
      const index = next++;
      if (index >= sources.length) return;
      const src = sources[index];

      const hash = await hashFile(src);
      const publicSrc = `/${relative(publicRoot, src).split("\\").join("/")}`;

      // Unchanged source and every promised file present: nothing to do.
      if (entryIsUsable(previous[publicSrc], hash, publicRoot)) {
        manifest[publicSrc] = previous[publicSrc];
        reused++;
        continue;
      }

      const result = await processImageSafe(src, publicRoot, hash);
      if (!result) {
        totalFailed++;
        continue;
      }
      manifest[result.publicSrc] = result.entry;
      totalBuilt += result.built;
    }
  }
  await Promise.all(Array.from({ length: WORKERS }, worker));

  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  // Drop generated files nothing references any more, so the committed tree
  // never accumulates orphans from renamed or deleted sources. Scoped to the
  // variant directory, and driven by the manifest we just wrote rather than by
  // any filename pattern.
  const referenced = new Set();
  for (const entry of Object.values(manifest)) {
    for (const format of ["avif", "webp"]) {
      for (const v of entry.variants[format] ?? []) referenced.add(v.src);
    }
  }
  let pruned = 0;
  const variantRoot = join(publicRoot, VARIANT_DIR);
  if (existsSync(variantRoot)) {
    for (const file of await findAll(variantRoot)) {
      const rel = `/${VARIANT_DIR}/${relative(variantRoot, file).split("\\").join("/")}`;
      if (!referenced.has(rel)) {
        await rm(file, { force: true });
        pruned++;
      }
    }
  }

  const ms = Date.now() - start;
  console.log(
    `[optimize-images] ${sources.length} sources · ${reused} unchanged · ${totalBuilt} variant(s) encoded` +
      (pruned ? ` · ${pruned} orphan(s) pruned` : "") +
      (totalFailed ? ` · ${totalFailed} skipped (see warnings above)` : "") +
      ` · ${WORKERS} workers · ${(ms / 1000).toFixed(1)}s`,
  );
}

/** Every file under a directory, recursively. */
async function findAll(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await findAll(full)));
    else files.push(full);
  }
  return files;
}

main().catch((err) => {
  console.error("[optimize-images] failed:", err);
  process.exitCode = 1;
});
