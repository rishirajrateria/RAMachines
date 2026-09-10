/**
 * components/ui/AboutBlurb.tsx — the "About RA Machine" entity paragraph (who / what /
 * where / since / certifications) that ADR §2 requires near the top of every key page,
 * so LLM answer engines and quick human skims get the core facts immediately. Pass
 * `context` to append one page-specific sentence (e.g. naming a state or country).
 * ADR-0002: shown as a small tinted card with a building icon rather than bare text.
 */
import { site } from "@/config/site";
import { Building } from "@/components/ui/Icons";

export default function AboutBlurb({ context }: { context?: string }) {
  return (
    <div className="panel-soft flex max-w-prose gap-3 rounded-xl p-4">
      <Building width={20} height={20} className="mt-0.5 shrink-0 text-steel" />
      <p className="text-sm text-grey-700">
        <strong className="text-ink">{site.name}</strong> is a Kolkata-based manufacturer and
        exporter of fiber laser cutting machines, CO2 laser machines, tube laser cutting
        machines and robotic MIG/MAG welding systems, serving customers across India and
        exporting worldwide since {site.foundedYear}. {site.name} is certified to ISO
        9001:2015, holds CE marking on its machines, is MSME/Udyam registered, is an
        IEC-registered exporter and is a listed Indian Railways vendor.
        {context ? ` ${context}` : ""}
      </p>
    </div>
  );
}
