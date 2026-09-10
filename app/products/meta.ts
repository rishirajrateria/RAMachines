/**
 * app/products/meta.ts — keyword-first <title> overrides for /products routes.
 *
 * Product and category descriptions are already ≤155 chars in data/products.ts
 * (`shortDescription`) and data/categories.ts (`description`), so pages reuse
 * those directly rather than duplicating copy here. Titles need per-entry care
 * to stay ≤60 chars (see docs/adr/0001-stack-and-ownership.md and SPEC §6), so
 * they are hand-tuned in this map — drop the " | RA Machine" suffix on longer
 * SKU names rather than truncating mid-word.
 *
 * To add a 9th product or 5th category: add its slug/title pair below; the
 * page templates fall back to a generic title built from the entity name if a
 * slug is missing here, so nothing breaks, but a hand-tuned title reads better.
 */
import type { CategorySlug } from "@/data/types";

export const productTitles: Record<string, string> = {
  "ra-f1530": "RA-F1530 1.5 kW Fiber Laser Cutting Machine | RA Machine",
  "ra-f3015-pro": "RA-F3015 Pro 3 kW Fiber Laser Cutting Machine | RA Machine",
  "ra-f6020-hd": "RA-F6020 HD 6 kW Fiber Laser Cutting Machine | RA Machine",
  "ra-f12k": "RA-F12K 12 kW Heavy Duty Fiber Laser Cutting Machine",
  "ra-t6000": "RA-T6000 Fiber Laser Tube Cutting Machine | RA Machine",
  "ra-c1390": "RA-C1390 CO2 Laser Cutting and Engraving Machine",
  "ra-rw6": "RA-RW6 6-Axis Robotic MIG Welding Cell | RA Machine",
  "ra-rw10": "RA-RW10 Dual-Station Robotic MIG Welding | RA Machine",
};

export const categoryTitles: Record<CategorySlug, string> = {
  "fiber-laser-cutting-machines": "Fiber Laser Cutting Machines - Manufacturer, India",
  "tube-laser-cutting-machines": "Tube Laser Cutting Machines - Manufacturer, India",
  "co2-laser-machines": "CO2 Laser Cutting Machines - Manufacturer, India",
  "robotic-welding-systems": "Robotic Welding Systems - Manufacturer, India",
};
