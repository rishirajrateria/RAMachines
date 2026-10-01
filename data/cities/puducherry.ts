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
    recommendedFamilies: ["fiber-laser-cutting-machines", "robotic-welding-systems", "mig-tig-arc-welding-machines"],
    nearbyCitySlugs: ["karaikal"],
    logisticsNote: "Puducherry is on the same NH16 East Coast corridor used for Chennai deliveries from our Kolkata headquarters, roughly 1,750 km, with typical road and rail freight transit of 6–9 working days.",
    faqs: [
      { q: "How can a Sedarapet auto-ancillary or Puducherry Industrial Estate unit get a quote and demonstration?", a: "Share your component drawings and typical material thickness with our sales team for a tailored quote. We can arrange a demonstration on a sample part, such as an auto-ancillary bracket or a pharma-equipment panel, before you finalise your order for your Puducherry facility." },
      { q: "What is the delivery and installation timeline for Puducherry?", a: "Build time depends on the configuration and is confirmed with your quote; once dispatched, transit from Kolkata via the NH16 East Coast corridor through Chennai typically takes 6–9 working days. RA Machine engineers then complete on-site installation and commissioning at your Puducherry facility, typically finishing calibration within a day." },
      { q: "How quickly can repairs and service support reach a Puducherry plant?", a: "Support starts with remote diagnostics over phone or video within 4 working hours of your call, which resolve many control and software issues without a visit. For mechanical faults on RA Machine equipment, engineers are dispatched from our Kolkata headquarters within 48 hours along the Chennai corridor, and warranty repairs and genuine spare parts are handled directly by our service team." },
      { q: "Is operator training available for Puducherry's auto-ancillary and pharma workforce?", a: "Yes, on-site training accompanies every installation, covering safe operation, cutting and welding parameters for both auto-component sheet metal and pharma-equipment fittings, and routine maintenance. This suits Puducherry's mixed manufacturing base around the Sedarapet belt and industrial estate." },
      { q: "Which machine fits Puducherry's auto-ancillary and pharma-equipment industry best?", a: "A CNC fiber laser cutting machine covers the auto-ancillary brackets and pharma-equipment panels cut in Sedarapet and the Puducherry Industrial Estate. Auto-ancillary suppliers welding the same assembly in volume can add a cobot or robotic welding system configured to that part, while TIG welding machines give pharma-equipment makers the clean stainless joints their customers expect." },
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
    recommendedFamilies: ["cnc-plasma-cutting-machines", "mig-tig-arc-welding-machines", "fiber-laser-cutting-machines"],
    nearbyCitySlugs: ["puducherry"],
    logisticsNote: "Karaikal is reached via the same NH16 corridor as Puducherry from our Kolkata headquarters, roughly 1,800 km, with typical road and rail freight transit of 6–9 working days.",
    faqs: [
      { q: "How can a Karaikal agro-processing or general fabrication unit get a quote and demonstration?", a: "Send your equipment-frame or component drawings to our sales team for a costed quote. We arrange a demonstration, either remotely over video or on a sample of your own frame material, so you can evaluate results before ordering for your Karaikal facility." },
      { q: "What is the delivery and installation timeline for Karaikal?", a: "Build time is confirmed at the quotation stage, and transit from Kolkata via the NH16 corridor through Chennai and Puducherry generally takes 6–9 working days after dispatch. Our engineers then handle on-site installation and commissioning at your Karaikal facility, completing calibration within a day." },
      { q: "How fast is repair and service response for a Karaikal plant?", a: "Remote diagnostics over phone or video begin within 4 working hours of your call and resolve many faults without a visit. For on-site repairs to RA Machine equipment, engineers are dispatched from our Kolkata headquarters within 48 hours along the NH16 corridor, and our service team supplies genuine spares and handles warranty claims directly, so smaller units are not left sourcing parts locally." },
      { q: "Does RA Machine train operators for Karaikal's agro-processing and fabrication workforce?", a: "Yes, every installation includes on-site training covering safe operation, cutting and welding parameters for agro-processing equipment frames, and routine maintenance, suited to Karaikal's emerging industrial estate and its growing base of small fabrication units." },
      { q: "Which machine suits Karaikal's agro-processing and general fabrication industry best?", a: "For Karaikal's emerging estate, where budgets matter, a CNC plasma cutting machine is an economical way to cut the mild-steel plate used in agro-processing frames and port-linked repair work. MIG and MMA welding machines handle the assembly that follows, and a CNC fiber laser cutting machine becomes worthwhile as finer, repeat sheet-metal work grows alongside the industrial base." },
    ],
    isTop: false,
  },
];
