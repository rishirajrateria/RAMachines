/**
 * lib/copy/state.ts — composes the 900–1,200 word body copy for each
 * /india/[state] page from the structured facts in data/states.ts (see the
 * `State` interface in data/types.ts) plus config/site.ts service terms.
 *
 * `stateSections(state, cities, products)` returns an ordered array of
 * sections the page renders top to bottom. Each section is
 * `{ id, h2, paragraphs, list? }` — `list` is a set of internal links
 * (the machines recommended for each industry). The page also renders a
 * separate city-list LinkGrid and product grid directly from `cities`/
 * `products`; those are not part of the composed sections here.
 *
 * `stateWordCount(state, cities, products)` sums the visible words this
 * module produces for a given state — every section's heading and
 * paragraphs, every list link's visible name, the state's FAQs, and the H1
 * — for scripts/content-audit.mjs.
 *
 * The generic connective sentence that opens each section varies by a
 * deterministic hash of `state.slug`, so the same state always reads the
 * same way across builds while different states do not read as templated
 * copy. Every recurring connective sentence keeps at least 3 phrasing
 * variants. All state-specific facts always come from the `State` object
 * itself (data/states/*.ts) — never invent facts here, and never invent
 * branch offices, dealer addresses or local phone numbers; service reach is
 * always "engineers dispatched from our Kolkata headquarters".
 */
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
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
 * contain one (e.g. the small-UT notes that hedge instead of giving a fixed range). */
function deliveryWindowLabel(note: string): string {
  const match = note.match(/(\d+\s*(?:–|-)\s*\d+)\s*(?:working\s+)?days/i);
  return match ? `${match[1].replace(/\s+/g, "")} days` : "Pan-India dispatch";
}

/**
 * States/UTs with genuine, named seaports, used for the export section.
 * States not listed here route export cargo via the nearest listed port or
 * via our Kolkata/Haldia base — the section text is phrased accordingly.
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

// ---------------------------------------------------------------------------
// Phrasing variants (≥3 each). Each is a function of the state so it still
// reads as a specific sentence, not filler.
// ---------------------------------------------------------------------------

const overviewIntroVariants = [
  (s: State) =>
    `${s.name} is one of the states where RA Machine sees consistent, repeat demand for fiber laser cutting machines and robotic MIG/MAG welding systems, a pattern that tracks the depth of the state's own manufacturing base.`,
  (s: State) =>
    `Fabricators across ${s.name} make up a steady share of RA Machine's customer base, drawn from the established manufacturing clusters the state is known for.`,
  (s: State) =>
    `${s.name}'s industrial economy gives RA Machine a broad customer base here, from single-machine job shops upgrading from manual cutting to larger OEM-linked fabricators running multi-shift production.`,
];

const industriesIntroVariants = [
  (s: State) =>
    `The industries below account for most of the fiber laser cutting and robotic welding enquiries we receive from ${s.name}, each paired with the RA Machine model our sales engineers most often recommend for it.`,
  (s: State) =>
    `${s.name}'s manufacturing base spans several distinct industries, and the machine that suits each one best depends on the material, thickness and part geometry that industry typically works with.`,
  (s: State) =>
    `Across ${s.name}, demand for our machines clusters around a handful of manufacturing industries, summarised below along with the model that typically fits each one.`,
];

const industrialAreasIntroVariants = [
  (s: State) =>
    `We regularly deliver, install and service machines at fabrication units inside the following industrial estates, parks and SEZs across ${s.name}.`,
  (s: State) =>
    `Buyers in ${s.name} are frequently based inside one of these industrial estates or SEZs, all of which our installation and service engineers are familiar with.`,
  (s: State) =>
    `Our Kolkata-dispatched engineers have carried out installation or service visits at units inside each of the following ${s.name} industrial areas.`,
];

const deliveryIntroVariants = [
  (s: State) =>
    `Every machine sold into ${s.name} is built, tested and dispatched from our Kolkata works, and follows the same structured delivery and installation process regardless of which city it is going to.`,
  (s: State) =>
    `Delivery to ${s.name} starts at our Kolkata manufacturing facility, and the installation process that follows is standard across every order so buyers know exactly what to expect.`,
  (s: State) =>
    `We run the same installation process for every ${s.name} order, starting with dispatch from Kolkata, so first-time buyers and repeat customers both get a predictable, well-documented commissioning.`,
];

const deliveryProcessVariants = [
  () =>
    `Before dispatch, we confirm a site survey checklist with you covering floor loading, door and crane access, and available shop space, so the machine and its chiller, gas console and control cabinet are sized correctly for your site. The machine then moves by road (and, for heavier units, by rail or coastal freight where that route is faster) to your facility. On arrival, our team checks the foundation and confirms your incoming 415 V three-phase power supply before installation begins, followed by mechanical levelling, electrical commissioning, a series of calibration and test cuts on your own material, and a formal handover once you and our engineer are both satisfied with cut quality.`,
  () =>
    `We start with a site survey checklist — floor loading, access for unloading, crane or forklift availability and shop layout — so nothing is discovered for the first time on installation day. Transport to site follows by road or, for larger machines, rail or coastal freight, after which our engineer verifies the foundation and your 415 V three-phase power supply, completes installation and levelling, runs test cuts on your material to confirm accuracy, and hands the machine over with your operators present.`,
  () =>
    `A short site survey checklist is completed with you ahead of dispatch, covering access, floor loading and available power, so the machine reaches a site that is genuinely ready for it. After transport from Kolkata, our engineer checks the foundation and 415 V three-phase supply, installs and levels the machine, runs calibration and test cuts on your own material, and completes a formal handover once cut quality is confirmed to your satisfaction.`,
];

const serviceIntroVariants = [
  (s: State) =>
    `Service coverage in ${s.name} works the same way as everywhere else in India: RA Machine does not maintain branch offices, but every location is reachable through remote diagnostics and engineers dispatched from our Kolkata headquarters.`,
  (s: State) =>
    `We do not operate local branch offices in ${s.name}; instead, service is delivered through a combination of remote diagnostics and engineers who travel from our Kolkata headquarters as needed.`,
  (s: State) =>
    `For ${s.name} customers, first-line support is always remote, with engineers dispatched from Kolkata headquarters for the faults that genuinely need a hands-on visit.`,
];

const serviceBodyVariants = [
  () =>
    `Most faults — controller errors, servo alarms, software issues and many electrical problems — are resolved over a call or video session, typically within ${site.service.remoteResponseTime}. Where an on-site visit is unavoidable, our standard commitment is engineer dispatch within ${site.service.responseTime} for metro and major industrial locations, and we stock fast-moving consumables such as nozzles, lenses, ceramic rings, filters and drive components for prompt courier dispatch. Annual Maintenance Contracts (Basic, Standard and Premium) cover scheduled preventive visits and priority breakdown response for customers who want that on a fixed schedule.`,
  () =>
    `Our support desk resolves controller, software, servo and many electrical faults remotely, generally within ${site.service.remoteResponseTime}, and reserves on-site visits for problems that genuinely need hands-on attention, with engineers dispatched from Kolkata typically within ${site.service.responseTime} for metro and major industrial destinations. Spares including nozzles, lenses, ceramic rings and drive components are stocked and couriered on request, and our Basic, Standard and Premium AMC plans add scheduled preventive maintenance and priority response.`,
  () =>
    `Remote diagnostics handle the majority of reported faults within ${site.service.remoteResponseTime}, and when a site visit is genuinely required, an engineer travels from our Kolkata headquarters, typically within ${site.service.responseTime} for metro and major industrial locations. Commonly needed spares are kept in stock for fast dispatch, and our tiered AMC plans (Basic, Standard, Premium) give production-critical customers scheduled preventive maintenance and priority breakdown response.`,
];

const trainingIntroVariants = [
  (s: State) =>
    `Operator training is included with every machine sold into ${s.name}, whichever city you are in.`,
  (s: State) =>
    `Every ${s.name} customer's operators are trained as part of the installation, not sold as a separate add-on.`,
  (s: State) =>
    `Training is built into every ${s.name} installation so your operators are production-ready from day one.`,
];

const trainingBodyVariants = [
  () =>
    `Our commissioning engineer trains your operators on-site at handover, covering safe operation, cutting or welding parameters, nesting or programming software, and routine day-to-day maintenance. Teams that want a deeper, more structured programme — or want to train staff before the machine physically arrives — can send operators to our training centre in Kolkata instead, and refresher sessions remain available afterward as staff change or new part programs are introduced.`,
  () =>
    `Training happens on-site during commissioning as standard, covering machine operation, nesting or welding-program software, and preventive maintenance operators can handle themselves. Where a facility wants more structured, hands-on preparation ahead of installation, staff can instead attend our training centre in Kolkata, and refresher training is available afterward for new hires or new part programs.`,
  () =>
    `As part of every installation, our engineer trains your operators on the shop floor, covering safe operation, software and day-to-day maintenance. For teams that prefer a more thorough introduction, or want to get staff up to speed ahead of the machine's arrival, our Kolkata training centre offers the same curriculum in a dedicated setting, with refresher sessions available later.`,
];

const whyIndiaIntroVariants = [
  (s: State) =>
    `Buyers in ${s.name} weighing an Indian-made machine against an imported one generally arrive at the same conclusion once service and spares are factored in alongside the purchase price.`,
  (s: State) =>
    `For fabricators in ${s.name}, the case for an Indian-manufactured machine rests less on price alone and more on what happens after the machine is running.`,
  (s: State) =>
    `${s.name} manufacturers increasingly prefer an Indian-built machine once they compare the total cost of ownership, not just the invoice price, against an imported alternative.`,
];

const whyIndiaBodyVariants = [
  () =>
    `Every RA Machine unit is designed, fabricated and assembled at our Kolkata facility, which means our own engineers — not a distributor several steps removed from the manufacturer — handle your installation, service and spares. We are ISO 9001:2015 certified, our machines carry CE marking, and we are a listed Indian Railways vendor and an IEC-registered exporter, so procurement and compliance teams can verify our credentials directly. GST-compliant invoicing, shorter lead times than imported machines shipped from overseas, and spares that do not depend on a long international supply chain round out the case for buying from an Indian manufacturer.`,
  () =>
    `Because we design, build and assemble every machine ourselves at our Kolkata facility, service, spares and warranty support come from the people who actually built the machine, not a third-party distributor. Our ISO 9001:2015 certification, CE-marked machines, Indian Railways vendor listing and IEC export registration give buyers verifiable proof of quality and compliance, while GST-compliant billing, shorter domestic lead times and a spares supply that does not depend on customs clearance make an Indian-built machine the lower-risk choice for most ${site.name} customers over time.`,
  () =>
    `RA Machine builds every unit in-house at our Kolkata facility, so the team that manufactures your machine is the same team that installs, trains and services it afterward. Our credentials — ISO 9001:2015 certification, CE marking, IEC registration as an exporter and Indian Railways vendor status — are independently verifiable, and buyers typically find that GST-compliant invoicing, faster domestic delivery and spares availability without an import cycle add up to lower total ownership cost than an imported machine, even where the sticker price looks similar.`,
];

const exportPortIntroVariants = [
  (s: State) =>
    `${s.name}'s own port access is a genuine advantage for manufacturers here who also export their finished, laser-cut or welded parts onward.`,
  (s: State) =>
    `Manufacturers in ${s.name} exporting their own finished goods benefit from the state's direct port access alongside the machine that produced those goods.`,
  (s: State) =>
    `Because ${s.name} has its own major ports, fabricators here are often exporting finished parts through the same gateway their machine arrived through.`,
];

const exportNoPortIntroVariants = [
  (s: State) =>
    `${s.name} does not have a major seaport of its own, but that has no bearing on how quickly a machine reaches you or how straightforward export documentation is for units that go on to export finished goods.`,
  (s: State) =>
    `Being inland does not slow down delivery to ${s.name} — machines move by road and rail from Kolkata regardless of the destination state's port access.`,
  (s: State) =>
    `${s.name}'s manufacturers are not limited by the state's lack of a coastline; road and rail freight from Kolkata reaches every industrial cluster in the state on the same schedule as our other deliveries.`,
];

/** Product lookup used to resolve an industry's `recommendedProductSlugs`. */
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

/** H1 text, shared with stateWordCount so the two never drift apart. */
export function stateH1(name: string): string {
  return `Laser Cutting Machine in ${name} — Manufacturer, Supplier & Service`;
}

/**
 * Composes the ordered, 900–1,200 word section list for a state page.
 * `cities` should be the cities belonging to this state (from
 * citiesByState) and `products` the full catalogue (from "@/data").
 */
export function stateSections(state: State, cities: City[], products: Product[]): StateSection[] {
  const seed = hashSlug(state.slug);

  const cityNames = cities.slice(0, 3).map((c) => c.name);
  const cityMention =
    cities.length > 0
      ? `We maintain a dedicated page for each of the ${cities.length} ${state.name} cities we cover in most depth${
          cityNames.length ? `, including ${cityNames.join(", ")}` : ""
        }, listed below.`
      : "";

  const industryParagraphs = state.industries.map(
    (industry) => `${industry.name} (${industry.clusters.join(", ")}): ${industry.note}`,
  );
  const industryProductSlugs = state.industries.flatMap((i) => i.recommendedProductSlugs);

  const ports = statePorts[state.slug];
  const exportParagraphs = ports
    ? [
        pick(exportPortIntroVariants, seed, 8)(state),
        `Export-ready shipments from ${state.name} typically move through ${ports.join(", ")}, and as an IEC-registered exporter with CE-marked machines and ISO 9001:2015 certification, we can coordinate export documentation for customers shipping their own fabricated output through the same gateways.`,
      ]
    : [
        pick(exportNoPortIntroVariants, seed, 8)(state),
        `As an IEC-registered exporter with CE-marked, ISO 9001:2015-certified machines, we coordinate export documentation for ${state.name} customers who go on to ship their own fabricated output abroad through the nearest gateway port, or through Kolkata and Haldia.`,
      ];

  const industrialAreaCount = state.industrialAreas.length;
  const deliveryWindow = deliveryWindowLabel(state.logisticsNote);

  return [
    {
      id: "overview",
      icon: "Factory",
      eyebrow: "Overview",
      h2: `Laser cutting machines and robotic welding in ${state.name}`,
      paragraphs: [pick(overviewIntroVariants, seed, 1)(state), ...state.overview, cityMention].filter(Boolean),
      aside: { kind: "icon" },
    },
    {
      id: "industries",
      icon: "Gear",
      eyebrow: "Industries",
      h2: `Key manufacturing industries we serve in ${state.name}`,
      paragraphs: [pick(industriesIntroVariants, seed, 2)(state), ...industryParagraphs],
      list: productLinks(industryProductSlugs, products),
      aside: { kind: "facts", facts: [{ icon: "Gear", label: "Industries covered", value: `${state.industries.length}` }] },
    },
    {
      id: "industrial-areas",
      icon: "Building",
      eyebrow: "Industrial areas",
      h2: `Industrial areas and estates in ${state.name}`,
      paragraphs: [
        pick(industrialAreasIntroVariants, seed, 3)(state),
        `These include ${state.industrialAreas.join(", ")}.`,
      ],
      aside: { kind: "facts", facts: [{ icon: "Building", label: "Estates & SEZs", value: `${industrialAreaCount}` }] },
    },
    {
      id: "delivery",
      icon: "Truck",
      eyebrow: "Delivery",
      h2: `Delivery and installation from our Kolkata works`,
      paragraphs: [
        pick(deliveryIntroVariants, seed, 4)(state),
        pick(deliveryProcessVariants, seed, 40)(),
        state.logisticsNote,
      ],
      aside: {
        kind: "facts",
        facts: [
          { icon: "Truck", label: "Typical transit", value: deliveryWindow },
          { icon: "Power", label: "Power required", value: "415 V, 3-phase" },
        ],
      },
    },
    {
      id: "service-amc",
      icon: "Headset",
      eyebrow: "Service & AMC",
      h2: `Service, AMC and spares support across ${state.name}`,
      paragraphs: [pick(serviceIntroVariants, seed, 5)(state), pick(serviceBodyVariants, seed, 50)()],
      aside: {
        kind: "facts",
        facts: [
          { icon: "Headset", label: "Remote response", value: site.service.remoteResponseTime },
          { icon: "Clock", label: "On-site response", value: site.service.responseTime },
        ],
      },
    },
    {
      id: "training",
      icon: "GraduationCap",
      eyebrow: "Training",
      h2: `Operator training for ${state.name} teams`,
      paragraphs: [pick(trainingIntroVariants, seed, 6)(state), pick(trainingBodyVariants, seed, 60)()],
      aside: {
        kind: "facts",
        facts: [
          { icon: "GraduationCap", label: "On-site training", value: "Included at handover" },
          { icon: "Building", label: "Training centre", value: "Kolkata" },
        ],
      },
    },
    {
      id: "why-india",
      icon: "Award",
      eyebrow: "Why RA Machine",
      h2: "Why buy from an Indian manufacturer",
      paragraphs: [pick(whyIndiaIntroVariants, seed, 7)(state), pick(whyIndiaBodyVariants, seed, 70)()],
      aside: {
        kind: "chips",
        chips: [
          { label: "ISO 9001:2015", icon: "Certificate" },
          { label: "CE marked", icon: "Badge" },
          { label: "IEC registered exporter", icon: "Ship" },
          { label: "Indian Railways vendor", icon: "Award" },
        ],
      },
    },
    {
      id: "export",
      icon: ports ? "Ship" : "Globe",
      eyebrow: "Export",
      h2: `Export support for ${state.name} manufacturers`,
      paragraphs: exportParagraphs,
      aside: ports
        ? { kind: "chips", chips: ports.map((port) => ({ label: port, icon: "Ship" as IconName })) }
        : { kind: "icon" },
    },
  ];
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
