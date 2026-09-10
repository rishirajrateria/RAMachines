/**
 * app/india/[state]/page.tsx — /india/[state]: one of 36 static state/UT pages.
 * ADR-0005 §6 anatomy: hero panel (H1, one sentence, three tiny facts) →
 * FactStrip → "Industries" DividedList + 3 product tiles → delivery Steps →
 * cities DividedList → prose column (lib/copy/state.ts, .prose-calm, ≥ 900
 * words) → Faq → CTA panel with the QuoteForm. Presentation-only facts (hero
 * facts, FactStrip, industry rows, product tiles, steps, city links) come
 * from app/india/_lib/stateVisuals.ts; the composed prose comes from
 * lib/copy/state.ts. This file only lays the page out — no fact is shown
 * twice.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, truncate } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema, serviceSchema } from "@/lib/schema";
import { states, getState, citiesByState, products } from "@/data";
import { stateSections, stateH1 } from "@/lib/copy/state";
import {
  stateHeroFacts,
  stateFactStripFacts,
  stateIndustryItems,
  stateProductTiles,
  stateSteps,
  stateCityLinks,
} from "../_lib/stateVisuals";
import Container from "@/components/ui/Container";
import Band from "@/components/ui/Band";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Button from "@/components/ui/Button";
import Faq from "@/components/ui/Faq";
import ProductCard from "@/components/cards/ProductCard";
import QuoteForm from "@/components/forms/QuoteForm";
import JsonLd from "@/components/ui/JsonLd";
import { FactStrip, Steps, DividedList } from "@/components/ui/glass";

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
  const industryItems = stateIndustryItems(state, products);
  const productTiles = stateProductTiles(state, products);

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

      <Band tone="dark">
        <h1 className="max-w-3xl font-display text-display-lg text-ink">{stateH1(state.name)}</h1>
        <p className="mt-4 max-w-2xl text-grey-600">
          Fiber laser cutting machines, tube laser machines and robotic MIG/MAG welding systems for {state.name}&apos;s
          fabricators, built, delivered and serviced from our Kolkata works.
        </p>
        <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-grey-500">
          {stateHeroFacts(state, stateCities).map((fact) => (
            <span key={fact.label}>
              <strong className="text-ink">{fact.value}</strong> {fact.label}
            </span>
          ))}
        </p>
        <div className="mt-6">
          <Button href="#quote" variant="solid" icon="ArrowRight">
            Request a Quote
          </Button>
        </div>
      </Band>

      <Section tight>
        <AboutBlurb
          context={`This page covers our coverage across ${state.name}: industries served, delivery and installation from Kolkata, service and training.`}
        />
      </Section>

      <Section eyebrow="At a glance" title="Coverage">
        <FactStrip facts={stateFactStripFacts(state, stateCities)} />
      </Section>

      <Section
        eyebrow="Industries"
        title="Industries"
        intro="Each industry paired with its clusters and the machine our sales engineers most often recommend."
      >
        <DividedList items={industryItems} />
        {productTiles.length > 0 && (
          <>
            <p className="mt-10 text-sm text-grey-600">Machines we recommend most often across {state.name}:</p>
            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              {productTiles.map((product) => (
                <ProductCard key={product.slug} product={product} compact />
              ))}
            </div>
          </>
        )}
      </Section>

      <Section eyebrow="Delivery" title="Delivery">
        <Steps steps={stateSteps(state.name)} />
      </Section>

      <Section eyebrow="City pages" title="Cities" intro={`Every city page across ${state.name}.`}>
        <DividedList items={stateCityLinks(stateCities, state.slug)} columns={2} />
      </Section>

      <Section eyebrow="In depth" title="Notes">
        <div className="prose-calm">
          {sections.map((section) => (
            <div key={section.id}>
              <h3>{section.h3}</h3>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section tight>
        <Faq items={state.faqs} />
      </Section>

      <Section id="quote" eyebrow="Get in touch" title="Request a quote">
        <div className="glass-strong p-8 md:p-12">
          <p className="max-w-prose text-grey-600">
            Tell us your material, thickness or welding requirement, and we will recommend the right machine and
            confirm delivery to {state.name}.
          </p>
          <div className="mt-6 max-w-xl">
            <QuoteForm country={`${state.name}, India`} />
          </div>
        </div>
      </Section>

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
