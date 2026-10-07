/**
 * data/guides/index.ts — the buyer guides (/guides), one file per guide.
 *
 * To add a guide: create data/guides/<slug>.ts exporting `guide: Guide`
 * (data/types.ts), import it below and add it to `guides` in the order it
 * should be listed. The guide page, sitemap, llms.txt and the "Buyer guides"
 * lists on machine-family pages all read from here.
 */
import type { CategorySlug, Guide } from "../types";
import { guide as laserVsPlasma } from "./laser-vs-plasma-cutting";
import { guide as fiberLaserPower } from "./fiber-laser-power-guide";
import { guide as plasmaCutter } from "./cnc-plasma-cutter-guide";
import { guide as migTigMma } from "./mig-vs-tig-vs-mma-welding";
import { guide as saw } from "./submerged-arc-welding-guide";
import { guide as cobotVsRobot } from "./cobot-vs-robot-welding";
import { guide as voltage } from "./welding-machine-220v-vs-440v";
import { guide as importing } from "./importing-cnc-machines-from-india";
import { guide as factoryPrep } from "./preparing-factory-for-cnc-machine";
import { guide as checklist } from "./cnc-machine-buying-checklist";

export const guides: Guide[] = [
  laserVsPlasma,
  fiberLaserPower,
  plasmaCutter,
  migTigMma,
  saw,
  cobotVsRobot,
  voltage,
  checklist,
  factoryPrep,
  importing,
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** Guides that lead to a given machine family, for its "Buyer guides" list. */
export function guidesForFamily(slug: CategorySlug): Guide[] {
  return guides.filter((g) => g.families.includes(slug));
}

/** Word count of a guide's visible body (summary, sections, FAQs). */
export function guideWords(g: Guide): number {
  const text = [g.summary, ...g.sections.flatMap((s) => [s.h2, ...s.paragraphs, ...(s.bullets ?? [])]), ...g.faqs.flatMap((f) => [f.q, f.a])].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
