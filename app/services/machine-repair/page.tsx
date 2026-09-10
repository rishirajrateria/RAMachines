import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { indiaIndex, type IndiaIndexEntry } from "@/data/india-index";
import { repairFaqs } from "@/data/faqs";
import type { Region } from "@/data/types";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Prose from "@/components/ui/Prose";
import Button from "@/components/ui/Button";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import { Icon } from "@/components/ui/Icons";
import { FactStrip, Steps, DividedList, ImageSlot, ImageBand } from "@/components/ui/glass";
import PageHero from "@/components/layout/PageHero";
import { photos } from "@/lib/photos";
import RepairForm from "@/components/forms/RepairForm";
import {
  introParagraphs,
  onSiteParagraph,
  remoteDiagnosticsParagraph,
  sparesParagraph,
  amcIntro,
  amcRows,
  commonFaults,
  responseTimeParagraph,
  bookIntro,
  stateLinksIntro,
  repairProcessSteps,
  amcTierIcons,
} from "./copy";

const description =
  "On-site pan-India laser cutting machine repair and CNC maintenance, engineers dispatched from Kolkata, remote diagnostics, spares and AMC plans for fiber, CO2, tube laser and robotic welding equipment.";

export const metadata: Metadata = buildMetadata({
  title: "Laser Cutting Machine Repair & CNC Maintenance India",
  description,
  path: paths.repair,
});

const REGION_ORDER: Region[] = ["North", "South", "East", "West", "Central", "North-East"];

function groupByRegion(entries: IndiaIndexEntry[]): Record<Region, IndiaIndexEntry[]> {
  const grouped = {} as Record<Region, IndiaIndexEntry[]>;
  for (const region of REGION_ORDER) grouped[region] = [];
  for (const entry of entries) grouped[entry.region]?.push(entry);
  return grouped;
}

export default function MachineRepairPage() {
  const statesByRegion = groupByRegion(indiaIndex);

  return (
    <>
      <PageHero image={photos["hero-repair"]}>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Machine Repair", href: paths.repair }]} />
        <p className="eyebrow mb-3">
          <Icon name="Wrench" size={16} />
          Repair &amp; Maintenance
        </p>
        <h1 className="max-w-4xl font-display text-display-lg text-ink">
          Laser Cutting Machine Repair &amp; CNC Maintenance Service in India
        </h1>
        <p className="mt-4 max-w-prose text-grey-700">
          One call reaches remote diagnostics, spares dispatch and an engineer from our Kolkata service desk, for any brand on your shop floor.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#book" variant="solid" icon="ArrowRight">
            Book a Repair
          </Button>
          <Button href={site.phoneHref} variant="outline" icon="Phone">
            Call us
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Truck" size={16} className="text-teal" />
            <span className="text-grey-600">On-site response:</span>
            <span className="font-semibold text-ink">{site.service.responseTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Headset" size={16} className="text-teal" />
            <span className="text-grey-600">Remote response:</span>
            <span className="font-semibold text-ink">{site.service.remoteResponseTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Badge" size={16} className="text-teal" />
            <span className="text-grey-600">Brands covered:</span>
            <span className="font-semibold text-ink">All major brands</span>
          </div>
        </div>
      </PageHero>

      <Container>
        <AboutBlurb context="Our service engineers repair and maintain laser cutting and robotic welding equipment of every major brand, pan-India, from our Kolkata headquarters." />
      </Container>

      <Section eyebrow="Service" title="At a glance">
        <FactStrip
          facts={[
            { icon: "Truck", label: "On-site response", value: site.service.responseTime },
            { icon: "Headset", label: "Remote response", value: site.service.remoteResponseTime },
            { icon: "Badge", label: "Brands covered", value: "All major brands" },
            { icon: "Award", label: "AMC tiers", value: "Basic, Standard, Premium" },
          ]}
        />
      </Section>

      <Section eyebrow="Process" title="How it works">
        <Prose>
          {introParagraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p>{onSiteParagraph}</p>
          <p>{remoteDiagnosticsParagraph}</p>
          <p>{sparesParagraph}</p>
          <p>{responseTimeParagraph(site.service.responseTime, site.service.remoteResponseTime)}</p>
        </Prose>
        <div className="mt-10">
          <Steps steps={repairProcessSteps.map((step) => ({ title: step.title, text: step.text }))} />
        </div>
      </Section>

      <Section eyebrow="Diagnostics" title="Common faults">
        <DividedList items={commonFaults.map((fault) => ({ title: fault.title, text: fault.body }))} />
      </Section>

      <Section eyebrow="AMC" title="AMC plans" intro={amcIntro}>
        <div className="grid gap-6 md:grid-cols-3">
          {amcTierIcons.map((tier) => (
            <div key={tier.key} className="glass h-full p-6">
              <span className="glass-pill inline-flex h-11 w-11 items-center justify-center p-0 text-teal">
                <Icon name={tier.icon} size={22} />
              </span>
              <h3 className="mt-4 font-display text-lg text-ink">{tier.name}</h3>
              {tier.recommended && <p className="mt-1 text-xs font-semibold text-teal">Recommended</p>}
              <ul className="mt-4 space-y-3">
                {amcRows.map((row) => (
                  <li key={row.feature} className="flex items-start gap-2 text-sm text-grey-700">
                    <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-teal" />
                    <span>
                      <span className="font-semibold text-ink">{row.feature}:</span> {row[tier.key]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Book a repair" title="Book a Repair">
        <p className="max-w-prose text-grey-700">{bookIntro}</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div id="book" className="glass max-w-xl p-6 md:p-8">
            <RepairForm />
          </div>
          <ImageSlot
            image={photos["slot-engineer-service"]}
            aspect="4/3"
            label="Photo: engineer servicing a machine on-site"
          />
        </div>
      </Section>

      <ImageBand image={photos["slot-warehouse-spares"]} label="Photo: warehouse spares rack" />

      <Section>
        <p className="eyebrow mb-4">Where we work</p>
        <p className="max-w-prose text-grey-700">{stateLinksIntro}</p>
        <div className="mt-8 space-y-8">
          {REGION_ORDER.map((region) => {
            const entries = statesByRegion[region];
            if (!entries.length) return null;
            return (
              <div key={region}>
                <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <Icon name="MapPin" size={16} className="text-teal" />
                  {region} India
                </p>
                <DividedList
                  items={entries.map((entry) => ({
                    title: `Laser machine repair in ${entry.name}`,
                    href: paths.state(entry.slug),
                  }))}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-14">
          <Faq items={repairFaqs} title="Frequently asked questions about machine repair" />
        </div>
      </Section>

      <JsonLd
        data={serviceSchema({
          name: "Laser Cutting Machine Repair & CNC Maintenance Service",
          description,
          path: paths.repair,
          areaServed: "India",
          serviceType: "Laser cutting machine repair and CNC maintenance",
        })}
      />
    </>
  );
}
