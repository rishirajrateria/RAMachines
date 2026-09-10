/**
 * app/export/page.tsx — /export hub: the export-process overview and the
 * directory of all 30 country pages, grouped by region. Country-specific
 * detail lives on /export/[country] (see ./[country]/page.tsx).
 *
 * ADR-0005 "Liquid Glass" page anatomy (docs/adr/0005-liquid-glass.md §6):
 * hero panel → FactStrip (markets, warranty, lead time, Incoterms) → Steps
 * (export process, 6 concise labels) → regions as a DividedList of country
 * text links → a short prose column → exportHubFaqs + an export enquiry form
 * in glass. Six sections total, ≥ 96px rhythm between them.
 */
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CtaGroup from "@/components/ui/CtaGroup";
import Faq from "@/components/ui/Faq";
import Band from "@/components/ui/Band";
import { FactStrip, Steps, DividedList } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { countriesByRegion } from "@/data";
import { hubIntro, hubSections, exportHubFaqs, exportProcessSteps } from "./copy";
import { hubFacts } from "./visuals";
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
      </Container>

      <Band tone="dark">
        <p className="eyebrow mb-3">Export from India</p>
        <h1 className="max-w-3xl font-display text-display-lg text-ink">
          Laser Cutting Machine &amp; Robotic Welding Exporter from India
        </h1>
        <p className="mt-4 max-w-2xl text-grey-600">
          IEC-registered, CE marked and ISO 9001:2015 certified, with pre-shipment video inspection,
          installation, training and warranty support shipped to 30 countries.
        </p>
      </Band>

      <Section>
        <div className="grid gap-6">
          <AboutBlurb context="This page sets out how our export process, documentation and shipping terms work for international buyers, and lists every country we currently ship to." />
          <CtaGroup context="an export enquiry" />
        </div>
      </Section>

      <Section title="At a glance">
        <FactStrip facts={hubFacts()} />
      </Section>

      <Section title="Export process" intro="Every order, wherever it ships, follows the same steps from quotation to warranty support.">
        <Steps steps={exportProcessSteps.map((s) => s.title)} />
      </Section>

      <Section title="Where we ship" intro="30 markets across nine regions. Open a country page for sector-specific detail, shipping terms and an export enquiry form pre-filled with your country.">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {regionEntries.map(([region, list]) => (
            <div key={region}>
              <p className="mb-1 text-sm font-semibold text-ink">{region}</p>
              <DividedList
                items={list.map((c) => ({ title: c.name, href: paths.country(c.slug) }))}
                columns={1}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="How export works">
        <Prose>
          {hubIntro.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          {hubSections.map((section) => (
            <div key={section.h2}>
              <h3>{section.h2}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          ))}
        </Prose>
      </Section>

      <Section>
        <Faq items={exportHubFaqs} />
        <div id="quote" className="glass-strong mt-10 p-8 text-center md:p-12">
          <h2 className="section-title mx-auto max-w-2xl text-display-md">Send an export enquiry</h2>
          <p className="mx-auto mt-3 max-w-2xl text-grey-600">
            Tell us your material, thickness or welding requirement and the country you are shipping to, and
            we will issue a formal quotation covering FOB Kolkata and CIF options.
          </p>
          <div className="mx-auto mt-8 max-w-xl text-left">
            <HubForm />
          </div>
        </div>
      </Section>
    </>
  );
}
