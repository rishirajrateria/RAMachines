/**
 * scripts/illustrations/hero.mjs — ADR-0005 §7: the hero poster is light forms
 * only (no machine drawing front-and-centre) with a faint line-art gantry glyph
 * on the right third. Same soft teal/aqua/white ambient composition as
 * components/layout/AmbientLight.tsx, rendered once into a static raster so it
 * still reads correctly as the hero <video>'s poster frame before any client JS
 * runs.
 */
import { ambientLight, scene } from "./common.mjs";
import { flatbedMachine, BOX_W, GROUND_Y } from "./machines.mjs";

export function heroPosterSvg(width, height) {
  const { defs, content: orbs } = ambientLight(width, height);

  const machine = flatbedMachine("ra-f6020-hd");
  const scale = (height / 1080) * 1.55;
  const groundRatio = 0.8;
  // Position the glyph inside the right third of the canvas.
  const glyphTx = width * 0.66 - (BOX_W * scale) / 2;
  const glyphTy = height * groundRatio - GROUND_Y * scale;

  const content = `
    <rect width="${width}" height="${height}" fill="#F6F8F9"/>
    ${orbs}
    <g transform="translate(${glyphTx.toFixed(1)} ${glyphTy.toFixed(1)}) scale(${scale.toFixed(3)})" opacity="0.16">
      ${machine.svg}
    </g>
  `;
  return scene({ width, height, defs, content });
}
