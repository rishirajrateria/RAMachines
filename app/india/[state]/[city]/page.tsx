/**
 * app/india/[state]/[city]/page.tsx — /india/[state]/[city]: one of ~170 static
 * city pages. ADR-0005 §6 anatomy: hero panel (H1, one sentence, three tiny
 * facts) → FactStrip → industries DividedList + up to 3 recommended product
 * tiles → delivery Steps → nearby-cities DividedList → prose column
 * (lib/copy/city.ts, .prose-calm, ≥ 700 words) → Faq → CTA panel with the
 * QuoteForm. Presentation-only facts come from app/india/_lib/cityVisuals.ts;
 * the composed prose comes from lib/copy/city.ts. This file only lays the
 * page out — no fact is shown twice.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, truncate } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema, serviceSchema, productSchema } from "@/lib/schema";
import { cities, getCity, getState, citiesByState, products } from "@/data";
import type { Product } from "@/data/types";
import { citySections, cityH1 } from "@/lib/copy/city";
import {
  cityHeroFacts,
  cityFactStripFacts,
  cityIndustryItems,
  cityProductTiles,
  citySteps,
  cityNearbyLinks,
} from "../../_lib/cityVisuals";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Button from "@/components/ui/Button";
import Faq from "@/components/ui/Faq";
import ProductCard from "@/components/cards/ProductCard";
import QuoteForm from "@/components/forms/QuoteForm";
import JsonLd from "@/components/ui/JsonLd";
import { FactStrip, Steps, DividedList, ImageSlot } from "@/components/ui/glass";
import { photos } from "@/lib/photos";

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
  const sections = citySections(city, state);
  const nearby = siblings.filter((s) => city.nearbyCitySlugs.includes(s.slug)).slice(0, 6);
  const productTiles = cityProductTiles(city, products);

  return (
    <>
      <PageHero image={photos["hero-city"]} align="start">
        <Breadcrumbs
          items={[
            { name: "Home", href: paths.home },
            { name: "India", href: "/india" },
            { name: state.name, href: paths.state(state.slug) },
            { name: city.name, href: paths.city(state.slug, city.slug) },
          ]}
        />
        <p className="eyebrow mb-3">{state.name}</p>
        <h1 className="max-w-3xl font-display text-display-lg text-ink">{cityH1(city.name, state.name)}</h1>
        <p className="mt-4 max-w-2xl text-grey-600">
          Laser cutting and robotic welding machines for {city.name}&apos;s fabricators, delivered, installed and
          serviced from our Kolkata works.
        </p>
        <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-grey-500">
          {cityHeroFacts(city, state).map((fact) => (
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
      </PageHero>

      <Section tight>
        <AboutBlurb
          context={`This page covers our coverage in ${city.name}: local industries, recommended machines, delivery and service from Kolkata.`}
        />
      </Section>

      <Section eyebrow="At a glance" title="Coverage">
        <FactStrip facts={cityFactStripFacts(city)} />
      </Section>

      <Section eyebrow="Industries" title="Industries" intro={`Industries we regularly serve in ${city.name}.`}>
        <DividedList items={cityIndustryItems(city)} />
        {productTiles.length > 0 && (
          <>
            <p className="mt-10 text-sm text-grey-600">Machines we recommend most often for {city.name}:</p>
            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              {productTiles.map((product) => (
                <ProductCard key={product.slug} product={product} compact />
              ))}
            </div>
          </>
        )}
      </Section>

      <Section eyebrow="Delivery" title="Delivery">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <Steps steps={citySteps(city.name)} />
          <ImageSlot image={photos["slot-engineer-service"]} aspect="4/3" label="Photo: engineer on-site service" />
        </div>
      </Section>

      {nearby.length > 0 && (
        <Section eyebrow="Nearby" title="Nearby cities" intro={`Also serving nearby ${state.name} cities.`}>
          <DividedList items={cityNearbyLinks(nearby, state.slug)} columns={2} />
        </Section>
      )}

      <Section eyebrow="In depth" title="Notes">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <ImageSlot image={photos["slot-installation"]} aspect="4/3" label="Photo: machine installation" />
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
        </div>
      </Section>

      <Section tight>
        <Faq items={city.faqs} />
      </Section>

      <Section id="quote" eyebrow="Get in touch" title="Request a quote">
        <div className="glass-strong p-8 md:p-12">
          <p className="max-w-prose text-grey-600">
            Tell us your material, thickness or welding requirement, and we will recommend the right machine and
            confirm delivery to {city.name}.
          </p>
          <div className="mt-6 max-w-xl">
            <QuoteForm country={`${city.name}, ${state.name}, India`} />
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          localBusinessSchema({ areaServed: city.name }),
          serviceSchema({
            name: `Laser cutting machine sales, installation and repair in ${city.name}`,
            description: `Fiber laser, CO2 laser, tube laser and robotic welding machine sales, installation, AMC service and operator training in ${city.name}, ${state.name}.`,
            path: paths.city(state.slug, city.slug),
            areaServed: city.name,
          }),
          productListSchema(productTiles),
        ]}
      />
    </>
  );
}
