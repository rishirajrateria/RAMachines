/**
 * app/_home/copy.ts — copy for the home page (app/page.tsx). ADR-0008 §3: the
 * "Machines" section is the editorial centrepiece (a deep bento grid led by the
 * CNC laser family), so this file adds the heading/pitch copy that section
 * needs alongside the original hero/glance/why/cta copy from ADR-0005 §6.
 *
 * Client review (Oct 2026): five technologies, no model numbers, "built in
 * India" rather than Kolkata, and no claims of an export track record.
 */
import type { IconName } from "@/components/ui/Icons";

export const heroSentence =
  "CNC laser and plasma cutting machines, MIG, TIG, MMA and submerged arc welding machines, and cobot and robotic welding systems — built in India, installed and supported wherever you are.";

export const glanceContext =
  "Fabrication shops come to RA Machine for cutting and welding equipment that is engineered, built, tested and supported entirely at our own works in India.";

export const machinesEyebrow = "Product range";
export const machinesHeadingLines = ["Multiple technologies, one workshop —", "engineered, built and tested in India"];
export const machinesIntro =
  "Five technologies, each configured to the job: CNC laser and plasma cutting, MIG/TIG/MMA and submerged arc welding, and cobot and robotic welding — designed, fabricated and calibrated at our own works, then supported by the same team through installation, training and service.";

export const flagshipPitch =
  "Fiber laser cutting from 1.5 kW to 30 kW — and the laser can also be fitted for welding.";

/** The closing bento tile: what "customisable" and "as per requirement" mean for a buyer. */
export const customBuild = {
  title: "Built to your requirement",
  text: "Welding machines are customisable for 220 V or 440 V supply, and cobot and robot welding cells are configured around your parts. Tell us the job and we will specify the machine.",
};

export const whyPoints: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "Factory",
    title: "Manufactured in India",
    text: "Every machine is designed, fabricated and assembled at our own works in India, giving us direct control over build quality.",
  },
  {
    icon: "Truck",
    title: "Pan-India service reach",
    text: "Our engineers travel from Kolkata to install, commission and service machines anywhere in India, backed by remote diagnostics.",
  },
  {
    icon: "GraduationCap",
    title: "Training and spares included",
    text: "Every purchase includes structured operator training, with commonly replaced parts stocked for fast dispatch.",
  },
];

export const ctaText =
  "Tell us about your material, thickness and production volume and our sales engineers will recommend the right machine and send a formal quotation.";
