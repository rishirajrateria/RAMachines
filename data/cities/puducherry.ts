/** data/cities/puducherry.ts — part of the RA Machine city dataset. See data/cities.ts for the full editing guide. */
import type { City } from "../types";

export const cities: City[] = [
  {
    slug: "puducherry",
    name: "Puducherry",
    stateSlug: "puducherry",
    overview: [
      "Puducherry's industrial base centres on the Puducherry Industrial Estate and the Sedarapet auto-ancillary belt, which together host a mix of pharmaceutical, auto-ancillary and general engineering manufacturers benefiting from the union territory's investment incentives.",
      "This diverse manufacturing mix means Puducherry fabricators handle everything from precision auto-component sheet work to general engineering fittings, supporting a steady demand for accurate, repeatable metal cutting close to the Bay of Bengal coast.",
    ],
    industries: ["auto-ancillary fabrication", "pharma-equipment components", "general engineering", "sheet-metal fittings"],
    industrialAreas: ["Puducherry Industrial Estate", "Sedarapet auto-ancillary belt"],
    recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
    nearbyCitySlugs: ["karaikal"],
    logisticsNote: "Puducherry is on the same NH16 East Coast corridor used for Chennai deliveries from our Kolkata headquarters, roughly 1,750 km, with typical road and rail freight transit of 6–9 working days.",
    faqs: [
      { q: "How can a Sedarapet auto-ancillary or Puducherry Industrial Estate unit get a quote and demonstration?", a: "Share your component drawings and typical material thickness with our sales team for a tailored quote. We can arrange a demonstration cut on a sample part, referencing comparable auto-ancillary or pharma-equipment installations, before you finalise your order for your Puducherry facility." },
      { q: "What is the delivery and installation timeline for Puducherry?", a: "Manufacturing typically takes 6–8 weeks, plus 6–9 working days of transit from Kolkata via the NH16 East Coast corridor through Chennai. RA Machine engineers then complete on-site installation and commissioning at your Puducherry facility, typically finishing calibration within a day." },
      { q: "How quickly can repairs and AMC support reach a Puducherry plant?", a: "Remote diagnostics begin within 4 working hours of your call, resolving many control and software issues immediately. For mechanical faults, engineers are dispatched from Kolkata headquarters, typically reaching Puducherry within 48–72 hours given its proximity to Chennai, with an annual maintenance contract available." },
      { q: "Is operator training available for Puducherry's auto-ancillary and pharma workforce?", a: "Yes, on-site training accompanies every installation, covering safe operation, parameter tuning for both auto-component sheet metal and pharma-equipment fittings, and routine maintenance. This suits Puducherry's mixed manufacturing base around the Sedarapet belt and industrial estate." },
      { q: "Which machine fits Puducherry's auto-ancillary and pharma-equipment industry best?", a: "The RA-F3015-Pro 3kW fiber laser handles the general auto-ancillary and pharma-equipment sheet-metal fabrication common in Sedarapet and the Puducherry Industrial Estate, while the compact RA-F1530 suits smaller units cutting thinner gauge components." },
    ],
    isTop: false,
  },
  {
    slug: "karaikal",
    name: "Karaikal",
    stateSlug: "puducherry",
    overview: [
      "Karaikal is a smaller port town within the union territory of Puducherry, with an emerging industrial estate that has begun attracting agro-processing and general fabrication units alongside the town's traditional port and fishing trades.",
      "As this industrial base develops, Karaikal's workshops increasingly need accurate sheet-metal cutting for agro-processing equipment frames and general fabrication goods, supporting steady growth in the town's small manufacturing sector.",
    ],
    industries: ["agro-processing equipment fabrication", "general fabrication", "port-linked engineering"],
    industrialAreas: ["Karaikal industrial estate"],
    recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
    nearbyCitySlugs: ["puducherry"],
    logisticsNote: "Karaikal is reached via the same NH16 corridor as Puducherry from our Kolkata headquarters, roughly 1,800 km, with typical road and rail freight transit of 6–9 working days.",
    faqs: [
      { q: "How can a Karaikal agro-processing or general fabrication unit get a quote and demonstration?", a: "Send your equipment-frame or component drawings to our sales team for a costed quote. We arrange a demonstration cut, either remotely or referencing a comparable agro-processing installation, so you can evaluate results before ordering for your Karaikal facility." },
      { q: "What is the delivery and installation timeline for Karaikal?", a: "Manufacturing generally takes 6–8 weeks, with a further 6–9 working days of transit from Kolkata via the NH16 corridor through Chennai and Puducherry. Our engineers then handle on-site installation and commissioning at your Karaikal facility, completing calibration within a day." },
      { q: "How fast is repair and AMC response for a Karaikal plant?", a: "Remote diagnostics start within 4 working hours of your call and resolve many faults without a visit. For on-site repairs, engineers are dispatched from Kolkata headquarters, typically reaching Karaikal within 48–72 hours, with an annual maintenance contract available for scheduled servicing." },
      { q: "Does RA Machine train operators for Karaikal's agro-processing and fabrication workforce?", a: "Yes, every installation includes on-site training covering safe operation, cutting-parameter selection for agro-processing equipment frames, and routine maintenance, suited to Karaikal's emerging industrial estate and its growing base of small fabrication units." },
      { q: "Which machine suits Karaikal's agro-processing and general fabrication industry best?", a: "The compact RA-F1530 1.5kW fiber laser suits the thinner-gauge equipment-frame work typical of Karaikal's smaller fabricators, while the RA-F3015-Pro adds capacity for thicker general fabrication jobs as the industrial estate's manufacturing base grows." },
    ],
    isTop: false,
  },
];
