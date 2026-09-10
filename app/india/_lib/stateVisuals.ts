/**
 * app/india/_lib/stateVisuals.ts — presentation-layer facts for /india/[state],
 * derived from the same `State`/`Product` objects lib/copy/state.ts composes prose
 * from (hero chips, GlancePanel facts, the industries FeatureGrid and the delivery
 * ProcessSteps). Kept out of lib/copy/state.ts so that file stays focused on the
 * composed prose sections and under the 400-line limit.
 */
import type { IconName } from "@/components/ui/Icons";
import type { State, City, Product } from "@/data/types";
import { statePorts, deliveryWindowLabel } from "@/lib/copy/state";
import { paths } from "@/lib/urls";

/** Icon chips for the hero band: cities served · key clusters · typical delivery. */
export function stateHeroChips(state: State, cities: City[]): { icon: IconName; label: string }[] {
  const clusters = Array.from(new Set(state.industries.flatMap((i) => i.clusters))).slice(0, 3);
  return [
    { icon: "MapPin", label: `${cities.length} ${cities.length === 1 ? "city" : "cities"} served` },
    { icon: "Factory", label: clusters.length ? `Key clusters: ${clusters.join(", ")}` : "Statewide coverage" },
    { icon: "Truck", label: deliveryWindowLabel(state.logisticsNote) },
  ];
}

/** The "at a glance" fact panel near the top of the page. */
export function stateGlanceFacts(
  state: State,
  cities: City[],
): { icon: IconName; label: string; value: string }[] {
  const ports = statePorts[state.slug];
  return [
    { icon: "Gear", label: "Key industries", value: `${state.industries.length}` },
    { icon: "Building", label: "Industrial areas", value: `${state.industrialAreas.length}` },
    { icon: "Truck", label: "Delivery from Kolkata", value: deliveryWindowLabel(state.logisticsNote) },
    { icon: "Headset", label: "Service coverage", value: "Remote + on-site" },
    { icon: "GraduationCap", label: "Training", value: "On-site + Kolkata centre" },
    ports
      ? { icon: "Ship", label: "Nearest port(s)", value: ports.slice(0, 2).join(", ") }
      : { icon: "MapPin", label: "City pages", value: `${cities.length} in ${state.name}` },
  ];
}

/** Product lookup, local copy of lib/copy/state.ts's private `productLinks` (kept in
 * sync manually — both resolve a list of product slugs to name/href pairs). */
function productLinks(slugs: string[], products: Product[]): { name: string; href: string }[] {
  const seen = new Set<string>();
  const links: { name: string; href: string }[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    const product = products.find((p) => p.slug === slug);
    if (!product) continue;
    seen.add(slug);
    links.push({ name: product.name, href: paths.product(product.category, product.slug) });
  }
  return links;
}

/** Rotating icon set so the industries FeatureGrid does not repeat the same icon. */
const industryIcons: IconName[] = ["Gear", "Factory", "Layers", "Wrench", "Sheet", "Robot"];

/** Data for the "key industries" FeatureGrid of IconCards, each with a recommended-
 * machine chip linking straight to the product. */
export function stateIndustryItems(
  state: State,
  products: Product[],
): { icon: IconName; title: string; text: string; machines: { name: string; href: string }[] }[] {
  return state.industries.map((industry, i) => ({
    icon: industryIcons[i % industryIcons.length],
    title: industry.name,
    text: industry.note,
    machines: productLinks(industry.recommendedProductSlugs, products),
  }));
}

/** The 6-step "how delivery works" ProcessSteps graphic. */
export function stateProcessSteps(stateName: string): { icon: IconName; title: string; text: string }[] {
  return [
    {
      icon: "Ruler",
      title: "Site survey",
      text: `Floor loading, access and available power at your ${stateName} site checked against a shared checklist before dispatch.`,
    },
    {
      icon: "Truck",
      title: "Transport",
      text: "The machine moves from our Kolkata works by road, rail or coastal freight depending on distance and size.",
    },
    {
      icon: "Wrench",
      title: "Installation",
      text: "Foundation and 415 V three-phase supply verified, then the machine is levelled and commissioned.",
    },
    {
      icon: "Gauge",
      title: "Test cut",
      text: "Calibration and test cuts run on your own material to confirm accuracy and finish.",
    },
    {
      icon: "Check",
      title: "Handover",
      text: "Formal handover once you and our engineer are both satisfied with cut or weld quality.",
    },
    {
      icon: "GraduationCap",
      title: "Training",
      text: "Operators trained on-site at handover, with refresher sessions available afterward.",
    },
  ];
}
