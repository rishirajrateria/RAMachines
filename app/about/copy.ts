/**
 * app/about/copy.ts — long-form copy for /about. Edit the text below directly.
 * `leadership` and `timeline` contain invented placeholder facts (names, exact
 * milestone years) that must be replaced with real company records before
 * launch — see the PLACEHOLDER comments on each array.
 */

export const storyParagraphs: string[] = [
  "RA Group started as a small precision fabrication workshop in Kolkata and grew into a dedicated laser cutting and welding machine manufacturer once it was clear Indian fabricators needed a builder, not just importers rebadging someone else's machine.",
  "Keeping design, fabrication, assembly and after-sales support under one roof means the engineer who commissions your machine and the team who answers a service call both understand exactly how it was built — the same principle RA Auto, our sister business, applies to automotive components.",
];

export const manufacturingParagraphs: string[] = [
  "Structural components are cut, welded and stress-relieved in-house, so cutting accuracy is built into the frame from the first weld, not added afterward.",
  "Every cable run, gas line and safety interlock is checked against a documented build sheet before the machine moves to quality control.",
  "Export orders additionally include a pre-shipment video of the buyer's own machine running, not a generic promotional sample.",
];

export const certSummary =
  "RA Machine holds ISO 9001:2015 quality management certification, CE marking on applicable machines, GST and MSME/Udyam registration, an Import Export Code from the DGFT, Indian Railways vendor listing, and alignment with the Government of India's Make in India initiative.";

/**
 * PLACEHOLDER — leadership names and role scope below are illustrative and must
 * be replaced with the real management team's names, titles and bios before
 * launch. Names are realistic Indian names chosen only as placeholders.
 */
export const leadership: { role: string; name: string; bio: string }[] = [
  {
    role: "Managing Director",
    name: "Rajesh Bhattacharya", // PLACEHOLDER name
    bio: "Oversees RA Machine's overall strategy, manufacturing investment and export growth, with a background in industrial fabrication and machine-tool engineering.",
  },
  {
    role: "Head of Manufacturing",
    name: "Sudipta Chatterjee", // PLACEHOLDER name
    bio: "Responsible for the Kolkata works — structural fabrication, final assembly and the quality control process every machine passes before dispatch.",
  },
  {
    role: "Head of Exports & Business Development",
    name: "Ananya Sengupta", // PLACEHOLDER name
    bio: "Leads export quotation, shipping documentation and installation coordination for customers outside India, and the domestic sales engineering team.",
  },
];

export const reachIntroText =
  "From our Kolkata headquarters, RA Machine reaches fabrication shops across every Indian state and union territory and, through our export programme, workshops across five continents.";

export const exportRegions: string[] = [
  "North America",
  "South America",
  "Europe",
  "Middle East",
  "South Asia",
  "South-East Asia",
  "Central Asia",
  "Africa",
  "Oceania",
];

/**
 * PLACEHOLDER — milestone years and descriptions are illustrative, anchored to
 * config/site.ts's foundedYear, and must be replaced with the real company
 * history before launch.
 */
export const timeline: { year: number; text: string }[] = [
  { year: 2009, text: "RA Machine established in Kolkata as a dedicated laser cutting machine manufacturing operation within RA Group." }, // PLACEHOLDER
  { year: 2012, text: "First fiber laser cutting machines shipped outside West Bengal, beginning our pan-India service network." }, // PLACEHOLDER
  { year: 2015, text: "ISO 9001:2015 quality management certification achieved, formalising our documented build and inspection process." }, // PLACEHOLDER
  { year: 2018, text: "Robotic MIG/MAG welding systems added to the product range alongside the existing laser cutting line." }, // PLACEHOLDER
  { year: 2021, text: "Approved as an Indian Railways listed vendor following technical and quality assessment of our manufacturing." }, // PLACEHOLDER
  { year: 2024, text: "Kolkata manufacturing capacity expanded to support heavy-duty fiber laser and export order volumes." }, // PLACEHOLDER
];
