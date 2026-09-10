/**
 * app/certifications/page.tsx — Licences & Certifications. ADR-0005 "Liquid
 * Glass" §6: hero panel → DividedList of certificates → short prose →
 * certificationFaqs.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { certifications } from "@/data";
import { certificationFaqs } from "@/data/faqs";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Faq from "@/components/ui/Faq";
import CertModal from "./CertModal";

export const metadata: Metadata = buildMetadata({
  title: "Licences & Certifications | RA Machine",
  description:
    "RA Machine's quality, safety and export certifications: ISO 9001:2015, CE marking, GST, MSME/Udyam, IEC, Indian Railways vendor listing and Make in India.",
  path: paths.certifications,
});

export default function CertificationsPage() {
  return (
    <>
      {/* 1. Hero panel. */}
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Certifications", href: paths.certifications }]} />
        <div className="glass-strong mt-4 p-8 md:p-12">
          <h1 className="font-display text-display-lg text-ink">Licences & Certifications</h1>
          <p className="mt-4 max-w-prose text-grey-600">
            Every RA Machine unit is built under a documented, audited quality system and shipped with
            the licences global procurement teams check before approving a new supplier.
          </p>
          <div className="mt-5 max-w-prose">
            <AboutBlurb />
          </div>
        </div>
      </Section>

      {/* 2. Divided list of certificates. */}
      <Section eyebrow="Certificates" title="All certifications">
        <CertModal certifications={certifications} />
      </Section>

      {/* 3. Short prose. */}
      <Section title="Quality & compliance">
        <Prose>
          <p>
            Our quality management system builds every machine against a repeatable, documented
            checklist rather than depending on any one technician&rsquo;s memory, whether it is bound
            for a workshop near Kolkata or a container for export.
          </p>
          <p>
            Many markets outside the EU also treat CE marking as a recognised safety benchmark during
            customs clearance and plant safety audits, which simplifies onboarding at the destination.
          </p>
          <p>
            Our statutory registrations are frequently mandatory pre-qualification requirements in
            government, PSU and railway tenders, and confirm our machines are engineered and built
            domestically, not imported and rebadged.
          </p>
        </Prose>
      </Section>

      {/* 4. Faq. */}
      <Section>
        <Faq items={certificationFaqs} />
      </Section>
    </>
  );
}
