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
  beamGlow,
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
  SPARK_HOT,
} from "./common.mjs";

// Material-balance palette (ADR-0008 §1 critique pass 2): every machine must
// read as ~50% grey/steel, ~25% black, ~25% teal — teal reserved for painted
// panels/cabinet/accent trim, not the whole machine. These box3d palettes are
// reused across every builder below so the ratio holds everywhere.
const STEEL_PALETTE = {
  topFrom: "#D7DBDE",
  topTo: METAL_LIGHT,
  frontFrom: METAL_MID,
  frontTo: METAL_DARK,
  sideFrom: METAL_DARK,
  sideTo: "#5B6266",
  seam: "#3A4144",
  rim: "#F2F4F5",
};
const BLACK_PALETTE = {
  topFrom: "#2E3838",
  topTo: "#161E1E",
  frontFrom: "#161E1E",
  frontTo: RUBBER,
  sideFrom: "#0C1212",
  sideTo: "#050808",
  seam: "#000000",
  rim: "#4A5858",
};
const TEAL_PALETTE = {
  topFrom: EDGE_TEAL,
  topTo: BODY_TEAL_LIGHT,
  frontFrom: BODY_TEAL,
  frontTo: GRAPHITE,
  sideFrom: "#0E3B37",
  sideTo: GRAPHITE_DARK,
  seam: "#06100F",
  rim: "#BFEDE7",
};

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
 * connection every machine needs (ADR-0008 §1 "ground the object"). Takes the
 * live `project` fn plus `[x, z]` local-unit pairs — every other builder here
 * projects before drawing, and feet must too or they drift off whatever
 * they're meant to stand under whenever that surface isn't at z=0 (the bug
 * behind the "floating dot" artifacts in pass 1). */
function feet(project, xzs, yGround, r = 7) {
  return xzs
    .map(([x, z = 0]) => {
      const [sx, sy] = project(x, yGround, z);
      const g = radGrad(sx, sy - r * 0.3, r * 1.1, [
        [0, "#3A4444", 1],
        [70, RUBBER, 1],
        [100, "#000000", 1],
      ]);
      return `<defs>${g.tag}</defs>
      <ellipse cx="${fmt(sx)}" cy="${fmt(sy + r * 0.35)}" rx="${fmt(r * 1.5)}" ry="${fmt(r * 0.55)}" fill="#000" opacity="0.22"/>
      <ellipse cx="${fmt(sx)}" cy="${fmt(sy)}" rx="${fmt(r)}" ry="${fmt(r * 0.8)}" fill="url(#${g.id})"/>`;
    })
    .join("");
}

/** A flat sheet-metal plate with laser-cut part outlines resting on a bed's
 * top face — the "detail that sells it" per ADR-0008 §1: a gear, a bracket
 * with two bolt holes, a flat circular flange cutout, cut edges a shade
 * darker than the plate, and ONE finished part (a shiny lifted flange) a few
 * pixels above the sheet with its own small contact shadow. Takes the live
 * `project` fn plus the bed-top rect in local units so it can place the
 * lifted part at a true 3D offset instead of faking it in screen space. */
function sheetWithCutouts(project, { x, yTop, z, w, d }) {
  const a = project(x, yTop, z);
  const b = project(x + w, yTop, z);
  const c = project(x + w, yTop, z + d);
  const dPt = project(x, yTop, z + d);
  const plate = linGrad(a[0], a[1], c[0], c[1], [
    [0, "#DEE2E4"],
    [50, METAL_LIGHT],
    [100, METAL_MID],
  ]);
  // Cutouts stay in the left ~58% of the sheet, well spread out; the head
  // travels the right side (headProgress 0.4–0.65) so the spark burst never
  // lands on top of a cutout shape (ADR-0008 §1 critique pass 2).
  const local = (t, u) => project(x + w * t, yTop, z + d * u);
  const gearC = local(0.13, 0.38);
  const bracketC = local(0.3, 0.68);
  const flangeBaseX = x + w * 0.5;
  const flangeBaseZ = z + d * 0.22;
  const flangeGround = project(flangeBaseX, yTop, flangeBaseZ);
  const flangeLift = project(flangeBaseX, yTop - 11, flangeBaseZ);
  const gearR = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.095;
  const cutEdge = "#7C8488";
  const holeDark = "#171F1F";
  const teeth = Array.from({ length: 10 }, (_, i) => {
    const ang = (Math.PI * 2 * i) / 10;
    const x1 = gearC[0] + Math.cos(ang) * gearR * 0.85;
    const y1 = gearC[1] + Math.sin(ang) * gearR * 0.85 * 0.55;
    const x2 = gearC[0] + Math.cos(ang) * gearR * 1.18;
    const y2 = gearC[1] + Math.sin(ang) * gearR * 1.18 * 0.55;
    return `<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${holeDark}" stroke-width="2" opacity="0.85" stroke-linecap="round"/>`;
  }).join("");
  const bracketW = gearR * 2.1;
  const bracketH = gearR * 0.85;
  const holeR = bracketH * 0.28;
  const flangeShadow = contactShadow(flangeGround[0], flangeGround[1], gearR * 0.85, gearR * 0.32, 0.32);
  const flangeGrad = radGrad(flangeLift[0] - gearR * 0.15, flangeLift[1] - gearR * 0.12, gearR * 0.85, [
    [0, "#F2F5F6"],
    [45, METAL_LIGHT],
    [100, METAL_MID],
  ]);
  return `<defs>${plate.tag}${flangeGrad.tag}</defs>
    <polygon points="${[a, b, c, dPt].map((p) => `${fmt(p[0])},${fmt(p[1])}`).join(" ")}" fill="url(#${plate.id})"/>
    <ellipse cx="${fmt(gearC[0])}" cy="${fmt(gearC[1])}" rx="${fmt(gearR * 1.2)}" ry="${fmt(gearR * 0.66)}" fill="none" stroke="${cutEdge}" stroke-width="1" opacity="0.5"/>
    <ellipse cx="${fmt(gearC[0])}" cy="${fmt(gearC[1])}" rx="${fmt(gearR)}" ry="${fmt(gearR * 0.55)}" fill="${holeDark}" opacity="0.88"/>
    <ellipse cx="${fmt(gearC[0])}" cy="${fmt(gearC[1])}" rx="${fmt(gearR * 0.32)}" ry="${fmt(gearR * 0.18)}" fill="none" stroke="${cutEdge}" stroke-width="1" opacity="0.55"/>
    ${teeth}
    <rect x="${fmt(bracketC[0] - bracketW / 2 - 1.5)}" y="${fmt(bracketC[1] - bracketH / 2 - 1.5)}" width="${fmt(bracketW + 3)}" height="${fmt(bracketH + 3)}" rx="1.2" fill="none" stroke="${cutEdge}" stroke-width="1" opacity="0.55"/>
    <rect x="${fmt(bracketC[0] - bracketW / 2)}" y="${fmt(bracketC[1] - bracketH / 2)}" width="${fmt(bracketW)}" height="${fmt(bracketH)}" rx="1" fill="${holeDark}" opacity="0.9"/>
    <circle cx="${fmt(bracketC[0] - bracketW * 0.3)}" cy="${fmt(bracketC[1])}" r="${fmt(holeR)}" fill="${METAL_MID}" opacity="0.95"/>
    <circle cx="${fmt(bracketC[0] + bracketW * 0.3)}" cy="${fmt(bracketC[1])}" r="${fmt(holeR)}" fill="${METAL_MID}" opacity="0.95"/>
    <ellipse cx="${fmt(flangeGround[0])}" cy="${fmt(flangeGround[1])}" rx="${fmt(gearR * 0.9)}" ry="${fmt(gearR * 0.4)}" fill="none" stroke="${cutEdge}" stroke-width="1" opacity="0.4" stroke-dasharray="2 2"/>
    ${flangeShadow}
    <ellipse cx="${fmt(flangeLift[0])}" cy="${fmt(flangeLift[1])}" rx="${fmt(gearR * 0.82)}" ry="${fmt(gearR * 0.42)}" fill="url(#${flangeGrad.id})" stroke="#5B6266" stroke-width="0.8"/>
    <ellipse cx="${fmt(flangeLift[0])}" cy="${fmt(flangeLift[1])}" rx="${fmt(gearR * 0.3)}" ry="${fmt(gearR * 0.15)}" fill="${holeDark}" opacity="0.9"/>
    <path d="M${fmt(flangeLift[0] - gearR * 0.6)} ${fmt(flangeLift[1] - gearR * 0.26)} A${fmt(gearR * 0.82)} ${fmt(gearR * 0.42)} 0 0 1 ${fmt(flangeLift[0] + gearR * 0.15)} ${fmt(flangeLift[1] - gearR * 0.41)}" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.55" stroke-linecap="round"/>`;
}

/** A control cabinet: box3d enclosure (painted teal) + faint UI screen +
 * status LED + nameplate + a black base trim and rubber feet, so the accent
 * colour doesn't read as the machine's only material. */
function controlCabinet(project, { x, yGround, z, w = 46, h = 94, d = 26 }, sku) {
  const trim = box3d(project, { x, yGround, z, w, h: h * 0.08, d }, BLACK_PALETTE);
  const box = box3d(project, { x, yGround: yGround - h * 0.08, z, w, h: h * 0.92, d }, TEAL_PALETTE);
  const topFrontL = project(x, yGround - h, z);
  const topFrontR = project(x + w, yGround - h, z);
  const scrW = w * 0.62;
  const scrH = h * 0.24;
  const scrY = yGround - h * 0.66;
  const feetContent = feet(project, [[x + w * 0.22, z], [x + w * 0.78, z]], yGround + 2, 4.5);
  return `${feetContent}${trim}${box}
    ${screenUi(topFrontL[0] + (topFrontR[0] - topFrontL[0]) * 0.19, scrY, scrW, scrH)}
    ${nameplate(x + w * 0.24, yGround - h * 0.26, w * 0.52, h * 0.09, sku)}`;
}

/** A real cutting head, not a pen: a stepped cylindrical body (two diameters),
 * a knurled collar, a sensor ring, a tapered nozzle cone with a bright tip,
 * and a ribbed hose curving up to the carriage (ADR-0008 §1). `hoseFrom` is
 * the screen point the hose should curve back to. */
function cuttingHead(cx, cy, s = 1, hoseFrom = null) {
  const bodyG = linGrad(cx - 8 * s, cy, cx + 8 * s, cy, [
    [0, METAL_DARK],
    [45, METAL_LIGHT],
    [100, METAL_MID],
  ]);
  const collarG = linGrad(cx - 9 * s, cy, cx + 9 * s, cy, [
    [0, GRAPHITE_DARK],
    [50, "#3A4444"],
    [100, GRAPHITE_DARK],
  ]);
  const coneG = linGrad(cx - 5 * s, cy, cx + 5 * s, cy, [
    [0, METAL_MID],
    [50, "#EDEFF0"],
    [100, METAL_DARK],
  ]);
  const knurls = Array.from({ length: 9 }, (_, i) => {
    const kx = cx - 8 * s + (16 * s * i) / 8;
    return `<line x1="${fmt(kx)}" y1="${fmt(cy - 1 * s)}" x2="${fmt(kx)}" y2="${fmt(cy + 1 * s)}" stroke="#0A1212" stroke-width="0.8" opacity="0.6"/>`;
  }).join("");
  const hose = hoseFrom
    ? `<path d="M${fmt(hoseFrom[0])} ${fmt(hoseFrom[1])} Q${fmt(cx + 13 * s)} ${fmt((hoseFrom[1] + cy) / 2)} ${fmt(cx + 6 * s)} ${fmt(cy - 12 * s)}" fill="none" stroke="${RUBBER}" stroke-width="${fmt(2.4 * s)}" stroke-linecap="round" opacity="0.9"/>
       <path d="M${fmt(hoseFrom[0])} ${fmt(hoseFrom[1])} Q${fmt(cx + 13 * s)} ${fmt((hoseFrom[1] + cy) / 2)} ${fmt(cx + 6 * s)} ${fmt(cy - 12 * s)}" fill="none" stroke="#3A4444" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>`
    : "";
  return `<defs>${bodyG.tag}${collarG.tag}${coneG.tag}</defs>
    ${hose}
    <rect x="${fmt(cx - 8 * s)}" y="${fmt(cy - 20 * s)}" width="${fmt(16 * s)}" height="${fmt(12 * s)}" rx="${fmt(2 * s)}" fill="url(#${bodyG.id})"/>
    <rect x="${fmt(cx - 9 * s)}" y="${fmt(cy - 9 * s)}" width="${fmt(18 * s)}" height="${fmt(7 * s)}" rx="${fmt(1.5 * s)}" fill="url(#${collarG.id})"/>
    ${knurls}
    <circle cx="${fmt(cx)}" cy="${fmt(cy - 1 * s)}" r="${fmt(6.5 * s)}" fill="none" stroke="${EDGE_TEAL}" stroke-width="${fmt(1.4 * s)}" opacity="0.85"/>
    <path d="M${fmt(cx - 5.5 * s)} ${fmt(cy + 2 * s)} L${fmt(cx - 2 * s)} ${fmt(cy + 13 * s)} L${fmt(cx)} ${fmt(cy + 16 * s)} L${fmt(cx + 2 * s)} ${fmt(cy + 13 * s)} L${fmt(cx + 5.5 * s)} ${fmt(cy + 2 * s)} Z" fill="url(#${coneG.id})"/>
    <circle cx="${fmt(cx)}" cy="${fmt(cy + 15 * s)}" r="${fmt(1.4 * s)}" fill="${SPARK_HOT}" opacity="0.95"/>`;
}

// ---------------------------------------------------------------------------
// 1. Flatbed fiber laser — RA-F1530 / F3015 Pro / F6020 HD / F12K
// ---------------------------------------------------------------------------

const FLATBED_PRESETS = {
  // F1530: small open frame, no enclosure at all — the entry machine.
  "ra-f1530": { bedW: 190, bedD: 76, postH: 118, enclosure: "open", label: "RA-F1530" },
  // F3015 Pro: mid-size, a half enclosure would be overkill — reads via its
  // exchange table (a second shuttle bed) instead.
  "ra-f3015-pro": { bedW: 220, bedD: 88, postH: 130, enclosure: "exchange", label: "F3015 PRO" },
  // F6020 HD: long bed (~2x the F1530), heavier double-beam gantry, full
  // windowed enclosure.
  "ra-f6020-hd": { bedW: 366, bedD: 100, postH: 148, enclosure: "full", label: "F6020 HD", heavy: true },
  // F12K: largest footprint via cabin + stairs + ducting + dual cabinets,
  // even though its own bed isn't the longest.
  "ra-f12k": { bedW: 300, bedD: 108, postH: 162, enclosure: "cabin", label: "RA-F12K" },
};

export function flatbedMachine(presetKey, { inUse = false } = {}) {
  const p = FLATBED_PRESETS[presetKey] ?? FLATBED_PRESETS["ra-f1530"];
  const project = stage();
  const baseX = 96;
  const baseY = GROUND_Y - 4;
  // A lower, flatter riser (was 30+40=70 units of chunky "wedding cake" —
  // now 16+22=38) so the bed reads as a slab, not a plinth (ADR-0008 §1
  // critique pass 2 "proportions").
  const baseH = 16;
  const bedH = 22;
  const bedZ = 10;
  const postW = p.heavy ? 18 : 15;
  const postD = p.heavy ? 15 : 12;

  const base = box3d(project, { x: baseX, yGround: baseY, z: 0, w: p.bedW, h: baseH, d: p.bedD }, BLACK_PALETTE);
  // A thin teal accent band between the black plinth and the steel bed — the
  // one "painted trim" stripe per machine.
  const accentTrim = box3d(project, { x: baseX, yGround: baseY - baseH + 3, z: 0, w: p.bedW, h: 3, d: p.bedD }, TEAL_PALETTE);
  const bed = box3d(project, { x: baseX + 6, yGround: baseY - baseH, z: bedZ, w: p.bedW - 12, h: bedH, d: p.bedD - 20 }, STEEL_PALETTE);
  const sheet = sheetWithCutouts(project, { x: baseX + 6, yTop: baseY - baseH - bedH, z: bedZ, w: p.bedW - 12, d: p.bedD - 20 });
  const feetContent = feet(project, [[baseX + p.bedW * 0.08, 0], [baseX + p.bedW * 0.5, 0], [baseX + p.bedW * 0.92, 0]], baseY + 2, 7);

  const postY = baseY - baseH - bedH;
  const postXL = baseX + p.bedW * 0.06;
  const postXR = baseX + p.bedW * 0.94;
  const postZ = bedZ + (p.bedD - 20) * 0.5;
  const gantryTopY = postY - p.postH;

  const postL = box3d(project, { x: postXL - postW / 2, yGround: postY + 8, z: postZ - postD / 2, w: postW, h: p.postH, d: postD }, STEEL_PALETTE);
  const postR = box3d(project, { x: postXR - postW / 2, yGround: postY + 8, z: postZ - postD / 2, w: postW, h: p.postH, d: postD }, STEEL_PALETTE);
  const beamH = p.heavy ? 24 : 19;
  const beam = box3d(project, { x: postXL - postW / 2, yGround: gantryTopY + 14, z: postZ - postD / 2, w: postXR - postXL + postW, h: beamH, d: postD }, STEEL_PALETTE);
  // A second, slightly set-back beam under the first — the "double-beam
  // gantry" heavy machines carry for extra rigidity.
  const beam2 = p.heavy
    ? box3d(project, { x: postXL - postW / 2, yGround: gantryTopY + 14 + beamH + 4, z: postZ - postD / 2 - 4, w: postXR - postXL + postW, h: 14, d: postD }, STEEL_PALETTE)
    : "";
  const beamAccent = box3d(project, { x: postXL - postW / 2, yGround: gantryTopY + 14 - beamH + 3, z: postZ - postD / 2, w: postXR - postXL + postW, h: 3, d: postD }, TEAL_PALETTE);
  // Ambient occlusion where each post meets the bed.
  const postAoL = contactShadow(project(postXL, postY + 6, postZ)[0], project(postXL, postY + 6, postZ)[1], postW * 1.6, 5, 0.32);
  const postAoR = contactShadow(project(postXR, postY + 6, postZ)[0], project(postXR, postY + 6, postZ)[1], postW * 1.6, 5, 0.32);

  const headProgress = inUse ? 0.62 : 0.4;
  const headX = postXL + (postXR - postXL) * headProgress;
  const beamFrontZ = postZ - postD / 2;
  const beamBottomY = gantryTopY + 14;
  const headTip = project(headX, postY + 6, beamFrontZ);
  // A visible linear rail track along the underside of the beam, with a
  // bright specular streak, so the carriage reads as riding on rails.
  const railL = project(postXL - postW / 2 - 2, beamBottomY + 3, beamFrontZ);
  const railR = project(postXR + postW / 2 + 2, beamBottomY + 3, beamFrontZ);
  const railTrack = `<line x1="${fmt(railL[0])}" y1="${fmt(railL[1])}" x2="${fmt(railR[0])}" y2="${fmt(railR[1])}" stroke="#0A1212" stroke-width="3.4" opacity="0.35" stroke-linecap="round"/>
    <line x1="${fmt(railL[0])}" y1="${fmt(railL[1] - 1)}" x2="${fmt(railR[0])}" y2="${fmt(railR[1] - 1)}" stroke="#F2F4F5" stroke-width="1.3" opacity="0.85" stroke-linecap="round"/>`;
  const carriage = box3d(project, { x: headX - 11, yGround: beamBottomY + 9, z: beamFrontZ - 3, w: 22, h: 13, d: 11 }, STEEL_PALETTE);
  const carriageTop = project(headX, beamBottomY + 9, beamFrontZ);
  const carriageSlot = project(headX, beamBottomY + 2, beamFrontZ);
  const carriageSlotR = `<rect x="${fmt(carriageSlot[0] - 6)}" y="${fmt(carriageSlot[1] - 1.5)}" width="12" height="3" rx="1" fill="#0A1212" opacity="0.6"/>`;
  // Black rubber cable-chain festoon — one of the "black covers/bellows"
  // materials, riding the rail behind the carriage.
  const cableChain = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5;
    const cx = postXL + (headX - 20 - postXL) * t;
    const p1 = project(cx, beamBottomY + 1, beamFrontZ);
    return `<rect x="${fmt(p1[0] - 4.5)}" y="${fmt(p1[1] - 3.5)}" width="8" height="7" rx="1.5" fill="${RUBBER}" opacity="0.92"/>`;
  }).join("");
  const headCol = limb(carriageTop, headTip, 3.4, 3.4, { light: METAL_LIGHT, mid: METAL_MID, dark: METAL_DARK });
  const hoseAnchor = project(headX + 12, beamBottomY + 4, beamFrontZ - 2);
  const head = cuttingHead(headTip[0], headTip[1], 1.1, hoseAnchor);

  const cabX = baseX + p.bedW + 30;
  const cabinet = controlCabinet(project, { x: cabX, yGround: baseY, z: 6, w: 46, h: 96, d: 26 }, p.label);

  let enclosureExtra = "";
  // Translucent glass drawn separately from the opaque structure below — it
  // sits closer to the camera than the machine body, so it has to be
  // composited AFTER (on top of) the machine or the painter's-algorithm
  // draw order occludes it backwards (glass hidden behind opaque bed/posts
  // that are actually further away — ADR-0008 §1 critique pass 2).
  let enclosureGlass = "";
  if (p.enclosure === "exchange") {
    // A visible two-deck shuttle table beside the bed (not a low box that
    // blends into the plinth) — the F3015 Pro tell.
    const exX = baseX - 78;
    const exW = 70;
    const exD = p.bedD - 26;
    const exLowerY = baseY - baseH + 2;
    const exUpperY = exLowerY - 15;
    const deckLower = box3d(project, { x: exX, yGround: exLowerY, z: 10, w: exW, h: 6, d: exD }, STEEL_PALETTE);
    const riserA = limb(project(exX + 8, exLowerY - 6, 14), project(exX + 8, exUpperY - 6, 14), 2.4, 2.4, { light: METAL_LIGHT });
    const riserB = limb(project(exX + exW - 8, exLowerY - 6, 14), project(exX + exW - 8, exUpperY - 6, 14), 2.4, 2.4, { light: METAL_LIGHT });
    const deckUpper = box3d(project, { x: exX + 5, yGround: exUpperY, z: 12, w: exW - 10, h: 6, d: exD - 8 }, STEEL_PALETTE);
    // The lower deck sits at bed height (exLowerY), not the true floor —
    // support legs carry it the rest of the way down so its feet don't float.
    const legA = limb(project(exX + 10, exLowerY, 10), project(exX + 10, baseY, 10), 3, 3, { light: METAL_MID, dark: GRAPHITE_DARK });
    const legB = limb(project(exX + exW - 10, exLowerY, 10), project(exX + exW - 10, baseY, 10), 3, 3, { light: METAL_MID, dark: GRAPHITE_DARK });
    const exFeet = feet(project, [[exX + 10, 10], [exX + exW - 10, 10]], baseY + 2, 5);
    enclosureExtra = `${exFeet}${legA}${legB}${deckLower}${riserA}${riserB}${deckUpper}`;
  } else if (p.enclosure === "full") {
    // Two window panes (a vertical mullion) plus side posts and a top
    // valance — a full enclosure, not one flat pane.
    const gTL = project(postXL - 10, gantryTopY, postZ - postD * 1.3);
    const gTR = project(postXR + 10, gantryTopY, postZ - postD * 1.3);
    const gBL = project(postXL - 10, postY + 10, postZ - postD * 1.3);
    const gBR = project(postXR + 10, postY + 10, postZ - postD * 1.3);
    const gMidTop = project((postXL + postXR) / 2, gantryTopY, postZ - postD * 1.3);
    const gMidBot = project((postXL + postXR) / 2, postY + 10, postZ - postD * 1.3);
    const glassG = linGrad(gTL[0], gTL[1], gBR[0], gBR[1], [
      [0, GLASS, 0.34],
      [100, GLASS, 0.14],
    ]);
    const frameL = limb(project(postXL - 10, gantryTopY, postZ - postD * 1.3), project(postXL - 10, postY + 10, postZ - postD * 1.3), 2, 2, { light: METAL_LIGHT });
    const frameR = limb(project(postXR + 10, gantryTopY, postZ - postD * 1.3), project(postXR + 10, postY + 10, postZ - postD * 1.3), 2, 2, { light: METAL_LIGHT });
    const valance = box3d(project, { x: postXL - 12, yGround: gantryTopY + 6, z: postZ - postD * 1.3 - 2, w: postXR - postXL + 24, h: 8, d: 4 }, TEAL_PALETTE);
    enclosureExtra = valance;
    enclosureGlass = `<defs>${glassG.tag}</defs>
      <polygon points="${[gTL, gTR, gBR, gBL].map((pt) => `${fmt(pt[0])},${fmt(pt[1])}`).join(" ")}" fill="url(#${glassG.id})"/>
      <line x1="${fmt(gMidTop[0])}" y1="${fmt(gMidTop[1])}" x2="${fmt(gMidBot[0])}" y2="${fmt(gMidBot[1])}" stroke="#5B6266" stroke-width="2" opacity="0.55"/>
      <path d="M${fmt(gTL[0])} ${fmt(gTL[1])} L${fmt(gTR[0])} ${fmt(gTR[1])}" stroke="#fff" stroke-width="1" opacity="0.35"/>
      ${frameL}${frameR}`;
  } else if (p.enclosure === "cabin") {
    // Operator cabin on a raised platform with a handrail, reached by steps,
    // plus a satellite chiller/PSU cabinet and rooftop extraction ducting —
    // the tell for the largest machine in the range (ADR-0008 §1).
    const cabinX = cabX + 96;
    const cabinBase = box3d(project, { x: cabinX, yGround: baseY - 6, z: 6, w: 58, h: 20, d: 32 }, STEEL_PALETTE);
    const cabin = box3d(project, { x: cabinX + 6, yGround: baseY - 26, z: 10, w: 46, h: 50, d: 24 }, TEAL_PALETTE);
    const winTL = project(cabinX + 12, baseY - 56, 9);
    const winBR = project(cabinX + 40, baseY - 34, 9);
    const winG = linGrad(winTL[0], winTL[1], winBR[0], winBR[1], [
      [0, "#E7F3F1", 0.55],
      [100, GLASS, 0.3],
    ]);
    const win = `<defs>${winG.tag}</defs>
      <rect x="${fmt(winTL[0])}" y="${fmt(winTL[1])}" width="${fmt(winBR[0] - winTL[0])}" height="${fmt(winBR[1] - winTL[1])}" rx="2" fill="url(#${winG.id})" stroke="#0B1414" stroke-width="1.2" opacity="0.95"/>
      <line x1="${fmt((winTL[0] + winBR[0]) / 2)}" y1="${fmt(winTL[1])}" x2="${fmt((winTL[0] + winBR[0]) / 2)}" y2="${fmt(winBR[1])}" stroke="#0B1414" stroke-width="1" opacity="0.5"/>`;
    const rail = limb(project(cabinX, baseY - 26, 6), project(cabinX + 58, baseY - 26, 6), 1.6, 1.6, { light: METAL_LIGHT });
    const railPosts = [0, 0.5, 1].map((t) => limb(project(cabinX + 58 * t, baseY - 6, 6), project(cabinX + 58 * t, baseY - 26, 6), 1.4, 1.4, { light: METAL_LIGHT })).join("");
    const steps = Array.from({ length: 4 }, (_, i) => {
      const sy = baseY - i * 6;
      const sx = cabinX - 6 - i * 11;
      return box3d(project, { x: sx, yGround: sy, z: 6, w: 14, h: 6, d: 16 }, STEEL_PALETTE);
    }).join("");
    // Second cabinet (chiller/PSU) beside the control cabinet — the "dual
    // cabinets" tell.
    const chillerX = cabX + 56;
    const chiller = box3d(project, { x: chillerX, yGround: baseY, z: 8, w: 34, h: 72, d: 22 }, STEEL_PALETTE);
    const vents = Array.from({ length: 4 }, (_, i) => {
      const vy = baseY - 16 - i * 10;
      const p1 = project(chillerX + 5, vy, 7);
      const p2 = project(chillerX + 29, vy, 7);
      return `<line x1="${fmt(p1[0])}" y1="${fmt(p1[1])}" x2="${fmt(p2[0])}" y2="${fmt(p2[1])}" stroke="#5B6266" stroke-width="1" opacity="0.55"/>`;
    }).join("");
    // Extraction duct rising off the main cabinet and bending toward the cabin.
    const ductA = project(cabX + 14, baseY - 96, 6);
    const ductB = project(cabX + 14, baseY - 152, 6);
    const ductC = project(cabinX - 4, baseY - 152, 6);
    const duct = `${limb(ductA, ductB, 5, 5, { light: METAL_LIGHT })}${limb(ductB, ductC, 5, 4.4, { light: METAL_LIGHT })}`;
    enclosureExtra = `${duct}${cabinBase}${steps}${cabin}${win}${rail}${railPosts}${chiller}${vents}`;
  }

  const shadowCx = (project(baseX, 0, 0)[0] + project(baseX + p.bedW, 0, p.bedD)[0]) / 2;
  const shadow = contactShadow(shadowCx, baseY + 10, p.bedW * 0.62, 16, 0.4);

  const reflectContent = `${base}${accentTrim}${enclosureExtra}${bed}${sheet}${postAoL}${postAoR}${postL}${postR}${beam2}${beam}${beamAccent}${railTrack}${cableChain}${headCol}${carriage}${carriageSlotR}${head}${cabinet}${feetContent}`;
  const reflection = floorReflection(reflectContent, baseY + 6, 120, 0.16);

  // Nozzle tip sits ~17 local units below headTip (cuttingHead's cone base);
  // the beam and spark land right at the sheet just past it.
  const nozzleTipY = headTip[1] + 17;
  const spark = inUse ? sparkBurst(headTip[0], headTip[1] + 30, 0.95) : "";
  const beamLine = inUse ? beamGlow(headTip[0], nozzleTipY, headTip[0], headTip[1] + 30, 2.4) : "";

  const svg = `<g>${shadow}${reflection}${reflectContent}${enclosureGlass}${beamLine}${spark}</g>`;
  const bbox = bboxOfPoints([...project.points, [shadowCx - p.bedW * 0.62, baseY + 10], [shadowCx + p.bedW * 0.62, baseY + 10]], 6);
  return {
    svg,
    bbox,
    tip: headTip,
    // Centred on the head/sheet contact point (not the post midpoint) so the
    // "detail" angle is an actual close-up of the cut, not a cropped leg.
    detailCrop: cropAround(headTip[0], headTip[1] + 6, 200, 190),
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

  const base = box3d(project, { x: baseX, yGround: baseY, z: 0, w: 330, h: baseH, d: 40 }, BLACK_PALETTE);
  const baseAccent = box3d(project, { x: baseX, yGround: baseY - baseH + 3, z: 0, w: 330, h: 3, d: 40 }, TEAL_PALETTE);

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
  const hoseAnchor = project(headX + 10, headRailY + 10, headRailZ - 3);
  const head = cuttingHead(headTip[0], headTip[1], 0.95, hoseAnchor);

  const rackX = baseX + 254;
  const rack = box3d(project, { x: rackX, yGround: baseY - baseH, z: 6, w: 60, h: 70, d: 30 }, STEEL_PALETTE);
  const rackTubes = [0, 1, 2]
    .map((i) => {
      const p1 = project(rackX + 8, baseY - baseH - 14 - i * 15, 8);
      const p2 = project(rackX + 52, baseY - baseH - 14 - i * 15, 8);
      return limb(p1, p2, 5, 5, { light: "#E6E9EA" });
    })
    .join("");

  const cabinet = controlCabinet(project, { x: baseX + 330 + 2, yGround: baseY, z: 8, w: 40, h: 92, d: 24 }, "RA-T6000");

  const feetContent = feet(project, [[baseX + 40, 0], [baseX + 200, 0], [baseX + 330, 0]], baseY + 2, 7);
  const shadow = contactShadow(baseX + 200, baseY + 10, 200, 16, 0.4);

  const content = `${base}${baseAccent}${chuck}${rollers}${tubeSeg1}${tubeSeg2}${railPostL}${railPostR}${railGantry}${headCol}${head}${rack}${rackTubes}${cabinet}${feetContent}`;
  const reflection = floorReflection(content, baseY + 6, 110, 0.16);

  const spark = inUse ? sparkBurst(headTip[0], headTip[1] + 4, 0.85) : "";
  const beamLine = inUse ? beamGlow(headTip[0], headTip[1] - 6, headTip[0], headTip[1] + 4, 2) : "";

  const svg = `<g>${shadow}${reflection}${content}${beamLine}${spark}</g>`;
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
  const baseTrimH = totalH * 0.1;
  const baseTrim = box3d(project, { x: baseX, yGround: baseY, z: 0, w, h: baseTrimH, d }, BLACK_PALETTE);
  const cabinetBox = box3d(project, { x: baseX, yGround: baseY - baseTrimH, z: 0, w, h: totalH - baseTrimH, d }, STEEL_PALETTE);

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
  const hoseAnchor = project(headCx + 8, winY + 6, -1);
  const head = cuttingHead(headP[0], headP[1], 0.7, hoseAnchor);

  const cabX = baseX + w + 20;
  const cabinet = controlCabinet(project, { x: cabX, yGround: baseY, z: 6, w: 42, h: 88, d: 24 }, "RA-C1390");
  const plate = nameplate(baseX + w * 0.36, baseY - 14, 60, 12, "CO2 · 1390");

  const feetContent = feet(project, legXs.map((lx) => [lx, 0]), baseY + 2, 6);
  const shadow = contactShadow(baseX + w / 2, baseY + 8, w * 0.6, 15, 0.38);

  const content = `${baseTrim}${cabinetBox}<defs>${glassG.tag}</defs><polygon points="${[winTL, winTR, winBR, winBL].map((p) => `${fmt(p[0])},${fmt(p[1])}`).join(" ")}" fill="url(#${glassG.id})"/>${hexes.join("")}${headRail}${head}${lid}${cabinet}${plate}${feetContent}`;
  const reflection = floorReflection(content, baseY + 6, 100, 0.14);

  const spark = inUse ? sparkBurst(headP[0], headP[1] + 6, 0.7) : "";
  const beamLine = inUse ? beamGlow(headP[0], headP[1] - 4, headP[0], headP[1] + 6, 1.8) : "";

  const svg = `<g>${shadow}${reflection}${content}${beamLine}${spark}</g>`;
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
  const torch = weldTorch(wrist, tip);
  const torchGlow = inUse ? sparkBurst(tip[0], tip[1], 0.55) : "";

  return { svg: `${base}${upright}${upperArm}${foreArm}${torchArm}${torch}${torchGlow}`, tip };
}

/** A real welding torch, not a dot: a tapered conical shroud, a bright
 * contact tip, and a black gas hose curving back along the forearm
 * (ADR-0008 §1 "same idea for the welding torch"). */
function weldTorch(wrist, tip) {
  const dx = tip[0] - wrist[0];
  const dy = tip[1] - wrist[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const shroudBase = [tip[0] - ux * 11, tip[1] - uy * 11];
  const A = [shroudBase[0] + nx * 4.4, shroudBase[1] + ny * 4.4];
  const B = [tip[0] + nx * 1.6, tip[1] + ny * 1.6];
  const C = [tip[0] - nx * 1.6, tip[1] - ny * 1.6];
  const D = [shroudBase[0] - nx * 4.4, shroudBase[1] - ny * 4.4];
  const g = linGrad(A[0], A[1], D[0], D[1], [
    [0, METAL_LIGHT],
    [50, METAL_MID],
    [100, GRAPHITE_DARK],
  ]);
  const hoseMid = [wrist[0] - ux * 2 + nx * 13, wrist[1] - uy * 2 + ny * 13];
  return `<defs>${g.tag}</defs>
    <path d="M${fmt(wrist[0] - nx * 3)} ${fmt(wrist[1] - ny * 3)} Q${fmt(hoseMid[0])} ${fmt(hoseMid[1])} ${fmt(shroudBase[0] + nx * 2)} ${fmt(shroudBase[1] + ny * 2)}" fill="none" stroke="${RUBBER}" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/>
    <polygon points="${fmt(A[0])},${fmt(A[1])} ${fmt(B[0])},${fmt(B[1])} ${fmt(C[0])},${fmt(C[1])} ${fmt(D[0])},${fmt(D[1])}" fill="url(#${g.id})"/>
    <circle cx="${fmt(tip[0])}" cy="${fmt(tip[1])}" r="1.7" fill="${SPARK_HOT}" opacity="0.95"/>`;
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
    const pedestal = box3d(project, { x: pedX - 26, yGround: baseY, z: 0, w: 52, h: 60, d: 40 }, BLACK_PALETTE);
    const arm = robotArm(project, { baseX: pedX, baseY: baseY - 60, z: 20, reach: 1.05, inUse });

    const fixtureX = pedX + 150;
    const fixture = box3d(project, { x: fixtureX, yGround: baseY, z: 10, w: 92, h: 34, d: 56 }, STEEL_PALETTE);
    const part = sheetWithCutouts(project, { x: fixtureX + 14, yTop: baseY - 34, z: 16, w: 64, d: 30 });
    // Guard fence behind the fixture (ADR-0008 §1: "torch, fixture and fence").
    const fenceLine = fence(project, fixtureX - 6, fixtureX + 98, baseY, 66);

    const cabinet = controlCabinet(project, { x: pedX - 118, yGround: baseY, z: 6, w: 40, h: 84, d: 22 }, "RA-RW6");
    const feetContent = feet(project, [[pedX, 0], [fixtureX + 10, 10], [fixtureX + 82, 10]], baseY + 2, 6);
    const shadow = contactShadow(pedX + 70, baseY + 10, 190, 16, 0.38);

    const content = `${pedestal}${cabinet}${arm.svg}${fixture}${part}${fenceLine}${feetContent}`;
    const reflection = floorReflection(content, baseY + 6, 110, 0.15);
    const svg = `<g>${shadow}${reflection}${content}</g>`;
    const bbox = bboxOfPoints([...project.points, [pedX + 70 - 190, baseY + 10], [pedX + 70 + 190, baseY + 10]], 6);
    return { svg, bbox, tip: arm.tip, detailCrop: cropAround(pedX + 60, baseY - 100, 220, 190), label: "RA-RW6" };
  }

  const cellX = 60;
  const cellW = 380;
  const cell = box3d(project, { x: cellX, yGround: baseY, z: -6, w: cellW, h: 10, d: 66 }, STEEL_PALETTE);
  const pedX = cellX + cellW * 0.34;
  const pedestal = box3d(project, { x: pedX - 26, yGround: baseY, z: 10, w: 52, h: 64, d: 40 }, BLACK_PALETTE);
  const arm = robotArm(project, { baseX: pedX, baseY: baseY - 64, z: 30, reach: 1.1, inUse });

  const turnCx = pedX + 118;
  const turnCz = 24;
  const turnP = project(turnCx, baseY, turnCz);
  const turnR = 58;
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
      const fx = turnCx + off * 44;
      const fz = turnCz + (off < 0 ? -20 : 12);
      return box3d(project, { x: fx - 20, yGround: baseY - 6, z: fz, w: 40, h: 22, d: 18 }, STEEL_PALETTE);
    })
    .join("");

  // Amber safety curtain partitioning the far side of the cell — a header
  // rail plus overlapping translucent PVC strips. Kept clear of the
  // turntable/fixture cluster (which ends ~turnCx+turnR) so the strips don't
  // overlap and muddy into it.
  const curtainX = Math.max(cellX + cellW - 66, turnCx + turnR + 14);
  const curtainW = cellX + cellW - 12 - curtainX;
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
  const feetContent = feet(project, [[cellX + 10, -6], [cellX + cellW * 0.5, -6], [cellX + cellW - 10, -6]], baseY + 2, 6);
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
