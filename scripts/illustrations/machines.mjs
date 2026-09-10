/**
 * scripts/illustrations/machines.mjs — richer flat-vector machine drawings used by
 * product, category, about and hero illustrations. Every machine is drawn in a
 * shared 520×320 local box (ground line at y=272) so callers can position/scale/crop
 * it uniformly. ADR-0004 palette only: ink, teal (+ light teal), spark (+ light
 * spark), light grey, white.
 */
import {
  INK, STEEL, STEEL_LIGHT, SPARK, SPARK_LIGHT, GREY, WHITE,
  sparkBurst, sparkChips, operator, groundShadow, namePlate, controlScreen,
  gasCylinder, gearShape, bracketShape, plateShape,
} from "./common.mjs";

export const BOX_W = 560;
export const BOX_H = 320;
export const GROUND_Y = 272;

/** Wraps machine content in a translate+scale so callers can drop any machine
 * into any canvas size with the ground line landing at a consistent height. */
export function placeInScene(contentSvg, targetW, targetH, { scale, groundRatio = 0.86, offsetX = 0 } = {}) {
  const tx = (targetW - BOX_W * scale) / 2 + offsetX;
  const ty = targetH * groundRatio - GROUND_Y * scale;
  return `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale})">${contentSvg}</g>`;
}

// ---- shared sub-drawings --------------------------------------------------

function baseRail(x, y, w, h = 14) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${INK}"/>`;
}

function legs(xs, y, h, w = 16) {
  return xs.map((x) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" fill="${INK}"/>`).join("");
}

/** Rail track marks under the gantry posts — reads as "gantry on rails". */
function railTrack(x1, x2, y) {
  return `<rect x="${x1 - 30}" y="${y}" width="${x2 - x1 + 60}" height="5" rx="2" fill="${INK}" opacity="0.35"/>`;
}

function bedSlats(x, y, w, h, n = 9) {
  let s = "";
  const step = w / n;
  for (let i = 1; i < n; i++) {
    s += `<line x1="${x + i * step}" y1="${y}" x2="${x + i * step}" y2="${y + h}" stroke="${INK}" stroke-width="1.5" opacity="0.28"/>`;
  }
  return s;
}

function cutout(kind, cx, cy, size) {
  if (kind === "gear") return gearShape(cx, cy, size * 0.5, 10, GREY, INK);
  if (kind === "bracket") return bracketShape(cx - size * 0.55, cy - size * 0.32, size * 1.1, size * 0.64, GREY, INK);
  return plateShape(cx - size * 0.4, cy - size * 0.32, size * 0.8, size * 0.64, GREY, INK);
}

/** Bed + in-progress cut sheet with a few negative-space part shapes. */
function bedWithSheet(x, y, w, h, { cutKinds = ["gear", "bracket", "plate"], sheetInset = 8 } = {}) {
  const sheetX = x + sheetInset;
  const sheetW = w - sheetInset * 2;
  const sheetY = y - 30;
  const sheetH = 26;
  let cuts = "";
  const n = cutKinds.length;
  cutKinds.forEach((k, i) => {
    const cx = sheetX + sheetW * ((i + 0.5) / n);
    cuts += cutout(k, cx, sheetY + sheetH / 2, Math.min(sheetH * 1.5, sheetW / n - 6));
  });
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${STEEL}"/>
    ${bedSlats(x, y, w, h)}
    <rect x="${sheetX}" y="${sheetY}" width="${sheetW}" height="${sheetH}" rx="2" fill="${WHITE}" stroke="${INK}" stroke-width="2" stroke-dasharray="6 5"/>
    ${cuts}
  </g>`;
}

/** Two posts + a top beam — the gantry — with a rail-mounted carriage placeholder. */
function gantry(postX1, postX2, postTopY, postBottomY, beamThickness) {
  return `<g>
    <rect x="${postX1 - 9}" y="${postTopY}" width="18" height="${postBottomY - postTopY}" rx="4" fill="${INK}"/>
    <rect x="${postX2 - 9}" y="${postTopY}" width="18" height="${postBottomY - postTopY}" rx="4" fill="${INK}"/>
    <rect x="${postX1 - 12}" y="${postTopY - beamThickness}" width="${postX2 - postX1 + 24}" height="${beamThickness}" rx="6" fill="${STEEL}"/>
    <rect x="${postX1 - 12}" y="${postTopY - beamThickness}" width="${postX2 - postX1 + 24}" height="${beamThickness * 0.38}" rx="4" fill="${STEEL_LIGHT}"/>
  </g>`;
}

/** Cutting-head carriage riding the beam with a tapered nozzle pointing at the sheet. */
function cuttingHead(cx, beamY, tipY) {
  return {
    tip: [cx, tipY],
    svg: `<g>
      <rect x="${cx - 15}" y="${beamY - 6}" width="30" height="22" rx="4" fill="${INK}"/>
      <rect x="${cx - 8}" y="${beamY + 14}" width="16" height="14" fill="${STEEL_LIGHT}"/>
      <path d="M${cx - 8} ${beamY + 28} L${cx + 8} ${beamY + 28} L${cx + 3} ${tipY} L${cx - 3} ${tipY} Z" fill="${INK}"/>
      <circle cx="${cx}" cy="${beamY + 4}" r="4" fill="${SPARK}"/>
    </g>`,
  };
}

function cabinet(x, y, w, h, label) {
  const screenW = w - 16;
  const screenH = h * 0.42;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${STEEL}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h * 0.1}" fill="${STEEL_LIGHT}"/>
    ${controlScreen(x + 8, y + h * 0.16, screenW, screenH)}
    ${namePlate(x + 8, y + h * 0.68, screenW, h * 0.16, label, { size: Math.max(8, w * 0.09) })}
    <circle cx="${x + w / 2}" cy="${y + h * 0.9}" r="4" fill="${SPARK}"/>
  </g>`;
}

/** A partially-extended exchange (pallet-changer) table beside the main bed. */
function exchangeTable(x, y, w, h) {
  return `<g opacity="0.92">
    <rect x="${x}" y="${y + 6}" width="${w}" height="${h - 6}" rx="4" fill="${STEEL_LIGHT}" opacity="0.55"/>
    ${bedSlats(x, y + 6, w, h - 6, 5)}
    <rect x="${x}" y="${y}" width="${w}" height="6" fill="${INK}" opacity="0.4"/>
  </g>`;
}

/** Semi-transparent safety enclosure: side walls, a roofline and a windowed door. */
function enclosure(x, y, w, h, doorX) {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${STEEL_LIGHT}" opacity="0.16"/>
    <rect x="${x}" y="${y}" width="${w}" height="6" fill="${STEEL}" opacity="0.6"/>
    <rect x="${x}" y="${y}" width="6" height="${h}" fill="${STEEL}" opacity="0.5"/>
    <rect x="${x + w - 6}" y="${y}" width="6" height="${h}" fill="${STEEL}" opacity="0.5"/>
    <rect x="${doorX}" y="${y + h * 0.12}" width="${w * 0.22}" height="${h * 0.8}" fill="${WHITE}" opacity="0.5" stroke="${STEEL}" stroke-width="1.5"/>
    <rect x="${x}" y="${y + h - 10}" width="${w}" height="10" fill="${SPARK}" opacity="0.5"/>
  </g>`;
}

// ---- flatbed fiber laser (RA-F1530 / F3015 Pro / F6020 HD / F12K) --------

const FLATBED_PRESETS = {
  "ra-f1530": { bedX: 165, bedW: 210, postTopY: 112, beamThickness: 20, exchangeTable: false, enclosure: false, legN: 3, cabW: 68, label: "RA-F1530" },
  "ra-f3015-pro": { bedX: 138, bedW: 240, postTopY: 96, beamThickness: 23, exchangeTable: true, enclosure: false, legN: 3, cabW: 72, label: "F3015 PRO" },
  "ra-f6020-hd": { bedX: 112, bedW: 260, postTopY: 80, beamThickness: 26, exchangeTable: true, enclosure: "partial", legN: 4, cabW: 74, label: "F6020 HD" },
  "ra-f12k": { bedX: 86, bedW: 270, postTopY: 62, beamThickness: 30, exchangeTable: true, enclosure: "full", legN: 5, cabW: 76, label: "RA-F12K" },
};

/** Crop rectangle centered on a focus point, sized for the "detail" angle. */
function cropAround(cx, cy, w, h) {
  return [cx - w / 2, cy - h / 2, w, h];
}

export function flatbedMachine(presetKey) {
  const p = FLATBED_PRESETS[presetKey];
  const bedY = 190;
  const bedH = 46;
  const baseY = GROUND_Y - 14;
  const cx = p.bedX + p.bedW / 2;
  const postX1 = p.bedX + p.bedW * 0.1;
  const postX2 = p.bedX + p.bedW * 0.9;
  const head = cuttingHead(cx, p.postTopY, bedY + 12);
  const legXs = Array.from({ length: p.legN }, (_, i) => p.bedX + 20 + (p.bedW - 40) * (i / (p.legN - 1)));
  const cabW = p.cabW;
  const cabX = p.bedX + p.bedW + 20;
  const cylX = cabX + cabW + 14;

  let extras = "";
  if (p.exchangeTable) extras += exchangeTable(p.bedX - 58, bedY + 6, 52, bedH - 6);
  if (p.enclosure === "partial") {
    extras += enclosure(p.bedX - 14, p.postTopY - p.beamThickness - 6, p.bedW + 28, baseY - p.postTopY + p.beamThickness + 6, p.bedX + p.bedW * 0.62);
  } else if (p.enclosure === "full") {
    extras += enclosure(p.bedX - 20, p.postTopY - p.beamThickness - 22, p.bedW + 40, baseY - p.postTopY + p.beamThickness + 22, p.bedX + p.bedW * 0.66);
    extras += `<path d="M${p.bedX - 20} ${p.postTopY - p.beamThickness - 22} L${cx} ${p.postTopY - p.beamThickness - 42} L${p.bedX + p.bedW + 20} ${p.postTopY - p.beamThickness - 22} Z" fill="${STEEL}" opacity="0.5"/>`;
  }

  const svg = `<g>
    ${groundShadow(cx, GROUND_Y + 6, p.bedW * 0.62 + 40, 11)}
    ${extras}
    ${baseRail(p.bedX - 10, baseY, p.bedW + 20)}
    ${legs(legXs, baseY + 14, GROUND_Y - baseY - 14)}
    ${railTrack(postX1, postX2, baseY - 2)}
    ${bedWithSheet(p.bedX, bedY, p.bedW, bedH)}
    ${gantry(postX1, postX2, p.postTopY, baseY, p.beamThickness)}
    ${head.svg}
    ${cabinet(cabX, bedY - 34, cabW, 96, p.label)}
    ${gasCylinder(cylX, baseY + 14, 78)}
    ${gasCylinder(cylX + 18, baseY + 14, 66, STEEL)}
  </g>`;

  return {
    svg,
    sparkPoint: head.tip,
    detailCrop: cropAround(cx, (p.postTopY - p.beamThickness - 6 + bedY + 30) / 2, 230, bedY + 30 - (p.postTopY - p.beamThickness - 6)),
    label: p.label,
  };
}

// ---- tube laser (RA-T6000) -------------------------------------------------

export function tubeLaserMachine() {
  const baseY = GROUND_Y - 14;
  const chuckCx = 175;
  const chuckCy = 172;
  const chuckR = 40;
  const tubeY = 172;
  const tailX = 415;
  const headCx = 300;
  const railY = 95;

  const rackTubes = [0, 1, 2].map((i) => {
    const y = 228 + i * 12;
    return `<rect x="15" y="${y}" width="112" height="8" rx="4" fill="${i === 0 ? STEEL_LIGHT : GREY}" stroke="${INK}" stroke-width="1.2"/>`;
  }).join("");

  const cutTube = `<g><rect x="430" y="160" width="58" height="24" rx="12" fill="${WHITE}" stroke="${INK}" stroke-width="2"/><line x1="452" y1="160" x2="452" y2="184" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 3"/><line x1="470" y1="160" x2="470" y2="184" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 3"/></g>`;

  const head = cuttingHead(headCx, railY, tubeY - 8);

  const restSupport = (x) => `<path d="M${x - 10} ${baseY} L${x} ${tubeY + 8} L${x + 10} ${baseY} Z" fill="${INK}" opacity="0.75"/>`;

  const svg = `<g>
    ${groundShadow(270, GROUND_Y + 6, 270, 12)}
    <rect x="10" y="224" width="122" height="46" rx="6" fill="${STEEL_LIGHT}" opacity="0.16"/>
    ${rackTubes}
    ${baseRail(40, baseY, 480)}
    ${legs([90, 200, 320, 430, 495], baseY + 14, GROUND_Y - baseY - 14)}
    <rect x="140" y="136" width="58" height="76" rx="6" fill="${STEEL_LIGHT}"/>
    <circle cx="${chuckCx}" cy="${chuckCy}" r="${chuckR}" fill="${STEEL}"/>
    <circle cx="${chuckCx}" cy="${chuckCy}" r="${chuckR}" fill="none" stroke="${INK}" stroke-width="3"/>
    <circle cx="${chuckCx}" cy="${chuckCy}" r="${chuckR * 0.4}" fill="${STEEL_LIGHT}"/>
    <g stroke="${INK}" stroke-width="4" stroke-linecap="round">
      <line x1="${chuckCx}" y1="${chuckCy - chuckR * 0.66}" x2="${chuckCx}" y2="${chuckCy - chuckR * 0.38}"/>
      <line x1="${chuckCx + chuckR * 0.58}" y1="${chuckCy + chuckR * 0.32}" x2="${chuckCx + chuckR * 0.34}" y2="${chuckCy + chuckR * 0.18}"/>
      <line x1="${chuckCx - chuckR * 0.58}" y1="${chuckCy + chuckR * 0.32}" x2="${chuckCx - chuckR * 0.34}" y2="${chuckCy + chuckR * 0.18}"/>
    </g>
    ${restSupport(260)}${restSupport(345)}
    <rect x="${chuckCx + chuckR - 4}" y="${tubeY - 8}" width="${tailX - (chuckCx + chuckR - 4)}" height="16" rx="8" fill="${WHITE}" stroke="${INK}" stroke-width="2"/>
    <line x1="220" y1="${tubeY}" x2="380" y2="${tubeY}" stroke="${INK}" stroke-width="1.5" opacity="0.3" stroke-dasharray="5 5"/>
    <circle cx="${tailX}" cy="${tubeY}" r="15" fill="${STEEL}" stroke="${INK}" stroke-width="2"/>
    <rect x="${headCx - 34}" y="${railY - 9}" width="68" height="9" rx="4" fill="${STEEL}"/>
    ${head.svg}
    ${cutTube}
    ${cabinet(498, 78, 60, 100, "RA-T6000")}
    ${gasCylinder(465, baseY + 14, 58)}
  </g>`;

  return {
    svg,
    sparkPoint: [headCx, tubeY - 4],
    detailCrop: cropAround((chuckCx + headCx) / 2, 140, 260, 200),
    label: "RA-T6000",
  };
}

// ---- CO2 laser engraver (RA-C1390) -----------------------------------------

export function co2EngraverMachine() {
  const x = 80, y = 70, w = 330, h = 160;
  const baseY = GROUND_Y - 14;
  const winX = 110, winY = 96, winW = 270, winH = 108;
  const headCx = 330, headTopY = 84, headTipY = 150;
  const honeycomb = (() => {
    let hex = "";
    const size = 6.4;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 20; col++) {
        const cx = winX + 14 + col * size * 1.72 + (row % 2 ? size * 0.86 : 0);
        const cy = winY + 14 + row * size * 1.4;
        if (cx > winX + winW - 10 || cy > winY + winH - 8) continue;
        hex += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(size * 0.4).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="1" opacity="0.22"/>`;
      }
    }
    return hex;
  })();
  const engravedPanel = `<g transform="translate(${winX + 58} ${winY + winH * 0.6})"><rect x="-34" y="-18" width="68" height="38" rx="3" fill="${WHITE}" stroke="${INK}" stroke-width="1.5"/><text x="0" y="7" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="${SPARK}">RA</text></g>`;
  const head = cuttingHead(headCx, headTopY, headTipY);

  const svg = `<g>
    ${groundShadow(x + w / 2 - 10, GROUND_Y + 6, w * 0.5, 11)}
    ${baseRail(x - 20, baseY, w + 40)}
    ${legs([x + 20, x + w - 20], baseY + 14, GROUND_Y - baseY - 14)}
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${STEEL}"/>
    <rect x="${x}" y="${y}" width="${w}" height="10" rx="5" fill="${STEEL_LIGHT}"/>
    <rect x="${x + w * 0.42}" y="${y}" width="${w * 0.16}" height="6" rx="3" fill="${INK}" opacity="0.4"/>
    <rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" rx="6" fill="${WHITE}" stroke="${INK}" stroke-width="2"/>
    ${honeycomb}
    ${engravedPanel}
    ${head.svg}
    <rect x="${x + 8}" y="${y + 14}" width="8" height="${h * 0.5}" rx="3" fill="${INK}" opacity="0.5"/>
    ${cabinet(x + w + 14, y + 16, 62, 92, "RA-C1390")}
  </g>`;

  return {
    svg,
    sparkPoint: [headCx, headTipY - 6],
    detailCrop: cropAround(headCx - 30, (headTopY + headTipY) / 2, 220, 150),
    label: "RA-C1390",
  };
}

// ---- 6-axis robotic welding (RA-RW6 single-station, RA-RW10 dual-station) --

/** Coordinate-defined arm segments (no trig): shoulder→elbow→wrist→torch tip. */
function robotArm(points, pedestalCx, baseY) {
  const { shoulder, elbow, wrist, tip } = points;
  const seg = (a, b, w, color) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const joint = (p, r, color = INK) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${color}"/>`;
  const svg = `<g>
    <rect x="${pedestalCx - 26}" y="${shoulder[1]}" width="52" height="${baseY - shoulder[1] + 14}" rx="8" fill="${STEEL}"/>
    <rect x="${pedestalCx - 34}" y="${baseY + 6}" width="68" height="10" rx="4" fill="${INK}"/>
    ${seg(shoulder, elbow, 17, STEEL_LIGHT)}
    ${joint(shoulder, 15)}
    ${seg(elbow, wrist, 13, STEEL)}
    ${joint(elbow, 11)}
    ${seg(wrist, tip, 8, INK)}
    ${joint(wrist, 9)}
    ${joint(tip, 5, SPARK)}
  </g>`;
  return { svg, tip };
}

/** A mounting plate with a welded rectangular frame (outline + cross brace). */
function weldFixture(x, y, w, h) {
  return `<g>
    <rect x="${x}" y="${y + h * 0.7}" width="${w}" height="${h * 0.3}" rx="4" fill="${GREY}" stroke="${INK}" stroke-width="1.5"/>
    <rect x="${x + w * 0.12}" y="${y}" width="${w * 0.76}" height="${h * 0.7}" fill="none" stroke="${STEEL}" stroke-width="4"/>
    <line x1="${x + w * 0.12}" y1="${y}" x2="${x + w * 0.88}" y2="${y + h * 0.7}" stroke="${STEEL_LIGHT}" stroke-width="3"/>
  </g>`;
}

export function robotCellMachine(stations = 1) {
  const baseY = GROUND_Y - 14;
  const shoulderY = 150;

  if (stations === 1) {
    const pedestalCx = 195;
    const points = { shoulder: [195, shoulderY], elbow: [258, 92], wrist: [322, 128], tip: [356, 170] };
    const arm = robotArm(points, pedestalCx, baseY);
    const fixture = weldFixture(300, 150, 140, 88);
    const guard = `<g opacity="0.85"><rect x="30" y="118" width="8" height="${baseY - 118}" fill="${STEEL}"/><rect x="480" y="118" width="8" height="${baseY - 118}" fill="${STEEL}"/></g>`;
    const svg = `<g>
      ${groundShadow(260, GROUND_Y + 6, 235, 12)}
      ${guard}
      ${fixture}
      ${arm.svg}
      ${namePlate(pedestalCx - 34, shoulderY - 18, 68, 16, "RA-RW6", { size: 9 })}
    </g>`;
    return { svg, sparkPoint: arm.tip, detailCrop: cropAround(350, 158, 180, 150), label: "RA-RW6" };
  }

  const pedestalCx = 270;
  const points = { shoulder: [270, shoulderY], elbow: [205, 95], wrist: [142, 130], tip: [108, 172] };
  const arm = robotArm(points, pedestalCx, baseY);
  const fixtureA = weldFixture(40, 150, 130, 84);
  const fixtureB = weldFixture(380, 150, 120, 78);
  const turntable = `<ellipse cx="440" cy="${baseY + 14}" rx="76" ry="14" fill="${STEEL_LIGHT}" opacity="0.35"/><ellipse cx="440" cy="${baseY + 10}" rx="76" ry="13" fill="none" stroke="${INK}" stroke-width="1.5" opacity="0.4"/>`;
  const fence = `<g opacity="0.9"><path d="M20 ${baseY} L20 122 L530 122 L530 ${baseY}" fill="none" stroke="${STEEL}" stroke-width="3"/>${[70, 150, 230, 310, 390, 470]
    .map((fx) => `<line x1="${fx}" y1="122" x2="${fx}" y2="${baseY}" stroke="${STEEL}" stroke-width="1.5" opacity="0.5"/>`)
    .join("")}<rect x="20" y="118" width="510" height="8" fill="${SPARK}" opacity="0.55"/></g>`;

  const svg = `<g>
    ${groundShadow(275, GROUND_Y + 6, 270, 12)}
    ${fence}
    ${turntable}
    ${fixtureA}
    ${fixtureB}
    ${arm.svg}
    ${namePlate(pedestalCx - 34, shoulderY - 18, 68, 16, "RA-RW10", { size: 9 })}
  </g>`;

  return { svg, sparkPoint: arm.tip, detailCrop: cropAround(120, 155, 180, 150), label: "RA-RW10" };
}

// ---- lookups used by callers -----------------------------------------------

export function machineForCategory(category) {
  if (category === "fiber") return flatbedMachine("ra-f3015-pro");
  if (category === "tube") return tubeLaserMachine();
  if (category === "co2") return co2EngraverMachine();
  if (category === "robot") return robotCellMachine(1);
  return flatbedMachine("ra-f1530");
}

export function machineForProduct(slug) {
  if (FLATBED_PRESETS[slug]) return flatbedMachine(slug);
  if (slug === "ra-t6000") return tubeLaserMachine();
  if (slug === "ra-c1390") return co2EngraverMachine();
  if (slug === "ra-rw6") return robotCellMachine(1);
  if (slug === "ra-rw10") return robotCellMachine(2);
  return flatbedMachine("ra-f1530");
}

/** A few small foreground props (cut parts / tube offcuts / engraved signs /
 * welded frames) scattered along the ground line, used on category art. */
export function categoryForeground(category) {
  const y = GROUND_Y - 4;
  if (category === "tube") {
    const seg = (x, rot) => `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - 32}" y="${y - 9}" width="64" height="18" rx="9" fill="${WHITE}" stroke="${INK}" stroke-width="2"/><line x1="${x - 8}" y1="${y - 9}" x2="${x - 8}" y2="${y + 9}" stroke="${INK}" stroke-width="1.3" stroke-dasharray="3 3"/></g>`;
    return `<g opacity="0.95">${seg(66, -5)}${seg(490, 4)}</g>`;
  }
  if (category === "co2") {
    const sign = (x) => `<g><rect x="${x - 32}" y="${y - 28}" width="64" height="28" rx="3" fill="${WHITE}" stroke="${INK}" stroke-width="1.5"/><line x1="${x - 22}" y1="${y - 20}" x2="${x + 22}" y2="${y - 20}" stroke="${SPARK}" stroke-width="2" opacity="0.8"/><line x1="${x - 22}" y1="${y - 13}" x2="${x + 10}" y2="${y - 13}" stroke="${INK}" stroke-width="2" opacity="0.5"/><line x1="${x - 22}" y1="${y - 6}" x2="${x + 16}" y2="${y - 6}" stroke="${INK}" stroke-width="2" opacity="0.5"/></g>`;
    return `<g opacity="0.95">${sign(70)}${sign(494)}</g>`;
  }
  if (category === "robot") {
    const frame = (x) => `<g opacity="0.92"><rect x="${x - 24}" y="${y - 38}" width="48" height="38" fill="none" stroke="${STEEL}" stroke-width="4"/><line x1="${x - 24}" y1="${y - 38}" x2="${x + 24}" y2="${y}" stroke="${STEEL_LIGHT}" stroke-width="3"/></g>`;
    return `<g>${frame(66)}${frame(494)}</g>`;
  }
  return `<g opacity="0.95">${gearShape(66, y - 15, 17, 9, GREY, INK)}${bracketShape(460, y - 26, 56, 30, GREY, INK)}${plateShape(430, y - 14, 34, 22, GREY, INK)}</g>`;
}

export function withOverlay(machine, { withSpark = false, withOperator = false, withChips = false } = {}) {
  const [sx, sy] = machine.sparkPoint;
  const overlay = [
    withSpark ? sparkBurst(sx, sy, 30) : "",
    withChips ? sparkChips(sx, sy, 7, 60, Math.round(sx + sy)) : "",
    withOperator ? operator(20, GROUND_Y - 92, 1.05) : "",
  ].join("");
  return `<g>${machine.svg}${overlay}</g>`;
}
