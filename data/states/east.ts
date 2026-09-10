/**
 * data/states/east.ts — State entries for the East region:
 * West Bengal, Bihar, Jharkhand, Odisha.
 * See data/types.ts for the State/StateIndustry/FaqItem interfaces and
 * data/india-index.ts for the canonical slug/name/tier/region list.
 * To edit: change fields directly. To add a state, append another object
 * matching the State interface below (or start a new sibling file for
 * the next batch and re-export it from the data/states.ts barrel).
 */
import type { State, StateIndustry, FaqItem } from "../types";

export const eastStates: State[] = [
  {
    slug: "west-bengal",
    name: "West Bengal",
    type: "state",
    tier: "large",
    region: "East",
    capital: "Kolkata",
    overview: [
      "West Bengal anchors eastern India's manufacturing economy around Kolkata and the Hooghly river industrial belt, home to RA Machine's own headquarters and production facility. Howrah's century-old foundry cluster, Kharagpur and Liluah's railway engineering works, and the steel-and-coke economy of Durgapur and Asansol together give the state one of India's densest concentrations of metal fabrication and heavy engineering activity outside the western industrial states.",
      "Haldia's petrochemical complex and the twin ports of Kolkata and Haldia Dock Complex move both raw material and finished cargo, while Kolkata's older jute and tea machinery trade continues to need custom fabricated parts. Because Kolkata is home base, West Bengal customers get same-day to next-day service response and the shortest delivery lead times of any state RA Machine serves.",
    ],
    industries: [
      {
        name: "Foundries and castings",
        clusters: ["Howrah", "Belur", "Liluah"],
        products: ["cast iron components", "machine parts", "pump and valve bodies"],
        note: "Howrah's long-running foundry belt fabricates pattern plates, jigs and finishing components where a workhorse fiber laser delivers clean, repeatable cuts across daily production runs.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Railway wagon and engineering goods",
        clusters: ["Kharagpur", "Liluah"],
        products: ["wagon underframes", "structural components", "engineering hardware"],
        note: "Railway workshops and ancillary units around Kharagpur and Liluah fabricate thick structural steel for wagon bodies and underframes, work that calls for a heavy-duty fiber laser capable of consistent plate cutting.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k"],
      },
      {
        name: "Steel",
        clusters: ["Durgapur", "Asansol"],
        products: ["structural steel", "billets", "rolled sections"],
        note: "The Durgapur-Asansol steel belt runs downstream fabrication of structural sections and plate, where high-power fiber laser cutting and robotic welding cells raise throughput on thick-gauge work.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-rw6"],
      },
      {
        name: "Jute and tea machinery",
        clusters: ["Kolkata"],
        products: ["jute mill parts", "tea processing equipment components"],
        note: "Kolkata's jute and tea machinery manufacturers need accurately cut mild steel and stainless components for equipment overhauls and new machine builds, suited to a general-purpose fiber laser.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Petrochemicals",
        clusters: ["Haldia"],
        products: ["process equipment parts", "structural steel", "pipe supports"],
        note: "Haldia's petrochemical and process industry units require precisely cut structural steel and pipe support fabrication, work well matched to heavy-plate fiber laser cutting and robotic MIG welding.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-rw6"],
      },
    ],
    industrialAreas: [
      "Belur-Liluah Industrial Belt (Howrah)",
      "Durgapur Industrial Area",
      "Asansol-Raniganj Industrial Belt",
      "Haldia Industrial Area",
      "Falta SEZ",
      "Kalyani Industrial Estate",
    ],
    logisticsNote: "As RA Machine's headquarters state, West Bengal customers receive same-day to next-day delivery and service response across Kolkata, Howrah and the surrounding industrial belt, with Durgapur and Asansol typically reached within a day by road. Cargo bound for Haldia or coastal shipment moves through Kolkata Port and the Haldia Dock Complex, keeping port-linked deliveries within the state equally fast.",
    neighbouringStateSlugs: ["odisha", "jharkhand", "bihar", "sikkim", "assam"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in West Bengal?", a: "As our headquarters state, West Bengal customers can visit our Kolkata facility directly or share material thickness, bed size and production volume through our enquiry form. We issue a formal quotation with ex-works pricing and, since delivery is local, typically the fastest turnaround of any state we serve." },
      { q: "How long does delivery and installation take from Kolkata to West Bengal?", a: "Delivery within Kolkata, Howrah and the surrounding belt is same-day to next-day. Durgapur, Asansol and Haldia are typically reached within a day by road. Installation and commissioning follow immediately after delivery, usually completed within two to three days since engineers travel from our Kolkata headquarters." },
      { q: "Is on-site service and AMC coverage available in West Bengal?", a: "Yes, and West Bengal receives the fastest service response of any state, since engineers are based at our Kolkata headquarters. Annual maintenance contract visits, breakdown support and remote diagnostics cover Howrah, Durgapur, Asansol, Kharagpur and Haldia with typically same-day to next-day site response." },
      { q: "Can operators be trained locally or must they travel elsewhere?", a: "West Bengal customers have the advantage of our Kolkata training centre being local. We offer on-site training at your facility in Howrah, Durgapur or Haldia, or operators can visit the Kolkata training centre directly for hands-on sessions covering machine operation, nesting software and maintenance." },
      { q: "Which RA Machine model suits West Bengal's railway and foundry industry?", a: "For the Kharagpur-Liluah railway engineering belt, the RA-F6020 HD heavy duty fiber laser handles thick structural steel for wagon underframes, while Howrah's foundry cluster typically runs the RA-F3015 Pro for general fabrication and finishing components." },
      { q: "How does GST and export from Kolkata Port work for a machine purchase?", a: "Domestic buyers in West Bengal purchase under standard GST invoicing, with documentation handled directly from our Kolkata office. Export customers routing finished goods through Kolkata Port or Haldia Dock Complex can discuss financing and export paperwork alongside their machine order." },
    ],
  },
  {
    slug: "bihar",
    name: "Bihar",
    type: "state",
    tier: "medium",
    region: "East",
    capital: "Patna",
    overview: [
      "Bihar's manufacturing economy centres on Patna and Muzaffarpur, where food processing and agro machinery units convert the state's large agricultural output into packaged and processed goods, alongside a smaller but established leather cluster at Mokama and scattered light engineering workshops serving regional demand. The state's location along the Grand Trunk Road and the Kolkata-Delhi rail corridor keeps it linked to eastern India's larger industrial belts.",
      "Growth in agro-processing investment around Patna and Muzaffarpur has steadily increased demand for custom fabricated equipment parts, storage structures and processing line components, work that has historically relied on manual cutting and welding methods now giving way to laser-cut precision parts and robotic weld quality.",
    ],
    industries: [
      {
        name: "Food processing and agro machinery",
        clusters: ["Muzaffarpur", "Patna"],
        products: ["processing equipment parts", "storage structures", "conveyor components"],
        note: "Food processing and agro machinery units around Patna and Muzaffarpur fabricate stainless and mild steel parts for processing lines, where a general-purpose fiber laser delivers accurate, hygienic-grade cuts.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
      {
        name: "Leather",
        clusters: ["Mokama"],
        products: ["leather machinery components", "tooling parts"],
        note: "Mokama's leather manufacturing units need dependable sheet cutting for machinery parts and tooling, work suited to a compact fiber laser running smaller batch sizes.",
        recommendedProductSlugs: ["ra-f1530"],
      },
      {
        name: "Light engineering goods",
        clusters: ["Patna", "Fatuha"],
        products: ["fabricated brackets", "machine frames", "general hardware"],
        note: "Light engineering workshops around Patna fabricate brackets and machine frames for regional buyers, work that benefits from a workhorse fiber laser handling mixed mild steel and stainless jobs.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
    ],
    industrialAreas: [
      "Fatuha Industrial Area (Patna)",
      "Muzaffarpur Industrial Area",
      "Bihta Industrial Area",
      "Hajipur Industrial Area",
    ],
    logisticsNote: "Machines dispatched from Kolkata to Patna and Muzaffarpur travel along the NH-19/Grand Trunk Road corridor and by rail freight, with typical road transit of 2-3 days to Patna and slightly longer to outlying industrial areas such as Hajipur and Bihta. Air freight from Kolkata to Patna covers urgent spares within a day.",
    neighbouringStateSlugs: ["uttar-pradesh", "jharkhand", "west-bengal"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in Bihar?", a: "Share your material thickness, bed size and expected production volume through our enquiry form and our team will issue a formal quotation covering machine specification, ex-works Kolkata pricing and delivery timeline to your Bihar facility, whether in Patna, Muzaffarpur or Hajipur." },
      { q: "How long does delivery and installation take from Kolkata to Bihar?", a: "Road and rail freight to Patna and the Fatuha industrial belt typically takes 2-3 days from dispatch, with Muzaffarpur and Hajipur close behind. Engineers from our Kolkata headquarters then travel to site for installation and commissioning, usually completed within a week of arrival." },
      { q: "Is on-site service and AMC coverage available in Bihar?", a: "Yes. Engineers are dispatched from our Kolkata headquarters for on-site service and annual maintenance contract visits across Bihar, covering Patna, Muzaffarpur and Mokama, and this is backed by remote diagnostics that resolve many issues without needing a site visit at all." },
      { q: "Can operators be trained locally or must they travel to Kolkata?", a: "We provide on-site operator training at your Bihar facility during installation, covering machine operation, nesting software and routine maintenance. Teams that prefer structured classroom sessions can send operators to our Kolkata training centre for refresher or advanced training instead." },
      { q: "Which RA Machine model suits Bihar's food processing and agro machinery industry?", a: "For the Patna-Muzaffarpur food processing and agro machinery belt, the RA-F3015 Pro fiber laser handles stainless and mild steel fabrication for processing equipment parts and storage structures, offering accurate cuts across the mixed batch sizes typical of the sector." },
      { q: "How does GST and financing work for a machine purchase in Bihar?", a: "Domestic buyers in Bihar purchase under standard GST invoicing, and we provide full GST-compliant documentation for interstate transport from Kolkata into Patna, Muzaffarpur or Mokama. We can also advise on financing options through your bank or NBFC partner alongside the delivery schedule." },
    ],
  },
  {
    slug: "jharkhand",
    name: "Jharkhand",
    type: "state",
    tier: "medium",
    region: "East",
    capital: "Ranchi",
    overview: [
      "Jharkhand carries one of eastern India's heaviest industrial footprints, anchored by Tata Steel's integrated plant at Jamshedpur and its dense ancillary belt, the Heavy Engineering Corporation at Ranchi, and the mining and coal equipment economy around Dhanbad and Bokaro. Formed from Bihar's mineral-rich southern districts, the state supplies steel, heavy machinery and mining equipment components into national and export supply chains.",
      "Jamshedpur's ancillary units fabricate components for automotive and industrial customers at scale, while Ranchi's heavy engineering base builds equipment for power, mining and infrastructure projects. This combination of high-tonnage steel fabrication and precision component work sustains strong demand for both heavy-plate laser cutting and robotic welding across the state.",
    ],
    industries: [
      {
        name: "Steel",
        clusters: ["Jamshedpur"],
        products: ["structural steel", "automotive components", "ancillary parts"],
        note: "Tata Steel's ancillary belt around Jamshedpur runs high-volume fabrication of structural and automotive components, where a heavy-duty fiber laser paired with robotic MIG welding raises throughput and weld consistency.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-rw6"],
      },
      {
        name: "Heavy engineering",
        clusters: ["Ranchi"],
        products: ["power equipment structures", "heavy machine frames", "industrial components"],
        note: "The Heavy Engineering Corporation belt in Ranchi fabricates thick-plate structures for power and industrial equipment, work that requires a high-power fiber laser capable of clean cuts through extreme plate thickness.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k"],
      },
      {
        name: "Mining equipment",
        clusters: ["Dhanbad", "Bokaro"],
        products: ["mining machinery parts", "structural steel", "equipment frames"],
        note: "Mining and coal equipment manufacturers around Dhanbad and Bokaro fabricate heavy structural steel parts, where a high-power fiber laser and robotic welding cell handle thick plate reliably across demanding duty cycles.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-rw10"],
      },
    ],
    industrialAreas: [
      "Adityapur Industrial Area (Jamshedpur)",
      "Namkum Industrial Area (Ranchi)",
      "Tatisilwai Industrial Area (Ranchi)",
      "Bokaro Industrial Area",
    ],
    logisticsNote: "Machines move from Kolkata to Jamshedpur via NH-2 and the Kolkata-Mumbai rail freight corridor, with typical road transit of 1-2 days, while Ranchi, Dhanbad and Bokaro are generally reached within 2 days. Air freight from Kolkata to Ranchi covers urgent spares dispatch within a day.",
    neighbouringStateSlugs: ["bihar", "west-bengal", "odisha", "chhattisgarh", "uttar-pradesh"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in Jharkhand?", a: "Share your material thickness, bed size and production volume through our enquiry form and our team will issue a formal quotation covering machine specification, ex-works Kolkata pricing and delivery timeline to your Jharkhand facility, whether in Jamshedpur, Ranchi, Dhanbad or Bokaro." },
      { q: "How long does delivery and installation take from Kolkata to Jharkhand?", a: "Road and rail freight to Jamshedpur along NH-2 typically takes 1-2 days, with Ranchi, Dhanbad and Bokaro reached within about 2 days. Our engineers then travel to site for installation, calibration and commissioning, usually completed within a week of arrival." },
      { q: "Is on-site service and AMC coverage available in Jharkhand?", a: "Yes. Engineers are dispatched from our Kolkata headquarters for on-site service, breakdown support and annual maintenance contract visits across Jharkhand, covering Jamshedpur, Ranchi, Dhanbad and Bokaro, backed by remote diagnostics that resolve many issues without a site visit." },
      { q: "Can operators be trained locally or must they travel to Kolkata?", a: "We provide on-site operator training at your Jharkhand facility during installation, covering machine operation, nesting software and routine maintenance. Teams that prefer structured classroom sessions can also send operators to our Kolkata training centre for refresher or advanced training." },
      { q: "Which RA Machine model suits Jharkhand's steel industry?", a: "For the Jamshedpur steel and automotive ancillary belt, the RA-F6020 HD heavy duty fiber laser handles thick structural steel, and is frequently paired with the RA-RW6 robotic welding cell for ancillary units running high-volume welded assemblies." },
      { q: "How does GST and financing work for a machine purchase in Jharkhand?", a: "Domestic buyers in Jharkhand purchase under standard GST invoicing, and we provide full GST-compliant documentation for interstate transport into Jamshedpur, Ranchi or Bokaro. We can also advise on financing options through your bank or NBFC partner alongside the delivery schedule." },
    ],
  },
  {
    slug: "odisha",
    name: "Odisha",
    type: "state",
    tier: "medium",
    region: "East",
    capital: "Bhubaneswar",
    overview: [
      "Odisha's industrial economy runs on steel, aluminium and mining, led by SAIL's Rourkela Steel Plant and its surrounding ancillary belt, the aluminium and mining equipment cluster around Angul and Jharsuguda, and shipbuilding ancillary units near Paradip Port. The state's mineral reserves and coastal access have drawn sustained investment in metals and heavy industry over the past two decades.",
      "Paradip Port handles both raw material imports and finished cargo exports, linking Odisha's inland industrial belt to national and international supply chains, while Bhubaneswar and Cuttack host a growing base of smaller fabrication and engineering units. This spread of heavy plate work, mining equipment fabrication and coastal industrial activity drives consistent demand for high-power laser cutting and robotic welding.",
    ],
    industries: [
      {
        name: "Steel",
        clusters: ["Rourkela"],
        products: ["structural steel", "plate fabrication", "mill components"],
        note: "SAIL's Rourkela Steel Plant and its ancillary belt fabricate heavy structural steel and mill components, work that requires a high-power fiber laser capable of clean cuts through thick plate at production scale.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k"],
      },
      {
        name: "Aluminium and mining equipment",
        clusters: ["Angul", "Jharsuguda"],
        products: ["mining machinery parts", "aluminium fabrication", "structural components"],
        note: "Aluminium and mining equipment manufacturers around Angul and Jharsuguda fabricate heavy structural parts and equipment frames, where a heavy-duty fiber laser paired with robotic welding improves throughput on demanding duty cycles.",
        recommendedProductSlugs: ["ra-f6020-hd", "ra-rw10"],
      },
      {
        name: "Shipbuilding ancillaries",
        clusters: ["Paradip"],
        products: ["hull section components", "structural steel parts", "marine fabrication"],
        note: "Shipbuilding ancillary units near Paradip Port fabricate hull sections and structural steel parts, work suited to extreme-thickness fiber laser cutting and robotic MIG welding for consistent weld quality on large assemblies.",
        recommendedProductSlugs: ["ra-f12k", "ra-rw10"],
      },
      {
        name: "General engineering and fabrication",
        clusters: ["Bhubaneswar", "Cuttack"],
        products: ["fabricated brackets", "machine frames", "general hardware"],
        note: "Smaller fabrication and engineering units around Bhubaneswar and Cuttack fabricate brackets and machine frames for regional industry, work well matched to a general-purpose fiber laser handling mixed batch sizes.",
        recommendedProductSlugs: ["ra-f3015-pro"],
      },
    ],
    industrialAreas: [
      "Rourkela Industrial Estate",
      "Infocity/Rasulgarh Industrial Area (Bhubaneswar)",
      "Manguli Industrial Estate (Cuttack)",
      "Paradip Port industrial zone",
    ],
    logisticsNote: "Machines dispatched from Kolkata to Bhubaneswar and Cuttack travel along NH-16 and the Kolkata-Chennai rail freight corridor, with typical road transit of 2-3 days, while coastal shipping between Kolkata/Haldia and Paradip Port offers an alternative route for bulk cargo. Rourkela and the Angul-Jharsuguda belt are generally reached within 2-3 days by road.",
    neighbouringStateSlugs: ["west-bengal", "jharkhand", "chhattisgarh", "andhra-pradesh"],
    faqs: [
      { q: "How do I get a quote for a fiber laser or welding machine in Odisha?", a: "Share your material thickness, bed size and production volume through our enquiry form and our team will issue a formal quotation covering machine specification, ex-works Kolkata pricing and delivery timeline to your Odisha facility, whether in Rourkela, Bhubaneswar, Angul or Paradip." },
      { q: "How long does delivery and installation take from Kolkata to Odisha?", a: "Road and rail freight to Bhubaneswar and Cuttack along NH-16 typically takes 2-3 days, with Rourkela and the Angul-Jharsuguda belt reached in a similar window. Our engineers then travel to site for installation, calibration and commissioning, usually completed within a week of arrival." },
      { q: "Is on-site service and AMC coverage available in Odisha?", a: "Yes. Engineers are dispatched from our Kolkata headquarters for on-site service, breakdown support and annual maintenance contract visits across Odisha, covering Rourkela, Bhubaneswar, Angul and Paradip, backed by remote diagnostics that resolve many issues without a site visit." },
      { q: "Can operators be trained locally or must they travel to Kolkata?", a: "We provide on-site operator training at your Odisha facility during installation, covering machine operation, nesting software and routine maintenance. Teams that prefer structured classroom sessions can also send operators to our Kolkata training centre for refresher or advanced training." },
      { q: "Which RA Machine model suits Odisha's steel industry?", a: "For the Rourkela steel belt built around SAIL's plant, the RA-F6020 HD heavy duty fiber laser handles thick structural plate, while shipbuilding ancillary units near Paradip Port often step up to the RA-F12K for extreme thick-plate hull section fabrication." },
      { q: "How does GST and export from Paradip Port work for a machine purchase?", a: "Domestic buyers in Odisha purchase under standard GST invoicing, with full GST-compliant documentation for interstate transport into Rourkela, Bhubaneswar or Paradip. Export customers routing finished goods through Paradip Port can discuss financing and export paperwork alongside their machine order." },
    ],
  },
];
