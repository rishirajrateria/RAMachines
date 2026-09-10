import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { indiaIndex, type IndiaIndexEntry } from "@/data/india-index";
import { repairFaqs } from "@/data/faqs";
import type { Region } from "@/data/types";
import Container from "@/components/ui/Container";
import Band from "@/components/ui/Band";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import SectionHeading from "@/components/ui/SectionHeading";
import GlancePanel from "@/components/ui/GlancePanel";
import ProcessSteps from "@/components/ui/ProcessSteps";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Chips from "@/components/ui/Chips";
import CtaGroup from "@/components/ui/CtaGroup";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import { Icon } from "@/components/ui/Icons";
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
  heroLead,
  heroChips,
  repairProcessSteps,
  faultIcons,
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
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Machine Repair", href: paths.repair }]} />
      </Container>

      <Band tone="dark">
        <p className="eyebrow mb-3">
          <Icon name="Wrench" size={16} />
          Repair &amp; Maintenance
        </p>
        <h1 className="max-w-4xl font-display text-display-lg text-white">
          Laser Cutting Machine Repair &amp; CNC Maintenance Service in India
        </h1>
        <p className="mt-4 max-w-prose text-white/75">{heroLead}</p>
        <div className="mt-6">
          <Chips items={heroChips} />
        </div>
        <div className="mt-8">
          <CtaGroup context="machine repair" />
        </div>
      </Band>

      <Container className="pb-14 pt-12 md:pb-20 md:pt-16">
        <GlancePanel
          title="Service at a glance"
          facts={[
            { icon: "Truck", label: "On-site response", value: site.service.responseTime },
            { icon: "Headset", label: "Remote response", value: site.service.remoteResponseTime },
            { icon: "Badge", label: "Brands covered", value: "All major brands" },
            { icon: "Award", label: "AMC tiers", value: "Basic, Standard, Premium" },
          ]}
        />
      </Container>

      <Band tone="soft">
        <SectionHeading eyebrow="Process" icon="ArrowRight" title="How a repair visit runs" />
        <div className="mt-10">
          <ProcessSteps steps={repairProcessSteps} />
        </div>
      </Band>

      <Container className="space-y-14 pb-14 pt-14 md:space-y-16 md:pb-20 md:pt-16">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-steel-soft text-steel">
            <Icon name="Wrench" size={28} />
          </span>
          <div className="space-y-4 max-w-prose text-grey-700">
            {introParagraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-spark-soft text-spark">
            <Icon name="Truck" size={28} />
          </span>
          <div>
            <h2 className="section-title text-display-md">Pan-India on-site service, dispatched from Kolkata</h2>
            <p className="mt-4 max-w-prose text-grey-700">{onSiteParagraph}</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-steel-soft text-steel">
            <Icon name="Headset" size={28} />
          </span>
          <div>
            <h2 className="section-title text-display-md">Remote diagnostics — often the fastest fix</h2>
            <p className="mt-4 max-w-prose text-grey-700">{remoteDiagnosticsParagraph}</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-spark-soft text-spark">
            <Icon name="Package" size={28} />
          </span>
          <div>
            <h2 className="section-title text-display-md">Spares availability</h2>
            <p className="mt-4 max-w-prose text-grey-700">{sparesParagraph}</p>
          </div>
        </div>
      </Container>

      <Band tone="soft">
        <SectionHeading eyebrow="AMC" icon="Award" title="Annual Maintenance Contracts (AMC)" intro={amcIntro} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {amcTierIcons.map((tier) => (
            <div
              key={tier.key}
              className={`rounded-xl border bg-white p-6 shadow-card ${tier.recommended ? "border-spark" : "border-grey-200"}`}
            >
              {tier.recommended && (
                <span className="mb-3 inline-block rounded-full bg-spark px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-steel-soft text-steel">
                <Icon name={tier.icon} size={22} />
              </span>
              <h3 className="mt-4 font-display text-lg text-ink">{tier.name}</h3>
              <ul className="mt-4 space-y-3">
                {amcRows.map((row) => (
                  <li key={row.feature} className="flex items-start gap-2 text-sm text-grey-700">
                    <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-steel" />
                    <span>
                      <span className="font-semibold text-ink">{row.feature}:</span> {row[tier.key]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Band>

      <Container className="pb-14 pt-14 md:pb-20 md:pt-16">
        <SectionHeading eyebrow="Diagnostics" icon="Gauge" title="Common faults we diagnose and fix" />
        <div className="mt-8">
          <FeatureGrid
            columns={4}
            items={commonFaults.map((fault) => ({
              icon: faultIcons[fault.title] ?? "Wrench",
              title: fault.title,
              text: fault.body,
            }))}
          />
        </div>
      </Container>

      <Container className="pb-14 md:pb-20">
        <SectionHeading eyebrow="Commitment" icon="Clock" title="Our response-time commitment" />
        <p className="mt-4 max-w-prose text-grey-700">
          {responseTimeParagraph(site.service.responseTime, site.service.remoteResponseTime)}
        </p>
      </Container>

      <Band tone="spark">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Book a repair" icon="Calendar" title="Book a Repair" />
            <p className="mt-4 max-w-prose text-grey-700">{bookIntro}</p>
            <div className="mt-6">
              <AboutBlurb context="Our service engineers repair and maintain laser cutting and robotic welding equipment of every major brand, pan-India, from our Kolkata headquarters." />
            </div>
          </div>
          <div id="book" className="rounded-xl border border-grey-200 bg-white p-6 shadow-card">
            <RepairForm />
          </div>
        </div>
      </Band>

      <Container className="pb-14 pt-14 md:pb-20 md:pt-16">
        <Faq items={repairFaqs} title="Frequently asked questions about machine repair" />
      </Container>

      <Section title="Laser machine repair across India" tight>
        <p className="max-w-prose text-grey-700">{stateLinksIntro}</p>
        <div className="mt-8 space-y-8">
          {REGION_ORDER.map((region) => {
            const entries = statesByRegion[region];
            if (!entries.length) return null;
            return (
              <div key={region}>
                <p className="eyebrow mb-3">
                  <Icon name="MapPin" size={16} />
                  {region} India
                </p>
                <Chips
                  items={entries.map((entry) => ({
                    label: `Laser machine repair in ${entry.name}`,
                    href: paths.state(entry.slug),
                  }))}
                />
              </div>
            );
          })}
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
