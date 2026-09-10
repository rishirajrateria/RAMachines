/**
 * app/export/visuals.ts — shared, non-copy visual helpers for the export hub and
 * country pages (ADR-0002 visual refresh). Everything here is presentational data
 * derived from existing facts (config/site.ts, data/types.ts `Country`/`Product`) —
 * it never invents new claims, only picks an icon/layout for an existing fact so the
 * page can lead with visuals (GlancePanel, ProcessSteps, IconCard/FeatureGrid grids)
 * before the long-form prose. Kept out of lib/copy/country.ts, which this worker also
 * owns, so that file stays focused on composing the word-count-checked copy.
 */
import type { IconName } from "@/components/ui/Icons";
import type { Country, Product, WorldRegion } from "@/data/types";
import { site } from "@/config/site";

/** The 8-step export process, in the same order as `exportProcessStepVariants` in
 * lib/copy/country.ts, so a country's per-step paragraph lines up with this title/icon. */
export const exportProcessStepMeta: { title: string; icon: IconName }[] = [
  { title: "Quotation", icon: "Currency" },
  { title: "Proforma invoice", icon: "Certificate" },
  { title: "Production", icon: "Factory" },
  { title: "Pre-shipment inspection", icon: "Play" },
  { title: "Export packing & freight", icon: "Ship" },
  { title: "Installation", icon: "Wrench" },
  { title: "Operator training", icon: "GraduationCap" },
  { title: "Warranty & support", icon: "Shield" },
];

export const regionIcons: Record<WorldRegion, IconName> = {
  "North America": "Building",
  "South America": "Layers",
  Europe: "Shield",
  "Middle East": "Bolt",
  "South Asia": "Users",
  "South-East Asia": "Ship",
  "Central Asia": "Truck",
  Africa: "Globe",
  Oceania: "Plane",
};

/** Cycled short labels/icons for a country's `whyIndia` reasons — content stays the
 * country's own verbatim sentence; these only supply a short card heading + icon. */
export const whyIndiaTitleCycle = [
  "Documented quality",
  "Competitive pricing",
  "Responsive support",
  "Logistics & trade ties",
  "Proven track record",
];

export const whyIndiaIconCycle: IconName[] = ["Certificate", "Currency", "Headset", "Truck", "Award"];

/** The standard 5 reasons that hold for every market, appended after the
 * country-specific `whyIndia` points in the "Why buy from India" FeatureGrid. */
export const whyIndiaStandard: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "Certificate",
    title: "CE marked & ISO 9001:2015",
    text: "Every machine ships with a CE declaration of conformity and an ISO 9001:2015 certificate covering our quality management system.",
  },
  {
    icon: "Badge",
    title: "IEC-registered exporter",
    text: "We are registered under India's Import Export Code, the mandatory baseline authorisation for exporting machinery from India.",
  },
  {
    icon: "Shield",
    title: `${site.service.warrantyMonths}-month warranty`,
    text: "Core systems — laser source, drive and control, or robot, positioner and power source — carry a two-year warranty from commissioning.",
  },
  {
    icon: "Headset",
    title: "Remote diagnostics",
    text: `Our engineering team responds to remote support requests, typically within ${site.service.remoteResponseTime}.`,
  },
  {
    icon: "Wrench",
    title: "Spares on hand",
    text: "Common wear items — nozzles, lenses, contact tips and drive rollers — are stocked for prompt air-freight dispatch.",
  },
];

/** Best-effort icon for a sector name/zone description — keyword match over the
 * free-text sector names authored in data/countries/*.ts, defaulting to Factory. */
export function sectorIcon(sectorName: string): IconName {
  const s = sectorName.toLowerCase();
  if (/electronic/.test(s)) return "Bolt";
  if (/automotive|vehicle|motor|auto/.test(s)) return "Gauge";
  if (/textile|garment|apparel/.test(s)) return "Layers";
  if (/construction|building|infrastructure/.test(s)) return "Building";
  if (/furniture/.test(s)) return "Layers";
  if (/oil|gas|energy|petro/.test(s)) return "Bolt";
  if (/agri|farm/.test(s)) return "Package";
  if (/marine|shipbuild|ship/.test(s)) return "Ship";
  if (/aerospace|aviation/.test(s)) return "Plane";
  if (/steel|metal|tube|fabricat/.test(s)) return "Weld";
  if (/mining/.test(s)) return "Gear";
  if (/rail/.test(s)) return "Truck";
  return "Factory";
}

/** Resolves a country's sector `recommendedProductSlugs` (deduped, in order) to
 * full Product objects, for rendering as ProductCards. */
export function recommendedProducts(country: Country, products: Product[]): Product[] {
  const seen = new Set<string>();
  const list: Product[] = [];
  for (const sector of country.sectors) {
    for (const slug of sector.recommendedProductSlugs) {
      if (seen.has(slug)) continue;
      const product = products.find((p) => p.slug === slug);
      if (!product) continue;
      seen.add(slug);
      list.push(product);
    }
  }
  return list;
}

/** The "At a glance" facts for a country page — restates, rather than replaces,
 * figures already present in the page's prose (voltage/frequency/currency in the
 * power-supply section, ports/airports in shipping, warranty/payment in their
 * sections), so nothing here adds an un-sourced claim. */
export function countryGlanceFacts(country: Country) {
  return [
    { icon: "Power" as IconName, label: "Voltage", value: country.voltage },
    { icon: "Bolt" as IconName, label: "Frequency", value: country.frequency },
    { icon: "Currency" as IconName, label: "Currency", value: country.currency },
    { icon: "Ship" as IconName, label: "Sea ports", value: country.ports.join(", ") },
    { icon: "Plane" as IconName, label: "Airports", value: country.airports.join(", ") },
    { icon: "Clock" as IconName, label: "Lead time", value: `${site.service.leadTimeWeeks} weeks` },
    { icon: "Shield" as IconName, label: "Warranty", value: `${site.service.warrantyMonths} months` },
    { icon: "Package" as IconName, label: "Payment terms", value: site.service.exportPaymentTerms },
    { icon: "Truck" as IconName, label: "Incoterms", value: site.service.exportIncoterms },
  ];
}

/** The "At a glance" facts for the /export hub page. */
export function hubGlanceFacts() {
  return [
    { icon: "Shield" as IconName, label: "Warranty", value: `${site.service.warrantyMonths} months` },
    { icon: "Clock" as IconName, label: "Lead time", value: `${site.service.leadTimeWeeks} weeks` },
    { icon: "Package" as IconName, label: "Payment terms", value: site.service.exportPaymentTerms },
    { icon: "Truck" as IconName, label: "Incoterms", value: site.service.exportIncoterms },
  ];
}
