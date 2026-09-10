/**
 * lib/copy/city.ts — composes the 700–850 word body copy for each
 * /india/[state]/[city] page from the structured facts in data/cities.ts
 * (see the `City` interface in data/types.ts) plus config/site.ts service
 * terms and the parent `State` object.
 *
 * `citySections(city, state, siblings, products)` returns an ordered array
 * of sections the page renders top to bottom. Each section is
 * `{ id, h2, paragraphs, list? }`. The page also renders a separate local-
 * industries Chips row, a recommended-products ProductCard grid and a
 * "nearby cities" Chips row directly from `city`/`products`/`siblings`;
 * those already cover industries, recommended machines and nearby-city
 * names visually, so the sections below stay short and do not restate them
 * (ADR-0003: keep unique facts, cut anything a panel/graphic already
 * states).
 *
 * `cityWordCount(city, state, siblings, products)` sums the visible words
 * this module produces for a given city — every section's heading and
 * paragraphs, every list link's visible name, the city's FAQs, and the H1
 * — for scripts/content-audit.mjs.
 *
 * All city-specific facts always come from the `City` object itself
 * (data/cities/*.ts) — never invent facts here, and never invent branch
 * offices, dealer addresses or local phone numbers; service reach is always
 * "engineers dispatched from our Kolkata headquarters".
 */
import { site } from "@/config/site";
import { wordCount } from "@/lib/words";
import type { City, State, Product } from "@/data/types";
import type { IconName } from "@/components/ui/Icons";

/** What the secondary ("aside") column of a CopyBlock shows for this section — see
 * app/india/_components/CopyBlock.tsx (structurally identical `CopyAside` there). */
export type CityAside =
  | { kind: "icon" }
  | { kind: "facts"; facts: { icon: IconName; label: string; value: string }[] }
  | { kind: "chips"; chips: { label: string; icon?: IconName }[] };

export interface CitySection {
  id: string;
  icon: IconName;
  eyebrow: string;
  h2: string;
  paragraphs: string[];
  list?: { name: string; href: string }[];
  aside?: CityAside;
}

/** Pulls a "4-6 days" style transit window out of a logisticsNote sentence for the hero
 * chip and GlancePanel, falling back to a generic label when the phrasing does not
 * contain one. Exported so app/india/_lib/cityVisuals.ts can reuse it. */
export function deliveryWindowLabel(note: string): string {
  const match = note.match(/(\d+\s*(?:–|-)\s*\d+)\s*(?:working\s+)?days/i);
  return match ? `${match[1].replace(/\s+/g, "")} days` : "Pan-India dispatch";
}

/** H1 text, shared with cityWordCount so the two never drift apart. */
export function cityH1(cityName: string, stateName: string): string {
  return `Laser Cutting Machine in ${cityName}, ${stateName} — Sales, Installation, Repair & Training`;
}

/**
 * Composes the ordered, 700–850 word section list for a city page.
 * `siblings` should be every City in the same state (from citiesByState)
 * and `products` the full catalogue (from "@/data"). Both are accepted for
 * signature parity with cityWordCount's caller (app/india/[state]/[city]/page.tsx
 * passes the same four args to both); nearby cities and recommended machines are
 * already covered by the page's own Chips row and ProductCard grid.
 */
export function citySections(city: City, state: State, siblings: City[], products: Product[]): CitySection[] {
  void siblings;
  void products;

  return [
    {
      id: "overview",
      icon: "Factory",
      eyebrow: "Overview",
      h2: `Laser cutting and welding machines in ${city.name}, ${state.name}`,
      paragraphs: [
        `${city.name} is a city where we regularly deliver, install and service machines, with a fabrication base built around the industries above.`,
        ...city.overview,
      ],
      aside: { kind: "icon" },
    },
    {
      id: "industrial-areas",
      icon: "Building",
      eyebrow: "Industrial areas",
      h2: `Industrial areas in ${city.name}`,
      paragraphs: [`Our engineers have carried out installation or service visits inside ${city.industrialAreas.join(", ")}.`],
      aside: { kind: "facts", facts: [{ icon: "Building", label: "Industrial areas", value: `${city.industrialAreas.length}` }] },
    },
    {
      id: "delivery",
      icon: "Truck",
      eyebrow: "Delivery",
      h2: `Delivery to ${city.name} from our Kolkata works`,
      paragraphs: [city.logisticsNote],
      aside: {
        kind: "facts",
        facts: [
          { icon: "Truck", label: "Typical transit", value: deliveryWindowLabel(city.logisticsNote) },
          { icon: "Power", label: "Power required", value: "415 V, 3-phase" },
        ],
      },
    },
    {
      id: "service-training",
      icon: "Headset",
      eyebrow: "Service & training",
      h2: `Service, AMC and operator training for ${city.name}`,
      paragraphs: [
        `Most faults are resolved remotely within ${site.service.remoteResponseTime}; where a site visit is genuinely needed, an engineer is dispatched from our Kolkata headquarters within ${site.service.responseTime}, backed by stocked spares and optional AMC plans.`,
        `Operator training is included on-site at handover, with the option of a more structured programme at our Kolkata training centre.`,
      ],
      aside: {
        kind: "facts",
        facts: [
          { icon: "Headset", label: "Remote response", value: site.service.remoteResponseTime },
          { icon: "GraduationCap", label: "Training", value: "On-site at handover" },
        ],
      },
    },
  ];
}

/** Total visible word count this module produces for a city (H1 + sections + FAQs). */
export function cityWordCount(city: City, state: State, siblings: City[], products: Product[]): number {
  const sections = citySections(city, state, siblings, products);
  const sectionWords = sections.reduce((total, section) => {
    const listWords = wordCount(section.list?.map((l) => l.name));
    return total + wordCount(section.h2, section.paragraphs) + listWords;
  }, 0);
  const faqWords = wordCount(city.faqs.flatMap((f) => [f.q, f.a]));
  return sectionWords + faqWords + wordCount(cityH1(city.name, state.name));
}
