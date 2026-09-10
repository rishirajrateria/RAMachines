/**
 * lib/copy/country.ts — composes the 1,200–1,600 word body copy for each
 * /export/[country] page from the structured facts in data/countries/*.ts
 * (see data/types.ts `Country`) plus config/site.ts service terms.
 *
 * `countrySections(country, products)` returns an ordered array of sections
 * the page renders top to bottom. Each section is `{ id, h2, paragraphs,
 * list?, table?, ordered? }` — `ordered: true` tells the page to render
 * `paragraphs` as an <ol> (used for the export-process step list) instead of
 * separate <p> tags; `list` is a set of internal links (recommended
 * machines); `table` is label/value facts rendered with <SpecTable>.
 *
 * `countryWordCount(country, products)` sums the visible words this module
 * produces for a given country, used by scripts/content-audit.mjs.
 *
 * Phrasing varies by section using a deterministic hash of `country.slug` so
 * the same country always reads the same way across builds, but different
 * countries do not read as templated copy. To add another phrasing variant,
 * append to the relevant `*Variants` array below — each array must keep at
 * least 3 entries. Do not add per-country special cases here; put anything
 * country-specific in the `Country` object itself (data/countries/*.ts).
 */
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import { wordCount } from "@/lib/words";
import type { Country, Product } from "@/data/types";

export interface CountrySection {
  id: string;
  h2: string;
  paragraphs: string[];
  list?: { name: string; href: string }[];
  table?: { label: string; value: string }[];
  ordered?: boolean;
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

// ---------------------------------------------------------------------------
// Phrasing variants (≥3 each), as functions of the country/products so every
// variant still reads as a specific, factual sentence rather than filler.
// ---------------------------------------------------------------------------

const demandIntroVariants = [
  (c: Country) =>
    `${c.name} is one of the markets we track closely for fiber laser cutting and robotic MIG/MAG welding equipment, and enquiry volume here reflects both the pace of local manufacturing growth and buyers actively looking beyond China for their next machine.`,
  (c: Country) =>
    `Import demand for fiber laser cutting and robotic welding machines in ${c.name} has grown alongside the expansion of local manufacturing, and RA Machine ships regularly to ${c.adjective} fabricators sourcing equipment outside China.`,
  (c: Country) =>
    `We work with fabricators across ${c.name} who are adding fiber laser cutting and robotic welding capacity, and the pattern of enquiries we receive points to steady, broad-based import demand rather than a single dominant segment.`,
];

const whyIndiaIntroVariants = [
  (c: Country) =>
    `Buyers in ${c.name} weighing India against China generally cite the same core reasons: consistent build quality backed by CE marking and ISO 9001:2015 certification, English-language technical support, and pricing that sits below premium European and Japanese brands. For this market specifically:`,
  (c: Country) =>
    `India has become a credible alternative to China for ${c.name}'s laser cutting and welding equipment buyers, on the strength of CE and ISO-documented quality, English-speaking engineering support and a lower landed cost than premium Western brands. In this market in particular:`,
  (c: Country) =>
    `The case for sourcing from India rather than China rests on a few consistent factors — CE/ISO-documented quality, English-language support and competitive pricing against premium brands — and for buyers in ${c.name} these translate into the following:`,
];

const sectorsIntroVariants = [
  (c: Country) =>
    `${c.name}'s manufacturing base spans several sectors where fiber laser cutting and robotic welding directly improve part quality and throughput. The sectors we hear from most often, and the machines that typically suit them, are set out below.`,
  (c: Country) =>
    `Across ${c.name}, demand for our machines clusters around a handful of manufacturing sectors and their industrial zones. Here is how each typically maps to our product range.`,
  (c: Country) =>
    `We have shipped machines into several of ${c.name}'s manufacturing sectors, each with its own industrial zones and typical machine requirement, summarised below.`,
];

const shippingIntroVariants = [
  (c: Country) =>
    `Standard export terms are ${site.service.exportIncoterms}, and the logistics route into ${c.name} is planned at the quotation stage around the port or airport that best suits your delivery location.`,
  (c: Country) =>
    `We ship on ${site.service.exportIncoterms} terms as standard, and confirm the exact routing into ${c.name} — sea or air — once your delivery location is known.`,
  (c: Country) =>
    `Export shipments move on ${site.service.exportIncoterms} terms, with the routing into ${c.name} confirmed at quotation stage based on your nearest port or airport.`,
];

const voltageIntroVariants = [
  (c: Country) =>
    `Every machine we ship to ${c.name} is built and pre-configured for the destination's electrical supply — ${c.voltage} at ${c.frequency} — with drive systems, transformers and control cabinets specified during quotation so the machine runs on your facility's incoming power without on-site rewiring.`,
  (c: Country) =>
    `RA Machine configures each unit for ${c.name}'s standard industrial supply of ${c.voltage} at ${c.frequency} before it ships, so the electrical specification is settled at quotation rather than discovered on installation day.`,
  (c: Country) =>
    `Machines shipped to ${c.name} are built for local supply conditions of ${c.voltage} at ${c.frequency}, and where a facility's incoming power differs from this, we specify the appropriate transformer as part of the installation package.`,
];

const warrantyIntroVariants = [
  (c: Country) =>
    `Every machine carries a ${site.service.warrantyMonths}-month warranty on major components, and once commissioned, remote diagnostic support is available with a typical response of ${site.service.remoteResponseTime}, alongside stocked wear spares such as nozzles, lenses, contact tips and drive rollers for prompt air-freight dispatch to ${c.name}.`,
  (c: Country) =>
    `A ${site.service.warrantyMonths}-month warranty applies from commissioning, backed by remote diagnostics that typically respond within ${site.service.remoteResponseTime} and a spares stock covering common wear items, air-freighted to ${c.name} as needed.`,
  (c: Country) =>
    `Machines shipped to ${c.name} carry a ${site.service.warrantyMonths}-month warranty, and after commissioning our team provides remote diagnostic support, typically within ${site.service.remoteResponseTime}, plus air-freighted spares for common wear items.`,
];

const paymentIntroVariants = [
  (c: Country) =>
    `Standard payment terms for orders to ${c.name} are ${site.service.exportPaymentTerms}, with production lead time typically ${site.service.leadTimeWeeks} weeks from confirmed order and specification.`,
  (c: Country) =>
    `We work on ${site.service.exportPaymentTerms} for ${c.name} shipments, and production lead time usually runs ${site.service.leadTimeWeeks} weeks from the date the order and specification are confirmed.`,
  (c: Country) =>
    `Payment for machines shipped to ${c.name} follows ${site.service.exportPaymentTerms}, and buyers can expect a production lead time of around ${site.service.leadTimeWeeks} weeks once the order and specification are finalised.`,
];

/** The 8-step export process, each step with 3 phrasing variants. */
const exportProcessStepVariants: ((c: Country) => string)[][] = [
  [
    (c: Country) =>
      `We start with a detailed quotation once you send us your material type, thickness range, bed size or welding requirement — pricing is issued in US dollars with FOB Kolkata and CIF options to your nearest port in ${c.name}.`,
    (c: Country) =>
      `The process begins with a written quotation covering the machine specification and price in US dollars, with both FOB Kolkata and CIF terms to a port convenient for delivery into ${c.name}.`,
    (c: Country) =>
      `Every export order to ${c.name} opens with a formal quotation, priced in US dollars and covering FOB Kolkata as well as CIF delivery to your chosen port, based on the cutting or welding capacity you specify.`,
  ],
  [
    () =>
      `Once the specification is confirmed, we issue a proforma invoice setting out the agreed price, payment terms and delivery schedule for your sign-off before production begins.`,
    () =>
      `On confirmation of the machine configuration, a proforma invoice is raised, recording price, payment terms and the production timeline, ready for your approval.`,
    () =>
      `After you confirm the specification, we prepare a proforma invoice covering price, payment schedule and expected delivery, which forms the basis of the order.`,
  ],
  [
    () =>
      `Production then begins at our Kolkata facility, where the machine is built, wired and pre-tested against its rated specification before it ever reaches the shipping stage.`,
    () =>
      `Manufacturing takes place at our Kolkata works, with the machine assembled, calibrated and run through factory acceptance checks against its rated performance.`,
    () =>
      `Your machine is then built at our Kolkata facility, with every sub-system assembled, wired and tested against specification ahead of dispatch preparation.`,
  ],
  [
    () =>
      `Before the machine leaves our facility, we carry out a pre-shipment video inspection with you, running the machine live on camera so you can confirm build quality and functionality remotely before it is crated.`,
    () =>
      `We then conduct a live pre-shipment video inspection, demonstrating the machine's operation on camera so you can sign off on quality before crating and dispatch.`,
    () =>
      `A pre-shipment video inspection follows, where our engineers run the completed machine on camera for your review, giving visual confirmation before it is packed for shipment.`,
  ],
  [
    () =>
      `The machine is then export-packed and moved by sea freight from Kolkata or Haldia, with air freight kept available for urgent spares, on the shipping route and Incoterms agreed at quotation.`,
    () =>
      `Export packing is followed by sea freight from Kolkata or Haldia — with air freight kept in reserve for urgent spares — on the route and terms confirmed at the quotation stage.`,
    () =>
      `Once cleared for dispatch, the machine is export-packed and shipped by sea from Kolkata or Haldia, with air freight available separately for urgent spares, on the agreed Incoterms.`,
  ],
  [
    (c: Country) =>
      `On arrival, installation begins with remote, video-guided commissioning by our engineering team, followed by an on-site engineer visit for final alignment, safety checks and commissioning at your facility in ${c.name}.`,
    () =>
      `Installation combines remote video commissioning immediately on arrival with a follow-up on-site engineer visit to complete alignment, safety verification and final commissioning at your premises.`,
    () =>
      `Once the machine reaches you, our team guides remote commissioning by video call, then an engineer travels on site to complete calibration, safety checks and handover.`,
  ],
  [
    () =>
      `Operator training is delivered alongside installation, covering safe operation, routine maintenance and the nesting or welding-program software, so your team is production-ready from day one.`,
    () =>
      `Hands-on operator training follows commissioning, covering safe operation, day-to-day maintenance and the machine's control software, so your production team can run the machine confidently.`,
    () =>
      `Training for your operators is built into the installation visit, covering safe operating procedure, basic maintenance and the CNC or welding-program software supplied with the machine.`,
  ],
  [
    () =>
      `Every machine is backed by a ${site.service.warrantyMonths}-month warranty on the laser source, drive and control system, or the robot, positioner and power source on a welding cell, with spares and remote support available long after the warranty period.`,
    () =>
      `A ${site.service.warrantyMonths}-month warranty covers the core machine systems from the date of commissioning, with spares stock and remote diagnostic support continuing well beyond the warranty term.`,
    () =>
      `Warranty cover of ${site.service.warrantyMonths} months applies from commissioning, backed by ongoing spares availability and remote diagnostic support for the life of the machine.`,
  ],
];

/** Product lookup used to resolve a Country sector's `recommendedProductSlugs`. */
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

/**
 * Composes the ordered, 1,200–1,600 word section list for a country page.
 * `products` should be the full product catalogue (from "@/data"), used to
 * resolve each sector's recommended machines into internal links.
 */
export function countrySections(country: Country, products: Product[]): CountrySection[] {
  const seed = hashSlug(country.slug);

  const sectorParagraphs = country.sectors.map(
    (sector) => `${sector.name} — ${sector.zones.join(", ")}: ${sector.note}`,
  );
  const sectorProductSlugs = country.sectors.flatMap((s) => s.recommendedProductSlugs);

  const exportProcessParagraphs = exportProcessStepVariants.map((variants, i) =>
    pick(variants, seed, 100 + i)(country),
  );

  return [
    {
      id: "demand",
      h2: `Laser cutting and robotic welding machine demand in ${country.name}`,
      paragraphs: [pick(demandIntroVariants, seed, 1)(country), ...country.overview],
    },
    {
      id: "why-india",
      h2: `Why ${country.adjective} manufacturers buy laser cutting machines from India`,
      paragraphs: [pick(whyIndiaIntroVariants, seed, 2)(country), ...country.whyIndia],
    },
    {
      id: "sectors",
      h2: `Industries and industrial zones in ${country.name}`,
      paragraphs: [pick(sectorsIntroVariants, seed, 3)(country), ...sectorParagraphs],
      list: productLinks(sectorProductSlugs, products),
    },
    {
      id: "export-process",
      h2: `Our export process to ${country.name}, from quotation to installation`,
      paragraphs: exportProcessParagraphs,
      ordered: true,
    },
    {
      id: "shipping",
      h2: `Shipping terms, ports and logistics for ${country.name}`,
      paragraphs: [
        pick(shippingIntroVariants, seed, 4)(country),
        country.shippingNote,
        `Machines destined for ${country.name} are typically consigned via ${country.ports.join(", ")}, with ${country.airports.join(", ")} available for air freight of spares and urgent parts.`,
      ],
    },
    {
      id: "power-supply",
      h2: "Voltage, frequency and power supply compatibility",
      paragraphs: [pick(voltageIntroVariants, seed, 5)(country)],
    },
    {
      id: "warranty-spares",
      h2: "Warranty, spares and remote support",
      paragraphs: [pick(warrantyIntroVariants, seed, 6)(country)],
    },
    {
      id: "payment-terms",
      h2: "Payment terms, lead time, currency and regulatory notes",
      paragraphs: [
        pick(paymentIntroVariants, seed, 7)(country),
        country.currencyNote,
        country.regulatoryNote,
      ],
      table: [
        { label: "Payment terms", value: site.service.exportPaymentTerms },
        { label: "Lead time", value: `${site.service.leadTimeWeeks} weeks from confirmed order` },
        { label: "Incoterms", value: site.service.exportIncoterms },
        { label: "Currency", value: country.currency },
        { label: "Voltage / frequency", value: `${country.voltage} / ${country.frequency}` },
        { label: "Warranty", value: `${site.service.warrantyMonths} months` },
      ],
    },
  ];
}

/** Total visible word count this module produces for a given country (for the content audit). */
export function countryWordCount(country: Country, products: Product[]): number {
  const sections = countrySections(country, products);
  return sections.reduce((total, section) => {
    const listWords = wordCount(section.list?.map((l) => l.name));
    const tableWords = wordCount(section.table?.flatMap((t) => [t.label, t.value]));
    return total + wordCount(section.h2, section.paragraphs) + listWords + tableWords;
  }, 0);
}
