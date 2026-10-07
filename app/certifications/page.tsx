/**
 * app/certifications/page.tsx — Licences & Certifications. ADR-0005 "Liquid
 * Glass" §6 / ADR-0007 §1, §4: image hero → DividedList of certificates →
 * short prose paired with an image → certificationFaqs.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { certifications } from "@/data";
import { certificationFaqs } from "@/data/faqs";
import { photos } from "@/lib/photos";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Faq from "@/components/ui/Faq";
import Button from "@/components/ui/Button";
import PageHero from "@/components/layout/PageHero";
import { ImageSlot } from "@/components/ui/glass";
import CertModal from "./CertModal";

export const metadata: Metadata = buildMetadata({
  title: "Licences & Certifications | RA Machine",
  description:
    "RA Machine's registrations: GST, Import Export Code (IEC) and Indian Railways vendor status, with copies available on request for tenders and export orders.",
  path: paths.certifications,
});

export default function CertificationsPage() {
  return (
    <>
      {/* 1. Hero — full-bleed photo banner. */}
      <PageHero image={photos["hero-certifications"]} align="start">
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Certifications", href: paths.certifications }]} />
        <p className="eyebrow">Licences & compliance</p>
        <h1 className="mt-4 font-display text-display-lg text-ink">Licences & Certifications</h1>
        <p className="mt-4 max-w-prose text-grey-600">
          The registrations buyers and tender committees check first, with copies available on request
          before you order.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="#certificates" variant="solid">
            View all certificates
          </Button>
          <Button href={paths.contact} variant="outline">
            Request documents
          </Button>
        </div>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-teal">
          <span>GST registered</span>
          <span>IEC exporter</span>
          <span>Indian Railways vendor</span>
        </div>
      </PageHero>

      {/* 2. AboutBlurb, moved under the hero. */}
      <Section tight>
        <div className="max-w-prose">
          <AboutBlurb />
        </div>
      </Section>

      {/* 3. Divided list of certificates. */}
      <Section id="certificates" eyebrow="Certificates" title="All certifications">
        <CertModal certifications={certifications} />
      </Section>

      {/* 4. Short prose, paired with an image. */}
      <Section title="Quality & compliance">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Prose>
            <p>
              Every machine is built against a documented build sheet and test-run before it leaves the
              works, rather than depending on any one technician&rsquo;s memory, whether it is bound for a
              workshop near Kolkata or a container for export.
            </p>
            <p>
              Export markets set their own conformity requirements, such as CE marking in the EU. We
              confirm what your market requires, and what we can supply for it, at the quotation stage,
              before production begins.
            </p>
            <p>
              Our statutory registrations are frequently mandatory pre-qualification requirements in
              government, PSU and railway tenders, and confirm our machines are engineered and built
              domestically, not imported and rebadged.
            </p>
          </Prose>
          <ImageSlot image={photos["slot-quality-check"]} aspect="4/3" label="Photo: quality check" />
        </div>
      </Section>

      {/* 5. Faq. */}
      <Section>
        <Faq items={certificationFaqs} />
      </Section>
    </>
  );
}
