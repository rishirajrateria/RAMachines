/**
 * scripts/illustrations/og.mjs — og-fallback.png: the social-preview card. Mirrors
 * the hero's look (dark ink panel, soft steel glow, spark-lit cutting head) at a
 * smaller scale next to the wordmark, per ADR-0002 ("og-fallback matches the hero").
 */
import { INK, STEEL, STEEL_LIGHT, SPARK, SPARK_LIGHT, WHITE, sparkBurst, sparkChips, scene, escapeXml } from "./common.mjs";
import { flatbedMachine, withOverlay, BOX_W, GROUND_Y } from "./machines.mjs";

export function ogFallbackSvg(width, height) {
  const panelX = width * 0.58;
  const panelW = width - panelX;

  const machine = flatbedMachine("ra-f1530");
  const machineContent = withOverlay(machine, { withSpark: true, withChips: true });

  const scale = (height / 630) * 1.15;
  const groundRatio = 0.88;
  const leftMostLocalX = 155;
  const tx = panelX + 18 - leftMostLocalX * scale;
  const ty = height * groundRatio - GROUND_Y * scale;
  const [sx, sy] = machine.sparkPoint;
  const spx = tx + sx * scale;
  const spy = ty + sy * scale;

  const defs = `<defs>
    <radialGradient id="ogGlow" cx="60%" cy="55%" r="75%">
      <stop offset="0%" stop-color="${STEEL_LIGHT}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ogSparkGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${SPARK_LIGHT}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${SPARK}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="ogPanelClip"><rect x="${panelX}" y="0" width="${panelW}" height="${height}"/></clipPath>
  </defs>`;

  const panel = `<g clip-path="url(#ogPanelClip)">
    <rect x="${panelX}" y="0" width="${panelW}" height="${height}" fill="${INK}"/>
    <rect x="${panelX}" y="0" width="${panelW}" height="${height}" fill="url(#ogGlow)"/>
    <circle cx="${spx.toFixed(0)}" cy="${spy.toFixed(0)}" r="${(height * 0.55).toFixed(0)}" fill="url(#ogSparkGlow)"/>
    <g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${scale})">${machineContent}</g>
  </g>`;

  const content = `${defs}
    <rect x="${panelX - 4}" y="80" width="4" height="${height - 160}" fill="${SPARK}"/>
    <line x1="80" y1="80" x2="144" y2="80" stroke="${SPARK}" stroke-width="4"/>
    <text x="80" y="330" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="${INK}">RA Machine</text>
    <text x="80" y="380" font-family="Arial, sans-serif" font-size="25" fill="#5B5F68">${escapeXml("Laser Cutting Machines Built in India,")}</text>
    <text x="80" y="416" font-family="Arial, sans-serif" font-size="25" fill="#5B5F68">${escapeXml("Trusted Worldwide")}</text>
    <text x="80" y="560" font-family="Arial, sans-serif" font-size="20" fill="#7A7E87">ramachine.com · Kolkata, India · Exporting worldwide</text>
    ${panel}
  `;
  return scene({ width, height, bg: WHITE, content });
}
