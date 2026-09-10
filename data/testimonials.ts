/**
 * data/testimonials.ts — 6 placeholder customer testimonials shown on the home
 * page (3 Indian, 3 international). Every name, role and company below is a
 * realistic placeholder marked `// PLACEHOLDER` and must be replaced with real,
 * consented customer quotes before launch. To add or swap an entry, keep the
 * mix of Indian and international locations and reference a real product slug
 * where relevant so the quote can link through to that product page.
 */
import type { Testimonial } from "./types";

export const testimonials: Testimonial[] = [
  {
    // PLACEHOLDER
    quote:
      "We run the RA-F3015 Pro across two shifts cutting bicycle and auto component brackets, and uptime has been the real win. Nesting software keeps scrap low, and the local team's response whenever we've needed a service visit has been quick and thorough.",
    name: "Ravinder Singh Sethi",
    role: "Production Head",
    company: "Sethi Precision Engineering",
    location: "Ludhiana, India",
    productSlug: "ra-f3015-pro",
  },
  {
    // PLACEHOLDER
    quote:
      "Our pump and valve housings need clean edges on thick plate, and the RA-F6020 HD handles 25 mm carbon steel without a second pass. Installation and operator training were completed in under a week, which let us get back into production fast.",
    name: "Jignesh Bhalodia",
    role: "Managing Director",
    company: "Bhalodia Engineering Works",
    location: "Rajkot, India",
    productSlug: "ra-f6020-hd",
  },
  {
    // PLACEHOLDER
    quote:
      "Weld consistency across our motor bracket range used to depend on which operator was on shift. The RA-RW6 cell has removed that variability entirely, and rework on those parts has come down sharply since we commissioned it.",
    name: "K. Elangovan",
    role: "Operations Manager",
    company: "Elango Motors & Pumps Pvt. Ltd.",
    location: "Coimbatore, India",
    productSlug: "ra-rw6",
  },
  {
    // PLACEHOLDER
    quote:
      "We imported the RA-F1530 for our signage and general fabrication line, and the export process was straightforward — clear documentation, a pre-shipment inspection video, and a technician who walked our operators through commissioning remotely before arriving on site.",
    name: "Nguyen Van Thanh",
    role: "Factory Director",
    company: "Thanh Phat Metal Fabrication Co., Ltd.",
    location: "Hanoi, Vietnam",
    productSlug: "ra-f1530",
  },
  {
    // PLACEHOLDER
    quote:
      "Structural steel work for our trading and fabrication projects needs a machine that can take thick plate without slowing down. The RA-F12K cuts 40 mm sections cleanly, and spares support from Kolkata has kept our downtime minimal since installation.",
    name: "Omar Al Farsi",
    role: "General Manager",
    company: "Al Farsi Steel Trading LLC",
    location: "Dubai, United Arab Emirates",
    productSlug: "ra-f12k",
  },
  {
    // PLACEHOLDER
    quote:
      "We cut round and square tube for handrails and furniture frames all day, and the RA-T6000's auto-loading and follow-rest have cut our setup time considerably compared with the manual tube-cutting method we used before.",
    name: "Peter Mwangi",
    role: "Workshop Manager",
    company: "Mwangi Metal Works Ltd.",
    location: "Nairobi, Kenya",
    productSlug: "ra-t6000",
  },
];
