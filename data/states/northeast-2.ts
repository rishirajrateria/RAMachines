/**
 * data/states/northeast-2.ts — State entries for the North-East region (batch 2):
 * Mizoram, Nagaland, Sikkim, Tripura.
 * See data/types.ts for the State/StateIndustry/FaqItem interfaces and
 * data/india-index.ts for the canonical slug/name/tier/region list.
 * To edit: change fields directly. To add a state, append another object
 * matching the State interface below (or start a new sibling file for
 * the next batch and re-export it from the data/states.ts barrel).
 */
import type { State, StateIndustry, FaqItem } from "../types";

export const northeast2States: State[] = [
  {
    slug: "mizoram",
    name: "Mizoram",
    type: "state",
    tier: "small",
    region: "North-East",
    capital: "Aizawl",
    overview: [
      "Mizoram's economy sits on steep, forested hill terrain that limits large-scale industry, but the state holds some of India's richest bamboo reserves and has become a focus area for the National Bamboo Mission, feeding small processing units around Aizawl and Kolasib that turn raw culms into handicraft blanks, incense sticks and furniture components. Traditional Mizo handloom weaving, centred on puanchei shawls, remains a significant cottage-level activity around Aizawl.",
      "Kolasib, on NH-306 near the Assam border, functions as a logistics gateway for goods moving between Aizawl and Silchar. Horticultural exports such as Mizo chilli and passion fruit are driving new small food-processing investment, and workshops fabricating bamboo-processing machinery parts and handloom fittings increasingly need precision-cut metal components rather than hand-finished ones.",
    ],
    industries: [
      {
        name: "Bamboo processing machinery",
        clusters: ["Aizawl", "Kolasib"],
        products: ["bamboo splitting and processing jigs", "machine frames", "tooling holders"],
        note: "Mizoram's bamboo processing units, encouraged under the National Bamboo Mission, need precisely cut jigs and machine frames for splitting and treatment equipment, work suited to a compact fiber laser running mixed small batches.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Food processing and horticulture equipment",
        clusters: ["Aizawl", "Lunglei"],
        products: ["processing line components", "storage racks", "chilli and passion fruit processing parts"],
        note: "Growing Mizo chilli and passion fruit processing investment around Aizawl and Lunglei needs stainless and mild steel fabricated parts for processing lines, work a general-purpose fiber laser handles accurately.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Handloom and handicraft machinery",
        clusters: ["Aizawl"],
        products: ["loom fittings", "frame components", "workbench tooling"],
        note: "Aizawl's handloom and handicraft sector fabricates metal fittings and frame components for looms and workbenches, a low-volume, high-mix job well matched to a compact fiber laser.",
        recommendedProductSlugs: ["ra-f1530"],
      },
    ],
    industrialAreas: ["Zuangtui Industrial Estate (Aizawl)", "Kolasib Industrial Growth Centre"],
    logisticsNote: "Consignments from Kolkata to Aizawl transit via the Siliguri corridor onto NH-27 and then NH-306 through Assam and Cachar, a road route that typically takes 6-8 days given the hill terrain beyond Silchar. Air freight from Kolkata to Aizawl airport is the practical option for urgent spares and smaller components.",
    neighbouringStateSlugs: ["assam", "manipur", "tripura"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in Mizoram?", a: "Share your material thickness, bed size and expected production volume through our enquiry form, and our team issues a formal quotation with ex-works Kolkata pricing for delivery to Aizawl, Kolasib or Lunglei. Given Mizoram's hill terrain and distance from Kolkata, we also confirm a realistic delivery window at the quotation stage." },
      { q: "How long does delivery and installation take from Kolkata to Mizoram?", a: "Consignments to Aizawl typically take 6-8 days by road via the Siliguri corridor and NH-306 through Assam, given the hill terrain beyond Silchar. Engineers from our Kolkata headquarters then travel to site for installation and commissioning, usually completed within a week of the machine's arrival at your Mizoram facility." },
      { q: "Is on-site service and AMC coverage available in Mizoram?", a: "Yes. On-site service and annual maintenance contract visits for Mizoram are handled by engineers dispatched from our Kolkata headquarters, covering Aizawl, Kolasib and Lunglei, backed by remote diagnostics that resolve many faults without a site visit. Given the transit distance, AMC customers are encouraged to plan routine servicing in advance." },
      { q: "Can operators be trained locally or must they travel to Kolkata?", a: "We provide on-site operator training at your Aizawl or Kolasib facility during installation, covering machine operation, nesting software and maintenance. Operators who prefer structured classroom sessions can instead travel to RA Machine's training centre at our Kolkata headquarters for hands-on instruction." },
      { q: "Which RA Machine model suits Mizoram's bamboo processing industry?", a: "For Mizoram's bamboo processing sector around Aizawl and Kolasib, the RA-F1530 fiber laser is well suited to cutting jigs, machine frames and tooling components in mixed small batches. Its compact bed size and lower power draw also suit workshops with the limited factory infrastructure typical of the state." },
      { q: "How does GST and interstate logistics work for a machine purchase in Mizoram?", a: "Domestic buyers in Mizoram purchase under standard GST invoicing, and we handle GST-compliant documentation for interstate transport from Kolkata. Because road transit runs 6-8 days, we recommend ordering consumables and spares in advance, and we can advise on financing options through your bank or NBFC partner alongside the delivery schedule." },
    ],
  },
  {
    slug: "nagaland",
    name: "Nagaland",
    type: "state",
    tier: "small",
    region: "North-East",
    capital: "Kohima",
    overview: [
      "Nagaland's manufacturing base is concentrated almost entirely around Dimapur, the state's only rail-linked and lowland commercial town, since Kohima and other hill districts remain largely non-industrial. Bamboo, abundant across Naga hill forests, supports small processing and handicraft units, while traditional Naga shawl weaving continues as a significant handloom activity across Kohima, Mokokchung and Dimapur.",
      "Dimapur's Ganeshnagar Industrial Estate and Industrial Growth Centre host most of the state's registered small-scale units, fabricating structural steel, gates and fixtures for the road, bridge and building works that dominate Nagaland's hill-terrain infrastructure spending. This construction-linked fabrication demand, alongside bamboo and handloom machinery needs, is where precision metal cutting adds the most value.",
    ],
    industries: [
      {
        name: "Bamboo and handloom machinery",
        clusters: ["Dimapur", "Kohima"],
        products: ["bamboo processing jigs", "loom fittings", "handicraft tooling"],
        note: "Bamboo processing and Naga shawl weaving units across Dimapur and Kohima need accurately cut jigs and loom fittings, work suited to a compact fiber laser handling mixed small batches.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Small engineering for infrastructure works",
        clusters: ["Dimapur"],
        products: ["structural brackets", "gates and grilles", "road and bridge fabrication components"],
        note: "Nagaland's hill-terrain road and bridge construction programmes rely on Dimapur workshops to fabricate structural brackets, gates and grilles, work that benefits from accurate, repeatable fiber laser cutting over manual methods.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Food and horticulture processing",
        clusters: ["Dimapur", "Kohima"],
        products: ["chilli and ginger processing equipment parts", "storage racks"],
        note: "Nagaland's King Chilli and ginger cultivation is generating modest food-processing investment around Dimapur, needing stainless and mild steel fabricated parts for processing and storage equipment.",
        recommendedProductSlugs: ["ra-f1530"],
      },
    ],
    industrialAreas: ["Ganeshnagar Industrial Estate (Dimapur)", "Dimapur Industrial Growth Centre"],
    logisticsNote: "Consignments from Kolkata to Dimapur move via the Siliguri corridor and NH-27 through Assam, a route that typically takes 5-7 days by road, with Dimapur's rail link on the Northeast Frontier Railway offering an alternative for bulk freight. Onward transport from Dimapur to Kohima and other hill districts adds further transit time given the terrain, and air freight from Kolkata to Dimapur is the fastest option for urgent spares.",
    neighbouringStateSlugs: ["assam", "manipur", "arunachal-pradesh"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in Nagaland?", a: "Share your material thickness, bed size and expected production volume through our enquiry form, and we issue a formal quotation with ex-works Kolkata pricing for delivery to Dimapur or onward to Kohima. Since Nagaland's hill terrain adds transit time beyond Dimapur, we confirm a realistic delivery schedule at the quotation stage." },
      { q: "How long does delivery and installation take from Kolkata to Nagaland?", a: "Consignments to Dimapur typically take 5-7 days by road via the Siliguri corridor and NH-27 through Assam, with rail freight available as an alternative for bulk shipments. Onward delivery to Kohima or other hill districts adds further time, and engineers from our Kolkata headquarters travel to site for installation and commissioning once the machine arrives." },
      { q: "Is on-site service and AMC coverage available in Nagaland?", a: "Yes. On-site service and annual maintenance contract visits for Nagaland are handled by engineers dispatched from our Kolkata headquarters, covering Dimapur, Kohima and Mokokchung, supported by remote diagnostics that resolve many issues without a site visit. Given transit distance, we recommend scheduling AMC visits in advance to align with your production calendar." },
      { q: "Can operators be trained locally or must they travel to Kolkata?", a: "We provide on-site operator training at your Dimapur or Kohima facility during installation, covering machine operation, nesting software and routine maintenance. Operators who prefer structured classroom instruction can travel to RA Machine's training centre at our Kolkata headquarters instead." },
      { q: "Which RA Machine model suits Nagaland's leading industry?", a: "For Nagaland's Dimapur-based infrastructure fabrication and bamboo and handloom machinery workshops, the RA-F1530 fiber laser suits compact, mixed small-batch work, while the RA-F3015 Pro handles higher-volume structural fabrication for road and bridge project components. Both machines fit the lower-power infrastructure typical of Dimapur workshops." },
      { q: "How does GST and interstate logistics work for a machine purchase in Nagaland?", a: "Domestic buyers in Nagaland purchase under standard GST invoicing, and we provide GST-compliant documentation for interstate transport from Kolkata to Dimapur. Given road transit of 5-7 days, we recommend ordering spares and consumables ahead of schedule, and we can advise on financing options through your bank or NBFC partner alongside your order." },
    ],
  },
  {
    slug: "sikkim",
    name: "Sikkim",
    type: "state",
    tier: "small",
    region: "North-East",
    capital: "Gangtok",
    overview: [
      "Sikkim's manufacturing sector is unusually concentrated for its size, built around a cluster of bulk drug and formulation pharmaceutical units at Rangpo, Singtam and Kumrek that took root under early-2000s central excise incentives and continue to operate despite the later shift to GST. This pharma base gives Sikkim a more organised manufacturing profile than its North-Eastern neighbours, with equipment fabrication and stainless steel process components in regular demand.",
      "The state is also India's largest producer of large cardamom, and food-processing units around Rangpo and Singtam convert cardamom and other spices into packaged goods. Steep Himalayan terrain confines almost all industrial activity to the Rangpo-Singtam corridor near the West Bengal border, close to the Siliguri gateway that handles nearly all of Sikkim's freight movement.",
    ],
    industries: [
      {
        name: "Pharmaceuticals",
        clusters: ["Rangpo", "Singtam", "Kumrek"],
        products: ["bulk drug and formulation equipment parts", "stainless process components", "machine guarding"],
        note: "Sikkim's bulk drug and formulation units around Rangpo and Kumrek need precisely cut stainless steel process components and equipment guarding, work suited to accurate, contamination-free fiber laser cutting.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Food and spice processing",
        clusters: ["Rangpo", "Singtam"],
        products: ["cardamom processing equipment parts", "packaging line components"],
        note: "Large cardamom and spice processing units around Rangpo and Singtam require stainless and mild steel fabricated parts for processing and packaging lines, matched well to a general-purpose fiber laser.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
      {
        name: "Small engineering",
        clusters: ["Rangpo", "Gangtok"],
        products: ["machine frames", "brackets", "general fabrication"],
        note: "General engineering workshops around Rangpo and Gangtok fabricate machine frames and brackets supporting the pharma and food-processing sector, work well suited to a compact, versatile fiber laser.",
        recommendedProductSlugs: ["ra-f1530"],
      },
    ],
    industrialAreas: ["Rangpo Industrial Growth Centre", "Sikkim Manufacturing and Assembling Zone (Kumrek)"],
    logisticsNote: "Consignments from Kolkata to Sikkim route through the Siliguri corridor and NH-10 to the Rangpo gateway, a road journey that typically takes 3-4 days given Sikkim's proximity to West Bengal compared with other North-Eastern states. Rail freight to New Jalpaiguri followed by road transport to Rangpo and Singtam is a common alternative, and air freight from Kolkata to Bagdogra covers urgent spares within a day.",
    neighbouringStateSlugs: ["west-bengal"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in Sikkim?", a: "Share your material thickness, bed size and expected production volume through our enquiry form, and our team issues a formal quotation with ex-works Kolkata pricing for delivery to Rangpo, Singtam or Gangtok. Sikkim's proximity to West Bengal via the Siliguri corridor keeps delivery timelines shorter than for other North-Eastern states." },
      { q: "How long does delivery and installation take from Kolkata to Sikkim?", a: "Machines dispatched from Kolkata typically reach Rangpo and Singtam within 3-4 days by road via NH-10 and the Siliguri corridor, or by rail to New Jalpaiguri followed by road transport. Engineers from our Kolkata headquarters then travel to site for installation and commissioning, usually completed within a few days of arrival." },
      { q: "Is on-site service and AMC coverage available in Sikkim?", a: "Yes. Engineers dispatched from our Kolkata headquarters handle on-site service and annual maintenance contract visits across the Rangpo-Singtam-Gangtok belt, supported by remote diagnostics that resolve many issues without a site visit. Sikkim's shorter transit time compared with other North-Eastern states means AMC response is generally quicker." },
      { q: "Can operators be trained locally or must they travel to Kolkata?", a: "We provide on-site operator training at your Rangpo or Singtam facility during installation, covering machine operation, nesting software and routine maintenance. Operators can also travel to RA Machine's training centre at our Kolkata headquarters for structured classroom sessions given the relatively short distance from Sikkim." },
      { q: "Which RA Machine model suits Sikkim's leading pharmaceutical industry?", a: "For Sikkim's pharmaceutical manufacturing cluster around Rangpo and Kumrek, the RA-F3015 Pro fiber laser cuts stainless steel process components and equipment guarding with the precision and clean edge finish pharma fabrication demands, while the compact RA-F1530 suits smaller workshops supporting the sector." },
      { q: "How does GST and interstate logistics work for a machine purchase in Sikkim?", a: "Domestic buyers in Sikkim purchase under standard GST invoicing, and we provide GST-compliant documentation for interstate transport from Kolkata to Rangpo or Gangtok. Given the shorter transit distance via the Siliguri corridor, delivery costs are typically lower than for other North-Eastern states, and we can advise on financing through your bank or NBFC partner." },
    ],
  },
  {
    slug: "tripura",
    name: "Tripura",
    type: "state",
    tier: "small",
    region: "North-East",
    capital: "Agartala",
    overview: [
      "Tripura is India's second-largest natural rubber producing state after Kerala, with plantations spread across West Tripura and Sepahijala feeding processing units around Agartala that produce ribbed smoked sheets and crumb rubber for the tyre and rubber goods industry. This rubber base, alongside extensive bamboo forests, gives Tripura a raw-material processing profile distinct from its North-Eastern neighbours.",
      "Bodhjungnagar Industrial Growth Centre and the Dukli Industrial Area near Agartala host most of the state's registered manufacturing units, fabricating equipment for rubber processing, bamboo product manufacturing and the state's growing pineapple and jackfruit food-processing sector. Agartala's road link to Assam via NH-8 keeps the state connected to eastern India's wider supply chains, though the distance from Kolkata remains considerable.",
    ],
    industries: [
      {
        name: "Rubber processing machinery",
        clusters: ["Agartala", "Sepahijala"],
        products: ["rubber sheeting equipment parts", "drying and grading components", "tooling"],
        note: "Tripura's rubber processing units, among India's largest outside Kerala, need precisely cut metal components for sheeting, drying and grading equipment, work suited to a general-purpose fiber laser.",
        recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
      },
      {
        name: "Bamboo processing",
        clusters: ["Agartala", "Dukli"],
        products: ["bamboo processing jigs", "machine frames", "handicraft tooling"],
        note: "Tripura's extensive bamboo processing sector fabricates jigs and machine frames for splitting and treatment equipment, work well matched to a compact fiber laser running mixed small batches.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Food processing",
        clusters: ["Agartala", "Bodhjungnagar"],
        products: ["pineapple and jackfruit processing equipment parts", "packaging line components"],
        note: "Tripura's pineapple and jackfruit processing units around Agartala require stainless and mild steel fabricated parts for processing and packaging lines, matched to a general-purpose fiber laser.",
        recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
      },
    ],
    industrialAreas: ["Bodhjungnagar Industrial Growth Centre (Agartala)", "Dukli Industrial Area"],
    logisticsNote: "Consignments from Kolkata to Agartala route through the Siliguri corridor and NH-27 through Assam before joining NH-8 into Tripura, a road journey that typically takes 6-8 days given the distance and hill terrain en route. Air freight from Kolkata to Agartala airport is the practical option for urgent spares and smaller components.",
    neighbouringStateSlugs: ["assam", "mizoram"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in Tripura?", a: "Share your material thickness, bed size and expected production volume through our enquiry form, and our team issues a formal quotation with ex-works Kolkata pricing for delivery to Agartala or the Bodhjungnagar industrial belt. Given Tripura's distance from Kolkata, we confirm a realistic delivery window alongside the quotation." },
      { q: "How long does delivery and installation take from Kolkata to Tripura?", a: "Consignments to Agartala typically take 6-8 days by road via the Siliguri corridor, NH-27 and NH-8 through Assam. Engineers from our Kolkata headquarters then travel to site for installation and commissioning, usually completed within a week of the machine's arrival at your Tripura facility." },
      { q: "Is on-site service and AMC coverage available in Tripura?", a: "Yes. On-site service and annual maintenance contract visits for Tripura are handled by engineers dispatched from our Kolkata headquarters, covering Agartala, Bodhjungnagar and Dukli, supported by remote diagnostics that resolve many issues without a site visit. Given the transit distance, we recommend scheduling AMC visits well ahead of production needs." },
      { q: "Can operators be trained locally or must they travel to Kolkata?", a: "We provide on-site operator training at your Agartala facility during installation, covering machine operation, nesting software and routine maintenance. Operators who prefer structured classroom sessions can travel to RA Machine's training centre at our Kolkata headquarters instead." },
      { q: "Which RA Machine model suits Tripura's rubber processing industry?", a: "For Tripura's rubber processing industry centred on Agartala and Sepahijala, the RA-F3015 Pro fiber laser handles equipment fabrication for sheeting and drying machinery, while the compact RA-F1530 suits bamboo processing and smaller food-processing workshops across the Bodhjungnagar and Dukli industrial areas." },
      { q: "How does GST and interstate logistics work for a machine purchase in Tripura?", a: "Domestic buyers in Tripura purchase under standard GST invoicing, and we provide GST-compliant documentation for interstate transport from Kolkata to Agartala. Given road transit of 6-8 days, we recommend ordering spares and consumables in advance, and we can advise on financing options through your bank or NBFC partner alongside the delivery schedule." },
    ],
  },
];
