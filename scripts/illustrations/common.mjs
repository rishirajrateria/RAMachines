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
  return async function emit(relPath, svg, { format = "webp", superSample } = {}) {
    const rasterPath = join(PUBLIC, relPath);
    await mkdir(dirname(rasterPath), { recursive: true });
    // No .flatten() — alpha is preserved when the source SVG has no background rect.
    // `superSample: [targetW, targetH]` rasterises the (2x-authored) SVG at its own
    // size then downsamples with sharp — crisper edges/gradients than rendering
    // straight at the target size (ADR-0008 §1 "Method that works").
    let pipeline = sharp(Buffer.from(svg), { density: 220 });
    if (superSample) pipeline = pipeline.resize(superSample[0], superSample[1], { kernel: "lanczos3" });
    if (format === "webp") await pipeline.webp({ quality: 90 }).toFile(rasterPath);
    else await pipeline.png({ compressionLevel: 9, palette: true }).toFile(rasterPath);

    const svgPath = join(PUBLIC, "illustrations", relPath.replace(/\.(webp|png)$/, ".svg"));
    await mkdir(dirname(svgPath), { recursive: true });
    await writeFile(svgPath, svg);
    return rasterPath;
  };
}

// ---------------------------------------------------------------------------
// ADR-0008 §1 — solid-shaded 3/4-perspective machine rendering primitives.
// Every helper below returns a *self-contained* SVG string (its own inline
// <defs> ahead of its shapes) so callers can splice the result directly into
// any parent <g> without threading a separate defs collection through.
// ---------------------------------------------------------------------------

let idSeq = 0;
const nextId = (prefix) => `${prefix}${idSeq++}`;

export const GRAPHITE = "#1B2626";
export const GRAPHITE_DARK = "#0C1212";
export const BODY_TEAL = "#0F766E";
export const BODY_TEAL_LIGHT = "#14857C";
export const EDGE_TEAL = "#2A9D93";
export const METAL_LIGHT = "#C9CED2";
export const METAL_MID = "#A6ADB3";
export const METAL_DARK = "#8C9499";
export const RUBBER = "#10161A";
export const GLASS = "#BFD7D4";
export const SPARK_AMBER = "#FFB067";
export const SPARK_HOT = "#FFF4E2";

function fmt(n) {
  return Math.round(n * 10) / 10;
}
function pts(list) {
  return list.map((p) => `${fmt(p[0])},${fmt(p[1])}`).join(" ");
}

export function linGrad(x1, y1, x2, y2, stops) {
  const id = nextId("lg");
  const s = stops.map(([off, color, op = 1]) => `<stop offset="${off}" stop-color="${color}" stop-opacity="${op}"/>`).join("");
  return { id, tag: `<linearGradient id="${id}" x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" gradientUnits="userSpaceOnUse">${s}</linearGradient>` };
}

export function radGrad(cx, cy, r, stops) {
  const id = nextId("rg");
  const s = stops.map(([off, color, op = 1]) => `<stop offset="${off}" stop-color="${color}" stop-opacity="${op}"/>`).join("");
  return { id, tag: `<radialGradient id="${id}" cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}" gradientUnits="userSpaceOnUse">${s}</radialGradient>` };
}

/** A true-perspective projector: points recede toward `vp` as `z` grows, so
 * parallel depth edges visibly converge (ADR-0008 §1). `depthK` controls how
 * aggressively depth compresses toward the vanishing point — keep it small
 * (z runs up to ~100+ units) so it never overshoots the VP. */
export function makeProjector({ vpX, vpY, depthK = 0.0065 }) {
  return function project(x, yUp, z = 0) {
    const baseX = x;
    const baseY = yUp; // caller passes already-inverted (screen-space, +y down) y
    const t = 1 - 1 / (1 + z * depthK * 4);
    return [baseX + (vpX - baseX) * t, baseY + (vpY - baseY) * t];
  };
}

/** Filled 3D box (front/top/right-side faces) in screen space, using `project`
 * so its depth edges converge. `x,yGround,z` is the bottom-front-left corner;
 * yGround is a *screen* y (small = higher up). Faces shade top-lightest,
 * front-mid, side-darkest per the ADR-0008 §1 lighting model. Returns an SVG
 * string with inline seam strokes and a top-left rim-light edge. */
export function box3d(project, { x, yGround, z = 0, w, h, d }, palette = {}) {
  const {
    topFrom = EDGE_TEAL,
    topTo = BODY_TEAL_LIGHT,
    frontFrom = BODY_TEAL,
    frontTo = GRAPHITE,
    sideFrom = "#0E3B37",
    sideTo = GRAPHITE_DARK,
    seam = "#06100F",
    rim = "#BFEDE7",
  } = palette;

  const FBL = project(x, yGround, z);
  const FBR = project(x + w, yGround, z);
  const FTL = project(x, yGround - h, z);
  const FTR = project(x + w, yGround - h, z);
  const BBR = project(x + w, yGround, z + d);
  const BTL = project(x, yGround - h, z + d);
  const BTR = project(x + w, yGround - h, z + d);

  const top = linGrad(FTL[0], FTL[1], BTR[0], BTR[1], [
    [0, topFrom],
    [100, topTo],
  ]);
  const front = linGrad(0, FTL[1], 0, FBL[1], [
    [0, frontFrom],
    [100, frontTo],
  ]);
  const side = linGrad(FTR[0], 0, BTR[0], 0, [
    [0, sideFrom],
    [100, sideTo],
  ]);

  return `<defs>${top.tag}${front.tag}${side.tag}</defs>
    <polygon points="${pts([FBR, BBR, BTR, FTR])}" fill="url(#${side.id})"/>
    <polygon points="${pts([FTL, FTR, BTR, BTL])}" fill="url(#${top.id})"/>
    <polygon points="${pts([FBL, FBR, FTR, FTL])}" fill="url(#${front.id})"/>
    <path d="M${pts([FBR, BBR])}" stroke="${seam}" stroke-width="0.8" opacity="0.5" fill="none"/>
    <path d="M${pts([FTR, BTR])}" stroke="${seam}" stroke-width="0.8" opacity="0.4" fill="none"/>
    <path d="M${pts([FTL, FTR])}" stroke="${rim}" stroke-width="1.3" opacity="0.85" stroke-linecap="round" fill="none"/>
    <path d="M${pts([FTL, FBL])}" stroke="${rim}" stroke-width="1.1" opacity="0.55" stroke-linecap="round" fill="none"/>`;
}

/** A rounded metal/rubber "limb" (capsule) between two screen points, shaded
 * with a perpendicular light→dark→light gradient so it reads as cylindrical —
 * used for robot-arm segments, rails, posts and tube-machine rollers. */
export function limb(p1, p2, r1, r2, colors = {}) {
  const { light = METAL_LIGHT, mid = METAL_MID, dark = METAL_DARK } = colors;
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const A = [x1 + nx * r1, y1 + ny * r1];
  const B = [x2 + nx * r2, y2 + ny * r2];
  const C = [x2 - nx * r2, y2 - ny * r2];
  const D = [x1 - nx * r1, y1 - ny * r1];
  const g = linGrad(A[0], A[1], D[0], D[1], [
    [0, dark],
    [32, light],
    [55, light],
    [100, mid],
  ]);
  return `<defs>${g.tag}</defs>
    <circle cx="${fmt(x1)}" cy="${fmt(y1)}" r="${fmt(r1)}" fill="url(#${g.id})"/>
    <polygon points="${pts([A, B, C, D])}" fill="url(#${g.id})"/>
    <circle cx="${fmt(x2)}" cy="${fmt(y2)}" r="${fmt(r2)}" fill="url(#${g.id})"/>`;
}

/** Soft blurred elliptical contact shadow directly under an object. */
export function contactShadow(cx, cy, rx, ry, opacity = 0.4) {
  const g = radGrad(cx, cy, rx, [
    [0, "#000000", opacity],
    [60, "#000000", opacity * 0.45],
    [100, "#000000", 0],
  ]);
  return `<defs>${g.tag}</defs><ellipse cx="${fmt(cx)}" cy="${fmt(cy)}" rx="${fmt(rx)}" ry="${fmt(ry)}" fill="url(#${g.id})"/>`;
}

/** Mirrors `content` below `groundY`, fading it out — the short floor
 * reflection every machine sits on. */
export function floorReflection(content, groundY, fadeHeight = 130, opacity = 0.22) {
  const maskId = nextId("rmask");
  const g = linGrad(0, groundY, 0, groundY + fadeHeight, [
    [0, "#ffffff", opacity],
    [100, "#ffffff", 0],
  ]);
  return `<defs>${g.tag}
    <mask id="${maskId}"><rect x="-4000" y="${fmt(groundY)}" width="9000" height="${fmt(fadeHeight)}" fill="url(#${g.id})"/></mask>
  </defs>
  <g transform="translate(0 ${fmt(2 * groundY)}) scale(1,-1)" mask="url(#${maskId})">${content}</g>`;
}

/** The one warm accent (ADR-0008 §1): hot-white core → amber → transparent,
 * a soft bloom halo, and 12–18 radiating spark lines of varying length/opacity. */
export function sparkBurst(cx, cy, scale = 1) {
  const blurId = nextId("blur");
  const glow = radGrad(cx, cy, 30 * scale, [
    [0, SPARK_HOT, 0.95],
    [35, SPARK_AMBER, 0.55],
    [100, SPARK_AMBER, 0],
  ]);
  const core = radGrad(cx, cy, 6 * scale, [
    [0, "#ffffff", 1],
    [55, SPARK_HOT, 1],
    [100, SPARK_AMBER, 0],
  ]);
  const n = 16;
  let sparks = "";
  for (let i = 0; i < n; i++) {
    const ang = (Math.PI * 2 * i) / n + (i % 2 ? 0.18 : -0.1);
    const len = (9 + ((i * 37) % 24)) * scale;
    const op = (0.35 + ((i * 13) % 55) / 100).toFixed(2);
    const w = i % 3 === 0 ? 1.7 : 1;
    const x2 = cx + Math.cos(ang) * len;
    const y2 = cy + Math.sin(ang) * len;
    const tipR = (0.9 + (i % 3) * 0.4) * scale;
    sparks += `<line x1="${fmt(cx)}" y1="${fmt(cy)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${SPARK_AMBER}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
    sparks += `<circle cx="${fmt(x2)}" cy="${fmt(y2)}" r="${fmt(tipR)}" fill="${SPARK_HOT}" opacity="${(op * 0.9).toFixed(2)}"/>`;
  }
  return `<defs>${glow.tag}${core.tag}
      <filter id="${blurId}" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="${(3.5 * scale).toFixed(2)}"/></filter>
    </defs>
    <circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(30 * scale)}" fill="url(#${glow.id})" filter="url(#${blurId})"/>
    ${sparks}
    <circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(6 * scale)}" fill="url(#${core.id})"/>`;
}

/** A small dark nameplate with an SKU label — panel detail per ADR-0008 §1. */
export function nameplate(x, y, w, h, text) {
  return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="1.4" fill="#0B1414" opacity="0.88"/>
    <rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="1.4" fill="none" stroke="#3A4A4A" stroke-width="0.6"/>
    <text x="${fmt(x + w / 2)}" y="${fmt(y + h * 0.68)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fmt(h * 0.5)}" font-weight="700" fill="#8FE0D6" letter-spacing="0.5">${escapeXml(text)}</text>`;
}

/** A faint UI readout on a control-cabinet screen — a small graph line plus
 * a status dot, low-opacity so it reads as "on" without competing with the beam. */
export function screenUi(x, y, w, h) {
  const pts2 = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const px = x + (w * i) / steps;
    const py = y + h * 0.65 - Math.sin(i * 1.3) * h * 0.22 - (i / steps) * h * 0.15;
    pts2.push(`${fmt(px)},${fmt(py)}`);
  }
  return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" fill="#0A1E1C"/>
    <polyline points="${pts2.join(" ")}" fill="none" stroke="${EDGE_TEAL}" stroke-width="1" opacity="0.85"/>
    <circle cx="${fmt(x + w * 0.88)}" cy="${fmt(y + h * 0.18)}" r="${fmt(h * 0.07)}" fill="${SPARK_AMBER}" opacity="0.9"/>`;
}
