/**
 * app/_home/copy.ts — copy for the home page (app/page.tsx). ADR-0005 "Liquid
 * Glass": the page is 7 calm sections, so copy here is trimmed to exactly what
 * each section needs — one hero sentence, one glance paragraph, three "why"
 * points (not six) and the CTA line. Longer buyer-education copy lives on the
 * category/product pages, not here.
 */
import type { IconName } from "@/components/ui/Icons";

export const heroSentence =
  "Fiber, tube and CO2 laser cutting machines and robotic welding systems, engineered at our own Kolkata works and installed, trained and serviced across India and 25+ export markets.";

export const glanceContext =
  "For more than a decade, fabrication shops and export buyers have chosen RA Machine for laser cutting and welding equipment engineered, built, tested and supported entirely at our own works.";

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
