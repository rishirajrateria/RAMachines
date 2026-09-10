/**
 * data/countries/oceania.ts — Country entries for the Oceania region.
 * Part of the data/countries/ split; re-exported by the data/countries.ts barrel.
 */
import type { Country } from "../types";

export const oceaniaCountries: Country[] = [
  {
    slug: "australia",
    name: "Australia",
    region: "Oceania",
    adjective: "Australian",
    overview: [
      "Australia's manufacturing sector, though smaller relative to its resources industry, is well capitalised and geographically concentrated around Western Sydney, Melbourne's Dandenong corridor and Brisbane, spanning general engineering, mining equipment fabrication and construction-linked metalwork. High local labour costs have made automation, including fiber laser cutting and robotic welding, a priority investment area for Australian fabricators seeking to remain competitive.",
      "Australian buyers are accustomed to importing capital equipment from Europe, Japan and China, and the Australia-India Economic Cooperation and Trade Agreement (ECTA) has meaningfully improved the commercial and tariff environment for Indian exporters entering the Australian market.",
      "Australia's strict workplace health and safety culture means documentation and machine safety features are closely scrutinised, and Indian manufacturers who supply full CE technical files alongside clear operating and safety documentation are well positioned to meet these expectations.",
    ],
    whyIndia: [
      "The Australia-India ECTA has reduced tariff and trade friction, giving Indian machinery a clearer commercial pathway into the Australian market than before the agreement.",
      "Pricing well below European and Japanese brands suits Australian fabricators facing high local labour costs and seeking automation investment with a faster payback period.",
      "CE marking and full technical documentation meet the rigorous workplace health and safety documentation expectations of Australian industrial buyers and regulators.",
      "A relatively close time zone (4.5 to 5.5 hours ahead of India depending on the Australian state and daylight saving) supports convenient scheduling for remote diagnostics within a shared working window.",
    ],
    sectors: [
      {
        name: "General engineering and metal fabrication",
        zones: ["Western Sydney, New South Wales"],
        products: ["structural steel", "enclosures", "custom fabrication"],
        note: "Western Sydney's dense industrial base is Australia's largest concentration of contract metal fabrication businesses.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "General manufacturing — Melbourne",
        zones: ["Dandenong, Victoria"],
        products: ["equipment frames", "structural components", "custom parts"],
        note: "The Dandenong corridor's established manufacturing precinct supports steady demand for mid to high-power fiber laser machines.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f6020-hd"],
      },
      {
        name: "Mining equipment fabrication",
        zones: ["Brisbane, Queensland", "Perth, Western Australia"],
        products: ["equipment components", "wear parts", "structural repairs"],
        note: "Workshops supporting Australia's mining sector in Queensland and Western Australia need heavy-duty thick-plate cutting capacity.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k"],
      },
      {
        name: "Robotic welding for structural fabrication",
        zones: ["Western Sydney", "Dandenong"],
        products: ["welded structural assemblies", "equipment frames"],
        note: "High local labour costs make robotic MIG welding cells an increasingly attractive investment for repetitive structural welding work.",
        recommendedProductSlugs: ["ra-rw6", "ra-rw10"],
      },
    ],
    ports: ["Port of Melbourne", "Port Botany, Sydney", "Port of Brisbane"],
    airports: ["Sydney Kingsford Smith Airport", "Melbourne Airport"],
    voltage: "415 V 3-phase",
    frequency: "50 Hz",
    currency: "AUD (Australian Dollar)",
    currencyNote: "Quotations are issued in US dollars as our standard export currency; buyers may request an indicative Australian dollar figure for internal budgeting purposes.",
    shippingNote: "Sea freight from Kolkata or Haldia to Melbourne or Sydney typically transships via Singapore or Colombo with an indicative transit of 22–30 days. CIF delivery is available to your nearest Australian port alongside standard FOB Kolkata terms.",
    regulatoryNote: "Australia generally accepts CE-marked machinery as supporting evidence for local Work Health and Safety compliance, though buyers should confirm any state-specific requirements with their own safety officer; under the Australia-India ECTA, qualifying machinery benefits from preferential or nil import duty, which the buyer's customs broker can confirm.",
    faqs: [
      { q: "How do we request a quotation for delivery to Australia?", a: "Send your required cutting or welding specification through our enquiry form and we will issue a US-dollar quotation with FOB Kolkata and CIF options to Melbourne, Sydney or Brisbane, along with confirmed lead time." },
      { q: "What shipping terms and transit time apply to Australia?", a: "We ship FOB Kolkata as standard with CIF available to your nearest Australian port. Transit is indicatively 22 to 30 days, typically transshipping via Singapore or Colombo." },
      { q: "Does the ECTA reduce import duty on our machine?", a: "Machinery qualifying under the Australia-India Economic Cooperation and Trade Agreement generally benefits from preferential import duty; we provide the certificate of origin and supporting documentation your customs broker needs to claim this." },
      { q: "Will the machine run on Australian industrial power?", a: "Our machines are configured for 415 V 3-phase 50 Hz supply, the standard across Australian industrial facilities, so no additional transformer is required." },
      { q: "How is installation and operator training carried out in Australia?", a: "We begin with remote video commissioning by our engineering team, followed by an on-site engineer visit for final calibration, safety checks and hands-on operator training scheduled around your production plan." },
      { q: "What warranty and spares support do you provide?", a: "Every machine carries a 24-month warranty on the laser source, drive and control system, with wear spares such as nozzles and lenses stocked for prompt air-freight dispatch to Australian addresses." },
      { q: "What payment terms apply to Australian orders?", a: "Standard terms are 30 percent advance with the purchase order and 70 percent against pre-shipment inspection video and shipping documents, settled by wire transfer in US dollars." },
      { q: "What is the typical lead time before shipment?", a: "Production lead time is typically 6 to 8 weeks from confirmed order and specification, with an exact shipping date confirmed once the vessel is booked." },
    ],
    isTop: true,
  },
];
