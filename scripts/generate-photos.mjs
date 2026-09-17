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
function machineShape(kind, body, accent, glow) {
  if (kind === "tube") {
    // Steel roller bed with a single slim teal accent stripe, not a solid teal bar.
    return `${bevelBox(-40, -158, 16, 60, body, { rx: 3 })}${bevelBox(-190, -6, 380, 26, body, { rx: 13 })}
      <rect x="-186" y="1" width="372" height="6" rx="3" fill="${accent}"/>
      <ellipse cx="-190" cy="7" rx="10" ry="15" fill="${mix(body, "#000000", 0.2)}"/><ellipse cx="190" cy="7" rx="10" ry="15" fill="${mix(body, "#000000", 0.2)}"/>
      ${bevelBox(-210, 30, 34, 44, body, { rx: 4 })}${bevelBox(176, 30, 34, 44, body, { rx: 4 })}
      ${bevelBox(-70, 30, 30, 40, accent, { rx: 3 })}${bevelBox(40, 30, 30, 40, accent, { rx: 3 })}
      <circle cx="0" cy="7" r="5" fill="${glow}"/>`;
  }
  if (kind === "co2") {
    return `${bevelBox(-170, -4, 340, 100, body, { rx: 10 })}
      <polygon points="-170,-4 170,-4 150,-72 -150,-72" fill="${accent}"/>
      <polygon points="-150,-72 150,-72 150,-58 -150,-58" fill="${mix(accent, "#FFFFFF", 0.45)}" opacity="0.7"/>
      <rect x="-140" y="14" width="280" height="60" rx="4" fill="${glow}" fill-opacity="0.2"/>
      <line x1="-140" y1="24" x2="140" y2="24" stroke="${glow}" stroke-opacity="0.3" stroke-width="2"/>
      <line x1="-140" y1="44" x2="140" y2="44" stroke="${glow}" stroke-opacity="0.3" stroke-width="2"/>
      <line x1="-140" y1="64" x2="140" y2="64" stroke="${glow}" stroke-opacity="0.3" stroke-width="2"/>
      <rect x="-30" y="96" width="14" height="30" rx="2" fill="${mix(body, "#000000", 0.3)}"/><rect x="20" y="96" width="14" height="30" rx="2" fill="${mix(body, "#000000", 0.3)}"/>`;
  }
  if (kind === "robot") {
    // Steel-grey arm links; teal stays confined to the joint rings and shoulder collar.
    return `${bevelBox(-56, 96, 112, 30, body, { rx: 6 })}${bevelBox(-18, 10, 36, 92, body, { rx: 10 })}
      <circle cx="0" cy="10" r="24" fill="${body}"/><circle cx="0" cy="10" r="24" fill="none" stroke="${accent}" stroke-width="5" opacity="0.85"/>
      <g transform="rotate(-28)">${bevelBox(0, -15, 164, 30, body, { rx: 12 })}</g>
      <circle cx="145" cy="-54" r="18" fill="${accent}"/><g transform="translate(145,-54) rotate(38)">${bevelBox(0, -12, 108, 24, body, { rx: 10 })}</g>
      <polygon points="240,-34 276,-12 262,24 226,4" fill="${glow}" opacity="0.9"/>`;
  }
  // gantry (default laser cutter)
  return `${bevelBox(-220, 68, 440, 24, mix(body, "#000000", 0.15), { rx: 6 })}
    ${bevelBox(-190, -16, 18, 86, body, { rx: 4 })}${bevelBox(170, -16, 18, 86, body, { rx: 4 })}
    ${bevelBox(-205, -40, 410, 26, accent, { rx: 6 })}
    ${bevelBox(-8, -14, 16, 66, accent, { rx: 3 })}
    ${bevelBox(164, 0, 56, 70, body, { rx: 8 })}<rect x="180" y="16" width="24" height="16" rx="2" fill="${glow}" fill-opacity="0.55"/>
    <rect x="-170" y="10" width="300" height="40" rx="3" fill="${GRAPHITE}" fill-opacity="0.45"/>
    <rect x="-205" y="-42" width="410" height="4" fill="${mix(accent, "#FFFFFF", 0.5)}" opacity="0.6"/>`;
}
function machineUnit(kind, x, y, scale, mirror, depthT, op) {
  const sx = (mirror ? -1 : 1) * scale;
  // Steel-grey body, cooling/desaturating with distance; teal stays confined to accent panels.
  const body = atmo(mix(STEEL, GRAPHITE, 0.35), depthT * 0.7);
  const accent = atmo(mix(TEAL, AQUA, 0.2), depthT * 0.5);
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
// --------------------------------------------------------------------------- Template: interior room
function interiorRoom(rnd, w, h, opts) {
  const { hue = 0, populate = "machines", person = true, crates = false, dark = false, biasRight = false } = opts;
  // Vanishing point stays well inside the inset horizon segment (30%-70% of
  // width) so grid lines and machine lanes never cross into the wall triangles.
  const vpx = w * (biasRight ? 0.52 + rnd() * 0.1 : 0.42 + rnd() * 0.1);
  const vpy = h * (HORIZON_FRAC + (rnd() - 0.5) * 0.03);
  // Steel-grey walls; teal is only a faint distant-haze accent, not the whole frame.
  const wallTop = mix(dark ? INK : GRAPHITE, TEAL_DEEP, 0.06 + rnd() * 0.04);
  const wallBottom = mix(WALL_GREY, TEAL_DEEP, 0.16);
  const sideWall = mix(wallBottom, "#000000", 0.22);
  // Concrete floor, near-even gradient (far/top slightly lighter+hazier, near/bottom darker).
  const floorNear = dark ? mix(CONCRETE_NEAR, "#000000", 0.12) : CONCRETE_NEAR;
  const floorFar = atmo(CONCRETE_FAR, 0.22);
  let out = `<defs>
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${wallTop}"/><stop offset="100%" stop-color="${wallBottom}"/></linearGradient>
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${floorFar}"/><stop offset="100%" stop-color="${floorNear}"/></linearGradient>
  </defs>`;
  out += roomShell(w, h, vpx, vpy, { floorFill: "url(#floorGrad)", ceilFill: "url(#wallGrad)", sideFill: sideWall });
  out += floorGrid(w, h, vpx, vpy);
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
  // subject row (machines or shelves), near -> far along one wall, offset toward right for hero calm-left
  const laneNearX = w * (biasRight ? 0.86 : 0.66);
  const laneFarX = vpx + w * (biasRight ? 0.14 : 0.1);
  const depths = [0.06, 0.42, 0.78];
  for (const t of depths) {
    const x = lerp(laneNearX, laneFarX, t) + (rnd() - 0.5) * w * 0.02;
    const y = lerp(h * 0.9, vpy + (h - vpy) * 0.3, t);
    const scale = lerp(1.3, 0.16, t) * (w / 1800);
    if (populate === "shelves") out += shelfRack(x, y, scale * 0.9, atmo(mix(GRAPHITE2, TEAL, 0.2), t), (0.95 - t * 0.3).toFixed(2));
    else if (populate === "machines") out += machineUnit("gantry", x, y, scale, rnd() > 0.5, t, (0.98 - t * 0.3).toFixed(2));
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
  const top = mix(INK, TEAL_DEEP, 0.1);
  const bottom = mix(WALL_GREY, TEAL_DEEP, 0.16);
  const vpx = w * (0.5 + (rnd() - 0.5) * 0.2), vpy = h * HORIZON_FRAC;
  const sideWall = mix(bottom, "#000000", 0.22);
  const floorNear = mix(GRAPHITE, CONCRETE_NEAR, 0.5);
  const floorFar = atmo(CONCRETE_FAR, 0.2);
  let out = `<defs>
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${top}"/><stop offset="100%" stop-color="${bottom}"/></linearGradient>
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${floorFar}"/><stop offset="100%" stop-color="${floorNear}"/></linearGradient>
  </defs>`;
  out += roomShell(w, h, vpx, vpy, { floorFill: "url(#floorGrad)", ceilFill: "url(#wallGrad)", sideFill: sideWall });
  out += floorGrid(w, h, vpx, vpy);
  const mx = w * (hero ? 0.6 : 0.52), my = h * 0.58, scale = (hero ? 1.55 : 1.7) * (w / 1900);
  out += lampUnit(mx - scale * 60, h * 0.05, my - scale * 40, 1.5, true, "0.85");
  out += machineUnit(kind, mx, my, scale, rnd() > 0.5, 0, 0.98);
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

// --------------------------------------------------------------------------- Template: people scene
function peopleScene(rnd, w, h, opts) {
  const { scene = "office", hero = false } = opts;
  const top = mix(hero ? INK : GRAPHITE, TEAL_DEEP, 0.08);
  const bottom = mix(WALL_GREY, TEAL_DEEP, 0.14);
  const vpx = w * (0.44 + rnd() * 0.12), vpy = h * HORIZON_FRAC;
  const sideWall = mix(bottom, "#000000", 0.22);
  const floorNear = hero ? mix(CONCRETE_NEAR, "#000000", 0.1) : CONCRETE_NEAR;
  const floorFar = atmo(CONCRETE_FAR, 0.2);
  let out = `<defs>
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${top}"/><stop offset="100%" stop-color="${bottom}"/></linearGradient>
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${floorFar}"/><stop offset="100%" stop-color="${floorNear}"/></linearGradient>
  </defs>`;
  out += roomShell(w, h, vpx, vpy, { floorFill: "url(#floorGrad)", ceilFill: "url(#wallGrad)", sideFill: sideWall });
  out += floorGrid(w, h, vpx, vpy);
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
    out += `<rect x="${(w * 0.34).toFixed(1)}" y="${(h * 0.09).toFixed(1)}" width="${(w * 0.32).toFixed(1)}" height="${(h * 0.19).toFixed(1)}" rx="6" fill="${INK}" opacity="0.85"/>
      <polyline points="${w * 0.38},${h * 0.25} ${w * 0.43},${h * 0.15} ${w * 0.49},${h * 0.21} ${w * 0.55},${h * 0.11} ${w * 0.62},${h * 0.19}" fill="none" stroke="${AQUA}" stroke-width="4" opacity="0.7"/>`;
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
      const x = lerp(w * 0.2, w * 0.8, i / 3), y = h * 0.36, s = 1.1 * (w / 1700);
      out += `<rect x="${(x - 62 * s).toFixed(1)}" y="${(y - 78 * s).toFixed(1)}" width="${(124 * s).toFixed(1)}" height="${(156 * s).toFixed(1)}" rx="6" fill="${GRAPHITE2}" opacity="0.92"/>
        <rect x="${(x - 62 * s).toFixed(1)}" y="${(y - 78 * s).toFixed(1)}" width="${(124 * s).toFixed(1)}" height="${(6 * s).toFixed(1)}" fill="${mix(GRAPHITE2, "#FFFFFF", 0.4)}"/>
        <polygon points="${(x - 22 * s).toFixed(1)},${(y + 30 * s).toFixed(1)} ${x.toFixed(1)},${(y + 6 * s).toFixed(1)} ${(x + 22 * s).toFixed(1)},${(y + 30 * s).toFixed(1)} ${(x + 14 * s).toFixed(1)},${(y - 4 * s).toFixed(1)} ${(x - 14 * s).toFixed(1)},${(y - 4 * s).toFixed(1)}" fill="${mix(AMBER, GRAPHITE2, 0.2)}" opacity="0.85"/>
        <circle cx="${x.toFixed(1)}" cy="${(y - 18 * s).toFixed(1)}" r="${(34 * s).toFixed(1)}" fill="${AMBER}" opacity="0.85"/>
        <circle cx="${x.toFixed(1)}" cy="${(y - 18 * s).toFixed(1)}" r="${(34 * s).toFixed(1)}" fill="none" stroke="${mix(AMBER, "#FFFFFF", 0.5)}" stroke-width="${(2.5 * s).toFixed(1)}"/>
        <path d="M${(x - 14 * s).toFixed(1)},${(y - 18 * s).toFixed(1)} l${(9 * s).toFixed(1)},${(10 * s).toFixed(1)} l${(18 * s).toFixed(1)},${(-20 * s).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="${(4 * s).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"/>`;
      out += `<ellipse cx="${x.toFixed(1)}" cy="${(y - 96 * s).toFixed(1)}" rx="${(76 * s).toFixed(1)}" ry="${(20 * s).toFixed(1)}" fill="${HAZE}" opacity="0.16" filter="url(#blurM)"/>`;
    }
  } else if (scene === "team") {
    const positions = [[-150, 0.86], [10, 0.9], [150, 0.86]];
    for (const [ox, yf] of positions) out += personFig(w / 2 + ox * (w / 1700), h * yf, 1.1 * (w / 1700), ox > 0, false, atmo(GRAPHITE, 0.05), 0.94);
  } else if (scene === "service") {
    const mx = w * 0.62, my = h * 0.62, s = 1.3 * (w / 1700);
    out += machineUnit("gantry", mx, my, s * 0.9, true, 0.35, 0.8);
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
  if (subject !== "globe") {
    out += `<rect y="${horizon.toFixed(1)}" width="${w}" height="${(h - horizon).toFixed(1)}" fill="url(#waterGrad)"/>
      <defs><linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${mix(duskMid, TEAL_DEEP, 0.5)}"/><stop offset="100%" stop-color="${mix(GRAPHITE2, TEAL_DEEP, 0.6)}"/></linearGradient></defs>
      <ellipse cx="${(w * 0.5).toFixed(1)}" cy="${horizon.toFixed(1)}" rx="${(w * 0.36).toFixed(1)}" ry="${(h * 0.05).toFixed(1)}" fill="${AMBER}" opacity="0.4" filter="url(#blurS)"/>`;
    for (let i = 0; i < 8; i++) {
      const y = horizon + (h - horizon) * (i / 8) + rnd() * 4;
      out += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${y.toFixed(1)}" stroke="${AMBER}" stroke-width="1" opacity="${(0.09 * (1 - i / 8)).toFixed(3)}"/>`;
    }
  } else {
    out += bokehField(rnd, w, h, 4, true);
  }
  if (subject === "port" || subject === "crate") {
    const containerColors = [mix(TEAL, AQUA, 0.15), AMBER, mix(GRAPHITE2, TEAL, 0.4)];
    for (let stack = 0; stack < 5; stack++) {
      const sx = w * (0.06 + stack * 0.1), depth = stack / 5, s = lerp(1, 0.55, depth);
      const rows = 2 + Math.floor(rnd() * 2);
      for (let r = 0; r < rows; r++) {
        const cy = horizon - r * 56 * s;
        const c = atmo(pick(rnd, containerColors), depth * 0.8);
        out += `<rect x="${sx.toFixed(1)}" y="${(cy - 56 * s).toFixed(1)}" width="${(96 * s).toFixed(1)}" height="${(56 * s).toFixed(1)}" fill="${c}" opacity="0.92"/>
          <rect x="${sx.toFixed(1)}" y="${(cy - 56 * s).toFixed(1)}" width="${(96 * s).toFixed(1)}" height="${(7 * s).toFixed(1)}" fill="${mix(c, "#FFFFFF", 0.5)}" opacity="0.9"/>
          <line x1="${(sx + 96 * s * 0.5).toFixed(1)}" y1="${(cy - 56 * s).toFixed(1)}" x2="${(sx + 96 * s * 0.5).toFixed(1)}" y2="${cy.toFixed(1)}" stroke="${mix(c, "#000000", 0.3)}" stroke-width="2" opacity="0.4"/>`;
      }
    }
    // gantry crane: legs, a raised boom with counterweight, and a trolley cable
    const cx = w * 0.7;
    out += `<polygon points="${(cx - 60).toFixed(1)},${horizon.toFixed(1)} ${(cx - 14).toFixed(1)},${(h * 0.12).toFixed(1)} ${(cx + 14).toFixed(1)},${(h * 0.12).toFixed(1)} ${(cx + 60).toFixed(1)},${horizon.toFixed(1)}" fill="${GRAPHITE}"/>
      <rect x="${(cx - 26).toFixed(1)}" y="${(h * 0.1).toFixed(1)}" width="52" height="22" rx="3" fill="${GRAPHITE}"/>
      <polygon points="${(cx - 20).toFixed(1)},${(h * 0.13).toFixed(1)} ${(cx + 236).toFixed(1)},${(h * 0.08).toFixed(1)} ${(cx + 236).toFixed(1)},${(h * 0.14).toFixed(1)} ${(cx + 16).toFixed(1)},${(h * 0.19).toFixed(1)}" fill="${GRAPHITE}"/>
      <rect x="${(cx - 90).toFixed(1)}" y="${(h * 0.1).toFixed(1)}" width="66" height="26" rx="4" fill="${GRAPHITE2}"/>
      <line x1="${(cx + 200).toFixed(1)}" y1="${(h * 0.09).toFixed(1)}" x2="${(cx + 200).toFixed(1)}" y2="${(h * 0.3).toFixed(1)}" stroke="${GRAPHITE}" stroke-width="3"/>
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
