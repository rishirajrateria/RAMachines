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
 * Output files sit next to the source as `<name>-<width>.avif` / `.webp` (the
 * source file itself is never touched or renamed — ADR-0008 "keep every existing
 * filename"). Re-running the script never re-encodes work that's already up to
 * date: a variant is only (re)built when it's missing or older than its source.
 * Manifest metadata (dimensions + LQIP) is cheap enough to always recompute so
 * the manifest never goes stale.
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
import { readdir, stat, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIRS = ["photos", "products", "categories", "certs", "about"];
const TARGET_WIDTHS = [640, 1024, 1600, 1920];
const AVIF_OPTS = { quality: 50, effort: 6 };
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

async function isFresh(outPath, srcMtimeMs) {
  if (!existsSync(outPath)) return false;
  const outStat = await stat(outPath);
  return outStat.mtimeMs >= srcMtimeMs;
}

async function processImage(srcPath, publicRoot) {
  const srcStat = await stat(srcPath);
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

    if (await isFresh(avifPath, srcStat.mtimeMs)) {
      skipped++;
    } else {
      await sharp(srcPath).resize({ width: w }).avif(AVIF_OPTS).toFile(avifPath);
      built++;
    }
    variants.avif.push({ w, src: `${outRel}/${name}-${w}.avif`.replace(/\/{2,}/g, "/") });

    if (await isFresh(webpPath, srcStat.mtimeMs)) {
      skipped++;
    } else {
      await sharp(srcPath).resize({ width: w }).webp(WEBP_OPTS).toFile(webpPath);
      built++;
    }
    variants.webp.push({ w, src: `${outRel}/${name}-${w}.webp`.replace(/\/{2,}/g, "/") });
  }

  // LQIP: tiny, cheap, always recomputed.
  const lqipBuffer = await sharp(srcPath)
    .resize({ width: LQIP_WIDTH })
    .webp({ quality: 40 })
    .toBuffer();
  const lqip = `data:image/webp;base64,${lqipBuffer.toString("base64")}`;

  return { publicSrc, entry: { width, height, lqip, variants }, built, skipped };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A source image can be mid-write from an unrelated generator script sharing
// this checkout (e.g. scripts/generate-photos.mjs, which this script never
// owns or blocks on) — sharp then sees a half-written file and throws. One
// short retry clears that up; if it still fails the source is genuinely
// broken, so skip it (logged) rather than aborting every other image.
async function processImageSafe(src, publicRoot) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return await processImage(src, publicRoot);
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
  const manifest = {};
  let totalBuilt = 0;
  let totalSkipped = 0;
  let totalImages = 0;
  let totalFailed = 0;

  for (const sourceDir of SOURCE_DIRS) {
    const dir = join(publicRoot, sourceDir);
    if (!existsSync(dir)) continue;
    const sources = await findSources(dir);
    for (const src of sources.sort()) {
      const result = await processImageSafe(src, publicRoot);
      if (!result) {
        totalFailed++;
        continue;
      }
      const { publicSrc, entry, built, skipped } = result;
      manifest[publicSrc] = entry;
      totalBuilt += built;
      totalSkipped += skipped;
      totalImages++;
    }
  }

  const manifestPath = join(ROOT, "lib", "image-manifest.json");
  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const ms = Date.now() - start;
  console.log(
    `[optimize-images] ${totalImages} source images · ${totalBuilt} variant(s) built · ${totalSkipped} up to date` +
      (totalFailed ? ` · ${totalFailed} skipped (see warnings above)` : "") +
      ` · ${ms}ms`,
  );
}

main().catch((err) => {
  console.error("[optimize-images] failed:", err);
  process.exitCode = 1;
});
