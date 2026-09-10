/**
 * scripts/illustrations/machines.mjs — ADR-0005 §7 line-art machine glyphs: five
 * families (flatbed laser, tube laser, CO2 engraver, robot arm, dual-station cell)
 * drawn as a single 1.75px ink stroke with no fills, in a shared 480×300 local box
 * (ground line at y=250) so callers can position/scale/crop them uniformly. The
 * 8 catalogue products reuse these five families (the four flatbed presets differ
 * only in proportions) across 3 angles — front, a cropped detail, and an "in-use"
 * variant with a faint dashed motion trace, never a colour fill.
 */
import { lineArt } from "./common.mjs";

export const BOX_W = 480;
export const BOX_H = 300;
export const GROUND_Y = 250;

/** Wraps glyph content in a translate+scale so callers can drop any glyph into
 * any canvas size with the ground line landing at a consistent height. */
export function placeInScene(contentSvg, targetW, targetH, { scale, groundRatio = 0.86, offsetX = 0 } = {}) {
  const tx = (targetW - BOX_W * scale) / 2 + offsetX;
  const ty = targetH * groundRatio - GROUND_Y * scale;
  return `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale})">${contentSvg}</g>`;
}

function cropAround(cx, cy, w, h) {
  return [cx - w / 2, cy - h / 2, w, h];
}

/** A short dashed trace near a tool tip — the only "in-use" variation allowed;
 * still ink, still stroke-only, just fainter and dashed to read as motion. */
function motionTrace(x, y, len = 26) {
  return `<path d="M${x - len / 2} ${y} L${x + len / 2} ${y}" stroke-dasharray="3 5" opacity="0.55"/>
    <path d="M${x} ${y - len / 2} L${x} ${y + len / 2}" stroke-dasharray="3 5" opacity="0.4"/>`;
}

// ---- 1. flatbed laser (RA-F1530 / F3015 Pro / F6020 HD / F12K; category "fiber") --

const FLATBED_PRESETS = {
  "ra-f1530": { bedX: 130, bedW: 200, postTop: 108, label: "RA-F1530" },
  "ra-f3015-pro": { bedX: 108, bedW: 230, postTop: 92, label: "F3015 PRO" },
  "ra-f6020-hd": { bedX: 90, bedW: 250, postTop: 76, label: "F6020 HD" },
  "ra-f12k": { bedX: 70, bedW: 262, postTop: 60, label: "RA-F12K" },
};

export function flatbedMachine(presetKey, { inUse = false } = {}) {
  const p = FLATBED_PRESETS[presetKey] ?? FLATBED_PRESETS["ra-f1530"];
  const bedY = 172;
  const bedH = 52;
  const baseY = GROUND_Y - 16;
  const cx = p.bedX + p.bedW / 2;
  const postX1 = p.bedX + p.bedW * 0.08;
  const postX2 = p.bedX + p.bedW * 0.92;
  const cabX = p.bedX + p.bedW + 26;
  const headTipY = bedY + 6;

  const legs = [0.12, 0.5, 0.88].map((t) => p.bedX + p.bedW * t);

  const body = `
    <rect x="${p.bedX}" y="${bedY}" width="${p.bedW}" height="${bedH}" rx="3"/>
    <path d="M${p.bedX + 14} ${bedY + bedH * 0.55} L${p.bedX + p.bedW - 14} ${bedY + bedH * 0.55}" opacity="0.5"/>
    <rect x="${cx - p.bedW * 0.18}" y="${bedY - 16}" width="${p.bedW * 0.36}" height="14" rx="2" stroke-dasharray="4 4"/>
    <path d="M${p.bedX - 8} ${baseY} L${p.bedX + p.bedW + 8} ${baseY}"/>
    ${legs.map((x) => `<path d="M${x} ${baseY} L${x} ${GROUND_Y}"/>`).join("")}
    <path d="M${postX1} ${baseY} L${postX1} ${p.postTop}"/>
    <path d="M${postX2} ${baseY} L${postX2} ${p.postTop}"/>
    <path d="M${postX1 - 6} ${p.postTop} L${postX2 + 6} ${p.postTop}"/>
    <rect x="${cx - 12}" y="${p.postTop - 2}" width="24" height="16" rx="3"/>
    <path d="M${cx} ${p.postTop + 14} L${cx} ${headTipY}" ${inUse ? 'stroke-dasharray="2 4"' : ""}/>
    <rect x="${cabX}" y="${bedY - 30}" width="46" height="94" rx="4"/>
    <rect x="${cabX + 8}" y="${bedY - 18}" width="30" height="24" rx="2"/>
    <path d="M${cabX + 8} ${bedY + 26} L${cabX + 38} ${bedY + 26}"/>
    <path d="M${cabX + 8} ${bedY + 36} L${cabX + 30} ${bedY + 36}"/>
  `;

  return {
    svg: lineArt(body + (inUse ? motionTrace(cx, headTipY - 4) : "")),
    tip: [cx, headTipY],
    detailCrop: cropAround(cx, (p.postTop + bedY) / 2, 220, bedY - p.postTop + 60),
    label: p.label,
  };
}

// ---- 2. tube laser (RA-T6000; category "tube") ----------------------------

export function tubeLaserMachine({ inUse = false } = {}) {
  const baseY = GROUND_Y - 16;
  const railY = baseY;
  const chuckCx = 140;
  const chuckCy = 148;
  const chuckR = 30;
  const tubeY = 148;
  const tailX = 356;
  const headCx = 250;
  const headRailY = 92;

  const body = `
    <path d="M60 ${railY} L420 ${railY}"/>
    ${[90, 180, 300, 390].map((x) => `<path d="M${x} ${railY} L${x} ${GROUND_Y}"/>`).join("")}
    <circle cx="${chuckCx}" cy="${chuckCy}" r="${chuckR}"/>
    <circle cx="${chuckCx}" cy="${chuckCy}" r="${chuckR * 0.42}"/>
    <rect x="${chuckCx + chuckR - 4}" y="${tubeY - 8}" width="${tailX - (chuckCx + chuckR - 4)}" height="16" rx="8"/>
    <path d="M${chuckCx + chuckR + 30} ${tubeY} L${tailX - 30} ${tubeY}" stroke-dasharray="4 5" opacity="0.5"/>
    <circle cx="${tailX + 16}" cy="${tubeY}" r="14"/>
    <path d="M180 ${headRailY} L340 ${headRailY}"/>
    <rect x="${headCx - 12}" y="${headRailY - 2}" width="24" height="14" rx="3"/>
    <path d="M${headCx} ${headRailY + 12} L${headCx} ${tubeY - 8}" ${inUse ? 'stroke-dasharray="2 4"' : ""}/>
    <rect x="400" y="76" width="42" height="86" rx="4"/>
    <rect x="408" y="88" width="26" height="22" rx="2"/>
  `;

  return {
    svg: lineArt(body + (inUse ? motionTrace(headCx, tubeY - 12) : "")),
    tip: [headCx, tubeY - 8],
    detailCrop: cropAround((chuckCx + headCx) / 2, 130, 260, 190),
    label: "RA-T6000",
  };
}

// ---- 3. CO2 engraver (RA-C1390; category "co2") ----------------------------

export function co2EngraverMachine({ inUse = false } = {}) {
  const x = 100, y = 84, w = 280, h = 138;
  const baseY = GROUND_Y - 16;
  const winX = 128, winY = 108, winW = 224, winH = 92;
  const headCx = 290;

  const zigzag = (() => {
    const pts = [];
    const steps = 7;
    for (let i = 0; i <= steps; i++) {
      const px = winX + 16 + ((winW - 32) * i) / steps;
      const py = winY + winH / 2 + (i % 2 === 0 ? -10 : 10);
      pts.push(`${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    return `<path d="M${pts.join(" L")}" opacity="0.55"/>`;
  })();

  const body = `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>
    <rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" rx="4"/>
    ${zigzag}
    <rect x="${headCx - 10}" y="${y - 2}" width="20" height="14" rx="3"/>
    <path d="M${headCx} ${y + 12} L${headCx} ${winY + winH / 2}" ${inUse ? 'stroke-dasharray="2 4"' : ""}/>
    <path d="M${x + 40} ${y + h} L${x + 40} ${baseY}"/>
    <path d="M${x + w - 40} ${y + h} L${x + w - 40} ${baseY}"/>
    <path d="M${x + 20} ${baseY} L${x + w - 20} ${baseY}"/>
    <rect x="${x + w + 16}" y="${y + 8}" width="42" height="90" rx="4"/>
    <rect x="${x + w + 24}" y="${y + 18}" width="26" height="22" rx="2"/>
  `;

  return {
    svg: lineArt(body + (inUse ? motionTrace(headCx, winY + winH / 2 - 8) : "")),
    tip: [headCx, winY + winH / 2],
    detailCrop: cropAround(headCx - 20, (y + winY + winH) / 2, 220, 150),
    label: "RA-C1390",
  };
}

// ---- 4 & 5. robot arm — single station (RA-RW6) & dual station (RA-RW10) --

function armPath(shoulder, elbow, wrist, tip) {
  const seg = (a, b) => `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}"/>`;
  const joint = (p, r) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}"/>`;
  return `${seg(shoulder, elbow)}${joint(shoulder, 8)}${seg(elbow, wrist)}${joint(elbow, 7)}${seg(wrist, tip)}${joint(wrist, 6)}${joint(tip, 4)}`;
}

function fixtureTable(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/><path d="M${x} ${y} L${x + w} ${y + h}" opacity="0.5"/>`;
}

export function robotCellMachine(stations = 1, { inUse = false } = {}) {
  const baseY = GROUND_Y - 16;

  if (stations === 1) {
    const pedestalCx = 170;
    const shoulder = [170, 168];
    const elbow = [232, 96];
    const wrist = [300, 132];
    const tip = [338, 168];
    const body = `
      <rect x="${pedestalCx - 22}" y="${shoulder[1]}" width="44" height="${baseY - shoulder[1]}" rx="6"/>
      <path d="M${pedestalCx - 30} ${baseY} L${pedestalCx + 30} ${baseY}"/>
      ${armPath(shoulder, elbow, wrist, tip)}
      ${fixtureTable(300, 190, 120, 40)}
      <path d="M100 ${GROUND_Y} L440 ${GROUND_Y}"/>
    `;
    return {
      svg: lineArt(body + (inUse ? motionTrace(tip[0], tip[1]) : "")),
      tip,
      detailCrop: cropAround(320, 150, 200, 170),
      label: "RA-RW6",
    };
  }

  const shoulder = [250, 160];
  const elbow = [200, 96];
  const wrist = [152, 128];
  const tip = [118, 160];
  const body = `
    <rect x="30" y="86" width="420" height="150" rx="10"/>
    <ellipse cx="390" cy="${baseY + 6}" rx="52" ry="10"/>
    ${fixtureTable(56, 186, 100, 40)}
    ${fixtureTable(340, 186, 100, 40)}
    <rect x="${250 - 20}" y="${shoulder[1]}" width="40" height="${baseY - shoulder[1]}" rx="6"/>
    ${armPath(shoulder, elbow, wrist, tip)}
    <path d="M40 ${GROUND_Y} L460 ${GROUND_Y}"/>
  `;
  return {
    svg: lineArt(body + (inUse ? motionTrace(tip[0], tip[1]) : "")),
    tip,
    detailCrop: cropAround(110, 150, 200, 170),
    label: "RA-RW10",
  };
}

// ---- lookups used by callers -----------------------------------------------

export function machineForCategory(category, opts = {}) {
  if (category === "fiber") return flatbedMachine("ra-f3015-pro", opts);
  if (category === "tube") return tubeLaserMachine(opts);
  if (category === "co2") return co2EngraverMachine(opts);
  if (category === "robot") return robotCellMachine(1, opts);
  return flatbedMachine("ra-f1530", opts);
}

export function machineForProduct(slug, opts = {}) {
  if (FLATBED_PRESETS[slug]) return flatbedMachine(slug, opts);
  if (slug === "ra-t6000") return tubeLaserMachine(opts);
  if (slug === "ra-c1390") return co2EngraverMachine(opts);
  if (slug === "ra-rw6") return robotCellMachine(1, opts);
  if (slug === "ra-rw10") return robotCellMachine(2, opts);
  return flatbedMachine("ra-f1530", opts);
}
