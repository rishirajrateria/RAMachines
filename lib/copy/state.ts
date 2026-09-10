/**
 * lib/copy/state.ts — composes the ≥ 900 word "in depth" prose column for each
 * /india/[state] page (ADR-0005 §6 anatomy) from the structured facts in
 * data/states.ts (see the `State` interface in data/types.ts) plus
 * config/site.ts service terms.
 *
 * `stateSections(state)` returns an ordered array of `{ id, h3, paragraphs }`
 * blocks rendered inside one `.prose-calm` column under a single page heading
 * (no per-section icon/eyebrow/aside — those belonged to the retired
 * CopyBlock layout). The page also renders a FactStrip, an "Industries"
 * DividedList, product tiles, delivery Steps and a city/nearby-city
 * DividedList directly from `state`/`products` (see
 * app/india/_lib/stateVisuals.ts); this prose never restates a fact already
 * shown in one of those (ADR-0005: a fact appears once).
 *
 * `stateWordCount(state)` sums the visible words this module produces for a
 * given state — every section heading and paragraph, the state's FAQs, and
 * the H1 — for scripts/content-audit.mjs.
 *
 * All state-specific facts always come from the `State` object itself
 * (data/states/*.ts) — never invent facts here, and never invent branch
 * offices, dealer addresses or local phone numbers; service reach is always
 * "engineers dispatched from our Kolkata headquarters".
 */
import { site } from "@/config/site";
import { wordCount } from "@/lib/words";
import type { State } from "@/data/types";

export interface StateSection {
  id: string;
  h3: string;
  paragraphs: string[];
}

/** Pulls a "4-6 days" style transit window out of a logisticsNote sentence for the
 * hero facts and FactStrip, falling back to a generic label when the phrasing does
 * not contain one (e.g. the small-UT notes that hedge instead of giving a fixed
 * range). Exported so app/india/_lib/stateVisuals.ts can reuse it. */
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

/**
 * States/UTs with genuine, named seaports, used for the export section.
 * States not listed here route export cargo via the nearest listed port or
 * via our Kolkata/Haldia base; states with no port get no export section
 * (ADR-0003: export note only where the state has a port).
 */
const statePorts: Record<string, string[]> = {
  "west-bengal": ["Kolkata Port", "Haldia Port"],
  gujarat: ["Mundra Port", "Kandla Port", "Pipavav Port"],
  maharashtra: ["Nhava Sheva (JNPT)", "Mumbai Port"],
  "tamil-nadu": ["Chennai Port", "V.O. Chidambaranar Port (Tuticorin)", "Kamarajar Port (Ennore)"],
  karnataka: ["New Mangalore Port"],
  kerala: ["Kochi Port"],
  "andhra-pradesh": ["Visakhapatnam Port", "Krishnapatnam Port", "Kakinada Port"],
  odisha: ["Paradip Port"],
  goa: ["Mormugao Port"],
  puducherry: ["Puducherry Port"],
  "andaman-and-nicobar-islands": ["Port Blair"],
};

/** H1 text, shared with stateWordCount so the two never drift apart. */
export function stateH1(name: string): string {
  return `Laser Cutting Machine in ${name} — Manufacturer, Supplier & Service`;
}

/**
 * Composes the ordered prose sections for a state page. Clusters, city names
 * and recommended-machine links already appear in the page's own DividedList
 * and product tiles, so this prose adds what those cannot: why each industry
 * matters here, the named industrial estates, the full delivery note and the
 * full service commitment.
 */
export function stateSections(state: State): StateSection[] {
  const ports = statePorts[state.slug];

  const sections: StateSection[] = [
    {
      id: "overview",
      h3: `Laser cutting and robotic welding in ${state.name}`,
      paragraphs: [
        `${state.name} is one of the states where RA Machine sees consistent, repeat demand for fiber laser cutting machines and robotic MIG/MAG welding systems, a pattern that tracks the depth of the state's own manufacturing base.`,
        ...state.overview,
      ],
    },
    {
      id: "industries",
      h3: `What ${state.name}'s manufacturers make`,
      paragraphs: state.industries.map(
        (industry) =>
          `${industry.name} units in ${state.name} typically produce ${joinList(industry.products)}. ${industry.note}`,
      ),
    },
    {
      id: "industrial-areas",
      h3: `Industrial areas and estates in ${state.name}`,
      paragraphs: [`We regularly deliver, install and service machines at units inside ${joinList(state.industrialAreas)}.`],
    },
    {
      id: "delivery",
      h3: `Delivery to ${state.name} from our Kolkata works`,
      paragraphs: [state.logisticsNote],
    },
    {
      id: "service-training",
      h3: `Service, AMC and training across ${state.name}`,
      paragraphs: [
        `Most faults are resolved remotely within ${site.service.remoteResponseTime}; where a site visit is genuinely needed, an engineer is dispatched from our Kolkata headquarters within ${site.service.responseTime} for metro and major industrial locations, backed by stocked spares and optional AMC plans.`,
        `Operator training is included with every installation, delivered on-site at handover, with refresher sessions and a dedicated Kolkata training centre available afterward.`,
      ],
    },
  ];

  if (ports) {
    sections.push({
      id: "export",
      h3: `Export support for ${state.name} manufacturers`,
      paragraphs: [
        `Export-ready shipments from ${state.name} typically move through ${joinList(ports)}, and as an IEC-registered exporter with CE-marked, ISO 9001:2015-certified machines, we handle export documentation for customers shipping their own fabricated output through the same gateways.`,
      ],
    });
  }

  return sections;
}

/** Total visible word count this module produces for a state (H1 + sections + FAQs). */
export function stateWordCount(state: State): number {
  const sections = stateSections(state);
  const sectionWords = sections.reduce((total, section) => total + wordCount(section.h3, section.paragraphs), 0);
  const faqWords = wordCount(state.faqs.flatMap((f) => [f.q, f.a]));
  return sectionWords + faqWords + wordCount(stateH1(state.name));
}

/** Real, named ports per state — exported so app/india/_lib/stateVisuals.ts (the
 * FactStrip/hero-facts data for the page template) can reuse the same source facts
 * instead of guessing them again. */
export { statePorts };
