/**
 * scripts/illustrations/certs.mjs — ADR-0005 §7: minimal ring badges with the
 * certificate name. A thin ink outer ring, a small teal inner accent ring, a
 * simple line-art glyph identifying the certificate, and the name lettered
 * below — on a transparent background so it drops cleanly into the glass pill
 * badge (components/cards/CertCard.tsx).
 */
import { INK, TEAL, escapeXml, wrapLines, lineArt, scene } from "./common.mjs";

// ---- small centre glyphs, drawn centred at (0,0) in a roughly ±16 box -------

function shieldGlyph() {
  return `<path d="M0 -16 L14 -10 V4 C14 12 7 17 0 19 C-7 17 -14 12 -14 4 V-10 Z"/><path d="M-6 0 L-1 6 L8 -6"/>`;
}
function ceGlyph() {
  return `<text x="0" y="6" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="${INK}" stroke="none">CE</text>`;
}
function documentGlyph() {
  return `<path d="M-10 -16 H5 L10 -11 V16 H-10 Z"/><path d="M5 -16 V-11 H10"/><path d="M-5 -2 H5 M-5 3 H5 M-5 8 H1"/>`;
}
function gearGlyph() {
  const cx = 0, cy = 0, r = 13, rInner = r * 0.6, teeth = 8;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a0 = (Math.PI * 2 * i) / teeth;
    const a1 = a0 + (Math.PI * 2) / teeth / 2;
    const a2 = a0 + (Math.PI * 2) / teeth;
    const p = (a, rr) => `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    d += `${i === 0 ? "M" : "L"}${p(a0, rInner)} L${p(a0, r)} L${p(a1, r)} L${p(a2, rInner)} `;
  }
  return `<path d="${d}Z"/><circle cx="0" cy="0" r="${(r * 0.32).toFixed(1)}"/>`;
}
function flagGlyph() {
  return `<path d="M-9 -16 V16"/><path d="M-9 -14 H10 L3 -6 L10 2 H-9"/>`;
}
function trainGlyph() {
  return `<path d="M-12 -2 C-12 -12 -6 -14 0 -14 C7 -14 12 -10 12 -2 V8 H-12 Z"/><path d="M-12 0 H12"/><circle cx="-6" cy="12" r="3"/><circle cx="6" cy="12" r="3"/>`;
}
function lotusGlyph() {
  const petal = (angle, len) => {
    const rad = (angle * Math.PI) / 180;
    const tipX = Math.sin(rad) * len;
    const tipY = -Math.cos(rad) * len;
    return `<path d="M0 4 Q${(-len * 0.3).toFixed(1)} 0 ${tipX.toFixed(1)} ${tipY.toFixed(1)} Q${(len * 0.3).toFixed(1)} 0 0 4 Z"/>`;
  };
  return `${petal(-40, 16)}${petal(-16, 19)}${petal(0, 21)}${petal(16, 19)}${petal(40, 16)}<path d="M-14 4 Q0 10 14 4"/>`;
}
function starGlyph() {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 15 : 6.5;
    const a = (Math.PI * 2 * i) / 10 - Math.PI / 2;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}"/>`;
}
function checkGlyph() {
  return `<circle cx="0" cy="0" r="15"/><path d="M-7 0 L-1 6 L9 -7"/>`;
}

const GLYPHS = {
  "iso-9001-2015": shieldGlyph,
  "ce-marking": ceGlyph,
  "gst-registered": documentGlyph,
  "msme-udyam": gearGlyph,
  "iec-import-export-code": flagGlyph,
  "indian-railways-vendor": trainGlyph,
  "make-in-india": lotusGlyph,
  "startup-india": starGlyph,
  bis: checkGlyph,
};

/** Minimal ring badge: ink outer ring, teal inner accent ring, a small centre
 * glyph and the certificate name lettered below. Transparent background. */
export function certBadgeSvg(width, height, name, issuer, slug) {
  const cx = width / 2;
  const cy = height * 0.4;
  const rOuter = width * 0.28;
  const rInner = rOuter * 0.82;

  const glyphFn = GLYPHS[slug] || checkGlyph;
  const glyph = `<g transform="translate(${cx} ${cy})">${glyphFn()}</g>`;

  const lines = wrapLines(name, 16);
  const lineHeight = 22;
  const startY = cy + rOuter + 40;
  const nameText = lines
    .map(
      (line, i) =>
        `<text x="${cx}" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="${INK}">${escapeXml(line)}</text>`,
    )
    .join("");
  const issuerText = issuer
    ? `<text x="${cx}" y="${startY + lines.length * lineHeight + 16}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#5B5F68" letter-spacing="0.3">${escapeXml(issuer)}</text>`
    : "";

  const rings = lineArt(`<circle cx="${cx}" cy="${cy}" r="${rOuter}"/>`) + lineArt(`<circle cx="${cx}" cy="${cy}" r="${rInner}"/>`, { color: TEAL, opacity: 0.7 });

  const content = `${rings}${lineArt(glyph)}${nameText}${issuerText}`;
  return scene({ width, height, content });
}
