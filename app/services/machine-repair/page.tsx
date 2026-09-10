import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { indiaIndex } from "@/data/india-index";
import { repairFaqs } from "@/data/faqs";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CtaGroup from "@/components/ui/CtaGroup";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import LinkGrid from "@/components/ui/LinkGrid";
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
} from "./copy";

const description =
  "On-site pan-India laser cutting machine repair and CNC maintenance, engineers dispatched from Kolkata, remote diagnostics, spares and AMC plans for fiber, CO2, tube laser and robotic welding equipment.";

export const metadata: Metadata = buildMetadata({
  title: "Laser Cutting Machine Repair & CNC Maintenance India",
  description,
  path: paths.repair,
});

export default function MachineRepairPage() {
  const stateLinks = indiaIndex.map((s) => ({
    name: `Laser machine repair in ${s.name}`,
    href: paths.state(s.slug),
  }));

  return (
    <>
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Machine Repair", href: paths.repair }]} />
        <h1 className="mt-4 max-w-4xl font-display text-display-lg text-ink">
          Laser Cutting Machine Repair &amp; CNC Maintenance Service in India
        </h1>
        <div className="mt-6 max-w-prose">
          <AboutBlurb context="Our service engineers repair and maintain laser cutting and robotic welding equipment of every major brand, pan-India, from our Kolkata headquarters." />
        </div>
        <div className="mt-8 space-y-4 max-w-prose text-grey-700">
          {introParagraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <div className="mt-8">
          <CtaGroup context="machine repair" />
        </div>
      </Section>

      <Section title="Pan-India on-site service, dispatched from Kolkata" tight>
        <p className="max-w-prose text-grey-700">{onSiteParagraph}</p>
      </Section>

      <Section title="Remote diagnostics — often the fastest fix" tight>
        <p className="max-w-prose text-grey-700">{remoteDiagnosticsParagraph}</p>
      </Section>

      <Section title="Spares availability" tight>
        <p className="max-w-prose text-grey-700">{sparesParagraph}</p>
      </Section>

      <Section title="Annual Maintenance Contracts (AMC)" tight>
        <p className="max-w-prose text-grey-700">{amcIntro}</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-grey-300 text-left">
                <th scope="col" className="py-3 pr-4 font-semibold text-ink">
                  Feature
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold text-ink">
                  Basic
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold text-ink">
                  Standard
                </th>
                <th scope="col" className="py-3 font-semibold text-ink">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {amcRows.map((row) => (
                <tr key={row.feature} className="border-b border-grey-200 align-top">
                  <th scope="row" className="py-3 pr-4 text-left font-semibold text-ink">
                    {row.feature}
                  </th>
                  <td className="py-3 pr-4 text-grey-700">{row.basic}</td>
                  <td className="py-3 pr-4 text-grey-700">{row.standard}</td>
                  <td className="py-3 text-grey-700">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Common faults we diagnose and fix" tight>
        <div className="grid gap-8 md:grid-cols-2">
          {commonFaults.map((fault) => (
            <div key={fault.title}>
              <h3 className="font-display text-lg text-ink">{fault.title}</h3>
              <p className="mt-2 max-w-prose text-sm text-grey-700">{fault.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Our response-time commitment" tight>
        <p className="max-w-prose text-grey-700">
          {responseTimeParagraph(site.service.responseTime, site.service.remoteResponseTime)}
        </p>
      </Section>

      <Section id="book" title="Book a Repair" tight>
        <p className="max-w-prose text-grey-700">{bookIntro}</p>
        <div className="mt-6 max-w-xl">
          <RepairForm />
        </div>
      </Section>

      <Section tight>
        <Faq items={repairFaqs} title="Frequently asked questions about machine repair" />
      </Section>

      <Section title="Laser machine repair across India" tight>
        <p className="max-w-prose text-grey-700">{stateLinksIntro}</p>
        <div className="mt-6">
          <LinkGrid links={stateLinks} columns={4} />
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
