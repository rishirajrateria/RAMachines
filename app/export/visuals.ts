/**
 * app/export/visuals.ts — shared, non-copy presentation helpers for the export hub
 * and country pages (ADR-0005 "Liquid Glass"). Everything here picks an icon/value
 * for an existing fact — it never invents a new claim.
 *
 * ADR-0005 retires GlancePanel/StatsBar in favour of FactStrip, ProcessSteps in
 * favour of Steps, and drops icon-bearing cards for industries/sectors (those are
 * now DividedList rows, which has no icon slot). `hubFacts`/`countryFacts` below
 * return the handful of facts each page's FactStrip shows; each fact is shown in
 * exactly one place on the page (FactStrip), never restated as a number elsewhere,
 * except the hero's own 3 inline facts (voltage/frequency, currency, port), which
 * intentionally echo the first few FactStrip values as a quick-glance teaser —
 * the same hero+FactStrip pairing the ADR uses for every state/city/country page.
 */
import type { IconName } from "@/components/ui/Icons";
import type { Country } from "@/data/types";
import { site } from "@/config/site";

/** Cycled short labels for a country's `whyIndia` reasons in the "Why India"
 * DividedList — content stays the country's own verbatim sentence (the list
 * item's `text`); this only supplies a short row title. */
export const whyIndiaTitleCycle = [
  "Documented quality",
  "Competitive pricing",
  "Responsive support",
  "Logistics & trade ties",
  "Proven track record",
];

/** The hub FactStrip's 4 facts (markets, warranty, lead time, Incoterms). */
export function hubFacts(): { icon: IconName; label: string; value: string }[] {
  return [
    { icon: "Globe", label: "Markets", value: "30 countries" },
    { icon: "Shield", label: "Warranty", value: `${site.service.warrantyMonths} months` },
    { icon: "Clock", label: "Lead time", value: `${site.service.leadTimeWeeks} weeks` },
    { icon: "Truck", label: "Incoterms", value: "FOB / CIF" },
  ];
}

/** A country page's FactStrip — 5 of {voltage, frequency, currency, ports, lead
 * time, warranty}. Warranty is left out here because its exact figure is stated
 * once, in the prose warranty/spares paragraph, rather than twice. */
export function countryFacts(country: Country): { icon: IconName; label: string; value: string }[] {
  return [
    { icon: "Power", label: "Voltage", value: country.voltage },
    { icon: "Bolt", label: "Frequency", value: country.frequency },
    { icon: "Currency", label: "Currency", value: country.currency },
    { icon: "Ship", label: "Sea ports", value: country.ports.join(", ") },
    { icon: "Clock", label: "Lead time", value: `${site.service.leadTimeWeeks} weeks` },
  ];
}
