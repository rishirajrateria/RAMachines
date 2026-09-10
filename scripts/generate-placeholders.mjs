#!/usr/bin/env node
/**
 * scripts/generate-placeholders.mjs — generates every placeholder binary asset the
 * site references (`node scripts/generate-placeholders.mjs`), so a static export
 * never 404s on an image/brochure/logo. ADR-0002: draws stylised flat SVG
 * illustrations (2–3 colours — ink/steel/spark — on a tinted background) instead of
 * grey boxes, rasterises them with sharp at the existing filenames/sizes (WebP q82,
 * kept small), and writes each SVG source under /public/illustrations for reuse.
 * Regenerating is always safe (deterministic); drop a same-named real photo into
 * /public later and stop regenerating that one file to replace it permanently.
 */
import { mkdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");

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

// ---- Palette (mirrors tailwind.config.ts) ----
const INK = "#111214";
const STEEL = "#1F4E79";
const STEEL_SOFT = "#E8EEF5";
const SPARK = "#F26A21";
const SPARK_SOFT = "#FFF1EA";
const WHITE = "#FFFFFF";

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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

/** Radiating spark-burst accent used on "in-use" and hero illustrations. */
function sparkBurst(cx, cy, r = 26, color = SPARK) {
  let rays = "";
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    const x1 = cx + Math.cos(a) * r * 0.42;
    const y1 = cy + Math.sin(a) * r * 0.42;
    const x2 = cx + Math.cos(a) * r;
    const y2 = cy + Math.sin(a) * r;
    rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
  }
  return `<g>${rays}<circle cx="${cx}" cy="${cy}" r="${(r * 0.22).toFixed(1)}" fill="${color}"/></g>`;
}

/** A small standing operator silhouette, for scale in "in-use" illustrations. */
function operator(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${INK}" opacity="0.82">
    <circle cx="10" cy="8" r="8"/>
    <path d="M0 60 Q0 26 10 26 Q20 26 20 60 Z"/>
    <rect x="4" y="58" width="5" height="16" rx="2"/>
    <rect x="11" y="58" width="5" height="16" rx="2"/>
  </g>`;
}

function gridLines(width, height, step, color, opacity) {
  let l = "";
  for (let x = 0; x <= width; x += step) l += `<line x1="${x}" y1="0" x2="${x}" y2="${height}"/>`;
  for (let y = 0; y <= height; y += step) l += `<line x1="0" y1="${y}" x2="${width}" y2="${y}"/>`;
  return `<g stroke="${color}" stroke-width="1" opacity="${opacity}">${l}</g>`;
}

function captionText(width, height, text) {
  return `<text x="24" y="${height - 22}" font-family="Arial, sans-serif" font-size="${Math.round(
    width * 0.017,
  )}" font-weight="600" fill="${INK}" opacity="0.5">${escapeXml(text)}</text>`;
}

function scene({ width, height, bg, content, caption }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}"/>
  ${content}
  ${caption ? captionText(width, height, caption) : ""}
</svg>`;
}

// ---- Machine silhouettes — flat, 2–3 colour, drawn in a shared 440×280 local box ----
const MACHINES = {
  fiber: {
    sparkPoint: [164, 135],
    crop: [90, 10, 220, 220],
    // base rail + legs, bed with dashed sheet, gantry posts + beam, head, beam-to-sheet
    front: `<rect x="20" y="200" width="400" height="16" rx="4" fill="${INK}"/><rect x="50" y="216" width="16" height="46" fill="${INK}"/><rect x="374" y="216" width="16" height="46" fill="${INK}"/><rect x="40" y="150" width="360" height="46" rx="4" fill="${STEEL}"/><rect x="60" y="160" width="200" height="26" rx="2" fill="${WHITE}" stroke="${INK}" stroke-width="2" stroke-dasharray="6 5"/><rect x="30" y="30" width="380" height="20" rx="4" fill="${STEEL}"/><rect x="30" y="40" width="18" height="150" rx="4" fill="${INK}"/><rect x="392" y="40" width="18" height="150" rx="4" fill="${INK}"/><rect x="150" y="50" width="28" height="60" rx="3" fill="${INK}"/><line x1="164" y1="110" x2="164" y2="160" stroke="${SPARK}" stroke-width="3" stroke-dasharray="3 4"/>`,
  },
  tube: {
    sparkPoint: [279, 150],
    crop: [10, 60, 250, 200],
    // base + legs, rotary chuck, tube bed, head over chuck, beam
    front: `<rect x="20" y="210" width="400" height="14" rx="4" fill="${INK}"/><rect x="60" y="222" width="14" height="38" fill="${INK}"/><rect x="366" y="222" width="14" height="38" fill="${INK}"/><circle cx="70" cy="150" r="46" fill="${STEEL}"/><circle cx="70" cy="150" r="46" fill="none" stroke="${INK}" stroke-width="3"/><line x1="70" y1="104" x2="70" y2="196" stroke="${INK}" stroke-width="2" opacity="0.5"/><line x1="24" y1="150" x2="116" y2="150" stroke="${INK}" stroke-width="2" opacity="0.5"/><rect x="110" y="140" width="260" height="20" rx="10" fill="${WHITE}" stroke="${INK}" stroke-width="2"/><rect x="250" y="50" width="60" height="16" rx="4" fill="${STEEL}"/><rect x="270" y="60" width="18" height="90" rx="4" fill="${INK}"/><line x1="279" y1="150" x2="279" y2="130" stroke="${SPARK}" stroke-width="3" stroke-dasharray="3 4"/>`,
  },
  co2: {
    sparkPoint: [200, 145],
    crop: [90, 40, 260, 200],
    // enclosure, viewing window, cut grid, base + feet, exhaust vent
    front: `<rect x="60" y="70" width="300" height="150" rx="10" fill="${STEEL}"/><rect x="90" y="100" width="240" height="90" rx="6" fill="${WHITE}" stroke="${INK}" stroke-width="2"/><rect x="105" y="112" width="210" height="66" fill="${STEEL_SOFT}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="60" y="220" width="300" height="16" rx="4" fill="${INK}"/><rect x="90" y="236" width="16" height="30" fill="${INK}"/><rect x="314" y="236" width="16" height="30" fill="${INK}"/><rect x="345" y="80" width="10" height="60" rx="3" fill="${INK}" opacity="0.55"/>`,
  },
  robot: {
    sparkPoint: [272, 88],
    crop: [130, 10, 240, 230],
    // base + work table, pedestal, forearm/elbow, upper arm/shoulder, wrist + torch
    front: `<rect x="40" y="220" width="360" height="16" rx="4" fill="${INK}"/><rect x="250" y="180" width="90" height="34" rx="3" fill="${WHITE}" stroke="${INK}" stroke-width="2"/><rect x="70" y="180" width="140" height="40" rx="4" fill="${STEEL}"/><g transform="rotate(-18 140 180)"><rect x="132" y="120" width="16" height="62" rx="6" fill="${STEEL}"/></g><circle cx="140" cy="180" r="16" fill="${INK}"/><circle cx="150" cy="122" r="12" fill="${INK}"/><g transform="rotate(24 150 122)"><rect x="146" y="70" width="14" height="56" rx="6" fill="${STEEL}"/></g><circle cx="205" cy="80" r="10" fill="${INK}"/><g transform="rotate(12 205 80)"><rect x="203" y="80" width="70" height="10" rx="4" fill="${INK}"/></g>`,
  },
};

function machineGroup(kind, { withSpark = false, withOperator = false } = {}) {
  const m = MACHINES[kind];
  const overlay = [
    withSpark ? sparkBurst(m.sparkPoint[0], m.sparkPoint[1], 30) : "",
    withOperator ? operator(4, 130, 1.1) : "",
  ].join("");
  return `<g>${m.front}${overlay}</g>`;
}

/** front / detail (cropped, zoomed-in) / in-use (spark burst + operator) angles for one
 * product, each clipped to the shared 440×280 local box. A nested <svg> only clips (and
 * only honours its enclosing transform) when width/height are given explicitly — the
 * bare `viewBox` used in an earlier version of this function did neither, so the
 * front/in-use angles rendered near-blank and "detail" bled across the whole canvas. */
function productAngle(kind, angle) {
  const content = machineGroup(kind, { withSpark: angle === "in-use", withOperator: angle === "in-use" });
  const [vx, vy, vw, vh] = angle === "detail" ? MACHINES[kind].crop : [0, 0, 440, 280];
  const preserve = angle === "detail" ? "xMidYMid slice" : "xMidYMid meet";
  return `<svg x="0" y="0" width="440" height="280" viewBox="${vx} ${vy} ${vw} ${vh}" preserveAspectRatio="${preserve}">${content}</svg>`;
}

async function emit(relPath, svg, { format = "webp" } = {}) {
  const rasterPath = join(PUBLIC, relPath);
  await mkdir(dirname(rasterPath), { recursive: true });
  if (format === "webp") await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(rasterPath);
  else await sharp(Buffer.from(svg)).png().toFile(rasterPath);

  const svgPath = join(PUBLIC, "illustrations", relPath.replace(/\.(webp|png)$/, ".svg"));
  await mkdir(dirname(svgPath), { recursive: true });
  await writeFile(svgPath, svg);
  return rasterPath;
}

/** Hero poster: dark band, subtle grid, oversized laser head cutting a sheet with a spark burst. */
function heroPosterSvg(width, height) {
  const grid = gridLines(width, height, 64, STEEL, 0.14);
  const cx = width / 2;
  const beamTop = height * 0.28;
  const sheetY = height * 0.62;
  const titleSize = Math.round(width * 0.02);
  const content = `${grid}<rect x="${cx - 420}" y="${beamTop - 40}" width="840" height="40" rx="8" fill="${STEEL}"/><rect x="${cx - 60}" y="${beamTop}" width="120" height="90" rx="8" fill="${STEEL}"/><rect x="${cx - 26}" y="${beamTop + 90}" width="52" height="36" rx="4" fill="${WHITE}"/><line x1="${cx}" y1="${beamTop + 126}" x2="${cx}" y2="${sheetY}" stroke="${SPARK}" stroke-width="4" stroke-dasharray="4 6"/><rect x="${cx - 340}" y="${sheetY}" width="680" height="26" rx="4" fill="${STEEL_SOFT}" opacity="0.9"/>${sparkBurst(cx, sheetY, 46)}<text x="${cx}" y="${height - 60}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${titleSize}" font-weight="700" fill="${WHITE}" opacity="0.9">RA MACHINE</text>`;
  return scene({ width, height, bg: INK, content });
}

/** About/factory: a row of machine silhouettes standing in a hall. */
function factoryHallSvg(width, height) {
  const floorY = height * 0.78;
  const kinds = ["fiber", "robot", "tube", "co2"];
  const spacing = width / kinds.length;
  let row = "";
  kinds.forEach((kind, i) => {
    const scale = (spacing * 0.72) / 440;
    const tx = i * spacing + spacing * 0.14;
    const ty = floorY - 260 * scale;
    row += `<g transform="translate(${tx} ${ty}) scale(${scale})">${machineGroup(kind)}</g>`;
  });
  const content = `<rect x="0" y="${floorY}" width="${width}" height="${height - floorY}" fill="${WHITE}"/><rect x="0" y="${floorY - 3}" width="${width}" height="6" fill="${INK}" opacity="0.25"/>${row}`;
  return scene({ width, height, bg: STEEL_SOFT, content, caption: "RA Machine manufacturing facility — Kolkata, India" });
}

/** Rough, deliberately abstract India outline + service pins. */
function indiaReachSvg(width, height) {
  const cx = width * 0.42;
  const cy = height * 0.48;
  const s = height / 280;
  const outline = `M ${cx - 60 * s} ${cy - 120 * s}
    L ${cx + 40 * s} ${cy - 128 * s} L ${cx + 78 * s} ${cy - 70 * s} L ${cx + 60 * s} ${cy - 10 * s}
    L ${cx + 94 * s} ${cy + 20 * s} L ${cx + 44 * s} ${cy + 60 * s} L ${cx + 30 * s} ${cy + 118 * s}
    L ${cx + 4 * s} ${cy + 60 * s} L ${cx - 30 * s} ${cy + 30 * s} L ${cx - 66 * s} ${cy + 40 * s}
    L ${cx - 44 * s} ${cy - 20 * s} L ${cx - 70 * s} ${cy - 60 * s} Z`;
  const pins = [
    [cx - 20 * s, cy - 40 * s],
    [cx + 20 * s, cy - 10 * s],
    [cx - 10 * s, cy + 40 * s],
    [cx + 30 * s, cy + 80 * s],
    [cx - 40 * s, cy + 0 * s],
  ];
  const pinDots = pins.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${SPARK}" stroke="${WHITE}" stroke-width="2"/>`).join("");
  const content = `<path d="${outline}" fill="${STEEL}" opacity="0.9"/>${pinDots}`;
  return scene({ width, height, bg: STEEL_SOFT, content, caption: "Installation & service reach across India" });
}

/** Rough globe + shipping routes for the export/world-reach card. */
function worldReachSvg(width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const r = height * 0.36;
  const routes = [
    [cx - r * 0.8, cy - r * 0.1, cx, cy - r * 0.55, cx + r * 0.75, cy - r * 0.2],
    [cx - r * 0.5, cy + r * 0.5, cx + r * 0.1, cy + r * 0.15, cx + r * 0.7, cy + r * 0.5],
  ]
    .map(([x1, y1, x2, y2, x3, y3]) => `<path d="M${x1} ${y1} Q${x2} ${y2} ${x3} ${y3}" fill="none" stroke="${SPARK}" stroke-width="2.5" stroke-dasharray="2 6" stroke-linecap="round"/>`)
    .join("");
  const content = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${STEEL}"/><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.4}" fill="none" stroke="${WHITE}" stroke-width="1.5" opacity="0.5"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.4}" ry="${r}" fill="none" stroke="${WHITE}" stroke-width="1.5" opacity="0.5"/><line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${WHITE}" stroke-width="1.5" opacity="0.5"/>${routes}<circle cx="${cx - r * 0.8}" cy="${cy - r * 0.1}" r="5" fill="${SPARK}"/><circle cx="${cx + r * 0.75}" cy="${cy - r * 0.2}" r="5" fill="${SPARK}"/><circle cx="${cx + r * 0.7}" cy="${cy + r * 0.5}" r="5" fill="${SPARK}"/>`;
  return scene({ width, height, bg: SPARK_SOFT, content, caption: "Exporting to 25+ countries" });
}

/** Rosette / ribbon certificate badge with the certificate name lettered across it. */
function certBadgeSvg(width, height, name, accent) {
  const cx = width / 2;
  const cy = height * 0.4;
  const rOuter = width * 0.32;
  const rInner = rOuter * 0.8;
  let petals = "";
  for (let i = 0; i < 14; i++) {
    const a = (Math.PI * 2 * i) / 14;
    const px = cx + Math.cos(a) * rOuter;
    const py = cy + Math.sin(a) * rOuter;
    petals += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(rOuter * 0.2).toFixed(1)}" fill="${accent}"/>`;
  }
  const lines = wrapLines(name, 13);
  const lineHeight = 24;
  const startY = cy - ((lines.length - 1) * lineHeight) / 2 + 7;
  const nameText = lines
    .map(
      (line, i) =>
        `<text x="${cx}" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="${WHITE}">${escapeXml(line)}</text>`,
    )
    .join("");
  const tailY = cy + rInner * 0.72;
  const content = `${petals}<circle cx="${cx}" cy="${cy}" r="${rInner}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${rInner - 10}" fill="none" stroke="${WHITE}" stroke-width="2" stroke-dasharray="4 5" opacity="0.5"/>${nameText}<path d="M${cx - 38} ${tailY} L${cx - 14} ${tailY + 76} L${cx} ${tailY + 44} L${cx + 14} ${tailY + 76} L${cx + 38} ${tailY} Z" fill="${accent}"/>`;
  return scene({ width, height, bg: accent === SPARK ? STEEL_SOFT : SPARK_SOFT, content });
}

/** og-fallback.png — mirrors lib/og.tsx: spark rule, wordmark, dark icon-mark panel on the right. */
function ogFallbackSvg(width, height) {
  const panelX = width * 0.72;
  const panelCx = panelX + (width - panelX) / 2;
  const mark = `<g transform="translate(${panelCx} ${height / 2}) scale(2.4) translate(-44 -44)"><rect x="34" y="0" width="20" height="30" rx="6" fill="${SPARK}"/><rect x="24" y="30" width="40" height="18" rx="4" fill="${STEEL}"/><line x1="44" y1="48" x2="44" y2="88" stroke="${SPARK}" stroke-width="4" stroke-dasharray="3 5"/></g>`;
  const content = `<rect x="${panelX}" y="0" width="${width - panelX}" height="${height}" fill="${INK}"/><rect x="80" y="80" width="64" height="4" fill="${SPARK}"/><text x="80" y="330" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="${INK}">RA Machine</text><text x="80" y="382" font-family="Arial, sans-serif" font-size="26" fill="#5B5F68">Laser Cutting Machines Built in India, Trusted Worldwide</text><text x="80" y="560" font-family="Arial, sans-serif" font-size="20" fill="#7A7E87">ramachine.com · Kolkata, India · Exporting worldwide</text>${mark}`;
  return scene({ width, height, bg: WHITE, content });
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
    const accent = CERTS.indexOf(cert) % 2 === 0 ? SPARK : STEEL;
    written.push(await emit(`certs/${cert.slug}.webp`, certBadgeSvg(600, 800, cert.name, accent)));
  }

  for (const product of PRODUCTS) {
    const angles = [
      ["1", "front"],
      ["2", "detail"],
      ["3", "in-use"],
    ];
    for (const [index, angle] of angles) {
      const svg = scene({
        width: 1200,
        height: 900,
        bg: PRODUCTS.indexOf(product) % 2 === 0 ? STEEL_SOFT : SPARK_SOFT,
        content: `<g transform="translate(160 250) scale(2.1)">${productAngle(product.category, angle)}</g>`,
        caption: `${product.name} — ${angle === "front" ? "front view" : angle === "detail" ? "detail view" : "in use"}`,
      });
      written.push(await emit(`products/${product.slug}-${index}.webp`, svg));
    }
  }

  for (const category of CATEGORIES) {
    const svg = scene({
      width: 1200,
      height: 800,
      bg: CATEGORIES.indexOf(category) % 2 === 0 ? STEEL_SOFT : SPARK_SOFT,
      content: `<g transform="translate(180 210) scale(1.9)">${machineGroup(category.category)}</g>`,
      caption: category.name,
    });
    written.push(await emit(`categories/${category.slug}.webp`, svg));
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
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 48" width="240" height="48"><rect x="0" y="20" width="10" height="10" rx="2" fill="${SPARK}"/><text x="16" y="32" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="${INK}">RA Machine</text></svg>`;
  const logoPath = join(PUBLIC, "logo.svg");
  await mkdir(dirname(logoPath), { recursive: true });
  await writeFile(logoPath, logoSvg);
  written.push(logoPath);

  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect width="32" height="32" rx="7" fill="${INK}"/><rect x="6" y="15" width="20" height="2" fill="${WHITE}"/><rect x="6" y="9" width="12" height="2" fill="${STEEL}"/><rect x="6" y="21" width="10" height="2" fill="${SPARK}"/></svg>`;
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
