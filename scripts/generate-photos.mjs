#!/usr/bin/env node
/**
 * scripts/generate-photos.mjs — ADR-0008 §2: generates every placeholder photo under
 * `/public/photos` (`node scripts/generate-photos.mjs`) referenced by `lib/photos.ts`.
 * Each is a self-contained, hand-composed SVG scene — built back-to-front as real
 * layers (sky/wall plane, architecture, midground subject, foreground framing), with
 * a one-point-perspective floor grid, visible light cones and floor pools under
 * lamps, atmospheric perspective (far = cooler/lower contrast), a vignette, film
 * grain and a mild contrast curve — rasterised with sharp at WebP q78/q80. `hero-*`
 * render 1920×1080, `slot-*` 1600×1200. Every value that drives composition (light
 * direction, lamp/machine placement, subject pose) is derived from a PRNG seeded on
 * the key's own filename, so re-running this script is deterministic while every key
 * still looks distinct. Drop a same-named real photo into /public/photos later and
 * stop regenerating that one key to replace it permanently.
 */
import { mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "photos");

const INK = "#0B1414";
const GRAPHITE = "#1F2A2A";
const GRAPHITE2 = "#33403E";
const TEAL = "#0F766E";
const TEAL_DEEP = "#0A2E2B";
const AQUA = "#5EEAD4";
const HAZE = "#F6F8F9";
const AMBER = "#FFB067";
const WARM = "#FFE3B8";

// --------------------------------------------------------------------------- PRNG / color
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return function rnd() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
const lerp = (a, b, t) => a + (b - a) * t;
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}
function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  return rgbToHex([lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]);
}
/** Atmospheric perspective: mix a color toward hazy blue-white as depth (0 near..1 far) grows. */
const atmo = (hex, depth) => mix(hex, "#C9DBDA", depth * 0.75);

// --------------------------------------------------------------------------- shared defs / wrap
function sharedDefs(w) {
  return `
    <filter id="blurXS" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${(w * 0.004).toFixed(1)}"/></filter>
    <filter id="blurS" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${(w * 0.012).toFixed(1)}"/></filter>
    <filter id="blurM" x="-80%" y="-80%" width="260%" height="260%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${(w * 0.028).toFixed(1)}"/></filter>
    <filter id="blurL" x="-120%" y="-120%" width="340%" height="340%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${(w * 0.05).toFixed(1)}"/></filter>
    <filter id="contrastBoost" color-interpolation-filters="sRGB">
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.1" intercept="-0.045"/>
        <feFuncG type="linear" slope="1.1" intercept="-0.045"/>
        <feFuncB type="linear" slope="1.12" intercept="-0.05"/>
      </feComponentTransfer>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="7" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0" result="m"/>
      <feComponentTransfer in="m"><feFuncR type="linear" slope="2.2" intercept="-0.55"/><feFuncG type="linear" slope="2.2" intercept="-0.55"/><feFuncB type="linear" slope="2.2" intercept="-0.55"/></feComponentTransfer>
    </filter>`;
}
function wrap(key, w, h, inner, { dark, grainOp, vignetteOp }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${sharedDefs(w)}
    <radialGradient id="vig" cx="50%" cy="46%" r="75%"><stop offset="40%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="${dark ? "#040807" : "#08110F"}" stop-opacity="${vignetteOp}"/></radialGradient>
  </defs>
  <g filter="url(#contrastBoost)">${inner}</g>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="${grainOp}"/>
</svg>`;
}
/** Darkens/flattens the left ~45% for hero images so white headline text stays legible. */
function leftCalm(w, h) {
  return `<rect width="${(w * 0.5).toFixed(0)}" height="${h}" fill="url(#calmGrad)"/>`;
}
const calmGradDef = `<linearGradient id="calmGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${INK}" stop-opacity="0.5"/><stop offset="80%" stop-color="${INK}" stop-opacity="0.06"/><stop offset="100%" stop-color="${INK}" stop-opacity="0"/></linearGradient>`;

// --------------------------------------------------------------------------- geometry helpers
let lampSeq = 0;
/** Soft light glow rendered entirely with gradients (no blur filter) so large,
 * low-opacity, near-white shapes never hit the blur-filter banding that blows
 * up file size — gradients rasterise as smooth analytic ramps instead. */
function lampUnit(x, y, floorY, scale, warmth, op) {
  const id = `lp${lampSeq++}`;
  const coneW = 30 * scale;
  const coneH = Math.min((floorY - y) * 0.55, 260 * scale);
  const poolRx = coneW * 1.7, poolRy = poolRx * 0.2;
  const c = warmth ? WARM : "#EAF6F4";
  return `
    <defs>
      <linearGradient id="${id}c" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${c}" stop-opacity="${(op * 0.16).toFixed(2)}"/><stop offset="100%" stop-color="${c}" stop-opacity="0"/></linearGradient>
      <radialGradient id="${id}p" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c}" stop-opacity="${(op * 0.32).toFixed(2)}"/><stop offset="100%" stop-color="${c}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}b" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c}" stop-opacity="${(op * 0.6).toFixed(2)}"/><stop offset="100%" stop-color="${c}" stop-opacity="0"/></radialGradient>
    </defs>
    <line x1="${x.toFixed(1)}" y1="${(y - 34 * scale).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y - 6 * scale).toFixed(1)}" stroke="${GRAPHITE}" stroke-width="2" opacity="${op}"/>
    <rect x="${(x - 12 * scale).toFixed(1)}" y="${(y - 6 * scale).toFixed(1)}" width="${(24 * scale).toFixed(1)}" height="${(9 * scale).toFixed(1)}" rx="2" fill="${GRAPHITE}" opacity="${op}"/>
    <polygon points="${(x - 5 * scale).toFixed(1)},${y.toFixed(1)} ${(x + 5 * scale).toFixed(1)},${y.toFixed(1)} ${(x + coneW).toFixed(1)},${(y + coneH).toFixed(1)} ${(x - coneW).toFixed(1)},${(y + coneH).toFixed(1)}" fill="url(#${id}c)"/>
    <ellipse cx="${x.toFixed(1)}" cy="${(y + coneH).toFixed(1)}" rx="${poolRx.toFixed(1)}" ry="${poolRy.toFixed(1)}" fill="url(#${id}p)"/>
    <circle cx="${x.toFixed(1)}" cy="${(y - 1.5 * scale).toFixed(1)}" r="${(4.5 * scale).toFixed(1)}" fill="${c}" opacity="${op}"/>
    <circle cx="${x.toFixed(1)}" cy="${(y - 1.5 * scale).toFixed(1)}" r="${(14 * scale).toFixed(1)}" fill="url(#${id}b)"/>`;
}
function trussBeam(w, y, taper, vpxFrac, op) {
  const insetL = w * 0.04 * taper, insetR = w * 0.04 * taper;
  const midL = lerp(insetL, w * vpxFrac - w * 0.05, 0.94), midR = lerp(w - insetR, w * vpxFrac + w * 0.05, 0.94);
  const depth = 16 * taper;
  return `
    <polygon points="${insetL.toFixed(1)},${y} ${(w - insetR).toFixed(1)},${y} ${midR.toFixed(1)},${(y + depth).toFixed(1)} ${midL.toFixed(1)},${(y + depth).toFixed(1)}" fill="${GRAPHITE}" opacity="${op}"/>
    <line x1="${insetL.toFixed(1)}" y1="${y}" x2="${(w - insetR).toFixed(1)}" y2="${y}" stroke="${mix(GRAPHITE, "#FFFFFF", 0.3)}" stroke-width="1.5" opacity="${(op * 0.6).toFixed(2)}"/>`;
}
function floorPlane(w, h, vpx, vpy, near, far) {
  let grid = "";
  const cols = 9;
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * w;
    grid += `<line x1="${x.toFixed(1)}" y1="${h}" x2="${vpx.toFixed(1)}" y2="${vpy.toFixed(1)}" stroke="#FFFFFF" stroke-width="1.4" stroke-opacity="0.16"/>`;
  }
  for (let i = 1; i <= 6; i++) {
    const t = i / 7;
    const y = h - (h - vpy) * (1 - Math.pow(1 - t, 1.7));
    grid += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${y.toFixed(1)}" stroke="#FFFFFF" stroke-width="1.4" stroke-opacity="${(0.2 * (1 - t) + 0.03).toFixed(3)}"/>`;
  }
  return `
    <polygon points="0,${h} ${w},${h} ${vpx.toFixed(1)},${vpy.toFixed(1)}" fill="url(#floorGrad)"/>
    ${grid}
    <polygon points="0,${h} ${w},${h} ${(vpx + (w - vpx) * 0.3).toFixed(1)},${(vpy + (h - vpy) * 0.55).toFixed(1)} ${(vpx * 0.7).toFixed(1)},${(vpy + (h - vpy) * 0.55).toFixed(1)}" fill="#FFFFFF" opacity="0.03"/>`;
}
function machineShape(kind, body, accent, glow) {
  if (kind === "tube") {
    return `<rect x="-40" y="-158" width="16" height="60" rx="3" fill="${body}"/><rect x="-190" y="-6" width="380" height="26" rx="13" fill="${accent}"/>
      <ellipse cx="-190" cy="7" rx="10" ry="15" fill="${body}"/><ellipse cx="190" cy="7" rx="10" ry="15" fill="${body}"/>
      <rect x="-210" y="30" width="34" height="44" rx="4" fill="${body}"/><rect x="176" y="30" width="34" height="44" rx="4" fill="${body}"/>
      <rect x="-70" y="30" width="30" height="40" rx="3" fill="${body}"/><rect x="40" y="30" width="30" height="40" rx="3" fill="${body}"/>
      <circle cx="0" cy="7" r="5" fill="${glow}"/>`;
  }
  if (kind === "co2") {
    return `<rect x="-170" y="-4" width="340" height="100" rx="10" fill="${body}"/>
      <polygon points="-170,-4 170,-4 150,-72 -150,-72" fill="${accent}"/>
      <rect x="-140" y="14" width="280" height="60" rx="4" fill="${glow}" fill-opacity="0.2"/>
      <line x1="-140" y1="24" x2="140" y2="24" stroke="${glow}" stroke-opacity="0.3" stroke-width="2"/>
      <line x1="-140" y1="44" x2="140" y2="44" stroke="${glow}" stroke-opacity="0.3" stroke-width="2"/>
      <line x1="-140" y1="64" x2="140" y2="64" stroke="${glow}" stroke-opacity="0.3" stroke-width="2"/>
      <rect x="-30" y="96" width="14" height="30" rx="2" fill="${body}"/><rect x="20" y="96" width="14" height="30" rx="2" fill="${body}"/>`;
  }
  if (kind === "robot") {
    return `<rect x="-56" y="96" width="112" height="30" rx="6" fill="${body}"/><rect x="-18" y="10" width="36" height="92" rx="10" fill="${accent}"/>
      <circle cx="0" cy="10" r="24" fill="${accent}"/><g transform="rotate(-28)"><rect x="0" y="-15" width="164" height="30" rx="12" fill="${accent}"/></g>
      <circle cx="145" cy="-54" r="18" fill="${body}"/><g transform="translate(145,-54) rotate(38)"><rect x="0" y="-12" width="108" height="24" rx="10" fill="${body}"/></g>
      <polygon points="240,-34 276,-12 262,24 226,4" fill="${glow}" opacity="0.9"/>`;
  }
  // gantry (default laser cutter)
  return `<rect x="-220" y="68" width="440" height="24" rx="6" fill="${body}"/>
    <rect x="-190" y="-16" width="18" height="86" rx="4" fill="${body}"/><rect x="170" y="-16" width="18" height="86" rx="4" fill="${body}"/>
    <rect x="-205" y="-40" width="410" height="26" rx="6" fill="${accent}"/>
    <rect x="-8" y="-14" width="16" height="66" rx="3" fill="${accent}"/>
    <rect x="164" y="0" width="56" height="70" rx="8" fill="${body}"/><rect x="180" y="16" width="24" height="16" rx="2" fill="${glow}" fill-opacity="0.55"/>
    <rect x="-170" y="10" width="300" height="40" rx="3" fill="${GRAPHITE}" fill-opacity="0.45"/>
    <rect x="-205" y="-42" width="410" height="4" fill="${mix(accent, "#FFFFFF", 0.5)}" opacity="0.6"/>`;
}
function machineUnit(kind, x, y, scale, mirror, tint, op) {
  const sx = (mirror ? -1 : 1) * scale;
  const body = mix(tint, GRAPHITE, 0.2);
  const accent = mix(tint, "#FFFFFF", 0.32);
  const glow = mix(AQUA, "#FFFFFF", 0.2);
  return `
    <ellipse cx="${x.toFixed(1)}" cy="${(y + 14 * scale).toFixed(1)}" rx="${(160 * scale).toFixed(1)}" ry="${(20 * scale).toFixed(1)}" fill="#050A09" opacity="${(op * 0.4).toFixed(2)}" filter="url(#blurS)"/>
    <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sx.toFixed(2)} ${scale.toFixed(2)})" opacity="${op}">${machineShape(kind, body, accent, glow)}</g>`;
}
function personFig(x, y, scale, mirror, tool, tint, op) {
  const sx = (mirror ? -1 : 1) * scale;
  return `
    <ellipse cx="${x.toFixed(1)}" cy="${(y + 78 * scale).toFixed(1)}" rx="${(30 * scale).toFixed(1)}" ry="${(7 * scale).toFixed(1)}" fill="#050A09" opacity="${(op * 0.35).toFixed(2)}" filter="url(#blurXS)"/>
    <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sx.toFixed(2)} ${scale.toFixed(2)})" fill="${tint}" opacity="${op}" stroke="${mix(tint, "#FFFFFF", 0.6)}" stroke-width="1.5" stroke-opacity="0.5">
      <circle cx="0" cy="-96" r="17"/>
      <path d="M-20,-76 L20,-76 L26,10 C26,18 20,24 12,24 L-12,24 C-20,24 -26,18 -26,10 Z"/>
      <rect x="-18" y="24" width="13" height="52" rx="5"/><rect x="6" y="24" width="13" height="52" rx="5"/>
      ${tool ? `<rect x="16" y="-58" width="46" height="10" rx="4" transform="rotate(-18 16 -58)"/>` : `<rect x="-30" y="-68" width="10" height="42" rx="4" transform="rotate(14 -30 -68)"/>`}
    </g>`;
}
function crateShape(x, y, scale, tint, op) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${tint}" opacity="${op}">
    <rect x="-70" y="-56" width="140" height="112" rx="3"/>
    <line x1="-70" y1="-2" x2="70" y2="-2" stroke="${GRAPHITE}" stroke-width="4"/>
    <line x1="0" y1="-56" x2="0" y2="56" stroke="${GRAPHITE}" stroke-width="4"/>
    <ellipse cx="0" cy="60" rx="76" ry="12" fill="#050A09" opacity="0.3" filter="url(#blurXS)"/>
  </g>`;
}
function shelfRack(x, y, scale, tint, op) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${tint}" opacity="${op}">
    <rect x="-190" y="-190" width="10" height="380"/><rect x="180" y="-190" width="10" height="380"/>
    <rect x="-190" y="-190" width="380" height="8"/><rect x="-190" y="-58" width="380" height="8"/><rect x="-190" y="74" width="380" height="8"/><rect x="-190" y="184" width="380" height="8"/>
    <rect x="-166" y="-172" width="58" height="102" rx="3" fill-opacity="0.7"/><rect x="-84" y="-166" width="68" height="96" rx="3" fill-opacity="0.7"/>
    <rect x="8" y="-170" width="58" height="100" rx="3" fill-opacity="0.7"/><rect x="96" y="-162" width="70" height="92" rx="3" fill-opacity="0.7"/>
    <rect x="-160" y="-40" width="68" height="90" rx="3" fill-opacity="0.7"/><rect x="-64" y="-36" width="80" height="86" rx="3" fill-opacity="0.7"/>
    <rect x="44" y="-42" width="68" height="92" rx="3" fill-opacity="0.7"/>
  </g>`;
}
function sparkBurst(x, y, rnd, scale, n = 13) {
  let lines = "", dots = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 1.5 - Math.PI * 0.75 + (rnd() - 0.5) * 0.3;
    const len = (34 + rnd() * 90) * scale;
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    const c = rnd() > 0.4 ? AMBER : "#FFFFFF";
    lines += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c}" stroke-width="${(2.4 * scale).toFixed(1)}" stroke-linecap="round" opacity="${(0.55 + rnd() * 0.4).toFixed(2)}"/>`;
  }
  for (let i = 0; i < 8; i++) {
    const a = rnd() * Math.PI * 2, r = (20 + rnd() * 70) * scale;
    dots += `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${(1.4 + rnd() * 2.4).toFixed(1)}" fill="${AMBER}" opacity="${(0.4 + rnd() * 0.4).toFixed(2)}"/>`;
  }
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(16 * scale).toFixed(1)}" fill="#FFFFFF" opacity="0.85" filter="url(#blurXS)"/>
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(46 * scale).toFixed(1)}" fill="${AMBER}" opacity="0.25" filter="url(#blurS)"/>
    ${lines}${dots}`;
}
function bokehField(rnd, w, h, count, dark) {
  let out = "";
  const palette = dark ? [TEAL, AQUA, "#FFFFFF", AMBER] : [TEAL, AQUA, "#FFFFFF"];
  for (let i = 0; i < count; i++) {
    const r = w * (0.05 + rnd() * 0.11);
    out += `<circle cx="${(rnd() * w).toFixed(1)}" cy="${(rnd() * h).toFixed(1)}" r="${r.toFixed(1)}" fill="${pick(rnd, palette)}" opacity="${(0.08 + rnd() * 0.16).toFixed(2)}" filter="url(#blurL)"/>`;
  }
  return out;
}
function skyWall(w, h, top, bottom, dir) {
  return `<defs><linearGradient id="skyGrad" x1="${dir.x1}" y1="${dir.y1}" x2="${dir.x2}" y2="${dir.y2}"><stop offset="0%" stop-color="${top}"/><stop offset="100%" stop-color="${bottom}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#skyGrad)"/>`;
}
const DIRECTIONS = [
  { x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
  { x1: "100%", y1: "0%", x2: "0%", y2: "100%" },
  { x1: "20%", y1: "0%", x2: "80%", y2: "100%" },
];

// --------------------------------------------------------------------------- Template: interior room
function interiorRoom(rnd, w, h, opts) {
  const { hue = 0, populate = "machines", person = true, crates = false, dark = false, biasRight = false } = opts;
  const vpx = w * (biasRight ? 0.56 + rnd() * 0.1 : 0.4 + rnd() * 0.16);
  const vpy = h * (0.26 + rnd() * 0.07);
  const wallTop = mix(dark ? INK : GRAPHITE, TEAL_DEEP, 0.1 + rnd() * 0.1);
  const wallBottom = mix(TEAL_DEEP, dark ? "#1B4440" : TEAL, 0.55);
  const floorNear = mix(dark ? "#0E1D1B" : GRAPHITE2, TEAL_DEEP, 0.3);
  const floorFar = atmo(floorNear, 0.38);
  let out = `<defs>
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${wallTop}"/><stop offset="100%" stop-color="${wallBottom}"/></linearGradient>
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${floorFar}"/><stop offset="100%" stop-color="${floorNear}"/></linearGradient>
  </defs>`;
  out += `<rect width="${w}" height="${vpy}" fill="url(#wallGrad)"/>`;
  out += floorPlane(w, h, vpx, vpy, floorNear, wallTop);
  // trusses: two beams receding toward the vanishing point
  out += trussBeam(w, vpy * 0.1, 1, vpx / w, "0.9");
  out += trussBeam(w, vpy * 0.42, 0.55, vpx / w, "0.75");
  // lamps along depth, hung from the trusses
  const lampDepths = [0.22, 0.6];
  for (const t of lampDepths) {
    const lx = lerp(w * (biasRight ? 0.42 : 0.22), vpx, t) + (rnd() - 0.5) * w * 0.06;
    const ly = lerp(vpy * 0.55, vpy * 0.85, t);
    const floorY = lerp(h * 0.9, vpy + (h - vpy) * 0.4, t);
    out += lampUnit(lx, ly, floorY, lerp(1.15, 0.5, t), true, (0.9 - t * 0.25).toFixed(2));
  }
  // subject row (machines or shelves), near -> far, offset toward right for hero calm-left
  const depths = [0.1, 0.4, 0.68];
  for (const t of depths) {
    const x = lerp(w * (biasRight ? 0.74 : 0.62), vpx + w * 0.02, t) + (rnd() - 0.5) * w * 0.03;
    const y = lerp(h * 0.88, vpy + (h - vpy) * 0.46, t);
    const scale = lerp(1.35, 0.26, t) * (w / 1800);
    const tint = atmo(mix(TEAL, AQUA, 0.12), t * 0.9);
    if (populate === "shelves") out += shelfRack(x, y, scale * 0.9, atmo(mix(GRAPHITE2, TEAL, 0.25), t), (0.95 - t * 0.3).toFixed(2));
    else if (populate === "machines") out += machineUnit("gantry", x, y, scale, rnd() > 0.5, tint, (0.98 - t * 0.3).toFixed(2));
  }
  if (person) {
    const px = lerp(w * (biasRight ? 0.5 : 0.36), vpx, 0.26);
    const py = h * 0.85;
    out += personFig(px, py, 1.05 * (w / 1800), rnd() > 0.5, false, mix(GRAPHITE, TEAL, 0.15), 0.94);
  }
  if (crates) {
    out += crateShape(w * (biasRight ? 0.1 : 0.85), h * 0.9, 0.9 * (w / 1600), atmo(GRAPHITE2, 0.05), 0.9);
    out += crateShape(w * (biasRight ? 0.06 : 0.9), h * 0.98, 0.7 * (w / 1600), atmo(GRAPHITE, 0.1), 0.85);
  }
  return out;
}

// --------------------------------------------------------------------------- Template: machine working
function machineWorking(rnd, w, h, opts) {
  const { kind = "gantry", sparks = true, hero = false, installation = false, finishedParts = false } = opts;
  const dir = pick(rnd, DIRECTIONS);
  const top = mix(INK, TEAL_DEEP, 0.35);
  const bottom = mix(TEAL_DEEP, TEAL, 0.5);
  let out = skyWall(w, h, top, bottom, dir);
  const vpx = w * (0.5 + (rnd() - 0.5) * 0.2), vpy = h * 0.58;
  out += `<defs><linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${mix(bottom, HAZE, 0.1)}"/><stop offset="100%" stop-color="${mix(GRAPHITE, TEAL_DEEP, 0.4)}"/></linearGradient></defs>`;
  out += floorPlane(w, h, vpx, vpy, bottom, top);
  const mx = w * (hero ? 0.6 : 0.52), my = h * 0.58, scale = (hero ? 1.55 : 1.7) * (w / 1900);
  out += lampUnit(mx - scale * 60, h * 0.05, my - scale * 40, 1.5, true, "0.85");
  out += machineUnit(kind, mx, my, scale, rnd() > 0.5, mix(TEAL, AQUA, 0.1), 0.98);
  const workX = mx + (kind === "tube" ? scale * 40 : scale * -6), workY = my + scale * (kind === "robot" ? -50 : 4);
  if (sparks) out += sparkBurst(workX, workY, rnd, scale * 1.1);
  if (installation) {
    out += `<line x1="${(mx - scale * 40).toFixed(1)}" y1="${(my - scale * 60).toFixed(1)}" x2="${(mx - scale * 4).toFixed(1)}" y2="${(h * 0.06).toFixed(1)}" stroke="${HAZE}" stroke-width="4" opacity="0.5"/>
      <line x1="${(mx + scale * 40).toFixed(1)}" y1="${(my - scale * 60).toFixed(1)}" x2="${(mx + scale * 4).toFixed(1)}" y2="${(h * 0.06).toFixed(1)}" stroke="${HAZE}" stroke-width="4" opacity="0.5"/>`;
    out += personFig(mx - scale * 130, h * 0.87, 0.9 * (w / 1800), false, true, GRAPHITE, 0.9);
  }
  if (finishedParts) {
    for (let i = 0; i < 3; i++) {
      const px = w * (0.14 + i * 0.09), py = h * (0.86 + i * 0.02);
      out += `<rect x="${(px - 30).toFixed(1)}" y="${(py - 8).toFixed(1)}" width="60" height="16" rx="3" fill="${mix(AQUA, HAZE, 0.4)}" opacity="0.85"/>`;
    }
  }
  out += `<g opacity="0.14" filter="url(#blurM)"><rect x="0" y="${(h * 0.7).toFixed(1)}" width="${(w * 0.12).toFixed(1)}" height="${(h * 0.3).toFixed(1)}" fill="${INK}"/></g>`;
  return out;
}

// --------------------------------------------------------------------------- Template: macro
function macroShot(rnd, w, h, opts) {
  const { subject = "cuttingHead" } = opts;
  let out = `<rect width="${w}" height="${h}" fill="${mix(INK, TEAL_DEEP, 0.4)}"/>`;
  out += bokehField(rnd, w, h, 10, true);
  const cx = w * (0.46 + (rnd() - 0.5) * 0.1), cy = h * (0.5 + (rnd() - 0.5) * 0.1);
  if (subject === "cuttingHead" || subject === "sparks") {
    out += `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})">
      <rect x="-46" y="-220" width="92" height="200" rx="14" fill="${GRAPHITE2}"/>
      <polygon points="-30,-24 30,-24 12,60 -12,60" fill="${GRAPHITE}"/>
      <circle cx="0" cy="56" r="10" fill="${AMBER}" opacity="0.9" filter="url(#blurXS)"/>
      <rect x="60" y="30" width="${w * 0.6}" height="10" rx="4" fill="${HAZE}" opacity="0.14"/>
    </g>`;
    out += sparkBurst(cx, cy + 60, rnd, subject === "sparks" ? 2.2 : 1.4, subject === "sparks" ? 20 : 13);
  } else if (subject === "qualityCheck") {
    out += `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})">
      <rect x="-160" y="-22" width="320" height="44" rx="8" fill="${GRAPHITE2}"/>
      <rect x="-190" y="-64" width="40" height="128" rx="6" fill="${GRAPHITE}"/>
      <rect x="150" y="-64" width="40" height="128" rx="6" fill="${GRAPHITE}"/>
      <rect x="-40" y="34" width="130" height="46" rx="6" fill="${INK}"/>
      <text x="-30" y="66" font-family="monospace" font-size="30" fill="${AQUA}">24.05</text>
    </g>`;
    out += personFig(cx - w * 0.22, cy + h * 0.22, 0.7 * (w / 1600), false, false, GRAPHITE, 0.85);
  } else if (subject === "controlPanel") {
    out += `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})">
      <rect x="-320" y="-220" width="640" height="440" rx="18" fill="${GRAPHITE2}"/>
      <rect x="-280" y="-180" width="560" height="300" rx="8" fill="${INK}"/>
      <polyline points="-260,-40 -200,-90 -140,-20 -80,-110 -20,-30 40,-120 100,-40 160,-70 220,10" fill="none" stroke="${AQUA}" stroke-width="5" opacity="0.85"/>
      <circle cx="-240" cy="120" r="16" fill="${AMBER}" opacity="0.9"/><circle cx="-190" cy="120" r="16" fill="${AQUA}" opacity="0.9"/><circle cx="-140" cy="120" r="16" fill="${HAZE}" opacity="0.5"/>
      <rect x="-320" y="150" width="640" height="70" rx="10" fill="${GRAPHITE}"/>
      <circle cx="240" cy="185" r="26" fill="${AMBER}" opacity="0.95" filter="url(#blurXS)"/>
    </g>`;
  }
  return out;
}

// --------------------------------------------------------------------------- Template: people scene
function peopleScene(rnd, w, h, opts) {
  const { scene = "office", hero = false } = opts;
  const dir = pick(rnd, DIRECTIONS);
  const top = mix(hero ? INK : GRAPHITE, TEAL_DEEP, 0.3);
  const bottom = mix(TEAL_DEEP, hero ? "#123632" : TEAL, 0.45);
  let out = skyWall(w, h, top, bottom, dir);
  const vpx = w * 0.5, vpy = h * 0.34;
  out += `<defs><linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${atmo(bottom, 0.5)}"/><stop offset="100%" stop-color="${mix(GRAPHITE2, TEAL_DEEP, 0.3)}"/></linearGradient></defs>`;
  out += floorPlane(w, h, vpx, vpy, bottom, top);
  const winX = w * 0.72;
  for (let i = 0; i < 6; i++) {
    out += `<rect x="${(winX + i * 26).toFixed(1)}" y="0" width="6" height="${h * 0.5}" fill="${HAZE}" opacity="0.05" filter="url(#blurS)"/>`;
  }
  if (scene === "training") {
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const t = 0.3 + row * 0.3;
        const x = lerp(w * 0.24, w * 0.74, col / 2) + (rnd() - 0.5) * 20;
        const y = h * (0.62 + row * 0.16);
        const s = lerp(0.55, 0.85, row) * (w / 1700);
        out += `<rect x="${(x - 40 * s).toFixed(1)}" y="${(y - 6 * s).toFixed(1)}" width="${(80 * s).toFixed(1)}" height="${(6 * s).toFixed(1)}" rx="2" fill="${GRAPHITE}" opacity="0.85"/>
          <rect x="${(x - 26 * s).toFixed(1)}" y="${(y - 34 * s).toFixed(1)}" width="${(52 * s).toFixed(1)}" height="${(30 * s).toFixed(1)}" rx="2" fill="${GRAPHITE2}" opacity="0.9"/>
          <rect x="${(x - 22 * s).toFixed(1)}" y="${(y - 30 * s).toFixed(1)}" width="${(44 * s).toFixed(1)}" height="${(22 * s).toFixed(1)}" fill="${AQUA}" opacity="0.28"/>`;
        if (row === 1) out += personFig(x, y + 30 * s, s * 1.5, rnd() > 0.5, false, atmo(GRAPHITE, 0.1), 0.85);
      }
    }
    out += `<rect x="${(w * 0.34).toFixed(1)}" y="${(h * 0.18).toFixed(1)}" width="${(w * 0.32).toFixed(1)}" height="${(h * 0.22).toFixed(1)}" rx="6" fill="${INK}" opacity="0.8"/>
      <polyline points="${w * 0.38},${h * 0.34} ${w * 0.43},${h * 0.24} ${w * 0.49},${h * 0.3} ${w * 0.55},${h * 0.2} ${w * 0.62},${h * 0.28}" fill="none" stroke="${AQUA}" stroke-width="4" opacity="0.7"/>`;
    out += personFig(w * 0.3, h * 0.68, 0.9 * (w / 1700), false, true, GRAPHITE, 0.92);
  } else if (scene === "office" || scene === "desk") {
    const dx = w * (scene === "desk" ? 0.5 : 0.5), dy = h * 0.72;
    const s = (scene === "desk" ? 1.5 : 1.1) * (w / 1700);
    out += `<rect x="${(dx - 210 * s).toFixed(1)}" y="${(dy - 4 * s).toFixed(1)}" width="${(420 * s).toFixed(1)}" height="${(16 * s).toFixed(1)}" rx="4" fill="${GRAPHITE2}"/>
      <rect x="${(dx - 80 * s).toFixed(1)}" y="${(dy - 130 * s).toFixed(1)}" width="${(160 * s).toFixed(1)}" height="${(112 * s).toFixed(1)}" rx="6" fill="${GRAPHITE}"/>
      <rect x="${(dx - 68 * s).toFixed(1)}" y="${(dy - 120 * s).toFixed(1)}" width="${(136 * s).toFixed(1)}" height="${(88 * s).toFixed(1)}" fill="${AQUA}" opacity="0.22"/>
      <rect x="${(dx - 8 * s).toFixed(1)}" y="${(dy - 18 * s).toFixed(1)}" width="${(16 * s).toFixed(1)}" height="${(18 * s).toFixed(1)}" fill="${GRAPHITE2}"/>
      <rect x="${(dx - 150 * s).toFixed(1)}" y="${(dy - 12 * s).toFixed(1)}" width="${(70 * s).toFixed(1)}" height="${(10 * s).toFixed(1)}" rx="3" fill="${GRAPHITE}"/>
      <ellipse cx="${(dx + 130 * s).toFixed(1)}" cy="${(dy - 40 * s).toFixed(1)}" rx="${(14 * s).toFixed(1)}" ry="${(46 * s).toFixed(1)}" fill="${TEAL}" opacity="0.5"/>`;
    if (scene === "office") out += personFig(dx - 20 * s, dy + 80 * s, s * 1.1, false, false, atmo(GRAPHITE, 0.05), 0.9);
  } else if (scene === "badges") {
    for (let i = 0; i < 4; i++) {
      const x = lerp(w * 0.2, w * 0.8, i / 3), y = h * 0.34, s = 0.9 * (w / 1700);
      out += `<rect x="${(x - 60 * s).toFixed(1)}" y="${(y - 74 * s).toFixed(1)}" width="${(120 * s).toFixed(1)}" height="${(148 * s).toFixed(1)}" rx="6" fill="${GRAPHITE2}" opacity="0.92"/>
        <path d="M${x},${(y - 46 * s).toFixed(1)} c${34 * s},${6 * s} ${58 * s},${24 * s} ${58 * s},${52 * s} c0,${38 * s} -${30 * s},${68 * s} -${58 * s},${86 * s} c-${28 * s},-${18 * s} -${58 * s},-${48 * s} -${58 * s},-${86 * s} c0,-${28 * s} ${24 * s},-${46 * s} ${58 * s},-${52 * s} Z" fill="${AMBER}" opacity="0.75" transform="translate(-${x},0)" />
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(30 * s).toFixed(1)}" fill="${WARM}" opacity="0.4"/>`;
      out += `<ellipse cx="${x.toFixed(1)}" cy="${(y - 90 * s).toFixed(1)}" rx="${(70 * s).toFixed(1)}" ry="${(18 * s).toFixed(1)}" fill="${HAZE}" opacity="0.18" filter="url(#blurM)"/>`;
    }
  } else if (scene === "team") {
    const positions = [[-150, 0.86], [10, 0.9], [150, 0.86]];
    for (const [ox, yf] of positions) out += personFig(w / 2 + ox * (w / 1700), h * yf, 1.1 * (w / 1700), ox > 0, false, atmo(GRAPHITE, 0.05), 0.94);
  } else if (scene === "service") {
    const mx = w * 0.62, my = h * 0.62, s = 1.3 * (w / 1700);
    out += machineUnit("gantry", mx, my, s * 0.9, true, mix(GRAPHITE, TEAL_DEEP, 0.15), 0.8);
    out += `<rect x="${(mx - 30 * s).toFixed(1)}" y="${(my - 10 * s).toFixed(1)}" width="${(60 * s).toFixed(1)}" height="${(50 * s).toFixed(1)}" fill="${INK}" opacity="0.85"/>
      <path d="M${(mx - 20 * s).toFixed(1)},${(my + 4 * s).toFixed(1)} q${10 * s},${14 * s} ${20 * s},0 t${20 * s},0" fill="none" stroke="${AMBER}" stroke-width="2" opacity="0.6"/>
      <circle cx="${(mx + 10 * s).toFixed(1)}" cy="${(my + 20 * s).toFixed(1)}" r="4" fill="${AQUA}"/>`;
    out += personFig(mx - 90 * s, h * (hero ? 0.9 : 0.87), s * 1.3, false, true, GRAPHITE, 0.95);
    out += `<rect x="${(mx - 200 * s).toFixed(1)}" y="${(h * 0.92).toFixed(1)}" width="${(70 * s).toFixed(1)}" height="${(40 * s).toFixed(1)}" rx="4" fill="${GRAPHITE2}" opacity="0.9"/>`;
  }
  return out;
}

// --------------------------------------------------------------------------- Template: outdoor
function outdoorScene(rnd, w, h, opts) {
  const { subject = "port" } = opts;
  const duskTop = mix(INK, TEAL_DEEP, 0.35), duskMid = mix(TEAL_DEEP, "#2A6B62", 0.5);
  let out = `<defs><linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${duskTop}"/><stop offset="62%" stop-color="${duskMid}"/><stop offset="100%" stop-color="${mix(AMBER, duskMid, 0.55)}"/>
    </linearGradient></defs><rect width="${w}" height="${h}" fill="url(#skyGrad)"/>`;
  const horizon = h * 0.62;
  out += `<rect y="${horizon.toFixed(1)}" width="${w}" height="${(h - horizon).toFixed(1)}" fill="url(#waterGrad)"/>
    <defs><linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${mix(duskMid, TEAL_DEEP, 0.5)}"/><stop offset="100%" stop-color="${mix(GRAPHITE2, TEAL_DEEP, 0.6)}"/></linearGradient></defs>
    <ellipse cx="${(w * 0.5).toFixed(1)}" cy="${horizon.toFixed(1)}" rx="${(w * 0.36).toFixed(1)}" ry="${(h * 0.05).toFixed(1)}" fill="${AMBER}" opacity="0.4" filter="url(#blurS)"/>`;
  for (let i = 0; i < 8; i++) {
    const y = horizon + (h - horizon) * (i / 8) + rnd() * 4;
    out += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${y.toFixed(1)}" stroke="${AMBER}" stroke-width="1" opacity="${(0.09 * (1 - i / 8)).toFixed(3)}"/>`;
  }
  if (subject === "port" || subject === "crate") {
    const containerColors = [mix(TEAL, GRAPHITE2, 0.3), mix(AMBER, GRAPHITE2, 0.55), GRAPHITE2];
    for (let stack = 0; stack < 5; stack++) {
      const sx = w * (0.06 + stack * 0.1), depth = stack / 5, s = lerp(1, 0.55, depth);
      const rows = 2 + Math.floor(rnd() * 2);
      for (let r = 0; r < rows; r++) {
        const cy = horizon - r * 56 * s;
        out += `<rect x="${sx.toFixed(1)}" y="${(cy - 56 * s).toFixed(1)}" width="${(96 * s).toFixed(1)}" height="${(56 * s).toFixed(1)}" fill="${atmo(pick(rnd, containerColors), depth)}" opacity="0.95"/>
          <rect x="${sx.toFixed(1)}" y="${(cy - 56 * s).toFixed(1)}" width="${(96 * s).toFixed(1)}" height="6" fill="#FFFFFF" opacity="0.08"/>`;
      }
    }
    // crane
    const cx = w * 0.7;
    out += `<rect x="${(cx - 8).toFixed(1)}" y="${(h * 0.14).toFixed(1)}" width="16" height="${(horizon - h * 0.14).toFixed(1)}" fill="${GRAPHITE}"/>
      <polygon points="${(cx - 8).toFixed(1)},${(h * 0.16).toFixed(1)} ${(cx + 220).toFixed(1)},${(h * 0.1).toFixed(1)} ${(cx + 220).toFixed(1)},${(h * 0.16).toFixed(1)} ${(cx + 8).toFixed(1)},${(h * 0.22).toFixed(1)}" fill="${GRAPHITE}"/>
      <line x1="${(cx + 190).toFixed(1)}" y1="${(h * 0.11).toFixed(1)}" x2="${(cx + 190).toFixed(1)}" y2="${(h * 0.3).toFixed(1)}" stroke="${GRAPHITE}" stroke-width="4"/>
      <rect x="${(cx + 170).toFixed(1)}" y="${(h * 0.3).toFixed(1)}" width="40" height="20" fill="${AMBER}" opacity="0.85"/>`;
    if (subject === "crate") {
      out += crateShape(w * 0.28, h * 0.86, 1.3 * (w / 1600), mix(GRAPHITE2, TEAL, 0.1), 0.95);
      out += crateShape(w * 0.4, h * 0.92, 1 * (w / 1600), GRAPHITE2, 0.9);
      out += `<rect x="${(w * 0.1).toFixed(1)}" y="${(h * 0.9).toFixed(1)}" width="${(w * 0.12).toFixed(1)}" height="10" fill="${GRAPHITE}"/>
        <rect x="${(w * 0.09).toFixed(1)}" y="${(h * 0.76).toFixed(1)}" width="10" height="${(h * 0.14).toFixed(1)}" fill="${GRAPHITE}"/>`;
      out += personFig(w * 0.2, h * 0.9, 1 * (w / 1600), false, true, GRAPHITE, 0.95);
    } else {
      out += `<polygon points="${(w * 0.55).toFixed(1)},${horizon.toFixed(1)} ${(w * 0.98).toFixed(1)},${horizon.toFixed(1)} ${(w * 0.92).toFixed(1)},${(horizon - h * 0.08).toFixed(1)} ${(w * 0.6).toFixed(1)},${(horizon - h * 0.08).toFixed(1)}" fill="${atmo(GRAPHITE2, 0.4)}"/>
        <rect x="${(w * 0.62).toFixed(1)}" y="${(horizon - h * 0.15).toFixed(1)}" width="8" height="${(h * 0.08).toFixed(1)}" fill="${atmo(GRAPHITE, 0.4)}"/>`;
    }
  } else if (subject === "city") {
    for (let i = 0; i < 7; i++) {
      const bx = (i / 7) * w, depth = 0.2 + (i % 3) * 0.2, bw = w * 0.07, bh = h * (0.18 + rnd() * 0.28);
      out += `<rect x="${bx.toFixed(1)}" y="${(horizon - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${atmo(GRAPHITE, depth)}" opacity="${(0.95 - depth * 0.3).toFixed(2)}"/>`;
      for (let wi = 0; wi < 4; wi++) out += `<rect x="${(bx + 8 + wi * (bw / 4)).toFixed(1)}" y="${(horizon - bh + 12).toFixed(1)}" width="4" height="${(bh - 24).toFixed(1)}" fill="${AMBER}" opacity="0.05"/>`;
    }
    out += `<rect x="${(w * 0.06).toFixed(1)}" y="${(h * 0.5).toFixed(1)}" width="18" height="${(horizon - h * 0.5).toFixed(1)}" fill="${GRAPHITE}"/>`;
  } else if (subject === "pin") {
    out += `<g transform="translate(${(w * 0.55).toFixed(1)} ${(h * 0.42).toFixed(1)})">
      <path d="M0,-140 C70,-140 122,-92 122,-32 C122,44 0,140 0,140 C0,140 -122,44 -122,-32 C-122,-92 -70,-140 0,-140 Z" fill="${TEAL}" opacity="0.85"/>
      <circle cx="0" cy="-32" r="34" fill="${HAZE}" opacity="0.9"/>
      <circle cx="0" cy="0" r="180" fill="none" stroke="${AQUA}" stroke-width="2" opacity="0.3"/>
      <circle cx="0" cy="0" r="240" fill="none" stroke="${AQUA}" stroke-width="1.5" opacity="0.18"/>
    </g>`;
    out += `<rect x="${(w * 0.1).toFixed(1)}" y="${horizon.toFixed(1)}" width="${(w * 0.3).toFixed(1)}" height="${(h - horizon).toFixed(1)}" fill="${atmo(GRAPHITE2, 0.4)}" opacity="0.6"/>`;
  } else if (subject === "globe") {
    const gx = w * 0.5, gy = h * 0.48, gr = Math.min(w, h) * 0.28;
    out += `<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="${gr.toFixed(1)}" fill="none" stroke="${AQUA}" stroke-width="2" opacity="0.4"/>
      <ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="${gr.toFixed(1)}" ry="${(gr * 0.35).toFixed(1)}" fill="none" stroke="${AQUA}" stroke-width="1.5" opacity="0.28"/>
      <ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="${(gr * 0.42).toFixed(1)}" ry="${gr.toFixed(1)}" fill="none" stroke="${AQUA}" stroke-width="1.5" opacity="0.28"/>
      <circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="${gr.toFixed(1)}" fill="${TEAL}" opacity="0.08"/>`;
    for (let i = 0; i < 6; i++) {
      const a = rnd() * Math.PI * 2, r = gr * (0.6 + rnd() * 0.4);
      const dx = gx + Math.cos(a) * r, dy = gy + Math.sin(a) * r * 0.6;
      out += `<circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="4" fill="${AMBER}" opacity="0.8"/>
        <path d="M${gx},${gy} Q${((gx + dx) / 2).toFixed(1)},${(gy - 60).toFixed(1)} ${dx.toFixed(1)},${dy.toFixed(1)}" fill="none" stroke="${AMBER}" stroke-width="1.4" opacity="0.35"/>`;
    }
  }
  return out;
}

// --------------------------------------------------------------------------- key -> builder registry
const SCENES = {
  "hero-home": (r, w, h) => interiorRoom(r, w, h, { populate: "machines", person: true, crates: true, dark: true, biasRight: true }),
  "hero-products": (r, w, h) => interiorRoom(r, w, h, { populate: "machines", person: false, crates: false, dark: true, biasRight: true }),
  "hero-fiber": (r, w, h) => machineWorking(r, w, h, { kind: "gantry", sparks: true, hero: true }),
  "hero-tube": (r, w, h) => machineWorking(r, w, h, { kind: "tube", sparks: true, hero: true }),
  "hero-co2": (r, w, h) => machineWorking(r, w, h, { kind: "co2", sparks: true, hero: true }),
  "hero-welding": (r, w, h) => machineWorking(r, w, h, { kind: "robot", sparks: true, hero: true }),
  "hero-product": (r, w, h) => machineWorking(r, w, h, { kind: "gantry", sparks: false, hero: true }),
  "hero-repair": (r, w, h) => peopleScene(r, w, h, { scene: "service", hero: true }),
  "hero-training": (r, w, h) => peopleScene(r, w, h, { scene: "training", hero: true }),
  "hero-jobwork": (r, w, h) => machineWorking(r, w, h, { kind: "gantry", sparks: false, hero: true, finishedParts: true }),
  "hero-about": (r, w, h) => interiorRoom(r, w, h, { populate: "none", person: true, crates: false, dark: true, biasRight: true }),
  "hero-contact": (r, w, h) => peopleScene(r, w, h, { scene: "desk", hero: true }),
  "hero-certifications": (r, w, h) => peopleScene(r, w, h, { scene: "badges", hero: true }),
  "hero-india": (r, w, h) => outdoorScene(r, w, h, { subject: "pin" }),
  "hero-state": (r, w, h) => outdoorScene(r, w, h, { subject: "pin" }),
  "hero-city": (r, w, h) => outdoorScene(r, w, h, { subject: "city" }),
  "hero-export": (r, w, h) => outdoorScene(r, w, h, { subject: "port" }),
  "hero-country": (r, w, h) => outdoorScene(r, w, h, { subject: "globe" }),
  "slot-factory": (r, w, h) => interiorRoom(r, w, h, { populate: "machines", person: true, crates: false, dark: false }),
  "slot-assembly": (r, w, h) => interiorRoom(r, w, h, { populate: "machines", person: true, crates: true, dark: false }),
  "slot-cutting-head": (r, w, h) => macroShot(r, w, h, { subject: "cuttingHead" }),
  "slot-sparks": (r, w, h) => macroShot(r, w, h, { subject: "sparks" }),
  "slot-tube-cutting": (r, w, h) => machineWorking(r, w, h, { kind: "tube", sparks: true }),
  "slot-robot-weld": (r, w, h) => machineWorking(r, w, h, { kind: "robot", sparks: true }),
  "slot-control-panel": (r, w, h) => macroShot(r, w, h, { subject: "controlPanel" }),
  "slot-engineer-service": (r, w, h) => peopleScene(r, w, h, { scene: "service" }),
  "slot-training-room": (r, w, h) => peopleScene(r, w, h, { scene: "training" }),
  "slot-crate-shipping": (r, w, h) => outdoorScene(r, w, h, { subject: "crate" }),
  "slot-port": (r, w, h) => outdoorScene(r, w, h, { subject: "port" }),
  "slot-team": (r, w, h) => peopleScene(r, w, h, { scene: "team" }),
  "slot-office": (r, w, h) => peopleScene(r, w, h, { scene: "office" }),
  "slot-installation": (r, w, h) => machineWorking(r, w, h, { kind: "gantry", sparks: false, installation: true }),
  "slot-quality-check": (r, w, h) => macroShot(r, w, h, { subject: "qualityCheck" }),
  "slot-warehouse-spares": (r, w, h) => interiorRoom(r, w, h, { populate: "shelves", person: false, crates: false, dark: false }),
};

function photoSvg(key, width, height) {
  const rnd = mulberry32(hashSeed(key));
  const dark = key.startsWith("hero-");
  const builder = SCENES[key];
  let inner = calmGradDef + builder(rnd, width, height);
  if (dark) inner += leftCalm(width, height);
  return wrap(key, width, height, inner, {
    dark,
    grainOp: (0.05 + rnd() * 0.025).toFixed(3),
    vignetteOp: dark ? 0.5 : 0.32,
  });
}

const HERO_KEYS = [
  "hero-home", "hero-products", "hero-fiber", "hero-tube", "hero-co2", "hero-welding",
  "hero-product", "hero-repair", "hero-training", "hero-jobwork", "hero-about", "hero-contact",
  "hero-certifications", "hero-india", "hero-state", "hero-city", "hero-export", "hero-country",
];
const SLOT_KEYS = [
  "slot-factory", "slot-assembly", "slot-cutting-head", "slot-sparks", "slot-tube-cutting",
  "slot-robot-weld", "slot-control-panel", "slot-engineer-service", "slot-training-room",
  "slot-crate-shipping", "slot-port", "slot-team", "slot-office", "slot-installation",
  "slot-quality-check", "slot-warehouse-spares",
];

async function emit(key, width, height, quality) {
  const svg = photoSvg(key, width, height);
  const outPath = join(OUT_DIR, `${key}.webp`);
  await mkdir(dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg)).webp({ quality, effort: 6 }).toFile(outPath);
  return outPath;
}

async function main() {
  const written = [];
  for (const key of HERO_KEYS) written.push(await emit(key, 1920, 1080, 80));
  for (const key of SLOT_KEYS) written.push(await emit(key, 1600, 1200, 78));

  console.log(`Generated ${written.length} photos:`);
  let missing = 0, totalBytes = 0, over = 0;
  for (const path of written) {
    const isHero = path.includes("hero-");
    const budget = isHero ? 220 : 180;
    if (!existsSync(path)) {
      missing += 1;
      console.log(`  MISSING  ${path.replace(ROOT, ".")}`);
      continue;
    }
    const { size } = await stat(path);
    totalBytes += size;
    const kb = size / 1024;
    if (kb > budget) over += 1;
    console.log(`  ${kb > budget ? "OVER" : "ok  "}  ${kb.toFixed(1).padStart(7)} KB  ${path.replace(ROOT, ".")}`);
  }
  console.log(`Total: ${(totalBytes / 1024).toFixed(0)} KB across ${written.length} files.`);
  if (missing > 0 || over > 0) {
    if (missing > 0) console.error(`${missing} file(s) failed to write.`);
    if (over > 0) console.error(`${over} file(s) exceed budget.`);
    process.exitCode = 1;
  } else {
    console.log("All photos confirmed on disk, within budget.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
