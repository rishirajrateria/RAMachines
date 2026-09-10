/** data/cities/odisha.ts — part of the RA Machine city dataset. See data/cities.ts for the full editing guide. */
import type { City } from "../types";

export const cities: City[] = [
  {
    slug: "bhubaneswar",
    name: "Bhubaneswar",
    stateSlug: "odisha",
    overview: [
      "Bhubaneswar has built a reputation as an IT and services hub around its Infocity district, while also developing a growing general-engineering and light-manufacturing base serving Odisha's expanding industrial economy.",
      "Fabrication units around the city typically supply general machinery, equipment enclosures and structural components, serving both local industry and the wider Bhubaneswar–Cuttack industrial corridor.",
    ],
    industries: [
      "general engineering fabrication",
      "equipment enclosures and structural components",
      "light manufacturing",
      "sheet-metal job-shop work",
    ],
    industrialAreas: ["Infocity industrial and IT belt", "Rasulgarh industrial estate", "Patia industrial area"],
    recommendedProductSlugs: ["ra-f3015-pro", "ra-f1530"],
    nearbyCitySlugs: ["cuttack", "rourkela", "angul"],
    logisticsNote:
      "Bhubaneswar is around 440 km from our Kolkata works via NH16, so deliveries are typically completed within 2–3 working days of dispatch.",
    faqs: [
      {
        q: "How can a Bhubaneswar business get a quote and see a demonstration?",
        a: "Bhubaneswar customers can share their material and part requirements through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut before the order is confirmed and dispatched.",
      },
      {
        q: "What is the delivery and installation timeline for a Bhubaneswar order?",
        a: "Machines dispatched from Kolkata generally reach Bhubaneswar via NH16 within 2–3 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over.",
      },
      {
        q: "How does on-site repair or AMC support work for Bhubaneswar customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Bhubaneswar within 2–3 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service request.",
      },
      {
        q: "What operator training options are available for a Bhubaneswar-based team?",
        a: "Operators are trained hands-on during commissioning, covering nesting software and cutting parameters for general fabrication and equipment-enclosure work, with phone or video follow-up support available given the distance from our Kolkata base.",
      },
      {
        q: "Which machine suits Bhubaneswar's general engineering and light-manufacturing base best?",
        a: "For Bhubaneswar's mix of general engineering and light manufacturing, the RA-F3015-PRO 3kW fiber laser is the most versatile fit, while the RA-F1530 suits smaller workshops working mainly with thinner sheet.",
      },
    ],
  },
  {
    slug: "cuttack",
    name: "Cuttack",
    stateSlug: "odisha",
    overview: [
      "Cuttack is known for its traditional silver-filigree craft, and alongside this heritage industry the city carries a base of general engineering workshops supplying the surrounding Mahanadi delta region.",
      "Local fabricators typically produce general machinery parts, tooling supports for craft industries and sheet-metal components, serving customers across central Odisha.",
    ],
    industries: [
      "silver-filigree craft support tooling",
      "general engineering fabrication",
      "sheet-metal job-shop work",
      "agro-processing equipment",
    ],
    industrialAreas: ["Cuttack Industrial Estate, Madhupatna", "district industrial centre"],
    recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
    nearbyCitySlugs: ["bhubaneswar", "rourkela", "angul"],
    logisticsNote:
      "Cuttack is about 470 km from our Kolkata works via NH16, so deliveries typically take 2–3 working days from dispatch.",
    faqs: [
      {
        q: "How can a Cuttack fabricator request a quote and demonstration?",
        a: "Cuttack customers can share their material and component specifications through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Cuttack order?",
        a: "Machines dispatched from Kolkata generally reach Cuttack via NH16 within 2–3 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or AMC support work for Cuttack customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Cuttack within 2–3 working days for on-site repair, while remote diagnostics under AMC are usually initiated within a few working hours of a service request.",
      },
      {
        q: "What operator training options are available for a Cuttack-based workshop?",
        a: "Operators are trained during commissioning on cutting parameters for general fabrication and craft-support tooling common in Cuttack, with phone or video follow-up support available afterward given the distance from our Kolkata base.",
      },
      {
        q: "Which machine suits Cuttack's general engineering and craft-linked industry best?",
        a: "For Cuttack's mix of general engineering and craft-support fabrication, the RA-F1530 1.5kW fiber laser suits thinner sheet and precision tooling work, while the RA-F3015-PRO is well suited to broader general-purpose fabrication.",
      },
    ],
  },
  {
    slug: "rourkela",
    name: "Rourkela",
    stateSlug: "odisha",
    overview: [
      "Rourkela grew up around the Rourkela Steel Plant, one of India's integrated steel producers, and the city carries a substantial base of steel-linked heavy fabrication and ancillary manufacturing.",
      "Workshops across the city typically supply structural steel, machined components and general engineering goods to the plant's supply chain, alongside customers across western Odisha.",
    ],
    industries: [
      "steel-linked heavy fabrication",
      "structural steel manufacturing",
      "heavy engineering ancillary units",
      "general machine shop work",
    ],
    industrialAreas: [
      "Rourkela Industrial Estate, Basanti Colony",
      "Rourkela Steel Plant ancillary belt",
      "district industrial centre",
    ],
    recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k"],
    nearbyCitySlugs: ["bhubaneswar", "cuttack", "angul"],
    logisticsNote:
      "Rourkela is roughly 650 km from our Kolkata works via NH49 and NH143, so deliveries typically take 3–4 working days from dispatch.",
    faqs: [
      {
        q: "How can a Rourkela fabricator get a quote and see a demonstration?",
        a: "Rourkela customers can share plate specifications and sample drawings through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut on comparable material before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Rourkela order?",
        a: "Machines dispatched from Kolkata generally reach Rourkela via NH49 within 3–4 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over.",
      },
      {
        q: "How quickly can on-site repair or AMC support reach Rourkela?",
        a: "Given the distance involved, engineers dispatched from our Kolkata works typically reach Rourkela within 3–4 working days for on-site repair, while remote diagnostics under AMC are usually initiated within a few working hours of a service call.",
      },
      {
        q: "What operator training options exist for a Rourkela steel-ancillary unit?",
        a: "Operators are trained during commissioning on cutting parameters for structural steel and heavy-plate components typical of Rourkela's steel-linked units, with additional on-site or remote sessions available as new operators are inducted.",
      },
      {
        q: "Which machine fits Rourkela's steel and heavy-engineering base best?",
        a: "Given Rourkela's concentration of steel-linked heavy fabrication, the RA-F6020-HD 6kW and RA-F12K fiber lasers are the most suitable choices for thick-plate structural cutting typical of the plant's ancillary supply chain.",
      },
    ],
  },
  {
    slug: "angul",
    name: "Angul",
    stateSlug: "odisha",
    overview: [
      "Angul hosts the NALCO aluminium smelter and a cluster of thermal power plants, giving the town a heavy-industrial base centred on power-plant ancillary equipment and aluminium-linked fabrication work.",
      "Local workshops typically supply structural steel, equipment supports and general engineering components to the power and aluminium sector, alongside smaller general fabrication customers in the district.",
    ],
    industries: [
      "aluminium smelter ancillary fabrication",
      "power-plant ancillary equipment",
      "structural steel fabrication",
      "heavy engineering",
    ],
    industrialAreas: ["Angul Industrial Estate", "NALCO ancillary industrial belt", "district industrial centre"],
    recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k"],
    nearbyCitySlugs: ["bhubaneswar", "cuttack", "rourkela"],
    logisticsNote:
      "Angul is about 580 km from our Kolkata works via NH16 and NH55, so deliveries typically take 3–4 working days from dispatch.",
    faqs: [
      {
        q: "How can an Angul fabricator request a quote and demonstration?",
        a: "Angul customers can share their plate and component requirements through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut before the order is confirmed and dispatched.",
      },
      {
        q: "What is the delivery and installation timeline for an Angul order?",
        a: "Machines dispatched from Kolkata generally reach Angul via NH16 and NH55 within 3–4 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or AMC support work for Angul customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Angul within 3–4 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service request.",
      },
      {
        q: "What operator training options are available for an Angul power or aluminium-linked unit?",
        a: "Operators are trained during commissioning on cutting parameters for structural and equipment-support components typical of Angul's power-plant and aluminium-linked fabrication, with follow-up support available on-site or remotely as needed.",
      },
      {
        q: "Which machine fits Angul's power-plant and aluminium smelter ancillary industry best?",
        a: "Given Angul's concentration of power-plant and aluminium-linked heavy fabrication, the RA-F6020-HD 6kW and RA-F12K fiber lasers are the most suitable choices for the thicker structural plate typical of ancillary equipment supply.",
      },
    ],
  },
];
