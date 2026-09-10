/** data/cities/madhya-pradesh.ts — part of the RA Machine city dataset. See data/cities.ts for the full editing guide. */
import type { City } from "../types";

export const cities: City[] = [
  {
    slug: "indore",
    name: "Indore",
    stateSlug: "madhya-pradesh",
    overview: [
      "Indore anchors a major auto and pharmaceutical manufacturing base in Madhya Pradesh, closely linked to the neighbouring Pithampur industrial belt, alongside a long-standing textile industry.",
      "Fabrication units across the city typically supply auto-component brackets, machine enclosures and general engineering goods, serving both the auto-pharma corridor and broader central Indian demand.",
    ],
    industries: [
      "auto component fabrication",
      "pharmaceutical equipment manufacturing",
      "textile machinery components",
      "general engineering",
    ],
    industrialAreas: [
      "Sanwer Road industrial area",
      "Pithampur–Indore auto corridor (adjacent)",
      "Rau industrial area",
    ],
    recommendedProductSlugs: ["ra-f3015-pro", "ra-t6000", "ra-rw6"],
    nearbyCitySlugs: ["bhopal", "pithampur", "jabalpur", "gwalior", "dewas", "ujjain", "satna"],
    logisticsNote:
      "Indore is roughly 1,300 km from our Kolkata works via NH19 and NH34, so deliveries typically take 4–6 working days from dispatch.",
    faqs: [
      {
        q: "How can an Indore fabricator get a quote and see a demonstration?",
        a: "Indore customers can share their material and component requirements through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut before the order is confirmed and dispatched.",
      },
      {
        q: "What is the delivery and installation timeline for an Indore order?",
        a: "Machines dispatched from Kolkata generally reach Indore via NH19 and NH34 within 4–6 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over.",
      },
      {
        q: "How does on-site repair or AMC support work for Indore customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Indore within 3–5 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service request, keeping downtime to a minimum.",
      },
      {
        q: "What operator training options are available for an Indore auto-component unit?",
        a: "Operators are trained during commissioning on cutting parameters for auto-component brackets and general fabrication typical of Indore's auto-pharma corridor, with follow-up support available on-site or remotely as new operators are inducted.",
      },
      {
        q: "Which machine suits Indore's auto and general engineering base best?",
        a: "For Indore's mix of auto-component and general fabrication, the RA-F3015-PRO 3kW fiber laser is a versatile general-purpose fit, while the RA-T6000 tube laser suits chassis and tubular structural work common in auto manufacturing.",
      },
    ],
  },
  {
    slug: "bhopal",
    name: "Bhopal",
    stateSlug: "madhya-pradesh",
    overview: [
      "Bhopal hosts a major BHEL heavy-electrical-equipment manufacturing unit alongside a broader general engineering base, making the city an established centre for capital-goods and equipment fabrication in central India.",
      "Workshops around Bhopal typically supply structural components, equipment enclosures and general machinery parts, serving both the heavy-electrical sector and smaller MSME customers.",
    ],
    industries: [
      "heavy electrical equipment manufacturing",
      "general engineering fabrication",
      "structural steel fabrication",
      "equipment enclosure manufacturing",
    ],
    industrialAreas: ["Govindpura Industrial Area", "Mandideep industrial belt", "BHEL ancillary industrial zone"],
    recommendedProductSlugs: ["ra-f6020-hd", "ra-f3015-pro"],
    nearbyCitySlugs: ["indore", "pithampur", "jabalpur", "gwalior", "dewas", "ujjain", "satna"],
    logisticsNote:
      "Bhopal is about 1,200 km from our Kolkata works via NH19 and NH34, so deliveries typically take 4–6 working days from dispatch.",
    faqs: [
      {
        q: "How can a Bhopal fabricator request a quote and demonstration?",
        a: "Bhopal customers can share plate specifications and sample drawings through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut on comparable material before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Bhopal order?",
        a: "Machines dispatched from Kolkata generally reach Bhopal via NH34 within 4–6 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or AMC support work for Bhopal customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Bhopal within 3–5 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service call to limit downtime.",
      },
      {
        q: "What operator training options exist for a Bhopal heavy-electrical or general engineering unit?",
        a: "Operators are trained during commissioning on cutting parameters for structural steel and equipment-enclosure components typical of Bhopal's Govindpura and Mandideep units, with additional on-site or remote sessions available as needed.",
      },
      {
        q: "Which machine fits Bhopal's heavy-electrical and general engineering base best?",
        a: "Given Bhopal's concentration of heavy-electrical and structural fabrication, the RA-F6020-HD 6kW fiber laser suits thicker plate and equipment-enclosure work well, with the RA-F3015-PRO covering broader general-purpose fabrication needs.",
      },
    ],
  },
  {
    slug: "pithampur",
    name: "Pithampur",
    stateSlug: "madhya-pradesh",
    overview: [
      "Pithampur is often called the 'Detroit of Madhya Pradesh' for its concentration of automotive and auto-component manufacturing, organised around a major industrial SEZ near Indore.",
      "Fabrication units in this belt typically supply auto-component brackets, chassis parts and precision sheet-metal assemblies to a dense network of OEM and tier-supplier factories.",
    ],
    industries: [
      "automotive component manufacturing",
      "auto ancillary fabrication",
      "precision sheet-metal assemblies",
      "tubular and chassis fabrication",
    ],
    industrialAreas: ["Pithampur Industrial Area, Sector 1–3", "Pithampur Auto Cluster SEZ"],
    recommendedProductSlugs: ["ra-t6000", "ra-f3015-pro", "ra-rw10"],
    nearbyCitySlugs: ["indore", "bhopal", "jabalpur", "gwalior", "dewas", "ujjain", "satna"],
    logisticsNote:
      "Pithampur is roughly 1,320 km from our Kolkata works via NH19 and NH34, so deliveries typically take 4–6 working days from dispatch.",
    faqs: [
      {
        q: "How can a Pithampur auto-component unit get a quote and see a demonstration?",
        a: "Pithampur customers can share their part drawings and material specifications through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut on comparable auto-component material before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Pithampur order?",
        a: "Machines dispatched from Kolkata generally reach Pithampur via NH34 within 4–6 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over.",
      },
      {
        q: "How does on-site repair or AMC support work for Pithampur customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Pithampur within 3–5 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a call to minimise line downtime.",
      },
      {
        q: "What operator training options exist for a Pithampur auto-cluster unit?",
        a: "Operators are trained during commissioning on cutting and tube-processing parameters for chassis and auto-component work typical of the Pithampur Auto Cluster, with additional on-site or remote sessions available as production ramps up.",
      },
      {
        q: "Which machine suits Pithampur's automotive and auto-component industry best?",
        a: "Given Pithampur's concentration of automotive manufacturing, the RA-T6000 tube laser is well suited to chassis and tubular structural parts, while the RA-RW10 robotic welding cell supports high-volume auto-component welding.",
      },
    ],
  },
  {
    slug: "jabalpur",
    name: "Jabalpur",
    stateSlug: "madhya-pradesh",
    overview: [
      "Jabalpur carries a long-standing ordnance and defence-equipment manufacturing presence alongside a broader general engineering base, making structural and precision fabrication a regular part of local industry.",
      "Workshops around the city typically supply general machinery components, structural parts and equipment supports, serving both defence-linked ancillary demand and wider central Indian customers.",
    ],
    industries: [
      "defence and ordnance-equipment ancillary fabrication",
      "general engineering",
      "structural steel fabrication",
      "sheet-metal job-shop work",
    ],
    industrialAreas: ["Richhai Industrial Area", "Adhartal industrial belt", "district industrial centre"],
    recommendedProductSlugs: ["ra-f3015-pro", "ra-f6020-hd"],
    nearbyCitySlugs: ["indore", "bhopal", "pithampur", "gwalior", "dewas", "ujjain", "satna"],
    logisticsNote:
      "Jabalpur is about 1,050 km from our Kolkata works via NH30 and NH34, so deliveries typically take 3–5 working days from dispatch.",
    faqs: [
      {
        q: "How can a Jabalpur fabricator request a quote and demonstration?",
        a: "Jabalpur customers can share their material and component requirements through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut before the order is confirmed and dispatched.",
      },
      {
        q: "What is the delivery and installation timeline for a Jabalpur order?",
        a: "Machines dispatched from Kolkata generally reach Jabalpur via NH30 within 3–5 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or AMC support work for Jabalpur customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Jabalpur within 3–5 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service call.",
      },
      {
        q: "What operator training options are available for a Jabalpur-based unit?",
        a: "Operators are trained during commissioning on cutting parameters for structural and general engineering components typical of Jabalpur's defence-ancillary and general fabrication units, with follow-up support available on-site or remotely as needed.",
      },
      {
        q: "Which machine suits Jabalpur's defence-ancillary and general engineering base best?",
        a: "For Jabalpur's mix of defence-ancillary and general fabrication, the RA-F3015-PRO 3kW fiber laser is a versatile fit for most sheet work, while the RA-F6020-HD suits heavier structural and equipment-support plate cutting.",
      },
    ],
  },
  {
    slug: "gwalior",
    name: "Gwalior",
    stateSlug: "madhya-pradesh",
    overview: [
      "Gwalior combines a well-established engineering goods manufacturing base with a textile industry, giving the city a diverse mix of fabrication demand across capital goods and general machinery.",
      "Local units typically supply engineering goods components, textile-machinery parts and general sheet-metal work, serving customers across the Gwalior–Chambal industrial belt.",
    ],
    industries: [
      "engineering goods manufacturing",
      "textile machinery components",
      "general fabrication",
      "sheet-metal job-shop work",
    ],
    industrialAreas: ["Malanpur Industrial Area", "Banmore industrial belt", "Gwalior industrial estate"],
    recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
    nearbyCitySlugs: ["indore", "bhopal", "pithampur", "jabalpur", "dewas", "ujjain", "satna"],
    logisticsNote:
      "Gwalior is around 1,150 km from our Kolkata works via NH19 and NH44, so deliveries typically take 4–6 working days from dispatch.",
    faqs: [
      {
        q: "How can a Gwalior fabricator get a quote and see a demonstration?",
        a: "Gwalior customers can share their material and component specifications through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Gwalior order?",
        a: "Machines dispatched from Kolkata generally reach Gwalior via NH19 and NH44 within 4–6 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over.",
      },
      {
        q: "How does on-site repair or AMC support work for Gwalior customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Gwalior within 3–5 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service request.",
      },
      {
        q: "What operator training options are available for a Gwalior-based workshop?",
        a: "Operators are trained during commissioning on cutting parameters for engineering-goods and textile-machinery components typical of Gwalior's Malanpur and Banmore units, with follow-up support available on-site or remotely as needed.",
      },
      {
        q: "Which machine suits Gwalior's engineering goods and textile industry best?",
        a: "For Gwalior's mix of engineering-goods and textile-linked fabrication, the RA-F3015-PRO 3kW fiber laser is a versatile general-purpose fit, while the RA-F1530 suits smaller workshops working mainly with thinner sheet.",
      },
    ],
  },
  {
    slug: "dewas",
    name: "Dewas",
    stateSlug: "madhya-pradesh",
    overview: [
      "Dewas is known for its currency-press precision engineering facility and has grown into an auto-component manufacturing centre serving the nearby Indore–Pithampur industrial corridor.",
      "Fabrication units in Dewas typically supply precision components, auto-component brackets and general sheet-metal parts, benefiting from the town's proximity to the auto cluster.",
    ],
    industries: [
      "precision engineering",
      "auto component manufacturing",
      "general fabrication",
      "sheet-metal job-shop work",
    ],
    industrialAreas: ["Dewas Industrial Area", "Ajanti industrial belt", "district industrial centre"],
    recommendedProductSlugs: ["ra-f3015-pro", "ra-t6000"],
    nearbyCitySlugs: ["indore", "bhopal", "pithampur", "jabalpur", "gwalior", "ujjain", "satna"],
    logisticsNote:
      "Dewas is about 1,280 km from our Kolkata works via NH19 and NH34, so deliveries typically take 4–6 working days from dispatch.",
    faqs: [
      {
        q: "How can a Dewas fabricator request a quote and demonstration?",
        a: "Dewas customers can share their part drawings and material specifications through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut before the order is confirmed and dispatched.",
      },
      {
        q: "What is the delivery and installation timeline for a Dewas order?",
        a: "Machines dispatched from Kolkata generally reach Dewas via NH34 within 4–6 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or AMC support work for Dewas customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Dewas within 3–5 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service call to limit downtime.",
      },
      {
        q: "What operator training options exist for a Dewas auto-component or precision-engineering unit?",
        a: "Operators are trained during commissioning on cutting parameters for precision and auto-component work typical of Dewas's engineering base, with additional on-site or remote sessions available as new operators are inducted.",
      },
      {
        q: "Which machine suits Dewas's precision engineering and auto-component industry best?",
        a: "For Dewas's mix of precision engineering and auto-component fabrication, the RA-F3015-PRO 3kW fiber laser suits general sheet work well, while the RA-T6000 tube laser is a good fit for tubular and chassis-linked auto parts.",
      },
    ],
  },
  {
    slug: "ujjain",
    name: "Ujjain",
    stateSlug: "madhya-pradesh",
    overview: [
      "Ujjain's economy centres on agro-processing and a broader general engineering base serving the surrounding Malwa region, alongside its established position as a trade and pilgrimage town.",
      "Local fabricators typically supply agro-processing machinery parts, general sheet-metal components and equipment supports, serving customers across the district and neighbouring towns.",
    ],
    industries: [
      "agro-processing machinery",
      "general engineering fabrication",
      "sheet-metal job-shop work",
      "equipment support fabrication",
    ],
    industrialAreas: ["Ujjain Industrial Area, Nanakheda", "district industrial centre"],
    recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
    nearbyCitySlugs: ["indore", "bhopal", "pithampur", "jabalpur", "gwalior", "dewas", "satna"],
    logisticsNote:
      "Ujjain is roughly 1,260 km from our Kolkata works via NH19 and NH34, so deliveries typically take 4–6 working days from dispatch.",
    faqs: [
      {
        q: "How can a Ujjain fabricator get a quote and see a demonstration?",
        a: "Ujjain customers can share their material and component requirements through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Ujjain order?",
        a: "Machines dispatched from Kolkata generally reach Ujjain via NH34 within 4–6 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over.",
      },
      {
        q: "How does on-site repair or AMC support work for Ujjain customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Ujjain within 3–5 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service request.",
      },
      {
        q: "What operator training options are available for a Ujjain-based workshop?",
        a: "Operators are trained during commissioning on cutting parameters for agro-processing and general fabrication components typical of Ujjain's engineering base, with follow-up support available on-site or remotely as needed.",
      },
      {
        q: "Which machine suits Ujjain's agro-processing and general engineering base best?",
        a: "For Ujjain's mix of agro-processing machinery and general fabrication, the RA-F1530 1.5kW fiber laser suits thinner sheet and precision work, while the RA-F3015-PRO handles broader general-purpose fabrication needs.",
      },
    ],
  },
  {
    slug: "satna",
    name: "Satna",
    stateSlug: "madhya-pradesh",
    overview: [
      "Satna is centred on cement manufacturing, with several large cement plants driving demand for cement-machinery-linked fabrication and general structural engineering in the surrounding area.",
      "Local workshops typically supply equipment supports, structural components and general machinery parts to the cement sector and nearby general engineering customers.",
    ],
    industries: [
      "cement machinery-linked fabrication",
      "structural steel fabrication",
      "general engineering",
      "equipment support manufacturing",
    ],
    industrialAreas: ["Satna Industrial Area", "district industrial centre"],
    recommendedProductSlugs: ["ra-f6020-hd", "ra-f3015-pro"],
    nearbyCitySlugs: ["indore", "bhopal", "pithampur", "jabalpur", "gwalior", "dewas", "ujjain"],
    logisticsNote:
      "Satna is about 1,000 km from our Kolkata works via NH19 and NH30, so deliveries typically take 3–5 working days from dispatch.",
    faqs: [
      {
        q: "How can a Satna fabricator request a quote and demonstration?",
        a: "Satna customers can share plate specifications and sample drawings through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut on comparable material before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Satna order?",
        a: "Machines dispatched from Kolkata generally reach Satna via NH30 within 3–5 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or AMC support work for Satna customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Satna within 3–5 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service call.",
      },
      {
        q: "What operator training options are available for a Satna cement-linked fabrication unit?",
        a: "Operators are trained during commissioning on cutting parameters for structural and equipment-support components typical of Satna's cement-machinery-linked units, with follow-up support available on-site or remotely as needed.",
      },
      {
        q: "Which machine fits Satna's cement and structural engineering base best?",
        a: "Given Satna's concentration of cement-machinery-linked structural fabrication, the RA-F6020-HD 6kW fiber laser is well suited to thicker plate and equipment-support components, with the RA-F3015-PRO covering general-purpose fabrication needs.",
      },
    ],
  },
];
