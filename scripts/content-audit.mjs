#!/usr/bin/env node
/**
 * scripts/content-audit.mjs — post-build content QA pass (plain Node, no TypeScript).
 *
 * Walks every static HTML page produced by `next build` (output: "export") under
 * out/**\/*.html and, for each page, extracts <title>, the single <h1> (flagging 0
 * or >1), the meta description length, and a word count of visible text inside
 * <main> (script/style/nav/header/footer stripped, tags removed, whitespace
 * collapsed). Writes content-audit.md at the repo root with a summary — page count
 * by section, min/median/max words per section, duplicate titles, duplicate H1s,
 * thin pages below the ADR §5 thresholds, pages with noindex — followed by a
 * `| URL | Title | H1 | Words |` table for every page.
 *
 * Thresholds below mirror docs/adr/0001-stack-and-ownership.md §5. `max` is
 * informational only (over-length is not reported as "thin").
 *
 * Always exits 0. Problems are printed as `WARN ...` lines on stdout.
 * Run via `npm run postbuild` (after `next build`) or `npm run audit:content`.
 */

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "out");
const REPORT_PATH = path.join(ROOT, "content-audit.md");

const THRESHOLDS = {
  home: { min: 900 },
  "products-index": {},
  category: { min: 600, max: 900 },
  product: { min: 700 },
  repair: { min: 1500 },
  training: { min: 650 }, // ADR: "≈ 700"
  "job-work": { min: 450 }, // ADR: "≈ 500" — noindex, excluded from sitemap
  about: { min: 700 },
  contact: { min: 300 },
  certifications: { min: 600 },
  "india-state": { min: 900, max: 1200 },
  "india-city": { min: 700, max: 900 },
  "export-hub": { min: 800 },
  "export-country": { min: 1200, max: 1600 },
  legal: {},
  other: {},
};

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function fileToUrl(file) {
  let rel = path.relative(OUT_DIR, file).split(path.sep).join("/");
  if (rel === "index.html") {
    rel = "";
  } else if (rel.endsWith("/index.html")) {
    rel = rel.slice(0, -"/index.html".length);
  } else if (rel.endsWith(".html")) {
    rel = rel.slice(0, -".html".length);
  }
  return rel ? `/${rel}` : "/";
}

function classify(url) {
  if (url === "/") return "home";
  if (url === "/products") return "products-index";
  if (url === "/services/machine-repair") return "repair";
  if (url === "/services/operator-training") return "training";
  if (url === "/services/laser-cutting-job-work") return "job-work";
  if (url === "/about") return "about";
  if (url === "/contact") return "contact";
  if (url === "/certifications") return "certifications";
  if (url === "/export") return "export-hub";
  if (url === "/privacy-policy" || url === "/terms") return "legal";
  const segs = url.split("/").filter(Boolean);
  if (segs[0] === "products" && segs.length === 2) return "category";
  if (segs[0] === "products" && segs.length === 3) return "product";
  if (segs[0] === "india" && segs.length === 2) return "india-state";
  if (segs[0] === "india" && segs.length === 3) return "india-city";
  if (segs[0] === "export" && segs.length === 2) return "export-country";
  return "other";
}

function decodeEntities(s) {
  // Numeric entities (e.g. &#x27; &#39;) must be decoded before lengths are measured.
  s = String(s)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#x2019;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function removeBlocks(html, tags) {
  let out = html;
  for (const tag of tags) {
    out = out.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"), " ");
  }
  return out;
}

function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1]).trim() : "";
}

function extractH1s(html) {
  const matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  return matches.map((m) => stripTags(m[1]));
}

function extractMetaContent(html, name) {
  const tagMatch = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]*>`, "i"));
  if (!tagMatch) return null;
  const contentMatch = tagMatch[0].match(/content=["']([\s\S]*?)["']/i);
  return contentMatch ? decodeEntities(contentMatch[1]) : null;
}

function extractMainWordCount(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return { words: 0, hasMain: false };
  const cleaned = removeBlocks(m[1], ["script", "style", "nav", "header", "footer"]);
  const text = stripTags(cleaned);
  const words = text ? text.split(" ").filter(Boolean).length : 0;
  return { words, hasMain: true };
}

function median(nums) {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function addTo(map, key, value) {
  const list = map.get(key) ?? [];
  list.push(value);
  map.set(key, list);
}

function h1Cell(h1s) {
  if (h1s.length === 0) return "MISSING";
  if (h1s.length > 1) return `MULTIPLE(${h1s.length})`;
  return h1s[0];
}

function mdEscape(s) {
  return (s ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

async function collectPages() {
  const files = await walk(OUT_DIR);
  const pages = [];
  for (const file of files.sort()) {
    const html = await readFile(file, "utf8");
    const url = fileToUrl(file);
    if (url === "/404" || url === "/_not-found") continue; // build artefact, not a real page
    const section = classify(url);
    const title = extractTitle(html);
    const h1s = extractH1s(html);
    const description = extractMetaContent(html, "description");
    const robotsMeta = extractMetaContent(html, "robots");
    const noindex = robotsMeta ? /noindex/i.test(robotsMeta) : false;
    const { words, hasMain } = extractMainWordCount(html);
    if (!hasMain) console.warn(`WARN content-audit: ${url} has no <main> element`);
    if (h1s.length === 0) console.warn(`WARN content-audit: ${url} has no <h1>`);
    if (h1s.length > 1) console.warn(`WARN content-audit: ${url} has ${h1s.length} <h1> elements`);
    if (!description) console.warn(`WARN content-audit: ${url} has no meta description`);
    else if (description.length > 155) {
      console.warn(`WARN content-audit: ${url} meta description is ${description.length} chars (> 155)`);
    }
    pages.push({ url, section, title, h1s, description, noindex, words });
  }
  return pages;
}

function buildSummary(pages) {
  const bySection = new Map();
  for (const p of pages) addTo(bySection, p.section, p);

  const titleMap = new Map();
  const h1Map = new Map();
  for (const p of pages) {
    if (p.title) addTo(titleMap, p.title, p.url);
    if (p.h1s.length === 1) addTo(h1Map, p.h1s[0], p.url);
  }
  const duplicateTitles = [...titleMap.entries()].filter(([, urls]) => urls.length > 1);
  const duplicateH1s = [...h1Map.entries()].filter(([, urls]) => urls.length > 1);

  const thinPages = [];
  for (const p of pages) {
    const threshold = THRESHOLDS[p.section] ?? {};
    if (threshold.min && p.words < threshold.min) {
      thinPages.push({ ...p, min: threshold.min });
      console.warn(`WARN content-audit: ${p.url} is thin — ${p.words} words, below ${threshold.min} (${p.section})`);
    }
  }

  const noindexPages = pages.filter((p) => p.noindex);

  for (const [title, urls] of duplicateTitles) {
    console.warn(`WARN content-audit: duplicate title "${title}" on ${urls.join(", ")}`);
  }
  for (const [h1, urls] of duplicateH1s) {
    console.warn(`WARN content-audit: duplicate H1 "${h1}" on ${urls.join(", ")}`);
  }

  return { bySection, duplicateTitles, duplicateH1s, thinPages, noindexPages };
}

function renderReport(pages, summary) {
  const { bySection, duplicateTitles, duplicateH1s, thinPages, noindexPages } = summary;
  const lines = [];

  lines.push("# Content audit", "");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Total pages: ${pages.length}`, "");

  lines.push("## Summary by section", "");
  lines.push("| Section | Pages | Min words | Median words | Max words |");
  lines.push("|---|---|---|---|---|");
  for (const [section, sectionPages] of [...bySection.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const words = sectionPages.map((p) => p.words);
    lines.push(
      `| ${section} | ${sectionPages.length} | ${Math.min(...words)} | ${median(words)} | ${Math.max(...words)} |`,
    );
  }
  lines.push("");

  lines.push("## Issues", "");
  lines.push(
    duplicateTitles.length
      ? `- **Duplicate titles (${duplicateTitles.length}):** ${duplicateTitles.map(([t, u]) => `"${t}" — ${u.join(", ")}`).join("; ")}`
      : "- Duplicate titles: none",
  );
  lines.push(
    duplicateH1s.length
      ? `- **Duplicate H1s (${duplicateH1s.length}):** ${duplicateH1s.map(([h, u]) => `"${h}" — ${u.join(", ")}`).join("; ")}`
      : "- Duplicate H1s: none",
  );
  const badH1Pages = pages.filter((p) => p.h1s.length !== 1);
  lines.push(
    badH1Pages.length
      ? `- **Pages with 0 or multiple H1s (${badH1Pages.length}):** ${badH1Pages.map((p) => `${p.url} (${p.h1s.length})`).join(", ")}`
      : "- Pages with 0 or multiple H1s: none",
  );
  lines.push(
    thinPages.length
      ? `- **Thin pages below ADR §5 threshold (${thinPages.length}):** ${thinPages.map((p) => `${p.url} (${p.words}/${p.min})`).join(", ")}`
      : "- Thin pages below ADR §5 threshold: none",
  );
  lines.push(
    noindexPages.length
      ? `- **Pages with noindex (${noindexPages.length}):** ${noindexPages.map((p) => p.url).join(", ")}`
      : "- Pages with noindex: none",
  );
  lines.push("");

  lines.push("## All pages", "");
  lines.push("| URL | Title | H1 | Words |");
  lines.push("|---|---|---|---|");
  for (const p of pages) {
    lines.push(`| ${mdEscape(p.url)} | ${mdEscape(p.title)} | ${mdEscape(h1Cell(p.h1s))} | ${p.words} |`);
  }
  lines.push("");

  return lines.join("\n");
}

async function main() {
  try {
    await stat(OUT_DIR);
  } catch {
    console.warn(`WARN content-audit: out/ directory not found at ${OUT_DIR} — run "next build" first. Skipping.`);
    await writeFile(
      REPORT_PATH,
      "# Content audit\n\nWARN: out/ directory not found. Run `next build` before this script.\n",
      "utf8",
    );
    return;
  }

  const pages = await collectPages();
  const summary = buildSummary(pages);
  const report = renderReport(pages, summary);
  await writeFile(REPORT_PATH, report, "utf8");
  console.log(`content-audit: wrote ${REPORT_PATH} (${pages.length} pages)`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.warn(`WARN content-audit: unexpected error — ${err instanceof Error ? err.stack : String(err)}`);
    process.exit(0);
  });
