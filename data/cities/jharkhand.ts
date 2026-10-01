/** data/cities/jharkhand.ts — part of the RA Machine city dataset. See data/cities.ts for the full editing guide. */
import type { City } from "../types";

export const cities: City[] = [
  {
    slug: "jamshedpur",
    name: "Jamshedpur",
    stateSlug: "jharkhand",
    overview: [
      "Jamshedpur is Tata Steel's home city and one of eastern India's principal 'Steel City' industrial centres, with a dense base of heavy engineering and steel-linked ancillary manufacturing built around the integrated steel plant.",
      "Fabrication units across the city supply structural steel, machined components and general engineering goods to the steel plant's supply chain as well as automotive and general manufacturing customers.",
    ],
    industries: [
      "heavy engineering & structural fabrication",
      "steel-linked ancillary manufacturing",
      "automotive component fabrication",
      "general machine building",
    ],
    industrialAreas: ["Adityapur Industrial Area", "Gamharia industrial belt", "Tata Steel ancillary zone"],
    recommendedFamilies: ["cnc-plasma-cutting-machines", "submerged-arc-welding-machines", "robotic-welding-systems"],
    nearbyCitySlugs: ["ranchi", "bokaro", "dhanbad"],
    logisticsNote:
      "Jamshedpur is about 250 km from our Kolkata works via NH16 and the South Eastern Railway line, so deliveries are typically completed within 1–2 working days of dispatch.",
    faqs: [
      {
        q: "How can a Jamshedpur fabricator get a quote and see a demonstration?",
        a: "Jamshedpur customers can share plate specifications and sample drawings through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut on comparable material before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Jamshedpur order?",
        a: "Machines dispatched from Kolkata generally reach Jamshedpur via NH16 within 1–2 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over.",
      },
      {
        q: "How quickly can on-site repair or service support reach Jamshedpur?",
        a: "Engineers dispatched from our Kolkata works typically reach Jamshedpur's Adityapur and Gamharia units within 1–2 working days for on-site repair, while remote diagnostics are usually initiated within a few working hours of a call.",
      },
      {
        q: "What operator training options exist for a Jamshedpur heavy-engineering unit?",
        a: "Operators are trained during commissioning on cutting parameters for structural steel and machined components typical of Jamshedpur's steel-linked ancillary units, with additional on-site or remote sessions available as new operators are inducted.",
      },
      {
        q: "Which machine fits Jamshedpur's steel and heavy-engineering base best?",
        a: "For the structural steel and heavy plate that dominate Jamshedpur's steel-linked fabrication, a CNC plasma cutting machine is the economical cutting choice, and a submerged arc welding machine handles long, heavy-duty seams on beams, girders and plate structures. Adityapur's auto-component suppliers welding repeat parts in volume can add a robotic welding system.",
      },
    ],
  },
  {
    slug: "ranchi",
    name: "Ranchi",
    stateSlug: "jharkhand",
    overview: [
      "Ranchi hosts a unit of the Heavy Engineering Corporation and carries a broader base of general engineering manufacturing that has grown alongside the city's role as Jharkhand's capital and administrative centre.",
      "Fabrication workshops around the city typically supply structural components, capital-goods parts and general machinery, serving both heavy-engineering and smaller MSME customers across the state.",
    ],
    industries: [
      "heavy engineering & capital goods",
      "general engineering fabrication",
      "structural steel fabrication",
      "sheet-metal job-shop work",
    ],
    industrialAreas: ["Namkum industrial area", "Tatisilwai industrial area", "Ranchi Industrial Area, Kokar"],
    recommendedFamilies: ["cnc-plasma-cutting-machines", "fiber-laser-cutting-machines", "mig-tig-arc-welding-machines"],
    nearbyCitySlugs: ["jamshedpur", "bokaro", "dhanbad"],
    logisticsNote:
      "Ranchi is around 400 km from our Kolkata works via NH19 and NH33, so deliveries typically take 1–2 working days from dispatch.",
    faqs: [
      {
        q: "How can a Ranchi fabricator request a quote and demonstration?",
        a: "Ranchi customers can share their material and component requirements through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut before the order is confirmed and dispatched.",
      },
      {
        q: "What is the delivery and installation timeline for a Ranchi order?",
        a: "Machines dispatched from Kolkata generally reach Ranchi via NH33 within 1–2 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or service support work for Ranchi customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Ranchi's Namkum and Tatisilwai units within 1–2 working days for on-site repair, while remote diagnostics are usually initiated within a few working hours of a service call.",
      },
      {
        q: "What operator training options are available for a Ranchi-based team?",
        a: "Operators are trained during commissioning on cutting parameters for structural and general engineering components typical of Ranchi's capital-goods and fabrication units, with follow-up support available on-site or remotely as needed.",
      },
      {
        q: "Which machine fits Ranchi's heavy engineering and general fabrication base best?",
        a: "Ranchi's capital-goods and structural plate work suits a CNC plasma cutting machine, which keeps the cost of cutting thick mild steel down, while sheet-metal job shops in Namkum and Tatisilwai get finer, more accurate parts from a CNC fiber laser cutting machine. MIG and MMA welding machines cover the general fabrication that follows.",
      },
    ],
  },
  {
    slug: "bokaro",
    name: "Bokaro",
    stateSlug: "jharkhand",
    overview: [
      "Bokaro grew up around the Bokaro Steel Plant and remains a steel-linked industrial town, with fabrication units supplying structural steel, ancillary equipment and general engineering goods to the plant's wider supply chain.",
      "Beyond the steel plant itself, the town's industrial areas host machine shops and general fabricators serving both steel-linked demand and broader engineering customers across the region.",
    ],
    industries: [
      "steel-linked ancillary fabrication",
      "structural steel fabrication",
      "heavy engineering",
      "general machine shop work",
    ],
    industrialAreas: [
      "Bokaro Industrial Area, Sector 1",
      "Bokaro Steel Plant ancillary belt",
      "district industrial centre",
    ],
    recommendedFamilies: ["cnc-plasma-cutting-machines", "submerged-arc-welding-machines", "mig-tig-arc-welding-machines"],
    nearbyCitySlugs: ["jamshedpur", "ranchi", "dhanbad"],
    logisticsNote:
      "Bokaro is about 330 km from our Kolkata works via NH19 and NH23, so deliveries are typically completed within 1–2 working days of dispatch.",
    faqs: [
      {
        q: "How can a Bokaro fabricator get a quote and see a demonstration?",
        a: "Bokaro customers can share plate thickness and part drawings through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut on comparable material before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Bokaro order?",
        a: "Machines dispatched from Kolkata generally reach Bokaro via NH23 within 1–2 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over to the customer.",
      },
      {
        q: "How quickly can on-site repair or service support reach Bokaro?",
        a: "Engineers dispatched from our Kolkata works typically reach Bokaro's steel-linked fabrication units within 1–2 working days for on-site repair, while remote diagnostics are usually initiated within a few working hours of a call.",
      },
      {
        q: "What operator training options exist for a Bokaro steel-ancillary unit?",
        a: "Operators are trained during commissioning on cutting parameters for structural steel and heavy-plate components typical of Bokaro's steel-linked units, with additional on-site or remote sessions available as new operators are inducted.",
      },
      {
        q: "Which machine fits Bokaro's steel-linked heavy engineering base best?",
        a: "Bokaro's steel-plant ancillary work is dominated by thick plate and structural sections, so a CNC plasma cutting machine is usually the best value for cutting. On the welding side, a submerged arc welding machine suits long seams on heavy fabrications and plant equipment, while MIG and MMA welding machines handle the smaller structural and maintenance jobs that keep the plant's supply chain busy.",
      },
    ],
  },
  {
    slug: "dhanbad",
    name: "Dhanbad",
    stateSlug: "jharkhand",
    overview: [
      "Dhanbad sits at the centre of India's coal belt and its industrial base reflects this, with mining-equipment fabrication and coal-linked engineering forming a significant part of local manufacturing activity.",
      "Workshops in and around the city typically supply mining machinery components, structural parts and general engineering goods, serving both coal-sector customers and the wider Jharkhand industrial market.",
    ],
    industries: [
      "mining equipment fabrication",
      "coal-linked heavy engineering",
      "structural steel fabrication",
      "general engineering workshops",
    ],
    industrialAreas: [
      "Dhanbad Industrial Area, Sindri",
      "Jharia coal-belt engineering cluster",
      "district industrial centre",
    ],
    recommendedFamilies: ["cnc-plasma-cutting-machines", "mig-tig-arc-welding-machines", "submerged-arc-welding-machines"],
    nearbyCitySlugs: ["jamshedpur", "ranchi", "bokaro"],
    logisticsNote:
      "Dhanbad is roughly 400 km from our Kolkata works via NH19, so deliveries typically take 1–2 working days from dispatch.",
    faqs: [
      {
        q: "How can a Dhanbad fabricator request a quote and demonstration?",
        a: "Dhanbad customers can share their component and material requirements through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut before the order is confirmed and dispatched.",
      },
      {
        q: "What is the delivery and installation timeline for a Dhanbad order?",
        a: "Machines dispatched from Kolkata generally reach Dhanbad via NH19 within 1–2 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or service support work for Dhanbad customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Dhanbad's Sindri and Jharia-belt units within 1–2 working days for on-site repair, while remote diagnostics are usually initiated within a few working hours of a service call.",
      },
      {
        q: "What operator training options are available for a Dhanbad mining-equipment unit?",
        a: "Operators are trained during commissioning on cutting parameters for mining machinery components and structural fabrication typical of Dhanbad's coal-linked units, with follow-up support available on-site or remotely as needed.",
      },
      {
        q: "Which machine fits Dhanbad's coal and mining-equipment industry best?",
        a: "Mining-machinery components and structural parts for Dhanbad's coal sector are mostly heavy mild steel plate, which a CNC plasma cutting machine cuts economically. Sindri and Jharia-belt workshops depend on MIG and MMA welding machines for fabrication and the constant rebuild work mining equipment needs, and a submerged arc welding machine suits larger units welding heavy structures.",
      },
    ],
  },
];
