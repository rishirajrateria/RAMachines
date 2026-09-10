/**
 * app/products/[category]/glance.ts — "At a glance" facts (power/axes range, bed/reach
 * size, materials cut, best-for summary) for each category's GlancePanel. Hand-tuned per
 * category from the real figures in data/products.ts, because the four categories don't
 * share a common spec shape (laser power & bed size vs. axis count & reach) — a generic
 * min/max scan across `comparisonSpecs` would be fragile. Update alongside data/products.ts
 * if a SKU's headline figures change.
 */
import type { CategorySlug } from "@/data/types";
import type { IconName } from "@/components/ui/Icons";

export interface GlanceFact {
  icon: IconName;
  label: string;
  value: string;
}

export const categoryGlance: Record<CategorySlug, GlanceFact[]> = {
  "fiber-laser-cutting-machines": [
    { icon: "Power", label: "Power range", value: "1.5 kW – 12 kW" },
    { icon: "Ruler", label: "Bed sizes", value: "1500×3000 mm – 2500×6000 mm" },
    { icon: "Layers", label: "Materials", value: "Carbon steel, stainless, aluminium, brass, copper" },
    { icon: "Factory", label: "Best for", value: "Sheet metal fabrication, 3–50 mm" },
  ],
  "tube-laser-cutting-machines": [
    { icon: "Power", label: "Power", value: "2 kW (1–3 kW configurable)" },
    { icon: "Ruler", label: "Tube length", value: "Up to 6,500 mm (8,000 mm optional)" },
    { icon: "Layers", label: "Materials", value: "Carbon steel, stainless, aluminium, brass tube" },
    { icon: "Factory", label: "Best for", value: "Round, square & rectangular tube profiling" },
  ],
  "co2-laser-machines": [
    { icon: "Power", label: "Power", value: "130 W (100–150 W configurable)" },
    { icon: "Ruler", label: "Working area", value: "1300 × 900 mm" },
    { icon: "Layers", label: "Materials", value: "Acrylic, wood, MDF, leather, fabric" },
    { icon: "Factory", label: "Best for", value: "Signage, packaging & display fabrication" },
  ],
  "robotic-welding-systems": [
    { icon: "Bolt", label: "Axes", value: "6-axis" },
    { icon: "Ruler", label: "Max reach", value: "1,437 mm – 1,800 mm" },
    { icon: "Layers", label: "Materials", value: "Mild steel, stainless steel, aluminium" },
    { icon: "Factory", label: "Best for", value: "Consistent, high-volume MIG/MAG welding" },
  ],
};
