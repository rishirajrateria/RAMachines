#!/usr/bin/env node
/**
 * scripts/generate-placeholders.mjs — generates every placeholder binary asset the
 * site references (`node scripts/generate-placeholders.mjs`), so a static export
 * never 404s on an image/logo. Draws the ADR-0008 §1 solid-shaded machine renders
 * (scripts/illustrations/machines.mjs) on **transparent** backgrounds for the five
 * product-family cards — the card's own glass surface + a soft radial-teal CSS
 * backdrop (components/cards/CategoryCard.tsx) supplies the light behind them —
 * rasterises them with sharp at the existing filenames/sizes (WebP, alpha
 * preserved, kept small), and writes each SVG source under /public/illustrations
 * for reuse. Per-model product art and brochures were retired with the move to
 * five machine families. Regenerating is always safe (deterministic); drop a
 * same-named real photo into /public later and stop regenerating that one file
 * to replace it permanently.
 */
import { mkdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import { makeEmit, scene } from "./illustrations/common.mjs";
import { machineForCategory, placeToFit } from "./illustrations/machines.mjs";
import { heroPosterSvg } from "./illustrations/hero.mjs";
import { factoryHallSvg, indiaReachSvg, worldReachSvg } from "./illustrations/about.mjs";
import { certBadgeSvg } from "./illustrations/certs.mjs";
import { ogFallbackSvg } from "./illustrations/og.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const emit = makeEmit(PUBLIC);

// ---- Fixed slugs (must match data/categories.ts — the five machine families) ----
const CATEGORIES = [
  { slug: "fiber-laser-cutting-machines", name: "Fiber Laser Cutting Machines" },
  { slug: "cnc-plasma-cutting-machines", name: "CNC Plasma Cutting Machines" },
  { slug: "mig-tig-arc-welding-machines", name: "MIG / TIG / MMA Welding Machines" },
  { slug: "submerged-arc-welding-machines", name: "Submerged Arc Welding Machines" },
  { slug: "robotic-welding-systems", name: "Robotic & Cobot Welding Systems" },
];

const CERTS = [
  { slug: "iso-9001-2015", name: "ISO 9001:2015", issuer: "Quality Management System" },
  { slug: "ce-marking", name: "CE Marking", issuer: "European Conformity" },
  { slug: "gst-registered", name: "GST Registered", issuer: "Govt. of India" },
  { slug: "msme-udyam", name: "MSME / Udyam Registered", issuer: "Ministry of MSME" },
  { slug: "iec-import-export-code", name: "IEC Import Export Code", issuer: "DGFT, Govt. of India" },
  { slug: "indian-railways-vendor", name: "Indian Railways Vendor", issuer: "Approved Vendor" },
  { slug: "make-in-india", name: "Make in India", issuer: "DPIIT, Govt. of India" },
  { slug: "startup-india", name: "Startup India", issuer: "DPIIT Recognised" },
  { slug: "bis", name: "BIS", issuer: "Bureau of Indian Standards" },
];

// Render at 2× the target raster (ADR-0008 §1 "Method that works") — crisper
// edges/gradients than authoring straight at final size; emit() downsamples.
const SS = 2;

function categorySvg(category) {
  const machine = machineForCategory(category.slug);
  return scene({
    width: 1200 * SS,
    height: 800 * SS,
    // ~72% fill with generous headroom/margin around the machine.
    content: placeToFit(machine.svg, machine.bbox, 1200 * SS, 800 * SS, { fillRatio: 0.72, bottomMargin: 0.12 }),
    caption: category.name,
  });
}

async function main() {
  const written = [];

  for (const cert of CERTS) {
    written.push(await emit(`certs/${cert.slug}.webp`, certBadgeSvg(600, 800, cert.name, cert.issuer, cert.slug)));
  }

  for (const category of CATEGORIES) {
    const full = await emit(`categories/${category.slug}.webp`, categorySvg(category), { superSample: [1200, 800] });
    written.push(full);
    // `<slug>-1200.webp` mirrors the legacy 1200w WebP q72 variant that sits
    // beside every category source (same encode the older in-place
    // optimize-images pass produced), so nothing that still points at it 404s.
    const variant = full.replace(/\.webp$/, "-1200.webp");
    await sharp(full).resize({ width: 1200 }).webp({ quality: 72 }).toFile(variant);
    written.push(variant);
  }

  written.push(await emit("hero-poster.webp", heroPosterSvg(1920 * SS, 1080 * SS), { superSample: [1920, 1080] }));
  // q80: the current range's plasma table and welding set carry more detail than
  // the machines they replaced, and q90 put this one image over the 120 KB budget.
  written.push(await emit("about/factory.webp", factoryHallSvg(1600, 1000), { quality: 80 }));
  written.push(await emit("about/india-reach.webp", indiaReachSvg(1200, 750)));
  written.push(await emit("about/world-reach.webp", worldReachSvg(1200, 750)));
  written.push(await emit("og-fallback.png", ogFallbackSvg(1200, 630), { format: "png" }));

  // public/logo.svg and app/icon.svg are the real RA Machine mark now (redrawn as
  // a vector from the owner's logo, public/brand/ra-machine-mark.svg) — no longer
  // generated here, so regenerating art can never overwrite them.

  console.log(`Generated ${written.length} placeholder assets:`);
  let missing = 0;
  let totalBytes = 0;
  for (const path of written) {
    const ok = existsSync(path);
    if (!ok) {
      missing += 1;
      console.log(`  MISSING  ${path.replace(ROOT, ".")}`);
      continue;
    }
    const { size } = await stat(path);
    totalBytes += size;
    console.log(`  ok  ${(size / 1024).toFixed(1).padStart(7)} KB  ${path.replace(ROOT, ".")}`);
  }
  console.log(`Total: ${(totalBytes / 1024).toFixed(0)} KB across ${written.length} files.`);
  if (missing > 0) {
    console.error(`${missing} file(s) failed to write.`);
    process.exitCode = 1;
  } else {
    console.log("All placeholder assets confirmed on disk.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
