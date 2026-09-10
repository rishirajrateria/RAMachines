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
  [/gantry|casting|frame|rigid|stability|bed|table|chuck|fixture|station/i, { icon: "Layers", label: "Build" }],
  [/speed|cycle|faster|throughput|acceleration|productiv/i, { icon: "Gauge", label: "Speed" }],
  [/thickness|range|capacity|up to \d|diameter|length|envelope|reach/i, { icon: "Ruler", label: "Capacity" }],
  [/consumable|spares?|training|service|support|operator/i, { icon: "Headset", label: "Support" }],
  [/material|steel|stainless|aluminium|brass|copper|acrylic|wood|tube|pipe|profile/i, { icon: "Sheet", label: "Materials" }],
  [/laser|power|watt|kw\b|fiber|co2/i, { icon: "Bolt", label: "Power" }],
];

export function highlightMeta(text: string): HighlightMeta {
  for (const [pattern, meta] of rules) {
    if (pattern.test(text)) return meta;
  }
  // Fallback: use the first two words of the sentence as a short label rather than a generic tag.
  const words = text.replace(/[^\w\s-]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).join(" ");
  return { icon: "Check", label: words || "Feature" };
}
