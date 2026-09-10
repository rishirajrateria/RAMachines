/**
 * lib/copy/city.ts — composes the ≥ 700 word "in depth" prose column for each
 * /india/[state]/[city] page (ADR-0005 §6 anatomy) from the structured facts
 * in data/cities.ts (see the `City` interface in data/types.ts) plus
 * config/site.ts service terms and the parent `State` object.
 *
 * `citySections(city, state)` returns an ordered array of `{ id, h3,
 * paragraphs }` blocks rendered inside one `.prose-calm` column under a
 * single page heading (no per-section icon/eyebrow/aside — those belonged to
 * the retired CopyBlock layout). The page also renders a FactStrip, an
 * industries DividedList, recommended product tiles and a nearby-cities
 * DividedList directly from `city`/`products` (see
 * app/india/_lib/cityVisuals.ts); this prose never restates a fact already
 * shown in one of those (ADR-0005: a fact appears once).
 *
 * `cityWordCount(city, state)` sums the visible words this module produces
 * for a given city — every section heading and paragraph, the city's FAQs,
 * and the H1 — for scripts/content-audit.mjs.
 *
 * All city-specific facts always come from the `City` object itself
 * (data/cities/*.ts) — never invent facts here, and never invent branch
 * offices, dealer addresses or local phone numbers; service reach is always
 * "engineers dispatched from our Kolkata headquarters".
 */
import { site } from "@/config/site";
import { wordCount } from "@/lib/words";
import type { City, State } from "@/data/types";

export interface CitySection {
  id: string;
  h3: string;
  paragraphs: string[];
}

/** Pulls a "4-6 days" style transit window out of a logisticsNote sentence for the
 * hero facts and FactStrip, falling back to a generic label when the phrasing does
 * not contain one. Exported so app/india/_lib/cityVisuals.ts can reuse it. */
export function deliveryWindowLabel(note: string): string {
  const match = note.match(/(\d+\s*(?:–|-)\s*\d+)\s*(?:working\s+)?days/i);
  return match ? `${match[1].replace(/\s+/g, "")} days` : "Pan-India dispatch";
}

/** Joins a short list as calm prose: "a", "a and b", "a, b and c". */
function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** H1 text, shared with cityWordCount so the two never drift apart. */
export function cityH1(cityName: string, stateName: string): string {
  return `Laser Cutting Machine in ${cityName}, ${stateName} — Sales, Installation, Repair & Training`;
}

/**
 * Composes the ordered prose sections for a city page. Industry names,
 * recommended machines and nearby cities already appear in the page's own
 * DividedLists and product tiles, so this prose adds what those cannot: the
 * named industrial areas, the full delivery note and the full service
 * commitment.
 */
export function citySections(city: City, state: State): CitySection[] {
  return [
    {
      id: "overview",
      h3: `Laser cutting and welding machines in ${city.name}, ${state.name}`,
      paragraphs: [
        `${city.name} is a city where we regularly deliver, install and service machines, with a fabrication base built around the industries above.`,
        ...city.overview,
      ],
    },
    {
      id: "industrial-areas",
      h3: `Industrial areas in ${city.name}`,
      paragraphs: [`Our engineers have carried out installation or service visits inside ${joinList(city.industrialAreas)}.`],
    },
    {
      id: "delivery",
      h3: `Delivery to ${city.name} from our Kolkata works`,
      paragraphs: [city.logisticsNote],
    },
    {
      id: "service-training",
      h3: `Service, AMC and operator training for ${city.name}`,
      paragraphs: [
        `Most faults are resolved remotely within ${site.service.remoteResponseTime}; where a site visit is genuinely needed, an engineer is dispatched from our Kolkata headquarters within ${site.service.responseTime}, backed by stocked spares and optional AMC plans.`,
        `Operator training is included on-site at handover, with the option of a more structured programme at our Kolkata training centre.`,
      ],
    },
  ];
}

/** Total visible word count this module produces for a city (H1 + sections + FAQs). */
export function cityWordCount(city: City, state: State): number {
  const sections = citySections(city, state);
  const sectionWords = sections.reduce((total, section) => total + wordCount(section.h3, section.paragraphs), 0);
  const faqWords = wordCount(city.faqs.flatMap((f) => [f.q, f.a]));
  return sectionWords + faqWords + wordCount(cityH1(city.name, state.name));
}
