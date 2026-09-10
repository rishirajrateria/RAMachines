/**
 * app/india/_lib/stateVisuals.ts — presentation-layer facts for /india/[state]
 * (ADR-0005 §6 anatomy), derived from the same `State`/`Product` objects
 * lib/copy/state.ts composes prose from: the three tiny hero facts, the
 * FactStrip, the "Industries" DividedList + product tiles, the delivery
 * Steps and the cities DividedList. Kept out of lib/copy/state.ts so that
 * file stays focused on the composed prose. None of these repeat a fact
 * shown elsewhere on the page (ADR-0005: a fact appears once).
 */
import type { StepItem } from "@/components/ui/glass";
import type { IconName } from "@/components/ui/Icons";
import type { State, City, Product } from "@/data/types";
import { deliveryWindowLabel } from "@/lib/copy/state";
import { paths } from "@/lib/urls";

/** The three tiny inline facts shown under the hero sentence. */
export function stateHeroFacts(state: State, cities: City[]): { label: string; value: string }[] {
  return [
    { label: "cities covered", value: `${cities.length}` },
    { label: "industries served", value: `${state.industries.length}` },
    { label: "typical delivery", value: deliveryWindowLabel(state.logisticsNote) },
  ];
}

/** The FactStrip: industries, industrial areas, delivery, service, training. */
export function stateFactStripFacts(
  state: State,
  cities: City[],
): { icon: IconName; label: string; value: string }[] {
  void cities;
  return [
    { icon: "Gear", label: "Industries", value: `${state.industries.length}` },
    { icon: "Building", label: "Industrial areas", value: `${state.industrialAreas.length}` },
    { icon: "Truck", label: "Delivery", value: deliveryWindowLabel(state.logisticsNote) },
    { icon: "Headset", label: "Service", value: "Remote + on-site" },
    { icon: "GraduationCap", label: "Training", value: "On-site + Kolkata" },
  ];
}

/** One DividedList row per industry: name, clusters, and a link to the machine we
 * recommend most for it (the first of its recommended product slugs). */
export function stateIndustryItems(
  state: State,
  products: Product[],
): { title: string; text: string; href?: string; meta?: string }[] {
  return state.industries.map((industry) => {
    const recommended = industry.recommendedProductSlugs
      .map((slug) => products.find((p) => p.slug === slug))
      .find((p): p is Product => Boolean(p));
    return {
      title: industry.name,
      text: industry.clusters.join(", "),
      href: recommended ? paths.product(recommended.category, recommended.slug) : undefined,
      meta: recommended?.name,
    };
  });
}

/** Up to 3 machines to show as tiles: the products most often recommended across
 * this state's industries, deduplicated, falling back to the catalogue order. */
export function stateProductTiles(state: State, products: Product[]): Product[] {
  const slugs = Array.from(new Set(state.industries.flatMap((i) => i.recommendedProductSlugs)));
  const recommended = slugs.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is Product => Boolean(p));
  const rest = products.filter((p) => !recommended.includes(p));
  return [...recommended, ...rest].slice(0, 3);
}

/** The 5-step "how delivery works" line. */
export function stateSteps(stateName: string): StepItem[] {
  return [
    {
      title: "Site survey",
      text: `Floor loading, access and available power at your ${stateName} site checked before dispatch.`,
    },
    {
      title: "Transport",
      text: "The machine moves from our Kolkata works by road, rail or coastal freight depending on distance and size.",
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

/** The cities DividedList: every city page in this state, two columns. */
export function stateCityLinks(cities: City[], stateSlug: string): { title: string; href: string }[] {
  return cities.map((city) => ({ title: city.name, href: paths.city(stateSlug, city.slug) }));
}
