/**
 * data/countries/central-asia.ts — Country entries for the Central Asia region.
 * Part of the data/countries/ split; re-exported by the data/countries.ts barrel.
 */
import type { Country } from "../types";

export const centralAsiaCountries: Country[] = [
  {
    slug: "uzbekistan",
    name: "Uzbekistan",
    region: "Central Asia",
    adjective: "Uzbek",
    overview: [
      "Uzbekistan has pursued an ambitious industrial modernisation programme over the past decade, with Tashkent's engineering base and the Navoi Free Economic Zone attracting manufacturing investment across machinery, construction materials and general fabrication. The government's push to expand domestic manufacturing capacity and reduce import dependence has created steady demand for metal cutting and welding equipment among both state-linked and private manufacturers.",
      "Uzbekistan's landlocked, double-landlocked geography (it is one of only two countries in the world surrounded entirely by other landlocked countries) makes reliable air and rail freight partnerships important, and Uzbek buyers place real weight on a supplier's ability to deliver and support machinery despite the logistics distance involved.",
      "India and Uzbekistan have strengthened trade and economic cooperation in recent years, and Uzbek industrial buyers are increasingly open to sourcing capital machinery directly from Indian manufacturers rather than exclusively through Russian, Chinese or Turkish intermediaries.",
    ],
    whyIndia: [
      "Growing India-Uzbekistan trade cooperation and diplomatic engagement provide a positive commercial backdrop for Indian exporters entering the Central Asian market.",
      "Competitive Indian pricing relative to Russian, Turkish and European alternatives suits Uzbekistan's cost-conscious industrial modernisation programme.",
      "CE marking and ISO 9001:2015 documentation give Uzbek buyers the quality assurance paperwork increasingly expected for state-linked procurement and modernisation projects.",
      "A 1.5-hour time difference from India supports convenient same-day scheduling for remote diagnostics and support.",
    ],
    sectors: [
      {
        name: "General engineering and machinery manufacturing",
        zones: ["Tashkent"],
        products: ["machine components", "equipment frames", "structural parts"],
        note: "Tashkent's established engineering base is Uzbekistan's primary concentration of metal fabrication and machinery manufacturing.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f6020-hd"],
      },
      {
        name: "Free economic zone manufacturing",
        zones: ["Navoi Free Economic Zone"],
        products: ["industrial components", "export-oriented fabrication"],
        note: "The Navoi Free Economic Zone's growing manufacturing base, linked to an international air cargo hub, benefits from streamlined import processes.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Construction and structural fabrication",
        zones: ["Tashkent", "Samarkand"],
        products: ["structural steel", "building components"],
        note: "Uzbekistan's continued urban development and construction investment supports demand for structural steel cutting capacity.",
        recommendedProductSlugs: ["ra-f6020-hd"],
      },
    ],
    ports: ["No sea port — landlocked; cargo routed via Bandar Abbas (Iran) or Karachi (Pakistan) overland/rail, or by air freight to Tashkent"],
    airports: ["Tashkent International Airport", "Navoi International Airport (cargo hub)"],
    voltage: "380 V 3-phase",
    frequency: "50 Hz",
    currency: "UZS (Uzbekistani Som)",
    currencyNote: "Quotations are issued in US dollars, the standard invoicing currency for Uzbek import transactions.",
    shippingNote: "As Uzbekistan is landlocked, machinery typically moves by sea to a regional port followed by rail or road transit, or by direct air freight to Tashkent or the Navoi cargo hub for time-sensitive shipments, with an indicative total transit of 30–45 days by sea-and-land routing. Our export team confirms the most efficient current routing at enquiry stage.",
    regulatoryNote: "Uzbekistan applies standard import duty and conformity requirements on industrial machinery, with import procedures continuing to be simplified under the country's ongoing trade liberalisation programme; CE documentation supports the import process and buyers should confirm current requirements with their customs clearing agent.",
    faqs: [
      { q: "How do we request a quotation for delivery to Uzbekistan?", a: "Send your required cutting or welding specification through our enquiry form and we will issue a US-dollar quotation covering the most efficient routing to Tashkent or Navoi at the time of enquiry, along with confirmed lead time." },
      { q: "How does delivery work since Uzbekistan is landlocked?", a: "Machinery moves by sea to a regional port and then by rail or road, or by direct air freight for time-sensitive shipments to Tashkent or the Navoi cargo hub; our export team confirms the fastest current route when you enquire." },
      { q: "Will the machine run on Uzbek industrial power?", a: "Our machines are configured for 380 V 3-phase 50 Hz supply, the standard across Uzbek industrial facilities, so no additional transformer is required." },
      { q: "How is installation and operator training handled?", a: "We begin with remote video commissioning by our engineering team, followed by an on-site engineer visit for final calibration, safety checks and hands-on operator training." },
      { q: "What warranty and spares support do you offer?", a: "Every machine carries a 24-month warranty on the laser source, drive and control system, with wear spares dispatched by the most reliable available air or rail route." },
      { q: "What payment terms do you offer Uzbek buyers?", a: "Standard terms are 30 percent advance with the purchase order and 70 percent against pre-shipment inspection video and shipping documents, settled by wire transfer in US dollars." },
      { q: "What is the typical lead time before shipment?", a: "Production lead time is typically 6 to 8 weeks from confirmed order and specification, plus onward transit time once the routing is confirmed." },
      { q: "What documents will we receive for customs clearance?", a: "We supply a CE declaration of conformity, ISO 9001:2015 certificate, commercial invoice, packing list and certificate of origin for your customs clearing agent." },
    ],
  },
];
