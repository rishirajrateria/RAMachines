/**
 * app/_home/copy.ts — copy for the home page (app/page.tsx). ADR-0002 visual refresh:
 * paragraphs are trimmed to 1–2 sentences each so the page reads visual-first, with
 * icons attached directly to list data (whyPoints, servicesStrip) for FeatureGrid /
 * IconCard to render. Kept as a sibling file so the page component stays short.
 */
import type { IconName } from "@/components/ui/Icons";

export const heroSub =
  "Fiber, tube and CO2 laser cutting machines and robotic welding systems, engineered at our own Kolkata works and installed, trained and serviced across India and 25+ export markets.";

export const introParagraph =
  "For more than a decade, fabrication shops and export buyers have chosen RA Machine for laser cutting and welding equipment engineered, built, tested and supported entirely at our own Kolkata works.";

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
    icon: "Ship",
    title: "Export and installation support",
    text: "We export to more than 25 countries with pre-shipment inspection and structured remote or on-site commissioning.",
  },
  {
    icon: "Package",
    title: "Spares availability",
    text: "Commonly replaced parts are stocked for fast dispatch, keeping unplanned downtime to a minimum wherever you are installed.",
  },
  {
    icon: "GraduationCap",
    title: "Operator training included",
    text: "Every purchase includes structured training on safe operation, nesting software and routine maintenance.",
  },
  {
    icon: "Award",
    title: "Indian Railways listed vendor",
    text: "Our manufacturing quality is examined and approved for supply to Indian Railways, one of India's most demanding buyers.",
  },
];

export const servicesStrip: {
  icon: IconName;
  name: string;
  text: string;
  href: string;
  external?: boolean;
}[] = [
  {
    icon: "Wrench",
    name: "Machine Repair",
    text: "On-site and remote repair, AMC plans and spares support for laser cutting and welding equipment of any make.",
    href: "/services/machine-repair",
  },
  {
    icon: "GraduationCap",
    name: "Operator Training",
    text: "Structured training on safe machine operation, nesting software and day-to-day maintenance, at your site or ours.",
    href: "/services/operator-training",
  },
  {
    icon: "Layers",
    name: "Job Work",
    text: "Send us your drawing and material specification and we will produce precision parts on our own machines.",
    href: "/services/laser-cutting-job-work",
  },
  {
    icon: "Bolt",
    name: "RA Auto",
    text: "The automotive division of RA Group, serving India's automotive component and aftermarket sector.",
    href: "https://raauto.net",
    external: true,
  },
];

export const certIntro =
  "Every RA Machine unit is built under a documented, audited quality system and shipped with the licences global procurement teams check before approving a new supplier.";

export const reachIntro =
  "RA Machine is installed in fabrication shops across every major Indian industrial belt and, through our export programme, in workshops on five continents.";

export const ctaText =
  "Tell us about your material, thickness and production volume and our sales engineers will recommend the right machine and send a formal quotation.";
