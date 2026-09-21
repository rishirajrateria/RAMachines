#!/usr/bin/env node
/**
 * scripts/dehydrate.mjs — ADR-0010: ship the static export as HTML.
 *
 * `next build` renders all 261 routes to final HTML, then attaches everything
 * React needs to rebuild that same HTML in the browser: the framework chunks
 * (~112 KB gz) and an inline RSC payload that is ~58% of each document. This
 * site's behaviour is public/enhance.js (~4 KB gz), so all of that is dead
 * weight. This step removes it.
 *
 * Per `out/**\/*.html`:
 *   - drop every `<script src="/_next/...">` (module, async, and the nomodule
 *     polyfill bundle)
 *   - drop every inline `self.__next_f.push(...)` RSC payload chunk
 *   - drop `<link rel="preload"/"prefetch" as="script" href="/_next/...">`
 *
 * Explicitly preserved: `<script type="application/ld+json">` (page content,
 * not runtime) and the inline ADR-0010 bootstrap from app/layout.tsx.
 *
 * Then the now-unreferenced build output is deleted: `out/_next/static/chunks`
 * and the per-route `.txt` RSC payloads.
 *
 * SAFETY: this only ever removes markup it can positively identify as Next.js
 * runtime. It verifies afterwards that no `/_next/*.js` reference survives and
 * that `/enhance.js` is present on every page, and fails the build otherwise —
 * a half-stripped page would be a broken page.
 *
 * To go back to a hydrated app, remove this from `postbuild`. Nothing else
 * depends on it.
 */
import { readdir, readFile, writeFile, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");

/** `<script src="/_next/...">` in any attribute order, including nomodule. */
const NEXT_SCRIPT_RE = /<script\b[^>]*\bsrc="\/_next\/[^"]*"[^>]*>\s*<\/script>/gi;
/**
 * The inline RSC payload. Next emits it in two shapes — the streaming chunks
 * (`<script>self.__next_f.push([1,"..."])</script>`) and a bootstrap that
 * initialises the array first (`(self.__next_f=self.__next_f||[]).push([0])`),
 * so match on the identifier appearing anywhere in the script body rather than
 * anchoring to the start.
 */
const RSC_PAYLOAD_RE = /<script>(?:(?!<\/script>)[\s\S])*?__next_f[\s\S]*?<\/script>/gi;
/** Preload/prefetch hints pointing at those same chunks. */
const NEXT_PRELOAD_RE = /<link\b[^>]*href="\/_next\/[^"]*\.js"[^>]*>/gi;

async function walk(dir, test) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, test)));
    else if (test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("[dehydrate] out/ not found — run `next build` first.");
    process.exitCode = 1;
    return;
  }

  const htmlFiles = await walk(OUT, (n) => n.endsWith(".html"));
  let beforeTotal = 0;
  let afterTotal = 0;
  const problems = [];

  for (const file of htmlFiles) {
    const original = await readFile(file, "utf8");
    beforeTotal += gzipSync(Buffer.from(original), { level: 9 }).length;

    const stripped = original
      .replace(NEXT_SCRIPT_RE, "")
      .replace(RSC_PAYLOAD_RE, "")
      .replace(NEXT_PRELOAD_RE, "");

    afterTotal += gzipSync(Buffer.from(stripped), { level: 9 }).length;

    const rel = path.relative(OUT, file);
    // Verify, per page, that we left it in a coherent state.
    if (/\/_next\/[^"]*\.js/.test(stripped)) problems.push(`${rel}: a /_next/*.js reference survived`);
    if (!stripped.includes('src="/enhance.js"')) problems.push(`${rel}: /enhance.js is missing`);
    if (!stripped.includes("application/ld+json") && !rel.startsWith("404")) {
      problems.push(`${rel}: JSON-LD was lost`);
    }

    await writeFile(file, stripped);
  }

  // The chunks nothing points at any more, plus the RSC route payloads the
  // App Router client would have fetched on navigation, plus the per-build
  // `_buildManifest.js`/`_ssgManifest.js` pair that only the stripped runtime
  // ever read. `out/_next/static/{css,media}` is deliberately KEPT — the
  // stylesheet and the font files are still referenced by every page.
  let reclaimed = 0;
  const staticDir = path.join(OUT, "_next", "static");
  const deadDirs = [path.join(staticDir, "chunks")];
  for (const entry of await readdir(staticDir, { withFileTypes: true }).catch(() => [])) {
    // The build-id directory: a random name, holding only those two manifests.
    if (entry.isDirectory() && !["chunks", "css", "media"].includes(entry.name)) {
      deadDirs.push(path.join(staticDir, entry.name));
    }
  }
  for (const dir of deadDirs) {
    if (!existsSync(dir)) continue;
    for (const f of await walk(dir, () => true)) reclaimed += (await stat(f)).size;
    await rm(dir, { recursive: true, force: true });
  }
  /*
   * The App Router's per-route RSC payloads are named `<route>.txt`, sitting
   * beside the `<route>.html` they belong to. An earlier version of this deleted
   * EVERY .txt under out/, which also destroyed robots.txt, llms.txt and
   * llms-full.txt — real, published content, and in robots.txt's case the file
   * that points crawlers at the sitemaps.
   *
   * So a .txt is only removed when the matching HTML page exists next to it.
   * That is exactly the set Next generates, and nothing else can collide with
   * it: none of the real .txt files has an .html of the same name.
   */
  for (const file of await walk(OUT, (n) => n.endsWith(".txt"))) {
    const base = file.slice(0, -".txt".length);
    const isRoutePayload = existsSync(`${base}.html`) || existsSync(path.join(base, "index.html"));
    if (!isRoutePayload) continue;
    reclaimed += (await stat(file)).size;
    await rm(file, { force: true });
  }

  // These are published files, not build artefacts. If a future change to the
  // rules above starts eating them again, fail the build rather than quietly
  // shipping a site with no robots.txt.
  for (const required of ["robots.txt", "llms.txt", "llms-full.txt", "sitemap.xml"]) {
    if (!existsSync(path.join(OUT, required))) problems.push(`${required} is missing from the export`);
  }

  const pages = htmlFiles.length;
  console.log(
    `[dehydrate] ${pages} pages · HTML ${(beforeTotal / pages / 1024).toFixed(1)} KB → ` +
      `${(afterTotal / pages / 1024).toFixed(1)} KB gz avg · ` +
      `${(reclaimed / 1024 / 1024).toFixed(1)} MB of chunks and RSC payloads removed`,
  );

  if (problems.length) {
    console.error("\n[dehydrate] FAILED — output left in an inconsistent state:");
    for (const p of problems.slice(0, 20)) console.error(`  ✗ ${p}`);
    if (problems.length > 20) console.error(`  … and ${problems.length - 20} more`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("[dehydrate] failed:", err);
  process.exitCode = 1;
});
