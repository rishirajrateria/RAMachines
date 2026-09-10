/**
 * app/india/_lib/cityVisuals.ts — presentation-layer facts for
 * /india/[state]/[city] (ADR-0005 §6 anatomy), derived from the same
 * `City`/`State`/`Product` objects lib/copy/city.ts composes prose from: the
 * three tiny hero facts, the FactStrip, the industries DividedList +
 * recommended product tiles, the delivery Steps and the nearby-cities
 * DividedList. Kept out of lib/copy/city.ts so that file stays focused on
 * the composed prose. None of these repeat a fact shown elsewhere on the
 * page (ADR-0005: a fact appears once).
 */
import type { StepItem } from "@/components/ui/glass";
import type { IconName } from "@/components/ui/Icons";
import type { City, State, Product } from "@/data/types";
import { deliveryWindowLabel } from "@/lib/copy/city";
import { paths } from "@/lib/urls";

/** The three tiny inline facts shown under the hero sentence. */
export function cityHeroFacts(city: City, state: State): { label: string; value: string }[] {
  return [
    { label: "state", value: state.name },
    { label: "industries served", value: `${city.industries.length}` },
    { label: "typical delivery", value: deliveryWindowLabel(city.logisticsNote) },
  ];
}

/** The FactStrip: industries, industrial areas, delivery, service, training. */
export function cityFactStripFacts(city: City): { icon: IconName; label: string; value: string }[] {
  return [
    { icon: "Gear", label: "Industries", value: `${city.industries.length}` },
    { icon: "Building", label: "Industrial areas", value: `${city.industrialAreas.length}` },
    { icon: "Truck", label: "Delivery", value: deliveryWindowLabel(city.logisticsNote) },
    { icon: "Headset", label: "Service", value: "Remote + on-site" },
    { icon: "GraduationCap", label: "Training", value: "On-site at handover" },
  ];
}

/** The industries DividedList: local industry names, one per row. */
export function cityIndustryItems(city: City): { title: string }[] {
  return city.industries.map((name) => ({ title: name }));
}

/** Up to 3 recommended machines to show as tiles. */
export function cityProductTiles(city: City, products: Product[]): Product[] {
  return city.recommendedProductSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 3);
}

/** The 5-step "how delivery works" line (same structure as the state page). */
export function citySteps(cityName: string): StepItem[] {
  return [
    {
      title: "Site survey",
      text: `Access, floor loading and available power at your ${cityName} site confirmed before dispatch.`,
    },
    {
      title: "Transport",
      text: "Machine dispatched from our Kolkata works by road, rail or coastal freight as the size needs.",
    },
    {
      title: "Installation",
      text: "Foundation and 415 V three-phase supply verified, then the machine is levelled and commissioned.",
    },
    {
      title: "Test cut",
      text: "Calibration and test cuts run on your own material to confirm accuracy and finish.",
    },
    {
      title: "Handover & training",
      text: "Formal handover once cut or weld quality is confirmed, with operators trained on-site.",
    },
  ];
}

/** The nearby-cities DividedList, two columns. */
export function cityNearbyLinks(nearby: City[], stateSlug: string): { title: string; href: string }[] {
  return nearby.map((city) => ({ title: city.name, href: paths.city(stateSlug, city.slug) }));
}
