/**
 * app/india/[state]/page.tsx — /india/[state]: one of 36 static state/UT pages.
 * Visual-first layout (ADR-0002 + india worker brief): hero band with icon chips, an
 * "at a glance" GlancePanel, the key industries as a FeatureGrid of IconCards (each
 * with a recommended-machine chip), city pages as Chips, top products as ProductCards
 * (+ Chips for the rest), a ProcessSteps delivery graphic, then the full composed prose
 * from lib/copy/state.ts as alternating two-column blocks, related pages, FAQ and a
 * closing CTA band with the quote form. Body copy itself is composed by
 * lib/copy/state.ts (stateSections) from data/states.ts; presentation-only facts
 * (hero chips, GlancePanel, industry cards, process steps) come from
 * app/india/_lib/stateVisuals.ts. This file only lays the page out.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, truncate } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema, serviceSchema } from "@/lib/schema";
import { states, getState, citiesByState, products } from "@/data";
import type { State } from "@/data/types";
import { stateSections, stateH1 } from "@/lib/copy/state";
import { stateHeroChips, stateGlanceFacts, stateIndustryItems, stateProcessSteps } from "../_lib/stateVisuals";
import Container from "@/components/ui/Container";
import Band from "@/components/ui/Band";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CtaGroup from "@/components/ui/CtaGroup";
import Chips from "@/components/ui/Chips";
import GlancePanel from "@/components/ui/GlancePanel";
import ProcessSteps from "@/components/ui/ProcessSteps";
import Faq from "@/components/ui/Faq";
import RelatedPages from "@/components/ui/RelatedPages";
import CtaBand from "@/components/sections/CtaBand";
import ProductCard from "@/components/cards/ProductCard";
import QuoteForm from "@/components/forms/QuoteForm";
import JsonLd from "@/components/ui/JsonLd";
import CopyBlock from "../_components/CopyBlock";
import IndustryCard from "../_components/IndustryCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return states.map((state) => ({ state: state.slug }));
}

function stateTitle(name: string): string {
  const withSuffix = `Laser Cutting Machine in ${name} | RA Machine`;
  if (withSuffix.length <= 60) return withSuffix;
  const noSuffix = `Laser Cutting Machine in ${name}`;
  if (noSuffix.length <= 60) return noSuffix;
  return truncate(noSuffix, 60);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) return {};

  return buildMetadata({
    title: stateTitle(state.name),
    description: `Fiber laser cutting machine supplier and dealer in ${state.name}: delivery, installation, AMC repair service and operator training from RA Machine, Kolkata.`,
    path: paths.state(state.slug),
  });
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getState(slug);
  if (!state) notFound();

  const stateCities = citiesByState(state.slug);
  const sections = stateSections(state);
  const neighbours = state.neighbouringStateSlugs
    .map((s) => getState(s))
    .filter((s): s is State => Boolean(s));
  const featuredProducts = products.slice(0, 4);
  const otherProducts = products.slice(4);
  const industryItems = stateIndustryItems(state, products);

  return (
    <>
      <Container>
        <Breadcrumbs
          items={[
            { name: "Home", href: paths.home },
            { name: "India", href: "/india" },
            { name: state.name, href: paths.state(state.slug) },
          ]}
        />
      </Container>

      <Band tone="soft">
        <h1 className="max-w-3xl font-display text-display-lg text-ink">{stateH1(state.name)}</h1>
        <p className="mt-4 max-w-2xl text-grey-700">
          Fiber laser cutting machines, tube laser machines and robotic MIG/MAG welding systems for {state.name}'s
          fabricators, built, delivered and serviced from our Kolkata works.
        </p>
        <div className="mt-5">
          <Chips items={stateHeroChips(state, stateCities)} />
        </div>
        <div className="mt-8">
          <CtaGroup context={`a machine for ${state.name}`} />
        </div>
      </Band>

      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <AboutBlurb
            context={`This page covers our coverage across ${state.name}: industries served, delivery and installation from Kolkata, service and training.`}
          />
          <GlancePanel title={`${state.name} at a glance`} facts={stateGlanceFacts(state, stateCities)} />
        </div>
      </Section>

      <Section
        eyebrow="Industries"
        icon="Gear"
        title={`Key manufacturing industries in ${state.name}`}
        intro="Each industry below is paired with the RA Machine model our sales engineers most often recommend for it."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industryItems.map((item) => (
            <IndustryCard key={item.title} icon={item.icon} title={item.title} text={item.text} machines={item.machines} />
          ))}
        </div>
      </Section>

      <Section
        tone="soft"
        eyebrow="City pages"
        icon="MapPin"
        title={`City pages across ${state.name}`}
        intro="Open a city page for its local industrial areas, recommended machines and nearby coverage."
      >
        <Chips items={stateCities.map((c) => ({ label: c.name, href: paths.city(state.slug, c.slug) }))} />
      </Section>

      <Section
        eyebrow="Our machine range"
        icon="Layers"
        title="Machines available across the state"
        intro={`All eight RA Machine models are available for delivery and installation across ${state.name}.`}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        {otherProducts.length > 0 && (
          <div className="mt-6">
            <Chips
              items={otherProducts.map((p) => ({ label: p.name, href: paths.product(p.category, p.slug), icon: "ArrowRight" }))}
            />
          </div>
        )}
      </Section>

      <Section tone="spark" eyebrow="How delivery works" icon="Truck" title="From order to handover">
        <ProcessSteps steps={stateProcessSteps(state.name)} />
      </Section>

      <Section tight>
        <div className="space-y-14">
          {sections.map((section, i) => (
            <CopyBlock key={section.id} section={section} reverse={i % 2 === 1} />
          ))}
        </div>
      </Section>

      <Section id="quote" title="Request a quote" tight>
        <div className="max-w-xl">
          <QuoteForm country={`${state.name}, India`} />
        </div>
      </Section>

      <Section tight>
        <Faq items={state.faqs} />
      </Section>

      <Section tight>
        <RelatedPages
          links={[
            ...neighbours.map((n) => ({ name: `Laser cutting machine in ${n.name}`, href: paths.state(n.slug) })),
            { name: "Machine repair and AMC service", href: paths.repair },
            { name: "Operator training", href: paths.training },
            { name: "All products", href: paths.products },
          ]}
        />
      </Section>

      <CtaBand
        title={`Get a quote for ${state.name}`}
        text="Tell us your material, thickness or welding requirement, and we will recommend the right machine and confirm delivery to your location."
      />

      <JsonLd
        data={[
          localBusinessSchema({ areaServed: state.name }),
          serviceSchema({
            name: `Laser cutting machine sales, installation and repair in ${state.name}`,
            description: `Fiber laser, CO2 laser, tube laser and robotic welding machine sales, installation, AMC service and operator training across ${state.name}.`,
            path: paths.state(state.slug),
            areaServed: state.name,
          }),
        ]}
      />
    </>
  );
}
