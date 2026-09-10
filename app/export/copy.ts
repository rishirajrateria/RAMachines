/**
 * app/export/copy.ts — long-form copy and FAQs for the /export hub page
 * (app/export/page.tsx). Country-specific copy lives in lib/copy/country.ts
 * instead; this file only covers the hub's general export-process content.
 * To edit: change the paragraph arrays or FAQ items directly below.
 * ADR-0002: `icon` on each hubSection and `exportProcessSteps` below feed the
 * visual-first layout (IconCard/ProcessSteps) that app/export/page.tsx renders
 * ahead of this same prose, which is kept verbatim further down the page.
 * ADR-0003: hubIntro + hubSections is trimmed to ~500 words of copy that is not
 * already shown by GlancePanel (warranty, lead time, payment terms, Incoterms)
 * or ProcessSteps (the 8-step flow) — each section states its one non-obvious
 * fact rather than re-narrating the whole process. exportHubFaqs keeps the 6
 * FAQs that add something GlancePanel/ProcessSteps do not (dropped the two —
 * payment terms, lead time — that only restated a GlancePanel value).
 */
import type { FaqItem } from "@/data/types";
import type { IconName } from "@/components/ui/Icons";
import { exportProcessStepMeta } from "./visuals";

/** Short step text for the hub's ProcessSteps graphic — titles/icons come from the
 * shared exportProcessStepMeta (also used on country pages) so both stay in step. */
const exportProcessHubText: string[] = [
  "Share your material, thickness, bed size or welding requirement — we quote in US dollars with FOB Kolkata and CIF options.",
  "Once the specification is confirmed, we issue a proforma invoice recording price, payment terms and the production schedule.",
  "Your machine is assembled, wired and run through factory acceptance checks at our Kolkata facility.",
  "We run a live video inspection with you before crating, so you see the machine cutting or welding first-hand.",
  "The machine is export-packed and moved by sea freight from Kolkata or Haldia, with air freight kept for urgent spares.",
  "Remote, video-guided commissioning on arrival is followed by an on-site engineer visit for final alignment and safety checks.",
  "Operators are trained on safe operation, maintenance and the nesting or welding-program software during the installation visit.",
  "A 24-month warranty on core systems is backed by remote diagnostics and stocked wear spares for prompt dispatch.",
];

export const exportProcessSteps: { title: string; text: string; icon: IconName }[] =
  exportProcessStepMeta.map((step, i) => ({ ...step, text: exportProcessHubText[i] }));

export const hubIntro: string[] = [
  "RA Machine manufactures fiber laser cutting machines, tube laser cutting machines, CO2 laser machines and robotic MIG/MAG welding systems at our Kolkata facility, and exports the full range to fabricators, job shops and OEM manufacturers worldwide. Export is built into how every machine is engineered and shipped — from the CE marking on the control cabinet to the pre-shipment inspection video every buyer receives before their machine leaves our works.",
  "We are IEC-registered, and every export order carries a full documentation set — CE declaration of conformity, ISO 9001:2015 certificate, commercial invoice, packing list, bill of lading and certificate of origin — so your customs broker has everything needed to clear the shipment. For country-specific detail on duty, voltage, ports and the sectors we serve in your market, open the relevant country page below.",
];

export const hubSections: { h2: string; icon: IconName; paragraphs: string[] }[] = [
  {
    h2: "IEC registration, CE marking and ISO documentation",
    icon: "Certificate",
    paragraphs: [
      "Our IEC registration authorises us to export from India, CE marking meets the safety and conformity expectations buyers in the EU and beyond look for, and ISO 9001:2015 covers the quality management system every machine is built and tested under. We also hold MSME/Udyam registration and are a listed Indian Railways vendor, both useful as supplier due-diligence references during a formal vendor approval process.",
    ],
  },
  {
    h2: "Quotation, proforma invoice and Incoterms",
    icon: "Currency",
    paragraphs: [
      "We quote in US dollars once you share your cutting or welding specification, with both FOB Kolkata and CIF pricing to your nearest major port so you can compare landed cost against other suppliers directly. Once you confirm the specification, we raise a proforma invoice recording price, payment terms and the production schedule for sign-off before manufacturing begins.",
    ],
  },
  {
    h2: "Production, packing and pre-shipment video inspection",
    icon: "Factory",
    paragraphs: [
      "Manufacturing takes place at our Kolkata facility, where each machine is assembled, wired and run through factory acceptance checks before a live pre-shipment video inspection with the buyer — so you see it cutting or welding and confirm build quality remotely, not just from a test certificate. Export packing uses a sea-worthy crate sized to the machine, with the laser source, control cabinet and optics braced and protected for transit.",
    ],
  },
  {
    h2: "Sea and air freight to your port or airport",
    icon: "Ship",
    paragraphs: [
      "Machines ship by sea freight from Kolkata or Haldia as standard, with air freight kept for urgent spares rather than complete machines. Routing — via Colombo, Singapore or the Suez Canal — depends on your destination and is confirmed at vessel booking; each country page lists an indicative transit window and the ports and airports we ship to most in that market.",
    ],
  },
  {
    h2: "Remote and on-site installation, with operator training",
    icon: "Wrench",
    paragraphs: [
      "Installation begins with remote, video-guided commissioning as soon as the machine arrives, followed by an on-site engineer visit for final alignment, safety checks and full commissioning at your premises, scheduled around your production calendar. Operator training is included in every installation visit, covering safe operation, routine maintenance and the nesting or welding-program software your team will run day to day.",
    ],
  },
  {
    h2: "Warranty and ongoing spares support",
    icon: "Shield",
    paragraphs: [
      "Every export machine is backed by remote diagnostic support after commissioning, and common wear spares — nozzles, lenses, contact tips and drive rollers — are kept in stock for prompt air-freight dispatch, so a worn consumable does not become a multi-week production stoppage. Warranty and response-time specifics for your market are shown in the panel above.",
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
    a: "Every export machine carries a 24-month warranty on its core systems, backed by remote diagnostic support after commissioning and a stock of common wear spares — nozzles, lenses, contact tips and drive rollers — for prompt air-freight dispatch to your country.",
  },
];
