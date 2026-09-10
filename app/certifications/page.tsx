/**
 * app/certifications/page.tsx — Licences & Certifications (SPEC §4
 * "/certifications"). ADR-0002 visual refresh: an icon chip row up top, quality &
 * compliance copy led by 3 IconCards with the full original prose kept underneath in
 * short headed blocks, the certificate grid + modal (./CertModal.tsx), then
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
import Faq from "@/components/ui/Faq";
import Chips from "@/components/ui/Chips";
import IconCard from "@/components/ui/IconCard";
import CtaBand from "@/components/sections/CtaBand";
import CertModal from "./CertModal";

export const metadata: Metadata = buildMetadata({
  title: "Licences & Certifications | RA Machine",
  description:
    "RA Machine's quality, safety and export certifications: ISO 9001:2015, CE marking, GST, MSME/Udyam, IEC, Indian Railways vendor listing and Make in India.",
  path: paths.certifications,
});

const qualityPillars = [
  {
    icon: "Shield" as const,
    title: "Quality management",
    text: "ISO 9001:2015 covers design review, incoming checks, in-process inspection and a final functional test.",
  },
  {
    icon: "Globe" as const,
    title: "Export safety",
    text: "CE marking confirms guarding, emergency-stops, enclosures and interlocks meet EU machinery safety directives.",
  },
  {
    icon: "Badge" as const,
    title: "Statutory registration",
    text: "GST, MSME/Udyam, an IEC and Indian Railways vendor status confirm compliant, government-vetted status.",
  },
];

const qualityParagraphs: { heading: string; text: string }[] = [
  {
    heading: "Our quality management system",
    text: "Each machine is built against a repeatable, documented checklist rather than depending on any one technician's memory, whether it is bound for a workshop near Kolkata or a container for export.",
  },
  {
    heading: "Export safety compliance",
    text: "Many markets outside the EU also treat CE marking as a recognised safety benchmark during customs clearance and plant safety audits, simplifying onboarding at destination.",
  },
  {
    heading: "Statutory registration in India",
    text: "These registrations are frequently mandatory pre-qualification requirements in government, PSU and railway tenders, and confirm machines are engineered and built domestically, not imported and rebadged.",
  },
];

export default function CertificationsPage() {
  return (
    <>
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Certifications", href: paths.certifications }]} />
        <h1 className="mt-2 font-display text-display-lg text-ink">Licences & Certifications</h1>
        <div className="mt-4">
          <Chips
            items={[
              { label: `${certifications.length} certifications`, icon: "Certificate" },
              { label: "ISO 9001:2015", icon: "Shield" },
              { label: "CE marked", icon: "Badge" },
              { label: "Indian Railways vendor", icon: "Award" },
            ]}
          />
        </div>
        <div className="mt-5 max-w-2xl">
          <AboutBlurb />
        </div>
      </Section>

      <Section eyebrow="Quality & compliance" icon="Shield" title="How we approach quality and compliance">
        <div className="grid gap-5 sm:grid-cols-3">
          {qualityPillars.map((pillar) => (
            <IconCard key={pillar.title} icon={pillar.icon} title={pillar.title} text={pillar.text} />
          ))}
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {qualityParagraphs.map((block) => (
            <div key={block.heading}>
              <h3 className="font-display text-lg text-ink">{block.heading}</h3>
              <p className="mt-2 max-w-prose text-sm text-grey-600">{block.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Certificates" icon="Award" title="All RA Machine licences & certifications">
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
