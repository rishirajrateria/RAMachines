/**
 * components/sections/CertStrip.tsx — the home page "Licences & Certifications"
 * row (SPEC §4.6). ADR-0005 §6: "a single row of small glass pills with names +
 * 'All certifications →'." Links through to the full /certifications page.
 */
import Link from "next/link";
import { certifications } from "@/data";
import CertCard from "@/components/cards/CertCard";
import { paths } from "@/lib/urls";
import { ArrowRight } from "@/components/ui/Icons";

export default function CertStrip({ compact = true }: { compact?: boolean } = {}) {
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {certifications.map((cert) => (
          <div key={cert.slug} className="w-full sm:w-auto">
            <CertCard cert={cert} compact={compact} />
          </div>
        ))}
      </div>
      <Link href={paths.certifications} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-hover">
        All certifications
        <ArrowRight width={14} height={14} />
      </Link>
    </div>
  );
}
