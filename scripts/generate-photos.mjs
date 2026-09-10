#!/usr/bin/env node
/**
 * scripts/generate-photos.mjs — ADR-0007 §3: generates every placeholder photo under
 * `/public/photos` (`node scripts/generate-photos.mjs`) referenced by `lib/photos.ts`.
 * Each is a self-contained SVG — layered graphite→teal→white-haze gradient (direction
 * seeded per key for a varying "light direction"), depth-of-field bokeh circles
 * (blurred radial gradients), a couple of blurred light streaks, a faint converging
 * perspective grid, a low-opacity vignette, film grain (`feTurbulence`), and a small
 * low-opacity line-art silhouette relevant to the key (machine / hall / crate / person
 * / …) — rasterised with sharp at WebP q78. `hero-*` render 1920×1080, `slot-*`
 * 1600×1200 (ADR-0007 §3). Every value that drives composition (hue shift, gradient
 * direction, bokeh/streak placement, silhouette position/scale/mirror) is derived from
 * a PRNG seeded on the key's own filename, so re-running this script is deterministic
 * (safe to regenerate) while every key still looks distinct from every other. Drop a
 * same-named real photo into /public/photos later and stop regenerating that one key
 * to replace it permanently — nothing else in the design system needs to change.
 */
import { mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "photos");

const GRAPHITE = "#1F2A2A";
const TEAL = "#0F766E";
const AQUA = "#5EEAD4";
const HAZE = "#F6F8F9";

// ---------------------------------------------------------------------------
// Seeded PRNG (mulberry32) — deterministic per photo key, so composition varies
// key-to-key but is stable across repeated runs.
// ---------------------------------------------------------------------------
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
function pick(rnd, arr) {
  return arr[Math.floor(rnd() * arr.length)];
}

// ---------------------------------------------------------------------------
// Colour: hex <-> HSL, used to hue-shift the graphite/teal gradient stops per key.
// ---------------------------------------------------------------------------
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]) {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}
function hslToRgb(h, s, l) {
  h /= 360;
  if (s === 0) return [l * 255, l * 255, l * 255];
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue2rgb(p, q, h + 1 / 3) * 255, hue2rgb(p, q, h) * 255, hue2rgb(p, q, h - 1 / 3) * 255];
}
function shiftHue(hex, degrees) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  return rgbToHex(hslToRgb((h + degrees + 360) % 360, s, l));
}

// ---------------------------------------------------------------------------
// Line-art silhouettes — simple filled/stroked shapes in a local -220..220 ×
// -160..170 box, recomposed per key with a seeded position/scale/mirror. Each
// returns { markup, mode: "fill" | "stroke" }. `rnd` lets a shape vary its own
// internal geometry too (sparks); most just ignore it.
// ---------------------------------------------------------------------------
function personMarkup(tool = false) {
  return `
    <circle cx="0" cy="-96" r="28"/>
    <path d="M-34,-64 L34,-64 L44,58 C44,70 34,78 22,78 L-22,78 C-34,78 -44,70 -44,58 Z"/>
    <rect x="-30" y="78" width="20" height="82" rx="8"/>
    <rect x="10" y="78" width="20" height="82" rx="8"/>
    ${tool ? `<rect x="26" y="-44" width="74" height="16" rx="6" transform="rotate(-20 26 -44)"/>` : ""}
  `;
}
function sparksMarkup(rnd) {
  let out = "";
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 1.3 - Math.PI * 0.65 + (rnd() - 0.5) * 0.25;
    const len = 55 + rnd() * 85;
    out += `<line x1="0" y1="0" x2="${(Math.cos(a) * len).toFixed(1)}" y2="${(Math.sin(a) * len).toFixed(1)}" stroke-width="5"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const a = rnd() * Math.PI * 2;
    const r = 40 + rnd() * 100;
    out += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="${(2 + rnd() * 3).toFixed(1)}" stroke-width="0" fill="currentColor"/>`;
  }
  return out;
}

const SILHOUETTES = {
  machine: () => ({
    mode: "fill",
    markup: `
      <rect x="-200" y="60" width="400" height="22" rx="6"/>
      <rect x="-170" y="-30" width="18" height="92" rx="4"/>
      <rect x="152" y="-30" width="18" height="92" rx="4"/>
      <rect x="-185" y="-52" width="370" height="24" rx="6"/>
      <rect x="-9" y="-28" width="18" height="70" rx="3"/>
      <rect x="150" y="-10" width="50" height="66" rx="8"/>
      <rect x="164" y="4" width="22" height="14" rx="2"/>
    `,
  }),
  hall: () => ({
    mode: "fill",
    markup: `
      <rect x="-220" y="10" width="440" height="150"/>
      <polygon points="-232,10 0,-96 232,10"/>
      <rect x="-34" y="86" width="68" height="74"/>
      <rect x="-176" y="34" width="30" height="30"/>
      <rect x="-118" y="34" width="30" height="30"/>
      <rect x="88" y="34" width="30" height="30"/>
      <rect x="146" y="34" width="30" height="30"/>
    `,
  }),
  crate: () => ({
    mode: "fill",
    markup: `
      <rect x="-64" y="-24" width="150" height="120" rx="4"/>
      <rect x="-150" y="48" width="120" height="112" rx="4"/>
      <rect x="46" y="30" width="120" height="130" rx="4"/>
    `,
  }),
  person: (rnd) => ({ mode: "fill", markup: personMarkup(rnd() > 0.5) }),
  group: () => ({
    mode: "fill",
    markup: `
      <g transform="translate(-120,26) scale(0.78)">${personMarkup(false)}</g>
      <g transform="translate(20,0) scale(1)">${personMarkup(false)}</g>
      <g transform="translate(150,30) scale(0.74)">${personMarkup(false)}</g>
    `,
  }),
  desk: () => ({
    mode: "fill",
    markup: `
      <rect x="-140" y="40" width="280" height="18" rx="4"/>
      <rect x="-120" y="58" width="16" height="72" rx="3"/>
      <rect x="104" y="58" width="16" height="72" rx="3"/>
      <rect x="-46" y="-42" width="92" height="66" rx="4"/>
      <rect x="-12" y="24" width="24" height="16" rx="2"/>
      <rect x="66" y="8" width="30" height="62" rx="10"/>
    `,
  }),
  badge: () => ({
    mode: "fill",
    markup: `<path d="M0,-124 C62,-114 112,-92 112,-60 C112,12 70,72 0,112 C-70,72 -112,12 -112,-60 C-112,-92 -62,-114 0,-124 Z"/><circle cx="0" cy="-22" r="10" fill="${HAZE}" fill-opacity="0.55"/>`,
  }),
  pin: () => ({
    mode: "fill",
    markup: `<path d="M0,-132 C62,-132 108,-86 108,-30 C108,42 0,132 0,132 C0,132 -108,42 -108,-30 C-108,-86 -62,-132 0,-132 Z"/><circle cx="0" cy="-30" r="30" fill="${HAZE}" fill-opacity="0.55"/>`,
  }),
  skyline: () => ({
    mode: "fill",
    markup: `
      <rect x="-220" y="-10" width="58" height="170"/>
      <rect x="-150" y="-60" width="50" height="220"/>
      <rect x="-90" y="10" width="46" height="150"/>
      <rect x="-34" y="-100" width="56" height="260"/>
      <rect x="34" y="-30" width="46" height="190"/>
      <rect x="90" y="20" width="50" height="140"/>
      <rect x="150" y="-50" width="60" height="210"/>
    `,
  }),
  ship: () => ({
    mode: "fill",
    markup: `
      <polygon points="-220,140 220,140 190,90 -190,90"/>
      <rect x="120" y="-150" width="16" height="240" rx="3"/>
      <polygon points="128,-118 128,-104 -170,-84 -170,-96"/>
      <rect x="-170" y="-96" width="14" height="14"/>
      <rect x="-150" y="58" width="46" height="40"/>
      <rect x="-96" y="58" width="46" height="40"/>
      <rect x="-42" y="58" width="46" height="40"/>
      <rect x="16" y="58" width="46" height="40"/>
    `,
  }),
  globe: () => ({
    mode: "stroke",
    markup: `
      <circle cx="0" cy="0" r="128" fill="none"/>
      <ellipse cx="0" cy="0" rx="128" ry="44" fill="none"/>
      <ellipse cx="0" cy="0" rx="58" ry="128" fill="none"/>
      <line x1="-128" y1="0" x2="128" y2="0"/>
    `,
  }),
  robotArm: () => ({
    mode: "fill",
    markup: `
      <rect x="-42" y="82" width="84" height="30" rx="6"/>
      <rect x="-14" y="-10" width="28" height="92" rx="10"/>
      <circle cx="0" cy="-10" r="20"/>
      <g transform="translate(0,-10) rotate(-25)"><rect x="0" y="-13" width="140" height="26" rx="10"/></g>
      <circle cx="122" cy="-56" r="16"/>
      <g transform="translate(122,-56) rotate(35)"><rect x="0" y="-11" width="96" height="22" rx="10"/></g>
      <polygon points="206,-40 238,-20 226,12 196,-2"/>
    `,
  }),
  panel: () => ({
    mode: "fill",
    markup: `
      <rect x="-150" y="-100" width="300" height="200" rx="14"/>
      <rect x="-124" y="-74" width="180" height="100" rx="6" fill="${HAZE}" fill-opacity="0.45"/>
      <polyline points="-108,-28 -68,-48 -28,-8 12,-38 52,10" fill="none" stroke="${HAZE}" stroke-width="5" stroke-opacity="0.6"/>
      <circle cx="60" cy="60" r="10"/>
      <circle cx="90" cy="60" r="10"/>
      <circle cx="120" cy="60" r="10"/>
    `,
  }),
  shelf: () => ({
    mode: "fill",
    markup: `
      <rect x="-200" y="-140" width="10" height="300"/>
      <rect x="190" y="-140" width="10" height="300"/>
      <rect x="-200" y="-140" width="400" height="10"/>
      <rect x="-200" y="-24" width="400" height="10"/>
      <rect x="-200" y="92" width="400" height="10"/>
      <rect x="-172" y="-124" width="54" height="86" rx="4"/>
      <rect x="-92" y="-120" width="64" height="82" rx="4"/>
      <rect x="8" y="-122" width="54" height="84" rx="4"/>
      <rect x="92" y="-116" width="64" height="78" rx="4"/>
      <rect x="-150" y="-8" width="64" height="86" rx="4"/>
      <rect x="-40" y="-4" width="74" height="82" rx="4"/>
      <rect x="64" y="-10" width="64" height="88" rx="4"/>
    `,
  }),
  sparks: (rnd) => ({ mode: "stroke", markup: sparksMarkup(rnd) }),
};

const SILHOUETTE_FOR = {
  "hero-home": "hall",
  "hero-products": "machine",
  "hero-fiber": "machine",
  "hero-tube": "machine",
  "hero-co2": "machine",
  "hero-welding": "person",
  "hero-product": "machine",
  "hero-repair": "person",
  "hero-training": "person",
  "hero-jobwork": "machine",
  "hero-about": "hall",
  "hero-contact": "desk",
  "hero-certifications": "badge",
  "hero-india": "pin",
  "hero-state": "pin",
  "hero-city": "skyline",
  "hero-export": "ship",
  "hero-country": "globe",
  "slot-factory": "hall",
  "slot-assembly": "machine",
  "slot-cutting-head": "machine",
  "slot-sparks": "sparks",
  "slot-tube-cutting": "machine",
  "slot-robot-weld": "robotArm",
  "slot-control-panel": "panel",
  "slot-engineer-service": "person",
  "slot-training-room": "desk",
  "slot-crate-shipping": "crate",
  "slot-port": "ship",
  "slot-team": "group",
  "slot-office": "desk",
  "slot-installation": "machine",
  "slot-quality-check": "person",
  "slot-warehouse-spares": "shelf",
};
// A second, smaller sparks accent rides alongside the primary silhouette on the
// two keys where cutting/welding sparks are the point of the shot.
const SPARK_ACCENT = new Set(["hero-welding", "slot-robot-weld", "hero-fiber", "hero-co2"]);

const DIRECTIONS = [
  { x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
  { x1: "100%", y1: "0%", x2: "0%", y2: "100%" },
  { x1: "0%", y1: "100%", x2: "100%", y2: "0%" },
  { x1: "15%", y1: "0%", x2: "85%", y2: "100%" },
  { x1: "0%", y1: "15%", x2: "100%", y2: "85%" },
  { x1: "100%", y1: "10%", x2: "10%", y2: "100%" },
];

function buildGrid(rnd, width, height) {
  const vpx = width * (0.2 + rnd() * 0.6);
  const vpy = height * (0.2 + rnd() * 0.3);
  let lines = "";
  const cols = 7;
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * width;
    lines += `<line x1="${x.toFixed(1)}" y1="${height}" x2="${vpx.toFixed(1)}" y2="${vpy.toFixed(1)}" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.14"/>`;
  }
  for (let i = 1; i <= 4; i++) {
    const t = i / 5;
    const y = height - t * (height - vpy) * 0.85;
    lines += `<line x1="0" y1="${y.toFixed(1)}" x2="${width}" y2="${y.toFixed(1)}" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="${(0.16 * (1 - t)).toFixed(3)}"/>`;
  }
  return lines;
}

/** A single soft, large "key light" wash positioned near the gradient's bright
 * corner — reads as a dominant light source (window/skylight) rather than a flat
 * gradient. Distinct from the small bokeh circles, which stay as background
 * sparkle/dust motes. */
function buildKeyLight(rnd, width, height, dir) {
  const pct = (v) => parseFloat(v) / 100;
  const cx = width * pct(dir.x2);
  const cy = height * pct(dir.y2);
  const r = Math.max(width, height) * (0.45 + rnd() * 0.15);
  const op = 0.3 + rnd() * 0.15;
  return {
    defs: `<radialGradient id="keyLight" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="${op.toFixed(2)}"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>`,
    content: `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="url(#keyLight)"/>`,
  };
}

/** A soft blurred dark ellipse under a grounded silhouette (machine/hall/person/
 * crate/desk/shelf/robotArm/panel/group) so it reads as resting on a lit floor
 * instead of floating on the gradient. */
function groundShadow(px, py, width, scale) {
  const rx = width * 0.12 * scale;
  const ry = rx * 0.22;
  return `<ellipse cx="${px.toFixed(1)}" cy="${(py + ry * 1.6).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="#08100F" opacity="0.22" filter="url(#bokehBlur)"/>`;
}
const GROUNDED_KINDS = new Set(["machine", "hall", "person", "group", "crate", "desk", "shelf", "robotArm", "panel"]);

function buildBokeh(rnd, width, height) {
  const count = 5 + Math.floor(rnd() * 4);
  const palette = [TEAL, AQUA, "#FFFFFF"];
  let defs = "";
  let content = "";
  for (let i = 0; i < count; i++) {
    const id = `bk${i}`;
    const color = pick(rnd, palette);
    const r = width * (0.035 + rnd() * 0.09);
    const cx = rnd() * width;
    const cy = rnd() * height;
    const op = 0.1 + rnd() * 0.22;
    defs += `<radialGradient id="${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${color}" stop-opacity="${op.toFixed(2)}"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
    content += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="url(#${id})" filter="url(#bokehBlur)"/>`;
  }
  return { defs, content };
}

function buildStreaks(rnd, width, height) {
  const count = 2 + Math.floor(rnd() * 2);
  let content = "";
  for (let i = 0; i < count; i++) {
    const cx = rnd() * width;
    const cy = rnd() * height * 0.65;
    const angle = -35 + rnd() * 70;
    const len = width * (0.5 + rnd() * 0.4);
    const op = 0.1 + rnd() * 0.12;
    content += `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${angle.toFixed(1)})" opacity="${op.toFixed(2)}" filter="url(#streakBlur)"><rect x="${(-len / 2).toFixed(1)}" y="-4" width="${len.toFixed(1)}" height="8" fill="url(#streakGradient)"/></g>`;
  }
  return content;
}

function silhouetteBlock(key, rnd, width, height) {
  const kind = SILHOUETTE_FOR[key];
  const sil = SILHOUETTES[kind](rnd);
  const scale = (Math.min(width, height) / 720) * (0.9 + rnd() * 1.15);
  const mirror = rnd() > 0.5;
  const px = width * (0.16 + rnd() * 0.68);
  const py = height * (0.52 + rnd() * 0.3);
  const light = rnd() > 0.45;
  const color = light ? "#FFFFFF" : shiftHue("#0A1212", (rnd() - 0.5) * 30);
  const opacity = (0.18 + rnd() * 0.1).toFixed(2);
  const fillAttr = sil.mode === "fill" ? color : "none";
  const strokeAttr = sil.mode === "stroke" ? color : "none";
  const sx = mirror ? -scale : scale;
  let block = GROUNDED_KINDS.has(kind) ? groundShadow(px, py, width, scale) : "";
  block += `<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${sx.toFixed(2)} ${scale.toFixed(2)})" opacity="${opacity}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${sil.markup}</g>`;
  if (SPARK_ACCENT.has(key)) {
    const spx = px + width * 0.06 * (mirror ? -1 : 1);
    const spy = py - height * 0.14;
    const sparkColor = "#FFFFFF";
    block += `<g transform="translate(${spx.toFixed(1)} ${spy.toFixed(1)}) scale(${(scale * 0.6).toFixed(2)})" opacity="${(0.16 + rnd() * 0.08).toFixed(2)}" fill="${sparkColor}" stroke="${sparkColor}" stroke-width="4" stroke-linecap="round">${sparksMarkup(rnd)}</g>`;
  }
  return block;
}

function photoSvg(key, width, height) {
  const seed = hashSeed(key);
  const rnd = mulberry32(seed);

  const hue = (rnd() - 0.5) * 36;
  const dir = pick(rnd, DIRECTIONS);
  const top = shiftHue(GRAPHITE, hue);
  const mid = shiftHue(TEAL, hue * 0.7);

  const keyLight = buildKeyLight(rnd, width, height, dir);
  const grid = buildGrid(rnd, width, height);
  const bokeh = buildBokeh(rnd, width, height);
  const streaks = buildStreaks(rnd, width, height);
  const silhouette = silhouetteBlock(key, rnd, width, height);
  const grainSeed = seed % 97;
  const grainOpacity = (0.11 + rnd() * 0.05).toFixed(3);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="${dir.x1}" y1="${dir.y1}" x2="${dir.x2}" y2="${dir.y2}">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="55%" stop-color="${mid}"/>
      <stop offset="100%" stop-color="${HAZE}"/>
    </linearGradient>
    <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="46%" r="72%">
      <stop offset="42%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#08110F" stop-opacity="0.42"/>
    </radialGradient>
    <filter id="bokehBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${(width * 0.015).toFixed(1)}"/></filter>
    <filter id="streakBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${(width * 0.01).toFixed(1)}"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="${grainSeed}" stitchTiles="stitch" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0" result="mono"/>
      <feComponentTransfer in="mono">
        <feFuncR type="linear" slope="2.4" intercept="-0.6"/>
        <feFuncG type="linear" slope="2.4" intercept="-0.6"/>
        <feFuncB type="linear" slope="2.4" intercept="-0.6"/>
      </feComponentTransfer>
    </filter>
    ${keyLight.defs}
    ${bokeh.defs}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  ${keyLight.content}
  ${grid}
  ${bokeh.content}
  ${streaks}
  ${silhouette}
  <rect width="${width}" height="${height}" fill="url(#vignette)"/>
  <rect width="${width}" height="${height}" filter="url(#grain)" opacity="${grainOpacity}"/>
</svg>`;
}

const HERO_KEYS = [
  "hero-home",
  "hero-products",
  "hero-fiber",
  "hero-tube",
  "hero-co2",
  "hero-welding",
  "hero-product",
  "hero-repair",
  "hero-training",
  "hero-jobwork",
  "hero-about",
  "hero-contact",
  "hero-certifications",
  "hero-india",
  "hero-state",
  "hero-city",
  "hero-export",
  "hero-country",
];
const SLOT_KEYS = [
  "slot-factory",
  "slot-assembly",
  "slot-cutting-head",
  "slot-sparks",
  "slot-tube-cutting",
  "slot-robot-weld",
  "slot-control-panel",
  "slot-engineer-service",
  "slot-training-room",
  "slot-crate-shipping",
  "slot-port",
  "slot-team",
  "slot-office",
  "slot-installation",
  "slot-quality-check",
  "slot-warehouse-spares",
];

async function emit(key, width, height) {
  const svg = photoSvg(key, width, height);
  const outPath = join(OUT_DIR, `${key}.webp`);
  await mkdir(dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg)).webp({ quality: 78, effort: 6 }).toFile(outPath);
  return outPath;
}

async function main() {
  const written = [];
  for (const key of HERO_KEYS) written.push(await emit(key, 1920, 1080));
  for (const key of SLOT_KEYS) written.push(await emit(key, 1600, 1200));

  console.log(`Generated ${written.length} photo placeholders:`);
  let missing = 0;
  let totalBytes = 0;
  let over = 0;
  for (const path of written) {
    const ok = existsSync(path);
    if (!ok) {
      missing += 1;
      console.log(`  MISSING  ${path.replace(ROOT, ".")}`);
      continue;
    }
    const { size } = await stat(path);
    totalBytes += size;
    const kb = size / 1024;
    if (kb > 180) over += 1;
    console.log(`  ${kb > 180 ? "OVER" : "ok  "}  ${kb.toFixed(1).padStart(7)} KB  ${path.replace(ROOT, ".")}`);
  }
  console.log(`Total: ${(totalBytes / 1024).toFixed(0)} KB across ${written.length} files.`);
  if (missing > 0 || over > 0) {
    if (missing > 0) console.error(`${missing} file(s) failed to write.`);
    if (over > 0) console.error(`${over} file(s) exceed the 180 KB budget.`);
    process.exitCode = 1;
  } else {
    console.log("All photo placeholders confirmed on disk, within budget.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
