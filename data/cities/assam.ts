/** data/cities/assam.ts — part of the RA Machine city dataset. See data/cities.ts for the full editing guide. */
import type { City } from "../types";

export const cities: City[] = [
  {
    slug: "guwahati",
    name: "Guwahati",
    stateSlug: "assam",
    overview: [
      "Guwahati is the commercial and logistics gateway to all of North-East India, with a fabrication base built around general engineering, structural steel for the city's expanding road and building projects, and equipment servicing the wider tea trade that moves through its markets and warehouses.",
      "Workshops around the city's industrial pockets fabricate storage tanks, conveyor structures and processing-line components for tea gardens across Assam, alongside routine sheet-metal work for construction and transport operators based here.",
    ],
    industries: ["general engineering fabrication", "tea-industry equipment", "structural steel for construction", "sheet-metal and enclosures", "transport and logistics equipment"],
    industrialAreas: ["Bamunimaidam industrial estate", "Amingaon industrial area", "North Guwahati small-scale units"],
    recommendedFamilies: ["fiber-laser-cutting-machines", "cnc-plasma-cutting-machines", "mig-tig-arc-welding-machines"],
    nearbyCitySlugs: ["dibrugarh", "silchar", "tinsukia"],
    logisticsNote: "Guwahati is reached via NH27 through the Siliguri corridor, roughly 1,000 km from our Kolkata works, with typical road/rail transit of 3–5 days.",
    faqs: [
      { q: "How can a Guwahati fabrication unit get a quote and see a machine demonstration?", a: "Share your material type, thickness and typical job sizes through our enquiry form or WhatsApp, and we will return a tailored quotation along with sample cutting videos. Where useful, we arrange a live video demonstration on material matching your own before you commit to an order." },
      { q: "What is the typical delivery and installation timeline for a machine ordered in Guwahati?", a: "Machines dispatch from our Kolkata works and travel via the Siliguri corridor on NH27, reaching Guwahati in roughly 3–5 days. Our engineers then travel to site for unpacking, levelling, electrical commissioning and initial cutting trials, with installation usually complete within a week of arrival." },
      { q: "How quickly can Guwahati units get on-site repair or service support?", a: "Most faults are first diagnosed remotely by our support desk within hours to limit downtime. Where a physical visit is required, engineers are dispatched from our Kolkata headquarters to Guwahati, and warranty repairs and spare parts are coordinated through the same service desk for tea-equipment and construction-linked fabricators alike." },
      { q: "Is operator training available for teams in Guwahati?", a: "Yes, every installation includes hands-on training for your operators at your Guwahati facility, covering nesting software, cutting parameters, routine maintenance and safety protocols. Refresher sessions and remote guidance calls are available afterwards, useful for shops that run multiple shifts to serve the wider North-East market." },
      { q: "Which RA Machine family suits Guwahati's general engineering and tea-equipment work best?", a: "For the sheet-metal enclosures and mixed general fabrication that fill most Guwahati job books, a CNC fiber laser cutting machine covers the widest range of work. Shops cutting heavier plate for tea-garden tanks, conveyor structures and construction steel often find a CNC plasma cutting machine more economical, and MIG, TIG and MMA welding machines handle the assembly behind both." },
    ],
  },
  {
    slug: "dibrugarh",
    name: "Dibrugarh",
    stateSlug: "assam",
    overview: [
      "Dibrugarh sits at the heart of Assam's tea belt and is also a base for ONGC and Oil India-linked oilfield engineering, giving the town an unusual pairing of tea-processing machinery fabrication and equipment work tied to upper Assam's oil and gas operations.",
      "Local workshops build and repair tea-garden processing parts, storage structures and general oilfield support fixtures, serving both the plantation economy around the town and the wider hydrocarbon operations of the region.",
    ],
    industries: ["tea-processing machinery", "oilfield equipment and support fixtures", "general engineering fabrication", "structural steel work", "sheet-metal enclosures"],
    industrialAreas: ["Dibrugarh industrial growth centre", "Chabua road industrial pocket"],
    recommendedFamilies: ["cnc-plasma-cutting-machines", "mig-tig-arc-welding-machines", "fiber-laser-cutting-machines"],
    nearbyCitySlugs: ["guwahati", "silchar", "tinsukia"],
    logisticsNote: "Dibrugarh is reached via NH27 through the Siliguri corridor and onward Assam highways, roughly 1,350 km from our Kolkata works, with typical road/rail transit of 4–6 days.",
    faqs: [
      { q: "How can a Dibrugarh tea-equipment or oilfield workshop get a quote and see a demo?", a: "Send us your material type, thickness and typical part sizes, and we will prepare a tailored quotation along with sample cutting and welding videos. Where helpful, we can arrange a live video demonstration on parts like those made for Dibrugarh's tea or oilfield-linked fabrication trade." },
      { q: "What is the delivery and installation timeline for a machine ordered in Dibrugarh?", a: "Machines dispatch from our Kolkata works via the Siliguri corridor and onward Assam highways, typically reaching Dibrugarh in 4–6 days. Our engineers then handle on-site installation, electrical commissioning and trial runs, with most facilities operational within a week of arrival." },
      { q: "How quickly can Dibrugarh units get on-site repair or service support?", a: "Remote diagnostics over call and video resolve most faults within hours. For issues needing a physical visit, engineers are dispatched from our Kolkata headquarters, and booking routine checks outside the peak processing months matters for tea-garden fabricators working to seasonal deadlines." },
      { q: "Do you offer operator training for Dibrugarh's tea and oilfield-linked workforce?", a: "Yes, training is included with every installation and covers safe operation, process settings and routine maintenance suited to both tea-machinery repair work and oilfield support fabrication. Refresher sessions and remote troubleshooting are available afterwards as your operators gain experience on the machine." },
      { q: "Which machine best fits Dibrugarh's tea-industry and oilfield engineering base?", a: "Oilfield support fixtures and structural frames around Dibrugarh are typically cut from mild steel plate, where a CNC plasma cutting machine offers the best value, and MIG, TIG and MMA welding machines handle both new fabrication and the repairs tea gardens send in each season. For thinner sheet-metal parts on tea-processing machinery, a CNC fiber laser cutting machine gives cleaner, more precise edges." },
    ],
  },
  {
    slug: "silchar",
    name: "Silchar",
    stateSlug: "assam",
    overview: [
      "Silchar anchors the Barak Valley's economy around the regional tea trade and a long-standing bamboo-based industry, alongside a base of general fabrication workshops that serve local construction and small manufacturing needs across southern Assam.",
      "Fabricators here work on tea-warehouse and processing structures, bamboo-processing equipment, and routine building-linked steelwork, reflecting a smaller but steady demand for precise sheet-metal cutting in the valley.",
    ],
    industries: ["tea-trade and warehouse equipment", "bamboo-based industry equipment", "general fabrication", "structural steel for construction", "sheet-metal enclosures"],
    industrialAreas: ["Silchar industrial growth centre", "Meherpur small-scale industrial area"],
    recommendedFamilies: ["fiber-laser-cutting-machines", "mig-tig-arc-welding-machines"],
    nearbyCitySlugs: ["guwahati", "dibrugarh", "tinsukia"],
    logisticsNote: "Silchar is reached via NH27 through the Siliguri corridor and onward into the Barak Valley, roughly 1,300 km from our Kolkata works, with typical road/rail transit of 4–6 days.",
    faqs: [
      { q: "How can a Silchar workshop get a quote and see a machine demonstration?", a: "Share your material type, thickness and typical job sizes through our enquiry form or WhatsApp, and we will send a tailored quotation with sample cutting videos. A live video demonstration on sheet similar to yours can also be arranged before you finalise your order." },
      { q: "What is the delivery and installation timeline for a machine ordered in Silchar?", a: "Machines dispatch from our Kolkata works and travel via the Siliguri corridor into the Barak Valley, reaching Silchar in roughly 4–6 days. Our engineers then complete on-site installation, electrical commissioning and cutting trials, with most units operational within a week of arrival." },
      { q: "How quickly can Silchar units get on-site repair or service support?", a: "Most issues are resolved through remote diagnostics within hours. Where a physical visit is needed, engineers are dispatched from our Kolkata headquarters to Silchar, and visits can be planned around the tea season for Barak Valley fabricators serving the tea-trade and bamboo industries." },
      { q: "Is operator training available for Silchar-based teams?", a: "Yes, every installation includes hands-on training covering safe operation, nesting software and routine maintenance, tailored to the tea-warehouse and bamboo-equipment fabrication common in Silchar. Refresher sessions and remote guidance calls remain available as your operators build experience on the machine." },
      { q: "Which machine suits Silchar's tea-trade and bamboo-linked fabrication base?", a: "For the sheet-metal panels, guards and enclosures that go into tea-warehouse and bamboo-processing equipment, a CNC fiber laser cutting machine is the practical choice in Silchar, giving accurate parts with little rework. MIG and TIG welding machines then take care of the frames and structural steel for warehouses and building projects across the valley." },
    ],
  },
  {
    slug: "tinsukia",
    name: "Tinsukia",
    stateSlug: "assam",
    overview: [
      "Tinsukia sits in Assam's upper reaches where oil and tea-industry activity overlap, giving the town's fabrication trade a focus on equipment and structural work linked to both oilfield operations and the surrounding tea gardens.",
      "Local workshops fabricate support structures, storage fixtures and general engineering parts for these two industries, making Tinsukia a smaller but steady market for precise metal-cutting capacity in Assam's far east.",
    ],
    industries: ["oilfield-linked engineering", "tea-processing equipment", "general engineering fabrication", "structural steel work", "sheet-metal enclosures"],
    industrialAreas: ["Tinsukia industrial growth centre", "Digboi road small-scale units"],
    recommendedFamilies: ["cnc-plasma-cutting-machines", "mig-tig-arc-welding-machines", "submerged-arc-welding-machines"],
    nearbyCitySlugs: ["guwahati", "dibrugarh", "silchar"],
    logisticsNote: "Tinsukia is reached via NH27 through the Siliguri corridor and onward Assam highways, roughly 1,430 km from our Kolkata works, with typical road/rail transit of 4–6 days.",
    faqs: [
      { q: "How can a Tinsukia oilfield or tea-equipment workshop get a quote and see a demo?", a: "Send your material type, thickness and typical part sizes, and we will prepare a tailored quotation with sample cutting and welding videos. Where useful, we can arrange a live video demonstration on sample material matching the oil and tea-linked jobs your Tinsukia workshop handles." },
      { q: "What is the delivery and installation timeline for a machine ordered in Tinsukia?", a: "Machines dispatch from our Kolkata works via the Siliguri corridor and onward Assam highways, typically reaching Tinsukia in 4–6 days. Our engineers then handle on-site installation, electrical commissioning and trial runs, with most facilities operational within a week of arrival." },
      { q: "How quickly can Tinsukia units get on-site repair or service support?", a: "Remote diagnostics over call and video resolve most faults within hours. For issues needing a physical visit, engineers are dispatched from our Kolkata headquarters, with warranty repairs and spare parts coordinated through the same service desk for oilfield and tea-industry fabricators around Tinsukia." },
      { q: "Do you offer operator training for Tinsukia's workforce?", a: "Yes, training is included with every installation and covers safe operation, nesting software and routine maintenance suited to oilfield support fixtures and tea-processing equipment. Refresher sessions and remote troubleshooting are available afterwards as your operators gain experience on the machine." },
      { q: "Which machine best fits Tinsukia's oil and tea-industry engineering base?", a: "Tinsukia's oilfield-linked work leans on plate: a CNC plasma cutting machine cuts support structures and storage fixtures economically, and a submerged arc welding (SAW) machine suits the long seams on tanks and pipe-related fabrication. For tea-processing equipment and general repairs, MIG, TIG and MMA welding machines give workshops flexibility across both of the town's core industries." },
    ],
  },
];
