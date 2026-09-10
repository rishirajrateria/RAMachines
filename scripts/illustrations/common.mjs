/**
 * scripts/illustrations/common.mjs — shared palette, primitives and scene/emit
 * helpers used by every illustration module. ADR-0005 "Liquid Glass" §7: line-art
 * glyphs (SVG, stroke only, ink #0F1A1A at 1.75px, rounded joins) on transparent
 * backgrounds for product/category/cert art; soft blurred-light radial forms
 * (teal/aqua/white, no hard shapes) for the hero, about and OG compositions. Teal
 * is used only as a small, deliberate accent (a pin, a route dash) — never as a
 * fill inside a machine glyph.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

export const INK = "#0F1A1A";
export const TEAL = "#0F766E";
export const AQUA = "#5EEAD4";
export const STROKE = 1.75;

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

/** Wraps arbitrary path/shape markup in a group carrying the ADR-0005 §7 line-art
 * stroke contract: ink, 1.75px, no fills, rounded caps/joins. Every machine glyph
 * is built from this — never introduce a `fill` other than "none" inside it. */
export function lineArt(inner, { color = INK, strokeWidth = STROKE, opacity = 1 } = {}) {
  return `<g fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">${inner}</g>`;
}

/** A soft blurred-light radial orb (teal/aqua/white) — the only "filled" shape
 * language allowed, reserved for the ambient backgrounds (hero, about, OG). Never
 * used inside a machine glyph. Returns `{ defs, use }`; call `use` inside the SVG
 * body after including `defs` once. */
let orbSeq = 0;
export function softOrb(cx, cy, r, color, opacity = 0.16) {
  const id = `orb${orbSeq++}`;
  const defs = `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${color}" stop-opacity="${opacity}"/>
    <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
  </radialGradient>`;
  const use = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`;
  return { defs, use };
}

/** The three-orb ambient-light composition (teal top-left, aqua right, white
 * bottom), echoing components/layout/AmbientLight.tsx, for opaque raster scenes
 * (hero poster, factory/reach cards, OG fallback). */
export function ambientLight(width, height) {
  const a = softOrb(width * 0.06, height * -0.05, width * 0.32, TEAL, 0.16);
  const b = softOrb(width * 1.02, height * 0.22, width * 0.28, AQUA, 0.14);
  const c = softOrb(width * 0.4, height * 1.08, width * 0.34, "#FFFFFF", 0.65);
  return {
    defs: `${a.defs}${b.defs}${c.defs}`,
    content: `${a.use}${b.use}${c.use}`,
  };
}

export function captionText(width, height, text) {
  return `<text x="24" y="${height - 22}" font-family="Arial, sans-serif" font-size="${Math.round(
    width * 0.015,
  )}" font-weight="600" fill="${INK}" opacity="0.4">${escapeXml(text)}</text>`;
}

/** `background` is a CSS colour for an opaque scene; omit it for a transparent
 * (alpha) export — used for every product/category/cert glyph. */
export function scene({ width, height, background, defs, content, caption }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${defs ? `<defs>${defs}</defs>` : ""}
  ${background ? `<rect width="${width}" height="${height}" fill="${background}"/>` : ""}
  ${content}
  ${caption ? captionText(width, height, caption) : ""}
</svg>`;
}

export function makeEmit(PUBLIC) {
  return async function emit(relPath, svg, { format = "webp" } = {}) {
    const rasterPath = join(PUBLIC, relPath);
    await mkdir(dirname(rasterPath), { recursive: true });
    // No .flatten() — alpha is preserved when the source SVG has no background rect.
    if (format === "webp") await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(rasterPath);
    else await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(rasterPath);

    const svgPath = join(PUBLIC, "illustrations", relPath.replace(/\.(webp|png)$/, ".svg"));
    await mkdir(dirname(svgPath), { recursive: true });
    await writeFile(svgPath, svg);
    return rasterPath;
  };
}
