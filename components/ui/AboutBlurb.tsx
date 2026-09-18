/**
 * components/ui/AboutBlurb.tsx — ADR-0005 §6: "a single italic-free grey
 * paragraph under the hero, 2 sentences max." The "About RA Machine" entity
 * paragraph (who / what / where / since / certifications) SPEC requires near the
 * top of every key page, for human skims and LLM answer engines. Pass `context`
 * to append one page-specific sentence (e.g. naming a state or country).
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
      {site.legalName}, a Kolkata engineering company established in {site.foundedYear} and building
      machines since {site.machineDivisionSince}. We supply fiber laser cutting machines, CO2 laser
      machines, tube laser cutting machines and robotic MIG/MAG welding systems to customers across
      India and export markets. {site.name} is certified to ISO 9001:2015, holds CE marking on its
      machines, is MSME/Udyam registered, is an IEC-registered exporter and is a listed Indian
      Railways vendor.
      {context ? ` ${context}` : ""}{" "}
      {linkToAbout && (
        <Link href={paths.about} className="font-semibold text-teal underline-offset-2 hover:underline">
          More about RA Machine
        </Link>
      )}
    </p>
  );
}
