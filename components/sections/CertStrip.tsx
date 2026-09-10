/**
 * components/sections/CertStrip.tsx — the home page "Licences & Certifications" strip
 * (SPEC §4.6: visually prominent, for global ad traffic). Links through to the full
 * /certifications page.
 */
import Link from "next/link";
import { certifications } from "@/data";
import CertCard from "@/components/cards/CertCard";
import { paths } from "@/lib/urls";
import { ArrowRight } from "@/components/ui/Icons";

export default function CertStrip() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {certifications.map((cert) => (
          <CertCard key={cert.slug} cert={cert} />
        ))}
      </div>
      <Link
        href={paths.certifications}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-spark hover:text-spark-hover"
      >
        View all certifications
        <ArrowRight width={14} height={14} />
      </Link>
    </div>
  );
}
