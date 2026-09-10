/**
 * scripts/illustrations/og.mjs — og-fallback.png: the social-preview card.
 * ADR-0005 §7: light forms + wordmark + title, no gradient text, no dark panel —
 * mirrors lib/og.tsx's dynamic per-page renderer so every OG card reads as the
 * same calm family, with a faint line-art gantry echo on the right, like the hero.
 */
import { INK, ambientLight, scene, escapeXml } from "./common.mjs";
import { flatbedMachine, BOX_W, GROUND_Y } from "./machines.mjs";

export function ogFallbackSvg(width, height) {
  const { defs, content: orbs } = ambientLight(width, height);

  const machine = flatbedMachine("ra-f1530");
  const scale = (height / 630) * 0.85;
  const glyphTx = width * 0.72 - (BOX_W * scale) / 2;
  const glyphTy = height * 0.86 - GROUND_Y * scale;

  const content = `
    <rect width="${width}" height="${height}" fill="#F6F8F9"/>
    ${orbs}
    <g transform="translate(${glyphTx.toFixed(1)} ${glyphTy.toFixed(1)}) scale(${scale.toFixed(3)})" opacity="0.18">
      ${machine.svg}
    </g>
    <text x="80" y="300" font-family="Arial, sans-serif" font-size="60" font-weight="700" fill="${INK}">RA Machine</text>
    <text x="80" y="352" font-family="Arial, sans-serif" font-size="24" fill="#5B5F68">${escapeXml("Laser Cutting Machines Built in India,")}</text>
    <text x="80" y="386" font-family="Arial, sans-serif" font-size="24" fill="#5B5F68">${escapeXml("Trusted Worldwide")}</text>
    <text x="80" y="560" font-family="Arial, sans-serif" font-size="18" fill="#7A7E87">ramachine.com · Kolkata, India · Exporting worldwide</text>
  `;
  return scene({ width, height, defs, content });
}
