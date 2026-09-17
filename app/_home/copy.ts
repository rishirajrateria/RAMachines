/**
 * app/_home/copy.ts — copy for the home page (app/page.tsx). ADR-0008 §3: the
 * "Machines" section is now the editorial centrepiece (a deep bento grid led by
 * one flagship machine), so this file adds the heading/pitch copy that section
 * needs alongside the original hero/glance/why/cta copy from ADR-0005 §6.
 */
import type { IconName } from "@/components/ui/Icons";

export const heroSentence =
  "Fiber, tube and CO2 laser cutting machines and robotic welding systems, built in Kolkata and serviced across India and 25+ export markets.";

export const glanceContext =
  "For more than a decade, fabrication shops and export buyers have chosen RA Machine for laser cutting and welding equipment engineered, built, tested and supported entirely at our own works.";

export const machinesEyebrow = "Product range";
export const machinesHeadingLines = ["Eight machines, one workshop —", "engineered, built and tested in Kolkata"];
export const machinesIntro =
  "Every model on this page is designed, fabricated and calibrated at our own works, then supported by the same team through installation, training and service.";

export const flagshipPitch =
  "A stiffer gantry and a higher-rated source, built for steady higher-volume production.";

export const whyPoints: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "Factory",
    title: "Manufactured in India",
    text: "Every machine is designed, fabricated and assembled at our own Kolkata works, giving us direct control over build quality.",
  },
  {
    icon: "Truck",
    title: "Pan-India service reach",
    text: "Engineers dispatched from Kolkata install, commission and service machines in every state, backed by remote diagnostics.",
  },
  {
    icon: "GraduationCap",
    title: "Training and spares included",
    text: "Every purchase includes structured operator training, with commonly replaced parts stocked for fast dispatch.",
  },
];

export const ctaText =
  "Tell us about your material, thickness and production volume and our sales engineers will recommend the right machine and send a formal quotation.";
