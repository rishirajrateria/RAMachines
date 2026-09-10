/** data/cities/andaman-lakshadweep.ts — part of the RA Machine city dataset. See data/cities.ts for the full editing guide. */
import type { City } from "../types";

export const cities: City[] = [
  {
    slug: "port-blair",
    name: "Port Blair",
    stateSlug: "andaman-and-nicobar-islands",
    overview: [
      "Port Blair's economy is centred on fishing, shipping and dockyard activity, tourism and government administration, and while this is a low-volume, logistics-constrained island market, a small base of local fabrication and repair workshops keeps boats, port equipment and marine fixtures running.",
      "Workshops here handle hull and deck fittings, jetty and dockyard repair fabrication, and general steelwork for the town's tourism and government infrastructure, with demand shaped more by the fishing and marine sector than any land-based manufacturing.",
    ],
    industries: ["fishing and marine fabrication", "shipping and dockyard repair work", "tourism-linked construction fabrication", "general government infrastructure steelwork"],
    industrialAreas: ["Port Blair dockyard repair workshops", "Junglighat small-scale fabrication units"],
    recommendedProductSlugs: ["ra-f1530", "ra-c1390"],
    nearbyCitySlugs: [],
    logisticsNote: "Port Blair has no road link to the mainland, so machines move by sea freight from Kolkata Port, the nearest major mainland port with a regular cargo-vessel service to the islands, with transit of roughly 4–7 days by sea plus port handling; air freight is used for urgent spares.",
    faqs: [
      { q: "How can a Port Blair fabrication or marine-repair workshop get a quote and see a demo?", a: "Share your material type, thickness and typical job sizes through our enquiry form or WhatsApp, and we will send a tailored quotation with sample cutting videos. Given the island location, we generally arrange a live video demonstration rather than an in-person visit before you finalise an order." },
      { q: "What is the delivery and installation timeline for a machine ordered in Port Blair?", a: "Since there is no road link to the mainland, machines move by sea freight from Kolkata Port, with transit of roughly 4–7 days plus port handling before reaching Port Blair. Our engineers then travel to the island to complete installation, commissioning and cutting trials." },
      { q: "How quickly can Port Blair workshops get on-site repair or AMC support?", a: "Remote diagnostics over call and video resolve most faults first, which is especially valuable given the island's distance from the mainland. Where a physical visit is genuinely needed, engineers are dispatched from our Kolkata headquarters, and urgent spare parts are sent by air freight to reduce downtime." },
      { q: "Is operator training available for a machine installed in Port Blair?", a: "Yes, every installation includes hands-on training for your operators at your Port Blair site, covering safe operation, basic nesting and routine maintenance suited to marine and dockyard-linked fabrication. Remote guidance calls remain especially important afterwards given the island's logistics constraints." },
      { q: "Which machine suits Port Blair's fishing and marine-linked fabrication trade?", a: "The compact RA-F1530 fiber laser suits general hull fittings, dockyard repair parts and tourism-linked construction steelwork typical of Port Blair's small workshops, while the RA-C1390 CO2 machine handles signage and thinner-material work for the town's tourism sector." },
    ],
  },
  {
    slug: "kavaratti",
    name: "Kavaratti",
    stateSlug: "lakshadweep",
    overview: [
      "Kavaratti is a very small island economy built around fishing, coir and tourism, with minimal local industry and very limited local metal-fabrication capacity, so honest expectations matter more here than in almost any other market this dataset covers.",
      "What fabrication exists is largely repair-focused, covering boat fittings, coir-processing fixtures and small tourism-related construction work, rather than anything resembling an organised industrial base.",
    ],
    industries: ["fishing boat fittings and repair", "coir-processing fixtures", "tourism-linked small construction work", "general island repair fabrication"],
    industrialAreas: ["Kavaratti local repair workshops"],
    recommendedProductSlugs: ["ra-f1530", "ra-c1390"],
    nearbyCitySlugs: [],
    logisticsNote: "Lakshadweep has very limited direct freight capacity and relies on sea freight coordinated via the mainland, so lead times to Kavaratti are longer than elsewhere and are best confirmed at the time of quotation rather than given as a fixed range.",
    faqs: [
      { q: "How can a Kavaratti workshop get a quote and see a machine demonstration?", a: "Share your material type, thickness and typical job sizes through our enquiry form or WhatsApp, and we will send a tailored quotation with sample cutting videos. Given Kavaratti's limited connectivity, demonstrations are generally arranged as a live video call rather than an in-person visit." },
      { q: "What is the delivery timeline for a machine ordered in Kavaratti?", a: "Because Lakshadweep has very limited direct freight capacity, machines are moved by sea freight coordinated via the mainland, and the exact transit time depends on available sailings. We confirm a realistic delivery window at the time of quotation rather than quoting a fixed range in advance." },
      { q: "How is on-site repair or AMC support handled for Kavaratti given the island's remoteness?", a: "Remote diagnostics over call and video are the first line of support and resolve most issues without travel. Where a physical visit is unavoidable, engineers are dispatched from our Kolkata headquarters and travel arrangements are planned around available island transport, so response times are confirmed case by case." },
      { q: "Is operator training available for a machine installed in Kavaratti?", a: "Yes, hands-on training is provided at installation, covering safe operation, basic nesting and routine maintenance suited to boat-fitting and small repair work. Given the island's limited local technical support, remote guidance calls are an especially important part of ongoing assistance for Kavaratti operators." },
      { q: "Which machine suits Kavaratti's small-scale fishing and repair economy?", a: "Given the very limited scale of local industry, the compact RA-F1530 fiber laser is the practical choice for Kavaratti, handling boat fittings, coir-processing fixtures and general repair fabrication without requiring the throughput or footprint of a larger industrial machine. The RA-C1390 CO2 machine suits occasional signage and tourism-related work." },
    ],
  },
];
