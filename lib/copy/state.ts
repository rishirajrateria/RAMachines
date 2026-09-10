/**
 * lib/copy/state.ts — composes the 950–1,200 word body copy for each
 * /india/[state] page from the structured facts in data/states.ts (see the
 * `State` interface in data/types.ts) plus config/site.ts service terms.
 *
 * `stateSections(state, cities, products)` returns an ordered array of
 * sections the page renders top to bottom. Each section is
 * `{ id, h2, paragraphs, list? }`. The page also renders a separate
 * city-list LinkGrid, an industries FeatureGrid and a product grid directly
 * from `cities`/`state`/`products`; those already cover industries, city
 * names and recommended machines visually, so the sections below stay short
 * and do not restate them (ADR-0003: keep unique facts, cut anything a
 * panel/graphic already states).
 *
 * `stateWordCount(state, cities, products)` sums the visible words this
 * module produces for a given state — every section's heading and
 * paragraphs, every list link's visible name, the state's FAQs, and the H1
 * — for scripts/content-audit.mjs.
 *
 * All state-specific facts always come from the `State` object itself
 * (data/states/*.ts) — never invent facts here, and never invent branch
 * offices, dealer addresses or local phone numbers; service reach is always
 * "engineers dispatched from our Kolkata headquarters".
 */
import { site } from "@/config/site";
import { wordCount } from "@/lib/words";
import type { State, City, Product } from "@/data/types";
import type { IconName } from "@/components/ui/Icons";

/** What the secondary ("aside") column of a CopyBlock shows for this section — see
 * app/india/_components/CopyBlock.tsx (structurally identical `CopyAside` there). */
export type StateAside =
  | { kind: "icon" }
  | { kind: "facts"; facts: { icon: IconName; label: string; value: string }[] }
  | { kind: "chips"; chips: { label: string; icon?: IconName }[] };

export interface StateSection {
  id: string;
  icon: IconName;
  eyebrow: string;
  h2: string;
  paragraphs: string[];
  list?: { name: string; href: string }[];
  aside?: StateAside;
}

/** Pulls a "4-6 days" style transit window out of a logisticsNote sentence for the hero
 * chip and GlancePanel, falling back to a generic label when the phrasing does not
 * contain one (e.g. the small-UT notes that hedge instead of giving a fixed range). */
function deliveryWindowLabel(note: string): string {
  const match = note.match(/(\d+\s*(?:–|-)\s*\d+)\s*(?:working\s+)?days/i);
  return match ? `${match[1].replace(/\s+/g, "")} days` : "Pan-India dispatch";
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
 * Composes the ordered, 950–1,200 word section list for a state page.
 * `cities` should be the cities belonging to this state (from
 * citiesByState) and `products` the full catalogue (from "@/data").
 */
export function stateSections(state: State, _cities: City[], _products: Product[]): StateSection[] {
  // `cities` and `products` are accepted for signature parity with stateWordCount's
  // caller (app/india/[state]/page.tsx passes the same three args to both) — the
  // sections below no longer link out to products or mention city names directly,
  // since the page's own city-chip grid and product grid already cover those.
  const topClusters = Array.from(new Set(state.industries.flatMap((i) => i.clusters))).slice(0, 2);
  const industrialAreaCount = state.industrialAreas.length;
  const deliveryWindow = deliveryWindowLabel(state.logisticsNote);
  const ports = statePorts[state.slug];

  const sections: StateSection[] = [
    {
      id: "overview",
      icon: "Factory",
      eyebrow: "Overview",
      h2: `Laser cutting machines and robotic welding in ${state.name}`,
      paragraphs: [
        `${state.name} is one of the states where RA Machine sees consistent, repeat demand for fiber laser cutting machines and robotic MIG/MAG welding systems, a pattern that tracks the depth of the state's own manufacturing base.`,
        ...state.overview,
      ],
      aside: { kind: "icon" },
    },
    {
      id: "industries",
      icon: "Gear",
      eyebrow: "Industries",
      h2: `Key manufacturing industries in ${state.name}`,
      paragraphs: [
        topClusters.length
          ? `The cards above pair each industry with the machine we recommend for it; the busiest clusters are ${topClusters.join(" and ")}.`
          : `The cards above pair each industry with the machine we recommend for it.`,
      ],
      aside: { kind: "facts", facts: [{ icon: "Gear", label: "Industries covered", value: `${state.industries.length}` }] },
    },
    {
      id: "industrial-areas",
      icon: "Building",
      eyebrow: "Industrial areas",
      h2: `Industrial areas and estates in ${state.name}`,
      paragraphs: [`We regularly deliver, install and service machines at units inside ${state.industrialAreas.join(", ")}.`],
      aside: { kind: "facts", facts: [{ icon: "Building", label: "Estates & SEZs", value: `${industrialAreaCount}` }] },
    },
    {
      id: "delivery",
      icon: "Truck",
      eyebrow: "Delivery",
      h2: `Delivery to ${state.name} from our Kolkata works`,
      paragraphs: [state.logisticsNote],
      aside: {
        kind: "facts",
        facts: [
          { icon: "Truck", label: "Typical transit", value: deliveryWindow },
          { icon: "Power", label: "Power required", value: "415 V, 3-phase" },
        ],
      },
    },
    {
      id: "service-training",
      icon: "Headset",
      eyebrow: "Service & training",
      h2: `Service, AMC and training across ${state.name}`,
      paragraphs: [
        `Most faults are resolved remotely within ${site.service.remoteResponseTime}; where a site visit is genuinely needed, an engineer is dispatched from our Kolkata headquarters within ${site.service.responseTime} for metro and major industrial locations, backed by stocked spares and optional AMC plans.`,
        `Operator training is included with every installation, delivered on-site at handover, with refresher sessions and a dedicated Kolkata training centre available afterward.`,
      ],
      aside: {
        kind: "facts",
        facts: [
          { icon: "Headset", label: "Remote response", value: site.service.remoteResponseTime },
          { icon: "Clock", label: "On-site response", value: site.service.responseTime },
          { icon: "GraduationCap", label: "Training", value: "Included at handover" },
        ],
      },
    },
  ];

  if (ports) {
    sections.push({
      id: "export",
      icon: "Ship",
      eyebrow: "Export",
      h2: `Export support for ${state.name} manufacturers`,
      paragraphs: [
        `Export-ready shipments from ${state.name} typically move through ${ports.join(", ")}, and as an IEC-registered exporter with CE-marked, ISO 9001:2015-certified machines, we handle export documentation for customers shipping their own fabricated output through the same gateways.`,
      ],
      aside: { kind: "chips", chips: ports.map((port) => ({ label: port, icon: "Ship" as IconName })) },
    });
  }

  return sections;
}

/** Total visible word count this module produces for a state (H1 + sections + FAQs). */
export function stateWordCount(state: State, cities: City[], products: Product[]): number {
  const sections = stateSections(state, cities, products);
  const sectionWords = sections.reduce((total, section) => {
    const listWords = wordCount(section.list?.map((l) => l.name));
    return total + wordCount(section.h2, section.paragraphs) + listWords;
  }, 0);
  const faqWords = wordCount(state.faqs.flatMap((f) => [f.q, f.a]));
  return sectionWords + faqWords + wordCount(stateH1(state.name));
}

/** Real, named ports per state — exported so app/india/_lib/stateVisuals.ts (the
 * GlancePanel/hero-chip data for the page template) can reuse the same source facts
 * instead of guessing them again. */
export { statePorts };

/** Pulls a "4-6 days" style transit window out of a logisticsNote sentence — exported
 * for the same reason as `statePorts` above. */
export { deliveryWindowLabel };
