/**
 * config/site.ts — the single source of truth for brand facts.
 * Change phone/email/address/stats here; every page reads from this file.
 *
 * All values below are CONFIRMED by the owner (RA_MACHINES.docx, Sept 2026) unless
 * a comment marks them PLACEHOLDER. Remaining placeholders: `url` (live domain),
 * `social` links, and `address.geo` (approximate map pin).
 */
export const site = {
  name: "RA Machine",
  legalName: "R.A. Auto Engineering Works",
  parent: "RA Group",
  tagline: "Laser Cutting Machines Built in India, Trusted Worldwide",
  description:
    "RA Machine is the CNC machine division of R.A. Auto Engineering Works, Kolkata — building and supplying customised fiber laser cutting, CO2 laser, tube laser and robotic MIG/MAG welding machines, with installation, service and operator training across India and export to 25+ countries.",
  url: "https://www.ramachine.com", // PLACEHOLDER — set to the live domain before deploy (no trailing slash)
  /** R.A. Auto Engineering Works was established in 1989; CNC machine assembly began in 2008. */
  foundedYear: 1989,
  machineDivisionSince: 2008,
  phoneDisplay: "+91 82408 55051",
  phoneE164: "+918240855051",
  phoneHref: "tel:+918240855051",
  whatsappHref: "https://wa.me/918240855051",
  email: "salesraauto@gmail.com",
  hours: "Mon–Sat, 11:00–18:00 IST",
  hoursSchema: ["Mo-Sa 11:00-18:00"],
  address: {
    street: "16A/2A, C. N. Roy Road",
    locality: "Kolkata",
    region: "West Bengal",
    postalCode: "700039",
    country: "India",
    countryCode: "IN",
    full: "16A/2A, C. N. Roy Road, Kolkata, West Bengal 700039, India",
    mapsEmbedUrl:
      "https://www.google.com/maps?q=16A/2A,+C.+N.+Roy+Road,+Kolkata,+West+Bengal+700039&output=embed",
    mapsLinkUrl:
      "https://www.google.com/maps/search/?api=1&query=16A%2F2A+C.+N.+Roy+Road+Kolkata+700039",
    geo: { lat: 22.5354, lng: 88.3936 }, // PLACEHOLDER approximate pin for C. N. Roy Road
  },
  raAuto: {
    name: "RA Auto",
    url: "https://raauto.net",
    blurb: "Automotive and railway components division of R.A. Auto Engineering Works",
  },
  /**
   * Confirmed figures. "machines installed" and "operators trained" are the owner's own
   * numbers; "countries served" is carried over from the brief (the owner confirmed the
   * export reach separately). Edit any value here and it updates across the whole site.
   */
  stats: [
    { value: "1989", label: "engineering since" },
    { value: "20+", label: "machines installed" },
    { value: "25+", label: "countries served" },
    { value: "40+", label: "operators trained" },
  ],
  /** Confirmed service and commercial terms. */
  service: {
    /** Kolkata and nearby districts. */
    responseTimeLocal: "Next working day",
    /** Rest of India. */
    responseTime: "48 hours",
    /** Outside India — stated honestly, never as a fixed promise. */
    responseTimeInternational: "subject to visa and travel arrangements",
    remoteResponseTime: "4 working hours",
    warrantyMonths: 12,
    warrantyNote: "Customised extended warranty available on request.",
    leadTimeWeeks: "8–10",
    paymentTerms:
      "30% advance with confirmed order, 60% before shipment, 10% after installation",
    exportPaymentTerms: "70% advance with confirmed order, 30% before shipment",
    exportIncoterms: "FOB Kolkata or Delhi / CIF",
  },
  /** Reach — pan-India plus export markets. */
  reach: {
    india: "Pan-India delivery, installation, service and training from Kolkata",
    region: "25+ export markets",
    regionNote:
      "Export orders ship FOB Kolkata or Delhi, or CIF to your nearest port, with remote and on-site commissioning support.",
  },
  /** Leadership — confirmed by the owner. */
  leadership: [
    {
      name: "Naushad Ali",
      role: "Partner",
      bio: "More than 30 years of working experience, with vast experience in the automotive industry.",
    },
    {
      name: "Aninda Tarafder",
      role: "Senior Technical Engineer",
      bio: "Rich technical background with 15-plus years of experience at a leading engineering firm.",
    },
  ],
  /** Company milestones — confirmed by the owner. */
  milestones: [
    { year: "1989", title: "R.A. Auto Engineering Works established", text: "Started as a spares manufacturer of chassis parts for medium and heavy commercial vehicles." },
    { year: "1998", title: "Distributor network across India", text: "Built a network of more than 50 distributors covering the country." },
    { year: "2005", title: "Show parts production line", text: "Added a dedicated production line for commercial vehicle body show parts." },
    { year: "2008", title: "CNC machine assembly begins", text: "Moved into the assembly and supply of customised CNC machines." },
    { year: "2022", title: "Indian Railways supply", text: "Began supplying Indian Railways, and is a preferred vendor for certain safety-critical items." },
  ],
  social: {
    // PLACEHOLDER — leave empty string to hide a link
    linkedin: "",
    youtube: "",
    facebook: "",
    instagram: "",
  },
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
} as const;

export type Site = typeof site;
