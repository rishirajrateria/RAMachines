#!/usr/bin/env node
/**
 * scripts/generate-placeholders.mjs
 *
 * Generates every placeholder binary asset the site references so `next build`
 * (output: 'export') never 404s on an image, brochure or logo. Run with:
 *   node scripts/generate-placeholders.mjs
 *
 * Regenerating is always safe (everything here is overwritten deterministically).
 * To replace a placeholder with a real asset later, just drop a same-named file
 * in the matching /public path — this script will not overwrite anything you did
 * not ask it to regenerate, as long as you stop running it for that file.
 *
 * Outputs:
 *  - /public/certs/<slug>.webp            600×800   grey, cert name overlay
 *  - /public/products/<slug>-1|2|3.webp   1200×900  grey, product name overlay
 *  - /public/categories/<slug>.webp       1200×800  grey, category name overlay
 *  - /public/hero-poster.webp             1920×1080 dark, faint "RA Machine"
 *  - /public/about/factory.webp           1600×1000 grey, factory caption
 *  - /public/og-fallback.png              1200×630  white, brand mark
 *  - /public/brochures/<slug>.pdf         one-page hand-written placeholder PDF
 *  - /public/logo.svg                     text logo
 *  - app/icon.svg                         favicon mark
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");

// ---- Fixed slugs (must match data/*.ts and the product/category catalogue) ----
const PRODUCTS = [
  { slug: "ra-f1530", name: "RA-F1530 Fiber Laser Cutting Machine" },
  { slug: "ra-f3015-pro", name: "RA-F3015 Pro Fiber Laser Cutting Machine" },
  { slug: "ra-f6020-hd", name: "RA-F6020 HD Fiber Laser Cutting Machine" },
  { slug: "ra-f12k", name: "RA-F12K Heavy Duty Fiber Laser Cutting Machine" },
  { slug: "ra-t6000", name: "RA-T6000 Fiber Laser Tube Cutting Machine" },
  { slug: "ra-c1390", name: "RA-C1390 CO2 Laser Cutting & Engraving Machine" },
  { slug: "ra-rw6", name: "RA-RW6 Robotic MIG Welding Cell" },
  { slug: "ra-rw10", name: "RA-RW10 Robotic MIG/MAG Welding Workstation" },
];

const CATEGORIES = [
  { slug: "fiber-laser-cutting-machines", name: "Fiber Laser Cutting Machines" },
  { slug: "tube-laser-cutting-machines", name: "Tube Laser Cutting Machines" },
  { slug: "co2-laser-machines", name: "CO2 Laser Machines" },
  { slug: "robotic-welding-systems", name: "Robotic Welding Systems" },
];

const CERTS = [
  { slug: "iso-9001-2015", name: "ISO 9001:2015" },
  { slug: "ce-marking", name: "CE Marking" },
  { slug: "gst-registered", name: "GST Registered" },
  { slug: "msme-udyam", name: "MSME / Udyam Registered" },
  { slug: "iec-import-export-code", name: "IEC Import Export Code" },
  { slug: "indian-railways-vendor", name: "Indian Railways Vendor" },
  { slug: "make-in-india", name: "Make in India" },
  { slug: "startup-india", name: "Startup India" },
  { slug: "bis", name: "BIS" },
];

const GREY_BG = "#E1E2E5";
const GREY_FG = "#44474E";
const DARK_BG = "#1B1C1F";

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Wraps `text` into lines of roughly `maxChars` characters. */
function wrapLines(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Builds an SVG placeholder: solid background + centred, word-wrapped label — used as
 * the source raster for every generated WebP image (sharp rasterises SVG natively).
 */
function placeholderSvg({ width, height, bg, fg, label, sub, fontSize = 40 }) {
  const lines = wrapLines(label, Math.round(width / (fontSize * 0.58)));
  const lineHeight = fontSize * 1.25;
  const blockHeight = lines.length * lineHeight + (sub ? lineHeight : 0);
  const startY = height / 2 - blockHeight / 2 + fontSize;

  const titleSpans = lines
    .map(
      (line, i) =>
        `<text x="50%" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="600" fill="${fg}">${escapeXml(
          line,
        )}</text>`,
    )
    .join("");

  const subEl = sub
    ? `<text x="50%" y="${startY + lines.length * lineHeight}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(
        fontSize * 0.45,
      )}" fill="${fg}" opacity="0.75">${escapeXml(sub)}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}" />
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="${fg}" stroke-opacity="0.15" />
  ${titleSpans}
  ${subEl}
</svg>`;
}

async function writeWebp(path, svg) {
  await mkdir(dirname(path), { recursive: true });
  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(path);
}

async function writePng(path, svg) {
  await mkdir(dirname(path), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(path);
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
  for (const offset of offsets) {
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += xref;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}

async function main() {
  const written = [];

  // Certifications — 600×800
  for (const cert of CERTS) {
    const path = join(PUBLIC, "certs", `${cert.slug}.webp`);
    await writeWebp(
      path,
      placeholderSvg({ width: 600, height: 800, bg: GREY_BG, fg: GREY_FG, label: cert.name, sub: "Certificate placeholder", fontSize: 34 }),
    );
    written.push(path);
  }

  // Products — 1200×900, three angles each
  for (const product of PRODUCTS) {
    for (const view of ["Front view", "Side view", "Detail view"]) {
      const index = view === "Front view" ? 1 : view === "Side view" ? 2 : 3;
      const path = join(PUBLIC, "products", `${product.slug}-${index}.webp`);
      await writeWebp(
        path,
        placeholderSvg({ width: 1200, height: 900, bg: GREY_BG, fg: GREY_FG, label: product.name, sub: view, fontSize: 46 }),
      );
      written.push(path);
    }
  }

  // Categories — 1200×800
  for (const category of CATEGORIES) {
    const path = join(PUBLIC, "categories", `${category.slug}.webp`);
    await writeWebp(
      path,
      placeholderSvg({ width: 1200, height: 800, bg: GREY_BG, fg: GREY_FG, label: category.name, sub: "Category placeholder", fontSize: 46 }),
    );
    written.push(path);
  }

  // Hero poster — 1920×1080, dark
  {
    const path = join(PUBLIC, "hero-poster.webp");
    await writeWebp(
      path,
      placeholderSvg({ width: 1920, height: 1080, bg: DARK_BG, fg: "#F7F7F8", label: "RA Machine", sub: "Hero video poster placeholder", fontSize: 72 }),
    );
    written.push(path);
  }

  // About / factory — 1600×1000
  {
    const path = join(PUBLIC, "about", "factory.webp");
    await writeWebp(
      path,
      placeholderSvg({ width: 1600, height: 1000, bg: GREY_BG, fg: GREY_FG, label: "RA Machine Manufacturing Facility", sub: "Kolkata, India — placeholder photo", fontSize: 46 }),
    );
    written.push(path);
  }

  // OG fallback — 1200×630, white with brand mark
  {
    const path = join(PUBLIC, "og-fallback.png");
    await writePng(
      path,
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <rect width="1200" height="630" fill="#ffffff" />
        <rect x="80" y="80" width="64" height="3" fill="#1F4E79" />
        <text x="80" y="340" font-family="Arial, sans-serif" font-size="76" font-weight="700" fill="#111214">RA Machine</text>
        <text x="80" y="390" font-family="Arial, sans-serif" font-size="26" fill="#5B5F68">Laser Cutting Machines Built in India, Trusted Worldwide</text>
        <text x="80" y="560" font-family="Arial, sans-serif" font-size="22" fill="#7A7E87">ramachine.com · Kolkata, India · Exporting worldwide</text>
      </svg>`,
    );
    written.push(path);
  }

  // Brochures — one-page placeholder PDFs
  for (const product of PRODUCTS) {
    const path = join(PUBLIC, "brochures", `${product.slug}.pdf`);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, buildPlaceholderPdf(product.name));
    written.push(path);
  }

  // Logo (public, used in Organization schema `logo`) and favicon mark
  {
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" width="240" height="48">
  <rect width="240" height="48" fill="none" />
  <text x="0" y="32" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#111214">RA Machine</text>
</svg>
`;
    const logoPath = join(PUBLIC, "logo.svg");
    await mkdir(dirname(logoPath), { recursive: true });
    await writeFile(logoPath, logoSvg);
    written.push(logoPath);

    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="4" fill="#111214" />
  <rect x="6" y="15" width="20" height="2" fill="#ffffff" />
  <rect x="6" y="9" width="12" height="2" fill="#1F4E79" />
  <rect x="6" y="21" width="12" height="2" fill="#1F4E79" />
</svg>
`;
    const iconPath = join(ROOT, "app", "icon.svg");
    await writeFile(iconPath, iconSvg);
    written.push(iconPath);
  }

  console.log(`Generated ${written.length} placeholder assets:`);
  let missing = 0;
  for (const path of written) {
    const ok = existsSync(path);
    if (!ok) missing += 1;
    console.log(`  ${ok ? "ok" : "MISSING"}  ${path.replace(ROOT, ".")}`);
  }
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
