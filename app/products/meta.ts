/**
 * app/products/meta.ts — keyword-first <title> for each machine-family page.
 *
 * Descriptions come straight from data/categories.ts (`description`, ≤155
 * chars). Titles are hand-tuned here to stay ≤60 characters (SPEC §6); the
 * family page falls back to "<name> | RA Machine" if a slug is missing.
 */
import type { CategorySlug } from "@/data/types";

export const categoryTitles: Record<CategorySlug, string> = {
  "fiber-laser-cutting-machines": "CNC Fiber Laser Cutting Machine Manufacturer, India",
  "cnc-plasma-cutting-machines": "CNC Plasma Cutting Machine Manufacturer, India",
  "mig-tig-arc-welding-machines": "MIG, TIG & Arc Welding Machine Manufacturer, India",
  "submerged-arc-welding-machines": "Submerged Arc Welding (SAW) Machine Manufacturer, India",
  "robotic-welding-systems": "Cobot & Robotic Welding System Manufacturer, India",
};
