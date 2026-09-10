/**
 * app/india/[state]/page.tsx — /india/[state]: one of 36 static state/UT
 * pages. Body copy is composed by lib/copy/state.ts (stateSections) from
 * the structured facts in data/states.ts; this file only lays out the page.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, truncate } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema, serviceSchema } from "@/lib/schema";
import { states, getState, citiesByState, products } from "@/data";
import type { State } from "@/data/types";
import { stateSections, stateH1 } from "@/lib/copy/state";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CtaGroup from "@/components/ui/CtaGroup";
import LinkGrid from "@/components/ui/LinkGrid";
import Faq from "@/components/ui/Faq";
import RelatedPages from "@/components/ui/RelatedPages";
import CtaBand from "@/components/sections/CtaBand";
import ProductCard from "@/components/cards/ProductCard";
import QuoteForm from "@/components/forms/QuoteForm";
import JsonLd from "@/components/ui/JsonLd";

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
  const sections = stateSections(state, stateCities, products);
  const neighbours = state.neighbouringStateSlugs
    .map((s) => getState(s))
    .filter((s): s is State => Boolean(s));

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
        <h1 className="mt-2 max-w-3xl font-display text-display-lg text-ink">{stateH1(state.name)}</h1>
        <div className="mt-4 max-w-3xl">
          <AboutBlurb
            context={`This page covers our coverage across ${state.name}: industries served, delivery and installation from Kolkata, service and training.`}
          />
        </div>
        <div className="mt-8">
          <CtaGroup context={`a machine for ${state.name}`} />
        </div>
      </Container>

      {sections.map((section) => (
        <Section key={section.id} id={section.id} title={section.h2} tight>
          <Prose>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </Prose>
          {section.list && section.list.length > 0 && (
            <div className="mt-6">
              <LinkGrid links={section.list} columns={2} />
            </div>
          )}
        </Section>
      ))}

      <Section
        title={`City pages across ${state.name}`}
        intro="Open a city page for its local industrial areas, recommended machines and nearby coverage."
      >
        <LinkGrid links={stateCities.map((c) => ({ name: c.name, href: paths.city(state.slug, c.slug) }))} columns={4} />
      </Section>

      <Section
        title="Our machine range"
        intro={`All eight RA Machine models are available for delivery and installation across ${state.name}.`}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
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
