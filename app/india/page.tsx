/**
 * app/india/page.tsx — /india hub: short intro plus a directory of all 36
 * state/UT pages grouped by region. State-specific detail lives on
 * /india/[state] (see ./[state]/page.tsx); city detail on
 * /india/[state]/[city] (see ./[state]/[city]/page.tsx).
 */
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CtaGroup from "@/components/ui/CtaGroup";
import LinkGrid from "@/components/ui/LinkGrid";
import CtaBand from "@/components/sections/CtaBand";
import JsonLd from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema, serviceSchema } from "@/lib/schema";
import { statesByRegion } from "@/data";
import type { Region } from "@/data/types";
import { hubIntro, hubDelivery } from "./copy";

export const metadata = buildMetadata({
  title: "Laser Cutting Machine Manufacturer in India | RA Machine",
  description:
    "RA Machine designs, builds, delivers and services fiber laser cutting machines and robotic welding systems across every Indian state and union territory, from Kolkata.",
  path: "/india",
});

const regionOrder: Region[] = ["North", "South", "East", "West", "Central", "North-East"];

export default function IndiaHubPage() {
  const regions = statesByRegion();
  const regionEntries = regionOrder
    .map((region) => [region, regions[region]] as const)
    .filter(([, list]) => list.length > 0);

  return (
    <>
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "India", href: "/india" }]} />
        <h1 className="mt-2 max-w-3xl font-display text-display-lg text-ink">
          Laser Cutting Machine &amp; Robotic Welding Supplier Across India
        </h1>
        <div className="mt-4 max-w-3xl">
          <AboutBlurb context="This page lists every Indian state and union territory we deliver, install and service machines in, and the cities within each where we maintain a dedicated page." />
        </div>
        <div className="mt-8">
          <CtaGroup context="a machine for your state" />
        </div>
      </Container>

      <Section title="Manufacturing and delivering across every Indian state" tight>
        <Prose>
          {hubIntro.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </Prose>
      </Section>

      <Section title="How delivery, service and training work nationwide" tight>
        <Prose>
          {hubDelivery.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </Prose>
      </Section>

      <Section
        title="States and union territories we serve"
        intro="36 state and union territory pages, grouped below by region. Open a state page for its industries, delivery process and full list of city pages."
      >
        <div className="space-y-10">
          {regionEntries.map(([region, list]) => (
            <div key={region}>
              <h3 className="mb-3 font-display text-lg text-ink">{region}</h3>
              <LinkGrid links={list.map((s) => ({ name: s.name, href: paths.state(s.slug) }))} columns={4} />
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Find the right machine for your state"
        text="Tell us your material, thickness or welding requirement and your location, and we will recommend a machine and confirm delivery and installation timelines."
      />

      <JsonLd
        data={[
          localBusinessSchema({ areaServed: "India" }),
          serviceSchema({
            name: "Laser cutting machine sales, installation and service across India",
            description: "Pan-India delivery, installation, AMC service and operator training for fiber laser, CO2 laser, tube laser and robotic welding machines, dispatched from Kolkata.",
            path: "/india",
            areaServed: "India",
          }),
        ]}
      />
    </>
  );
}
