/**
 * app/services/machine-repair/copy.ts — long-form copy and structured content for
 * /services/machine-repair, kept out of page.tsx so the route file stays under the
 * 400-line limit. To edit: change the paragraphs/arrays below directly; each export
 * is plain data consumed by page.tsx.
 */

export const introParagraphs: string[] = [
  "Production downtime on a laser cutting or robotic welding line is expensive, and every hour a machine sits idle is an hour of committed orders slipping behind schedule. RA Machine's repair and maintenance service exists to get that machine back into production as quickly as possible, whether it carries our badge or another manufacturer's nameplate. Our engineers are trained across the laser source, motion, controller and welding-cell technologies that are common to the industry, so a breakdown call gets a competent first response regardless of where the machine was originally purchased.",
  "We support fiber laser cutting machines, CO2 laser cutting and engraving machines, plasma cutting systems, tube laser cutting machines and robotic MIG/MAG welding cells, covering the full range of equipment a modern metal fabrication shop is likely to run. Every engagement starts with a clear diagnosis and a written estimate before work begins, so you know what a repair will involve before committing to it, and every repair visit or AMC contract is backed by our Kolkata service desk for follow-up and escalation.",
];

export const onSiteParagraph: string =
  "When a fault cannot be resolved remotely, we dispatch a service engineer from our Kolkata headquarters to your facility anywhere in India, carrying the tools, test equipment and commonly needed spares for the machine type reported. We coordinate the visit around your production schedule wherever possible, confirm the likely scope of work before the engineer travels, and provide a written service report after every visit covering the fault found, the work carried out and any recommendation for further parts or follow-up. On-site visits cover single-incident repairs as well as the scheduled preventive maintenance included in our AMC plans, and the same engineers who install new RA Machine equipment also carry out repair and maintenance work, so they arrive already familiar with the platforms they are servicing.";

export const remoteDiagnosticsParagraph: string =
  "A large share of faults, particularly those involving the controller, servo drives, nesting software or electrical wiring, can be diagnosed over a phone or video call without waiting for an engineer to travel. Our service desk talks you through checks you can safely perform yourself, reviews error codes and machine logs remotely, and in many cases resolves the issue during that first call, or advises exactly which spare part and tool to have on hand before an engineer is dispatched. Starting with remote diagnostics keeps minor issues from turning into a full-day site visit, and it is usually the fastest way to get a straightforward fault resolved.";

export const sparesParagraph: string =
  "Consumables and wear parts that fail most often — protective lenses, ceramic nozzles and rings, drive belts, ball bearings, ballscrews, filters and chiller components — are stocked for fast dispatch to any location in India, and for machines exported internationally we ship spares by air courier with the documentation needed to clear customs quickly. For parts specific to older machines or other manufacturers' platforms, our service team sources them through our supplier network and keeps you updated on lead time rather than leaving a machine idle without an answer. AMC customers get priority allocation from stock during a breakdown.";

export const amcIntro: string =
  "An Annual Maintenance Contract moves maintenance from a reactive expense to a planned one, catching wear before it causes a breakdown and giving you a predictable service relationship instead of calling only when something has already stopped. We offer three tiers — Basic, Standard and Premium — scoped to your machine model, usage hours and site location; contact our service team for a written proposal specific to your equipment. The comparison below outlines what each tier typically includes; exact terms are confirmed in your AMC agreement.";

export interface AmcRow {
  feature: string;
  basic: string;
  standard: string;
  premium: string;
}

export const amcRows: AmcRow[] = [
  { feature: "Preventive maintenance visits", basic: "1 per year", standard: "2 per year", premium: "4 per year" },
  { feature: "Breakdown response priority", basic: "Standard queue", standard: "Priority scheduling", premium: "Fastest available slot" },
  { feature: "Remote diagnostic support", basic: "Business hours", standard: "Extended hours", premium: "Extended hours, first point of contact" },
  { feature: "Consumables & wear-part coverage", basic: "Not included", standard: "Partial coverage", premium: "Extensive coverage" },
  { feature: "Labour on breakdown visits", basic: "Chargeable", standard: "Discounted rate", premium: "Included" },
  { feature: "Calibration & alignment check", basic: "On request, chargeable", standard: "Included with each visit", premium: "Included with each visit" },
  { feature: "Software & firmware updates", basic: "Not included", standard: "Included when available", premium: "Included when available" },
  { feature: "Written service reports", basic: "Yes", standard: "Yes", premium: "Yes, with usage trend notes" },
];

export interface FaultBlock {
  title: string;
  body: string;
}

export const commonFaults: FaultBlock[] = [
  {
    title: "Laser source",
    body: "A gradual drop in cutting power, inconsistent piercing or a source that fails to reach full output usually points to laser source wear, a fibre or resonator issue, or a cooling and power-supply fault upstream of the source itself. We check output power at the head, review fault logs and cooling parameters, and either recalibrate the source or arrange replacement of the affected module, depending on what the diagnosis shows.",
  },
  {
    title: "Chiller",
    body: "Temperature instability in the chiller shows up as inconsistent cut quality, thermal shutdown alarms or premature laser source wear, and is often caused by low coolant level, a blocked filter, a failing pump or a fouled heat exchanger. We service the chiller circuit, flush and replace coolant where needed, and check that chiller capacity still matches the laser source's duty cycle as machines age or run longer shifts.",
  },
  {
    title: "Cutting head",
    body: "Height-sensing errors, inconsistent standoff distance or collision alarms on the cutting head are usually traced to a contaminated capacitive sensor, a damaged protective window, worn cabling or a head that has taken a minor impact during operation. We clean, recalibrate or replace the affected component and re-verify height-sensing accuracy across the full sheet before handing the machine back for production.",
  },
  {
    title: "Nozzle and lens",
    body: "Poor edge quality, dross build-up or inconsistent piercing often comes down to a worn or misaligned nozzle, or a contaminated or cracked protective lens, both of which degrade beam quality even when every other setting is correct. We replace consumables to the correct specification, check nozzle-to-lens alignment, and confirm cut quality on test material before closing out the visit.",
  },
  {
    title: "Servo and drive",
    body: "Motion faults such as positioning drift, unexpected axis alarms or unusual motor noise typically originate in a servo drive, encoder feedback or a mechanical coupling issue on the X, Y or Z axis. We isolate the affected axis, test drive and encoder signals, and repair or replace the faulty component, then re-run positioning accuracy checks to confirm the fix holds under load.",
  },
  {
    title: "Controller",
    body: "Software freezes, communication errors between the controller and drives, or an unresponsive HMI usually point to a controller hardware fault, a corrupted parameter set or a firmware issue rather than a mechanical problem. We diagnose controller faults with vendor-level diagnostic tools where available, restore known-good parameters or firmware, and replace controller hardware when the fault is not software-recoverable.",
  },
  {
    title: "Gas system",
    body: "Inconsistent gas pressure or contaminated assist gas produces visible cut-quality problems — excess dross, discolouration or incomplete piercing — and is usually caused by a regulator fault, a leak in the gas line, or a supply that no longer meets the purity the process requires. We pressure-test the gas circuit, repair leaks and regulator faults, and confirm delivered pressure and purity at the cutting head.",
  },
  {
    title: "Bed and rail alignment",
    body: "Machines that have run for years under heavy production can develop bed sag or rail misalignment that shows up as parts drifting out of tolerance across a large sheet, even though the machine still runs without alarms. We survey bed level and rail parallelism, re-align and re-tension as needed, and re-verify positioning accuracy across the full working area before returning the machine to production.",
  },
];

export function responseTimeParagraph(responseTime: string, remoteResponseTime: string): string {
  return `Our standard commitment is remote diagnostic contact within ${remoteResponseTime} of your call, and an on-site engineer dispatched within ${responseTime} for metro and major industrial locations; exact timing for other locations is confirmed by our service desk when you report the fault. AMC customers, and Premium-tier customers in particular, receive priority scheduling ahead of this standard commitment.`;
}

export const bookIntro: string =
  "Use the form below to book a repair visit or a remote diagnostic call. Tell us the machine brand and model, your city and a description of the fault, and our service desk will confirm the next step, usually within one working day.";

export const stateLinksIntro: string =
  "We provide laser cutting machine repair and CNC maintenance service across every state and union territory in India, with engineers dispatched from our Kolkata headquarters and remote diagnostics available nationwide. Find repair information for your state below.";
