/** data/cities/chhattisgarh.ts — part of the RA Machine city dataset. See data/cities.ts for the full editing guide. */
import type { City } from "../types";

export const cities: City[] = [
  {
    slug: "raipur",
    name: "Raipur",
    stateSlug: "chhattisgarh",
    overview: [
      "Raipur has developed as a major sponge-iron and steel-re-rolling hub, with a dense base of general engineering workshops supplying the state's wider steel and industrial economy.",
      "Fabrication units across the city typically produce structural steel, machined components and general engineering goods, serving both steel-sector customers and Chhattisgarh's broader manufacturing base.",
    ],
    industries: [
      "sponge iron and steel re-rolling",
      "structural steel fabrication",
      "general engineering",
      "heavy engineering ancillary units",
    ],
    industrialAreas: ["Urla Industrial Area", "Siltara Industrial Area", "Sirgitti industrial belt"],
    recommendedProductSlugs: ["ra-f6020-hd", "ra-f3015-pro", "ra-rw6"],
    nearbyCitySlugs: ["bhilai", "bilaspur", "korba"],
    logisticsNote:
      "Raipur is roughly 540 km from our Kolkata works via NH49 and NH130, so deliveries typically take 2–4 working days from dispatch.",
    faqs: [
      {
        q: "How can a Raipur fabricator get a quote and see a demonstration?",
        a: "Raipur customers can share plate specifications and sample drawings through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut on comparable material before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Raipur order?",
        a: "Machines dispatched from Kolkata generally reach Raipur via NH49 within 2–4 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over.",
      },
      {
        q: "How quickly can on-site repair or AMC support reach Raipur?",
        a: "Engineers dispatched from our Kolkata works typically reach Raipur's Urla and Siltara industrial units within 2–4 working days for on-site repair, while remote diagnostics under AMC are usually initiated within a few working hours of a service call.",
      },
      {
        q: "What operator training options exist for a Raipur steel or general engineering unit?",
        a: "Operators are trained during commissioning on cutting parameters for structural steel and general fabrication components typical of Raipur's sponge-iron and re-rolling-linked units, with additional on-site or remote sessions available as needed.",
      },
      {
        q: "Which machine fits Raipur's steel and general engineering base best?",
        a: "Given Raipur's concentration of steel-linked fabrication, the RA-F6020-HD 6kW fiber laser suits structural and plate cutting well, while the RA-RW6 robotic welding cell is a good fit for repetitive welding on re-rolling and general engineering components.",
      },
    ],
  },
  {
    slug: "bhilai",
    name: "Bhilai",
    stateSlug: "chhattisgarh",
    overview: [
      "Bhilai is home to the Bhilai Steel Plant, one of India's largest integrated steel producers, and the city's industrial base is dominated by heavy fabrication and steel-linked ancillary manufacturing.",
      "Workshops across Bhilai typically supply structural steel, machined components and general engineering goods to the plant's extensive supply chain, alongside customers across central Chhattisgarh.",
    ],
    industries: [
      "steel-linked heavy fabrication",
      "structural steel manufacturing",
      "heavy engineering ancillary units",
      "general machine shop work",
    ],
    industrialAreas: [
      "Bhilai Steel Plant ancillary belt",
      "Bhilai Industrial Estate, Hathkhoj",
      "district industrial centre",
    ],
    recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k"],
    nearbyCitySlugs: ["raipur", "bilaspur", "korba"],
    logisticsNote:
      "Bhilai is about 570 km from our Kolkata works via NH49 and NH130, so deliveries typically take 2–4 working days from dispatch.",
    faqs: [
      {
        q: "How can a Bhilai fabricator request a quote and demonstration?",
        a: "Bhilai customers can share their plate and component requirements through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut before the order is confirmed and dispatched.",
      },
      {
        q: "What is the delivery and installation timeline for a Bhilai order?",
        a: "Machines dispatched from Kolkata generally reach Bhilai via NH49 within 2–4 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or AMC support work for Bhilai customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Bhilai within 2–4 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service request.",
      },
      {
        q: "What operator training options are available for a Bhilai steel-ancillary unit?",
        a: "Operators are trained during commissioning on cutting parameters for structural steel and heavy-plate components typical of Bhilai's steel-linked units, with additional on-site or remote sessions available as new operators are inducted.",
      },
      {
        q: "Which machine fits Bhilai's steel and heavy-engineering base best?",
        a: "Given Bhilai's concentration of steel-linked heavy fabrication, the RA-F6020-HD 6kW and RA-F12K fiber lasers are the most suitable choices, handling the thicker plate and structural work typical of the plant's ancillary supply chain.",
      },
    ],
  },
  {
    slug: "bilaspur",
    name: "Bilaspur",
    stateSlug: "chhattisgarh",
    overview: [
      "Bilaspur serves as a South East Central Railway zonal headquarters and carries a growing base of power-plant-linked engineering, reflecting the district's cluster of thermal power projects.",
      "Local fabrication units typically supply railway ancillary components, power-plant equipment supports and general engineering goods, serving customers across the wider Chhattisgarh industrial belt.",
    ],
    industries: [
      "railway-linked engineering",
      "power-plant ancillary equipment",
      "structural steel fabrication",
      "general engineering",
    ],
    industrialAreas: ["Bilaspur Industrial Growth Centre, Sirgitti", "district industrial centre"],
    recommendedProductSlugs: ["ra-f3015-pro", "ra-f6020-hd"],
    nearbyCitySlugs: ["raipur", "bhilai", "korba"],
    logisticsNote:
      "Bilaspur is around 600 km from our Kolkata works via NH130 and NH49, so deliveries typically take 2–4 working days from dispatch.",
    faqs: [
      {
        q: "How can a Bilaspur fabricator get a quote and see a demonstration?",
        a: "Bilaspur customers can share their material and component requirements through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Bilaspur order?",
        a: "Machines dispatched from Kolkata generally reach Bilaspur via NH130 within 2–4 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over.",
      },
      {
        q: "How does on-site repair or AMC support work for Bilaspur customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Bilaspur within 2–4 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service request.",
      },
      {
        q: "What operator training options are available for a Bilaspur-based team?",
        a: "Operators are trained during commissioning on cutting parameters for railway-linked and power-plant ancillary components typical of Bilaspur's engineering base, with follow-up support available on-site or remotely as needed.",
      },
      {
        q: "Which machine suits Bilaspur's railway and power-plant-linked industry best?",
        a: "For Bilaspur's mix of railway-linked and power-plant ancillary fabrication, the RA-F3015-PRO 3kW fiber laser is a versatile general-purpose fit, while the RA-F6020-HD suits heavier structural and equipment-support plate work.",
      },
    ],
  },
  {
    slug: "korba",
    name: "Korba",
    stateSlug: "chhattisgarh",
    overview: [
      "Korba is one of Chhattisgarh's principal power and industrial towns, home to coal mining, thermal power generation and the BALCO aluminium smelter, all of which drive demand for heavy industrial fabrication.",
      "Workshops in and around Korba typically supply structural steel, equipment supports and mining or power-plant ancillary components, serving the district's dominant coal, power and aluminium sectors.",
    ],
    industries: [
      "coal and mining equipment fabrication",
      "power-plant ancillary equipment",
      "aluminium smelter ancillary fabrication",
      "heavy structural fabrication",
    ],
    industrialAreas: ["Korba Industrial Growth Centre", "BALCO ancillary industrial belt", "district industrial centre"],
    recommendedProductSlugs: ["ra-f6020-hd", "ra-f12k"],
    nearbyCitySlugs: ["raipur", "bhilai", "bilaspur"],
    logisticsNote:
      "Korba is about 670 km from our Kolkata works via NH130 and NH49, so deliveries typically take 3–4 working days from dispatch.",
    faqs: [
      {
        q: "How can a Korba fabricator request a quote and demonstration?",
        a: "Korba customers can share their plate and component requirements through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut before the order is confirmed and dispatched.",
      },
      {
        q: "What is the delivery and installation timeline for a Korba order?",
        a: "Machines dispatched from Kolkata generally reach Korba via NH130 within 3–4 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or AMC support work for Korba customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Korba within 3–4 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service request.",
      },
      {
        q: "What operator training options are available for a Korba power or aluminium-linked unit?",
        a: "Operators are trained during commissioning on cutting parameters for structural and equipment-support components typical of Korba's coal, power-plant and aluminium-linked fabrication, with follow-up support available on-site or remotely as needed.",
      },
      {
        q: "Which machine fits Korba's coal, power and aluminium smelter industry best?",
        a: "Given Korba's concentration of heavy industrial fabrication linked to coal, power and aluminium, the RA-F6020-HD 6kW and RA-F12K fiber lasers are the most suitable choices for thick-plate structural and equipment-support cutting.",
      },
    ],
  },
];
