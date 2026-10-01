/**
 * components/ui/AboutBlurb.tsx — ADR-0005 §6: "a single italic-free grey
 * paragraph under the hero, 2 sentences max." The "About RA Machine" entity
 * paragraph (who / what / where / since / certifications) SPEC requires near the
 * top of every key page, for human skims and LLM answer engines. Pass `context`
 * to append one page-specific sentence (e.g. naming a state or country).
 *
 * Reworded after the Oct 2026 client review ("rewording, punctuation"): the
 * five technologies replace the old CO2/tube list, the certifications read as
 * one sentence instead of a five-item run-on, and CE marking is stated "where
 * applicable", matching the certifications page.
 */
import Link from "next/link";
import { site } from "@/config/site";
import { paths } from "@/lib/urls";

export default function AboutBlurb({
  context,
  /**
   * Whether to close with a link to /about. On by default: this paragraph runs
   * on nearly every page, and measured across the built site /about had ZERO
   * in-content inbound links — it was reachable only from the header and
   * footer, which crawlers discount. Set false on /about itself so the page
   * does not link to itself.
   */
  linkToAbout = true,
}: {
  context?: string;
  linkToAbout?: boolean;
}) {
  return (
    <p className="max-w-prose text-sm text-grey-600">
      <strong className="font-semibold text-ink">{site.name}</strong> is the CNC machine division of{" "}
      {site.legalName}, an engineering company in Kolkata, India, founded in {site.foundedYear} and
      building machines since {site.machineDivisionSince}. We make CNC laser and plasma cutting machines,
      MIG, TIG, MMA and submerged arc welding machines, and cobot and robotic welding systems, and supply
      them across India and abroad. We are ISO 9001:2015 certified, MSME (Udyam) registered and a listed
      Indian Railways vendor; our machines carry CE marking where applicable, and we hold an Import Export
      Code for export.
      {context ? ` ${context}` : ""}{" "}
      {linkToAbout && (
        <Link href={paths.about} className="font-semibold text-teal underline-offset-2 hover:underline">
          More about RA Machine
        </Link>
      )}
    </p>
  );
}
