/**
 * lib/copy/city.ts — composes the 700–900 word body copy for each
 * /india/[state]/[city] page from the structured facts in data/cities.ts
 * (see the `City` interface in data/types.ts) plus config/site.ts service
 * terms and the parent `State` object.
 *
 * `citySections(city, state, siblings, products)` returns an ordered array
 * of sections the page renders top to bottom. Each section is
 * `{ id, h2, paragraphs, list? }` — `list` is a set of internal links
 * (recommended machines, or nearby city pages). `siblings` should be every
 * other City in the same state (from citiesByState), used to resolve
 * `nearbyCitySlugs` into linkable names. The page also renders a separate
 * product LinkGrid grouped by category directly from `products`; that is
 * not part of the composed sections here.
 *
 * `cityWordCount(city, state, siblings, products)` sums the visible words
 * this module produces for a given city — every section's heading and
 * paragraphs, every list link's visible name, the city's FAQs, and the H1
 * — for scripts/content-audit.mjs.
 *
 * The generic connective sentence that opens each section varies by a
 * deterministic hash of `city.slug`, so the same city always reads the same
 * way across builds while different cities do not read as templated copy.
 * Every recurring connective sentence keeps at least 3 phrasing variants.
 * All city-specific facts always come from the `City` object itself
 * (data/cities/*.ts) — never invent facts here, and never invent branch
 * offices, dealer addresses or local phone numbers; service reach is always
 * "engineers dispatched from our Kolkata headquarters".
 */
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
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

/** Deterministic 32-bit hash of a slug, used to pick phrasing variants. */
function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (Math.imul(h, 31) + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Picks one option deterministically from `seed` plus a per-call `salt`. */
function pick<T>(options: readonly T[], seed: number, salt: number): T {
  return options[(seed + salt) % options.length];
}

/** Pulls a "4-6 days" style transit window out of a logisticsNote sentence for the hero
 * chip and GlancePanel, falling back to a generic label when the phrasing does not
 * contain one. Exported so app/india/_lib/cityVisuals.ts can reuse it. */
export function deliveryWindowLabel(note: string): string {
  const match = note.match(/(\d+\s*(?:–|-)\s*\d+)\s*(?:working\s+)?days/i);
  return match ? `${match[1].replace(/\s+/g, "")} days` : "Pan-India dispatch";
}

// ---------------------------------------------------------------------------
// Phrasing variants (≥3 each). Each is a function of the city/state so it
// still reads as a specific sentence, not filler.
// ---------------------------------------------------------------------------

const overviewIntroVariants = [
  (c: City) => `${c.name} is a city where we regularly deliver, install and service machines, with a fabrication base built around the industries below.`,
  (c: City) => `Our customers in ${c.name} come from a manufacturing base with a fairly specific character, shaped by the industries below.`,
  (c: City) => `${c.name}'s fabrication units give RA Machine a steady stream of enquiries rooted in the local industries below.`,
];

const industriesIntroVariants = [
  (c: City) => `Local fabricators in ${c.name} work mainly across ${c.industries.join(", ")}.`,
  (c: City) => `${c.name}'s manufacturing base is concentrated in ${c.industries.join(", ")}.`,
  (c: City) => `Units we work with in ${c.name} typically fall into ${c.industries.join(", ")}.`,
];

const recommendedIntroVariants = [
  (c: City) => `For this mix of work, our sales engineers most often recommend the machines below to ${c.name} buyers.`,
  (c: City) => `The models below are the ones we most commonly ship to ${c.name}, matched to the industries above.`,
  (c: City) => `Based on this industry mix, these are the machines we recommend to most ${c.name} enquiries.`,
];

const industrialAreasIntroVariants = [
  (c: City) => `Our engineers have carried out installation or service visits inside ${c.industrialAreas.join(", ")}.`,
  (c: City) => `Fabrication units we serve in ${c.name} are commonly based in ${c.industrialAreas.join(", ")}.`,
  (c: City) => `${c.industrialAreas.join(", ")} account for most of the ${c.name} addresses we deliver and service at.`,
];

const deliveryIntroVariants = [
  (c: City) =>
    `Machines for ${c.name} dispatch from our Kolkata works and follow the same structured installation process we use everywhere in India.`,
  (c: City) =>
    `Delivery to ${c.name} starts at our Kolkata facility, with installation carried out to a standard process regardless of destination.`,
  (c: City) =>
    `We run the same delivery and installation process for ${c.name} as for every other city we serve, starting with dispatch from Kolkata.`,
];

const deliveryBodyVariants = [
  () =>
    `A short site survey checklist — floor loading, access, crane or forklift availability and available power — is confirmed with you ahead of dispatch. On arrival, our engineer checks the foundation and your 415 V three-phase power supply, installs and levels the machine, runs calibration and test cuts on your own material, and completes a formal handover once cut quality is confirmed.`,
  () =>
    `We first confirm a site survey checklist covering access, floor loading and available power, so the machine arrives to a site that is genuinely ready. Our engineer then verifies the foundation and 415 V three-phase supply, installs and levels the machine, runs test cuts on your material, and hands over once you are satisfied with cut quality.`,
  () =>
    `Ahead of dispatch we agree a site survey checklist with you — access, floor loading and power supply — so nothing is discovered on installation day. Our engineer checks the foundation and 415 V three-phase supply on arrival, completes installation, levelling and calibration, runs test cuts, and formally hands the machine over to your team.`,
];

const serviceTrainingIntroVariants = [
  (c: City) =>
    `RA Machine does not run a branch office in ${c.name}; support is delivered through remote diagnostics and engineers dispatched from our Kolkata headquarters, with operator training built into every installation.`,
  (c: City) =>
    `We do not maintain a local office in ${c.name} — service reaches you through remote diagnostics and engineers travelling from Kolkata headquarters, and training is included with every machine, not sold separately.`,
  (c: City) =>
    `Support for ${c.name} customers combines remote diagnostics with engineers dispatched from our Kolkata headquarters as needed, and operator training is part of every installation rather than an optional extra.`,
];

const serviceTrainingBodyVariants = [
  () =>
    `Most faults are diagnosed and resolved remotely, typically within ${site.service.remoteResponseTime}; where a site visit is needed, our standard commitment is engineer dispatch within ${site.service.responseTime} for metro and major industrial locations, backed by stocked spares and optional Annual Maintenance Contracts. Operator training is delivered on-site at handover, covering safe operation, nesting or programming software and routine maintenance, with our Kolkata training centre available for teams wanting a more structured session.`,
  () =>
    `Remote diagnostics resolve most issues within ${site.service.remoteResponseTime}, and on-site visits — when genuinely required — are dispatched from Kolkata headquarters, typically within ${site.service.responseTime} for metro and major industrial destinations, with an AMC available for scheduled preventive cover. Training happens on-site during commissioning as standard, and operators can also attend our Kolkata training centre for a more in-depth programme.`,
  () =>
    `Our support desk handles most faults remotely within ${site.service.remoteResponseTime}, escalating to an engineer dispatched from Kolkata, typically within ${site.service.responseTime}, only when hands-on attention is genuinely needed; an Annual Maintenance Contract keeps preventive checks on schedule if you want one. Every installation includes on-site operator training, with the option of a deeper programme at our Kolkata training centre.`,
];

const whyIndiaVariants = [
  (c: City) =>
    `${c.name} buyers comparing an Indian-built machine against an imported one usually find the case settles once service and spares are weighed alongside price: RA Machine designs, builds and services every unit from our own Kolkata facility, and our ISO 9001:2015 certification, CE marking, Indian Railways vendor listing and IEC export registration are independently verifiable.`,
  (c: City) =>
    `For manufacturers in ${c.name}, an Indian-built machine typically wins on total cost of ownership once service and spares are counted, not just sticker price: we build every unit ourselves at our Kolkata facility, and hold ISO 9001:2015 certification, CE marking, Indian Railways vendor status and IEC export registration that any buyer can verify.`,
  (c: City) =>
    `${c.name} customers who weigh an imported machine against an Indian one generally settle on the latter once service and spares availability are factored in: RA Machine designs, fabricates and supports every unit from our own Kolkata facility, backed by ISO 9001:2015 certification, CE marking, Indian Railways vendor listing and IEC export registration.`,
];

const nearbyIntroVariants = [
  (c: City) => `We also serve fabricators in cities near ${c.name}, with a dedicated page for each.`,
  (c: City) => `Beyond ${c.name} itself, we cover several nearby cities in the same state, each with its own dedicated page.`,
  (c: City) => `${c.name} is one of several cities we cover closely in this state; nearby cities with their own pages include:`,
];

/** Product lookup used to resolve `recommendedProductSlugs`. */
function productLinks(slugs: string[], products: Product[]): { name: string; href: string }[] {
  const seen = new Set<string>();
  const links: { name: string; href: string }[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    const product = products.find((p) => p.slug === slug);
    if (!product) continue;
    seen.add(slug);
    links.push({ name: product.name, href: paths.product(product.category, product.slug) });
  }
  return links;
}

/** Nearby-city lookup used to resolve `nearbyCitySlugs` into linkable names. */
function nearbyLinks(city: City, siblings: City[]): { name: string; href: string }[] {
  const seen = new Set<string>();
  const links: { name: string; href: string }[] = [];
  for (const slug of city.nearbyCitySlugs) {
    if (seen.has(slug)) continue;
    const sibling = siblings.find((s) => s.slug === slug);
    if (!sibling) continue;
    seen.add(slug);
    links.push({ name: sibling.name, href: paths.city(sibling.stateSlug, sibling.slug) });
  }
  return links;
}

/** H1 text, shared with cityWordCount so the two never drift apart. */
export function cityH1(cityName: string, stateName: string): string {
  return `Laser Cutting Machine in ${cityName}, ${stateName} — Sales, Installation, Repair & Training`;
}

/**
 * Composes the ordered, 700–900 word section list for a city page.
 * `siblings` should be every City in the same state (from citiesByState)
 * and `products` the full catalogue (from "@/data").
 */
export function citySections(city: City, state: State, siblings: City[], products: Product[]): CitySection[] {
  const seed = hashSlug(city.slug);

  return [
    {
      id: "overview",
      icon: "Factory",
      eyebrow: "Overview",
      h2: `Laser cutting and welding machines in ${city.name}, ${state.name}`,
      paragraphs: [pick(overviewIntroVariants, seed, 1)(city), ...city.overview],
      aside: { kind: "icon" },
    },
    {
      id: "industries",
      icon: "Gear",
      eyebrow: "Industries",
      h2: `Industries we serve in ${city.name}`,
      paragraphs: [pick(industriesIntroVariants, seed, 2)(city), pick(recommendedIntroVariants, seed, 20)(city)],
      list: productLinks(city.recommendedProductSlugs, products),
      aside: { kind: "chips", chips: city.industries.map((name) => ({ label: name, icon: "Gear" as IconName })) },
    },
    {
      id: "industrial-areas",
      icon: "Building",
      eyebrow: "Industrial areas",
      h2: `Industrial areas in ${city.name}`,
      paragraphs: [pick(industrialAreasIntroVariants, seed, 3)(city)],
      aside: { kind: "facts", facts: [{ icon: "Building", label: "Industrial areas", value: `${city.industrialAreas.length}` }] },
    },
    {
      id: "delivery",
      icon: "Truck",
      eyebrow: "Delivery",
      h2: `Delivery and installation from our Kolkata works`,
      paragraphs: [pick(deliveryIntroVariants, seed, 4)(city), pick(deliveryBodyVariants, seed, 40)(), city.logisticsNote],
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
      paragraphs: [pick(serviceTrainingIntroVariants, seed, 5)(city), pick(serviceTrainingBodyVariants, seed, 50)()],
      aside: {
        kind: "facts",
        facts: [
          { icon: "Headset", label: "Remote response", value: site.service.remoteResponseTime },
          { icon: "GraduationCap", label: "Training", value: "On-site at handover" },
        ],
      },
    },
    {
      id: "why-india",
      icon: "Award",
      eyebrow: "Why RA Machine",
      h2: "Why buy from an Indian manufacturer",
      paragraphs: [pick(whyIndiaVariants, seed, 6)(city)],
      aside: {
        kind: "chips",
        chips: [
          { label: "ISO 9001:2015", icon: "Certificate" },
          { label: "CE marked", icon: "Badge" },
          { label: "Indian Railways vendor", icon: "Award" },
        ],
      },
    },
    {
      id: "nearby",
      icon: "MapPin",
      eyebrow: "Nearby",
      h2: `Also serving nearby ${state.name} cities`,
      paragraphs: [pick(nearbyIntroVariants, seed, 7)(city)],
      list: nearbyLinks(city, siblings),
      aside: { kind: "icon" },
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
