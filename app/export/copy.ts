/**
 * app/export/copy.ts — long-form copy and FAQs for the /export hub page
 * (app/export/page.tsx). Country-specific copy lives in lib/copy/country.ts
 * instead; this file only covers the hub's general export-process content.
 * To edit: change the paragraph arrays or FAQ items directly below.
 */
import type { FaqItem } from "@/data/types";

export const hubIntro: string[] = [
  "RA Machine manufactures fiber laser cutting machines, tube laser cutting machines, CO2 laser machines and robotic MIG/MAG welding systems at our facility in Kolkata, and we export the full range to fabricators, job shops and OEM manufacturers around the world. Export is not an occasional sideline to our domestic business — it is built into how every machine is engineered, documented and shipped, from the CE marking on the control cabinet to the pre-shipment inspection video every international buyer receives before their machine leaves our works.",
  "We are an IEC (Import Export Code) registered exporter, which is India's mandatory registration for any business shipping goods internationally, and every machine we export carries a full documentation set — CE declaration of conformity, ISO 9001:2015 certificate, commercial invoice, packing list, bill of lading and certificate of origin — so your customs broker has everything needed to classify and clear the shipment on arrival.",
  "This page sets out how our export process works end to end: quotation, Incoterms, packing and pre-shipment inspection, sea and air freight, remote and on-site installation, operator training, and the warranty and spares support that continues long after commissioning. For country-specific detail — import duty context, voltage and frequency, ports and airports, and manufacturing sectors we serve in that market — open the relevant country page below.",
];

export const hubSections: { h2: string; paragraphs: string[] }[] = [
  {
    h2: "IEC registration, CE marking and ISO documentation",
    paragraphs: [
      "Every RA Machine export order starts from the same documentation baseline: our IEC registration confirms we are authorised to export from India, our machines carry CE marking to meet the safety and conformity expectations of the European Union and countries that reference CE as a quality benchmark, and our ISO 9001:2015 certification covers the quality management system under which every machine is built and tested. Buyers can present this documentation set to their own customs authorities, insurers, auditors or end customers as proof of a properly certified supply chain.",
      "We also hold MSME/Udyam registration and are a listed Indian Railways vendor, both of which international buyers occasionally ask for as additional supplier due-diligence references, particularly where an overseas procurement team is running a formal vendor approval process before placing a first order.",
    ],
  },
  {
    h2: "Quotation, proforma invoice and Incoterms",
    paragraphs: [
      `We quote in US dollars once you share your required cutting or welding specification — material, thickness range, bed size or welding envelope — and every quotation sets out both FOB Kolkata pricing and CIF pricing to your nearest major port, so you can compare landed cost against alternative suppliers on a like-for-like basis. Once the specification is agreed, we issue a proforma invoice recording price, payment terms and the production schedule for your sign-off before manufacturing begins.`,
      "Standard payment terms are 30 percent advance with the purchase order and 70 percent against pre-shipment inspection video and shipping documents, settled by wire transfer in US dollars; buyers with an established relationship or a letter of credit requirement can discuss alternative structures with our export desk at quotation stage.",
    ],
  },
  {
    h2: "Production, packing and pre-shipment video inspection",
    paragraphs: [
      "Manufacturing takes place at our Kolkata facility, where each machine is assembled, wired and run through factory acceptance checks against its rated specification. Before any machine is crated, we carry out a live pre-shipment video inspection with the buyer, running the completed machine on camera so you can see it cutting or welding and confirm build quality remotely, rather than relying solely on a written test certificate.",
      "Export packing uses a sea-worthy wooden crate or case appropriate to the machine's size and weight, with the laser source, control cabinet and moving axes braced and protected against transit shock, humidity and handling at multiple ports. Sensitive optical components such as focusing lenses and mirrors are packed separately in their own protective cases within the main crate.",
    ],
  },
  {
    h2: "Sea and air freight to your port or airport",
    paragraphs: [
      "Machines ship by sea freight from Kolkata or Haldia as standard, with air freight reserved for urgent spares or smaller components rather than complete machines, given their size and weight. Transit time and routing — whether via Colombo, Singapore or the Suez Canal — depend on your destination port and are confirmed at the time of vessel booking; each country page on this site gives an indicative transit window and lists the ports and airports we ship to most often in that market.",
    ],
  },
  {
    h2: "Remote and on-site installation, with operator training",
    paragraphs: [
      "Installation begins as soon as the machine arrives, with remote, video-guided commissioning by our engineering team to get the machine powered up and running its first test cuts or welds safely. This is followed by an on-site engineer visit to complete final alignment, safety checks and full commissioning at your premises, scheduled around your production calendar rather than a fixed date set at the time of shipment.",
      "Operator training is included as part of every installation, covering safe operation, routine maintenance, and the nesting or welding-program software supplied with the machine, so your team is production-ready once our engineer completes the handover rather than learning the controls on their own after we leave.",
    ],
  },
  {
    h2: "Warranty and ongoing spares support",
    paragraphs: [
      "Every machine we export carries a 24-month warranty on its core systems — the laser source, drive and control system on a laser cutting machine, or the robot, positioner and power source on a robotic welding cell. After commissioning, our team continues to provide remote diagnostic support, and common wear spares such as nozzles, lenses, contact tips and drive rollers are kept in stock for prompt air-freight dispatch to your address, so a worn consumable does not become a multi-week production stoppage.",
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
    q: "What are your payment terms for export orders?",
    a: "Standard terms are 30 percent advance with the purchase order and 70 percent against pre-shipment inspection video and shipping documents, payable by wire transfer in US dollars. Buyers with a letter of credit requirement can discuss this with our export desk during quotation.",
  },
  {
    q: "How is installation handled for a machine shipped overseas?",
    a: "Installation begins with remote, video-guided commissioning as soon as the machine arrives, followed by an on-site engineer visit to complete alignment, safety checks and final commissioning at your facility, along with hands-on operator training for your team.",
  },
  {
    q: "What warranty and spares support do you provide internationally?",
    a: "Every export machine carries a 24-month warranty on its core systems, backed by remote diagnostic support after commissioning and a stock of common wear spares — nozzles, lenses, contact tips and drive rollers — for prompt air-freight dispatch to your country.",
  },
  {
    q: "How long does an export order typically take from quotation to shipment?",
    a: "Production lead time is typically 6 to 8 weeks from confirmed order and specification, depending on machine configuration and current factory schedule. We confirm an exact shipping date at order confirmation and again once the vessel booking is made.",
  },
];
