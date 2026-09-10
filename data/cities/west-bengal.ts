/** data/cities/west-bengal.ts — part of the RA Machine city dataset. See data/cities.ts for the full editing guide. */
import type { City } from "../types";

export const cities: City[] = [
  {
    slug: "kolkata",
    name: "Kolkata",
    stateSlug: "west-bengal",
    overview: [
      "Kolkata is home to RA Machine's own manufacturing works, and the city itself is one of eastern India's most diverse industrial centres, spanning light engineering, leather goods, printing and packaging, and port-linked fabrication feeding the Kolkata and Haldia docks.",
      "From workshops around Topsia and Tangra to larger units near Kalyani and Rajarhat, the city's fabricators supply everything from sheet-metal enclosures to structural steel across the state.",
    ],
    industries: [
      "general fabrication",
      "leather goods and accessories manufacturing",
      "printing, packaging and signage",
      "port-linked fabrication and container repair",
      "sheet-metal enclosures and electrical panels",
    ],
    industrialAreas: [
      "Topsia and Tangra light-engineering belt",
      "Kasba Industrial Estate",
      "Kalyani Industrial Area",
      "Rajarhat–New Town industrial pockets",
    ],
    recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro", "ra-c1390"],
    nearbyCitySlugs: ["howrah", "durgapur", "asansol", "haldia", "siliguri", "kharagpur", "bardhaman"],
    logisticsNote:
      "As our own works and headquarters are located in Kolkata, machines ordered by Kolkata customers are typically installed within 3–7 days of order confirmation, with no long-haul transport involved.",
    faqs: [
      {
        q: "How can a Kolkata fabricator get a quote and see a live machine demonstration?",
        a: "Since our manufacturing works and demonstration floor are located in Kolkata itself, customers can request a quote through the website or phone and generally arrange an in-person demonstration on actual sheet within a few days, without needing to travel outside the city.",
      },
      {
        q: "What is the typical delivery and installation timeline for a Kolkata order?",
        a: "Because the machine is built and dispatched from our own Kolkata works, installation for city-based customers is usually completed within 3–7 working days of order confirmation, covering foundation checks, machine positioning, electrical commissioning and initial test cuts.",
      },
      {
        q: "How quickly can on-site repair or AMC support reach a Kolkata workshop?",
        a: "Kolkata units are closest to our service base, so remote diagnostics typically begin within a few working hours and an engineer can generally reach workshops in Topsia, Tangra or Kasba for on-site repair or scheduled AMC visits the same day or next working day.",
      },
      {
        q: "What operator training options are available for a Kolkata-based team?",
        a: "New operators can be trained hands-on at our Kolkata works during machine commissioning, covering nesting software, cutting parameters and routine maintenance, with refresher sessions and phone or video support available afterward for shift operators and supervisors.",
      },
      {
        q: "Which RA Machine model suits Kolkata's mixed industrial base best?",
        a: "Given Kolkata's mix of general fabrication, signage, leather-accessory hardware and light engineering, the RA-F3015-PRO 3kW fiber laser is the most common fit for general sheet work, while the RA-C1390 CO2 machine suits acrylic signage and non-metal cutting needs.",
      },
    ],
  },
  {
    slug: "howrah",
    name: "Howrah",
    stateSlug: "west-bengal",
    overview: [
      "Howrah's Ghusuri–Belur–Liluah foundry belt earned the city its reputation as the 'Sheffield of India', producing iron and brass castings, pumps, valves and general engineering goods for markets across the country.",
      "Alongside heavy casting units, the city hosts a dense cluster of small fabrication and machine shops that finish and assemble cast components into pumps, valves and general hardware for domestic and export buyers.",
    ],
    industries: [
      "iron and brass foundry & castings",
      "pumps and valves manufacturing",
      "general engineering fabrication",
      "small machine tool workshops",
      "wholesale hardware and metal trading",
    ],
    industrialAreas: [
      "Ghusuri foundry belt",
      "Belur industrial area",
      "Liluah engineering cluster",
      "Howrah Industrial Estate, Bamangachi",
    ],
    recommendedProductSlugs: ["ra-f3015-pro", "ra-f6020-hd", "ra-rw6"],
    nearbyCitySlugs: ["kolkata", "durgapur", "asansol", "haldia", "siliguri", "kharagpur", "bardhaman"],
    logisticsNote:
      "Howrah sits directly across the river from our Kolkata works, so machines are typically delivered and installed within same-day to 2 working days, with no long-distance transport involved.",
    faqs: [
      {
        q: "How can a Howrah foundry or fabrication unit request a quote and demonstration?",
        a: "Howrah customers can submit specifications through the website or phone, after which our team shares a quote and arranges a demonstration cut on similar-gauge material, either at our Kolkata works or, where practical, closer to the Ghusuri or Belur foundry belt.",
      },
      {
        q: "What is the delivery and installation timeline for a Howrah order?",
        a: "Because Howrah lies just across the Hooghly from our Kolkata works, dispatch and installation are usually completed within same-day to 2 working days of order confirmation, including electrical commissioning and test cuts on the customer's own material.",
      },
      {
        q: "How fast is on-site repair or AMC support for Howrah units?",
        a: "Given the short distance, engineers dispatched from our Kolkata works can typically reach Ghusuri, Belur or Liluah units the same day for urgent breakdowns, with remote diagnostics available within a few working hours for less critical faults under AMC.",
      },
      {
        q: "What training is available for operators at a Howrah casting or pump unit?",
        a: "Operators from Howrah foundries and pump-and-valve units can be trained during machine commissioning on cutting parameters for cast-iron brackets, mild-steel enclosures and sheet components, with follow-up visits or phone support available as new operators join.",
      },
      {
        q: "Which machine suits Howrah's foundry and pump-and-valve industry best?",
        a: "For Howrah's mix of general engineering and pump-and-valve fabrication, the RA-F6020-HD 6kW fiber laser handles heavier plate and structural brackets well, while the RA-RW6 robotic welding cell suits repetitive MIG welding on pump housings and valve assemblies.",
      },
    ],
    isTop: true,
  },
  {
    slug: "durgapur",
    name: "Durgapur",
    stateSlug: "west-bengal",
    overview: [
      "Durgapur developed as an industrial town around the Durgapur Steel Plant and today carries one of eastern India's more established heavy-engineering and ancillary manufacturing bases, supplying structural fabrication, castings and machined components to steel and power customers.",
      "The town's industrial estates also support general engineering and machine-building units that serve buyers across West Bengal, Jharkhand and Odisha, alongside a growing base of MSME fabricators.",
    ],
    industries: [
      "structural steel fabrication",
      "heavy engineering & machine building",
      "castings and forged components",
      "power-plant ancillary equipment",
      "general steel fabrication",
    ],
    industrialAreas: [
      "Durgapur Industrial Estate",
      "Ranidanga small-scale industrial area",
      "Bamunara industrial growth centre",
    ],
    recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k", "ra-rw10"],
    nearbyCitySlugs: ["kolkata", "howrah", "asansol", "haldia", "siliguri", "kharagpur", "bardhaman"],
    logisticsNote:
      "Durgapur is around 170 km from our Kolkata works via NH19 and the Eastern Railway main line, so most orders are delivered and installed within 2–3 working days of dispatch.",
    faqs: [
      {
        q: "How can a Durgapur fabricator request a quote and see a demonstration?",
        a: "Durgapur customers can share drawings or sample parts through the website or phone, after which our team quotes the right model and, where feasible, arranges a demonstration cut on comparable plate thickness before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Durgapur order?",
        a: "Machines dispatched from our Kolkata works typically reach Durgapur via NH19 within 2–3 working days, with our engineers completing foundation checks, electrical commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How quickly can on-site repair or AMC support reach Durgapur?",
        a: "For units near the Durgapur Steel Plant belt or Ranidanga, engineers dispatched from Kolkata generally reach site within 1–2 working days for on-site repair, while remote diagnostics under AMC are typically initiated within a few working hours of a service call.",
      },
      {
        q: "What operator training is offered for Durgapur's heavy-engineering workforce?",
        a: "Training is provided during commissioning for cutting parameters on structural steel and plate components typical of Durgapur's ancillary units, with additional on-site or remote sessions available as new operators are inducted at the customer's fabrication shop.",
      },
      {
        q: "Which RA Machine model suits Durgapur's steel and heavy-engineering base?",
        a: "Given Durgapur's concentration of structural steel and heavy-engineering work linked to the steel plant, the RA-F6020-HD 6kW fiber laser and RA-F12K are the most common fits for thick-plate cutting, with the RA-RW10 welding cell suited to high-volume fabrication.",
      },
    ],
  },
  {
    slug: "asansol",
    name: "Asansol",
    stateSlug: "west-bengal",
    overview: [
      "Asansol grew up in West Bengal's coal belt and today combines coal and mining-linked engineering with a sizeable base of railway-linked fabrication units, supplying wagon components, structural parts and general machinery to customers across the region.",
      "The town's workshops range from small job-shops serving the coalfields around it to larger fabrication units connected to the Eastern Railway network, making general and structural steel cutting a regular requirement.",
    ],
    industries: [
      "coal and mining equipment fabrication",
      "railway-linked component manufacturing",
      "structural steel fabrication",
      "general engineering workshops",
    ],
    industrialAreas: [
      "Asansol Industrial Estate",
      "Hirapur–Kulti industrial belt",
      "Burnpur steel and engineering zone",
    ],
    recommendedProductSlugs: ["ra-f6020-hd", "ra-f3015-pro", "ra-rw6"],
    nearbyCitySlugs: ["kolkata", "howrah", "durgapur", "haldia", "siliguri", "kharagpur", "bardhaman"],
    logisticsNote:
      "Asansol is roughly 200 km from our Kolkata works along NH19 and the Eastern Railway main line, so deliveries are generally completed within 2–3 working days of dispatch.",
    faqs: [
      {
        q: "How can an Asansol workshop get a quote and see a demonstration?",
        a: "Asansol customers can send drawings or sample components through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut on similar material before finalising the order.",
      },
      {
        q: "What is the delivery and installation timeline for an Asansol order?",
        a: "Machines dispatched from Kolkata typically reach Asansol along NH19 within 2–3 working days, after which our engineers carry out installation, electrical commissioning and test cuts on-site before handing the machine over to the customer's team.",
      },
      {
        q: "How fast is on-site repair or AMC response for Asansol units?",
        a: "Engineers dispatched from our Kolkata works generally reach Asansol, including units around Hirapur and Kulti, within 1–2 working days for on-site repair, while remote diagnostics under AMC are typically started within a few working hours of a call.",
      },
      {
        q: "What training options exist for operators at an Asansol fabrication unit?",
        a: "Operators are trained during commissioning on cutting parameters relevant to structural steel and railway-linked components common in Asansol, and further sessions or remote guidance can be arranged as new operators join the customer's shop floor.",
      },
      {
        q: "Which machine fits Asansol's coal and railway-linked engineering base best?",
        a: "For Asansol's mix of coal-belt and railway-linked fabrication, the RA-F6020-HD 6kW fiber laser suits structural and plate cutting well, while the RA-RW6 robotic welding cell is a good fit for repetitive welding on wagon and machinery components.",
      },
    ],
  },
  {
    slug: "haldia",
    name: "Haldia",
    stateSlug: "west-bengal",
    overview: [
      "Haldia is anchored by Haldia Port and a large petrochemical and refinery complex, making port-linked fabrication, tank and vessel work, and pipe-spool manufacturing a core part of the local industrial economy.",
      "Fabricators here regularly work with thicker plate for storage tanks, structural supports and process equipment supplied to the port and petrochemical units, alongside general engineering serving the wider Purba Medinipur district.",
    ],
    industries: [
      "port-linked fabrication",
      "storage tank and pressure-vessel work",
      "pipe-spool and structural fabrication",
      "petrochemical ancillary equipment",
      "general engineering",
    ],
    industrialAreas: [
      "Haldia Dock Complex ancillary belt",
      "Haldia Petrochemicals industrial estate",
      "Durgachak industrial area",
    ],
    recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k", "ra-f3015-pro"],
    nearbyCitySlugs: ["kolkata", "howrah", "durgapur", "asansol", "siliguri", "kharagpur", "bardhaman"],
    logisticsNote:
      "Haldia is about 130 km from our Kolkata works via NH116 and the Kolkata–Haldia rail link, so deliveries are typically completed within 1–3 working days of dispatch.",
    faqs: [
      {
        q: "How can a Haldia fabricator request a quote and demonstration?",
        a: "Haldia customers can share plate specifications and sample drawings through the website or phone, after which our team recommends a model and, where feasible, arranges a demonstration cut on similar-gauge plate before the order is placed.",
      },
      {
        q: "What is the delivery and installation timeline for a Haldia order?",
        a: "Machines dispatched from Kolkata generally reach Haldia via NH116 within 1–3 working days, with our engineers then completing foundation checks, electrical commissioning and test cuts on customer plate before handover.",
      },
      {
        q: "How quickly can on-site repair or AMC support reach Haldia?",
        a: "Given the proximity to Kolkata, engineers can typically reach Haldia's port and petrochemical-linked units within 1–2 working days for on-site repair, with remote diagnostics under AMC usually starting within a few working hours of a service request.",
      },
      {
        q: "What operator training is available for a Haldia tank or vessel fabrication unit?",
        a: "Training is provided during commissioning on cutting parameters for thicker plate typical of tank and vessel work, with additional on-site visits or remote support available as Haldia customers bring on new operators.",
      },
      {
        q: "Which machine suits Haldia's port and petrochemical fabrication work best?",
        a: "Given the thicker plate common in Haldia's tank, vessel and structural fabrication work, the RA-F6020-HD 6kW and RA-F12K fiber lasers are the most suitable, handling heavy-plate cutting for port and petrochemical ancillary equipment.",
      },
    ],
  },
  {
    slug: "siliguri",
    name: "Siliguri",
    stateSlug: "west-bengal",
    overview: [
      "Siliguri functions as the principal logistics and trade gateway to North Bengal, Sikkim and the North-East, with a local economy built around the tea trade, transport and general engineering serving hill and plains markets.",
      "Fabrication units in and around the city typically produce general machinery, transport bodies and tea-industry equipment, alongside signage and light engineering work for a wide catchment of hill towns.",
    ],
    industries: [
      "general engineering and machine building",
      "tea-industry equipment and fittings",
      "transport body fabrication",
      "signage and light engineering",
    ],
    industrialAreas: [
      "Matigara industrial area",
      "Siliguri Regulated Market industrial belt",
      "Fulbari industrial growth centre",
    ],
    recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530", "ra-c1390"],
    nearbyCitySlugs: ["kolkata", "howrah", "durgapur", "asansol", "haldia", "kharagpur", "bardhaman"],
    logisticsNote:
      "Siliguri is roughly 560 km from our Kolkata works via NH12 and the Barsoi rail corridor, so deliveries typically take 3–5 working days depending on season and hill-route conditions.",
    faqs: [
      {
        q: "How can a Siliguri business get a quote and see a demonstration?",
        a: "Siliguri customers can share their material and part requirements through the website or phone; our team then quotes a suitable model and, where practical, arranges a demonstration cut before goods are dispatched north.",
      },
      {
        q: "What is the delivery and installation timeline for a Siliguri order?",
        a: "Machines dispatched from Kolkata generally reach Siliguri via NH12 within 3–5 working days, after which our engineers carry out installation, commissioning and test cuts on-site before the machine is handed over.",
      },
      {
        q: "How fast can on-site repair or AMC support reach Siliguri?",
        a: "Because Siliguri is further from our Kolkata base, engineers are typically dispatched to reach site within 2–4 working days for on-site repair, while remote diagnostics under AMC generally begin within a few working hours of a call.",
      },
      {
        q: "What training options are available for Siliguri-based operators?",
        a: "Operators are trained hands-on during commissioning, covering nesting software and cutting parameters for general engineering and tea-industry components, with phone or video follow-up support available given the distance from our Kolkata works.",
      },
      {
        q: "Which machine fits Siliguri's general engineering and trade-linked base best?",
        a: "For Siliguri's mix of general engineering, transport fabrication and signage work, the RA-F3015-PRO 3kW fiber laser is the most versatile fit, with the RA-C1390 CO2 machine suited to acrylic and non-metal signage cutting.",
      },
    ],
  },
  {
    slug: "kharagpur",
    name: "Kharagpur",
    stateSlug: "west-bengal",
    overview: [
      "Kharagpur developed around its major railway workshop and junction, giving the town a long-standing base in railway-linked fabrication, alongside a technical ecosystem shaped by the presence of IIT Kharagpur.",
      "General fabrication units in the town serve railway ancillary work, agricultural equipment and light engineering needs for the surrounding Paschim Medinipur district.",
    ],
    industries: [
      "railway workshop-linked fabrication",
      "general engineering",
      "agricultural equipment manufacturing",
      "light engineering and job-shop work",
    ],
    industrialAreas: [
      "Kharagpur Railway Workshop ancillary belt",
      "Kharagpur industrial growth centre",
      "Nimpura industrial area",
    ],
    recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530", "ra-t6000"],
    nearbyCitySlugs: ["kolkata", "howrah", "durgapur", "asansol", "haldia", "siliguri", "bardhaman"],
    logisticsNote:
      "Kharagpur is about 120 km from our Kolkata works via NH16 and the South Eastern Railway main line, so deliveries are usually completed within 1–2 working days of dispatch.",
    faqs: [
      {
        q: "How can a Kharagpur fabricator request a quote and demonstration?",
        a: "Kharagpur customers can share their material specifications through the website or phone, after which our team recommends a model and, where feasible, arranges a demonstration cut before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Kharagpur order?",
        a: "Machines dispatched from Kolkata typically reach Kharagpur via NH16 within 1–2 working days, with our engineers completing installation, electrical commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How quickly can on-site repair or AMC support reach Kharagpur?",
        a: "Given the short distance from Kolkata, engineers can generally reach Kharagpur's railway-linked and general engineering units within a day for on-site repair, with remote diagnostics under AMC typically starting within a few working hours.",
      },
      {
        q: "What operator training is available for a Kharagpur workshop?",
        a: "Training is provided during commissioning on cutting parameters for general fabrication and railway ancillary components, with additional on-site visits or remote guidance available as new operators are brought on.",
      },
      {
        q: "Which machine fits Kharagpur's railway and general engineering base best?",
        a: "For Kharagpur's mix of railway-linked and general fabrication, the RA-F3015-PRO 3kW fiber laser is the most common choice, while the RA-T6000 tube laser suits chassis and tubular structural work for equipment manufacturers.",
      },
    ],
  },
  {
    slug: "bardhaman",
    name: "Bardhaman",
    stateSlug: "west-bengal",
    overview: [
      "Bardhaman sits at the centre of an agriculturally rich district and has built up a base of agro-processing machinery manufacturing alongside general engineering workshops serving farm-equipment and food-processing customers.",
      "Local fabricators typically supply parts for rice mills, agricultural implements and general machinery, with a growing number of units also serving nearby Durgapur and Asansol's heavier industrial demand.",
    ],
    industries: [
      "agro-processing machinery manufacturing",
      "general engineering",
      "rice mill and farm equipment fabrication",
      "sheet-metal job-shop work",
    ],
    industrialAreas: [
      "Bardhaman industrial growth centre",
      "Palashdiha industrial area",
      "district industrial centre",
    ],
    recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
    nearbyCitySlugs: ["kolkata", "howrah", "durgapur", "asansol", "haldia", "siliguri", "kharagpur"],
    logisticsNote:
      "Bardhaman is around 100 km from our Kolkata works via NH19 and the Eastern Railway main line, so deliveries are typically completed within 1–2 working days of dispatch.",
    faqs: [
      {
        q: "How can a Bardhaman fabricator get a quote and see a demonstration?",
        a: "Bardhaman customers can share their part drawings or sample material through the website or phone; our team then quotes a suitable model and, where practical, arranges a demonstration cut before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Bardhaman order?",
        a: "Machines dispatched from Kolkata generally reach Bardhaman via NH19 within 1–2 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handover.",
      },
      {
        q: "How quickly can on-site repair or AMC support reach Bardhaman?",
        a: "Engineers dispatched from our Kolkata works can typically reach Bardhaman's agro-processing and general engineering units within a day for on-site repair, with remote diagnostics under AMC usually starting within a few working hours of a call.",
      },
      {
        q: "What operator training is available for a Bardhaman fabrication unit?",
        a: "Operators are trained during commissioning on cutting parameters for the sheet-metal and mild-steel components typical of agro-processing and rice mill equipment, with follow-up visits or remote support available as needed.",
      },
      {
        q: "Which machine suits Bardhaman's agro-processing and general engineering base best?",
        a: "For Bardhaman's mix of agro-processing machinery and general fabrication, the RA-F1530 1.5kW fiber laser suits thinner sheet and entry-level general work, while the RA-F3015-PRO is a good fit for heavier general-purpose fabrication needs.",
      },
    ],
  },
];
