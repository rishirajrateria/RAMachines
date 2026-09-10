/**
 * app/india/page.tsx — /india hub: visual-first directory of all 36 state/UT pages.
 * Hero band with a stylised India illustration and icon chips, then a region-card
 * directory (IconCard-style cards, each holding a Chips list of its states — this
 * replaces the old plain LinkGrid so the whole directory reads as cards, not a wall of
 * links), then the original hub copy (unchanged text) laid out as two alternating
 * two-column blocks, then a closing CTA band. State-specific detail lives on
 * /india/[state] (see ./[state]/page.tsx); city detail on /india/[state]/[city].
 */
import Image from "next/image";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CtaGroup from "@/components/ui/CtaGroup";
import Band from "@/components/ui/Band";
import Section from "@/components/ui/Section";
import Chips from "@/components/ui/Chips";
import CtaBand from "@/components/sections/CtaBand";
import JsonLd from "@/components/ui/JsonLd";
import type { IconName } from "@/components/ui/Icons";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema, serviceSchema } from "@/lib/schema";
import { statesByRegion, states, cities } from "@/data";
import type { Region } from "@/data/types";
import { hubIntro, hubDelivery } from "./copy";
import CopyBlock, { type CopySection } from "./_components/CopyBlock";
import RegionCard from "./_components/RegionCard";

export const metadata = buildMetadata({
  title: "Laser Cutting Machine Manufacturer in India | RA Machine",
  description:
    "RA Machine designs, builds, delivers and services fiber laser cutting machines and robotic welding systems across every Indian state and union territory, from Kolkata.",
  path: "/india",
});

const regionOrder: Region[] = ["North", "South", "East", "West", "Central", "North-East"];
const regionIcons: Record<Region, IconName> = {
  North: "Building",
  South: "Factory",
  East: "Ship",
  West: "Truck",
  Central: "Gear",
  "North-East": "Layers",
};

const copyBlocks: CopySection[] = [
  {
    id: "coverage",
    icon: "Globe",
    eyebrow: "How we cover India",
    h2: "A dedicated page for every state and every industrial city",
    paragraphs: hubIntro,
    aside: { kind: "icon" },
  },
  {
    id: "delivery",
    icon: "Truck",
    eyebrow: "Delivery, service & training",
    h2: "How pan-India delivery, service and training work",
    paragraphs: hubDelivery,
    aside: {
      kind: "facts",
      facts: [
        { icon: "Truck", label: "Dispatch point", value: "Kolkata works" },
        { icon: "Headset", label: "Service model", value: "Remote + on-site" },
        { icon: "GraduationCap", label: "Training", value: "On-site + Kolkata centre" },
      ],
    },
  },
];

export default function IndiaHubPage() {
  const regions = statesByRegion();
  const regionEntries = regionOrder
    .map((region) => [region, regions[region]] as const)
    .filter(([, list]) => list.length > 0);
  const heroImage = { src: "/illustrations/about/india-reach.svg", alt: "Stylised map of India marking RA Machine's pan-India delivery network", width: 1200, height: 750 };

  return (
    <>
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "India", href: "/india" }]} />
      </Container>

      <Band tone="soft">
        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="max-w-3xl font-display text-display-lg text-ink">
              Laser Cutting Machine &amp; Robotic Welding Supplier Across India
            </h1>
            <p className="mt-4 max-w-xl text-grey-700">
              One dedicated page for every Indian state, union territory and industrial city we deliver, install and
              service in — built, tested and dispatched from our Kolkata works.
            </p>
            <div className="mt-5">
              <Chips
                items={[
                  { label: `${states.length} states & UTs`, icon: "Building" },
                  { label: `${cities.length} city pages`, icon: "MapPin" },
                  { label: "Pan-India delivery from Kolkata", icon: "Truck" },
                ]}
              />
            </div>
            <div className="mt-8">
              <CtaGroup context="a machine for your state" />
            </div>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl shadow-card">
            <Image src={heroImage.src} alt={heroImage.alt} width={heroImage.width} height={heroImage.height} className="h-full w-full object-cover" priority />
          </div>
        </div>
      </Band>

      <Section tight>
        <AboutBlurb context="This page lists every Indian state and union territory we deliver, install and service machines in, and the cities within each where we maintain a dedicated page." />
      </Section>

      <Section
        eyebrow="Directory"
        icon="MapPin"
        title="States and union territories we serve"
        intro="36 state and union territory pages, grouped below by region. Open a state page for its industries, delivery process and full list of city pages."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regionEntries.map(([region, list]) => (
            <RegionCard
              key={region}
              icon={regionIcons[region]}
              region={region}
              states={list.map((s) => ({ name: s.name, href: paths.state(s.slug) }))}
            />
          ))}
        </div>
      </Section>

      <Section tone="soft" eyebrow="Nationwide coverage" icon="Sparkles" title="How we work across India">
        <div className="space-y-14">
          {copyBlocks.map((section, i) => (
            <CopyBlock key={section.id} section={section} reverse={i % 2 === 1} />
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
