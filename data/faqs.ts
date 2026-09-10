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
    q: "How do I get a price for an RA Machine laser cutting or welding machine?",
    a: "We do not publish prices online because the right configuration depends on your material, thickness, sheet or tube size, and production volume. Use the Request a Quote button on any product page, call, or WhatsApp us with your requirement, and our sales engineers will respond with a formal, itemised quotation matched to your application and budget.",
  },
  {
    q: "Which machine should I choose for my business?",
    a: "It depends on the materials you cut or weld, typical thickness, sheet or tube size, and your daily production volume. Light fabrication and job shops usually start with the RA-F1530 or RA-F3015 Pro, heavier plate work suits the RA-F6020 HD or RA-F12K, and tube, sign-making or robotic welding needs point to the RA-T6000, RA-C1390 or RA-RW range. Contact us and we will recommend the right fit.",
  },
  {
    q: "Do you deliver and install machines across India?",
    a: "Yes. We deliver and install machines across every state and union territory, with engineers dispatched from our Kolkata headquarters for site preparation guidance, commissioning, calibration and operator handover. We also coordinate with your local electrician and crane vendor beforehand so installation day runs smoothly, and we schedule a follow-up visit or remote check-in shortly after commissioning.",
  },
  {
    q: "Can you export machines and support installation outside India?",
    a: "Yes, we export worldwide and currently serve customers across 25-plus countries. Each export order includes a pre-shipment video inspection, complete shipping and customs documentation, and installation support after the machine arrives, either through a dispatched engineer or structured remote commissioning depending on the destination and machine. Post-installation training and spares support continue for the life of the machine.",
  },
  {
    q: "What warranty and spares support do you provide?",
    a: "RA Machine products carry a standard warranty covering major components against manufacturing defects, with remote diagnostic support available within hours of a reported fault. Commonly replaced items such as nozzles, lenses, filters and drive belts are stocked so routine spares can be dispatched quickly, and our service team supports both in-warranty repairs and out-of-warranty maintenance for the life of the machine.",
  },
  {
    q: "Do you provide operator training with a new machine?",
    a: "Yes. Every machine purchase includes operator training covering safe operation, day-to-day maintenance and nesting or programming software, delivered either at your facility during installation or at our Kolkata training centre. We also run standalone operator and CNC training programmes for teams that need to upskill new staff or refresh existing operators; see our training page for details.",
  },
  {
    q: "Can you repair a laser cutting or welding machine we bought from another manufacturer?",
    a: "Yes, our repair and maintenance service covers fiber laser, CO2 laser, plasma, tube laser and robotic welding equipment from any manufacturer, not only RA Machine units. Our engineers diagnose faults in the laser source, chiller, cutting head, servo drives, controller and gas system, and can support you with an Annual Maintenance Contract as well as one-off repair visits across India.",
  },
  {
    q: "What is the typical lead time, and is financing available?",
    a: "Standard lead time from confirmed order to dispatch is typically six to eight weeks, depending on the model and current production schedule; we confirm an exact date at the quotation stage. We do not offer financing directly, but we are glad to prepare the documentation your bank, NBFC or leasing partner needs to process an equipment loan alongside your quotation.",
  },
];

/** /services/machine-repair — 10 questions, heavily SEO-optimised service page. */
export const repairFaqs: FaqItem[] = [
  {
    q: "Which machine brands and types do you repair?",
    a: "We repair fiber laser cutting machines, CO2 laser cutting and engraving machines, plasma cutters, tube laser cutting machines and robotic MIG/MAG welding cells, regardless of manufacturer. Our engineers are trained across the common laser source, controller and drive technologies used industry-wide, so you do not need to have purchased your machine from RA Machine to use our repair service.",
  },
  {
    q: "Do you service machines that are out of warranty or from other manufacturers?",
    a: "Yes. A large share of our repair work is on machines purchased elsewhere or now outside their original warranty period. We diagnose the fault, quote the repair transparently before starting work, and can also propose an ongoing Annual Maintenance Contract so future breakdowns are caught early rather than causing extended production downtime.",
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
    q: "What Annual Maintenance Contract (AMC) plans do you offer?",
    a: "We offer Basic, Standard and Premium AMC plans covering scheduled preventive maintenance visits, priority breakdown response, and progressively wider coverage of consumables and labour as you move up the tiers. Each plan is scoped to your machine model, usage hours and site location; contact our service team for a written AMC proposal.",
  },
  {
    q: "What are the most common faults you fix on fiber laser machines?",
    a: "The faults we see most often involve the laser source losing output power, chiller temperature instability, cutting head height-sensing errors, nozzle and lens contamination, servo or drive motor faults, controller and software glitches, gas pressure or purity issues, and bed or rail alignment drifting out of tolerance after heavy use.",
  },
  {
    q: "Do you keep spares in stock for chillers, cutting heads and lenses?",
    a: "Yes, commonly replaced consumables and wear parts such as protective lenses, ceramic nozzles, ceramic rings, ball bearings, ballscrews, filters and chiller components are stocked for fast dispatch. For less common parts specific to older or third-party machines, we source and courier them as quickly as our supplier network allows.",
  },
  {
    q: "Do you also repair robotic welding cells and CO2 laser machines?",
    a: "Yes. Beyond fiber laser cutting machines, our engineers service robotic MIG/MAG welding cells (including the robot controller, wire feed system and positioner), CO2 laser tubes and optics, and tube laser cutting machines. If your equipment does not fit neatly into one category, describe the fault in the booking form and we will confirm coverage.",
  },
  {
    q: "How do I book a repair visit?",
    a: "Use the Book a Repair form on this page with your company name, phone number, machine brand and model, city and a description of the problem, or call or WhatsApp our service desk directly. We will confirm whether the issue can be resolved remotely or needs an on-site visit, and schedule the earliest available engineer.",
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
    q: "Which countries do you currently export to?",
    a: "We currently export to more than 25 countries across North America, Europe, the Middle East, South-East Asia, South Asia, Africa and Oceania, including proven high-volume importing markets and fast-growing manufacturing economies where Indian machinery is an increasingly natural alternative to Chinese suppliers. See our country pages for details specific to your market.",
  },
  {
    q: "What are your standard export shipping terms?",
    a: "Standard terms are FOB Kolkata, with CIF quotations to your nearest major port available on request. We handle export documentation, crating and pre-shipment video inspection before the machine leaves our facility, and can work with your preferred freight forwarder or recommend one we have shipped with previously for your region.",
  },
  {
    q: "Is installation support available after the machine reaches my country?",
    a: "Yes. Depending on the machine and destination, we provide either a dispatched commissioning engineer or structured remote installation support with detailed video guidance, alongside operator training delivered over video call or in person. Spares and remote diagnostic support continue for the life of the machine after commissioning.",
  },
  {
    q: "Will the machine work with our local voltage and frequency?",
    a: "Our machines are configured to run on 415 V three-phase, 50 Hz supply as standard, and we confirm your local voltage, frequency and phase configuration at the quotation stage so the machine and its transformer, if needed, are built to match your site's electrical supply before shipment.",
  },
  {
    q: "What warranty applies to machines shipped outside India?",
    a: "Export orders carry the same standard warranty period as domestic machines, covering major components against manufacturing defects from the date of commissioning. Remote diagnostic support and spares dispatch continue to apply internationally, and we agree the practical logistics of any on-site warranty visit with you at the time of order.",
  },
  {
    q: "What are your payment terms for export orders?",
    a: "Our standard export payment structure is a percentage advance with the order, with the balance due against pre-shipment inspection, invoiced in US dollars unless otherwise agreed. Exact terms and any adjustment for order size or repeat-customer history are confirmed in writing in your formal quotation and proforma invoice.",
  },
];

/** /about — 4 questions. */
export const aboutFaqs: FaqItem[] = [
  {
    q: "When was RA Machine established and where are your machines made?",
    a: "RA Machine has been manufacturing laser cutting and robotic welding equipment for over a decade, with every machine designed, fabricated and assembled at our facility in Kolkata, West Bengal. Manufacturing domestically keeps our engineering, service and spares teams close to the machines we build, rather than depending on an overseas supply chain for support.",
  },
  {
    q: "How is RA Machine related to RA Auto?",
    a: "RA Machine and RA Auto are sister businesses under RA Group. RA Machine manufactures and supplies laser cutting machines and robotic welding systems, while RA Auto is the Group's automotive division. The two operate independently in their respective markets but share the same ownership, engineering culture and commitment to Indian manufacturing.",
  },
  {
    q: "What certifications does RA Machine hold?",
    a: "We hold ISO 9001:2015 quality management certification, CE marking on applicable machines, GST registration, MSME/Udyam registration, an Import Export Code from the DGFT, Indian Railways vendor listing, and alignment with the Make in India initiative, with Startup India and BIS conformity applicable to specific machines and components. See our certifications page for full details.",
  },
  {
    q: "Do you manufacture machines in-house or resell imported units?",
    a: "We design, fabricate and assemble our machines in-house at our Kolkata facility rather than reselling imported units under our own name. This gives us direct control over build quality, component sourcing and after-sales support, and means our engineers understand every machine they service because they were built by the same team.",
  },
];

/** /certifications — 4 questions. */
export const certificationFaqs: FaqItem[] = [
  {
    q: "Can I verify the original certificates before placing an order?",
    a: "Yes. We are glad to share verifiable copies of our certificates, including certificate numbers and issuing body details, during the quotation process so your procurement or compliance team can independently confirm them before you place an order or open a tender file.",
  },
  {
    q: "Which certifications are most relevant for export orders?",
    a: "CE marking and ISO 9001:2015 are typically the most relevant for export customers, since they address machine safety compliance and documented manufacturing quality respectively. Our Import Export Code confirms we are a legally licensed exporter. Specific markets or tenders may also ask about BIS conformity for individual components.",
  },
  {
    q: "Are all RA Machine products covered under the same certifications?",
    a: "Our quality management certification (ISO 9001:2015) and business registrations apply across the entire product range. CE marking and BIS conformity are assessed and applied at the machine or component level, so we confirm exact applicability for the specific model you are enquiring about at the quotation stage.",
  },
  {
    q: "How often are these certifications renewed or audited?",
    a: "ISO 9001:2015 and CE conformity are subject to periodic surveillance audits and renewal cycles set by the respective certifying bodies, and our government registrations are maintained in line with statutory renewal requirements. We keep all certificates current and can confirm the latest validity dates on request.",
  },
];
