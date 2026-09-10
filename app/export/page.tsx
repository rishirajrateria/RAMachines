/**
 * app/export/page.tsx — /export hub: the export-process overview and the
 * directory of all 30 country pages, grouped by region. Country-specific
 * detail lives on /export/[country] (see ./[country]/page.tsx).
 */
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CtaGroup from "@/components/ui/CtaGroup";
import LinkGrid from "@/components/ui/LinkGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/sections/CtaBand";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { countriesByRegion } from "@/data";
import { hubIntro, hubSections, exportHubFaqs } from "./copy";
import HubForm from "./HubForm";

export const metadata = buildMetadata({
  title: "Laser Cutting Machine Exporter from India",
  description:
    "RA Machine exports CE-marked, ISO 9001:2015-certified fiber laser cutting machines and robotic welding systems from India to 30 countries, with pre-shipment inspection, installation, training and warranty support.",
  path: paths.exportHub,
});

export default function ExportHubPage() {
  const regions = countriesByRegion();
  const regionEntries = Object.entries(regions).filter(([, list]) => list.length > 0);

  return (
    <>
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Export", href: paths.exportHub }]} />
        <h1 className="mt-2 max-w-3xl font-display text-display-lg text-ink">
          Laser Cutting Machine &amp; Robotic Welding Exporter from India
        </h1>
        <div className="mt-4 max-w-3xl">
          <AboutBlurb context="This page sets out how our export process, documentation and shipping terms work for international buyers, and lists every country we currently ship to." />
        </div>
        <div className="mt-8">
          <CtaGroup context="an export enquiry" />
        </div>
      </Container>

      <Section title="Exporting fiber laser cutting and robotic welding machines from India" tight>
        <Prose>
          {hubIntro.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </Prose>
      </Section>

      {hubSections.map((section) => (
        <Section key={section.h2} title={section.h2} tight>
          <Prose>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </Prose>
        </Section>
      ))}

      <Section
        title="Countries we export to"
        intro="30 markets across nine regions, grouped below. Open a country page for sector-specific detail, shipping terms and an export enquiry form pre-filled with your country."
      >
        <div className="space-y-10">
          {regionEntries.map(([region, list]) => (
            <div key={region}>
              <h3 className="mb-3 font-display text-lg text-ink">{region}</h3>
              <LinkGrid links={list.map((c) => ({ name: c.name, href: paths.country(c.slug) }))} columns={4} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="quote" title="Send an export enquiry" tight>
        <div className="max-w-xl">
          <HubForm />
        </div>
      </Section>

      <Section tight>
        <Faq items={exportHubFaqs} />
      </Section>

      <CtaBand
        title="Ready to start your export enquiry"
        text="Tell us your material, thickness or welding requirement and the country you are shipping to, and we will issue a formal quotation covering FOB Kolkata and CIF options."
      />
    </>
  );
}
