/**
 * scripts/illustrations/certs.mjs — certificate rosette badges: ribbon + name +
 * issuer line + a small centre icon distinguishing each certificate, each with
 * its own accent tint (still within the ADR-0002 palette).
 */
import { INK, STEEL, STEEL_LIGHT, SPARK, SPARK_LIGHT, GREY, WHITE, escapeXml, wrapLines, scene } from "./common.mjs";

// ---- small centre icons, drawn centred at (0,0) in a roughly ±20 box --------

function shieldIcon(color) {
  return `<g><path d="M0 -20 L17 -13 V4 C17 15 9 21 0 24 C-9 21 -17 15 -17 4 V-13 Z" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/><path d="M-8 0 L-2 8 L10 -8" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}

function ceIcon(color) {
  return `<text x="0" y="9" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="800" fill="${color}" letter-spacing="1">CE</text>`;
}

function documentIcon(color) {
  return `<g><path d="M-13 -20 H6 L13 -13 V20 H-13 Z" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/><path d="M6 -20 V-13 H13" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/><line x1="-7" y1="-2" x2="7" y2="-2" stroke="${color}" stroke-width="2.5"/><line x1="-7" y1="5" x2="7" y2="5" stroke="${color}" stroke-width="2.5"/><line x1="-7" y1="12" x2="2" y2="12" stroke="${color}" stroke-width="2.5"/></g>`;
}

function gearIcon(color) {
  const cx = 0, cy = 0, r = 16, rInner = r * 0.62, teeth = 8;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a0 = (Math.PI * 2 * i) / teeth;
    const a1 = a0 + (Math.PI * 2) / teeth / 2;
    const a2 = a0 + (Math.PI * 2) / teeth;
    const p = (a, rr) => `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    d += `${i === 0 ? "M" : "L"}${p(a0, rInner)} L${p(a0, r)} L${p(a1, r)} L${p(a2, rInner)} `;
  }
  d += "Z";
  return `<g><path d="${d}" fill="${color}"/><circle cx="0" cy="0" r="${r * 0.34}" fill="none" stroke="${INK}" stroke-width="2.5"/></g>`;
}

function flagIcon(color) {
  return `<g><line x1="-12" y1="-20" x2="-12" y2="20" stroke="${color}" stroke-width="3" stroke-linecap="round"/><path d="M-12 -18 H14 L6 -8 L14 2 H-12 Z" fill="${color}"/></g>`;
}

function trainIcon(color) {
  return `<g><path d="M-16 -4 C-16 -16 -8 -18 0 -18 C10 -18 16 -14 16 -4 V10 H-16 Z" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/><line x1="-16" y1="-2" x2="16" y2="-2" stroke="${color}" stroke-width="2.5"/><circle cx="-7" cy="-9" r="3.4" fill="${color}"/><circle cx="7" cy="-9" r="3.4" fill="${color}"/><circle cx="-9" cy="16" r="4" fill="${color}"/><circle cx="9" cy="16" r="4" fill="${color}"/></g>`;
}

function lotusIcon(color, alt) {
  const petal = (angle, len, w) => {
    const rad = (angle * Math.PI) / 180;
    const tipX = Math.sin(rad) * len;
    const tipY = -Math.cos(rad) * len;
    const nx = Math.cos(rad) * w;
    const ny = Math.sin(rad) * w;
    return `<path d="M0 4 Q${(-nx).toFixed(1)} ${(4 + ny * 0.4).toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)} Q${nx.toFixed(1)} ${(4 + ny * 0.4).toFixed(1)} 0 4 Z" fill="${color}"/>`;
  };
  return `<g>${petal(-46, 20, 8)}${petal(-22, 24, 7)}${petal(0, 26, 7.5)}${petal(22, 24, 7)}${petal(46, 20, 8)}<path d="M-18 6 Q0 16 18 6 Q0 12 -18 6 Z" fill="${alt}"/></g>`;
}

function starIcon(color) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 18 : 8;
    const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${color}"/>`;
}

function checkIcon(color) {
  return `<g><circle cx="0" cy="0" r="18" fill="none" stroke="${color}" stroke-width="3"/><path d="M-9 0 L-2 8 L11 -9" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}

const ICONS = {
  "iso-9001-2015": (c) => shieldIcon(c),
  "ce-marking": (c) => ceIcon(c),
  "gst-registered": (c) => documentIcon(c),
  "msme-udyam": (c) => gearIcon(c),
  "iec-import-export-code": (c) => flagIcon(c),
  "indian-railways-vendor": (c) => trainIcon(c),
  "make-in-india": (c, alt) => lotusIcon(c, alt),
  "startup-india": (c) => starIcon(c),
  bis: (c) => checkIcon(c),
};

const TINTS = [SPARK, STEEL, STEEL_LIGHT];

/** Rosette / ribbon certificate badge with a centre icon, the certificate name
 * and an issuer line lettered across it. `index` cycles the accent tint. */
export function certBadgeSvg(width, height, name, issuer, slug, index = 0) {
  const accent = TINTS[index % TINTS.length];
  const bg = accent === SPARK ? "#E8EEF5" : "#FFF1EA";
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
  const iconFn = ICONS[slug] || checkIcon;
  const icon = `<g transform="translate(${cx} ${cy - rInner * 0.42}) scale(1.15)">${iconFn(WHITE, SPARK_LIGHT)}</g>`;

  const lines = wrapLines(name, 13);
  const lineHeight = 20;
  const startY = cy + rInner * 0.12 + 7;
  const nameText = lines
    .map(
      (line, i) =>
        `<text x="${cx}" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="700" fill="${WHITE}">${escapeXml(line)}</text>`,
    )
    .join("");
  const issuerText = issuer
    ? `<text x="${cx}" y="${startY + lines.length * lineHeight + 14}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10.5" font-weight="600" fill="${WHITE}" opacity="0.62" letter-spacing="0.4">${escapeXml(issuer)}</text>`
    : "";

  const tailY = cy + rInner * 0.72;
  const content = `${petals}<circle cx="${cx}" cy="${cy}" r="${rInner}" fill="${INK}"/><circle cx="${cx}" cy="${cy}" r="${rInner - 10}" fill="none" stroke="${WHITE}" stroke-width="2" stroke-dasharray="4 5" opacity="0.5"/>${icon}${nameText}${issuerText}<path d="M${cx - 38} ${tailY} L${cx - 14} ${tailY + 76} L${cx} ${tailY + 44} L${cx + 14} ${tailY + 76} L${cx + 38} ${tailY} Z" fill="${accent}"/>`;
  return scene({ width, height, bg, content });
}
