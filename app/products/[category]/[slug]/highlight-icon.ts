/**
 * app/products/[category]/[slug]/highlight-icon.ts — turns one `highlights` sentence
 * into an IconCard: a matched icon plus a short category label ("Power", "Safety",
 * "Controls"…) as the card title, with the full original sentence kept verbatim as the
 * card body (ADR-0002: "every 'why' point gets an icon"). Purely presentational — no
 * copy is added, removed or reworded, only labelled.
 */
import type { IconName } from "@/components/ui/Icons";

export interface HighlightMeta {
  icon: IconName;
  label: string;
}

const rules: [RegExp, HighlightMeta][] = [
  [/safety|enclosed|interlock|protect|guard/i, { icon: "Shield", label: "Safety" }],
  [/servo|accuracy|precision|drive|motor|repeat/i, { icon: "Gauge", label: "Precision" }],
  [/controller|software|nesting|program|hmi/i, { icon: "Layers", label: "Controls" }],
  [/weld|torch|arc|mig|mag/i, { icon: "Weld", label: "Welding" }],
  [/warranty|certified|iso|ce\b|rated life/i, { icon: "Award", label: "Reliability" }],
  [/footprint|compact|space|floor/i, { icon: "Ruler", label: "Footprint" }],
  [/laser|power|watt|kw\b|fiber/i, { icon: "Bolt", label: "Power" }],
];

export function highlightMeta(text: string): HighlightMeta {
  for (const [pattern, meta] of rules) {
    if (pattern.test(text)) return meta;
  }
  return { icon: "Check", label: "Highlight" };
}
