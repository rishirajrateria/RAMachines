/**
 * scripts/illustrations/machines.mjs — ADR-0008 §1 solid-shaded 3/4-perspective
 * machine renders: eight visibly distinct SKUs built from FILLED gradient shapes
 * (box3d panels, cylindrical limbs, glass/metal/rubber materials), a single
 * shared vanishing point so every machine converges consistently, a key light
 * upper-left (top faces lightest, front mid, side/back darkest + rim light +
 * ambient occlusion), a soft contact shadow + floor reflection, and — on the
 * "in-use" angle — the one warm accent: a spark burst at the cutting/weld point.
 * All eight share a 480×300 local box (ground line at y=250) so callers can
 * position/scale/crop them uniformly, same contract as before this rewrite.
 */
import {
  box3d,
  limb,
  contactShadow,
  floorReflection,
  sparkBurst,
  nameplate,
  screenUi,
  makeProjector,
  linGrad,
  radGrad,
  GRAPHITE,
  GRAPHITE_DARK,
  BODY_TEAL,
  BODY_TEAL_LIGHT,
  EDGE_TEAL,
  METAL_LIGHT,
  METAL_MID,
  METAL_DARK,
  RUBBER,
  GLASS,
  SPARK_AMBER,
} from "./common.mjs";

export const BOX_W = 480;
export const BOX_H = 300;
export const GROUND_Y = 250;

// Shared vanishing point / horizon — every machine converges toward the same
// point so the eight renders read as one consistent system (ADR-0008 §1).
const VP_X = 560;
const VP_Y = 26;
const DEPTH_K = 0.0022;

// `stage()` returns a `project` function that also records every screen point
// it produces, so each machine builder can compute a tight bounding box of
// its own render (across box3d/limb/etc, which all funnel through it) and
// callers can fit that box to ~80% of a tile instead of guessing a fixed
// scale against the nominal 480×300 local box (ADR-0008 §3).
function stage() {
  const raw = makeProjector({ vpX: VP_X, vpY: VP_Y, depthK: DEPTH_K });
  const pts = [];
  const project = (x, y, z = 0) => {
    const p = raw(x, y, z);
    pts.push(p);
    return p;
  };
  project.points = pts;
  return project;
}

function bboxOfPoints(points, pad = 0) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return [minX - pad, minY - pad, maxX + pad, maxY + pad];
}

/** Fits `bbox` (as returned by a machine builder) into `targetW`×`targetH` at
 * `fillRatio` of the smaller dimension's headroom, bottom-anchored so every
 * machine sits on a consistent ground line within its tile. */
export function placeToFit(contentSvg, bbox, targetW, targetH, { fillRatio = 0.82, bottomMargin = 0.08 } = {}) {
  const [minX, minY, maxX, maxY] = bbox;
  const w = Math.max(1, maxX - minX);
  const h = Math.max(1, maxY - minY);
  const scale = Math.min((targetW * fillRatio) / w, (targetH * fillRatio) / h);
  const tx = (targetW - w * scale) / 2 - minX * scale;
  const ty = targetH * (1 - bottomMargin) - maxY * scale;
  return `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale.toFixed(4)})">${contentSvg}</g>`;
}

let seq = 0;
const uid = (p) => `${p}${seq++}`;
const fmt = (n) => Math.round(n * 10) / 10;

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

// ---------------------------------------------------------------------------
// Shared material / component builders
// ---------------------------------------------------------------------------

/** Dark rubber feet with a tight contact-shadow pool under each — the ground
 * connection every machine needs (ADR-0008 §1 "ground the object"). */
function feet(xs, yGround, r = 7) {
  return xs
    .map((x) => {
      const g = radGrad(x, yGround - r * 0.3, r * 1.1, [
        [0, "#3A4444", 1],
        [70, RUBBER, 1],
        [100, "#000000", 1],
      ]);
      return `<defs>${g.tag}</defs>
      <ellipse cx="${fmt(x)}" cy="${fmt(yGround + r * 0.35)}" rx="${fmt(r * 1.5)}" ry="${fmt(r * 0.55)}" fill="#000" opacity="0.22"/>
      <ellipse cx="${fmt(x)}" cy="${fmt(yGround)}" rx="${fmt(r)}" ry="${fmt(r * 0.8)}" fill="url(#${g.id})"/>`;
    })
    .join("");
}

/** A flat sheet-metal plate with laser-cut part outlines (gear, bracket,
 * flange) resting on a bed's top face parallelogram — the "detail that sells
 * it" per ADR-0008 §1. `quad` is [FTL,FTR,BTR,BTL] screen points of the bed top. */
function sheetWithCutouts(quad, opacity = 1) {
  const [a, b, c, d] = quad;
  const cx = (a[0] + b[0] + c[0] + d[0]) / 4;
  const cy = (a[1] + b[1] + c[1] + d[1]) / 4;
  const plate = linGrad(a[0], a[1], c[0], c[1], [
    [0, "#D7DBDE"],
    [55, METAL_LIGHT],
    [100, METAL_MID],
  ]);
  // interpolate a point within the quad for placing cutout shapes, biased front-left
  const lerp = (t, u) => {
    const top = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const bot = [d[0] + (c[0] - d[0]) * t, d[1] + (c[1] - d[1]) * t];
    return [top[0] + (bot[0] - top[0]) * u, top[1] + (bot[1] - top[1]) * u];
  };
  const gearC = lerp(0.28, 0.4);
  const bracketC = lerp(0.55, 0.62);
  const flangeC = lerp(0.78, 0.32);
  const gearR = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.07;
  const teeth = Array.from({ length: 10 }, (_, i) => {
    const ang = (Math.PI * 2 * i) / 10;
    const x1 = gearC[0] + Math.cos(ang) * gearR * 0.85;
    const y1 = gearC[1] + Math.sin(ang) * gearR * 0.85 * 0.55;
    const x2 = gearC[0] + Math.cos(ang) * gearR * 1.15;
    const y2 = gearC[1] + Math.sin(ang) * gearR * 1.15 * 0.55;
    return `<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="#3A4444" stroke-width="1.4" opacity="0.5"/>`;
  }).join("");
  return `<defs>${plate.tag}</defs>
    <polygon points="${[a, b, c, d].map((p) => `${fmt(p[0])},${fmt(p[1])}`).join(" ")}" fill="url(#${plate.id})" opacity="${opacity}"/>
    <ellipse cx="${fmt(gearC[0])}" cy="${fmt(gearC[1])}" rx="${fmt(gearR)}" ry="${fmt(gearR * 0.55)}" fill="#141C1C" opacity="0.85"/>
    <ellipse cx="${fmt(gearC[0])}" cy="${fmt(gearC[1])}" rx="${fmt(gearR * 0.35)}" ry="${fmt(gearR * 0.2)}" fill="none" stroke="#3A4444" stroke-width="1" opacity="0.6"/>
    ${teeth}
    <rect x="${fmt(bracketC[0] - gearR * 0.9)}" y="${fmt(bracketC[1] - gearR * 0.35)}" width="${fmt(gearR * 1.8)}" height="${fmt(gearR * 0.7)}" rx="2" fill="#141C1C" opacity="0.85"/>
    <ellipse cx="${fmt(flangeC[0])}" cy="${fmt(flangeC[1])}" rx="${fmt(gearR * 0.7)}" ry="${fmt(gearR * 0.38)}" fill="#141C1C" opacity="0.85"/>
    <ellipse cx="${fmt(flangeC[0])}" cy="${fmt(flangeC[1])}" rx="${fmt(gearR * 0.28)}" ry="${fmt(gearR * 0.15)}" fill="none" stroke="#3A4444" stroke-width="0.8" opacity="0.5"/>`;
}

/** A control cabinet: box3d enclosure + faint UI screen + status LED + nameplate. */
function controlCabinet(project, { x, yGround, z, w = 46, h = 94, d = 26 }, sku) {
  const box = box3d(project, { x, yGround, z, w, h, d });
  const topFrontL = project(x, yGround - h, z);
  const topFrontR = project(x + w, yGround - h, z);
  const scrW = w * 0.62;
  const scrH = h * 0.24;
  const scrX = x + w * 0.19;
  const scrY = yGround - h * 0.62;
  return `${box}
    ${screenUi(topFrontL[0] + (topFrontR[0] - topFrontL[0]) * 0.19, scrY, scrW, scrH)}
    ${nameplate(x + w * 0.24, yGround - h * 0.22, w * 0.52, h * 0.09, sku)}`;
}

/** Two glowing points marking a laser diode head — nozzle cone + sensor ring. */
function cuttingHead(cx, cy, s = 1) {
  const g = linGrad(cx - 8 * s, cy, cx + 8 * s, cy, [
    [0, METAL_DARK],
    [50, METAL_LIGHT],
    [100, METAL_MID],
  ]);
  return `<defs>${g.tag}</defs>
    <rect x="${fmt(cx - 9 * s)}" y="${fmt(cy - 14 * s)}" width="${fmt(18 * s)}" height="${fmt(18 * s)}" rx="${fmt(3 * s)}" fill="url(#${g.id})"/>
    <circle cx="${fmt(cx)}" cy="${fmt(cy - 2 * s)}" r="${fmt(6.5 * s)}" fill="none" stroke="${EDGE_TEAL}" stroke-width="${fmt(1.4 * s)}" opacity="0.8"/>
    <path d="M${fmt(cx - 5 * s)} ${fmt(cy + 3 * s)} L${fmt(cx)} ${fmt(cy + 13 * s)} L${fmt(cx + 5 * s)} ${fmt(cy + 3 * s)} Z" fill="${GRAPHITE_DARK}"/>`;
}

// ---------------------------------------------------------------------------
// 1. Flatbed fiber laser — RA-F1530 / F3015 Pro / F6020 HD / F12K
// ---------------------------------------------------------------------------

const FLATBED_PRESETS = {
  "ra-f1530": { bedW: 190, bedD: 76, postH: 108, enclosure: "open", label: "RA-F1530" },
  "ra-f3015-pro": { bedW: 218, bedD: 88, postH: 118, enclosure: "exchange", label: "F3015 PRO" },
  "ra-f6020-hd": { bedW: 250, bedD: 96, postH: 128, enclosure: "full", label: "F6020 HD" },
  "ra-f12k": { bedW: 268, bedD: 104, postH: 140, enclosure: "cabin", label: "RA-F12K" },
};

export function flatbedMachine(presetKey, { inUse = false } = {}) {
  const p = FLATBED_PRESETS[presetKey] ?? FLATBED_PRESETS["ra-f1530"];
  const project = stage();
  const baseX = 96;
  const baseY = GROUND_Y - 4;
  const baseH = 30;
  const bedH = 40;
  const bedZ = 10;

  const base = box3d(project, { x: baseX, yGround: baseY, z: 0, w: p.bedW, h: baseH, d: p.bedD }, {});
  const bed = box3d(
    project,
    { x: baseX + 6, yGround: baseY - baseH, z: bedZ, w: p.bedW - 12, h: bedH, d: p.bedD - 20 },
    { topFrom: METAL_LIGHT, topTo: METAL_MID, frontFrom: "#2E3A3A", frontTo: GRAPHITE_DARK },
  );
  const bedTopQuad = [
    project(baseX + 6, baseY - baseH - bedH, bedZ),
    project(baseX + 6 + (p.bedW - 12), baseY - baseH - bedH, bedZ),
    project(baseX + 6 + (p.bedW - 12), baseY - baseH - bedH, bedZ + (p.bedD - 20)),
    project(baseX + 6, baseY - baseH - bedH, bedZ + (p.bedD - 20)),
  ];
  const sheet = sheetWithCutouts(bedTopQuad);

  const postY = baseY - baseH - bedH;
  const postXL = baseX + p.bedW * 0.06;
  const postXR = baseX + p.bedW * 0.94;
  const postZ = bedZ + (p.bedD - 20) * 0.5;
  const gantryTopY = postY - p.postH;

  const postL = box3d(project, { x: postXL - 6, yGround: postY + 8, z: postZ - 5, w: 12, h: p.postH, d: 10 }, { frontFrom: BODY_TEAL_LIGHT, frontTo: GRAPHITE });
  const postR = box3d(project, { x: postXR - 6, yGround: postY + 8, z: postZ - 5, w: 12, h: p.postH, d: 10 }, { frontFrom: BODY_TEAL_LIGHT, frontTo: GRAPHITE });
  const beam = box3d(project, { x: postXL - 6, yGround: gantryTopY + 14, z: postZ - 5, w: postXR - postXL + 12, h: 14, d: 10 }, { topFrom: EDGE_TEAL, topTo: BODY_TEAL_LIGHT });

  const headProgress = inUse ? 0.62 : 0.4;
  const headX = postXL + (postXR - postXL) * headProgress;
  const beamFrontZ = postZ - 5;
  const beamBottomY = gantryTopY + 14;
  const headTip = project(headX, postY + 6, beamFrontZ);
  const carriage = box3d(project, { x: headX - 8, yGround: beamBottomY + 6, z: beamFrontZ - 3, w: 16, h: 10, d: 8 }, { topFrom: METAL_LIGHT, topTo: METAL_MID, frontFrom: METAL_MID, frontTo: GRAPHITE });
  const carriageTop = project(headX, beamBottomY + 6, beamFrontZ);
  const cableChain = Array.from({ length: 5 }, (_, i) => {
    const t = i / 4;
    const cx = postXL + (headX - 18 - postXL) * t;
    const p1 = project(cx, beamBottomY + 2, beamFrontZ);
    return `<rect x="${fmt(p1[0] - 4)}" y="${fmt(p1[1] - 3)}" width="7" height="6" rx="1.5" fill="${GRAPHITE}" opacity="0.85"/>`;
  }).join("");
  const headCol = limb(carriageTop, headTip, 3.2, 3.2, { light: METAL_LIGHT, mid: METAL_MID, dark: METAL_DARK });
  const head = cuttingHead(headTip[0], headTip[1], 1.05);

  const cabX = baseX + p.bedW + 30;
  const cabinet = controlCabinet(project, { x: cabX, yGround: baseY, z: 6, w: 46, h: 96, d: 26 }, p.label);

  let enclosureExtra = "";
  if (p.enclosure === "exchange") {
    const exX = baseX - 66;
    enclosureExtra = box3d(project, { x: exX, yGround: baseY, z: 4, w: 60, h: baseH + 6, d: p.bedD - 30 }, { topFrom: METAL_LIGHT, topTo: METAL_MID, frontFrom: "#2E3A3A", frontTo: GRAPHITE_DARK });
  } else if (p.enclosure === "full") {
    const gTL = project(postXL - 10, gantryTopY, postZ - 14);
    const gTR = project(postXR + 10, gantryTopY, postZ - 14);
    const gBL = project(postXL - 10, postY + 10, postZ - 14);
    const gBR = project(postXR + 10, postY + 10, postZ - 14);
    const glassG = linGrad(gTL[0], gTL[1], gBR[0], gBR[1], [
      [0, GLASS, 0.32],
      [100, GLASS, 0.12],
    ]);
    enclosureExtra = `<defs>${glassG.tag}</defs>
      <polygon points="${[gTL, gTR, gBR, gBL].map((p) => `${fmt(p[0])},${fmt(p[1])}`).join(" ")}" fill="url(#${glassG.id})"/>
      <path d="M${fmt(gTL[0])} ${fmt(gTL[1])} L${fmt(gTR[0])} ${fmt(gTR[1])}" stroke="#fff" stroke-width="1" opacity="0.35"/>`;
  } else if (p.enclosure === "cabin") {
    const cabinX = cabX + 62;
    const cabinBase = box3d(project, { x: cabinX, yGround: baseY - 6, z: 6, w: 54, h: 20, d: 30 }, { topFrom: METAL_LIGHT, topTo: METAL_MID });
    const cabin = box3d(project, { x: cabinX + 6, yGround: baseY - 26, z: 10, w: 42, h: 46, d: 22 }, { frontFrom: BODY_TEAL_LIGHT, frontTo: GRAPHITE });
    const winP = project(cabinX + 12, baseY - 50, 8);
    const win = `<rect x="${fmt(winP[0])}" y="${fmt(winP[1])}" width="20" height="14" rx="2" fill="${GLASS}" opacity="0.4"/>`;
    const steps = Array.from({ length: 4 }, (_, i) => {
      const sy = baseY - i * 6;
      const sx = cabinX - 4 - i * 10;
      return box3d(project, { x: sx, yGround: sy, z: 6, w: 12, h: 6, d: 14 }, { topFrom: METAL_LIGHT, topTo: METAL_DARK });
    }).join("");
    enclosureExtra = `${cabinBase}${cabin}${win}${steps}`;
  }

  const shadowCx = (project(baseX, 0, 0)[0] + project(baseX + p.bedW, 0, p.bedD)[0]) / 2;
  const shadow = contactShadow(shadowCx, baseY + 10, p.bedW * 0.62, 16, 0.4);

  const reflectContent = `${base}${enclosureExtra}${bed}${sheet}${postL}${postR}${beam}${cableChain}${headCol}${carriage}${head}${cabinet}`;
  const reflection = floorReflection(reflectContent, baseY + 6, 120, 0.16);

  const spark = inUse ? sparkBurst(headTip[0], headTip[1] + 8, 0.9) : "";
  const beamLine = inUse
    ? `<line x1="${fmt(headTip[0])}" y1="${fmt(headTip[1] - 4)}" x2="${fmt(headTip[0])}" y2="${fmt(headTip[1] + 8)}" stroke="${SPARK_AMBER}" stroke-width="2" opacity="0.9"/>`
    : "";

  const svg = `<g>${shadow}${reflection}${reflectContent}${beamLine}${spark}</g>`;
  const detailCx = (postXL + postXR) / 2;
  const bbox = bboxOfPoints([...project.points, [shadowCx - p.bedW * 0.62, baseY + 10], [shadowCx + p.bedW * 0.62, baseY + 10]], 6);
  return {
    svg,
    bbox,
    tip: headTip,
    detailCrop: cropAround(detailCx, (gantryTopY + postY) / 2, 230, p.postH + 90),
    label: p.label,
  };
}

// ---------------------------------------------------------------------------
// 2. Tube laser — RA-T6000
// ---------------------------------------------------------------------------

export function tubeLaserMachine({ inUse = false } = {}) {
  const project = stage();
  const baseX = 56;
  const baseY = GROUND_Y - 4;
  const baseH = 26;
  const railZ = 20;
  const railY = baseY - baseH;

  const base = box3d(project, { x: baseX, yGround: baseY, z: 0, w: 330, h: baseH, d: 40 }, {});

  const chuckCx = baseX + 66;
  const chuckCy = railY - 34;
  const chuckFace = radGrad(chuckCx, chuckCy, 34, [
    [0, METAL_LIGHT],
    [55, METAL_MID],
    [100, GRAPHITE],
  ]);
  const chuck = `<defs>${chuckFace.tag}</defs>
    <circle cx="${fmt(chuckCx)}" cy="${fmt(chuckCy)}" r="34" fill="url(#${chuckFace.id})"/>
    <circle cx="${fmt(chuckCx)}" cy="${fmt(chuckCy)}" r="14" fill="${GRAPHITE_DARK}"/>
    ${[0, 120, 240].map((a) => {
      const rad = (a * Math.PI) / 180;
      const jx = chuckCx + Math.cos(rad) * 24;
      const jy = chuckCy + Math.sin(rad) * 24;
      return `<rect x="${fmt(jx - 4)}" y="${fmt(jy - 4)}" width="8" height="8" rx="1.5" fill="${METAL_DARK}"/>`;
    }).join("")}
    <circle cx="${fmt(chuckCx)}" cy="${fmt(chuckCy)}" r="34" fill="none" stroke="#BFEDE7" stroke-width="1.2" opacity="0.6"/>`;

  const tubeY = chuckCy;
  const cutGapX = baseX + 216;
  const tubeSeg1 = limb(project(chuckCx + 30, tubeY, railZ), project(cutGapX - 4, tubeY, railZ), 13, 13, { light: "#E6E9EA" });
  const tubeSeg2 = limb(project(cutGapX + 10, tubeY, railZ), project(baseX + 300, tubeY, railZ), 12, 9, { light: "#E6E9EA" });

  // Support rollers sit directly under the tube, at the same depth, so they
  // visibly cradle it instead of floating beside it.
  const rollerXs = [baseX + 96, baseX + 150, baseX + 270];
  const rollers = rollerXs
    .map((rx) => {
      const post = limb(project(rx, railY, railZ), project(rx, tubeY + 12, railZ), 4, 4, { light: METAL_MID, dark: GRAPHITE });
      const wheel = limb(project(rx - 8, tubeY + 12, railZ), project(rx + 8, tubeY + 12, railZ), 8, 8, { light: METAL_LIGHT, mid: METAL_MID, dark: METAL_DARK });
      return `${post}${wheel}`;
    })
    .join("");

  // Head rail runs directly above the tube at the same z-depth so the head
  // column reads as vertical, not diagonally floating off the assembly.
  const headRailZ = railZ;
  const headRailY = tubeY - 58;
  const headProgress = inUse ? 0.55 : 0.3;
  const headX = baseX + 96 + (baseX + 216 - (baseX + 96)) * headProgress;
  const railGantry = limb(project(baseX + 84, headRailY, headRailZ), project(baseX + 222, headRailY, headRailZ), 3.4, 3.4);
  const railPostL = limb(project(baseX + 84, tubeY + 4, headRailZ), project(baseX + 84, headRailY, headRailZ), 3, 3);
  const railPostR = limb(project(baseX + 222, tubeY + 4, headRailZ), project(baseX + 222, headRailY, headRailZ), 3, 3);
  const headTip = project(headX, tubeY - 12, headRailZ);
  const headCol = limb(project(headX, headRailY, headRailZ), headTip, 3, 3.4, { light: METAL_LIGHT });
  const head = cuttingHead(headTip[0], headTip[1], 0.95);

  const rackX = baseX + 254;
  const rack = box3d(project, { x: rackX, yGround: baseY - baseH, z: 6, w: 60, h: 70, d: 30 }, { topFrom: METAL_LIGHT, topTo: METAL_MID, frontFrom: "#2E3A3A", frontTo: GRAPHITE_DARK });
  const rackTubes = [0, 1, 2]
    .map((i) => {
      const p1 = project(rackX + 8, baseY - baseH - 14 - i * 15, 8);
      const p2 = project(rackX + 52, baseY - baseH - 14 - i * 15, 8);
      return limb(p1, p2, 5, 5, { light: "#E6E9EA" });
    })
    .join("");

  const cabinet = controlCabinet(project, { x: baseX + 330 + 2, yGround: baseY, z: 8, w: 40, h: 92, d: 24 }, "RA-T6000");

  const feetContent = feet([baseX + 40, baseX + 200, baseX + 330], baseY + 2, 7);
  const shadow = contactShadow(baseX + 200, baseY + 10, 200, 16, 0.4);

  const content = `${base}${chuck}${rollers}${tubeSeg1}${tubeSeg2}${railPostL}${railPostR}${railGantry}${headCol}${head}${rack}${rackTubes}${cabinet}${feetContent}`;
  const reflection = floorReflection(content, baseY + 6, 110, 0.16);

  const spark = inUse ? sparkBurst(headTip[0], headTip[1] + 2, 0.85) : "";

  const svg = `<g>${shadow}${reflection}${content}${spark}</g>`;
  const bbox = bboxOfPoints([...project.points, [baseX, baseY + 10], [baseX + 400, baseY + 10]], 6);
  return {
    svg,
    bbox,
    tip: headTip,
    detailCrop: cropAround((chuckCx + headX) / 2, tubeY - 20, 260, 190),
    label: "RA-T6000",
  };
}

// ---------------------------------------------------------------------------
// 3. CO2 laser engraver — RA-C1390
// ---------------------------------------------------------------------------

export function co2EngraverMachine({ inUse = false } = {}) {
  const project = stage();
  const baseX = 100;
  const baseY = GROUND_Y - 4;
  const baseH = 96;
  const totalH = baseH + 40;
  const w = 262;
  const d = 76;

  // The enclosure sits flush on the ground (no floating gap / hidden legs) —
  // rubber feet below supply the ground-contact detail instead.
  const legXs = [baseX + 24, baseX + w - 24];
  const cabinetBox = box3d(project, { x: baseX, yGround: baseY, z: 0, w, h: totalH, d }, { frontFrom: BODY_TEAL_LIGHT, frontTo: GRAPHITE });

  const winX = baseX + 20;
  const winY = baseY - totalH + 14;
  const winW = w - 40;
  const winH = baseH - 26;
  const winTL = project(winX, winY, -2);
  const winTR = project(winX + winW, winY, -2);
  const winBR = project(winX + winW, winY + winH, -2);
  const winBL = project(winX, winY + winH, -2);
  const glassG = linGrad(winTL[0], winTL[1], winBR[0], winBR[1], [
    [0, "#DDEDEA", 0.5],
    [100, GLASS, 0.28],
  ]);
  const lidP = winY - 6;
  const lid = box3d(project, { x: baseX + 4, yGround: lidP, z: -6, w: w - 8, h: 8, d: d + 10 }, { topFrom: EDGE_TEAL, topTo: BODY_TEAL_LIGHT });

  // honeycomb bed glimpsed through the window
  const hexes = [];
  const hexR = 6;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      const hx = winX + 14 + col * hexR * 1.7 + (row % 2 ? hexR * 0.85 : 0);
      const hy = winY + 20 + row * hexR * 1.5;
      if (hx > winX + winW - 10) continue;
      const p = project(hx, hy, -2);
      hexes.push(`<circle cx="${fmt(p[0])}" cy="${fmt(p[1])}" r="3.1" fill="none" stroke="#2E3A3A" stroke-width="0.6" opacity="0.5"/>`);
    }
  }

  const headCx = winX + winW * (inUse ? 0.62 : 0.42);
  const headCy = winY + winH * 0.4;
  const headP = project(headCx, headCy, -1);
  const headRail = limb(project(winX + 6, winY + 10, -1), project(winX + winW - 6, winY + 10, -1), 2.2, 2.2, { light: METAL_LIGHT });
  const head = cuttingHead(headP[0], headP[1], 0.7);

  const cabX = baseX + w + 20;
  const cabinet = controlCabinet(project, { x: cabX, yGround: baseY, z: 6, w: 42, h: 88, d: 24 }, "RA-C1390");
  const plate = nameplate(baseX + w * 0.36, baseY - 14, 60, 12, "CO2 · 1390");

  const feetContent = feet(legXs, baseY + 2, 6);
  const shadow = contactShadow(baseX + w / 2, baseY + 8, w * 0.6, 15, 0.38);

  const content = `${cabinetBox}<defs>${glassG.tag}</defs><polygon points="${[winTL, winTR, winBR, winBL].map((p) => `${fmt(p[0])},${fmt(p[1])}`).join(" ")}" fill="url(#${glassG.id})"/>${hexes.join("")}${headRail}${head}${lid}${cabinet}${plate}${feetContent}`;
  const reflection = floorReflection(content, baseY + 6, 100, 0.14);

  const spark = inUse ? sparkBurst(headP[0], headP[1], 0.7) : "";

  const svg = `<g>${shadow}${reflection}${content}${spark}</g>`;
  const bbox = bboxOfPoints([...project.points, [baseX - w * 0.6 + w / 2, baseY + 8], [baseX + w / 2 + w * 0.6, baseY + 8]], 6);
  return {
    svg,
    bbox,
    tip: headP,
    detailCrop: cropAround(baseX + w / 2 - 10, winY + winH / 2, 230, 160),
    label: "RA-C1390",
  };
}

// ---------------------------------------------------------------------------
// 4 & 5. Robot welding cell — single station (RA-RW6) & dual station (RA-RW10)
// ---------------------------------------------------------------------------

function robotArm(project, { baseX, baseY, z, reach = 1, inUse = false }) {
  const shoulder = project(baseX, baseY - 60, z);
  const elbow = project(baseX + 58 * reach, baseY - 128, z + 6);
  const wrist = project(baseX + 128 * reach, baseY - 96, z + 2);
  const tip = project(baseX + 168 * reach, baseY - 62, z);

  const base = limb(project(baseX - 20, baseY, z - 4), project(baseX + 20, baseY, z - 4), 22, 22, { light: METAL_LIGHT, mid: METAL_MID, dark: METAL_DARK });
  const upright = limb(project(baseX, baseY, z), shoulder, 15, 12);
  const upperArm = limb(shoulder, elbow, 12, 9, { light: BODY_TEAL_LIGHT, mid: BODY_TEAL, dark: GRAPHITE });
  const foreArm = limb(elbow, wrist, 9, 6.5, { light: METAL_LIGHT });
  const torchArm = limb(wrist, tip, 5.5, 3.4, { light: METAL_MID, mid: METAL_DARK, dark: GRAPHITE });
  const nozzle = `<circle cx="${fmt(tip[0])}" cy="${fmt(tip[1])}" r="3.6" fill="${GRAPHITE_DARK}"/>`;
  const torchGlow = inUse ? sparkBurst(tip[0], tip[1], 0.55) : "";

  return { svg: `${base}${upright}${upperArm}${foreArm}${torchArm}${nozzle}${torchGlow}`, tip };
}

function fence(project, x1, x2, yGround, z) {
  const posts = [x1, (x1 + x2) / 2, x2].map((x) => limb(project(x, yGround, z), project(x, yGround - 46, z), 2.4, 2.4, { light: METAL_LIGHT })).join("");
  const rail = limb(project(x1, yGround - 46, z), project(x2, yGround - 46, z), 1.6, 1.6, { light: METAL_LIGHT });
  const railLow = limb(project(x1, yGround - 20, z), project(x2, yGround - 20, z), 1.6, 1.6, { light: METAL_LIGHT });
  return `${posts}${rail}${railLow}`;
}

export function robotCellMachine(stations = 1, { inUse = false } = {}) {
  const project = stage();
  const baseY = GROUND_Y - 4;

  if (stations === 1) {
    const pedX = 168;
    const pedestal = box3d(project, { x: pedX - 26, yGround: baseY, z: 0, w: 52, h: 60, d: 40 }, {});
    const arm = robotArm(project, { baseX: pedX, baseY: baseY - 60, z: 20, reach: 1.05, inUse });

    const fixtureX = pedX + 150;
    const fixture = box3d(project, { x: fixtureX, yGround: baseY, z: 10, w: 92, h: 34, d: 56 }, { topFrom: METAL_LIGHT, topTo: METAL_MID, frontFrom: "#2E3A3A", frontTo: GRAPHITE_DARK });
    const partTop = [
      project(fixtureX + 14, baseY - 34, 16),
      project(fixtureX + 78, baseY - 34, 16),
      project(fixtureX + 78, baseY - 34, 46),
      project(fixtureX + 14, baseY - 34, 46),
    ];
    const part = sheetWithCutouts(partTop, 0.95);
    // Guard fence behind the fixture (ADR-0008 §1: "torch, fixture and fence").
    const fenceLine = fence(project, fixtureX - 6, fixtureX + 98, baseY, 66);

    const cabinet = controlCabinet(project, { x: pedX - 118, yGround: baseY, z: 6, w: 40, h: 84, d: 22 }, "RA-RW6");
    const feetContent = feet([pedX, fixtureX + 10, fixtureX + 82], baseY + 2, 6);
    const shadow = contactShadow(pedX + 70, baseY + 10, 190, 16, 0.38);

    const content = `${pedestal}${cabinet}${arm.svg}${fixture}${part}${fenceLine}${feetContent}`;
    const reflection = floorReflection(content, baseY + 6, 110, 0.15);
    const svg = `<g>${shadow}${reflection}${content}</g>`;
    const bbox = bboxOfPoints([...project.points, [pedX + 70 - 190, baseY + 10], [pedX + 70 + 190, baseY + 10]], 6);
    return { svg, bbox, tip: arm.tip, detailCrop: cropAround(pedX + 60, baseY - 100, 220, 190), label: "RA-RW6" };
  }

  const cellX = 60;
  const cellW = 380;
  const cell = box3d(project, { x: cellX, yGround: baseY, z: -6, w: cellW, h: 10, d: 66 }, { topFrom: METAL_LIGHT, topTo: METAL_MID });
  const pedX = cellX + cellW * 0.34;
  const pedestal = box3d(project, { x: pedX - 26, yGround: baseY, z: 10, w: 52, h: 64, d: 40 }, {});
  const arm = robotArm(project, { baseX: pedX, baseY: baseY - 64, z: 30, reach: 1.1, inUse });

  const turnCx = pedX + 128;
  const turnCz = 24;
  const turnP = project(turnCx, baseY, turnCz);
  const turnR = 70;
  const turnG = radGrad(turnP[0], turnP[1], turnR, [
    [0, METAL_LIGHT],
    [70, METAL_MID],
    [100, GRAPHITE],
  ]);
  const turntable = `<defs>${turnG.tag}</defs><ellipse cx="${fmt(turnP[0])}" cy="${fmt(turnP[1])}" rx="${fmt(turnR)}" ry="${fmt(turnR * 0.42)}" fill="url(#${turnG.id})"/>
    <ellipse cx="${fmt(turnP[0])}" cy="${fmt(turnP[1])}" rx="${fmt(turnR)}" ry="${fmt(turnR * 0.42)}" fill="none" stroke="#BFEDE7" stroke-width="1" opacity="0.5"/>`;

  const stationOffsets = [-0.55, 0.55];
  const fixtures = stationOffsets
    .map((off) => {
      const fx = turnCx + off * 56;
      const fz = turnCz + (off < 0 ? -20 : 12);
      return box3d(project, { x: fx - 24, yGround: baseY - 6, z: fz, w: 48, h: 24, d: 20 }, { topFrom: METAL_LIGHT, topTo: METAL_DARK, frontFrom: "#2E3A3A", frontTo: GRAPHITE_DARK });
    })
    .join("");

  // Amber safety curtain partitioning the far side of the cell — a header
  // rail plus overlapping translucent PVC strips.
  const curtainX = cellX + cellW - 92;
  const curtainW = 84;
  const curtainZ = 6;
  const curtainRail = limb(project(curtainX, baseY - 76, curtainZ), project(curtainX + curtainW, baseY - 76, curtainZ), 3, 3, { light: METAL_LIGHT });
  const curtainStrips = Array.from({ length: 8 }, (_, i) => {
    const cx = curtainX + (i * curtainW) / 8;
    const p1 = project(cx, baseY - 2, curtainZ);
    const p2 = project(cx + curtainW / 8 + 2, baseY - 2, curtainZ);
    const p3 = project(cx + curtainW / 8 + 2, baseY - 74, curtainZ);
    const p4 = project(cx, baseY - 74, curtainZ);
    return `<polygon points="${fmt(p1[0])},${fmt(p1[1])} ${fmt(p2[0])},${fmt(p2[1])} ${fmt(p3[0])},${fmt(p3[1])} ${fmt(p4[0])},${fmt(p4[1])}" fill="${SPARK_AMBER}" opacity="${0.22 + (i % 2) * 0.1}"/>`;
  }).join("");

  const cabinet = controlCabinet(project, { x: cellX - 44, yGround: baseY, z: 8, w: 40, h: 86, d: 22 }, "RA-RW10");
  const feetContent = feet([cellX + 10, cellX + cellW * 0.5, cellX + cellW - 10], baseY + 2, 6);
  const shadow = contactShadow(cellX + cellW / 2, baseY + 10, cellW * 0.56, 17, 0.4);

  const content = `${cell}${pedestal}${cabinet}${arm.svg}${turntable}${fixtures}${curtainStrips}${curtainRail}${feetContent}`;
  const reflection = floorReflection(content, baseY + 6, 120, 0.15);
  const svg = `<g>${shadow}${reflection}${content}</g>`;
  const bbox = bboxOfPoints(
    [...project.points, [turnP[0] - turnR, turnP[1]], [turnP[0] + turnR, turnP[1]], [cellX - 20, baseY + 10], [cellX + cellW + 10, baseY + 10]],
    6,
  );
  return { svg, bbox, tip: arm.tip, detailCrop: cropAround(turnCx, baseY - 90, 260, 200), label: "RA-RW10" };
}

// ---- lookups used by callers -----------------------------------------------

export function machineForCategory(category, opts = {}) {
  if (category === "fiber") return flatbedMachine("ra-f6020-hd", opts);
  if (category === "tube") return tubeLaserMachine(opts);
  if (category === "co2") return co2EngraverMachine(opts);
  if (category === "robot") return robotCellMachine(2, opts);
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
