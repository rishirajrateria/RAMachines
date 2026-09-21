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
import { flatbedMachine, tubeLaserMachine, co2EngraverMachine, robotCellMachine } from "./illustrations/machines.mjs";

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
const WARM = "#FFD9A8"; // warm lamp light, low opacity only
const STEEL = "#4A5658"; // neutral steel-grey machine body, teal is an accent only
const WALL_GREY = "#333B3C"; // neutral cool concrete-grey wall base, less green than GRAPHITE2
const CONCRETE_NEAR = "#2A3133"; // floor near/bottom
const CONCRETE_FAR = "#3E4749"; // floor far/top (subtle, roughly even)

// One-point perspective room shell: horizon + inset vanishing points shared by
// every interior template so the floor is always a trapezoid, never a triangle.
const HORIZON_FRAC = 0.58;
const VP_INSET_L = 0.3;
const VP_INSET_R = 0.7;

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
    <filter id="grain" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0" result="m"/>
      <feComponentTransfer in="m"><feFuncR type="linear" slope="1.6" intercept="-0.3"/><feFuncG type="linear" slope="1.6" intercept="-0.3"/><feFuncB type="linear" slope="1.6" intercept="-0.3"/></feComponentTransfer>
    </filter>
    <pattern id="grainPat" width="128" height="128" patternUnits="userSpaceOnUse"><rect width="128" height="128" filter="url(#grain)"/></pattern>`;
}
function wrap(key, w, h, inner, { dark, grainOp, vignetteOp }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${sharedDefs(w)}
    <radialGradient id="vig" cx="50%" cy="46%" r="75%"><stop offset="40%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="${dark ? "#040807" : "#08110F"}" stop-opacity="${vignetteOp}"/></radialGradient>
  </defs>
  <g filter="url(#contrastBoost)">${inner}</g>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" fill="url(#grainPat)" opacity="${grainOp}"/>
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
/**
 * Correct one-point-perspective room shell. The horizon sits at vpy (~58% of
 * height); the floor is bounded by two inset points on the horizon (30%/70%
 * of width) instead of converging to a single point, so it is a TRAPEZOID,
 * never a triangle. Ceiling mirrors the floor above the horizon, and a side
 * wall triangle fills each flank so every pixel of the frame is covered by
 * floor, wall or ceiling — no bare background, no dark voids beside the floor.
 */
function roomShell(w, h, vpx, vpy, { floorFill, ceilFill, sideFill }) {
  const lx = w * VP_INSET_L, rx = w * VP_INSET_R;
  return `
    <polygon points="0,0 ${w},0 ${rx.toFixed(1)},${vpy.toFixed(1)} ${lx.toFixed(1)},${vpy.toFixed(1)}" fill="${ceilFill}"/>
    <polygon points="0,0 ${lx.toFixed(1)},${vpy.toFixed(1)} 0,${h}" fill="${sideFill}"/>
    <polygon points="${w},0 ${rx.toFixed(1)},${vpy.toFixed(1)} ${w},${h}" fill="${sideFill}"/>
    <polygon points="0,${h} ${w},${h} ${rx.toFixed(1)},${vpy.toFixed(1)} ${lx.toFixed(1)},${vpy.toFixed(1)}" fill="${floorFill}"/>`;
}
/** Grid lines confined to the floor trapezoid: converging lines all meet the
 * single vpx/vpy vanishing point (which sits on the horizon between the inset
 * points), horizontal lines get closer together with distance. */
function floorGrid(w, h, vpx, vpy) {
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
  return grid;
}
/** Gives a flat rect real volume: a lighter top-face band (catches the key
 * light), the body as the mid front face, and a darker side-face band along
 * the trailing edge (in shadow) — plus callers add a contact shadow. */
function bevelBox(x, y, w, h, body, { rx = 3, topT = 0.16, sideT = 0.14, mirror = false } = {}) {
  const topH = h * topT, sideW = w * sideT;
  const top = mix(body, "#FFFFFF", 0.4);
  const side = mix(body, "#000000", 0.4);
  const sideX = mirror ? x : x + w - sideW;
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${rx}" fill="${body}"/>
    <rect x="${sideX.toFixed(1)}" y="${y.toFixed(1)}" width="${sideW.toFixed(1)}" height="${h.toFixed(1)}" rx="${rx}" fill="${side}" opacity="0.55"/>
    <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${topH.toFixed(1)}" rx="${rx}" fill="${top}" opacity="0.8"/>`;
}
function personFig(x, y, scale, mirror, tool, tint, op) {
  const sx = (mirror ? -1 : 1) * scale;
  return `
    <ellipse cx="${x.toFixed(1)}" cy="${(y + 78 * scale).toFixed(1)}" rx="${(30 * scale).toFixed(1)}" ry="${(7 * scale).toFixed(1)}" fill="#050A09" opacity="${(op * 0.35).toFixed(2)}" filter="url(#blurXS)"/>
    <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sx.toFixed(2)} ${scale.toFixed(2)})" fill="${tint}" opacity="${op}" stroke="${mix(tint, AQUA, 0.55)}" stroke-width="1.5" stroke-opacity="0.75">
      <circle cx="0" cy="-96" r="17"/>
      <path d="M-20,-76 L20,-76 L26,10 C26,18 20,24 12,24 L-12,24 C-20,24 -26,18 -26,10 Z"/>
      <rect x="-18" y="24" width="13" height="52" rx="5"/><rect x="6" y="24" width="13" height="52" rx="5"/>
      ${tool ? `<rect x="16" y="-58" width="46" height="10" rx="4" transform="rotate(-18 16 -58)"/>` : `<rect x="-30" y="-68" width="10" height="42" rx="4" transform="rotate(14 -30 -68)"/>`}
    </g>`;
}
function crateShape(x, y, scale, tint, op) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${op}">
    <ellipse cx="0" cy="60" rx="86" ry="14" fill="#050A09" opacity="0.35" filter="url(#blurXS)"/>
    ${bevelBox(-70, -56, 140, 112, tint, { rx: 3 })}
    <line x1="-70" y1="-2" x2="70" y2="-2" stroke="${mix(tint, "#000000", 0.4)}" stroke-width="4"/>
    <line x1="0" y1="-56" x2="0" y2="56" stroke="${mix(tint, "#000000", 0.4)}" stroke-width="4"/>
  </g>`;
}
function shelfRack(x, y, scale, tint, op) {
  const frame = mix(tint, "#FFFFFF", 0.45);
  const bin = mix(tint, "#FFFFFF", 0.2);
  const binAccent = mix(tint, AQUA, 0.4);
  return `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${op}">
    <ellipse cx="0" cy="196" rx="200" ry="18" fill="#050A09" opacity="0.3" filter="url(#blurS)"/>
    <g fill="${frame}">
      <rect x="-190" y="-190" width="10" height="380"/><rect x="180" y="-190" width="10" height="380"/>
      <rect x="-190" y="-190" width="380" height="8"/><rect x="-190" y="-58" width="380" height="8"/><rect x="-190" y="74" width="380" height="8"/><rect x="-190" y="184" width="380" height="8"/>
    </g>
    ${bevelBox(-166, -172, 58, 102, bin, { rx: 3 })}${bevelBox(-84, -166, 68, 96, binAccent, { rx: 3 })}
    ${bevelBox(8, -170, 58, 100, bin, { rx: 3 })}${bevelBox(96, -162, 70, 92, binAccent, { rx: 3 })}
    ${bevelBox(-160, -40, 68, 90, binAccent, { rx: 3 })}${bevelBox(-64, -36, 80, 86, bin, { rx: 3 })}
    ${bevelBox(44, -42, 68, 92, bin, { rx: 3 })}
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
// --------------------------------------------------------------------------- Template: warehouse (slot-warehouse-spares only)
/** One large spares rack close and dominant, per ADR-0008 §2 pass 3 "other
 * slots ... bring the subject much closer and larger" — not a receding row
 * of small racks. */
function warehouseScene(rnd, w, h) {
  const vpx = w * (0.46 + rnd() * 0.08);
  const vpy = h * (HORIZON_FRAC + (rnd() - 0.5) * 0.03);
  const wallTop = mix(GRAPHITE, TEAL_DEEP, 0.08);
  const wallBottom = mix(WALL_GREY, TEAL_DEEP, 0.16);
  const sideWall = mix(wallBottom, "#000000", 0.22);
  const floorNear = CONCRETE_NEAR;
  const floorFar = atmo(CONCRETE_FAR, 0.22);
  let out = `<defs>
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${wallTop}"/><stop offset="100%" stop-color="${wallBottom}"/></linearGradient>
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${floorFar}"/><stop offset="100%" stop-color="${floorNear}"/></linearGradient>
  </defs>`;
  out += roomShell(w, h, vpx, vpy, { floorFill: "url(#floorGrad)", ceilFill: "url(#wallGrad)", sideFill: sideWall });
  out += floorGrid(w, h, vpx, vpy);
  out += trussBeam(w, vpy * 0.2, 0.7, vpx / w, "0.8");
  // One large rack owns the frame — a spotlight lamp hangs directly above it
  // instead of floating in empty floor to its side.
  const rackX = w * 0.56, rackY = h * 0.72, rackScale = 1.55 * (w / 1600);
  out += lampUnit(rackX, vpy * 0.5, rackY - 200 * rackScale, 1.3, true, "0.9");
  out += shelfRack(rackX, rackY, rackScale, mix(GRAPHITE2, TEAL, 0.16), 0.98);
  return out;
}

// --------------------------------------------------------------------------- Cinematic machine-subject helpers (pass 3)
/** Fits a `scripts/illustrations/machines.mjs` render (`{ svg, bbox, tip }`)
 * into a `w`×`h` canvas so it fills `heightFrac` (0.55-0.75) of the frame
 * height, right-edge anchored at `rightFrac` of the width (not centred — a
 * wide machine's left edge is free to run into the calm/dark zone, which the
 * caller dims separately) and bottom-set near the floor line — "the subject
 * should own the frame" per the pass-3 brief. */
function fitMachine(machine, w, h, { heightFrac = 0.64, rightFrac = 0.9, bottomMargin = 0.055, maxWidthFrac = 0.94 } = {}) {
  const [minX, minY, maxX, maxY] = machine.bbox;
  const bw = Math.max(1, maxX - minX);
  const bh = Math.max(1, maxY - minY);
  let scale = (h * heightFrac) / bh;
  const widthCap = (w * maxWidthFrac) / bw;
  if (scale > widthCap) scale = widthCap;
  const tx = w * rightFrac - maxX * scale;
  const ty = h * (1 - bottomMargin) - maxY * scale;
  const toScreen = (lx, ly) => [tx + lx * scale, ty + ly * scale];
  const tip = toScreen(machine.tip[0], machine.tip[1]);
  return {
    group: `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale.toFixed(4)})">${machine.svg}</g>`,
    scale,
    tip,
    minX: tx + minX * scale,
    maxX: tx + maxX * scale,
    minY: ty + minY * scale,
    maxY: ty + maxY * scale,
  };
}
/** One or two soft volumetric light shafts falling from the upper-left —
 * strong enough to actually read against the dark backdrop. */
function lightShafts(rnd, w, h, n = 2) {
  let out = "";
  const c = mix(HAZE, AQUA, 0.3);
  for (let i = 0; i < n; i++) {
    const originX = w * (rnd() * 0.12);
    const originY = -h * 0.08;
    const angle = (32 + i * 18 + rnd() * 10) * (Math.PI / 180);
    const len = h * 1.4;
    const topW = 10 + rnd() * 10;
    const botW = w * (0.2 + rnd() * 0.12);
    const dx = Math.sin(angle), dy = Math.cos(angle);
    const endX = originX + dx * len, endY = originY + dy * len;
    const nx = -dy, ny = dx;
    const poly = [
      [originX - nx * topW, originY - ny * topW],
      [originX + nx * topW, originY + ny * topW],
      [endX + nx * botW, endY + ny * botW],
      [endX - nx * botW, endY - ny * botW],
    ]
      .map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`)
      .join(" ");
    const op = (0.1 + rnd() * 0.09).toFixed(3);
    out += `<polygon points="${poly}" fill="${c}" opacity="${op}" filter="url(#blurM)"/>`;
  }
  // A soft top-left ambient glow so the shafts read as coming from a source,
  // not floating triangles.
  out += `<ellipse cx="${(w * 0.02).toFixed(1)}" cy="${(-h * 0.05).toFixed(1)}" rx="${(w * 0.5).toFixed(1)}" ry="${(h * 0.4).toFixed(1)}" fill="${c}" opacity="0.14" filter="url(#blurL)"/>`;
  return out;
}
/** A soft glow on the horizon behind the subject's feet, so the backdrop
 * reads as lit space instead of a flat void. */
function horizonGlow(cx, cy, w, color, op) {
  return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(w * 0.48).toFixed(1)}" ry="${(w * 0.12).toFixed(1)}" fill="${color}" opacity="${op}" filter="url(#blurL)"/>`;
}
/** Faint atmospheric haze banding the floor line between subject and background. */
function floorHaze(w, h, groundYFrac) {
  const y = h * Math.max(0.28, groundYFrac - 0.18);
  return `<rect x="0" y="${y.toFixed(1)}" width="${w}" height="${(h * 0.26).toFixed(1)}" fill="${HAZE}" opacity="0.08" filter="url(#blurM)"/>`;
}
/** Cool fill (left) + warm rim (right, spark side) glows framing the subject —
 * drawn behind the machine group. */
function subjectLighting(fit, w) {
  const midY = (fit.minY + fit.maxY) / 2;
  const halfH = Math.max(1, (fit.maxY - fit.minY) / 2);
  const fill = `<ellipse cx="${fit.minX.toFixed(1)}" cy="${midY.toFixed(1)}" rx="${(w * 0.15).toFixed(1)}" ry="${(halfH * 0.95).toFixed(1)}" fill="${AQUA}" opacity="0.14" filter="url(#blurL)"/>`;
  const rim = `<ellipse cx="${fit.maxX.toFixed(1)}" cy="${midY.toFixed(1)}" rx="${(w * 0.12).toFixed(1)}" ry="${(halfH * 0.9).toFixed(1)}" fill="${AMBER}" opacity="0.2" filter="url(#blurL)"/>`;
  return fill + rim;
}
/** A single blurred out-of-focus element low in a corner — a rail, a stacked
 * sheet or a bollard — the foreground depth cue. */
function foregroundBlur(rnd, w, h, kind, side) {
  const x0 = side === "right" ? w * 0.78 : -w * 0.06;
  const op = (0.3 + rnd() * 0.12).toFixed(2);
  if (kind === "sheet") {
    return `<rect x="${x0.toFixed(1)}" y="${(h * 0.8).toFixed(1)}" width="${(w * 0.26).toFixed(1)}" height="${(h * 0.09).toFixed(1)}" rx="6" fill="${STEEL}" opacity="${op}" filter="url(#blurM)"/>`;
  }
  if (kind === "bollard") {
    return `<rect x="${(x0 + w * 0.02).toFixed(1)}" y="${(h * 0.74).toFixed(1)}" width="${(w * 0.025).toFixed(1)}" height="${(h * 0.24).toFixed(1)}" rx="10" fill="${GRAPHITE2}" opacity="${op}" filter="url(#blurM)"/>`;
  }
  return `<rect x="${x0.toFixed(1)}" y="${(h * 0.87).toFixed(1)}" width="${(w * 0.3).toFixed(1)}" height="${(h * 0.045).toFixed(1)}" rx="8" fill="${GRAPHITE}" opacity="${op}" filter="url(#blurM)"/>`;
}
/** A far-background gantry-crane silhouette for export/port keys. */
function craneSilhouette(w, h, atXFrac) {
  const cx = w * atXFrac, top = h * 0.1, base = h * 0.6;
  const c = atmo(GRAPHITE, 0.55);
  return `<g opacity="0.4">
    <polygon points="${(cx - 26).toFixed(1)},${base.toFixed(1)} ${(cx - 8).toFixed(1)},${top.toFixed(1)} ${(cx + 8).toFixed(1)},${top.toFixed(1)} ${(cx + 26).toFixed(1)},${base.toFixed(1)}" fill="${c}"/>
    <polygon points="${(cx - 10).toFixed(1)},${(top + 6).toFixed(1)} ${(cx + 150).toFixed(1)},${(top - 12).toFixed(1)} ${(cx + 150).toFixed(1)},${(top - 2).toFixed(1)} ${(cx + 6).toFixed(1)},${(top + 16).toFixed(1)}" fill="${c}"/>
    <line x1="${(cx + 128).toFixed(1)}" y1="${(top - 4).toFixed(1)}" x2="${(cx + 128).toFixed(1)}" y2="${(top + 34).toFixed(1)}" stroke="${c}" stroke-width="2"/>
  </g>`;
}
/** A short stack of crates set beside the subject. */
function crateCluster(w, h, fit, side) {
  const baseX = side === "right" ? fit.maxX + w * 0.06 : Math.max(w * 0.02, fit.minX - w * 0.16);
  const s = (w / 1700) * 0.85;
  let out = crateShape(baseX, fit.maxY - h * 0.005, s, mix(GRAPHITE2, TEAL, 0.12), 0.92);
  out += crateShape(baseX + w * 0.05, fit.maxY + h * 0.01, s * 0.74, GRAPHITE2, 0.86);
  return out;
}
/** A small certification-badge glyph set near the subject's control cabinet. */
function badgeGlyph(w, h, fit) {
  const x = fit.maxX - w * 0.02, y = fit.minY + (fit.maxY - fit.minY) * 0.26, s = w * 0.00034;
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})">
    <circle cx="0" cy="0" r="60" fill="${AMBER}" opacity="0.88"/>
    <circle cx="0" cy="0" r="60" fill="none" stroke="${mix(AMBER, "#FFFFFF", 0.5)}" stroke-width="4"/>
    <path d="M-24,-2 l16,18 l32,-36" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <polygon points="-20,50 0,20 20,50 12,34 -12,34" fill="${mix(AMBER, GRAPHITE2, 0.3)}" opacity="0.9"/>
  </g>`;
}
/** A small distant location glyph (pin / city skyline / globe) sitting high
 * in the background — a supporting element, not the scene. */
function locateGlyph(w, h, kind) {
  const cx = w * 0.14, cy = h * 0.22;
  if (kind === "pin") {
    return `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${(w * 0.00016).toFixed(4)})" opacity="0.55">
      <path d="M0,-140 C70,-140 122,-92 122,-32 C122,44 0,140 0,140 C0,140 -122,44 -122,-32 C-122,-92 -70,-140 0,-140 Z" fill="${TEAL}" opacity="0.8"/>
      <circle cx="0" cy="-32" r="34" fill="${HAZE}" opacity="0.85"/>
    </g>`;
  }
  if (kind === "city") {
    let out = `<g opacity="0.4">`;
    for (let i = 0; i < 5; i++) {
      const bx = cx + i * w * 0.028, bh = h * (0.05 + (i % 3) * 0.03);
      out += `<rect x="${bx.toFixed(1)}" y="${(cy + h * 0.12 - bh).toFixed(1)}" width="${(w * 0.02).toFixed(1)}" height="${bh.toFixed(1)}" fill="${GRAPHITE}"/>`;
    }
    return out + `</g>`;
  }
  const r = w * 0.055;
  return `<g opacity="0.42" stroke="${AQUA}" stroke-width="1.4" fill="none">
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>
    <ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 0.36).toFixed(1)}"/>
    <ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(r * 0.4).toFixed(1)}" ry="${r.toFixed(1)}"/>
  </g>`;
}
/**
 * The "subject owns the frame" template used for every hero-* image and
 * every machine-related slot (ADR-0008 §2 pass 3): a large solid-shaded
 * machine render from illustrations/machines.mjs, right/centre-right of
 * frame, against a deep vertical-gradient backdrop with volumetric light
 * shafts, a horizon glow, floor haze and one blurred foreground element —
 * a cinematic environment, not a room.
 */
function machineScene(rnd, w, h, opts) {
  const {
    hero = false,
    machine,
    machine2 = null,
    heightFrac = 0.64 + rnd() * 0.09,
    rightFrac = hero ? 0.92 + rnd() * 0.03 : 0.84 + rnd() * 0.05,
    figures = 0,
    crates = false,
    crane = false,
    badge = false,
    locate = null,
    lift = false,
  } = opts;
  const hf = Math.min(0.75, Math.max(0.55, heightFrac));

  const topC = "#050B0A";
  const midC = mix(TEAL_DEEP, "#124440", 0.5);
  const floorC = mix(CONCRETE_FAR, HAZE, 0.14);
  let out = `<defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${topC}"/>
      <stop offset="55%" stop-color="${midC}"/>
      <stop offset="100%" stop-color="${floorC}"/>
    </linearGradient>
  </defs><rect width="${w}" height="${h}" fill="url(#bgGrad)"/>`;

  out += lightShafts(rnd, w, h, hero ? 2 : 1);
  if (locate) out += locateGlyph(w, h, locate);
  if (crane) out += craneSilhouette(w, h, rightFrac - 0.1);

  const fit = fitMachine(machine, w, h, { heightFrac: hf, rightFrac, maxWidthFrac: hero ? 0.95 : 0.9 });
  let fit2 = null;
  if (machine2) {
    fit2 = fitMachine(machine2, w, h, {
      heightFrac: hf * 0.58,
      rightFrac: Math.max(0.3, rightFrac - 0.42),
      maxWidthFrac: 0.34,
      bottomMargin: 0.075,
    });
  }

  const groundYFrac = fit.maxY / h;
  out += horizonGlow(fit.minX + (fit.maxX - fit.minX) / 2, h * Math.min(0.7, groundYFrac * 0.95), w, mix(TEAL, AQUA, 0.3), 0.3);
  out += floorHaze(w, h, groundYFrac);
  out += subjectLighting(fit, w);

  if (fit2) out += fit2.group;
  if (lift) {
    // A crane rigging cue — two taut lift-sling lines from off the top of
    // frame down to the machine, for the "being installed" slot.
    const topCx = fit.minX + (fit.maxX - fit.minX) * 0.5;
    out += `<line x1="${(topCx - 60).toFixed(1)}" y1="${fit.minY.toFixed(1)}" x2="${(topCx - 10).toFixed(1)}" y2="${(-h * 0.02).toFixed(1)}" stroke="${HAZE}" stroke-width="3" opacity="0.5"/>
      <line x1="${(topCx + 60).toFixed(1)}" y1="${fit.minY.toFixed(1)}" x2="${(topCx + 10).toFixed(1)}" y2="${(-h * 0.02).toFixed(1)}" stroke="${HAZE}" stroke-width="3" opacity="0.5"/>`;
  }
  out += fit.group;
  out += `<circle cx="${fit.tip[0].toFixed(1)}" cy="${fit.tip[1].toFixed(1)}" r="${(w * 0.05).toFixed(1)}" fill="${AMBER}" opacity="0.18" filter="url(#blurM)"/>`;

  if (crates) out += crateCluster(w, h, fit, "left");
  if (badge) out += badgeGlyph(w, h, fit);

  // Figures stand close to the machine's control cabinet (near its right
  // edge, where the cabinet actually sits), never out at the far/dark left
  // edge of the bbox where they'd read as a stray silhouette.
  for (let i = 0; i < figures; i++) {
    const frac = figures === 1 ? 0.76 : 0.56 + i * 0.22;
    const fx = Math.min(fit.minX + (fit.maxX - fit.minX) * frac, w * 0.94) + (rnd() - 0.5) * w * 0.015;
    out += personFig(fx, fit.maxY - h * 0.018, 1.05 * (w / 1700), i % 2 === 0, i === 0, mix(GRAPHITE, TEAL, 0.12), 0.96);
  }

  out += foregroundBlur(rnd, w, h, pick(rnd, ["rail", "sheet", "bollard"]), "left");
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
    out += `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(1.9)">
      <circle cx="0" cy="-70" r="52" fill="${mix(GRAPHITE2, AQUA, 0.15)}"/>
      <circle cx="0" cy="-70" r="52" fill="none" stroke="${mix(GRAPHITE2, "#FFFFFF", 0.4)}" stroke-width="3"/>
      <circle cx="0" cy="-70" r="16" fill="${INK}"/>
      <rect x="-160" y="-22" width="320" height="44" rx="8" fill="${GRAPHITE2}"/>
      <rect x="-160" y="-22" width="320" height="10" rx="4" fill="${mix(GRAPHITE2, "#FFFFFF", 0.35)}"/>
      <rect x="-190" y="-96" width="40" height="160" rx="6" fill="${GRAPHITE}"/>
      <rect x="150" y="-96" width="40" height="160" rx="6" fill="${GRAPHITE}"/>
      <rect x="-40" y="34" width="130" height="46" rx="6" fill="${INK}"/>
      <text x="-30" y="66" font-family="monospace" font-size="30" fill="${AQUA}">24.05</text>
    </g>`;
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

// --------------------------------------------------------------------------- Template: people scene (slot-office, slot-team only)
function peopleScene(rnd, w, h, opts) {
  const { scene = "office" } = opts;
  const top = mix(GRAPHITE, TEAL_DEEP, 0.08);
  const bottom = mix(WALL_GREY, TEAL_DEEP, 0.14);
  const vpx = w * (0.44 + rnd() * 0.12), vpy = h * HORIZON_FRAC;
  const sideWall = mix(bottom, "#000000", 0.22);
  const floorNear = CONCRETE_NEAR;
  const floorFar = atmo(CONCRETE_FAR, 0.2);
  let out = `<defs>
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${top}"/><stop offset="100%" stop-color="${bottom}"/></linearGradient>
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${floorFar}"/><stop offset="100%" stop-color="${floorNear}"/></linearGradient>
  </defs>`;
  out += roomShell(w, h, vpx, vpy, { floorFill: "url(#floorGrad)", ceilFill: "url(#wallGrad)", sideFill: sideWall });
  out += floorGrid(w, h, vpx, vpy);
  out += lightShafts(rnd, w, h, 1);
  out += horizonGlow(w * 0.5, vpy, w, mix(TEAL, AQUA, 0.3), 0.28);
  const winX = w * 0.72;
  for (let i = 0; i < 6; i++) {
    out += `<rect x="${(winX + i * 26).toFixed(1)}" y="0" width="6" height="${h * 0.5}" fill="${HAZE}" opacity="0.05" filter="url(#blurS)"/>`;
  }
  if (scene === "team") {
    // Three figures, close and large, backlit against the horizon glow —
    // filling most of the frame height, the centre one nearest camera.
    const positions = [[-390, 0.96, 3.9], [30, 1.1, 4.7], [420, 0.96, 3.9]];
    for (const [ox, yf, s] of positions) out += personFig(w / 2 + ox * (w / 1600), h * yf, s * (w / 1600), ox > 0, false, atmo(GRAPHITE, 0.05), 0.97);
  } else {
    const dx = w * 0.52, dy = h * 0.84, s = 1.75 * (w / 1600);
    out += `<rect x="${(dx - 210 * s).toFixed(1)}" y="${(dy - 4 * s).toFixed(1)}" width="${(420 * s).toFixed(1)}" height="${(16 * s).toFixed(1)}" rx="4" fill="${GRAPHITE2}"/>
      <rect x="${(dx - 80 * s).toFixed(1)}" y="${(dy - 130 * s).toFixed(1)}" width="${(160 * s).toFixed(1)}" height="${(112 * s).toFixed(1)}" rx="6" fill="${GRAPHITE}"/>
      <rect x="${(dx - 68 * s).toFixed(1)}" y="${(dy - 120 * s).toFixed(1)}" width="${(136 * s).toFixed(1)}" height="${(88 * s).toFixed(1)}" fill="${AQUA}" opacity="0.22"/>
      <rect x="${(dx - 8 * s).toFixed(1)}" y="${(dy - 18 * s).toFixed(1)}" width="${(16 * s).toFixed(1)}" height="${(18 * s).toFixed(1)}" fill="${GRAPHITE2}"/>
      <rect x="${(dx - 150 * s).toFixed(1)}" y="${(dy - 12 * s).toFixed(1)}" width="${(70 * s).toFixed(1)}" height="${(10 * s).toFixed(1)}" rx="3" fill="${GRAPHITE}"/>
      <ellipse cx="${(dx + 130 * s).toFixed(1)}" cy="${(dy - 40 * s).toFixed(1)}" rx="${(14 * s).toFixed(1)}" ry="${(46 * s).toFixed(1)}" fill="${TEAL}" opacity="0.5"/>`;
    out += personFig(dx - 20 * s, dy + 80 * s, s * 1.05, false, false, atmo(GRAPHITE, 0.05), 0.92);
  }
  return out;
}

// --------------------------------------------------------------------------- key -> builder registry
// Pass 3 (ADR-0008 §2 revisit): every hero-* and every machine-related slot is
// now composed around a large solid-shaded machine render from
// illustrations/machines.mjs via machineScene() — subject owns the frame —
// instead of a distant room. Non-machine "other" slots (office/team/quality
// check/control panel/installation/warehouse-spares) keep their composed
// scene but tuned closer/larger.
const SCENES = {
  "hero-home": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f3015-pro", { inUse: true }), crates: true }),
  "hero-products": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f1530", { inUse: true }) }),
  "hero-fiber": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f6020-hd", { inUse: true }), heightFrac: 0.58 }),
  "hero-tube": (r, w, h) => machineScene(r, w, h, { hero: true, machine: tubeLaserMachine({ inUse: true }) }),
  "hero-co2": (r, w, h) => machineScene(r, w, h, { hero: true, machine: co2EngraverMachine({ inUse: true }) }),
  "hero-welding": (r, w, h) => machineScene(r, w, h, { hero: true, machine: robotCellMachine(1, { inUse: true }), heightFrac: 0.68 }),
  "hero-product": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f12k", { inUse: true }), heightFrac: 0.72 }),
  "hero-repair": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f3015-pro", { inUse: false }), figures: 1 }),
  "hero-training": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f1530", { inUse: false }), figures: 2 }),
  "hero-jobwork": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f6020-hd", { inUse: false }), heightFrac: 0.58 }),
  "hero-about": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f1530", { inUse: false }), machine2: flatbedMachine("ra-f3015-pro", { inUse: false }), heightFrac: 0.72 }),
  "hero-contact": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f1530", { inUse: false }), locate: "pin" }),
  "hero-certifications": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f3015-pro", { inUse: false }), badge: true }),
  "hero-india": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f1530", { inUse: true }), locate: "pin" }),
  "hero-state": (r, w, h) => machineScene(r, w, h, { hero: true, machine: co2EngraverMachine({ inUse: true }), locate: "pin" }),
  "hero-city": (r, w, h) => machineScene(r, w, h, { hero: true, machine: tubeLaserMachine({ inUse: true }), locate: "city" }),
  "hero-export": (r, w, h) => machineScene(r, w, h, { hero: true, machine: flatbedMachine("ra-f6020-hd", { inUse: false }), heightFrac: 0.58, crates: true, crane: true }),
  "hero-country": (r, w, h) => machineScene(r, w, h, { hero: true, machine: robotCellMachine(1, { inUse: true }), locate: "globe" }),
  "slot-factory": (r, w, h) => machineScene(r, w, h, { machine: flatbedMachine("ra-f1530", { inUse: false }), machine2: tubeLaserMachine({ inUse: false }) }),
  "slot-assembly": (r, w, h) => machineScene(r, w, h, { machine: flatbedMachine("ra-f3015-pro", { inUse: false }), machine2: robotCellMachine(1, { inUse: false }), figures: 1 }),
  "slot-cutting-head": (r, w, h) => macroShot(r, w, h, { subject: "cuttingHead" }),
  "slot-sparks": (r, w, h) => macroShot(r, w, h, { subject: "sparks" }),
  "slot-tube-cutting": (r, w, h) => machineScene(r, w, h, { machine: tubeLaserMachine({ inUse: true }) }),
  "slot-robot-weld": (r, w, h) => machineScene(r, w, h, { machine: robotCellMachine(2, { inUse: true }), heightFrac: 0.58 }),
  "slot-control-panel": (r, w, h) => macroShot(r, w, h, { subject: "controlPanel" }),
  "slot-engineer-service": (r, w, h) => machineScene(r, w, h, { machine: flatbedMachine("ra-f3015-pro", { inUse: false }), figures: 1 }),
  "slot-training-room": (r, w, h) => machineScene(r, w, h, { machine: flatbedMachine("ra-f1530", { inUse: false }), figures: 2 }),
  "slot-crate-shipping": (r, w, h) => machineScene(r, w, h, { machine: flatbedMachine("ra-f1530", { inUse: false }), crates: true }),
  "slot-port": (r, w, h) => machineScene(r, w, h, { machine: flatbedMachine("ra-f6020-hd", { inUse: false }), heightFrac: 0.56, crates: true, crane: true }),
  "slot-team": (r, w, h) => peopleScene(r, w, h, { scene: "team" }),
  "slot-office": (r, w, h) => peopleScene(r, w, h, { scene: "office" }),
  "slot-installation": (r, w, h) => machineScene(r, w, h, { machine: flatbedMachine("ra-f3015-pro", { inUse: false }), figures: 1, lift: true }),
  "slot-quality-check": (r, w, h) => macroShot(r, w, h, { subject: "qualityCheck" }),
  "slot-warehouse-spares": (r, w, h) => warehouseScene(r, w, h),
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
