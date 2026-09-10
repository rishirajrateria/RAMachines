/**
 * lib/copy/country.ts — composes the 1,200–1,400 word body copy for each
 * /export/[country] page from the structured facts in data/countries/*.ts
 * (see data/types.ts `Country`) plus config/site.ts service terms.
 *
 * `countrySections(country, products)` returns an ordered array of sections
 * the page renders top to bottom. Each section is `{ id, h2, paragraphs,
 * list? }` — `list` is a set of internal links (recommended machines) used
 * for the sectors section's JSON-LD product list.
 *
 * `countryWordCount(country, products)` sums the visible words this module
 * produces for a given country, used by scripts/content-audit.mjs.
 *
 * ADR-0003: each section states one clear, country-specific version of its
 * topic rather than three interchangeable phrasings — repeated generic
 * phrasing across 30 country pages is a "scaled content" risk, and the
 * facts that used to justify a full paragraph (voltage, warranty, payment
 * terms, lead time, ports, currency, Incoterms) are now shown once, visually,
 * in GlancePanel (see app/export/[country]/page.tsx and ./visuals.ts). The
 * 8-step export process is fully covered by the shared ProcessSteps captions
 * in app/export/copy.ts, so it is not restated here as a per-country narrative.
 *
 * ADR-0002: each section also carries an `icon` so app/export/[country]/page.tsx
 * can put an icon beside every h2 (SectionHeading) and lead each block with a
 * visual before this section's paragraphs. This is presentation metadata only —
 * it is not counted by `countryWordCount` and does not change the composed copy.
 */
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import { wordCount } from "@/lib/words";
import type { Country, Product } from "@/data/types";
import type { IconName } from "@/components/ui/Icons";

export interface CountrySection {
  id: string;
  h2: string;
  icon: IconName;
  paragraphs: string[];
  list?: { name: string; href: string }[];
}

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
 * Composes the ordered, 1,200–1,400 word section list for a country page.
 * `products` should be the full product catalogue (from "@/data"), used to
 * resolve each sector's recommended machines into internal links.
 */
export function countrySections(country: Country, products: Product[]): CountrySection[] {
  const sectorParagraphs = country.sectors.map(
    (sector) => `${sector.name} — ${sector.zones.join(", ")}: ${sector.note}`,
  );
  const sectorProductSlugs = country.sectors.flatMap((s) => s.recommendedProductSlugs);
  const topZones = Array.from(new Set(country.sectors.flatMap((s) => s.zones))).slice(0, 2);
  const sectorsIntro =
    topZones.length > 1
      ? `${country.name}'s demand for cutting and welding capacity is concentrated in a handful of manufacturing sectors, most visibly around ${topZones[0]} and ${topZones[1]}.`
      : `${country.name}'s demand for cutting and welding capacity is concentrated in the manufacturing sectors below.`;

  return [
    {
      id: "demand",
      h2: `Laser cutting and robotic welding machine demand in ${country.name}`,
      icon: "Globe",
      // ADR-0003: the unique overview is 2 paragraphs; a 3rd (where data/countries/*
      // carries one) is dropped here rather than in the data file this worker does
      // not own.
      paragraphs: country.overview.slice(0, 2),
    },
    {
      id: "why-india",
      h2: `Why ${country.adjective} manufacturers buy laser cutting machines from India`,
      icon: "Award",
      paragraphs: [...country.whyIndia],
    },
    {
      id: "sectors",
      h2: `Industries and industrial zones in ${country.name}`,
      icon: "Factory",
      paragraphs: [sectorsIntro, ...sectorParagraphs],
      list: productLinks(sectorProductSlugs, products),
    },
    {
      id: "shipping",
      h2: "Shipping terms and logistics",
      icon: "Ship",
      paragraphs: [`${country.shippingNote} Standard export terms are ${site.service.exportIncoterms}.`],
    },
    {
      id: "power-supply",
      h2: "Voltage and power supply compatibility",
      icon: "Power",
      paragraphs: [
        `Machines shipped to ${country.name} are built and pre-configured for the destination's ${country.voltage} supply at ${country.frequency}, with any transformer requirement specified at quotation so nothing needs rewiring on installation day.`,
      ],
    },
    {
      id: "warranty-spares",
      h2: "Warranty, spares and remote support",
      icon: "Shield",
      paragraphs: [
        `Machines carry a ${site.service.warrantyMonths}-month warranty on core systems, backed by remote diagnostic support typically within ${site.service.remoteResponseTime} and stocked wear spares — nozzles, lenses, contact tips and drive rollers — for prompt air-freight dispatch to ${country.name}.`,
      ],
    },
    {
      id: "regulatory",
      h2: "Currency and regulatory notes",
      icon: "Currency",
      paragraphs: [country.currencyNote, country.regulatoryNote],
    },
  ];
}

/** Total visible word count this module produces for a given country (for the content audit). */
export function countryWordCount(country: Country, products: Product[]): number {
  const sections = countrySections(country, products);
  return sections.reduce((total, section) => {
    const listWords = wordCount(section.list?.map((l) => l.name));
    return total + wordCount(section.h2, section.paragraphs) + listWords;
  }, 0);
}
