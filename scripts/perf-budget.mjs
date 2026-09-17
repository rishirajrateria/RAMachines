#!/usr/bin/env node
/**
 * scripts/perf-budget.mjs — ADR-0009 §6: a build-time guard rail. Runs after
 * `next build` (wired into `npm run postbuild`, alongside the content audit),
 * parses the static export under `out/`, prints a per-route table (HTML gz, JS
 * gz, app-only JS gz, CSS gz, referenced image bytes) and fails the build with
 * a clear message if any budget from ADR-0009 §"Targets" is broken:
 *
 *   - home page, modern-browser JS   > 130 KB gz
 *   - home page, app-only JS         >  15 KB gz
 *   - any single optimised image     > 120 KB   (raw bytes — already AVIF/WebP)
 *   - home page, first-view images   > 150 KB   (a 390px viewport)
 *
 * "Modern-browser JS" is every `<script src>` on the page that isn't marked
 * `nomodule` (a legacy-browser-only fallback bundle, if one exists, is never
 * fetched by a modern browser). "App-only JS" needs the shared Next/React
 * runtime chunks subtracted out — rather than guess at that from chunk
 * filenames (fragile: naming conventions change between Next versions/routers),
 * this treats whatever script src set is common to *every* route's `<script>`
 * tags as the shared runtime, and counts only what's left as app code. That's
 * exactly what the runtime actually is: the same handful of chunks referenced
 * by literally every page.
 *
 * "First-view images" are the page's `fetchpriority="high"` `<picture>`s (see
 * components/media/Img.tsx) — the ones a 390px-wide device fetches without any
 * scrolling — sized at their smallest AVIF (or, absent AVIF, WebP) variant,
 * which is what a narrow viewport's `sizes` actually resolves to.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "out");
const IMAGE_DIRS = ["photos", "products", "categories", "certs", "about"];

const BUDGETS = {
  homeModernJsGz: 130 * 1024,
  homeAppJsGz: 15 * 1024,
  singleImage: 120 * 1024,
  homeFirstViewImages: 150 * 1024,
};

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function walk(dir, test) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full, test)));
    else if (test(entry.name)) files.push(full);
  }
  return files;
}

function routeFor(htmlPath) {
  const rel = path.relative(OUT_DIR, htmlPath).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  const trimmed = rel.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "");
  return `/${trimmed}`;
}

function extractTags(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*\ssrc="([^"]+)"[^>]*>/gi)].map((m) => ({
    src: m[1],
    nomodule: /\snomodule(\s|=|>)/i.test(m[0]),
  }));
  const styles = [...html.matchAll(/<link\b[^>]*\srel="stylesheet"[^>]*\shref="([^"]+)"[^>]*>/gi)].map((m) => m[1]);
  const pictures = [...html.matchAll(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi)].map((m) => {
    const block = m[0];
    const img = block.match(/<img\b[^>]*>/i)?.[0] ?? "";
    const priority = /\sfetchpriority="high"/i.test(img);
    const avifSrcset = block.match(/<source\b[^>]*\stype="image\/avif"[^>]*\ssrcset="([^"]+)"/i)?.[1];
    const webpSrcset = block.match(/<source\b[^>]*\stype="image\/webp"[^>]*\ssrcset="([^"]+)"/i)?.[1];
    const fallbackSrc = img.match(/\ssrc="([^"]+)"/i)?.[1];
    return { priority, srcset: avifSrcset ?? webpSrcset, fallbackSrc };
  });
  return { scripts, styles, pictures };
}

function smallestFromSrcset(srcset) {
  if (!srcset) return null;
  const entries = srcset
    .split(",")
    .map((s) => {
      const [src, w] = s.trim().split(/\s+/);
      return { src, w: parseInt(w, 10) || Infinity };
    })
    .sort((a, b) => a.w - b.w);
  return entries[0]?.src ?? null;
}

function resolveOutPath(src) {
  if (!src) return null;
  const clean = src.split("?")[0].split("#")[0];
  return path.join(OUT_DIR, clean.replace(/^\//, ""));
}

const gzCache = new Map();
async function gzSize(filePath) {
  if (!filePath || !existsSync(filePath)) return 0;
  if (gzCache.has(filePath)) return gzCache.get(filePath);
  const buf = await readFile(filePath);
  const size = gzipSync(buf, { level: 9 }).length;
  gzCache.set(filePath, size);
  return size;
}

async function rawSize(filePath) {
  if (!filePath || !existsSync(filePath)) return 0;
  return (await stat(filePath)).size;
}

function printTable(rows) {
  const header = ["Route", "HTML gz", "JS gz", "App JS gz", "CSS gz", "Image bytes"];
  const data = rows.map((r) => [r.route, fmt(r.htmlGz), fmt(r.jsGz), fmt(r.appJsGz), fmt(r.cssGz), fmt(r.imageBytes)]);
  const widths = header.map((h, i) => Math.max(h.length, ...data.map((row) => row[i].length)));
  const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join("  ");
  console.log(line(header));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  for (const row of data) console.log(line(row));
}

async function main() {
  if (!existsSync(OUT_DIR)) {
    console.error("[perf-budget] out/ not found — run `next build` first.");
    process.exitCode = 1;
    return;
  }

  const htmlFiles = (await walk(OUT_DIR, (name) => name.endsWith(".html"))).sort();
  const failures = [];

  // Pass 1: parse every route's markup once.
  const parsed = htmlFiles.map((htmlPath) => ({ htmlPath, route: routeFor(htmlPath) }));
  const htmlByRoute = new Map();
  for (const { htmlPath, route } of parsed) {
    htmlByRoute.set(route, { html: await readFile(htmlPath, "utf8") });
  }
  for (const [route, entry] of htmlByRoute) {
    entry.tags = extractTags(entry.html);
    entry.modernSrcs = new Set(entry.tags.scripts.filter((s) => !s.nomodule).map((s) => s.src));
  }

  // The shared Next/React runtime = whatever script src set every single route
  // references — see file header. Falls back to "nothing shared" for a
  // one-route build (never true here, but keeps this from throwing).
  let sharedRuntime = null;
  for (const entry of htmlByRoute.values()) {
    sharedRuntime = sharedRuntime === null ? new Set(entry.modernSrcs) : intersect(sharedRuntime, entry.modernSrcs);
  }
  sharedRuntime ??= new Set();

  const rows = [];
  for (const [route, entry] of htmlByRoute) {
    const htmlGz = gzipSync(Buffer.from(entry.html), { level: 9 }).length;
    const { scripts, styles, pictures } = entry.tags;
    const modernScripts = scripts.filter((s) => !s.nomodule);

    let jsGz = 0;
    let appJsGz = 0;
    for (const s of modernScripts) {
      const size = await gzSize(resolveOutPath(s.src));
      jsGz += size;
      if (!sharedRuntime.has(s.src)) appJsGz += size;
    }

    let cssGz = 0;
    for (const href of styles) cssGz += await gzSize(resolveOutPath(href));

    let imageBytes = 0;
    let firstViewBytes = 0;
    for (const pic of pictures) {
      const src = smallestFromSrcset(pic.srcset) ?? pic.fallbackSrc;
      const bytes = await rawSize(resolveOutPath(src));
      imageBytes += bytes;
      if (pic.priority) firstViewBytes += bytes;
    }

    rows.push({ route, htmlGz, jsGz, appJsGz, cssGz, imageBytes, firstViewBytes });

    if (route === "/") {
      if (jsGz > BUDGETS.homeModernJsGz) {
        failures.push(`home modern-browser JS is ${fmt(jsGz)}, over the ${fmt(BUDGETS.homeModernJsGz)} budget`);
      }
      if (appJsGz > BUDGETS.homeAppJsGz) {
        failures.push(`home app-only JS is ${fmt(appJsGz)}, over the ${fmt(BUDGETS.homeAppJsGz)} budget`);
      }
      if (firstViewBytes > BUDGETS.homeFirstViewImages) {
        failures.push(
          `home first-view (390px) image bytes are ${fmt(firstViewBytes)}, over the ${fmt(BUDGETS.homeFirstViewImages)} budget`,
        );
      }
    }
  }
  rows.sort((a, b) => a.route.localeCompare(b.route));

  const imageFiles = (
    await Promise.all(IMAGE_DIRS.map((d) => walk(path.join(OUT_DIR, d), (name) => /\.(avif|webp|png|jpe?g)$/i.test(name))))
  ).flat();
  let largest = { file: "(none)", size: 0 };
  for (const file of imageFiles) {
    const size = await rawSize(file);
    const rel = path.relative(OUT_DIR, file);
    if (size > largest.size) largest = { file: rel, size };
    if (size > BUDGETS.singleImage) {
      failures.push(`${rel} is ${fmt(size)}, over the single-image ${fmt(BUDGETS.singleImage)} budget`);
    }
  }

  printTable(rows);
  console.log(`\n[perf-budget] largest single image: ${largest.file} — ${fmt(largest.size)}`);
  console.log(`[perf-budget] ${rows.length} routes · ${imageFiles.length} optimised image files checked.`);
  console.log(`[perf-budget] shared runtime scripts: ${sharedRuntime.size}`);

  if (failures.length > 0) {
    console.error("\n[perf-budget] FAILED — budget(s) exceeded:");
    for (const f of failures) console.error(`  ✗ ${f}`);
    process.exitCode = 1;
  } else {
    console.log("\n[perf-budget] all budgets OK.");
  }
}

function intersect(a, b) {
  const out = new Set();
  for (const v of a) if (b.has(v)) out.add(v);
  return out;
}

main().catch((err) => {
  console.error("[perf-budget] failed:", err);
  process.exitCode = 1;
});
