#!/usr/bin/env node
/**
 * scripts/generate-placeholders.mjs — generates every placeholder binary asset the
 * site references (`node scripts/generate-placeholders.mjs`), so a static export
 * never 404s on an image/brochure/logo. ADR-0004: draws richer stylised flat SVG
 * illustrations (ink / teal + light teal / spark + light spark / light grey /
 * white on tinted backgrounds) instead of grey boxes — see scripts/illustrations/*
 * for the drawing code — rasterises them with sharp at the existing filenames/sizes
 * (WebP q82, kept small), and writes each SVG source under /public/illustrations
 * for reuse. Regenerating is always safe (deterministic); drop a same-named real
 * photo into /public later and stop regenerating that one file to replace it
 * permanently.
 */
import { mkdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { makeEmit, scene, STEEL_SOFT, SPARK_SOFT } from "./illustrations/common.mjs";
import {
  machineForProduct, machineForCategory, categoryForeground, withOverlay, placeInScene, BOX_W, BOX_H,
} from "./illustrations/machines.mjs";
import { heroPosterSvg } from "./illustrations/hero.mjs";
import { factoryHallSvg, indiaReachSvg, worldReachSvg } from "./illustrations/about.mjs";
import { certBadgeSvg } from "./illustrations/certs.mjs";
import { ogFallbackSvg } from "./illustrations/og.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const emit = makeEmit(PUBLIC);

// ---- Fixed slugs (must match data/*.ts and the product/category catalogue) ----
const PRODUCTS = [
  { slug: "ra-f1530", name: "RA-F1530 Fiber Laser Cutting Machine", category: "fiber" },
  { slug: "ra-f3015-pro", name: "RA-F3015 Pro Fiber Laser Cutting Machine", category: "fiber" },
  { slug: "ra-f6020-hd", name: "RA-F6020 HD Fiber Laser Cutting Machine", category: "fiber" },
  { slug: "ra-f12k", name: "RA-F12K Heavy Duty Fiber Laser Cutting Machine", category: "fiber" },
  { slug: "ra-t6000", name: "RA-T6000 Fiber Laser Tube Cutting Machine", category: "tube" },
  { slug: "ra-c1390", name: "RA-C1390 CO2 Laser Cutting & Engraving Machine", category: "co2" },
  { slug: "ra-rw6", name: "RA-RW6 Robotic MIG Welding Cell", category: "robot" },
  { slug: "ra-rw10", name: "RA-RW10 Robotic MIG/MAG Welding Workstation", category: "robot" },
];

const CATEGORIES = [
  { slug: "fiber-laser-cutting-machines", name: "Fiber Laser Cutting Machines", category: "fiber" },
  { slug: "tube-laser-cutting-machines", name: "Tube Laser Cutting Machines", category: "tube" },
  { slug: "co2-laser-machines", name: "CO2 Laser Machines", category: "co2" },
  { slug: "robotic-welding-systems", name: "Robotic Welding Systems", category: "robot" },
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

/** front / detail (cropped, zoomed-in) / in-use (spark burst + chips + operator)
 * angles for one product, composed into a 1200×900 scene. */
function productAngleSvg(product, angle, bgIndex) {
  const machine = machineForProduct(product.slug);
  let placed;
  if (angle === "detail") {
    const [vx, vy, vw, vh] = machine.detailCrop;
    const cropped = `<svg x="0" y="0" width="${BOX_W}" height="${BOX_H}" viewBox="${vx} ${vy} ${vw} ${vh}" preserveAspectRatio="xMidYMid slice">${machine.svg}</svg>`;
    placed = `<g transform="translate(96 162) scale(1.8)">${cropped}</g>`;
  } else {
    const content = withOverlay(machine, {
      withSpark: angle === "in-use",
      withChips: angle === "in-use",
      withOperator: angle === "in-use",
    });
    placed = placeInScene(content, 1200, 900, { scale: 2.0 });
  }
  return scene({
    width: 1200,
    height: 900,
    bg: bgIndex % 2 === 0 ? STEEL_SOFT : SPARK_SOFT,
    content: placed,
    caption: `${product.name} — ${angle === "front" ? "front view" : angle === "detail" ? "detail view" : "in use"}`,
  });
}

function categorySvg(category, bgIndex) {
  const machine = machineForCategory(category.category);
  const content = `${machine.svg}${categoryForeground(category.category)}`;
  return scene({
    width: 1200,
    height: 800,
    bg: bgIndex % 2 === 0 ? STEEL_SOFT : SPARK_SOFT,
    content: placeInScene(content, 1200, 800, { scale: 1.75, groundRatio: 0.84 }),
    caption: category.name,
  });
}

/** Hand-written minimal single-page PDF (no library) with the product name on it. */
function buildPlaceholderPdf(title) {
  const safeTitle = title.replace(/[()\\]/g, "");
  const streamContent = [
    "BT /F1 22 Tf 72 700 Td (RA Machine) Tj ET",
    `BT /F1 16 Tf 72 668 Td (${safeTitle}) Tj ET`,
    "BT /F1 11 Tf 72 630 Td (Placeholder brochure. Replace with the final PDF before launch.) Tj ET",
    "BT /F1 11 Tf 72 612 Td (Specifications, applications and certification details will appear here.) Tj ET",
  ].join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n",
    `4 0 obj\n<< /Length ${Buffer.byteLength(streamContent, "latin1")} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += obj;
  }
  const xrefStart = Buffer.byteLength(pdf, "latin1");
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  pdf += xref;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

async function main() {
  const written = [];

  for (const cert of CERTS) {
    written.push(await emit(`certs/${cert.slug}.webp`, certBadgeSvg(600, 800, cert.name, cert.issuer, cert.slug, CERTS.indexOf(cert))));
  }

  for (const product of PRODUCTS) {
    const angles = [
      ["1", "front"],
      ["2", "detail"],
      ["3", "in-use"],
    ];
    for (const [index, angle] of angles) {
      const svg = productAngleSvg(product, angle, PRODUCTS.indexOf(product));
      written.push(await emit(`products/${product.slug}-${index}.webp`, svg));
    }
  }

  for (const category of CATEGORIES) {
    written.push(await emit(`categories/${category.slug}.webp`, categorySvg(category, CATEGORIES.indexOf(category))));
  }

  written.push(await emit("hero-poster.webp", heroPosterSvg(1920, 1080)));
  written.push(await emit("about/factory.webp", factoryHallSvg(1600, 1000)));
  written.push(await emit("about/india-reach.webp", indiaReachSvg(1200, 750)));
  written.push(await emit("about/world-reach.webp", worldReachSvg(1200, 750)));
  written.push(await emit("og-fallback.png", ogFallbackSvg(1200, 630), { format: "png" }));

  // Brochures — one-page placeholder PDFs
  for (const product of PRODUCTS) {
    const path = join(PUBLIC, "brochures", `${product.slug}.pdf`);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, buildPlaceholderPdf(product.name));
    written.push(path);
  }

  // Logo (public, used in Organization schema `logo`) and favicon mark
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" width="240" height="48"><rect x="0" y="20" width="10" height="10" rx="2" fill="#F26A21"/><text x="16" y="32" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#0F1A1A">RA Machine</text></svg>`;
  const logoPath = join(PUBLIC, "logo.svg");
  await mkdir(dirname(logoPath), { recursive: true });
  await writeFile(logoPath, logoSvg);
  written.push(logoPath);

  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="7" fill="#0F1A1A"/><rect x="6" y="15" width="20" height="2" fill="#FFFFFF"/><rect x="6" y="9" width="12" height="2" fill="#0F766E"/><rect x="6" y="21" width="10" height="2" fill="#F26A21"/></svg>`;
  const iconPath = join(ROOT, "app", "icon.svg");
  await writeFile(iconPath, iconSvg);
  written.push(iconPath);

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
