/**
 * app/export/copy.ts — long-form copy and FAQs for the /export hub page
 * (app/export/page.tsx). Country-specific copy lives in lib/copy/country.ts
 * instead; this file only covers the hub's general export-process content.
 *
 * ADR-0005 "Liquid Glass": the hub's FactStrip already shows markets, warranty,
 * lead time and Incoterms, and AboutBlurb already states ISO 9001:2015, CE
 * marking, MSME/Udyam, IEC registration and Indian Railways vendor status — so
 * `hubSections` no longer repeats a "certifications" paragraph, and its
 * quotation paragraph no longer restates FOB/CIF (that is the Incoterms fact,
 * shown once in FactStrip). What is left is prose that adds something neither
 * FactStrip nor AboutBlurb says: how quoting/production/freight/installation
 * actually work and what spares support looks like.
 *
 * `exportProcessSteps` is the 8-step export process condensed to 6 labels
 * (Steps, ADR-0005 §5) shared by the hub (label only) and every country page
 * (label + one short line).
 */
import type { FaqItem } from "@/data/types";

export const exportProcessSteps: { title: string; text: string }[] = [
  {
    title: "Quotation",
    text: "Share your material, thickness, bed size or welding requirement and we issue a formal quotation.",
  },
  {
    title: "Production",
    text: "Your machine is assembled, wired and run through factory acceptance checks at our Kolkata facility.",
  },
  {
    title: "Inspection & freight",
    text: "A live pre-shipment video inspection precedes export packing and sea freight from Kolkata or Haldia.",
  },
  {
    title: "Installation",
    text: "Remote, video-guided commissioning is followed by an on-site engineer visit for final alignment and checks.",
  },
  {
    title: "Training",
    text: "Operators are trained on safe operation, maintenance and the nesting or welding-program software.",
  },
  {
    title: "Warranty & support",
    text: "Core systems are covered from commissioning, backed by remote diagnostics and stocked wear spares.",
  },
];

export const hubIntro: string[] = [
  "RA Machine manufactures fiber laser cutting machines, tube laser cutting machines, CO2 laser machines and robotic MIG/MAG welding systems at our Kolkata facility, and exports the full range to fabricators, job shops and OEM manufacturers worldwide. Export is built into how every machine is engineered and shipped, from the CE marking on the control cabinet to the pre-shipment inspection video every buyer receives before their machine leaves our works.",
  "Every export order carries a full documentation set — CE declaration of conformity, ISO 9001:2015 certificate, commercial invoice, packing list, bill of lading and certificate of origin — so your customs broker has everything needed to clear the shipment. For country-specific detail on voltage, ports, sectors and shipping terms in your market, open the relevant country page below.",
];

export const hubSections: { h2: string; paragraphs: string[] }[] = [
  {
    h2: "Quotation and proforma invoice",
    paragraphs: [
      "We quote in US dollars once you share your cutting or welding specification. Once you confirm the specification, we raise a proforma invoice recording price, payment terms and the production schedule for sign-off before manufacturing begins.",
    ],
  },
  {
    h2: "Production and pre-shipment video inspection",
    paragraphs: [
      "Manufacturing takes place at our Kolkata facility, where each machine is assembled, wired and run through factory acceptance checks before a live pre-shipment video inspection with the buyer, so you see it cutting or welding and confirm build quality remotely, not just from a test certificate.",
    ],
  },
  {
    h2: "Export packing and freight routing",
    paragraphs: [
      "Export packing uses a sea-worthy crate sized to the machine, with the laser source, control cabinet and optics braced for transit. Machines ship by sea freight from Kolkata or Haldia as standard, with air freight kept for urgent spares; routing depends on your destination and is confirmed at vessel booking.",
    ],
  },
  {
    h2: "Installation and operator training",
    paragraphs: [
      "Installation begins with remote, video-guided commissioning as soon as the machine arrives, followed by an on-site engineer visit for final alignment, safety checks and full commissioning, scheduled around your production calendar. Operator training is included in every visit, covering safe operation, routine maintenance and the nesting or welding-program software your team will run day to day.",
    ],
  },
  {
    h2: "Spares and remote support",
    paragraphs: [
      "Common wear spares — nozzles, lenses, contact tips and drive rollers — are kept in stock for prompt air-freight dispatch, so a worn consumable does not become a multi-week production stoppage, and our engineering team is available for remote diagnostic support after commissioning.",
    ],
  },
];

export const exportHubFaqs: FaqItem[] = [
  {
    q: "Which countries does RA Machine export laser cutting and welding machines to?",
    a: "We export across North America, South America, Europe, the Middle East, South Asia, South-East Asia, Central Asia, Africa and Oceania, with dedicated country pages covering 30 markets where we see consistent import demand. If your country is not listed, send us an enquiry — we quote and ship to markets beyond this list on request.",
  },
  {
    q: "Are your machines CE marked and ISO certified?",
    a: "Yes. Every machine we export carries CE marking, and our manufacturing is certified to ISO 9001:2015. We supply a CE declaration of conformity and ISO certificate with every export order, alongside the commercial invoice, packing list, bill of lading and certificate of origin your customs broker will need.",
  },
  {
    q: "What is your standard Incoterm for export shipments?",
    a: "We quote FOB Kolkata as standard and can also quote CIF to your nearest major sea port on request. The choice between FOB and CIF depends on whether you prefer to arrange your own freight forwarder or have us handle freight and insurance to your port.",
  },
  {
    q: "How do you handle quality control before a machine ships?",
    a: "Every machine is run through factory acceptance checks against its rated specification, and before crating we carry out a live pre-shipment video inspection with you on camera, so you can see the machine cutting or welding and confirm build quality before it leaves our facility.",
  },
  {
    q: "How is installation handled for a machine shipped overseas?",
    a: "Installation begins with remote, video-guided commissioning as soon as the machine arrives, followed by an on-site engineer visit to complete alignment, safety checks and final commissioning at your facility, along with hands-on operator training for your team.",
  },
  {
    q: "What warranty and spares support do you provide internationally?",
    a: "Every export machine carries a warranty on its core systems, backed by remote diagnostic support after commissioning and a stock of common wear spares — nozzles, lenses, contact tips and drive rollers — for prompt air-freight dispatch to your country.",
  },
];
