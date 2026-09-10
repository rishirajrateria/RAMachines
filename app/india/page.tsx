/**
 * app/india/page.tsx — /india hub: the directory of all 36 state/UT pages
 * (ADR-0005 §6 anatomy: hero panel → DividedList of states, two columns →
 * CTA). State detail lives on /india/[state]; city detail on
 * /india/[state]/[city]. See ./copy.ts for the hero sentence and about
 * context, both short by design — the state and city pages carry the long-
 * form copy and word-count floors, not this hub.
 */
import PageHero from "@/components/layout/PageHero";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import DividedList from "@/components/ui/DividedList";
import CtaBand from "@/components/sections/CtaBand";
import JsonLd from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema, serviceSchema } from "@/lib/schema";
import { statesByRegion, states, cities } from "@/data";
import type { Region } from "@/data/types";
import { photos } from "@/lib/photos";
import { hubHeroSentence, hubAboutContext } from "./copy";

export const metadata = buildMetadata({
  title: "Laser Cutting Machine Manufacturer in India | RA Machine",
  description:
    "RA Machine designs, builds, delivers and services fiber laser cutting machines and robotic welding systems across every Indian state and union territory, from Kolkata.",
  path: "/india",
});

const regionOrder: Region[] = ["North", "South", "East", "West", "Central", "North-East"];

export default function IndiaHubPage() {
  const regions = statesByRegion();
  const stateLinks = regionOrder
    .flatMap((region) => regions[region] ?? [])
    .map((state) => ({ title: state.name, text: `${state.region} India`, href: paths.state(state.slug) }));

  return (
    <>
      <PageHero image={photos["hero-india"]} size="tall" align="start">
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "India", href: "/india" }]} />
        <p className="eyebrow mb-3">Pan-India Network</p>
        <h1 className="max-w-3xl font-display text-display-lg text-ink">
          Laser Cutting Machine &amp; Robotic Welding Supplier Across India
        </h1>
        <p className="mt-4 max-w-2xl text-grey-600">{hubHeroSentence}</p>
      </PageHero>

      <Section tight>
        <AboutBlurb context={hubAboutContext} />
      </Section>

      <Section
        eyebrow="Directory"
        title="States"
        intro={`${states.length} state and union territory pages, and ${cities.length} city pages within them. Open a state for its industries, delivery process and cities.`}
      >
        <DividedList items={stateLinks} columns={2} />
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
