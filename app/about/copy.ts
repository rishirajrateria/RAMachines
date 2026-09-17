/**
 * app/about/copy.ts — long-form copy for /about.
 *
 * All facts here are the owner's own (RA_MACHINES.docx, Sept 2026): the company
 * history, the milestone years and the two named team members. `leadership` and
 * `timeline` are derived from config/site.ts so the same facts cannot drift apart
 * between the About page and the rest of the site — edit them in config/site.ts.
 */
import { site } from "@/config/site";

export const storyParagraphs: string[] = [
  "R.A. Auto Engineering Works was established in Kolkata in 1989 as a spares manufacturer for medium and heavy commercial vehicles, starting with chassis parts supplied to workshops and fleet operators across eastern India.",
  "As the range and the customer base grew, the works added commercial vehicle body show parts and, later, specialist items for Indian Railways — work that demanded documented processes and repeatable quality on safety-critical components.",
  "RA Machine is the most recent step in that progression: the assembly and supply of customised CNC machines — laser cutting, plasma cutting and welding systems — built on the same shop floor discipline that the components business was built on.",
];

export const manufacturingParagraphs: string[] = [
  "Machines are specified around the job in front of them rather than sold from a fixed catalogue: bed size, source power, automation and fixturing are configured for the parts you actually cut or weld.",
  "Assembly, wiring, gas lines and safety interlocks are checked against a documented build sheet, and every machine is test cut and calibrated before it leaves the works.",
  "The same engineers who assemble and commission a machine handle its service calls, so a fault is diagnosed by people who know how that specific machine was built.",
];

export const certSummary =
  "RA Machine holds ISO 9001:2015 quality management certification, CE marking on applicable machines, GST and MSME/Udyam registration, an Import Export Code from the DGFT, Indian Railways vendor listing, and alignment with the Government of India's Make in India initiative.";

/** The real management team — maintained in config/site.ts. */
export const leadership: { role: string; name: string; bio: string }[] = site.leadership.map(
  (person) => ({ role: person.role, name: person.name, bio: person.bio }),
);

export const reachIntroText =
  "From our Kolkata works, RA Machine supplies, installs and services machines across every Indian state and union territory, and supports export customers with remote commissioning and on-site visits.";

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

/** The real company milestones — maintained in config/site.ts. */
export const timeline: { year: number; text: string }[] = site.milestones.map((milestone) => ({
  year: Number(milestone.year),
  text: `${milestone.title}. ${milestone.text}`,
}));
