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

/**
 * The five machine families (client brief, Oct 2026). RA Machine sells by
 * technology and configures each machine to the buyer's job, so the site
 * presents one page per family with the client's own ranges. There are no
 * per-model pages or model numbers; the earlier eight placeholder SKUs were
 * removed and their URLs redirect (vercel.json).
 */
export type CategorySlug =
  | "fiber-laser-cutting-machines"
  | "cnc-plasma-cutting-machines"
  | "mig-tig-arc-welding-machines"
  | "submerged-arc-welding-machines"
  | "robotic-welding-systems";

export interface Category {
  slug: CategorySlug;
  name: string; // "CNC Fiber Laser Cutting Machines"
  shortName: string; // "CNC Laser"
  /** The one figure a card leads with, e.g. "1.5–30 kW". From `ranges`, never invented. */
  headline: string;
  headlineLabel: string; // "laser power"
  /**
   * The client's own figures — the only specifications the site states for this
   * family. Shown as the range table and hero facts. Do not add a figure here
   * unless RA Machine has supplied it.
   */
  ranges: { label: string; value: string }[];
  description: string; // ≤155 chars, used for meta + cards
  intro: string; // one paragraph shown at top of the category page
  longCopy: string[]; // paragraphs; buyer education, no invented specs
  applications: string[];
  faqs: FaqItem[]; // 6+
  image: Img;
}

export type Region = "North" | "South" | "East" | "West" | "Central" | "North-East";

export interface StateIndustry {
  name: string; // "Automotive components"
  clusters: string[]; // real places, e.g. ["Ludhiana", "Jalandhar"]
  products: string[]; // what they make, e.g. ["bicycle frames", "tractor parts"]
  note: string; // 1–2 sentences: why laser cutting / welding matters for this industry here
  recommendedFamilies: CategorySlug[]; // 1–3 machine families
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
  recommendedFamilies: CategorySlug[]; // 1–3 machine families
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
  recommendedFamilies: CategorySlug[]; // 1–3 machine families
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
  /**
   * "pending" = not yet confirmed by the owner: kept here with its copy, but NOT
   * shown anywhere on the site. Delete the field once the client confirms it and
   * sends a scan of the certificate.
   */
  status?: "pending";
}
