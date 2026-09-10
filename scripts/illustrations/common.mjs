/**
 * scripts/illustrations/common.mjs — shared palette, primitives and scene/emit
 * helpers used by every illustration module. ADR-0004 palette: ink, teal (+ light
 * teal, + deep teal), spark (+ light spark), light grey, white on tinted
 * backgrounds. `STEEL`/`STEEL_LIGHT`/`STEEL_SOFT` are kept as aliases of the teal
 * values so every illustration module that imports them keeps compiling and now
 * renders teal.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

export const INK = "#0F1A1A";
export const TEAL = "#0F766E";
export const TEAL_LIGHT = "#2A9D93";
export const TEAL_DEEP = "#0B5C56";
export const TEAL_SOFT = "#E6F4F2";
// Alias — every illustration module importing STEEL/STEEL_LIGHT/STEEL_SOFT now renders teal.
export const STEEL = TEAL;
export const STEEL_LIGHT = TEAL_LIGHT;
export const STEEL_SOFT = TEAL_SOFT;
export const SPARK = "#F26A21";
export const SPARK_LIGHT = "#FFB08A";
export const SPARK_SOFT = "#FFF1EA";
export const GREY = "#E1E2E5";
export const WHITE = "#FFFFFF";

export function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function wrapLines(text, maxChars) {
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

/** Radiating spark-burst accent with a soft glow halo, used on "in-use" and hero art. */
export function sparkBurst(cx, cy, r = 26, color = SPARK, { glow = true } = {}) {
  let rays = "";
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI * 2 * i) / 10;
    const len = i % 2 === 0 ? r : r * 0.66;
    const x1 = cx + Math.cos(a) * len * 0.4;
    const y1 = cy + Math.sin(a) * len * 0.4;
    const x2 = cx + Math.cos(a) * len;
    const y2 = cy + Math.sin(a) * len;
    rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${i % 2 === 0 ? 3 : 2}" stroke-linecap="round"/>`;
  }
  const halo = glow ? `<circle cx="${cx}" cy="${cy}" r="${(r * 1.4).toFixed(1)}" fill="${SPARK_LIGHT}" opacity="0.22"/>` : "";
  return `<g>${halo}${rays}<circle cx="${cx}" cy="${cy}" r="${(r * 0.24).toFixed(1)}" fill="${WHITE}"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.14).toFixed(1)}" fill="${color}"/></g>`;
}

/** A handful of small flying chips/sparks scattered near a point. */
export function sparkChips(cx, cy, count = 6, spread = 70, seed = 1) {
  let out = "";
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2;
    const d = 14 + rnd() * spread;
    const x = cx + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d - d * 0.15;
    const r = 1.6 + rnd() * 2.4;
    const color = rnd() > 0.4 ? SPARK : SPARK_LIGHT;
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}"/>`;
  }
  return `<g opacity="0.9">${out}</g>`;
}

/** A simple standing operator silhouette, for scale in "in-use" illustrations. */
export function operator(x, y, scale = 1, { color = INK, opacity = 0.82 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${color}" opacity="${opacity}">
    <circle cx="10" cy="8" r="8"/>
    <path d="M0 60 Q0 26 10 26 Q20 26 20 60 Z"/>
    <rect x="4" y="58" width="5" height="16" rx="2"/>
    <rect x="11" y="58" width="5" height="16" rx="2"/>
    <path d="M-6 34 Q-10 46 -2 54" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M26 34 Q30 44 22 50" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>`;
}

/** A soft flat ground shadow ellipse beneath a machine. */
export function groundShadow(cx, y, rx, ry = 10, opacity = 0.16) {
  return `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${ry}" fill="${INK}" opacity="${opacity}"/>`;
}

/** A small rectangular name-plate with a label, used on cabinets/machine bodies. */
export function namePlate(x, y, w, h, label, { fill = WHITE, stroke = INK, textColor = INK, size = 10 } = {}) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="1"/><text x="${x + w / 2}" y="${y + h / 2 + size * 0.34}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size}" font-weight="700" fill="${textColor}" letter-spacing="0.5">${escapeXml(label)}</text></g>`;
}

/** A small control-cabinet screen: bezel + gradient-ish glow lines to read as a UI. */
export function controlScreen(x, y, w, h) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${INK}"/><rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="2" fill="${STEEL_LIGHT}" opacity="0.9"/><rect x="${x + 6}" y="${y + h * 0.42}" width="${w - 12}" height="${h * 0.14}" fill="${SPARK}" opacity="0.85"/><rect x="${x + 6}" y="${y + h * 0.64}" width="${(w - 12) * 0.6}" height="${h * 0.1}" fill="${WHITE}" opacity="0.7"/></g>`;
}

/** A gas cylinder (assist-gas bottle) with cap and body band. */
export function gasCylinder(x, y, h, color = STEEL_LIGHT) {
  const w = h * 0.22;
  return `<g><rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="${w / 2}" fill="${color}"/><rect x="${x + w * 0.12}" y="${y - h + h * 0.18}" width="${w * 0.76}" height="${h * 0.1}" fill="${WHITE}" opacity="0.55"/><rect x="${x + w * 0.28}" y="${y - h - h * 0.09}" width="${w * 0.44}" height="${h * 0.11}" rx="2" fill="${INK}"/></g>`;
}

/** Cut-part outlines scattered on a sheet: a gear, a bracket-with-holes, a plate. */
export function gearShape(cx, cy, r, teeth = 10, color = STEEL_SOFT, stroke = INK) {
  let d = "";
  const rInner = r * 0.72;
  for (let i = 0; i < teeth; i++) {
    const a0 = (Math.PI * 2 * i) / teeth;
    const a1 = a0 + (Math.PI * 2) / teeth / 2;
    const a2 = a0 + (Math.PI * 2) / teeth;
    const p = (a, rr) => `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    d += `${i === 0 ? "M" : "L"}${p(a0, rInner)} L${p(a0, r)} L${p(a1, r)} L${p(a2, rInner)} `;
  }
  d += "Z";
  return `<g><path d="${d}" fill="${color}" stroke="${stroke}" stroke-width="1.5"/><circle cx="${cx}" cy="${cy}" r="${r * 0.3}" fill="none" stroke="${stroke}" stroke-width="1.5"/></g>`;
}

export function bracketShape(x, y, w, h, color = STEEL_SOFT, stroke = INK) {
  const holeR = Math.min(w, h) * 0.12;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h * 0.14}" fill="${color}" stroke="${stroke}" stroke-width="1.5"/><circle cx="${x + holeR * 1.8}" cy="${y + h / 2}" r="${holeR}" fill="none" stroke="${stroke}" stroke-width="1.4"/><circle cx="${x + w - holeR * 1.8}" cy="${y + h / 2}" r="${holeR}" fill="none" stroke="${stroke}" stroke-width="1.4"/></g>`;
}

export function plateShape(x, y, w, h, color = STEEL_SOFT, stroke = INK) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${color}" stroke="${stroke}" stroke-width="1.5"/>`;
}

export function gridLines(width, height, step, color, opacity) {
  let l = "";
  for (let x = 0; x <= width; x += step) l += `<line x1="${x}" y1="0" x2="${x}" y2="${height}"/>`;
  for (let y = 0; y <= height; y += step) l += `<line x1="0" y1="${y}" x2="${width}" y2="${y}"/>`;
  return `<g stroke="${color}" stroke-width="1" opacity="${opacity}">${l}</g>`;
}

/** A faint single-vanishing-point perspective grid fading toward a horizon line. */
export function perspectiveGrid(width, height, horizonY, color, opacity, vpx) {
  const vx = vpx ?? width / 2;
  let lines = "";
  const count = 14;
  for (let i = 0; i <= count; i++) {
    const x = (width / count) * i;
    lines += `<line x1="${x}" y1="${height}" x2="${vx}" y2="${horizonY}"/>`;
  }
  const rows = 6;
  for (let i = 1; i <= rows; i++) {
    const t = i / rows;
    const y = horizonY + (height - horizonY) * (t * t);
    lines += `<line x1="0" y1="${y.toFixed(1)}" x2="${width}" y2="${y.toFixed(1)}"/>`;
  }
  return `<g stroke="${color}" stroke-width="1" opacity="${opacity}" fill="none">${lines}</g>`;
}

export function captionText(width, height, text) {
  return `<text x="24" y="${height - 22}" font-family="Arial, sans-serif" font-size="${Math.round(
    width * 0.017,
  )}" font-weight="600" fill="${INK}" opacity="0.5">${escapeXml(text)}</text>`;
}

export function scene({ width, height, bg, content, caption }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}"/>
  ${content}
  ${caption ? captionText(width, height, caption) : ""}
</svg>`;
}

export function makeEmit(PUBLIC) {
  return async function emit(relPath, svg, { format = "webp" } = {}) {
    const rasterPath = join(PUBLIC, relPath);
    await mkdir(dirname(rasterPath), { recursive: true });
    if (format === "webp") await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(rasterPath);
    else await sharp(Buffer.from(svg)).png().toFile(rasterPath);

    const svgPath = join(PUBLIC, "illustrations", relPath.replace(/\.(webp|png)$/, ".svg"));
    await mkdir(dirname(svgPath), { recursive: true });
    await writeFile(svgPath, svg);
    return rasterPath;
  };
}
