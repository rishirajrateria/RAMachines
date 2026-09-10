/**
 * app/india/[state]/[city]/page.tsx — /india/[state]/[city]: one of ~170
 * static city pages. Body copy is composed by lib/copy/city.ts
 * (citySections) from the structured facts in data/cities.ts; this file
 * only lays out the page.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, truncate } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema, serviceSchema, productSchema } from "@/lib/schema";
import { cities, getCity, getState, citiesByState, products, categories, productsByCategory } from "@/data";
import type { Product } from "@/data/types";
import { citySections, cityH1 } from "@/lib/copy/city";
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
import QuoteForm from "@/components/forms/QuoteForm";
import JsonLd from "@/components/ui/JsonLd";

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
        <h1 className="mt-2 max-w-3xl font-display text-display-lg text-ink">{cityH1(city.name, state.name)}</h1>
        <div className="mt-4 max-w-3xl">
          <AboutBlurb
            context={`This page covers our coverage in ${city.name}: local industries, recommended machines, delivery and service from Kolkata.`}
          />
        </div>
        <div className="mt-8">
          <CtaGroup context={`a machine for ${city.name}`} />
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
        title="Our machine range"
        intro={`All eight RA Machine models are available for delivery and installation in ${city.name}, grouped by category below.`}
      >
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.slug}>
              <h3 className="mb-3 font-display text-lg text-ink">{category.name}</h3>
              <LinkGrid
                links={productsByCategory(category.slug).map((product) => ({
                  name: product.name,
                  href: paths.product(product.category, product.slug),
                }))}
                columns={2}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Repair and training"
        intro={`Machine repair, AMC service and operator training are available to ${city.name} customers, delivered on-site or coordinated from our Kolkata headquarters.`}
        tight
      >
        <LinkGrid
          links={[
            { name: "Machine repair & maintenance service", href: paths.repair },
            { name: "Operator training", href: paths.training },
          ]}
          columns={2}
        />
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
