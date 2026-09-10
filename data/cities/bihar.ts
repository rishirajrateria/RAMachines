/** data/cities/bihar.ts — part of the RA Machine city dataset. See data/cities.ts for the full editing guide. */
import type { City } from "../types";

export const cities: City[] = [
  {
    slug: "patna",
    name: "Patna",
    stateSlug: "bihar",
    overview: [
      "Patna is Bihar's largest industrial and commercial centre, with a growing MSME base spanning agro-processing, general engineering and light manufacturing that feeds demand across the state.",
      "Fabrication units around the city typically serve food-processing, transport-body and general machinery customers, with a rising number of workshops upgrading from manual cutting to more precise processes as order volumes grow.",
    ],
    industries: [
      "agro-processing machinery",
      "general engineering fabrication",
      "transport body building",
      "sheet-metal and general fabrication",
    ],
    industrialAreas: ["Patna Industrial Area, Fatuha", "Bihta industrial area", "district industrial centre"],
    recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
    nearbyCitySlugs: ["muzaffarpur", "bhagalpur", "gaya"],
    logisticsNote:
      "Patna is roughly 580 km from our Kolkata works via NH19, so deliveries are typically completed within 2–3 working days of dispatch.",
    faqs: [
      {
        q: "How can a Patna fabricator get a quote and see a machine demonstration?",
        a: "Patna customers can share their material and part requirements through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut before the order is confirmed and dispatched.",
      },
      {
        q: "What is the delivery and installation timeline for a Patna order?",
        a: "Machines dispatched from our Kolkata works generally reach Patna via NH19 within 2–3 working days, after which our engineers complete installation, electrical commissioning and test cuts on-site before handing the machine over.",
      },
      {
        q: "How does on-site repair or AMC support work for a Patna workshop?",
        a: "For Patna customers, engineers are dispatched from our Kolkata works for on-site repair visits, typically reaching site within 2–3 working days for major issues, while remote diagnostics under AMC are usually initiated within a few working hours of a call.",
      },
      {
        q: "What operator training options are available for a Patna-based team?",
        a: "Operators are trained hands-on during commissioning, covering nesting software and cutting parameters for general fabrication and agro-processing components, with follow-up support available by phone or video given the distance from our Kolkata base.",
      },
      {
        q: "Which machine fits Patna's agro-processing and general engineering base best?",
        a: "For Patna's mix of agro-processing machinery and general fabrication, the RA-F1530 1.5kW fiber laser suits thinner sheet and entry-level work, while the RA-F3015-PRO is well suited to heavier general-purpose fabrication as order volumes grow.",
      },
    ],
  },
  {
    slug: "muzaffarpur",
    name: "Muzaffarpur",
    stateSlug: "bihar",
    overview: [
      "Muzaffarpur is known nationally for its litchi cultivation and processing, and the town's industrial base includes litchi and food-processing machinery alongside a long-standing leather goods manufacturing tradition.",
      "Local workshops typically fabricate processing equipment, storage structures and general machinery components, serving both the seasonal litchi trade and year-round leather and general engineering demand.",
    ],
    industries: [
      "litchi and food-processing machinery",
      "leather goods manufacturing",
      "general engineering fabrication",
      "sheet-metal job-shop work",
    ],
    industrialAreas: ["Muzaffarpur Industrial Area, Bela", "district industrial centre"],
    recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
    nearbyCitySlugs: ["patna", "bhagalpur", "gaya"],
    logisticsNote:
      "Muzaffarpur is around 610 km from our Kolkata works via NH19 and NH922, so deliveries typically take 2–3 working days from dispatch.",
    faqs: [
      {
        q: "How can a Muzaffarpur business request a quote and demonstration?",
        a: "Muzaffarpur customers can share their processing or fabrication requirements through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut before the order is placed.",
      },
      {
        q: "What is the delivery and installation timeline for a Muzaffarpur order?",
        a: "Machines dispatched from Kolkata generally reach Muzaffarpur via NH19 and NH922 within 2–3 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover.",
      },
      {
        q: "How does on-site repair or AMC support work for Muzaffarpur customers?",
        a: "Engineers are dispatched from our Kolkata works for on-site repair, typically reaching Muzaffarpur within 2–3 working days for major faults, while remote diagnostics under AMC are usually initiated within a few working hours of a service request.",
      },
      {
        q: "What training is available for operators at a Muzaffarpur processing or leather unit?",
        a: "Operators are trained during commissioning on cutting parameters for processing-equipment components and general sheet fabrication, with phone or video follow-up support available afterward given the distance from our Kolkata base.",
      },
      {
        q: "Which machine suits Muzaffarpur's litchi-processing and leather goods industry best?",
        a: "For Muzaffarpur's mix of processing machinery and leather goods hardware, the RA-F1530 1.5kW fiber laser is well suited to thinner sheet and precision components, while the RA-F3015-PRO handles heavier general fabrication needs.",
      },
    ],
  },
  {
    slug: "bhagalpur",
    name: "Bhagalpur",
    stateSlug: "bihar",
    overview: [
      "Bhagalpur is widely known as India's 'Silk City' for its tussar silk weaving industry, and alongside this textile heritage the town carries a base of general fabrication workshops serving local and regional customers.",
      "Fabricators here typically supply looms and textile-machinery parts, general sheet-metal components and small engineering goods, with demand growing as textile and general manufacturing units modernise their equipment.",
    ],
    industries: [
      "textile and loom machinery components",
      "general fabrication",
      "sheet-metal job-shop work",
      "general engineering",
    ],
    industrialAreas: ["Bhagalpur Industrial Area, Barari", "district industrial centre"],
    recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
    nearbyCitySlugs: ["patna", "muzaffarpur", "gaya"],
    logisticsNote:
      "Bhagalpur is about 430 km from our Kolkata works via NH80 and NH31, so deliveries are typically completed within 2–3 working days of dispatch.",
    faqs: [
      {
        q: "How can a Bhagalpur workshop get a quote and see a demonstration?",
        a: "Bhagalpur customers can share their material and component requirements through the website or phone; our team then recommends a suitable model and, where practical, arranges a demonstration cut before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Bhagalpur order?",
        a: "Machines dispatched from Kolkata generally reach Bhagalpur via NH80 within 2–3 working days, after which our engineers carry out installation, electrical commissioning and test cuts on-site before handover to the customer's team.",
      },
      {
        q: "How does on-site repair or AMC support work for Bhagalpur customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Bhagalpur within 2–3 working days for on-site repair visits, while remote diagnostics under AMC are usually initiated within a few working hours of a service call.",
      },
      {
        q: "What operator training options are available for a Bhagalpur unit?",
        a: "Operators are trained during commissioning on cutting parameters for loom-component and general sheet-metal work typical of Bhagalpur's textile-linked engineering base, with phone or video follow-up support available afterward.",
      },
      {
        q: "Which machine fits Bhagalpur's textile and general engineering base best?",
        a: "For Bhagalpur's mix of textile-machinery components and general fabrication, the RA-F1530 1.5kW fiber laser suits thinner sheet and loom-part precision work, while the RA-F3015-PRO is a good fit for broader general-purpose fabrication.",
      },
    ],
  },
  {
    slug: "gaya",
    name: "Gaya",
    stateSlug: "bihar",
    overview: [
      "Gaya's economy combines a well-known stone-craft tradition with agro-processing activity serving the surrounding district, giving the town a mix of small workshop fabrication and larger processing-equipment needs.",
      "Local units typically supply general engineering goods, stone-craft tooling supports and agro-processing machinery parts, with demand for precise sheet-metal cutting rising alongside district-level manufacturing growth.",
    ],
    industries: [
      "stone-craft industry support fabrication",
      "agro-processing machinery",
      "general engineering",
      "sheet-metal job-shop work",
    ],
    industrialAreas: ["Gaya Industrial Area", "district industrial centre"],
    recommendedProductSlugs: ["ra-f1530", "ra-f3015-pro"],
    nearbyCitySlugs: ["patna", "muzaffarpur", "bhagalpur"],
    logisticsNote:
      "Gaya is roughly 470 km from our Kolkata works via NH19 and NH83, so deliveries are typically completed within 2–3 working days of dispatch.",
    faqs: [
      {
        q: "How can a Gaya fabricator request a quote and see a demonstration?",
        a: "Gaya customers can share their material and component specifications through the website or phone; our team then quotes a suitable model and, where feasible, arranges a demonstration cut before the order is confirmed.",
      },
      {
        q: "What is the delivery and installation timeline for a Gaya order?",
        a: "Machines dispatched from Kolkata generally reach Gaya via NH19 and NH83 within 2–3 working days, after which our engineers complete installation, commissioning and test cuts on-site before handover to the customer's operators.",
      },
      {
        q: "How does on-site repair or AMC support work for Gaya customers?",
        a: "Engineers dispatched from our Kolkata works typically reach Gaya within 2–3 working days for on-site repair, while remote diagnostics under AMC are usually initiated within a few working hours of a service request.",
      },
      {
        q: "What operator training options are available for a Gaya-based workshop?",
        a: "Operators are trained during commissioning on cutting parameters for general fabrication and agro-processing components common in Gaya, with phone or video follow-up support available afterward given the distance from our Kolkata base.",
      },
      {
        q: "Which machine suits Gaya's agro-processing and general engineering base best?",
        a: "For Gaya's mix of agro-processing machinery and general fabrication, the RA-F1530 1.5kW fiber laser suits thinner sheet and precision work, while the RA-F3015-PRO is well suited to broader general-purpose fabrication needs.",
      },
    ],
  },
];
