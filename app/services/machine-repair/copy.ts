/**
 * app/services/machine-repair/copy.ts — long-form copy and structured content for
 * /services/machine-repair, kept out of page.tsx so the route file stays under the
 * 400-line limit. To edit: change the paragraphs/arrays below directly; each export
 * is plain data consumed by page.tsx.
 */
import type { IconName } from "@/components/ui/Icons";

export const introParagraphs: string[] = [
  "RA Machine's repair and maintenance service covers fiber laser, CO2 laser, plasma, tube laser and robotic welding equipment of any make, not only our own. Every engagement starts with a clear diagnosis and a written estimate before work begins.",
];

export const onSiteParagraph: string =
  "We dispatch a service engineer from Kolkata carrying the tools, test equipment and commonly needed spares for the machine type reported, and provide a written service report after every visit. The same engineers who install new RA Machine equipment also carry out repairs, so they already know the platforms they service.";

export const remoteDiagnosticsParagraph: string =
  "Faults involving the controller, servo drives, nesting software or electrical wiring can often be diagnosed over a phone or video call, sometimes resolving the issue on that first call or telling you exactly which part to have ready before an engineer is dispatched.";

export const sparesParagraph: string =
  "Fast-moving parts — protective lenses, ceramic nozzles and rings, drive belts, ball bearings, ballscrews, filters and chiller components — are stocked for quick dispatch anywhere in India, and shipped by air courier for export machines. AMC customers get priority allocation during a breakdown.";

export const amcIntro: string =
  "An Annual Maintenance Contract moves maintenance from a reactive expense to a planned one. We offer three tiers, scoped to your machine model, usage hours and site location.";

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
    body: "A gradual drop in cutting power or inconsistent piercing usually points to source wear or a cooling fault upstream. We check output power and cooling parameters, then recalibrate or replace the affected module.",
  },
  {
    title: "Chiller",
    body: "Temperature instability shows up as inconsistent cut quality or thermal shutdown, often from low coolant, a blocked filter or a failing pump. We service the circuit and check chiller capacity still matches the duty cycle.",
  },
  {
    title: "Cutting head",
    body: "Height-sensing errors or collision alarms are usually traced to a contaminated sensor, damaged window or worn cabling. We clean, recalibrate or replace the component and re-verify accuracy across the full sheet.",
  },
  {
    title: "Nozzle and lens",
    body: "Poor edge quality or dross build-up often comes down to a worn nozzle or a contaminated, cracked lens degrading beam quality. We replace consumables to specification and confirm cut quality on test material.",
  },
  {
    title: "Servo and drive",
    body: "Positioning drift, axis alarms or unusual motor noise typically originate in a servo drive, encoder or coupling fault. We isolate the axis, test signals, repair the component and re-run accuracy checks under load.",
  },
  {
    title: "Controller",
    body: "Software freezes or an unresponsive HMI usually point to a controller fault, corrupted parameters or a firmware issue rather than a mechanical problem. We restore known-good firmware or replace hardware when needed.",
  },
  {
    title: "Gas system",
    body: "Inconsistent gas pressure or contaminated assist gas causes dross, discolouration or incomplete piercing, usually from a regulator fault or line leak. We pressure-test the circuit and confirm delivered purity at the head.",
  },
  {
    title: "Bed and rail alignment",
    body: "Years of heavy production can cause bed sag or rail misalignment that drifts parts out of tolerance without triggering alarms. We survey level and parallelism, re-align as needed, and re-verify accuracy across the bed.",
  },
];

export function responseTimeParagraph(responseTime: string, remoteResponseTime: string): string {
  return `Remote diagnostic contact within ${remoteResponseTime}, and an on-site engineer within ${responseTime} for metro and major industrial locations; AMC and Premium-tier customers get priority scheduling ahead of this.`;
}

export const bookIntro: string =
  "Tell us the machine brand and model, your city and a description of the fault, and our service desk will confirm the next step, usually within one working day.";

export const stateLinksIntro: string =
  "Engineers dispatch from Kolkata and remote diagnostics are available nationwide. Find repair information for your state below.";

/* --------------------------- ADR-0002 visual additions --------------------------- */
// Purely presentational metadata — icons, short chip/step labels — layered on top of
// the copy above (page.tsx). No paragraph text is added, removed or reworded here.

export const heroLead: string =
  "One call reaches remote diagnostics, spares dispatch and an engineer from our Kolkata service desk, whatever brand of laser or welding machine is on your shop floor.";

export const heroChips: { label: string; icon: IconName }[] = [
  { label: "All brands", icon: "Badge" },
  { label: "Pan-India", icon: "MapPin" },
  { label: "Remote diagnostics", icon: "Headset" },
  { label: "Spares & AMC", icon: "Package" },
];

export interface RepairProcessStep {
  title: string;
  text: string;
  icon: IconName;
}

export const repairProcessSteps: RepairProcessStep[] = [
  { title: "Call or WhatsApp", text: "Report the machine, fault and city to our Kolkata service desk.", icon: "Phone" },
  { title: "Remote diagnosis", text: "Our team reviews logs and error codes over phone or video first.", icon: "Headset" },
  { title: "Engineer dispatch", text: "If needed, an engineer travels with tools, spares and test gear.", icon: "Truck" },
  { title: "Repair", text: "Fault is corrected on site, with parts replaced to specification.", icon: "Wrench" },
  { title: "Test", text: "Machine is run on test material to confirm the fix holds under load.", icon: "Gauge" },
  { title: "Report", text: "A written service report covers findings, work done and next steps.", icon: "Certificate" },
];

export const faultIcons: Record<string, IconName> = {
  "Laser source": "Bolt",
  Chiller: "Gauge",
  "Cutting head": "Sheet",
  "Nozzle and lens": "Layers",
  "Servo and drive": "Gear",
  Controller: "Layers",
  "Gas system": "Wrench",
  "Bed and rail alignment": "Ruler",
};

export const amcTierIcons: { key: "basic" | "standard" | "premium"; name: string; icon: IconName; recommended?: boolean }[] = [
  { key: "basic", name: "Basic", icon: "Shield" },
  { key: "standard", name: "Standard", icon: "Award", recommended: true },
  { key: "premium", name: "Premium", icon: "Sparkles" },
];
