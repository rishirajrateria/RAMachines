/**
 * scripts/illustrations/about.mjs — the about/factory hall illustration and the
 * two India/world "reach" cards. ADR-0002 palette only.
 */
import {
  INK, STEEL, STEEL_LIGHT, SPARK, SPARK_SOFT, STEEL_SOFT, GREY, WHITE,
  operator, groundShadow, scene,
} from "./common.mjs";
import { flatbedMachine, tubeLaserMachine, co2EngraverMachine, robotCellMachine, BOX_W, BOX_H, GROUND_Y } from "./machines.mjs";

function roofTrusses(width, topY, bottomY) {
  const bays = 6;
  const step = width / bays;
  let out = `<line x1="0" y1="${bottomY}" x2="${width}" y2="${bottomY}" stroke="${STEEL}" stroke-width="3" opacity="0.5"/>`;
  for (let i = 0; i <= bays; i++) {
    const x = i * step;
    out += `<line x1="${x}" y1="${topY}" x2="${x}" y2="${bottomY}" stroke="${STEEL}" stroke-width="4" opacity="0.45"/>`;
    if (i < bays) {
      const midX = x + step / 2;
      out += `<path d="M${x} ${bottomY} L${midX} ${topY} L${x + step} ${bottomY}" fill="none" stroke="${STEEL}" stroke-width="2.5" opacity="0.4"/>`;
      out += `<line x1="${x}" y1="${(topY + bottomY) / 2}" x2="${x + step}" y2="${(topY + bottomY) / 2}" stroke="${STEEL}" stroke-width="1.5" opacity="0.3"/>`;
    }
  }
  return out;
}

/** Corrugated wall siding lines + hanging pendant lights, to keep the tall wall
 * band between the trusses and the machine row from reading as empty space. */
function wallDetail(width, y0, y1) {
  let lines = "";
  const rows = 5;
  for (let i = 1; i <= rows; i++) {
    const y = y0 + ((y1 - y0) * i) / (rows + 1);
    lines += `<line x1="0" y1="${y.toFixed(1)}" x2="${width}" y2="${y.toFixed(1)}" stroke="${STEEL}" stroke-width="1" opacity="0.12"/>`;
  }
  const lampXs = [width * 0.18, width * 0.42, width * 0.66, width * 0.88];
  const lamps = lampXs
    .map((x) => `<g><line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + 26}" stroke="${STEEL}" stroke-width="2" opacity="0.5"/><circle cx="${x}" cy="${y0 + 34}" r="10" fill="${SPARK}" opacity="0.2"/><path d="M${x - 12} ${y0 + 26} L${x + 12} ${y0 + 26} L${x + 8} ${y0 + 40} L${x - 8} ${y0 + 40} Z" fill="${INK}" opacity="0.75"/></g>`)
    .join("");
  return `${lines}${lamps}`;
}

/** An overhead gantry crane rail spanning the hall, echoing the machines below. */
function craneRail(width, y) {
  return `<g opacity="0.8">
    <rect x="0" y="${y}" width="${width}" height="8" fill="${STEEL}"/>
    <rect x="${width * 0.34}" y="${y + 8}" width="46" height="20" rx="3" fill="${INK}"/>
    <line x1="${width * 0.34 + 10}" y1="${y + 28}" x2="${width * 0.34 + 10}" y2="${y + 46}" stroke="${INK}" stroke-width="3"/>
    <line x1="${width * 0.34 + 36}" y1="${y + 28}" x2="${width * 0.34 + 36}" y2="${y + 46}" stroke="${INK}" stroke-width="3"/>
    <rect x="${width * 0.34 + 4}" y="${y + 44}" width="38" height="8" rx="2" fill="${SPARK}"/>
  </g>`;
}

function crateStack(x, y) {
  const crate = (cx, cy, w, h) => `<g><rect x="${cx}" y="${cy}" width="${w}" height="${h}" rx="2" fill="${GREY}" stroke="${INK}" stroke-width="1.5"/><line x1="${cx}" y1="${cy}" x2="${cx + w}" y2="${cy + h}" stroke="${INK}" stroke-width="1" opacity="0.3"/><line x1="${cx + w}" y1="${cy}" x2="${cx}" y2="${cy + h}" stroke="${INK}" stroke-width="1" opacity="0.3"/></g>`;
  return `<g>${crate(x, y - 46, 58, 46)}${crate(x + 62, y - 34, 44, 34)}${crate(x - 4, y - 82, 50, 38)}</g>`;
}

function forklift(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    ${groundShadow(60, 4, 90, 8, 0.14)}
    <rect x="-6" y="-96" width="10" height="96" fill="${STEEL}"/>
    <rect x="8" y="-96" width="10" height="96" fill="${STEEL_LIGHT}"/>
    <rect x="-6" y="-104" width="24" height="10" rx="2" fill="${INK}"/>
    <rect x="14" y="-60" width="56" height="40" rx="6" fill="${SPARK}"/>
    <rect x="20" y="-88" width="30" height="26" rx="4" fill="${STEEL_SOFT}" stroke="${INK}" stroke-width="1.5"/>
    <rect x="18" y="-24" width="70" height="18" rx="4" fill="${INK}"/>
    <rect x="-14" y="-26" width="28" height="8" fill="${INK}"/>
    <rect x="-14" y="-16" width="28" height="8" fill="${INK}"/>
    <circle cx="24" cy="-2" r="14" fill="${INK}"/>
    <circle cx="24" cy="-2" r="6" fill="${GREY}"/>
    <circle cx="82" cy="-2" r="10" fill="${INK}"/>
    <circle cx="82" cy="-2" r="4" fill="${GREY}"/>
  </g>`;
}

/** About/factory: a row of four machine silhouettes standing in a truss-roofed hall. */
export function factoryHallSvg(width, height) {
  const floorY = height * 0.82;
  const trussTop = height * 0.05;
  const trussBottom = height * 0.22;
  const builders = [
    () => flatbedMachine("ra-f1530"),
    () => tubeLaserMachine(),
    () => co2EngraverMachine(),
    () => robotCellMachine(1),
  ];
  const spacing = width / builders.length;
  const scale = (spacing * 0.9) / BOX_W;
  let row = "";
  builders.forEach((build, i) => {
    const m = build();
    const slotCx = i * spacing + spacing / 2;
    const tx = slotCx - (BOX_W * scale) / 2;
    const ty = floorY - GROUND_Y * scale;
    row += `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale.toFixed(3)})">${m.svg}</g>`;
  });

  const people = `${operator(width * 0.1, floorY - 92, 1.05)}${operator(width * 0.605, floorY - 78, 0.9, { color: STEEL })}`;
  const floor = `<rect x="0" y="${floorY}" width="${width}" height="${height - floorY}" fill="${WHITE}"/><rect x="0" y="${floorY - 3}" width="${width}" height="6" fill="${INK}" opacity="0.22"/>`;
  const floorStripe = `<line x1="0" y1="${floorY + (height - floorY) * 0.55}" x2="${width}" y2="${floorY + (height - floorY) * 0.55}" stroke="${SPARK}" stroke-width="3" opacity="0.35" stroke-dasharray="26 18"/>`;

  const content = `
    ${roofTrusses(width, trussTop, trussBottom)}
    ${wallDetail(width, trussBottom, floorY)}
    ${craneRail(width, trussBottom + (floorY - trussBottom) * 0.52)}
    ${floor}
    ${floorStripe}
    ${row}
    ${crateStack(width * 0.855, floorY)}
    ${forklift(width * 0.9, floorY, 1.05)}
    ${people}
  `;
  return scene({ width, height, bg: STEEL_SOFT, content, caption: "RA Machine manufacturing facility — Kolkata, India" });
}

/** Rough, deliberately abstract India outline + a highlighted Kolkata HQ pin + service pins. */
export function indiaReachSvg(width, height) {
  const cx = width * 0.42;
  const cy = height * 0.46;
  const s = height / 280;
  const outline = `M ${cx - 60 * s} ${cy - 120 * s}
    L ${cx + 40 * s} ${cy - 128 * s} L ${cx + 78 * s} ${cy - 70 * s} L ${cx + 60 * s} ${cy - 10 * s}
    L ${cx + 94 * s} ${cy + 20 * s} L ${cx + 44 * s} ${cy + 60 * s} L ${cx + 30 * s} ${cy + 118 * s}
    L ${cx + 4 * s} ${cy + 60 * s} L ${cx - 30 * s} ${cy + 30 * s} L ${cx - 66 * s} ${cy + 40 * s}
    L ${cx - 44 * s} ${cy - 20 * s} L ${cx - 70 * s} ${cy - 60 * s} Z`;
  const pins = [
    [cx - 20 * s, cy - 40 * s],
    [cx + 20 * s, cy - 10 * s],
    [cx - 10 * s, cy + 40 * s],
    [cx - 40 * s, cy + 0 * s],
  ];
  const pinDots = pins
    .map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${WHITE}" stroke="${STEEL}" stroke-width="2.5"/>`)
    .join("");
  const hqX = cx + 30 * s;
  const hqY = cy + 62 * s;
  const hqPin = `<g><circle cx="${hqX}" cy="${hqY}" r="14" fill="${SPARK}" opacity="0.28"/><path d="M${hqX} ${hqY - 16} c9 0 15 6.5 15 15 c0 10 -15 24 -15 24 s-15 -14 -15 -24 c0 -8.5 6 -15 15 -15 Z" fill="${SPARK}" stroke="${WHITE}" stroke-width="2"/><circle cx="${hqX}" cy="${hqY - 1}" r="5" fill="${WHITE}"/><text x="${hqX + 22}" y="${hqY - 2}" font-family="Arial, sans-serif" font-size="${Math.round(height * 0.05)}" font-weight="700" fill="${INK}">Kolkata HQ</text></g>`;
  const content = `<path d="${outline}" fill="${STEEL}" opacity="0.9"/>${pinDots}${hqPin}`;
  return scene({ width, height, bg: STEEL_SOFT, content, caption: "Installation & service reach across India" });
}

/** Rough globe + shipping routes for the export/world-reach card. */
export function worldReachSvg(width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const r = height * 0.36;
  const routes = [
    [cx - r * 0.8, cy - r * 0.1, cx, cy - r * 0.55, cx + r * 0.75, cy - r * 0.2],
    [cx - r * 0.5, cy + r * 0.5, cx + r * 0.1, cy + r * 0.15, cx + r * 0.7, cy + r * 0.5],
    [cx - r * 0.85, cy + r * 0.2, cx - r * 0.15, cy + r * 0.62, cx + r * 0.3, cy + r * 0.78],
  ]
    .map(([x1, y1, x2, y2, x3, y3]) => `<path d="M${x1} ${y1} Q${x2} ${y2} ${x3} ${y3}" fill="none" stroke="${SPARK}" stroke-width="2.5" stroke-dasharray="2 6" stroke-linecap="round"/>`)
    .join("");
  const content = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${STEEL}"/><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.4}" fill="none" stroke="${WHITE}" stroke-width="1.5" opacity="0.5"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.4}" ry="${r}" fill="none" stroke="${WHITE}" stroke-width="1.5" opacity="0.5"/><line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${WHITE}" stroke-width="1.5" opacity="0.5"/>${routes}<circle cx="${cx - r * 0.8}" cy="${cy - r * 0.1}" r="5" fill="${SPARK}"/><circle cx="${cx + r * 0.75}" cy="${cy - r * 0.2}" r="5" fill="${SPARK}"/><circle cx="${cx + r * 0.7}" cy="${cy + r * 0.5}" r="5" fill="${SPARK}"/><circle cx="${cx + r * 0.3}" cy="${cy + r * 0.78}" r="5" fill="${SPARK}"/>`;
  return scene({ width, height, bg: SPARK_SOFT, content, caption: "Exporting to 25+ countries" });
}
