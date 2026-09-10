/**
 * app/export/[country]/page.tsx — one static page per export country (30 total).
 * Body copy is composed by lib/copy/country.ts `countrySections`; this file only
 * handles routing, metadata, JSON-LD and layout around that copy.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CtaGroup from "@/components/ui/CtaGroup";
import LinkGrid from "@/components/ui/LinkGrid";
import SpecTable from "@/components/ui/SpecTable";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import RelatedPages from "@/components/ui/RelatedPages";
import CtaBand from "@/components/sections/CtaBand";
import ExportForm from "@/components/forms/ExportForm";
import { buildMetadata, truncate } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { organizationSchema, productSchema } from "@/lib/schema";
import { countrySections } from "@/lib/copy/country";
import { countries, getCountry, categories, products } from "@/data";

type Props = { params: Promise<{ country: string }> };

export function generateStaticParams() {
  return countries.map((c) => ({ country: c.slug }));
}

export const dynamicParams = false;

/** Root layout appends " | RA Machine" (13 chars) via its title template. */
function countryTitle(name: string): string {
  const base = `Laser Cutting Machine Exporter to ${name}`;
  return base.length + 13 <= 60 ? base : truncate(base, 60 - 13);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountry(slug);
  if (!country) return {};

  return buildMetadata({
    title: countryTitle(country.name),
    description: `RA Machine exports CE-marked, ISO 9001:2015-certified fiber laser cutting machines and robotic welding systems to ${country.name}, with pre-shipment inspection, installation, training and warranty support.`,
    path: paths.country(country.slug),
  });
}

function relatedCountries(currentSlug: string, region: string) {
  const sameRegion = countries.filter((c) => c.region === region && c.slug !== currentSlug);
  const others = countries.filter((c) => c.region !== region && c.slug !== currentSlug);
  return [...sameRegion, ...others].slice(0, 3);
}

export default async function CountryExportPage({ params }: Props) {
  const { country: slug } = await params;
  const country = getCountry(slug);
  if (!country) notFound();

  const sections = countrySections(country, products);
  const sectionProductSlugs = new Set(sections.find((s) => s.id === "sectors")?.list?.map((l) => l.href));
  const schemaProducts = products.filter((p) => sectionProductSlugs.has(paths.product(p.category, p.slug)));

  const breadcrumbItems = [
    { name: "Home", href: paths.home },
    { name: "Export", href: paths.exportHub },
    { name: country.name, href: paths.country(country.slug) },
  ];

  const related = relatedCountries(country.slug, country.region);

  return (
    <>
      <Container>
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="mt-2 max-w-3xl font-display text-display-lg text-ink">
          Laser Cutting Machine Exporter to {country.name} — Fiber Laser &amp; Robotic Welding from India
        </h1>
        <div className="mt-4 max-w-3xl">
          <AboutBlurb
            context={`This page covers export details specific to ${country.name}: manufacturing sectors we serve, shipping terms, power compatibility and the machines we supply there.`}
          />
        </div>
        <div className="mt-8">
          <CtaGroup context={`an enquiry for ${country.name}`} />
        </div>
      </Container>

      {sections.map((section) => (
        <Section key={section.id} id={section.id} title={section.h2} tight>
          <Prose>
            {section.ordered ? (
              <ol>
                {section.paragraphs.map((paragraph) => (
                  <li key={paragraph.slice(0, 32)}>{paragraph}</li>
                ))}
              </ol>
            ) : (
              section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)
            )}
          </Prose>
          {section.list && section.list.length > 0 && (
            <div className="mt-6">
              <LinkGrid links={section.list} columns={2} />
            </div>
          )}
          {section.table && section.table.length > 0 && (
            <div className="mt-6 max-w-xl">
              <SpecTable rows={section.table} caption={`Export facts — ${country.name}`} />
            </div>
          )}
        </Section>
      ))}

      <Section title="All RA Machine products" intro={`Every machine we manufacture is available for export to ${country.name}, grouped by category below.`}>
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.slug}>
              <h3 className="mb-3 font-display text-lg text-ink">{category.name}</h3>
              <LinkGrid
                links={products
                  .filter((p) => p.category === category.slug)
                  .map((p) => ({ name: p.name, href: paths.product(p.category, p.slug) }))}
                columns={2}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section tight>
        <Faq items={country.faqs} title={`Frequently asked questions — exporting to ${country.name}`} />
      </Section>

      <Section id="quote" title="Request an export quotation" tight>
        <div className="max-w-xl">
          <ExportForm country={country.name} />
        </div>
      </Section>

      <Section title="Related pages" tight>
        <RelatedPages
          links={[
            { name: "Export hub", href: paths.exportHub, hint: "All 30 export countries" },
            { name: "All products", href: paths.products },
            { name: "Contact us", href: paths.contact },
            ...related.map((c) => ({
              name: `Export to ${c.name}`,
              href: paths.country(c.slug),
              hint: c.region,
            })),
          ]}
        />
      </Section>

      <CtaBand
        title={`Ready to order for ${country.name}`}
        text="Send your cutting or welding requirement and we will issue a formal quotation with FOB Kolkata and CIF options to your nearest port."
      />

      <JsonLd
        data={[
          { ...organizationSchema(), areaServed: country.name },
          {
            "@type": "ItemList",
            itemListElement: schemaProducts.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: productSchema(p),
            })),
          },
        ]}
      />
    </>
  );
}
