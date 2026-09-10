/**
 * app/certifications/page.tsx — Licences & Certifications (SPEC §4
 * "/certifications"). 400 words on quality & compliance, every certificate as a
 * card with a modal image view (./CertModal.tsx), certificationFaqs.
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
import CtaBand from "@/components/sections/CtaBand";
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
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Certifications", href: paths.certifications }]} />
        <h1 className="mt-2 font-display text-display-lg text-ink">Licences & Certifications</h1>
        <div className="mt-4 max-w-2xl">
          <AboutBlurb />
        </div>
        <p className="mt-4 max-w-prose text-grey-600">
          Global ad traffic and export enquiries mean many visitors land on this page before ever
          speaking to us, so we keep it as complete and verifiable as our product pages. Every
          certificate below covers a specific part of what a procurement or compliance team checks
          before approving a new machinery supplier — quality management, export safety, tax and
          statutory registration, and government-recognised manufacturing status.
        </p>
      </Section>

      <Section eyebrow="Quality & compliance" title="How we approach quality and compliance">
        <Prose>
          <p>
            Every RA Machine unit is built under a documented quality management system certified to
            ISO 9001:2015, covering design review, incoming material checks, in-process inspection
            during fabrication and assembly, and a final functional test before dispatch. In practice
            this means each machine is built against a repeatable checklist rather than depending on
            any one technician's memory, non-conformities are logged and corrected rather than
            overlooked, and the same standard applies whether a machine is destined for a workshop two
            hours from Kolkata or a container bound for an overseas port.
          </p>
          <p>
            Export buyers evaluate a different, additional layer of compliance, which is where CE
            marking matters most: it is our declaration that a machine's guarding, emergency-stop
            circuits, electrical enclosures and interlocks meet the applicable EU machinery and
            low-voltage safety directives. Many markets outside the EU also treat CE as a recognised
            safety benchmark during customs clearance and plant safety audits, so it simplifies
            onboarding a new machine at destination even where CE is not the formal local standard.
          </p>
          <p>
            Within India, GST registration, MSME/Udyam registration, our Import Export Code from the
            DGFT, and our listing as an Indian Railways vendor together establish us as a properly
            registered, tax-compliant, government-vetted manufacturing enterprise rather than an
            informal trading operation. These registrations are frequently mandatory pre-qualification
            requirements in government, PSU and railway tenders, and our alignment with the Make in
            India initiative confirms that machines are engineered and built domestically, not
            imported and rebadged.
          </p>
          <p>
            We are glad to share verifiable copies of any certificate, including certificate numbers
            and issuing body details, during the quotation process, so your procurement or compliance
            team can independently confirm them before placing an order or opening a tender file. If a
            specific tender or import requirement asks about a certification not listed here, tell us
            at enquiry stage and we will confirm applicability in writing.
          </p>
        </Prose>
      </Section>

      <Section eyebrow="Certificates" title="All RA Machine licences & certifications">
        <CertModal certifications={certifications} />
      </Section>

      <Section>
        <Faq items={certificationFaqs} title="Certifications — frequently asked questions" />
      </Section>

      <CtaBand
        title="Need a certificate for a tender or audit"
        text="Request verifiable copies of any certificate, or ask about applicability to a specific machine, alongside your quotation."
      />
    </>
  );
}
