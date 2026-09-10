/**
 * scripts/illustrations/hero.mjs — the dark hero/OG illustration: a full flatbed
 * fiber laser cutting a sheet, dramatic spark burst + glow, on a dark ink band
 * with a soft radial steel glow and a faint perspective grid. The left ~45% of
 * the hero canvas is kept calm (no machine geometry) so the page's H1 can sit
 * over it — see ADR-0002.
 */
import { INK, STEEL, STEEL_LIGHT, SPARK, SPARK_LIGHT, WHITE, sparkBurst, sparkChips, perspectiveGrid, scene } from "./common.mjs";
import { flatbedMachine, withOverlay, BOX_W, GROUND_Y } from "./machines.mjs";

function heroDefs() {
  return `<defs>
    <radialGradient id="heroGlow" cx="72%" cy="54%" r="70%">
      <stop offset="0%" stop-color="${STEEL_LIGHT}" stop-opacity="0.4"/>
      <stop offset="55%" stop-color="${STEEL}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="heroSparkGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${SPARK_LIGHT}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${SPARK}" stop-opacity="0"/>
    </radialGradient>
  </defs>`;
}

export function heroPosterSvg(width, height) {
  const scale = (height / 1080) * 2.2;
  const groundRatio = 0.83;
  const offsetX = width * 0.212;
  const tx = (width - BOX_W * scale) / 2 + offsetX;
  const ty = height * groundRatio - GROUND_Y * scale;

  const machine = flatbedMachine("ra-f6020-hd");
  const machineContent = withOverlay(machine, { withSpark: true, withChips: true });
  const [sx, sy] = machine.sparkPoint;
  const spx = tx + sx * scale;
  const spy = ty + sy * scale;

  const grid = perspectiveGrid(width, height, height * 0.38, STEEL_LIGHT, 0.1, width * 0.66);
  const bigGlow = `<circle cx="${spx.toFixed(0)}" cy="${spy.toFixed(0)}" r="${(height * 0.5).toFixed(0)}" fill="url(#heroSparkGlow)"/>`;
  const extraChips = sparkChips(spx, spy, 10, height * 0.16, 7);

  const content = `${heroDefs()}
    <rect width="${width}" height="${height}" fill="url(#heroGlow)"/>
    ${grid}
    ${bigGlow}
    <g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale})">${machineContent}</g>
    ${extraChips}
    <text x="${width - 48}" y="${height - 44}" text-anchor="end" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.014)}" font-weight="700" fill="${WHITE}" opacity="0.55">RA MACHINE</text>
  `;
  return scene({ width, height, bg: INK, content });
}
