/**
 * data/types.ts — shared TypeScript contracts for every data file.
 * Page templates compose copy from these structured facts, so the more
 * specific the facts (real clusters, real industrial estates, real ports),
 * the better and more unique each generated page reads.
 */
export interface FaqItem {
  q: string;
  a: string; // 40–90 words, plain text
}

export interface Img {
  src: string; // path under /public
  alt: string;
  width: number;
  height: number;
}

export type CategorySlug =
  | "fiber-laser-cutting-machines"
  | "tube-laser-cutting-machines"
  | "co2-laser-machines"
  | "robotic-welding-systems";

export interface Category {
  slug: CategorySlug;
  name: string; // "Fiber Laser Cutting Machines"
  shortName: string; // "Fiber Laser"
  description: string; // ≤155 chars, used for meta + cards
  intro: string; // one paragraph shown at top of the category page
  longCopy: string[]; // paragraphs; 600–900 words total, original
  applications: string[];
  comparisonSpecs: string[]; // spec labels to show in the comparison table, in order
  faqs: FaqItem[]; // 6+
  image: Img;
}

export interface Product {
  slug: string;
  sku: string; // "RA-F1530"
  name: string; // "RA-F1530 Fiber Laser Cutting Machine"
  category: CategorySlug;
  headline: string; // "1.5 kW · 1500 × 3000 mm" style one-liner
  shortDescription: string; // ≤155 chars
  longDescription: string[]; // paragraphs, 400–600 words total
  highlights: string[]; // 4–6 bullet points
  specs: { label: string; value: string }[]; // key/value table
  applications: string[];
  materials: { material: string; maxThickness: string }[]; // materials & thickness table
  faqs: FaqItem[]; // 6+
  images: Img[]; // gallery, first = main
  brochureUrl: string; // placeholder PDF under /public/brochures
  relatedSlugs: string[];
}

export type Region = "North" | "South" | "East" | "West" | "Central" | "North-East";

export interface StateIndustry {
  name: string; // "Automotive components"
  clusters: string[]; // real places, e.g. ["Ludhiana", "Jalandhar"]
  products: string[]; // what they make, e.g. ["bicycle frames", "tractor parts"]
  note: string; // 1–2 sentences: why laser cutting / welding matters for this industry here
  recommendedProductSlugs: string[]; // 1–3 product slugs
}

export interface State {
  slug: string; // "west-bengal"
  name: string; // "West Bengal"
  type: "state" | "ut";
  tier: "large" | "medium" | "small"; // large = 8 cities, medium = 4, small = 1–2
  region: Region;
  capital: string;
  overview: string[]; // 2 paragraphs, ~120 words total, unique and factual (economy, geography, industry)
  industries: StateIndustry[]; // 3–6
  industrialAreas: string[]; // real estates/parks/SEZs, 4–8
  logisticsNote: string; // 2 sentences: transit from Kolkata (road/rail corridors, typical days) — no invented branch offices
  neighbouringStateSlugs: string[];
  faqs: FaqItem[]; // 6, state-specific
}

export interface City {
  slug: string; // "howrah"
  name: string; // "Howrah"
  stateSlug: string;
  overview: string[]; // 2 short paragraphs, ~90 words total, real local industry context
  industries: string[]; // 3–6, specific ("foundry & castings", "railway wagon fabrication")
  industrialAreas: string[]; // real estates, 2–5
  recommendedProductSlugs: string[]; // 2–4
  nearbyCitySlugs: string[]; // other cities in the same state (2–7)
  logisticsNote: string; // 1–2 sentences, transit from Kolkata
  faqs: FaqItem[]; // 5, city-specific
  isTop?: boolean; // true for the 12 cities linked in the footer
}

export type WorldRegion =
  | "North America"
  | "South America"
  | "Europe"
  | "Middle East"
  | "South Asia"
  | "South-East Asia"
  | "Central Asia"
  | "Africa"
  | "Oceania";

export interface CountrySector {
  name: string; // "Automotive & auto components"
  zones: string[]; // real industrial zones / cities
  products: string[];
  note: string; // 1–2 sentences
  recommendedProductSlugs: string[];
}

export interface Country {
  slug: string; // "vietnam"
  name: string; // "Vietnam"
  region: WorldRegion;
  adjective: string; // "Vietnamese"
  overview: string[]; // 2–3 paragraphs, ~180 words, real manufacturing context and import demand
  whyIndia: string[]; // 3–5 country-specific reasons to buy from India (not generic)
  sectors: CountrySector[]; // 3–6
  ports: string[]; // main sea ports (real)
  airports: string[]; // main cargo airports (real)
  voltage: string; // "220/380 V"
  frequency: string; // "50 Hz"
  currency: string; // "VND (Vietnamese đồng)"
  currencyNote: string; // 1 sentence on invoicing currency (USD) and any note
  shippingNote: string; // 2 sentences: typical route from Kolkata/Haldia, transit days (placeholder), CIF port
  regulatoryNote: string; // 1–2 sentences: CE/UL/local certification expectations, import duty notes (factual, hedged)
  faqs: FaqItem[]; // 8, country-specific
  isTop?: boolean; // true for the 10 countries linked in the footer
}

export interface Certification {
  slug: string;
  name: string; // "ISO 9001:2015"
  issuer: string; // "TÜV / accredited certification body"
  oneLiner: string; // ≤120 chars
  description: string; // 60–100 words, what it means for the buyer
  image: Img; // /certs/*.webp placeholder, 3:4 aspect
  optional?: boolean;
}

export interface Testimonial {
  quote: string; // 40–70 words
  name: string; // PLACEHOLDER person
  role: string;
  company: string; // PLACEHOLDER company
  location: string; // "Ludhiana, India" / "Hanoi, Vietnam"
  productSlug?: string;
}
