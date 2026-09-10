/**
 * app/export/page.tsx — /export hub: the export-process overview and the
 * directory of all 30 country pages, grouped by region. Country-specific
 * detail lives on /export/[country] (see ./[country]/page.tsx).
 * ADR-0002 visual refresh: a dark hero band with icon chips, an "at a glance"
 * facts panel and a process graphic lead the page; the original prose (hubIntro
 * + hubSections, verbatim) is kept in full but moved below, split into short
 * alternating two-column blocks with an icon panel opposite each block of text.
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
import Band from "@/components/ui/Band";
import GlancePanel from "@/components/ui/GlancePanel";
import SectionHeading from "@/components/ui/SectionHeading";
import ProcessSteps from "@/components/ui/ProcessSteps";
import Chips from "@/components/ui/Chips";
import { Icon } from "@/components/ui/Icons";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { countriesByRegion } from "@/data";
import { hubIntro, hubSections, exportHubFaqs, exportProcessSteps } from "./copy";
import { regionIcons, hubGlanceFacts } from "./visuals";
import RegionCard from "./RegionCard";
import IconPanel from "./IconPanel";
import HubForm from "./HubForm";

export const metadata = buildMetadata({
  title: "Laser Cutting Machine Exporter from India",
  description:
    "RA Machine exports CE-marked, ISO 9001:2015-certified fiber laser cutting machines and robotic welding systems from India to 30 countries, with pre-shipment inspection, installation, training and warranty support.",
  path: paths.exportHub,
});

const heroChips: { label: string; icon: "Badge" | "Shield" | "Globe" | "Ship" }[] = [
  { label: "IEC exporter", icon: "Badge" },
  { label: "CE/ISO", icon: "Shield" },
  { label: "30 markets", icon: "Globe" },
  { label: "FOB/CIF", icon: "Ship" },
];

export default function ExportHubPage() {
  const regions = countriesByRegion();
  const regionEntries = Object.entries(regions).filter(([, list]) => list.length > 0);

  return (
    <>
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Export", href: paths.exportHub }]} />
      </Container>

      <Band tone="dark">
        <p className="eyebrow mb-3">
          <Icon name="Globe" size={16} />
          Export from India
        </p>
        <h1 className="max-w-3xl font-display text-display-lg text-white">
          Laser Cutting Machine &amp; Robotic Welding Exporter from India
        </h1>
        <p className="mt-4 max-w-2xl text-white/75">
          IEC-registered, CE marked and ISO 9001:2015 certified, with pre-shipment video inspection,
          installation, training and warranty support shipped to 30 countries.
        </p>
        <div className="mt-6">
          <Chips items={heroChips} />
        </div>
      </Band>

      <Section tight>
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <AboutBlurb context="This page sets out how our export process, documentation and shipping terms work for international buyers, and lists every country we currently ship to." />
            <div className="mt-6">
              <CtaGroup context="an export enquiry" />
            </div>
          </div>
          <GlancePanel title="At a glance" facts={hubGlanceFacts()} />
        </div>
      </Section>

      <Section title="Our export process" icon="Package" intro="Every order — wherever it ships — follows the same eight steps from quotation to warranty support." tight>
        <ProcessSteps steps={exportProcessSteps} />
      </Section>

      <Section
        title="Countries we export to"
        icon="Globe"
        intro="30 markets across nine regions. Open a country page for sector-specific detail, shipping terms and an export enquiry form pre-filled with your country."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regionEntries.map(([region, list]) => (
            <RegionCard key={region} region={region} icon={regionIcons[region as keyof typeof regionIcons]} countries={list} />
          ))}
        </div>
        <div className="mt-10 space-y-8">
          {regionEntries.map(([region, list]) => (
            <div key={region}>
              <h3 className="mb-3 font-display text-lg text-ink">{region}</h3>
              <LinkGrid links={list.map((c) => ({ name: c.name, href: paths.country(c.slug) }))} variant="chips" />
            </div>
          ))}
        </div>
      </Section>

      <Section tight>
        <SectionHeading eyebrow="Export from India" icon="Sparkles" title="Exporting fiber laser cutting and robotic welding machines from India" />
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center">
          <Prose>
            {hubIntro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </Prose>
          <IconPanel icon="Globe" label="Built for export from day one" />
        </div>

        <div className="mt-14 space-y-12">
          {hubSections.map((section, i) => {
            const text = (
              <Prose key="text">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </Prose>
            );
            const visual = <IconPanel key="visual" icon={section.icon} label={section.h2} tone={i % 2 === 0 ? "soft" : "spark"} />;
            return (
              <div key={section.h2} className="border-t border-grey-200 pt-10">
                <SectionHeading icon={section.icon} title={section.h2} />
                <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-center">
                  {i % 2 === 0 ? [text, visual] : [visual, text]}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="quote" title="Send an export enquiry" icon="Mail" tight>
        <div className="max-w-xl rounded-xl border border-grey-200 bg-white p-6 shadow-card">
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
