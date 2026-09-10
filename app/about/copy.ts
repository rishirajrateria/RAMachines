/**
 * app/about/copy.ts — long-form copy for /about. Edit the text below directly.
 * `leadership` and `timeline` contain invented placeholder facts (names, exact
 * milestone years) that must be replaced with real company records before
 * launch — see the PLACEHOLDER comments on each array.
 */

export const storyParagraphs: string[] = [
  "RA Machine is the laser cutting and robotic welding equipment business of RA Group, a Kolkata-founded manufacturing group built on the belief that Indian factories deserve machine tools engineered to the same standard as anything imported from Europe or East Asia, backed by a support team that actually answers the phone. What began as a small precision fabrication workshop grew, over successive years, into a dedicated machine-building operation once demand from fabricators for reliable, locally serviced laser cutting equipment made it clear that India needed a manufacturer, not just importers rebadging someone else's machine.",
  "Today RA Machine designs, fabricates and assembles fiber laser cutting machines, tube laser cutting machines, CO2 laser machines and robotic MIG/MAG welding systems entirely at our own works in Kolkata, and supplies fabrication shops, OEM manufacturers and export buyers across India and more than 25 countries. Keeping design, fabrication, assembly and after-sales support under one roof is a deliberate choice: it means the engineer who commissions your machine and the team who answers a service call both understand exactly how it was built.",
  "RA Auto is our sister business within RA Group, serving India's automotive component and aftermarket sector under the same engineering discipline and quality culture that shapes RA Machine. The two businesses operate independently in their respective markets but share common ownership, a common commitment to manufacturing in India, and a common standard for how a customer should be treated after the sale is made.",
];

export const missionText =
  "Our mission is straightforward: build laser cutting and robotic welding machines in India that fabricators can depend on for years of production, and stand behind every machine with a service and spares network that does not disappear once the invoice is settled. We measure success less by units shipped and more by how many of our early customers are still running the same machine, and still calling the same service desk, a decade later.";

export const manufacturingParagraphs: string[] = [
  "Every RA Machine unit is designed, fabricated and assembled at our manufacturing works in Kolkata. Structural components — machine beds, gantries and cutting chambers — are cut, welded and stress-relieved in-house before precision machining, so the rigidity that determines long-term cutting accuracy is built into the frame from the first weld, not added afterward.",
  "Final assembly brings together the laser source or welding robot, motion system, controller, gas or shielding-gas console and chiller onto the completed frame, with every cable run, gas line and safety interlock checked against a documented build sheet before the machine moves to quality control. Our QC process covers electrical safety testing, axis calibration, repeatability measurement and a full functional run before any unit is approved for dispatch.",
  "Before a machine leaves our works, it performs a live test cut or test weld on sample material representative of typical customer use, and the result is checked against our tolerance specification and, where relevant, photographed for the customer's own reference. Export orders additionally go through a pre-shipment video inspection so the buyer sees their specific machine running before it is crated and shipped, not a generic promotional sample.",
];

export const certSummary =
  "RA Machine holds ISO 9001:2015 quality management certification, CE marking on applicable machines, GST and MSME/Udyam registration, an Import Export Code from the DGFT, Indian Railways vendor listing, and alignment with the Government of India's Make in India initiative. Full detail on what each certification covers, and how to verify it, is available on our certifications page.";

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
  "From our Kolkata headquarters, RA Machine reaches fabrication shops across every Indian state and union territory and, through our export programme, workshops across five continents. The map below is a simplified guide to where we are headquartered; the region chips list the broad export markets our machines currently reach — see our export hub for the full country list.";

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
