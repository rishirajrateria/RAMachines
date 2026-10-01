/**
 * app/services/machine-repair/copy.ts — long-form copy and structured content for
 * /services/machine-repair, kept out of page.tsx so the route file stays under the
 * 400-line limit. To edit: change the paragraphs/arrays below directly; each export
 * is plain data consumed by page.tsx.
 */
import { site } from "@/config/site";
import type { IconName } from "@/components/ui/Icons";

export const introParagraphs: string[] = [
  "RA Machine's repair and maintenance service is for the machines we build: our CNC laser and plasma cutting machines, MIG, TIG, MMA and submerged arc welding machines, and cobot and robotic welding systems. Every engagement starts with a clear diagnosis and a written estimate before work begins.",
];

export const onSiteParagraph: string =
  "We dispatch a service engineer from Kolkata carrying the tools, test equipment and commonly needed spares for the machine type reported, and provide a written service report after every visit. The same engineers who build and install RA Machine equipment also carry out repairs, so they already know every machine they service.";

export const remoteDiagnosticsParagraph: string =
  "Faults involving the controller, servo drives, nesting software or electrical wiring can often be diagnosed over a phone or video call, sometimes resolving the issue on that first call or telling you exactly which part to have ready before an engineer is dispatched.";

export const sparesParagraph: string =
  "Fast-moving parts for our machines — protective lenses, nozzles and ceramic rings, plasma and welding torch consumables, drive belts, bearings, ballscrews, filters and chiller components — are stocked for quick dispatch anywhere in India, and shipped by air courier for export machines.";

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
    title: "Plasma torch",
    body: "Bevelled or rough cuts, arc-start failures and short consumable life usually trace back to worn electrodes and nozzles, a gas pressure fault or torch-height drift. We replace consumables, check gas delivery and re-tune torch height control.",
  },
  {
    title: "Welding power source and wire feed",
    body: "Erratic arcs, porosity or wire stubbing on MIG, TIG and SAW machines often come from a slipping wire feeder, a worn liner or contact tip, or a power-source fault. We test output, service the feed path and confirm weld quality on a test joint.",
  },
  {
    title: "Bed and rail alignment",
    body: "Years of heavy production can cause bed sag or rail misalignment that drifts parts out of tolerance without triggering alarms. We survey level and parallelism, re-align as needed, and re-verify accuracy across the bed.",
  },
];

export function responseTimeParagraph(responseTime: string, remoteResponseTime: string): string {
  return `Remote diagnostic contact within ${remoteResponseTime}. On site, we aim for the ${site.service.responseTimeLocal.toLowerCase()} in Kolkata and the surrounding districts and within ${responseTime} elsewhere in India; visits outside India are ${site.service.responseTimeInternational}.`;
}

export const bookIntro: string =
  "Tell us the machine type and serial number, your city and a description of the fault, and our service desk will confirm the next step, usually within one working day.";

export const stateLinksIntro: string =
  "Engineers dispatch from Kolkata and remote diagnostics are available nationwide. Find repair information for your state below.";

/* --------------------------- ADR-0002 visual additions --------------------------- */
// Purely presentational metadata — icons, short chip/step labels — layered on top of
// the copy above (page.tsx). No paragraph text is added, removed or reworded here.

export const heroLead: string =
  "One call reaches remote diagnostics, spares dispatch and an engineer from our Kolkata service desk, for every RA Machine cutting and welding machine.";

export const heroChips: { label: string; icon: IconName }[] = [
  { label: "RA Machine equipment", icon: "Badge" },
  { label: "Pan-India", icon: "MapPin" },
  { label: "Remote diagnostics", icon: "Headset" },
  { label: "Spares", icon: "Package" },
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
  "Plasma torch": "Bolt",
  "Welding power source and wire feed": "Weld",
};
