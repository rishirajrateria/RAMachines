/**
 * config/site.ts — the single source of truth for brand facts.
 * Change phone/email/address/stats here; every page reads from this file.
 * Values marked PLACEHOLDER must be replaced before launch.
 */
export const site = {
  name: "RA Machine",
  legalName: "RA Machine (a brand of RA Group)",
  parent: "RA Group",
  tagline: "Laser Cutting Machines Built in India, Trusted Worldwide",
  description:
    "RA Machine is a Kolkata-based manufacturer and exporter of fiber laser cutting machines, CO2 laser machines, tube laser cutters and robotic MIG/MAG welding systems, with pan-India installation, service and training and export to 25+ countries.",
  url: "https://www.ramachine.com", // PLACEHOLDER — set to the live domain before deploy (no trailing slash)
  foundedYear: 2009, // PLACEHOLDER
  phoneDisplay: "+91 98361 33102",
  phoneE164: "+919836133102",
  phoneHref: "tel:+919836133102",
  whatsappHref: "https://wa.me/919836133102",
  email: "PLACEHOLDER_EMAIL@ramachine.com", // PLACEHOLDER — also the Web3Forms recipient (see NOTES.md)
  hours: "Mon–Sat, 10:00–18:00 IST",
  hoursSchema: ["Mo-Sa 10:00-18:00"],
  address: {
    street: "16A/2, Bus Stand, Chandra Nath Roy Rd, near 42Nos, Panchanna Pally, Tiljala",
    locality: "Kolkata",
    region: "West Bengal",
    postalCode: "700039",
    country: "India",
    countryCode: "IN",
    full: "16A/2, Bus Stand, Chandra Nath Roy Rd, near 42Nos, Panchanna Pally, Tiljala, Kolkata, West Bengal 700039, India",
    mapsEmbedUrl:
      "https://www.google.com/maps?q=16A/2,+Chandra+Nath+Roy+Rd,+Tiljala,+Kolkata,+West+Bengal+700039&output=embed",
    mapsLinkUrl:
      "https://www.google.com/maps/search/?api=1&query=16A/2+Chandra+Nath+Roy+Rd+Tiljala+Kolkata+700039",
    geo: { lat: 22.5354, lng: 88.3936 }, // PLACEHOLDER approx. Tiljala
  },
  raAuto: { name: "RA Auto", url: "https://raauto.net", blurb: "Automotive division of RA Group" },
  /** PLACEHOLDER stats — replace with audited numbers. Keep the "+" style. */
  stats: [
    { value: "500+", label: "machines installed" },
    { value: "25+", label: "countries served" },
    { value: "15+", label: "years in manufacturing" },
    { value: "1,000+", label: "operators trained" },
  ],
  /** PLACEHOLDER service commitments — shown on repair & product pages. */
  service: {
    responseTime: "48 hours", // on-site response for metro & major industrial cities (placeholder)
    remoteResponseTime: "4 working hours",
    warrantyMonths: 24,
    leadTimeWeeks: "6–8",
    exportPaymentTerms: "30% advance with order, 70% against pre-shipment inspection", // PLACEHOLDER
    exportIncoterms: "FOB Kolkata / CIF nearest major port", // PLACEHOLDER
  },
  social: {
    // PLACEHOLDER — leave empty string to hide a link
    linkedin: "https://www.linkedin.com/company/ramachine",
    youtube: "https://www.youtube.com/@ramachine",
    facebook: "",
    instagram: "",
  },
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
} as const;

export type Site = typeof site;
