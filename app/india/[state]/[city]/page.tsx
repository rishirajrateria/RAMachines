/**
 * app/india/[state]/[city]/page.tsx — /india/[state]/[city]: one of ~170 static city
 * pages. Visual-first layout (ADR-0002 + india worker brief): hero band with icon
 * chips, an "at a glance" GlancePanel, local industries as Chips, recommended products
 * as ProductCards, "also serving nearby" as Chips, a shorter 4-step ProcessSteps
 * graphic, then the full composed prose from lib/copy/city.ts as alternating
 * two-column blocks, related pages, FAQ and a closing CTA band with the quote form.
 * Body copy itself is composed by lib/copy/city.ts (citySections) from
 * data/cities.ts; presentation-only facts (hero chips, GlancePanel, process steps)
 * come from app/india/_lib/cityVisuals.ts. This file only lays the page out.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, truncate } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema, serviceSchema, productSchema } from "@/lib/schema";
import { cities, getCity, getState, citiesByState, products } from "@/data";
import type { Product } from "@/data/types";
import { citySections, cityH1 } from "@/lib/copy/city";
import { cityHeroChips, cityGlanceFacts, cityProcessSteps } from "../../_lib/cityVisuals";
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
import CopyBlock from "../../_components/CopyBlock";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((city) => ({ state: city.stateSlug, city: city.slug }));
}

function cityTitle(name: string, stateName?: string): string {
  // A city that shares its name with its state/UT (Chandigarh, Puducherry) would otherwise
  // duplicate the state page title, so the city page takes the "dealer" keyword variant.
  if (stateName && stateName === name) return `Laser Cutting Machine Dealer in ${name} | RA Machine`;
  const withSuffix = `Laser Cutting Machine in ${name} | RA Machine`;
  if (withSuffix.length <= 60) return withSuffix;
  const noSuffix = `Laser Cutting Machine in ${name}`;
  if (noSuffix.length <= 60) return noSuffix;
  return truncate(noSuffix, 60);
}

/** ItemList JSON-LD of the machines recommended for this city (brand/sku, no price). */
function productListSchema(list: Product[]): object {
  return {
    "@type": "ItemList",
    itemListElement: list.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productSchema(product),
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCity(stateSlug, citySlug);
  const state = city ? getState(city.stateSlug) : undefined;
  if (!city || !state) return {};

  return buildMetadata({
    title: cityTitle(city.name, state.name),
    description: `Fiber laser cutting machine sales, installation, repair and operator training in ${city.name}, ${state.name}, from RA Machine, Kolkata.`,
    path: paths.city(state.slug, city.slug),
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCity(stateSlug, citySlug);
  const state = city ? getState(city.stateSlug) : undefined;
  if (!city || !state) notFound();

  const siblings = citiesByState(state.slug);
  const sections = citySections(city, state, siblings, products);
  const nearby = siblings.filter((s) => city.nearbyCitySlugs.includes(s.slug)).slice(0, 4);
  const recommended = city.recommendedProductSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  return (
    <>
      <Container>
        <Breadcrumbs
          items={[
            { name: "Home", href: paths.home },
            { name: "India", href: "/india" },
            { name: state.name, href: paths.state(state.slug) },
            { name: city.name, href: paths.city(state.slug, city.slug) },
          ]}
        />
      </Container>

      <Band tone="soft">
        <h1 className="max-w-3xl font-display text-display-lg text-ink">{cityH1(city.name, state.name)}</h1>
        <p className="mt-4 max-w-2xl text-grey-700">
          Laser cutting and robotic welding machines for {city.name}'s fabricators, delivered, installed and
          serviced from our Kolkata works.
        </p>
        <div className="mt-5">
          <Chips items={cityHeroChips(city, state)} />
        </div>
        <div className="mt-8">
          <CtaGroup context={`a machine for ${city.name}`} />
        </div>
      </Band>

      <Section tight>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <AboutBlurb
            context={`This page covers our coverage in ${city.name}: local industries, recommended machines, delivery and service from Kolkata.`}
          />
          <GlancePanel title={`${city.name} at a glance`} facts={cityGlanceFacts(city)} />
        </div>
      </Section>

      <Section eyebrow="Industries" icon="Gear" title={`Industries we serve in ${city.name}`}>
        <Chips items={city.industries.map((name) => ({ label: name, icon: "Gear" }))} />
      </Section>

      {recommended.length > 0 && (
        <Section
          tone="soft"
          eyebrow="Recommended machines"
          icon="Layers"
          title={`Machines we recommend for ${city.name}`}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Section>
      )}

      {nearby.length > 0 && (
        <Section eyebrow="Nearby coverage" icon="MapPin" title={`Also serving nearby ${state.name} cities`}>
          <Chips items={nearby.map((n) => ({ label: n.name, href: paths.city(state.slug, n.slug) }))} />
        </Section>
      )}

      <Section tone="spark" eyebrow="How delivery works" icon="Truck" title="From order to handover">
        <ProcessSteps steps={cityProcessSteps(city.name)} />
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
          <QuoteForm country={`${city.name}, ${state.name}, India`} />
        </div>
      </Section>

      <Section tight>
        <Faq items={city.faqs} />
      </Section>

      <Section tight>
        <RelatedPages
          links={[
            { name: `Laser cutting machine in ${state.name}`, href: paths.state(state.slug) },
            ...nearby.map((n) => ({ name: `Laser cutting machine in ${n.name}`, href: paths.city(state.slug, n.slug) })),
            { name: "All products", href: paths.products },
            { name: "Machine repair and AMC service", href: paths.repair },
            { name: "Operator training", href: paths.training },
          ]}
        />
      </Section>

      <CtaBand
        title={`Get a quote for ${city.name}`}
        text="Tell us your material, thickness or welding requirement, and we will recommend the right machine and confirm delivery to your location."
      />

      <JsonLd
        data={[
          localBusinessSchema({ areaServed: city.name }),
          serviceSchema({
            name: `Laser cutting machine sales, installation and repair in ${city.name}`,
            description: `Fiber laser, CO2 laser, tube laser and robotic welding machine sales, installation, AMC service and operator training in ${city.name}, ${state.name}.`,
            path: paths.city(state.slug, city.slug),
            areaServed: city.name,
          }),
          productListSchema(recommended),
        ]}
      />
    </>
  );
}
