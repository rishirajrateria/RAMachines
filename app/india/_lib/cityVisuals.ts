/**
 * app/india/_lib/cityVisuals.ts — presentation-layer facts for /india/[state]/[city],
 * derived from the same `City`/`State` objects lib/copy/city.ts composes prose from
 * (hero chips, GlancePanel facts, the delivery ProcessSteps). Kept out of
 * lib/copy/city.ts so that file stays focused on the composed prose sections.
 */
import type { IconName } from "@/components/ui/Icons";
import type { City, State } from "@/data/types";
import { deliveryWindowLabel } from "@/lib/copy/city";

/** Icon chips for the hero band: state · industries · typical delivery. */
export function cityHeroChips(city: City, state: State): { icon: IconName; label: string }[] {
  return [
    { icon: "MapPin", label: state.name },
    { icon: "Gear", label: city.industries.slice(0, 2).join(" · ") || "Multiple industries" },
    { icon: "Truck", label: deliveryWindowLabel(city.logisticsNote) },
  ];
}

/** The "at a glance" fact panel near the top of the page. */
export function cityGlanceFacts(city: City): { icon: IconName; label: string; value: string }[] {
  return [
    { icon: "Gear", label: "Local industries", value: `${city.industries.length}` },
    { icon: "Building", label: "Industrial areas", value: `${city.industrialAreas.length}` },
    { icon: "Layers", label: "Recommended machines", value: `${city.recommendedProductSlugs.length}` },
    { icon: "Truck", label: "Delivery from Kolkata", value: deliveryWindowLabel(city.logisticsNote) },
    { icon: "Headset", label: "Service", value: "Remote + on-site" },
    { icon: "GraduationCap", label: "Training", value: "On-site at handover" },
  ];
}

/** The 4-step "how delivery works" ProcessSteps graphic (shorter than the state-page
 * version — city pages target 700–900 words, not 900–1,200). */
export function cityProcessSteps(cityName: string): { icon: IconName; title: string; text: string }[] {
  return [
    {
      icon: "Ruler",
      title: "Site survey",
      text: `Access, floor loading and available power at your ${cityName} site confirmed before dispatch.`,
    },
    {
      icon: "Truck",
      title: "Transport",
      text: "Machine dispatched from our Kolkata works by road, rail or coastal freight as the size needs.",
    },
    {
      icon: "Wrench",
      title: "Installation & test cut",
      text: "Foundation and power verified, the machine levelled, then calibrated with test cuts on your material.",
    },
    {
      icon: "GraduationCap",
      title: "Handover & training",
      text: "Formal handover with on-site operator training included, plus refreshers available later.",
    },
  ];
}
