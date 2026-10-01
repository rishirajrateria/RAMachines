/**
 * scripts/illustrations/machines.mjs — ADR-0008 §1 solid-shaded 3/4-perspective
 * machine renders: visibly distinct machines (fiber-laser presets, tube, CO2,
 * robot cells, plasma table, MIG/TIG/MMA set, SAW tractor) built from FILLED
 * gradient shapes (box3d panels, cylindrical limbs, glass/metal/rubber materials), a single
 * shared vanishing point so every machine converges consistently, a key light
 * upper-left (top faces lightest, front mid, side/back darkest + rim light +
 * ambient occlusion), a soft contact shadow + floor reflection, and — on the
 * "in-use" angle — the one warm accent: a spark burst at the cutting/weld point.
 * All share a 480×300 local box (ground line at y=250) so callers can
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

/** `label` overrides the preset's nameplate text (family art carries a
 * family label, not a retired model number); omitted → the preset's own. */
export function flatbedMachine(presetKey, { inUse = false, label } = {}) {
  const preset = FLATBED_PRESETS[presetKey] ?? FLATBED_PRESETS["ra-f1530"];
  const p = label ? { ...preset, label } : preset;
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

export function robotCellMachine(stations = 1, { inUse = false, label } = {}) {
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

    const cabinet = controlCabinet(project, { x: pedX - 118, yGround: baseY, z: 6, w: 40, h: 84, d: 22 }, label ?? "RA-RW6");
    const feetContent = feet(project, [[pedX, 0], [fixtureX + 10, 10], [fixtureX + 82, 10]], baseY + 2, 6);
    const shadow = contactShadow(pedX + 70, baseY + 10, 190, 16, 0.38);

    const content = `${pedestal}${cabinet}${arm.svg}${fixture}${part}${fenceLine}${feetContent}`;
    const reflection = floorReflection(content, baseY + 6, 110, 0.15);
    const svg = `<g>${shadow}${reflection}${content}</g>`;
    const bbox = bboxOfPoints([...project.points, [pedX + 70 - 190, baseY + 10], [pedX + 70 + 190, baseY + 10]], 6);
    return { svg, bbox, tip: arm.tip, detailCrop: cropAround(pedX + 60, baseY - 100, 220, 190), label: label ?? "RA-RW6" };
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

  const cabinet = controlCabinet(project, { x: cellX - 44, yGround: baseY, z: 8, w: 40, h: 86, d: 22 }, label ?? "RA-RW10");
  const feetContent = feet(project, [[cellX + 10, -6], [cellX + cellW * 0.5, -6], [cellX + cellW - 10, -6]], baseY + 2, 6);
  const shadow = contactShadow(cellX + cellW / 2, baseY + 10, cellW * 0.56, 17, 0.4);

  const content = `${cell}${pedestal}${cabinet}${arm.svg}${turntable}${fixtures}${curtainStrips}${curtainRail}${feetContent}`;
  const reflection = floorReflection(content, baseY + 6, 120, 0.15);
  const svg = `<g>${shadow}${reflection}${content}</g>`;
  const bbox = bboxOfPoints(
    [...project.points, [turnP[0] - turnR, turnP[1]], [turnP[0] + turnR, turnP[1]], [cellX - 20, baseY + 10], [cellX + cellW + 10, baseY + 10]],
    6,
  );
  return { svg, bbox, tip: arm.tip, detailCrop: cropAround(turnCx, baseY - 90, 260, 200), label: label ?? "RA-RW10" };
}

// ---------------------------------------------------------------------------
// Shared small parts for the plasma / arc-welding / SAW renders
// ---------------------------------------------------------------------------

const ptsStr = (list) => list.map((p) => `${fmt(p[0])},${fmt(p[1])}`).join(" ");

/** A round control knob: dark radial-shaded cap, a bright pointer line and a
 * thin rim highlight — reads as a dial at card size. */
function knob(cx, cy, r, angle = -0.9) {
  const g = radGrad(cx - r * 0.3, cy - r * 0.35, r * 1.3, [
    [0, "#4A5656"],
    [60, "#161E1E"],
    [100, "#050808"],
  ]);
  const px = cx + Math.cos(angle) * r * 0.78;
  const py = cy + Math.sin(angle) * r * 0.78;
  return `<defs>${g.tag}</defs>
    <circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}" fill="url(#${g.id})"/>
    <circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}" fill="none" stroke="#6E7A7A" stroke-width="0.6" opacity="0.8"/>
    <line x1="${fmt(cx)}" y1="${fmt(cy)}" x2="${fmt(px)}" y2="${fmt(py)}" stroke="#F2F4F5" stroke-width="${fmt(Math.max(0.8, r * 0.22))}" stroke-linecap="round"/>`;
}

/** A small segment-style readout (dark window + glowing digits). */
function digitReadout(x, y, w, h, text, color = "#8FE0D6") {
  return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="1" fill="#071211"/>
    <rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="1" fill="none" stroke="#3A4A4A" stroke-width="0.5"/>
    <text x="${fmt(x + w / 2)}" y="${fmt(y + h * 0.76)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fmt(h * 0.72)}" font-weight="700" fill="${color}" letter-spacing="0.6">${text}</text>`;
}

/** A wheel/caster seen face-on: rubber tyre, steel hub, rim highlight. */
function wheel(cx, cy, r) {
  const tyre = radGrad(cx - r * 0.25, cy - r * 0.3, r * 1.2, [
    [0, "#3A4444"],
    [70, RUBBER],
    [100, "#000000"],
  ]);
  const hub = radGrad(cx - r * 0.15, cy - r * 0.2, r * 0.6, [
    [0, "#F2F4F5"],
    [60, METAL_MID],
    [100, METAL_DARK],
  ]);
  return `<defs>${tyre.tag}${hub.tag}</defs>
    <circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}" fill="url(#${tyre.id})"/>
    <circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r * 0.5)}" fill="url(#${hub.id})"/>
    <circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r * 0.14)}" fill="#1B2626"/>
    <path d="M${fmt(cx - r * 0.8)} ${fmt(cy - r * 0.45)} A${fmt(r)} ${fmt(r)} 0 0 1 ${fmt(cx + r * 0.1)} ${fmt(cy - r * 0.95)}" fill="none" stroke="#6E7A7A" stroke-width="0.9" opacity="0.7" stroke-linecap="round"/>`;
}

/** A thick rubber cable/hose along a path `d`, with a faint specular line so
 * it reads as round. `ribbed` adds the corrugation of a flux/extraction hose. */
function cable(d, width = 3, { ribbed = false } = {}) {
  const ribs = ribbed
    ? `<path d="${d}" fill="none" stroke="#5B6666" stroke-width="${fmt(width * 0.92)}" stroke-dasharray="0.9 2.6" opacity="0.75"/>`
    : "";
  return `<path d="${d}" fill="none" stroke="${RUBBER}" stroke-width="${fmt(width)}" stroke-linecap="round" stroke-linejoin="round"/>
    ${ribs}
    <path d="${d}" fill="none" stroke="#56615F" stroke-width="${fmt(Math.max(0.6, width * 0.22))}" stroke-linecap="round" opacity="0.55" transform="translate(${fmt(-width * 0.18)} ${fmt(-width * 0.22)})"/>`;
}

/** Vertical cylinder (gas bottle, canister) between two screen points with a
 * domed/elliptical top cap. `colors` feeds limb()'s cylindrical shading. */
function cylinderV(bottom, top, r, colors, capColor = METAL_LIGHT) {
  return `${limb(bottom, top, r, r, colors)}
    <ellipse cx="${fmt(top[0])}" cy="${fmt(top[1])}" rx="${fmt(r)}" ry="${fmt(r * 0.36)}" fill="${capColor}" opacity="0.9"/>`;
}

// ---------------------------------------------------------------------------
// 6. CNC plasma cutting table
// ---------------------------------------------------------------------------

/** A CNC plasma table: an open slatted water table (no enclosure, no sheet of
 * laser cut-outs) under a low gantry riding side rails on teal end trucks, a
 * plasma torch on a Z-lifter fed by a drag chain looping over the beam, a CNC
 * console on a post, and a separate boxy plasma power source on casters with
 * its own front panel and torch lead — the tells that separate it from the
 * fiber laser at card size. */
export function plasmaCutterMachine({ inUse = false } = {}) {
  const project = stage();
  const baseY = GROUND_Y - 4;
  const x0 = 86;
  const w = 256;
  const d = 96;
  const plinthH = 10;
  const tankH = 36;
  const yTop = baseY - plinthH - tankH;

  const plinth = box3d(project, { x: x0, yGround: baseY, z: 0, w, h: plinthH, d }, BLACK_PALETTE);
  const accent = box3d(project, { x: x0, yGround: baseY - plinthH + 3, z: 0, w, h: 3, d }, TEAL_PALETTE);
  const tank = box3d(project, { x: x0, yGround: baseY - plinthH, z: 0, w, h: tankH, d }, STEEL_PALETTE);

  // Open water tank seen from above: a dark inner well, inset from the walls.
  const inset = 6;
  const well = [
    project(x0 + inset, yTop, inset),
    project(x0 + w - inset, yTop, inset),
    project(x0 + w - inset, yTop, d - inset),
    project(x0 + inset, yTop, d - inset),
  ];
  const wellG = linGrad(well[0][0], well[0][1], well[2][0], well[2][1], [
    [0, "#0E1A1A"],
    [100, "#1F3533"],
  ]);
  // Slats: vertical plates running front-to-back across the whole width —
  // each drawn as a shadow line plus a bright top edge, with a zig-zag notch
  // pattern hinted by short ticks so the bed reads as a grid, not a sheet.
  const slatCount = 18;
  let slats = "";
  for (let i = 0; i <= slatCount; i++) {
    const sx = x0 + inset + 4 + ((w - inset * 2 - 8) * i) / slatCount;
    const a = project(sx, yTop + 1, inset + 1);
    const b = project(sx, yTop + 1, d - inset - 1);
    const a2 = project(sx, yTop - 2, inset + 1);
    const b2 = project(sx, yTop - 2, d - inset - 1);
    slats += `<line x1="${fmt(a[0] + 1.2)}" y1="${fmt(a[1])}" x2="${fmt(b[0] + 1.2)}" y2="${fmt(b[1])}" stroke="#050A0A" stroke-width="2.4" opacity="0.55"/>
      <line x1="${fmt(a2[0])}" y1="${fmt(a2[1])}" x2="${fmt(b2[0])}" y2="${fmt(b2[1])}" stroke="${METAL_LIGHT}" stroke-width="1.6" stroke-linecap="round"/>`;
  }
  // Two cross-supports under the slats.
  const cross = [0.3, 0.72]
    .map((t) => {
      const zc = inset + (d - inset * 2) * t;
      const a = project(x0 + inset, yTop + 2, zc);
      const b = project(x0 + w - inset, yTop + 2, zc);
      return `<line x1="${fmt(a[0])}" y1="${fmt(a[1])}" x2="${fmt(b[0])}" y2="${fmt(b[1])}" stroke="#4E5A5A" stroke-width="1.3" opacity="0.7"/>`;
    })
    .join("");

  // A thick plate resting on the slats (right half), with the kerf of a part
  // being cut — the cut ends at the torch.
  const headProgress = inUse ? 0.64 : 0.56;
  const plX = x0 + w * 0.46;
  const plW = w * 0.38;
  const plZ = d * 0.1;
  const plD = d * 0.62;
  const plate = box3d(project, { x: plX, yGround: yTop - 2, z: plZ, w: plW, h: 3, d: plD }, STEEL_PALETTE);
  const plateTop = yTop - 5;
  const torchX = x0 + w * headProgress;
  const torchZ = plZ + plD * 0.3;
  const kerfPts = [
    [plX + plW * 0.14, plZ + plD * 0.3],
    [plX + plW * 0.14, plZ + plD * 0.82],
    [plX + plW * 0.5, plZ + plD * 0.82],
    [plX + plW * 0.5, torchZ],
    [torchX, torchZ],
  ].map(([x, z]) => project(x, plateTop, z));
  const kerf = `<polyline points="${ptsStr(kerfPts)}" fill="none" stroke="#141C1C" stroke-width="1.6" stroke-linejoin="round" opacity="0.85"/>
    ${[0.72, 0.86].map((t) => {
      const c = project(plX + plW * t, plateTop, plZ + plD * 0.6);
      return `<ellipse cx="${fmt(c[0])}" cy="${fmt(c[1])}" rx="5.5" ry="2.6" fill="#141C1C" opacity="0.88"/>`;
    }).join("")}`;

  // Side rails along both tank walls (the gantry runs front-to-back on them).
  const railL = limb(project(x0 + 2, yTop - 2, -4), project(x0 + 2, yTop - 2, d + 4), 2.4, 2.4, { light: "#F2F4F5" });
  const railR = limb(project(x0 + w - 2, yTop - 2, -4), project(x0 + w - 2, yTop - 2, d + 4), 2.4, 2.4, { light: "#F2F4F5" });

  // Gantry: teal end trucks on the rails, a steel beam across, black cable
  // tray on top. Low (no tall posts) — a plasma gantry, not a laser bridge.
  // The torch hangs at depth torchZ; the gantry beam sits just behind it.
  const gz = torchZ + 17;
  const truckH = 70;
  const truckL = box3d(project, { x: x0 - 9, yGround: yTop + 6, z: gz - 12, w: 20, h: truckH, d: 26 }, TEAL_PALETTE);
  const truckR = box3d(project, { x: x0 + w - 11, yGround: yTop + 6, z: gz - 12, w: 20, h: truckH, d: 26 }, TEAL_PALETTE);
  const beamBottom = yTop + 6 - truckH;
  const beamH = 26;
  const beam = box3d(project, { x: x0 - 9, yGround: beamBottom, z: gz - 6, w: w + 18, h: beamH, d: 14 }, STEEL_PALETTE);
  const tray = box3d(project, { x: x0 + 4, yGround: beamBottom - beamH, z: gz - 4, w: w - 8, h: 4, d: 10 }, BLACK_PALETTE);
  const beamTop = beamBottom - beamH - 4;

  // Drag chain: fixed at the left of the tray, running right inside it, looping
  // up and back over itself to land on the moving Z-carriage.
  const loopX = torchX + 46;
  const chainZ = gz + 1;
  const loopR = 10;
  const chainPts = [];
  for (let x = x0 + 18; x <= loopX; x += 8) chainPts.push(project(x, beamTop, chainZ));
  for (let i = 1; i < 6; i++) {
    const ang = Math.PI / 2 - (Math.PI * i) / 6;
    chainPts.push(project(loopX + Math.cos(ang) * loopR, beamTop - loopR - Math.sin(ang) * loopR, chainZ));
  }
  for (let x = loopX; x >= torchX + 8; x -= 8) chainPts.push(project(x, beamTop - loopR * 2, chainZ));
  const chain = chainPts
    .map((p) => `<rect x="${fmt(p[0] - 4)}" y="${fmt(p[1] - 3.5)}" width="8" height="7" rx="1.6" fill="${RUBBER}"/><rect x="${fmt(p[0] - 3)}" y="${fmt(p[1] - 2.6)}" width="6" height="1.3" rx="0.6" fill="#4A5858" opacity="0.8"/>`)
    .join("");

  // Z-carriage on the beam front, a black lifter slide below it, then the torch.
  const carZ = gz - 11;
  const carriage = box3d(project, { x: torchX - 13, yGround: beamBottom + 4, z: carZ, w: 26, h: beamH + 18, d: 6 }, STEEL_PALETTE);
  const lifter = box3d(project, { x: torchX - 7, yGround: beamBottom + 2, z: carZ - 4, w: 14, h: 32, d: 5 }, BLACK_PALETTE);
  const holder = project(torchX, beamBottom, torchZ);
  const tip = project(torchX, plateTop - 7, torchZ);
  const torchBody = `${limb(holder, [tip[0], tip[1] - 14], 5.4, 5.4, { light: METAL_LIGHT, mid: METAL_DARK, dark: GRAPHITE })}
    ${limb([tip[0], tip[1] - 32], [tip[0], tip[1] - 26], 6.4, 6.4, { light: "#3A4444", mid: RUBBER, dark: "#000" })}`;
  const capG = linGrad(tip[0] - 6, 0, tip[0] + 6, 0, [
    [0, METAL_DARK],
    [45, "#EDEFF0"],
    [100, METAL_MID],
  ]);
  const torchCap = `<defs>${capG.tag}</defs>
    <rect x="${fmt(tip[0] - 6.6)}" y="${fmt(tip[1] - 21)}" width="13.2" height="4.4" rx="1.2" fill="${EDGE_TEAL}"/>
    <path d="M${fmt(tip[0] - 5.8)} ${fmt(tip[1] - 16.6)} L${fmt(tip[0] - 2)} ${fmt(tip[1] - 1)} L${fmt(tip[0] + 2)} ${fmt(tip[1] - 1)} L${fmt(tip[0] + 5.8)} ${fmt(tip[1] - 16.6)} Z" fill="url(#${capG.id})"/>
    <circle cx="${fmt(tip[0])}" cy="${fmt(tip[1] - 1)}" r="1.5" fill="${SPARK_HOT}" opacity="0.9"/>`;
  const lead = cable(`M${fmt(holder[0] + 3)} ${fmt(holder[1] - 4)} Q${fmt(holder[0] + 18)} ${fmt(holder[1] - 20)} ${fmt(chainPts[chainPts.length - 1][0])} ${fmt(chainPts[chainPts.length - 1][1] + 3)}`, 2.6);
  const clamp = box3d(project, { x: torchX - 8, yGround: beamBottom + 6, z: carZ - 7, w: 16, h: 6, d: 3 }, BLACK_PALETTE);

  // CNC console on a post at the front-left corner.
  const conX = x0 - 34;
  const conPost = limb(project(conX + 14, baseY, 8), project(conX + 14, yTop - 30, 8), 3, 3, { light: METAL_MID, dark: GRAPHITE_DARK });
  const conBase = box3d(project, { x: conX + 8, yGround: baseY, z: 2, w: 12, h: 4, d: 10 }, BLACK_PALETTE);
  const conBox = box3d(project, { x: conX, yGround: yTop - 26, z: 6, w: 30, h: 26, d: 8 }, BLACK_PALETTE);
  const conFace = project(conX + 4, yTop - 48, 6);
  const conScreen = screenUi(conFace[0], conFace[1], 19, 13);

  // Plasma power source: a squat box on a black castered base, with its own
  // front panel — current readout, a big dial, LEDs and the torch-lead socket.
  const psX = x0 + w + 34;
  const psZ = 10;
  const psW = 62;
  const psH = 56;
  const psD = 44;
  const psBaseY = baseY - 9;
  const psBase = box3d(project, { x: psX - 2, yGround: psBaseY, z: psZ - 2, w: psW + 4, h: 6, d: psD + 4 }, BLACK_PALETTE);
  const psBody = box3d(project, { x: psX, yGround: psBaseY - 6, z: psZ, w: psW, h: psH, d: psD }, TEAL_PALETTE);
  const psTop = psBaseY - 6 - psH;
  const handle = `${limb(project(psX + 12, psTop, psZ + 14), project(psX + 12, psTop - 9, psZ + 14), 1.6, 1.6)}${limb(project(psX + psW - 12, psTop, psZ + 14), project(psX + psW - 12, psTop - 9, psZ + 14), 1.6, 1.6)}${limb(project(psX + 12, psTop - 9, psZ + 14), project(psX + psW - 12, psTop - 9, psZ + 14), 2, 2, { light: "#3A4444", mid: RUBBER, dark: "#000" })}`;
  const pf = (u, v) => project(psX + u, psTop + v, psZ);
  const panelTL = pf(5, 6);
  const panelBR = pf(psW - 5, psH - 6);
  const panel = `<rect x="${fmt(panelTL[0])}" y="${fmt(panelTL[1])}" width="${fmt(panelBR[0] - panelTL[0])}" height="${fmt(panelBR[1] - panelTL[1])}" rx="2" fill="#0B1414" opacity="0.55"/>
    ${digitReadout(pf(9, 10)[0], pf(9, 10)[1], 26, 11, "125A", SPARK_AMBER)}
    ${knob(pf(46, 16)[0], pf(46, 16)[1], 7.5, -0.5)}
    <circle cx="${fmt(pf(11, 28)[0])}" cy="${fmt(pf(11, 28)[1])}" r="1.6" fill="#5EEAD4"/>
    <circle cx="${fmt(pf(17, 28)[0])}" cy="${fmt(pf(17, 28)[1])}" r="1.6" fill="${SPARK_AMBER}" opacity="0.9"/>
    <circle cx="${fmt(pf(23, 28)[0])}" cy="${fmt(pf(23, 28)[1])}" r="1.6" fill="#4A5858"/>
    ${knob(pf(46, 35)[0], pf(46, 35)[1], 4.5, -2.2)}
    <circle cx="${fmt(pf(14, 40)[0])}" cy="${fmt(pf(14, 40)[1])}" r="4.2" fill="${METAL_MID}"/><circle cx="${fmt(pf(14, 40)[0])}" cy="${fmt(pf(14, 40)[1])}" r="2" fill="#0A1212"/>`;
  const vents = Array.from({ length: 5 }, (_, i) => {
    const a = project(psX + psW, psTop + 10 + i * 7, psZ + 8);
    const b = project(psX + psW, psTop + 10 + i * 7, psZ + psD - 8);
    return `<line x1="${fmt(a[0])}" y1="${fmt(a[1])}" x2="${fmt(b[0])}" y2="${fmt(b[1])}" stroke="#03100E" stroke-width="1.6" opacity="0.6"/>`;
  }).join("");
  const psPlate = nameplate(pf(30, psH - 13)[0], pf(30, psH - 13)[1], 24, 7, "PLASMA");
  const casters = [
    project(psX + 8, psBaseY + 3, psZ),
    project(psX + psW - 8, psBaseY + 3, psZ),
  ];
  const casterSvg = casters.map((c) => wheel(c[0], c[1], 5)).join("");
  // Torch lead + ground cable from the power source back to the gantry truck.
  const sock = pf(14, 40);
  const truckFoot = project(x0 + w + 4, yTop - 10, gz - 12);
  const psCable = cable(`M${fmt(sock[0])} ${fmt(sock[1])} C${fmt(sock[0] - 10)} ${fmt(sock[1] + 26)} ${fmt(truckFoot[0] + 20)} ${fmt(baseY + 6)} ${fmt(truckFoot[0] + 6)} ${fmt(truckFoot[1] + 10)}`, 3);

  const feetContent = feet(project, [[x0 + 14, 0], [x0 + w / 2, 0], [x0 + w - 14, 0]], baseY + 2, 7);
  const shadowCx = (x0 - 30 + psX + psW) / 2;
  const shadowRx = (psX + psW - (x0 - 30)) * 0.56;
  const shadow = contactShadow(shadowCx, baseY + 10, shadowRx, 16, 0.4);

  const content = `${conBase}${conPost}${plinth}${accent}${tank}<defs>${wellG.tag}</defs><polygon points="${ptsStr(well)}" fill="url(#${wellG.id})"/>${cross}${slats}${railL}${railR}${plate}${kerf}${truckL}${beam}${tray}${chain}${lead}${carriage}${lifter}${torchBody}${clamp}${torchCap}${truckR}${feetContent}${conBox}${conScreen}${psCable}${psBase}${psBody}${handle}${panel}${vents}${psPlate}${casterSvg}`;
  const reflection = floorReflection(content, baseY + 6, 110, 0.15);

  const strike = [tip[0], tip[1] + 6];
  const arc = inUse ? `${beamGlow(tip[0], tip[1] - 1, strike[0], strike[1], 2.2)}${sparkBurst(strike[0], strike[1], 0.9)}` : "";

  const svg = `<g>${shadow}${reflection}${content}${arc}</g>`;
  const bbox = bboxOfPoints([...project.points, [shadowCx - shadowRx, baseY + 10], [shadowCx + shadowRx, baseY + 10]], 6);
  return {
    svg,
    bbox,
    tip: strike,
    detailCrop: cropAround(tip[0], tip[1] - 10, 200, 190),
    label: "PLASMA",
  };
}

// ---------------------------------------------------------------------------
// 7. MIG / TIG / MMA welding set
// ---------------------------------------------------------------------------

/** A workshop welding set: an upright inverter power source on a wheeled
 * trolley (display + dials + output sockets), a wire feeder on top with its
 * spool window, a shielding-gas cylinder chained to the trolley's rear frame,
 * a coiled torch cable running to a MIG torch resting at a T-joint on a small
 * steel bench, and an earth-clamp cable to the bench. In use: arc glow at the
 * torch nozzle on the joint. */
export function arcWelderMachine({ inUse = false } = {}) {
  const project = stage();
  const baseY = GROUND_Y - 4;

  // --- Trolley -------------------------------------------------------------
  const tx = 112;
  const tw = 64;
  const tz = 6;
  const td = 34;
  const deckY = baseY - 18;
  const deck = box3d(project, { x: tx, yGround: deckY, z: tz, w: tw, h: 6, d: td }, STEEL_PALETTE);
  const deckTop = deckY - 6;

  // Rear frame (two posts + top bar) the gas cylinder is chained to.
  const frameZ = tz + td - 4;
  const postL = limb(project(tx + 6, deckTop, frameZ), project(tx + 6, deckTop - 132, frameZ), 2.4, 2.4, { light: METAL_MID, dark: GRAPHITE_DARK });
  const postR = limb(project(tx + tw - 6, deckTop, frameZ), project(tx + tw - 6, deckTop - 132, frameZ), 2.4, 2.4, { light: METAL_MID, dark: GRAPHITE_DARK });
  const frameBar = limb(project(tx + 6, deckTop - 132, frameZ), project(tx + tw - 6, deckTop - 132, frameZ), 2.6, 2.6, { light: "#3A4444", mid: RUBBER, dark: "#000" });

  // Gas cylinder standing on the trolley's low rear shelf, left of centre so
  // its shoulder, valve and regulator clear the feeder.
  const cylX = tx + tw - 10;
  const cylZ = frameZ + 12;
  const cylBottom = project(cylX, deckTop + 2, cylZ);
  const cylTop = project(cylX, deckTop - 142, cylZ);
  const cylinder = cylinderV(cylBottom, cylTop, 12, { light: BODY_TEAL_LIGHT, mid: BODY_TEAL, dark: GRAPHITE }, EDGE_TEAL);
  const shoulder = limb([cylTop[0], cylTop[1] + 2], [cylTop[0], cylTop[1] - 8], 12, 6, { light: "#E6E9EA" });
  const valve = limb([cylTop[0], cylTop[1] - 8], [cylTop[0], cylTop[1] - 17], 3, 3, { light: "#E6E9EA" });
  const regC = [cylTop[0] + 8, cylTop[1] - 16];
  const regulator = `${limb([cylTop[0], cylTop[1] - 14], regC, 2.4, 2.4)}
    <circle cx="${fmt(regC[0] + 4)}" cy="${fmt(regC[1])}" r="6" fill="#E6E9EA" stroke="#5B6266" stroke-width="1"/>
    <circle cx="${fmt(regC[0] + 4)}" cy="${fmt(regC[1])}" r="4.2" fill="#F8FAFA"/>
    <line x1="${fmt(regC[0] + 4)}" y1="${fmt(regC[1])}" x2="${fmt(regC[0] + 6.4)}" y2="${fmt(regC[1] - 2.4)}" stroke="#B42318" stroke-width="0.9"/>`;
  const strapYs = [deckTop - 56, deckTop - 104];
  const straps = strapYs
    .map((sy) => {
      const a = project(cylX - 13, sy, cylZ - 4);
      const b = project(cylX + 13, sy, cylZ - 4);
      return `<path d="M${fmt(a[0])} ${fmt(a[1])} Q${fmt((a[0] + b[0]) / 2)} ${fmt((a[1] + b[1]) / 2 + 5)} ${fmt(b[0])} ${fmt(b[1])}" fill="none" stroke="#0A1212" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M${fmt(a[0])} ${fmt(a[1])} Q${fmt((a[0] + b[0]) / 2)} ${fmt((a[1] + b[1]) / 2 + 5)} ${fmt(b[0])} ${fmt(b[1])}" fill="none" stroke="#6E7A7A" stroke-width="1" stroke-dasharray="1.6 1.4" stroke-linecap="round"/>`;
    })
    .join("");

  // --- Inverter power source (upright) on the deck ----------------------------
  const psX = tx + 6;
  const psW = 48;
  const psH = 84;
  const psD = 26;
  const psZ = tz + 2;
  const psTrim = box3d(project, { x: psX, yGround: deckTop, z: psZ, w: psW, h: 6, d: psD }, BLACK_PALETTE);
  const psBody = box3d(project, { x: psX, yGround: deckTop - 6, z: psZ, w: psW, h: psH - 6, d: psD }, TEAL_PALETTE);
  const psTop = deckTop - psH;
  const pf = (u, v) => project(psX + u, psTop + v, psZ);
  const pTL = pf(4, 6);
  const pBR = pf(psW - 4, psH - 12);
  const panel = `<rect x="${fmt(pTL[0])}" y="${fmt(pTL[1])}" width="${fmt(pBR[0] - pTL[0])}" height="${fmt(pBR[1] - pTL[1])}" rx="2" fill="#0B1414" opacity="0.5"/>
    ${digitReadout(pf(8, 10)[0], pf(8, 10)[1], 30, 11, "220V", SPARK_AMBER)}
    ${digitReadout(pf(8, 23)[0], pf(8, 23)[1], 30, 8, "MIG")}
    ${knob(pf(14, 43)[0], pf(14, 43)[1], 6.4, -0.6)}
    ${knob(pf(32, 43)[0], pf(32, 43)[1], 6.4, -2.1)}
    <circle cx="${fmt(pf(9, 56)[0])}" cy="${fmt(pf(9, 56)[1])}" r="1.5" fill="#5EEAD4"/>
    <circle cx="${fmt(pf(15, 56)[0])}" cy="${fmt(pf(15, 56)[1])}" r="1.5" fill="#4A5858"/>
    <rect x="${fmt(pf(24, 53.5)[0])}" y="${fmt(pf(24, 53.5)[1])}" width="14" height="5" rx="1" fill="#1F2A2A" stroke="#5B6266" stroke-width="0.5"/>`;
  // Output sockets (+ / −) low on the front panel.
  const sockPlus = pf(12, psH - 6);
  const sockMinus = pf(34, psH - 6);
  const sockets = [sockPlus, sockMinus]
    .map((s) => `<circle cx="${fmt(s[0])}" cy="${fmt(s[1])}" r="3.6" fill="${METAL_MID}"/><circle cx="${fmt(s[0])}" cy="${fmt(s[1])}" r="1.8" fill="#0A1212"/>`)
    .join("");
  const vents = Array.from({ length: 6 }, (_, i) => {
    const a = project(psX + psW, psTop + 14 + i * 8, psZ + 8);
    const b = project(psX + psW, psTop + 14 + i * 8, psZ + psD - 8);
    return `<line x1="${fmt(a[0])}" y1="${fmt(a[1])}" x2="${fmt(b[0])}" y2="${fmt(b[1])}" stroke="#03100E" stroke-width="1.5" opacity="0.6"/>`;
  }).join("");

  // --- Wire feeder on top ------------------------------------------------------
  const fX = psX - 4;
  const fW = psW + 8;
  const fH = 30;
  const fZ = psZ + 2;
  const feeder = box3d(project, { x: fX, yGround: psTop, z: fZ, w: fW, h: fH, d: psD - 4 }, STEEL_PALETTE);
  const fTop = psTop - fH;
  const ff = (u, v) => project(fX + u, fTop + v, fZ);
  const spoolC = ff(fW * 0.42, fH * 0.5);
  const spoolG = radGrad(spoolC[0] - 3, spoolC[1] - 3, 12, [
    [0, "#E9D2B4"],
    [55, "#B98F62"],
    [100, "#6E5034"],
  ]);
  const spool = `<defs>${spoolG.tag}</defs>
    <rect x="${fmt(ff(5, 4)[0])}" y="${fmt(ff(5, 4)[1])}" width="${fmt(ff(fW - 12, 0)[0] - ff(5, 0)[0])}" height="${fmt(fH - 8)}" rx="2" fill="#16201F" opacity="0.75"/>
    <circle cx="${fmt(spoolC[0])}" cy="${fmt(spoolC[1])}" r="10.5" fill="url(#${spoolG.id})"/>
    <circle cx="${fmt(spoolC[0])}" cy="${fmt(spoolC[1])}" r="10.5" fill="none" stroke="#2E3838" stroke-width="1.4"/>
    <circle cx="${fmt(spoolC[0])}" cy="${fmt(spoolC[1])}" r="7" fill="none" stroke="#8C6A45" stroke-width="0.6" opacity="0.7"/>
    <circle cx="${fmt(spoolC[0])}" cy="${fmt(spoolC[1])}" r="3.2" fill="#1B2626"/>
    <path d="M${fmt(ff(6, 5)[0])} ${fmt(ff(6, 5)[1])} L${fmt(ff(fW - 14, 5)[0])} ${fmt(ff(fW - 14, 5)[1])}" stroke="#FFFFFF" stroke-width="0.9" opacity="0.35"/>`;
  const feederHandle = limb(project(fX + 12, fTop - 7, fZ + 16), project(fX + fW - 12, fTop - 7, fZ + 16), 2, 2, { light: "#3A4444", mid: RUBBER, dark: "#000" });
  const handlePosts = `${limb(project(fX + 12, fTop, fZ + 16), project(fX + 12, fTop - 7, fZ + 16), 1.4, 1.4)}${limb(project(fX + fW - 12, fTop, fZ + 16), project(fX + fW - 12, fTop - 7, fZ + 16), 1.4, 1.4)}`;
  const euro = ff(fW - 7, fH - 7);
  const euroSock = `<circle cx="${fmt(euro[0])}" cy="${fmt(euro[1])}" r="4" fill="${METAL_LIGHT}" stroke="#5B6266" stroke-width="0.8"/><circle cx="${fmt(euro[0])}" cy="${fmt(euro[1])}" r="1.8" fill="#0A1212"/>`;
  const plate = nameplate(pf(10, psH - 20)[0], pf(10, psH - 20)[1], 26, 6.5, "MIG·TIG");

  // Trolley wheels (big rear pair, small front castors) + push handle.
  const wheels = [
    wheel(project(tx - 3, baseY - 13, tz + td - 10)[0], project(tx - 3, baseY - 13, tz + td - 10)[1], 13),
    wheel(project(tx + tw + 3, baseY - 13, tz + td - 10)[0], project(tx + tw + 3, baseY - 13, tz + td - 10)[1], 13),
  ];
  const castorPts = [project(tx + 10, baseY - 4, tz + 4), project(tx + tw - 10, baseY - 4, tz + 4)];
  const castors = castorPts
    .map((c) => `${limb([c[0], c[1] - 12], [c[0], c[1] - 4], 1.6, 1.6, { light: METAL_MID, dark: GRAPHITE_DARK })}${wheel(c[0], c[1], 5)}`)
    .join("");

  // --- Workbench + workpiece -------------------------------------------------
  const bX = 250;
  const bW = 150;
  const bZ = 4;
  const bD = 56;
  const benchTopY = baseY - 70;
  const legPairs = [
    [bX + 6, bZ + bD - 6],
    [bX + bW - 6, bZ + bD - 6],
  ];
  const backLegs = legPairs.map(([lx, lz]) => limb(project(lx, baseY, lz), project(lx, benchTopY, lz), 2.8, 2.8, { light: METAL_MID, dark: GRAPHITE_DARK })).join("");
  const frontLegs = [
    [bX + 6, bZ + 6],
    [bX + bW - 6, bZ + 6],
  ]
    .map(([lx, lz]) => limb(project(lx, baseY, lz), project(lx, benchTopY, lz), 3, 3, { light: METAL_MID, dark: GRAPHITE_DARK }))
    .join("");
  const shelf = box3d(project, { x: bX + 4, yGround: baseY - 18, z: bZ + 4, w: bW - 8, h: 3, d: bD - 8 }, STEEL_PALETTE);
  const benchTop = box3d(project, { x: bX, yGround: benchTopY + 6, z: bZ, w: bW, h: 7, d: bD }, STEEL_PALETTE);
  const benchSurface = benchTopY - 1;
  const benchFeet = feet(project, [[bX + 6, bZ + 6], [bX + bW - 6, bZ + 6]], baseY + 2, 4.5);

  // T-joint workpiece: a base plate with a web plate standing on it, and a
  // fillet bead laid part-way along the front of the joint.
  const wpX = bX + 30;
  const wpW = 92;
  const wpZ = bZ + 6;
  const wpD = 30;
  const basePlate = box3d(project, { x: wpX, yGround: benchSurface, z: wpZ, w: wpW, h: 4, d: wpD }, STEEL_PALETTE);
  const wpTop = benchSurface - 4;
  const webZ = wpZ + wpD * 0.5;
  const web = box3d(project, { x: wpX + 2, yGround: wpTop, z: webZ, w: wpW - 4, h: 30, d: 3 }, STEEL_PALETTE);
  const weldProgress = 0.62;
  const jointX = wpX + 4 + (wpW - 8) * weldProgress;
  const beadPts = [];
  for (let x = wpX + 4; x <= jointX - 2; x += 3.2) beadPts.push(project(x, wpTop - 1, webZ - 0.5));
  const bead = beadPts
    .map((p, i) => `<ellipse cx="${fmt(p[0])}" cy="${fmt(p[1])}" rx="2.4" ry="1.7" fill="${i % 2 ? METAL_DARK : "#7A8286"}" stroke="#4E5658" stroke-width="0.4"/>`)
    .join("");
  const joint = project(jointX, wpTop - 1, webZ - 0.5);

  // MIG torch lying on the bench: nozzle on the joint, swan neck curving
  // back toward the front-right, handle resting on the bench top.
  const handleEnd = project(jointX + 50, benchSurface - 3, webZ - 9);
  const along = (t, lift) => [joint[0] + (handleEnd[0] - joint[0]) * t, joint[1] + (handleEnd[1] - joint[1]) * t - lift];
  const nozzleEnd = along(0.2, 5);
  const neckEnd = along(0.42, 6);
  const torch = `${limb(neckEnd, handleEnd, 5.6, 5, { light: "#3A4444", mid: "#161E1E", dark: "#000" })}
    ${limb(nozzleEnd, neckEnd, 2.6, 2.8, { light: "#3A4444", mid: RUBBER, dark: "#000" })}
    ${limb(joint, nozzleEnd, 2.2, 4.4, { light: "#EDEFF0", mid: METAL_MID, dark: METAL_DARK })}
    <circle cx="${fmt(along(0.6, 9.5)[0])}" cy="${fmt(along(0.6, 9.5)[1])}" r="1.5" fill="${EDGE_TEAL}"/>`;

  // Torch cable: euro socket → down past the trolley → two coils on the floor
  // → up to the torch handle.
  const coilC = project(228, baseY - 2, -4);
  const torchCable = cable(
    `M${fmt(euro[0])} ${fmt(euro[1])} C${fmt(euro[0] + 34)} ${fmt(euro[1] + 14)} ${fmt(coilC[0] - 4)} ${fmt(coilC[1] - 70)} ${fmt(coilC[0] - 18)} ${fmt(coilC[1] - 6)}`,
    3.2,
  );
  const coils = [0, 1, 2]
    .map((i) => {
      const cy = coilC[1] - 2 - i * 3.2;
      return `<ellipse cx="${fmt(coilC[0] + i * 2)}" cy="${fmt(cy)}" rx="${fmt(22 - i * 1.5)}" ry="${fmt(7 - i * 0.4)}" fill="none" stroke="${RUBBER}" stroke-width="3.2"/>
        <path d="M${fmt(coilC[0] + i * 2 - 18)} ${fmt(cy - 4.6)} Q${fmt(coilC[0] + i * 2)} ${fmt(cy - 8.4)} ${fmt(coilC[0] + i * 2 + 16)} ${fmt(cy - 5)}" fill="none" stroke="#56615F" stroke-width="0.8" opacity="0.6"/>`;
    })
    .join("");
  const cableToTorch = cable(
    `M${fmt(coilC[0] + 22)} ${fmt(coilC[1] - 6)} C${fmt(coilC[0] + 48)} ${fmt(coilC[1] - 8)} ${fmt(handleEnd[0] + 6)} ${fmt(handleEnd[1] + 40)} ${fmt(handleEnd[0] + 3)} ${fmt(handleEnd[1] + 2)}`,
    3,
  );
  // Earth cable: − socket → along the floor → up the bench front to a clamp
  // gripping the bench edge.
  const clampP = project(bX + 14, benchTopY + 4, bZ);
  const earthCable = cable(
    `M${fmt(sockMinus[0])} ${fmt(sockMinus[1])} C${fmt(sockMinus[0] + 6)} ${fmt(baseY + 8)} ${fmt(clampP[0] - 30)} ${fmt(baseY + 10)} ${fmt(clampP[0] - 2)} ${fmt(clampP[1] + 10)}`,
    2.6,
  );
  const earthClamp = `<polygon points="${ptsStr([[clampP[0] - 5, clampP[1] + 12], [clampP[0] + 5, clampP[1] + 12], [clampP[0] + 4, clampP[1] - 3], [clampP[0] - 4, clampP[1] - 3]])}" fill="${RUBBER}"/>
    <rect x="${fmt(clampP[0] - 5)}" y="${fmt(clampP[1] - 5)}" width="10" height="3" rx="1" fill="${METAL_LIGHT}"/>
    <rect x="${fmt(clampP[0] - 3.5)}" y="${fmt(clampP[1] + 4)}" width="7" height="6" rx="1.5" fill="${EDGE_TEAL}" opacity="0.9"/>`;
  // Short power lead from + socket into the feeder's interconnect.
  const interconnect = cable(`M${fmt(sockPlus[0])} ${fmt(sockPlus[1])} C${fmt(sockPlus[0] - 16)} ${fmt(sockPlus[1] + 8)} ${fmt(sockPlus[0] - 22)} ${fmt(fTop + 30)} ${fmt(ff(4, fH - 6)[0])} ${fmt(ff(4, fH - 6)[1])}`, 2.2);

  const trolleyShadow = contactShadow(project(tx + tw / 2, baseY, tz)[0] + 6, baseY + 8, 74, 13, 0.36);
  const benchShadow = contactShadow(project(bX + bW / 2, baseY, bZ)[0], baseY + 8, bW * 0.62, 12, 0.34);

  const back = `${backLegs}${shelf}${postL}${postR}${cylinder}${shoulder}${valve}${regulator}${straps}${frameBar}`;
  const trolley = `${wheels[0]}${deck}${psTrim}${psBody}${panel}${sockets}${vents}${plate}${feeder}${spool}${handlePosts}${feederHandle}${euroSock}${wheels[1]}${castors}`;
  const bench = `${benchTop}${basePlate}${web}${bead}${frontLegs}${benchFeet}`;
  // Floor-level cables/coils sit in front of the ground line, so they stay
  // out of the mirrored reflection (they'd ghost above the floor otherwise).
  const standing = `${back}${trolley}${bench}${interconnect}`;
  const content = `${standing}${earthCable}${earthClamp}${coils}${torchCable}${cableToTorch}${torch}`;
  const reflection = floorReflection(standing, baseY + 6, 100, 0.14);

  const arc = inUse
    ? (() => {
        const glow = radGrad(joint[0], joint[1], 11, [
          [0, "#FFFFFF", 0.9],
          [30, SPARK_HOT, 0.55],
          [65, SPARK_AMBER, 0.15],
          [100, SPARK_AMBER, 0],
        ]);
        return `<defs>${glow.tag}</defs><circle cx="${fmt(joint[0])}" cy="${fmt(joint[1])}" r="11" fill="url(#${glow.id})"/>${sparkBurst(joint[0], joint[1], 0.55)}`;
      })()
    : "";

  const svg = `<g>${trolleyShadow}${benchShadow}${reflection}${content}${arc}</g>`;
  const extra = [
    [regC[0] + 12, regC[1] - 8],
    [project(tx + tw / 2, baseY, tz)[0] + 6 - 74, baseY + 8],
    [project(bX + bW / 2, baseY, bZ)[0] + bW * 0.62, baseY + 8],
    [coilC[0] - 24, coilC[1] + 6],
  ];
  const bbox = bboxOfPoints([...project.points, ...extra], 6);
  return {
    svg,
    bbox,
    tip: joint,
    detailCrop: cropAround(joint[0] + 10, joint[1] - 10, 200, 170),
    label: "MIG·TIG",
  };
}

// ---------------------------------------------------------------------------
// 8. Submerged arc welding (SAW) tractor
// ---------------------------------------------------------------------------

/** A SAW tractor running on a guide rail laid along a long, thick butt-jointed
 * plate: drive carriage with wheels, a teal gearbox body, a mast carrying the
 * wire reel, a boom reaching over the seam to the feed motor and contact
 * tube, a funnel flux hopper above the head, a flux mound trailing behind,
 * a ribbed flux-recovery hose back to a canister, and a control pendant. The
 * arc is hidden under flux, so "in use" is only a dull glow at the mound base
 * and a cooling slag line behind it — no open spark burst. */
export function sawMachine({ inUse = false } = {}) {
  const project = stage();
  const baseY = GROUND_Y - 4;
  // Tractor parts are authored at unit scale and multiplied by S so the
  // carriage reads at card size against the long plate it runs on.
  const S = 1.75;

  // --- Long thick plate on two I-beam supports ------------------------------
  const x0 = 66;
  const w = 304;
  const d = 50;
  const supH = 12;
  const plH = 16;
  const supports = [x0 + 26, x0 + w - 46]
    .map((sx) => box3d(project, { x: sx, yGround: baseY, z: -6, w: 18, h: supH, d: d + 12 }, BLACK_PALETTE))
    .join("");
  const plate = box3d(project, { x: x0, yGround: baseY - supH, z: 0, w, h: plH, d }, STEEL_PALETTE);
  const yTop = baseY - supH - plH;
  const seamZ = 14;
  // The butt joint also shows on the plate's front edge.
  const edgeSeamA = project(x0, yTop + 3, 0);
  const edgeSeamB = project(x0 + w, yTop + 3, 0);
  const edgeSeam = `<line x1="${fmt(edgeSeamA[0])}" y1="${fmt(edgeSeamA[1])}" x2="${fmt(edgeSeamB[0])}" y2="${fmt(edgeSeamB[1])}" stroke="#F2F4F5" stroke-width="0.8" opacity="0.6"/>`;

  const progress = inUse ? 0.6 : 0.56;
  const headX = x0 + w * progress;
  const tipX = headX + 4 * S;

  // Butt seam: ahead of the head an open V-groove; under/behind it a flux
  // mound, then the recovery nozzle, then exposed bead/slag back to the start.
  const seamA = project(tipX + 6, yTop, seamZ);
  const seamB = project(x0 + w - 6, yTop, seamZ);
  const groove = `<line x1="${fmt(seamA[0])}" y1="${fmt(seamA[1])}" x2="${fmt(seamB[0])}" y2="${fmt(seamB[1])}" stroke="#141C1C" stroke-width="2.6" stroke-linecap="round"/>
    <line x1="${fmt(seamA[0])}" y1="${fmt(seamA[1] - 2.4)}" x2="${fmt(seamB[0])}" y2="${fmt(seamB[1] - 2.4)}" stroke="#F2F4F5" stroke-width="0.9" opacity="0.7"/>
    <line x1="${fmt(seamA[0])}" y1="${fmt(seamA[1] + 2.4)}" x2="${fmt(seamB[0])}" y2="${fmt(seamB[1] + 2.4)}" stroke="${METAL_DARK}" stroke-width="0.9" opacity="0.8"/>`;
  const moundStart = tipX + 6 * S;
  const moundEnd = tipX - 40 * S;
  const nozzleX = moundEnd - 4;
  const beadPts = [];
  for (let x = x0 + 6; x <= nozzleX; x += 3.6) beadPts.push(project(x, yTop - 0.6, seamZ));
  const bead = beadPts
    .map((p, i) => `<ellipse cx="${fmt(p[0])}" cy="${fmt(p[1])}" rx="3" ry="2.1" fill="${i % 2 ? "#5B6266" : "#6E7679"}" stroke="#3A4144" stroke-width="0.4"/>`)
    .join("");
  // Slag line just behind the recovery nozzle: hot (glowing) when in use,
  // a dull dark crust otherwise.
  const slagA = project(nozzleX - 2, yTop - 1.4, seamZ);
  const slagB = project(nozzleX - 90, yTop - 1.4, seamZ);
  const slagG = linGrad(slagA[0], slagA[1], slagB[0], slagB[1], inUse
    ? [
        [0, SPARK_HOT, 0.95],
        [25, SPARK_AMBER, 0.85],
        [100, SPARK_AMBER, 0],
      ]
    : [
        [0, "#2E3434", 0.9],
        [100, "#2E3434", 0],
      ]);
  const slagBlur = uid("sawblur");
  const slag = `<defs>${slagG.tag}<filter id="${slagBlur}" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="2.4"/></filter></defs>
    ${inUse ? `<line x1="${fmt(slagA[0])}" y1="${fmt(slagA[1])}" x2="${fmt(slagB[0])}" y2="${fmt(slagB[1])}" stroke="url(#${slagG.id})" stroke-width="8" stroke-linecap="round" opacity="0.55" filter="url(#${slagBlur})"/>` : ""}
    <line x1="${fmt(slagA[0])}" y1="${fmt(slagA[1])}" x2="${fmt(slagB[0])}" y2="${fmt(slagB[1])}" stroke="url(#${slagG.id})" stroke-width="2.6" stroke-linecap="round"/>`;

  // Flux mound: overlapping granular humps, heaped highest at the head.
  const fluxTopY = project(tipX, yTop - 10 * S, seamZ)[1];
  const fluxBotY = project(tipX, yTop + 1, seamZ)[1];
  const fluxG = linGrad(0, fluxTopY, 0, fluxBotY, [
    [0, "#CBBFA6"],
    [45, "#9C8F76"],
    [100, "#5F5544"],
  ]);
  let mound = `<defs>${fluxG.tag}</defs>`;
  const humps = 30;
  for (let i = 0; i <= humps; i++) {
    const t = i / humps;
    const mx = moundEnd + (moundStart - moundEnd) * t;
    const hgt = (3.5 + 6.5 * Math.sin(Math.min(1, t * 1.1) * Math.PI * 0.5) * (t > 0.94 ? 0.6 : 1)) * S;
    const c = project(mx, yTop - hgt * 0.5, seamZ);
    mound += `<ellipse cx="${fmt(c[0])}" cy="${fmt(c[1])}" rx="${fmt(6 * S + hgt * 0.7)}" ry="${fmt(hgt * 0.62)}" fill="url(#${fluxG.id})"/>`;
  }
  for (let i = 0; i < 60; i++) {
    const t = (i * 0.618) % 1;
    const mx = moundEnd + (moundStart - moundEnd) * t;
    const hgt = (3.5 + 6.5 * Math.sin(Math.min(1, t * 1.1) * Math.PI * 0.5)) * S;
    const c = project(mx + ((i * 3) % 5) - 2, yTop - hgt * (0.35 + ((i * 7) % 6) * 0.1), seamZ);
    mound += `<circle cx="${fmt(c[0])}" cy="${fmt(c[1])}" r="${i % 3 ? 0.7 : 0.95}" fill="${i % 4 ? "#4E4536" : "#E3DAC6"}" opacity="0.65"/>`;
  }
  const moundBase = project(tipX, yTop, seamZ);
  const moundGlow = inUse
    ? (() => {
        const g = radGrad(moundBase[0], moundBase[1], 22, [
          [0, SPARK_HOT, 0.7],
          [35, SPARK_AMBER, 0.38],
          [100, SPARK_AMBER, 0],
        ]);
        return `<defs>${g.tag}</defs><ellipse cx="${fmt(moundBase[0])}" cy="${fmt(moundBase[1] + 1)}" rx="22" ry="7" fill="url(#${g.id})"/>
          <path d="M${fmt(moundBase[0] - 11)} ${fmt(moundBase[1] + 2)} Q${fmt(moundBase[0])} ${fmt(moundBase[1] + 3.6)} ${fmt(moundBase[0] + 9)} ${fmt(moundBase[1] + 1.6)}" fill="none" stroke="${SPARK_HOT}" stroke-width="1.3" opacity="0.85" stroke-linecap="round"/>`;
      })()
    : "";

  // --- Guide rail behind the seam, clamped to the plate ----------------------
  const railZ = 34;
  const rail = box3d(project, { x: x0 + 6, yGround: yTop, z: railZ, w: w - 12, h: 5, d: 6 }, STEEL_PALETTE);
  const railTop = yTop - 5;
  const railClamps = [0.04, 0.3, 0.8, 0.97]
    .map((t) => box3d(project, { x: x0 + 6 + (w - 12) * t - 4, yGround: yTop, z: railZ + 6, w: 8, h: 7, d: 5 }, BLACK_PALETTE))
    .join("");

  // --- Tractor ------------------------------------------------------------------
  const carZ = railZ - 8;
  const drive = box3d(project, { x: headX - 34 * S, yGround: railTop - 1, z: carZ, w: 62 * S, h: 13 * S, d: 18 * S }, BLACK_PALETTE);
  const wheelPts = [project(headX - 25 * S, railTop - 2, carZ), project(headX + 16 * S, railTop - 2, carZ)];
  const tractorWheels = wheelPts.map((p) => wheel(p[0], p[1], 6.5 * S)).join("");
  const bodyY = railTop - 1 - 13 * S;
  const body = box3d(project, { x: headX - 30 * S, yGround: bodyY, z: carZ + 2, w: 44 * S, h: 24 * S, d: 15 * S }, TEAL_PALETTE);
  const bodyTop = bodyY - 24 * S;

  // Mast with the wire reel on top.
  const mastX = headX - 16 * S;
  const mastZ = carZ + 9 * S;
  const reelY = bodyTop - 66 * S;
  const mast = limb(project(mastX, bodyTop, mastZ), project(mastX, reelY + 4, mastZ), 3 * S, 3 * S, { light: METAL_LIGHT });
  const reelC = project(mastX, reelY, mastZ);
  const reelR = 19 * S;
  const reelG = radGrad(reelC[0] - 6, reelC[1] - 6, reelR * 1.1, [
    [0, "#E9D2B4"],
    [50, "#B98F62"],
    [100, "#6E5034"],
  ]);
  const reel = `<defs>${reelG.tag}</defs>
    <circle cx="${fmt(reelC[0] + 4)}" cy="${fmt(reelC[1] + 2)}" r="${fmt(reelR + 3)}" fill="#1B2626"/>
    <circle cx="${fmt(reelC[0])}" cy="${fmt(reelC[1])}" r="${fmt(reelR + 3)}" fill="none" stroke="${METAL_MID}" stroke-width="3"/>
    <circle cx="${fmt(reelC[0])}" cy="${fmt(reelC[1])}" r="${fmt(reelR)}" fill="url(#${reelG.id})"/>
    ${[0.8, 0.62].map((f) => `<circle cx="${fmt(reelC[0])}" cy="${fmt(reelC[1])}" r="${fmt(reelR * f)}" fill="none" stroke="#7E5E3C" stroke-width="0.7" opacity="0.6"/>`).join("")}
    <circle cx="${fmt(reelC[0])}" cy="${fmt(reelC[1])}" r="${fmt(reelR * 0.36)}" fill="${GRAPHITE}"/>
    ${[0, 120, 240].map((a) => {
      const r = (a * Math.PI) / 180;
      return `<line x1="${fmt(reelC[0])}" y1="${fmt(reelC[1])}" x2="${fmt(reelC[0] + Math.cos(r) * reelR * 0.34)}" y2="${fmt(reelC[1] + Math.sin(r) * reelR * 0.34)}" stroke="${METAL_LIGHT}" stroke-width="2"/>`;
    }).join("")}
    <circle cx="${fmt(reelC[0])}" cy="${fmt(reelC[1])}" r="3.2" fill="${METAL_LIGHT}"/>
    <path d="M${fmt(reelC[0] - reelR * 0.8)} ${fmt(reelC[1] - reelR * 0.5)} A${fmt(reelR)} ${fmt(reelR)} 0 0 1 ${fmt(reelC[0] + reelR * 0.1)} ${fmt(reelC[1] - reelR * 0.98)}" fill="none" stroke="#FFFFFF" stroke-width="1.4" opacity="0.45" stroke-linecap="round"/>`;

  // Boom: from the mast forward (toward the camera) over the seam.
  const boomY = bodyTop - 30 * S;
  const headZ = seamZ;
  const boom = box3d(project, { x: mastX - 5 * S, yGround: boomY, z: headZ, w: 10 * S, h: 8 * S, d: mastZ - headZ }, STEEL_PALETTE);
  // Feed motor + straightener box at the boom's front end, contact tube below.
  const fbX = tipX - 9 * S;
  const fbTop = boomY + 2;
  const feedBox = box3d(project, { x: fbX, yGround: fbTop + 22 * S, z: headZ - 5, w: 18 * S, h: 22 * S, d: 10 * S }, BLACK_PALETTE);
  const feedFace = project(fbX, fbTop, headZ - 5);
  const nozzleCollar = box3d(project, { x: tipX - 5, yGround: yTop - 9, z: seamZ - 3, w: 10, h: 6, d: 6 }, BLACK_PALETTE);
  const feedDetail = `<circle cx="${fmt(feedFace[0] + 9 * S)}" cy="${fmt(feedFace[1] + 8 * S)}" r="${fmt(3.6 * S)}" fill="${METAL_MID}"/><circle cx="${fmt(feedFace[0] + 9 * S)}" cy="${fmt(feedFace[1] + 8 * S)}" r="${fmt(1.5 * S)}" fill="#0A1212"/>`;
  const tubeTop = project(tipX, fbTop + 22 * S, seamZ);
  const tubeTip = project(tipX, yTop - 6, seamZ);
  const contactTube = limb(tubeTop, tubeTip, 3.2 * S, 2.2 * S, { light: "#E6E9EA" });
  const wire = `<path d="M${fmt(reelC[0] + reelR * 0.55)} ${fmt(reelC[1] + reelR * 0.84)} Q${fmt(reelC[0] + reelR * 1.1)} ${fmt(feedFace[1] - 20)} ${fmt(feedFace[0] + 9 * S)} ${fmt(feedFace[1])}" fill="none" stroke="#B98F62" stroke-width="1.2" opacity="0.95"/>`;

  // Flux hopper: cylinder top + funnel cone + feed pipe to just ahead of the tip.
  const hopX = headX + 25 * S;
  const hopZ = headZ - 2;
  const hopC = project(hopX, boomY - 10 * S, hopZ);
  const hr = 13 * S;
  const hopBodyH = 16 * S;
  const coneH = 15 * S;
  const hopG = linGrad(hopC[0] - hr, 0, hopC[0] + hr, 0, [
    [0, METAL_DARK],
    [35, "#EDEFF0"],
    [70, METAL_LIGHT],
    [100, "#5B6266"],
  ]);
  const hopper = `<defs>${hopG.tag}</defs>
    <path d="M${fmt(hopC[0] - hr)} ${fmt(hopC[1])} L${fmt(hopC[0] - hr)} ${fmt(hopC[1] + hopBodyH)} L${fmt(hopC[0] - 3.4)} ${fmt(hopC[1] + hopBodyH + coneH)} L${fmt(hopC[0] + 3.4)} ${fmt(hopC[1] + hopBodyH + coneH)} L${fmt(hopC[0] + hr)} ${fmt(hopC[1] + hopBodyH)} L${fmt(hopC[0] + hr)} ${fmt(hopC[1])} Z" fill="url(#${hopG.id})"/>
    <path d="M${fmt(hopC[0] - hr)} ${fmt(hopC[1] + hopBodyH)} Q${fmt(hopC[0])} ${fmt(hopC[1] + hopBodyH + hr * 0.34)} ${fmt(hopC[0] + hr)} ${fmt(hopC[1] + hopBodyH)}" fill="none" stroke="#5B6266" stroke-width="0.9" opacity="0.7"/>
    <ellipse cx="${fmt(hopC[0])}" cy="${fmt(hopC[1])}" rx="${fmt(hr)}" ry="${fmt(hr * 0.34)}" fill="${METAL_LIGHT}" stroke="#5B6266" stroke-width="0.9"/>
    <ellipse cx="${fmt(hopC[0])}" cy="${fmt(hopC[1] + 0.8)}" rx="${fmt(hr - 2.6)}" ry="${fmt(hr * 0.25)}" fill="#AFA692"/>
    <ellipse cx="${fmt(hopC[0] - 2)}" cy="${fmt(hopC[1] + 0.3)}" rx="${fmt(hr * 0.4)}" ry="${fmt(hr * 0.1)}" fill="#D8D1C1"/>
    <line x1="${fmt(hopC[0] - hr + 3)}" y1="${fmt(hopC[1] + 4)}" x2="${fmt(hopC[0] - hr + 3)}" y2="${fmt(hopC[1] + hopBodyH - 1)}" stroke="#FFFFFF" stroke-width="1.3" opacity="0.5"/>`;
  const hopOut = [hopC[0], hopC[1] + hopBodyH + coneH];
  const fluxDrop = project(tipX + 9, yTop - 8, seamZ);
  const fluxPipe = limb(hopOut, fluxDrop, 2.4 * S, 1.9 * S, { light: METAL_LIGHT });
  const hopBracket = limb(project(headX + 9 * S, boomY - 2, headZ - 2), [hopC[0] - hr + 1, hopC[1] + hopBodyH * 0.5], 1.8, 1.8, { light: METAL_MID, dark: GRAPHITE_DARK });

  // Flux recovery: suction nozzle on the mound tail → ribbed hose → canister
  // standing on the back of the tractor.
  const canX = headX + 20 * S;
  const canZ = carZ + 10 * S;
  const canBottom = project(canX, bodyY + 2, canZ);
  const canTop = project(canX, bodyY - 40 * S, canZ);
  const canister = `${cylinderV(canBottom, canTop, 10 * S, { light: METAL_LIGHT, mid: METAL_MID, dark: METAL_DARK })}
    <ellipse cx="${fmt(canTop[0])}" cy="${fmt(canTop[1])}" rx="${fmt(10 * S)}" ry="${fmt(3.6 * S)}" fill="#2E3838"/>`;
  const nozzle = project(nozzleX, yTop - 9, seamZ);
  const recoveryHose = cable(
    `M${fmt(nozzle[0])} ${fmt(nozzle[1])} C${fmt(nozzle[0] - 30)} ${fmt(nozzle[1] - 90)} ${fmt(canTop[0] - 70)} ${fmt(canTop[1] - 60)} ${fmt(canTop[0] - 3)} ${fmt(canTop[1] - 1)}`,
    5.2,
    { ribbed: true },
  );
  const nozzleShape = `<polygon points="${ptsStr([[nozzle[0] - 7, nozzle[1] + 7], [nozzle[0] + 7, nozzle[1] + 7], [nozzle[0] + 3.4, nozzle[1] - 3], [nozzle[0] - 3.4, nozzle[1] - 3]])}" fill="${RUBBER}"/>`;

  // Push handle across the top of the body.
  const hbZ = carZ + 13 * S;
  const handlePosts = [headX - 26 * S, headX + 8 * S].map((hx) => limb(project(hx, bodyTop, hbZ), project(hx, bodyTop - 9 * S, hbZ), 1.5, 1.5)).join("");
  const handleBar = limb(project(headX - 26 * S, bodyTop - 9 * S, hbZ), project(headX + 8 * S, bodyTop - 9 * S, hbZ), 2.2, 2.2, { light: "#3A4444", mid: RUBBER, dark: "#000" });

  // Control pendant on a short arm at the tractor's front-left.
  const penW = 22 * S;
  const penH = 30 * S;
  const penX = headX - 30 * S - penW - 10;
  const penZ = carZ - 4;
  const penBottom = bodyY + 2;
  const penArm = limb(project(headX - 30 * S, bodyY - 12 * S, carZ + 4), project(penX + penW - 2, bodyY - 12 * S, penZ + 4), 2, 2, { light: METAL_MID, dark: GRAPHITE_DARK });
  const pendant = box3d(project, { x: penX, yGround: penBottom, z: penZ, w: penW, h: penH, d: 8 }, STEEL_PALETTE);
  const pp = (u, v) => project(penX + u * S, penBottom - penH + v * S, penZ);
  const penFace = `${digitReadout(pp(3, 3)[0], pp(3, 3)[1], 16 * S, 7 * S, "440V", SPARK_AMBER)}
    ${knob(pp(7, 16)[0], pp(7, 16)[1], 3.6 * S, -0.7)}
    ${knob(pp(16, 16)[0], pp(16, 16)[1], 3.6 * S, -2)}
    <circle cx="${fmt(pp(6.5, 25)[0])}" cy="${fmt(pp(6.5, 25)[1])}" r="${fmt(2.2 * S)}" fill="${EDGE_TEAL}"/>
    <circle cx="${fmt(pp(15.5, 25)[0])}" cy="${fmt(pp(15.5, 25)[1])}" r="${fmt(2.2 * S)}" fill="#B42318" opacity="0.85"/>`;
  // Power/control cable trailing off the back of the tractor to the plate end.
  const pcA = project(headX - 30 * S, bodyY - 4, carZ + 14 * S);
  const pcB = project(x0 + 20, yTop - 1, d - 4);
  const powerCable = cable(`M${fmt(pcA[0])} ${fmt(pcA[1])} C${fmt(pcA[0] - 40)} ${fmt(pcA[1] + 6)} ${fmt(pcB[0] + 70)} ${fmt(pcB[1] - 4)} ${fmt(pcB[0])} ${fmt(pcB[1])}`, 2.8);

  const shadowL = x0;
  const shadowR = project(x0 + w, baseY, d)[0];
  const shadowCx = (shadowL + shadowR) / 2;
  const shadowRx = (shadowR - shadowL) * 0.55;
  const shadow = contactShadow(shadowCx, baseY + 10, shadowRx, 15, 0.4);

  const content = `${supports}${plate}${edgeSeam}${groove}${bead}${slag}${rail}${railClamps}${powerCable}${canister}${mast}${reel}${wire}${handlePosts}${handleBar}${drive}${tractorWheels}${body}${boom}${recoveryHose}${feedBox}${feedDetail}${mound}${moundGlow}${contactTube}${nozzleCollar}${hopBracket}${fluxPipe}${hopper}${nozzleShape}${penArm}${pendant}${penFace}`;
  const reflection = floorReflection(content, baseY + 6, 100, 0.14);

  const svg = `<g>${shadow}${reflection}${content}</g>`;
  const extra = [
    [reelC[0] - reelR - 5, reelC[1] - reelR - 5],
    [reelC[0] + reelR + 7, reelC[1] + reelR],
    [hopC[0] + hr, hopC[1] - hr * 0.4],
    [shadowCx - shadowRx, baseY + 10],
    [shadowCx + shadowRx, baseY + 10],
  ];
  const bbox = bboxOfPoints([...project.points, ...extra], 6);
  return {
    svg,
    bbox,
    tip: moundBase,
    detailCrop: cropAround(moundBase[0] - 10, moundBase[1] - 60, 240, 200),
    label: "SAW",
  };
}

// ---- lookups used by callers -----------------------------------------------

/** Family art for the five product-family slugs (data/categories.ts). Each
 * family's nameplate carries a family label, not a model number. */
const CATEGORY_MACHINES = {
  "fiber-laser-cutting-machines": (opts) => flatbedMachine("ra-f6020-hd", { label: "FIBER", ...opts }),
  "cnc-plasma-cutting-machines": (opts) => plasmaCutterMachine(opts),
  "mig-tig-arc-welding-machines": (opts) => arcWelderMachine(opts),
  "submerged-arc-welding-machines": (opts) => sawMachine(opts),
  "robotic-welding-systems": (opts) => robotCellMachine(2, { label: "ROBOT", ...opts }),
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_MACHINES);

export function machineForCategory(slug, opts = {}) {
  const build = CATEGORY_MACHINES[slug];
  if (!build) throw new Error(`machineForCategory: unknown family slug "${slug}"`);
  return build(opts);
}
