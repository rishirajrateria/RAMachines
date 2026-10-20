#!/usr/bin/env node
/**
 * scripts/compose-why-images.mjs — draws the three "Why RA Machine" pictures
 * (`node scripts/compose-why-images.mjs`): quality check, service engineer and
 * installation. They are illustrations in the site's dark teal style (people drawn
 * as Indian technicians in hard hats and coveralls) with the RA Machine mark in the
 * bottom-right corner, per the client's brief. Replace the three WebP files in
 * public/photos with real photographs whenever they arrive and stop running this.
 *
 * Outputs (1600×1200): public/photos/slot-quality-check.webp, slot-engineer-service.webp,
 * slot-installation.webp. scripts/generate-photos.mjs no longer generates these keys.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "photos");
const W = 1600;
const H = 1200;

const SKIN = ["#a56b45", "#8f5a38", "#b9794f"];
const NAVY = "#1d3557";
const TEAL = "#0f766e";

/** Dark workshop backdrop: wall, soft window light, floor. */
function backdrop(floorY) {
  return `
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071a1a"/><stop offset="1" stop-color="#14403d"/></linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f2a29"/><stop offset="1" stop-color="#081718"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#7ef0dd" stop-opacity="0.35"/><stop offset="1" stop-color="#7ef0dd" stop-opacity="0"/></radialGradient>
    <radialGradient id="spark" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff2c4" stop-opacity="1"/><stop offset="0.35" stop-color="#ffb347" stop-opacity="0.8"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#wall)"/>
  <g filter="url(#soft)" opacity="0.5">
    <rect x="160" y="90" width="260" height="360" fill="#9fe7d9" opacity="0.25"/>
    <rect x="560" y="90" width="260" height="360" fill="#9fe7d9" opacity="0.2"/>
    <rect x="1000" y="90" width="260" height="360" fill="#9fe7d9" opacity="0.22"/>
  </g>
  <ellipse cx="${W * 0.62}" cy="${floorY - 120}" rx="620" ry="260" fill="url(#glow)"/>
  <rect y="${floorY}" width="${W}" height="${H - floorY}" fill="url(#floor)"/>
  <rect y="${floorY}" width="${W}" height="3" fill="#2f6f69" opacity="0.6"/>`;
}

/** A standing technician; feet at (x, y), `s` scales the 340-unit figure. */
function person({ x, y, s = 1, skin = SKIN[0], suit = NAVY, hat = "#f4f1e8", arms, strap = true, mirror = false }) {
  const arm = (a) =>
    `<polyline points="${a.s.join(",")} ${a.e.join(",")} ${a.h.join(",")}" fill="none" stroke="${suit}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="${a.h[0]}" cy="${a.h[1]}" r="12" fill="${skin}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${mirror ? -s : s} ${s})">
    <ellipse cx="0" cy="2" rx="62" ry="10" fill="#000" opacity="0.35"/>
    <rect x="-26" y="-152" width="22" height="140" rx="6" fill="#16253c"/>
    <rect x="4" y="-152" width="22" height="140" rx="6" fill="#16253c"/>
    <rect x="-31" y="-16" width="29" height="16" rx="6" fill="#0c0f12"/>
    <rect x="2" y="-16" width="29" height="16" rx="6" fill="#0c0f12"/>
    <rect x="-44" y="-275" width="88" height="138" rx="22" fill="${suit}"/>
    ${strap ? `<rect x="-44" y="-205" width="88" height="11" fill="#d9e84a"/><rect x="-44" y="-180" width="88" height="11" fill="#d9e84a"/>` : ""}
    <rect x="-9" y="-292" width="18" height="24" rx="6" fill="${skin}"/>
    <path d="M-22,-272 L0,-250 L22,-272" fill="none" stroke="#0b1a2d" stroke-width="5" stroke-linejoin="round"/>
    ${arms.map(arm).join("")}
    <ellipse cx="0" cy="-318" rx="26" ry="31" fill="${skin}"/>
    <ellipse cx="-27" cy="-316" rx="5" ry="9" fill="${skin}"/><ellipse cx="27" cy="-316" rx="5" ry="9" fill="${skin}"/>
    <path d="M-26,-330 Q0,-362 26,-330 L26,-344 Q0,-372 -26,-344 Z" fill="#14100c"/>
    <circle cx="-10" cy="-322" r="2.6" fill="#14100c"/><circle cx="10" cy="-322" r="2.6" fill="#14100c"/>
    <path d="M-13,-304 Q0,-298 13,-304 Q0,-308 -13,-304 Z" fill="#14100c"/>
    <path d="M-9,-296 Q0,-290 9,-296" fill="none" stroke="#5a2d1c" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M-36,-330 Q0,-384 36,-330 Z" fill="${hat}"/>
    <rect x="-42" y="-332" width="84" height="10" rx="5" fill="${hat}"/>
    <rect x="-4" y="-366" width="8" height="26" fill="#cfcabd" opacity="0.7"/>
  </g>`;
}

/** Flat-bed fibre laser: bed, gantry, head and electrical cabinet. (x, y) is the bed's bottom-left. */
function machine({ x, y, w, spark = true }) {
  const bedH = w * 0.16;
  const gh = w * 0.42;
  return `<g>
    <ellipse cx="${x + w * 0.55}" cy="${y + 12}" rx="${w * 0.62}" ry="${w * 0.045}" fill="#000" opacity="0.4"/>
    <rect x="${x}" y="${y - bedH * 0.38}" width="${w}" height="${bedH * 0.38}" rx="8" fill="${TEAL}"/>
    <rect x="${x}" y="${y - bedH}" width="${w}" height="${bedH * 0.62}" rx="10" fill="#e9eff0"/>
    <rect x="${x + 14}" y="${y - bedH + 8}" width="${w - 28}" height="${bedH * 0.2}" rx="6" fill="#bcc9cb"/>
    ${Array.from({ length: 28 }, (_, i) => `<rect x="${x + 24 + i * ((w - 48) / 28)}" y="${y - bedH + 10}" width="3" height="${bedH * 0.16}" fill="#6b7c80"/>`).join("")}
    <rect x="${x + w * 0.06}" y="${y - bedH - gh}" width="${w * 0.07}" height="${gh}" rx="8" fill="#f2f6f6"/>
    <rect x="${x + w * 0.87}" y="${y - bedH - gh}" width="${w * 0.07}" height="${gh}" rx="8" fill="#f2f6f6"/>
    <rect x="${x + w * 0.06}" y="${y - bedH - gh}" width="${w * 0.88}" height="${w * 0.07}" rx="8" fill="#dfe8e9"/>
    <rect x="${x + w * 0.06}" y="${y - bedH - gh}" width="${w * 0.88}" height="5" fill="${TEAL}"/>
    <rect x="${x + w * 0.44}" y="${y - bedH - gh + w * 0.03}" width="${w * 0.1}" height="${w * 0.12}" rx="6" fill="#ffffff"/>
    <rect x="${x + w * 0.485}" y="${y - bedH - gh + w * 0.15}" width="${w * 0.02}" height="${w * 0.09}" fill="#46585c"/>
    ${spark ? `<circle cx="${x + w * 0.495}" cy="${y - bedH + 6}" r="${w * 0.07}" fill="url(#spark)"/>` : ""}
    <rect x="${x + w * 1.01}" y="${y - bedH - gh * 0.55}" width="${w * 0.16}" height="${bedH + gh * 0.55}" rx="10" fill="${TEAL}"/>
    <rect x="${x + w * 1.035}" y="${y - bedH - gh * 0.48}" width="${w * 0.11}" height="${w * 0.08}" rx="5" fill="#0a2a2b"/>
    <polyline points="${x + w * 1.045},${y - bedH - gh * 0.43} ${x + w * 1.07},${y - bedH - gh * 0.4} ${x + w * 1.09},${y - bedH - gh * 0.46} ${x + w * 1.12},${y - bedH - gh * 0.41}" fill="none" stroke="#5eead4" stroke-width="3"/>
    <circle cx="${x + w * 1.09}" cy="${y - bedH - gh * 0.3}" r="6" fill="#facc15"/>
  </g>`;
}

const sceneService = () => `${backdrop(860)}
  ${machine({ x: 640, y: 905, w: 720 })}
  <rect x="470" y="842" width="120" height="58" rx="8" fill="#c0392b"/><rect x="470" y="842" width="120" height="14" rx="6" fill="#992d22"/><rect x="518" y="830" width="24" height="14" rx="5" fill="#222"/>
  ${person({ x: 360, y: 1010, s: 2.25, skin: SKIN[0], arms: [
    { s: [-44, -258], e: [-78, -170], h: [-30, -130] },
    { s: [44, -258], e: [96, -200], h: [208, -250] },
  ] })}
  <g transform="translate(262 745) rotate(-8)"><rect x="-74" y="-52" width="148" height="104" rx="12" fill="#10181c" stroke="#e2e8e9" stroke-width="6"/><rect x="-62" y="-40" width="124" height="80" rx="6" fill="#0d3b3a"/><polyline points="-52,18 -28,-4 -6,10 18,-22 52,-8" fill="none" stroke="#5eead4" stroke-width="5" stroke-linejoin="round"/></g>`;

const sceneInstall = () => `${backdrop(880)}
  <g stroke="#8aa0a3" stroke-width="5" fill="none"><line x1="600" y1="0" x2="600" y2="64"/><line x1="1100" y1="0" x2="1100" y2="64"/></g>
  <rect x="540" y="60" width="620" height="26" rx="8" fill="#f4b400"/>
  <g stroke="#c9d3d5" stroke-width="6"><line x1="600" y1="86" x2="630" y2="520"/><line x1="1100" y1="86" x2="1070" y2="520"/></g>
  <circle cx="630" cy="522" r="12" fill="#f4b400"/><circle cx="1070" cy="522" r="12" fill="#f4b400"/>
  <g transform="translate(0 -60)">${machine({ x: 560, y: 905, w: 580, spark: false })}</g>
  <rect x="540" y="846" width="800" height="34" rx="6" fill="#9a6b3a"/><g fill="#7a5128"><rect x="560" y="846" width="40" height="34"/><rect x="900" y="846" width="40" height="34"/><rect x="1290" y="846" width="40" height="34"/></g>
  <ellipse cx="940" cy="1010" rx="520" ry="26" fill="#000" opacity="0.35"/>
  ${person({ x: 280, y: 1060, s: 2.1, skin: SKIN[1], hat: "#f4c20d", suit: "#e8590c", arms: [
    { s: [-44, -258], e: [-70, -190], h: [-24, -150] },
    { s: [44, -258], e: [100, -215], h: [150, -195] },
  ] })}
  ${person({ x: 1400, y: 1090, s: 2.0, skin: SKIN[2], hat: "#f4f1e8", suit: NAVY, mirror: true, arms: [
    { s: [-44, -258], e: [80, -230], h: [170, -215] },
    { s: [44, -258], e: [70, -190], h: [24, -150] },
  ] })}`;

const sceneQuality = () => `${backdrop(820)}
  <rect x="120" y="840" width="1360" height="60" rx="10" fill="#27484a"/>
  <rect x="120" y="840" width="1360" height="10" fill="#3b6b6d"/>
  <rect x="200" y="900" width="40" height="300" fill="#1a3335"/><rect x="1360" y="900" width="40" height="300" fill="#1a3335"/>
  ${person({ x: 1180, y: 1230, s: 2.9, skin: SKIN[1], arms: [
    { s: [-44, -258], e: [-110, -238], h: [-190, -208] },
    { s: [44, -258], e: [-30, -190], h: [-188, -168] },
  ], strap: true })}
  <g transform="translate(640 600)">
    <path d="M-250,230 L-150,60 Q-110,10 -40,10 L250,10 Q310,10 330,70 L370,230 Z" fill="#c4cfd1"/>
    <path d="M-250,230 L-150,60 Q-110,10 -40,10 L250,10 Q310,10 330,70 L370,230 Z" fill="none" stroke="#e8eff0" stroke-width="6"/>
    <circle cx="-30" cy="110" r="58" fill="#27484a"/><circle cx="170" cy="120" r="34" fill="#27484a"/><rect x="230" y="70" width="70" height="42" rx="8" fill="#27484a"/>
    <rect x="-300" y="226" width="720" height="22" rx="6" fill="#9eaeb1"/>
    <g transform="translate(-6 30)"><rect x="-12" y="-110" width="24" height="200" rx="4" fill="#d6dfe0"/><rect x="-12" y="-110" width="150" height="26" rx="4" fill="#d6dfe0"/><rect x="-100" y="40" width="112" height="16" rx="3" fill="#d6dfe0"/><rect x="-14" y="40" width="26" height="62" rx="3" fill="#aab9bc"/>
      <rect x="40" y="-170" width="128" height="62" rx="9" fill="#0a1d1e" stroke="#e2e8e9" stroke-width="5"/>
      <text x="104" y="-125" font-family="DejaVu Sans Mono, monospace" font-size="34" font-weight="700" fill="#5eead4" text-anchor="middle">24.05</text></g>
  </g>
  <g transform="translate(330 400)"><circle r="86" fill="#0f766e"/><circle r="86" fill="none" stroke="#7ef0dd" stroke-width="6"/><polyline points="-40,2 -10,34 44,-30" fill="none" stroke="#ffffff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></g>`;

async function logoCorner() {
  const mark = await sharp(await readFile(join(ROOT, "public", "brand", "ra-machine-mark.svg")), { density: 300 })
    .resize(104, 104)
    .png()
    .toBuffer();
  const pill = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="136"><rect width="400" height="136" rx="68" fill="#06201f" fill-opacity="0.78" stroke="#7ef0dd" stroke-opacity="0.45" stroke-width="2"/><text x="140" y="80" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" font-weight="700" fill="#f4faf9">RA Machine</text></svg>`);
  return sharp(pill).composite([{ input: mark, left: 16, top: 16 }]).png().toBuffer();
}

async function render(name, svgBody, corner) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svgBody}</svg>`;
  await sharp(Buffer.from(svg))
    .composite([{ input: corner, left: W - 400 - 44, top: H - 136 - 44 }])
    .webp({ quality: 78 })
    .toFile(join(OUT, `${name}.webp`));
  console.log("wrote", `public/photos/${name}.webp`);
}

const corner = await logoCorner();
await render("slot-quality-check", sceneQuality(), corner);
await render("slot-engineer-service", sceneService(), corner);
await render("slot-installation", sceneInstall(), corner);
