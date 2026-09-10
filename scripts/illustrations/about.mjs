/**
 * scripts/illustrations/about.mjs — ADR-0005 §7: the about/factory illustration
 * and the two India/world "reach" cards, in the same soft-light + line-art
 * language as the rest of the site. Teal is used only as a small, deliberate
 * accent (the Kolkata HQ pin, export route dots) — never as a machine fill.
 */
import { INK, TEAL, ambientLight, lineArt, scene } from "./common.mjs";
import { flatbedMachine, tubeLaserMachine, co2EngraverMachine, robotCellMachine, BOX_W, GROUND_Y } from "./machines.mjs";

/** A row of the four machine-family glyphs standing on a single ground line. */
export function factoryHallSvg(width, height) {
  const { defs, content: orbs } = ambientLight(width, height);
  const floorY = height * 0.76;
  const builders = [flatbedMachine("ra-f1530"), tubeLaserMachine(), co2EngraverMachine(), robotCellMachine(1)];
  const spacing = width / builders.length;
  const scale = (spacing * 0.82) / BOX_W;

  const row = builders
    .map((m, i) => {
      const slotCx = i * spacing + spacing / 2;
      const tx = slotCx - (BOX_W * scale) / 2;
      const ty = floorY - GROUND_Y * scale;
      return `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale.toFixed(3)})">${m.svg}</g>`;
    })
    .join("");

  const floorLine = lineArt(`<path d="M0 ${floorY} L${width} ${floorY}" opacity="0.3"/>`);

  const content = `
    <rect width="${width}" height="${height}" fill="#F6F8F9"/>
    ${orbs}
    ${floorLine}
    ${row}
  `;
  return scene({ width, height, defs, content, caption: "RA Machine manufacturing facility — Kolkata, India" });
}

/** A simplified, deliberately abstract line-art India outline with a small teal
 * Kolkata HQ pin and a few ink service-reach dots. */
export function indiaReachSvg(width, height) {
  const { defs, content: orbs } = ambientLight(width, height);
  const cx = width * 0.44;
  const cy = height * 0.54;
  const s = height / 340;
  const outline = `M ${cx - 60 * s} ${cy - 120 * s}
    L ${cx + 40 * s} ${cy - 128 * s} L ${cx + 78 * s} ${cy - 70 * s} L ${cx + 60 * s} ${cy - 10 * s}
    L ${cx + 94 * s} ${cy + 20 * s} L ${cx + 44 * s} ${cy + 60 * s} L ${cx + 30 * s} ${cy + 118 * s}
    L ${cx + 4 * s} ${cy + 60 * s} L ${cx - 30 * s} ${cy + 30 * s} L ${cx - 66 * s} ${cy + 40 * s}
    L ${cx - 44 * s} ${cy - 20 * s} L ${cx - 70 * s} ${cy - 60 * s} Z`;

  const pins = [
    [cx - 20 * s, cy - 40 * s],
    [cx + 20 * s, cy - 10 * s],
    [cx - 10 * s, cy + 40 * s],
    [cx - 40 * s, cy],
  ];
  const pinDots = pins.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="none"/>`).join("");

  const hqX = cx + 30 * s;
  const hqY = cy + 62 * s;
  const hqPin = `<circle cx="${hqX}" cy="${hqY}" r="7" fill="${TEAL}"/><text x="${hqX + 16}" y="${hqY + 5}" font-family="Arial, sans-serif" font-size="${Math.round(
    height * 0.045,
  )}" font-weight="700" fill="${INK}">Kolkata HQ</text>`;

  const content = `
    <rect width="${width}" height="${height}" fill="#F6F8F9"/>
    ${orbs}
    ${lineArt(`<path d="${outline}"/>${pinDots}`)}
    ${hqPin}
  `;
  return scene({ width, height, defs, content, caption: "Installation & service reach across India" });
}

/** A line-art globe with a handful of teal-dashed export routes. */
export function worldReachSvg(width, height) {
  const { defs, content: orbs } = ambientLight(width, height);
  const cx = width / 2;
  const cy = height / 2;
  const r = height * 0.34;

  const globe = lineArt(`
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.38}"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.38}" ry="${r}"/>
    <path d="M${cx - r} ${cy} L${cx + r} ${cy}" opacity="0.5"/>
  `, { opacity: 0.7 });

  const routes = [
    [cx - r * 0.8, cy - r * 0.1, cx, cy - r * 0.55, cx + r * 0.75, cy - r * 0.2],
    [cx - r * 0.5, cy + r * 0.5, cx + r * 0.1, cy + r * 0.15, cx + r * 0.7, cy + r * 0.5],
    [cx - r * 0.85, cy + r * 0.2, cx - r * 0.15, cy + r * 0.62, cx + r * 0.3, cy + r * 0.78],
  ]
    .map(
      ([x1, y1, x2, y2, x3, y3]) =>
        `<path d="M${x1} ${y1} Q${x2} ${y2} ${x3} ${y3}" fill="none" stroke="${TEAL}" stroke-width="2" stroke-dasharray="1 6" stroke-linecap="round"/>`,
    )
    .join("");
  const dots = [
    [cx - r * 0.8, cy - r * 0.1],
    [cx + r * 0.75, cy - r * 0.2],
    [cx + r * 0.7, cy + r * 0.5],
    [cx + r * 0.3, cy + r * 0.78],
  ]
    .map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${TEAL}"/>`)
    .join("");

  const content = `
    <rect width="${width}" height="${height}" fill="#F6F8F9"/>
    ${orbs}
    ${globe}
    ${routes}
    ${dots}
  `;
  return scene({ width, height, defs, content, caption: "Exporting to 25+ countries" });
}
