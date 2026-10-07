/**
 * data/faqs.ts — ready-made FAQ sets for the home page and the service / hub
 * pages that do not have their own per-entity FAQ data (products, categories,
 * states, cities and countries carry their own `faqs` field instead).
 *
 * Every answer is 40–90 words, matching the FaqItem contract in data/types.ts.
 * To edit: change the text below — each array feeds the <Faq /> component and
 * its FAQPage JSON-LD directly, so keep answers factual and quote-free.
 * To add a question, push a new { q, a } object to the relevant array.
 */
import type { FaqItem } from "./types";

/** Home page — 8 questions covering the buyer journey from price to financing. */
export const homeFaqs: FaqItem[] = [
  {
    q: "How do I get a price for an RA Machine cutting or welding machine?",
    a: "We do not publish prices online because every machine is configured to the job: your material, thickness, part or sheet size, and production volume. Use the Request a Quote button on any page, call, or WhatsApp us with your requirement, and our sales engineers will respond with a formal, itemised quotation matched to your application and budget.",
  },
  {
    q: "Which machine should I choose for my business?",
    a: "It depends on what you cut or weld, how thick it is and how much you produce. Precision sheet work suits a CNC fiber laser (1.5–30 kW); heavier mild-steel plate from 2 mm to 25 mm is often cut more economically by CNC plasma. For joining, MIG, TIG and MMA machines cover everyday fabrication, SAW handles long seams on thick plate, and cobot or robot cells suit repeat production. Tell us the job and we will recommend the right fit.",
  },
  {
    q: "Do you deliver and install machines across India?",
    a: "Yes. We deliver and install machines across every state and union territory, with engineers dispatched from our Kolkata headquarters for site preparation guidance, commissioning, calibration and operator handover. We also coordinate with your local electrician and crane vendor beforehand so installation day runs smoothly, and we schedule a follow-up visit or remote check-in shortly after commissioning.",
  },
  {
    q: "Can you export machines and support installation outside India?",
    a: "Yes. We can ship machines worldwide and support buyers abroad. Each export order includes a pre-shipment video inspection, complete shipping and customs documentation, and installation support after the machine arrives, either through an engineer travelling from India or structured remote commissioning, depending on the destination and machine. Training and spares support continue for the life of the machine.",
  },
  {
    q: "What warranty and spares support do you provide?",
    a: "RA Machine products carry a standard 12-month warranty covering major components against manufacturing defects, with customised extended warranty available on request, with remote diagnostic support available within hours of a reported fault. Commonly replaced items such as nozzles, lenses, filters and drive belts are stocked so routine spares can be dispatched quickly, and our service team supports both in-warranty repairs and out-of-warranty maintenance for the life of the machine.",
  },
  {
    q: "Do you provide operator training with a new machine?",
    a: "Yes. Every machine purchase includes operator training covering safe operation, day-to-day maintenance and nesting or programming software, delivered either at your facility during installation or at our Kolkata training centre. We also run standalone operator and CNC training programmes for teams that need to upskill new staff or refresh existing operators; see our training page for details.",
  },
  {
    q: "Do you repair machines from other manufacturers?",
    a: "No. Our repair and maintenance service is for the machines we build, because those are the machines whose parts, settings and workmanship we can stand behind. For RA Machine equipment, our engineers diagnose and fix faults across the laser or plasma source, welding power source, chiller, drives, controller and gas system, with remote diagnostics first and on-site visits across India.",
  },
  {
    q: "What is the typical lead time, and is financing available?",
    a: "Standard lead time from confirmed order to dispatch is typically eight to ten weeks, depending on the configuration and current production schedule; we confirm an exact date at the quotation stage. We do not offer financing directly, but we are glad to prepare the documentation your bank, NBFC or leasing partner needs to process an equipment loan alongside your quotation.",
  },
  {
    q: "What are your payment terms for a machine bought in India?",
    a: "For domestic orders the standard structure is 30 per cent advance with the confirmed order, 60 per cent before shipment and the remaining 10 per cent after installation at your site. Export orders follow a separate structure of 70 per cent advance and 30 per cent before shipment. GST and any transport or installation costs are shown separately on the quotation so you can see exactly what is included.",
  },
];

/** /services/machine-repair — 10 questions, heavily SEO-optimised service page. */
export const repairFaqs: FaqItem[] = [
  {
    q: "Which machines do you repair?",
    a: "We repair and maintain the machines we build: RA Machine CNC fiber laser and plasma cutting machines, MIG, TIG and MMA welding machines, submerged arc welding machines, and cobot and robotic welding systems. We do not service other manufacturers' machines. Because our engineers build and install the same equipment they repair, they know every part of it.",
  },
  {
    q: "Do you service RA Machine equipment that is out of warranty?",
    a: "Yes for RA Machine equipment: we service our machines throughout their working life, in or out of warranty. Out-of-warranty work is diagnosed first and quoted transparently before we start. We do not take on repairs of machines made by other manufacturers, as we cannot stand behind parts and settings we did not design.",
  },
  {
    q: "What is your on-site response time for a breakdown?",
    a: "Our standard commitment is an on-site engineer dispatch within 48 hours for metro and major industrial cities, with remote diagnostic support typically available within a few working hours of your call. Exact response time depends on your location and the nature of the fault; our service desk confirms a firm timeline as soon as you report the issue.",
  },
  {
    q: "Do you offer remote diagnostics before sending an engineer?",
    a: "Yes. For controller, software, servo-drive and many electrical faults, our engineers can often diagnose the problem over a call or video session and either resolve it remotely or advise exactly which spare part and tool to have ready, which shortens the eventual on-site visit and gets your machine back into production faster.",
  },
  {
    q: "Do you offer annual maintenance contracts (AMC)?",
    a: "We do not offer annual maintenance contracts at present. Maintenance is booked when you need it, and operator training covers the routine daily and weekly checks that keep a machine running well.",
  },
  {
    q: "What are the most common faults you fix?",
    a: "On laser machines: loss of source power, chiller temperature instability, cutting-head height-sensing errors and worn nozzles or contaminated lenses. On plasma machines: worn torch consumables and gas or arc-start problems. On welding machines: wire-feed and torch faults. Across all of them: servo or drive faults, controller and software glitches, and alignment drift after heavy use.",
  },
  {
    q: "Do you keep spares in stock?",
    a: "Yes. Commonly replaced consumables and wear parts for our machines, such as protective lenses, nozzles and ceramic rings, plasma torch consumables, welding torch parts, bearings, filters and chiller components, are stocked for fast dispatch anywhere in India and by air courier abroad. Less common parts are sourced and dispatched as quickly as our suppliers allow.",
  },
  {
    q: "Do you also repair RA Machine cobot and robotic welding cells?",
    a: "Yes, for RA Machine systems. Our engineers service the robot or cobot, its controller, the welding power source, wire feed system and fixtures, and can re-teach or adjust weld programs when your parts change. Describe the fault in the booking form, or call our service desk, and we will confirm the next step.",
  },
  {
    q: "How do I book a repair visit?",
    a: "Use the Book a Repair form on this page with your company name, phone number, the machine type and its serial number, your city and a description of the problem, or call or WhatsApp our service desk directly. We will confirm whether the issue can be resolved remotely or needs an on-site visit, and schedule the earliest available engineer.",
  },
  {
    q: "Is there a warranty on the repair work you carry out?",
    a: "Yes, repair work and any parts we fit carry a workmanship warranty, with the exact period depending on the nature of the repair and whether original or compatible spares were used; this is confirmed in writing on your repair invoice. If the same fault recurs within that period, we return to resolve it at no additional labour charge.",
  },
];

/** /services/operator-training — 8 questions. */
export const trainingFaqs: FaqItem[] = [
  {
    q: "Who should attend RA Machine's operator training?",
    a: "The programme is designed for machine operators, shop-floor supervisors and maintenance staff who will run or oversee a laser cutting, tube cutting or robotic welding machine day to day. It suits both brand-new operators learning the equipment for the first time and experienced staff who need structured training on nesting software, safety procedures or a newly purchased machine.",
  },
  {
    q: "Where is the training conducted?",
    a: "Training can be delivered at your facility, alongside machine installation and commissioning, or at our training centre in Kolkata if you prefer to send staff to us. On-site training lets your team learn on the exact machine and material they will use daily; our Kolkata centre suits smaller groups or teams who want a dedicated, distraction-free session.",
  },
  {
    q: "What does the training curriculum cover?",
    a: "The curriculum covers safe machine operation and lockout procedures, day-to-day and preventive maintenance tasks operators can handle themselves, nesting and cutting-path software, material handling and loading, gas and power settings for different thicknesses, and troubleshooting common alarms. We tailor the exact emphasis to the machine type and your team's existing experience level.",
  },
  {
    q: "How long does a training programme typically run?",
    a: "Most programmes run over two to four working days depending on the machine, the number of trainees and how much prior experience your team already has. New-machine training bundled with installation is usually shorter and more focused, while a standalone refresher or software-focused session can be scheduled to whatever duration suits your production calendar.",
  },
  {
    q: "How many operators can be trained per batch?",
    a: "We recommend batches of four to six trainees per session so each person gets meaningful hands-on machine time rather than only observing. Larger teams can be split across consecutive batches or multiple sessions, which we schedule around your production requirements so the training does not disrupt an entire shift at once.",
  },
  {
    q: "Do trainees receive a certificate of completion?",
    a: "Yes, each trainee who completes the programme receives a certificate of completion noting the machine type and modules covered, which many companies keep on file for internal skills records or client and tender documentation requiring proof of trained operating staff.",
  },
  {
    q: "Is refresher training available after the initial programme?",
    a: "Yes. Many customers book a refresher session some months after the initial training, particularly after staff turnover, a software update, or when moving an experienced operator onto a different machine model. Refresher sessions are shorter than initial training and can be scheduled at your site or our Kolkata centre.",
  },
  {
    q: "How do I book staff training?",
    a: "Fill in the Book Staff Training form on this page with your company details, number of trainees, preferred location and a target month, or call or WhatsApp us directly. Our team will confirm available dates, the recommended duration for your group, and whether on-site or Kolkata-centre training suits your schedule better.",
  },
];

/** /services/laser-cutting-job-work — 5 questions. Page is noindex; the phrase
 * "job work" is permitted here only because SPEC §6 requires it on this page. */
export const jobWorkFaqs: FaqItem[] = [
  {
    q: "What materials and thicknesses can you cut for job work orders?",
    a: "We cut carbon steel, stainless steel, aluminium, brass, copper and galvanised sheet across the thickness ranges our fiber laser machines support, from thin gauge sheet up to heavy plate depending on the material. Send us your drawing with material and thickness noted and we will confirm feasibility along with the quotation.",
  },
  {
    q: "What file formats do you accept for cutting drawings?",
    a: "We accept DXF and DWG files as the preferred formats for nesting and cutting, along with PDF or scanned sketches for simpler parts where we can redraw the geometry ourselves. Clear dimensions, material specification and quantity in your file or covering email help us quote and schedule the job faster.",
  },
  {
    q: "What is the typical turnaround time for job work orders?",
    a: "Turnaround depends on part complexity, material thickness and current order load, but most straightforward job work orders are completed within a few working days of drawing approval and material confirmation. Larger or more complex batches are scheduled with a confirmed delivery date given at the time of quotation.",
  },
  {
    q: "Is there a minimum order quantity for job work?",
    a: "There is no fixed minimum order quantity; we take on both single-part prototype cutting and larger production batches. Very small orders may carry a modest handling charge to cover machine setup time, which we disclose upfront in the quotation so there are no surprises on the final invoice.",
  },
  {
    q: "How do I send drawings and get a quotation?",
    a: "Use the quote form on this page to upload or describe your drawing, material, thickness and quantity, or email or WhatsApp us directly with the file attached. We will confirm feasibility, price and turnaround in writing before any cutting begins, so you can approve the job with full clarity.",
  },
];

/** /export — 6 questions for the export hub page. */
export const exportHubFaqs: FaqItem[] = [
  {
    q: "Which countries can you export to?",
    a: "We can ship to most countries and support buyers across North and South America, Europe, the Middle East, Africa, Asia and Oceania. Our country pages cover each market's power supply, ports, shipping route and import requirements. If your country is not listed, contact us; we will confirm documentation, shipping and installation support for your location before you order.",
  },
  {
    q: "What are your standard export shipping terms?",
    a: "Standard terms are FOB Kolkata or Delhi, with CIF quotations to your nearest major port available on request. We handle export documentation, crating and pre-shipment video inspection before the machine leaves our facility, and can work with your preferred freight forwarder or recommend one for your region.",
  },
  {
    q: "Is installation support available after the machine reaches my country?",
    a: "Yes. Depending on the machine and destination, we provide either a dispatched commissioning engineer or structured remote installation support with detailed video guidance, alongside operator training delivered over video call or in person. Spares and remote diagnostic support continue for the life of the machine after commissioning.",
  },
  {
    q: "Will the machine work with our local voltage and frequency?",
    a: "We confirm your local voltage, frequency and phase configuration at the quotation stage, and the machine is built to match your site's electrical supply before shipment, with a transformer where needed. Our welding machines are built for 220 V or 440 V and can be customised for other supplies.",
  },
  {
    q: "What warranty applies to machines shipped outside India?",
    a: "Export orders carry the same standard warranty period as domestic machines, covering major components against manufacturing defects from the date of commissioning. Remote diagnostic support and spares dispatch continue to apply internationally, and we agree the practical logistics of any on-site warranty visit with you at the time of order.",
  },
  {
    q: "What are your payment terms for export orders?",
    a: "Our standard export payment structure is 70 per cent advance with the confirmed order and 30 per cent before shipment, invoiced in US dollars unless otherwise agreed. Exact terms and any adjustment for order size or repeat-customer history are confirmed in writing in your formal quotation and proforma invoice.",
  },
];

/** /about — 4 questions. */
export const aboutFaqs: FaqItem[] = [
  {
    q: "When was RA Machine established and where are your machines made?",
    a: "R.A. Auto Engineering Works was established in 1989 and began building CNC machines in 2008. Every RA Machine cutting and welding machine is designed, fabricated and assembled at our works in Kolkata, West Bengal. Building in India keeps our engineering, service and spares teams close to the machines we build, rather than depending on an overseas supply chain for support.",
  },
  {
    q: "How is RA Machine related to RA Auto?",
    a: "RA Machine and RA Auto are sister businesses under RA Group. RA Machine builds CNC laser and plasma cutting machines, welding machines and robotic welding systems, while RA Auto is the Group's automotive division. The two operate independently in their respective markets but share the same ownership, engineering culture and commitment to Indian manufacturing.",
  },
  {
    q: "What certifications and registrations does RA Machine hold?",
    a: "R.A. Auto Engineering Works, the company behind RA Machine, is GST registered, holds an Import Export Code (IEC) from the DGFT, and has supplied Indian Railways since 2022 as a preferred vendor for certain safety-critical items. For export orders, we confirm the conformity marking and documentation your market requires at the quotation stage, before production begins. See our certifications page for details.",
  },
  {
    q: "Do you manufacture machines in-house or resell imported units?",
    a: "We design, fabricate and assemble our machines in-house at our Kolkata facility rather than reselling imported units under our own name. This gives us direct control over build quality, component sourcing and after-sales support, and means our engineers understand every machine they service because they were built by the same team.",
  },
];

/** /certifications — 4 questions. */
export const certificationFaqs: FaqItem[] = [
  {
    q: "Can I verify your registrations before placing an order?",
    a: "Yes. We are glad to share copies of our registrations, with their numbers and issuing authority, during the quotation process so your procurement or compliance team can confirm them independently before you place an order or open a tender file.",
  },
  {
    q: "Which certifications are most relevant for export orders?",
    a: "Our Import Export Code confirms we are a licensed exporter able to file shipping bills and export paperwork correctly. Beyond that, requirements depend on the destination: the EU expects CE marking, the UK UKCA, and some markets their own conformity schemes. We confirm what your market requires, and what we can supply for it, at the quotation stage, before production begins.",
  },
  {
    q: "Do your registrations cover every machine you build?",
    a: "Our GST and IEC registrations and our Indian Railways vendor status belong to the company, so they apply to everything we supply. Product-level conformity marks depend on the machine and the destination market, so we confirm exactly what applies to the machine you are enquiring about at the quotation stage.",
  },
  {
    q: "Are your registrations kept up to date?",
    a: "Our statutory registrations are kept current in line with their renewal requirements, and we can confirm the latest status and validity on request, alongside copies of the documents, before you place an order.",
  },
];
