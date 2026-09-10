/**
 * app/export/[country]/page.tsx — one static page per export country (30 total).
 * Body copy is composed by lib/copy/country.ts `countrySections`; this file only
 * handles routing, metadata, JSON-LD and layout around that copy.
 *
 * ADR-0005 "Liquid Glass" page anatomy (docs/adr/0005-liquid-glass.md §6):
 * hero panel (H1, one sentence, 3 inline facts) → FactStrip (5 of voltage,
 * frequency, currency, ports, lead time, warranty) → "Why India" DividedList →
 * "Sectors" DividedList + 3 product tiles → Steps (6) → a prose column
 * (shipping, warranty/spares, regulatory — voltage/frequency/currency/ports
 * are not restated here, they are already in the hero and FactStrip) → Faq(8)
 * + an export enquiry form in glass. Seven sections total.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CtaGroup from "@/components/ui/CtaGroup";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import Band from "@/components/ui/Band";
import { FactStrip, Steps, DividedList } from "@/components/ui/glass";
import ProductCard from "@/components/cards/ProductCard";
import ExportForm from "@/components/forms/ExportForm";
import { buildMetadata, truncate } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { organizationSchema, productSchema } from "@/lib/schema";
import { countrySections } from "@/lib/copy/country";
import { countries, getCountry, products } from "@/data";
import type { Country } from "@/data";
import { exportProcessSteps } from "../copy";
import { countryFacts, whyIndiaTitleCycle } from "../visuals";

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

/** The top 3 distinct products recommended across a country's sectors, in the
 * order they first appear, for the "Recommended machines" tiles. */
function topProducts(country: Country) {
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const sector of country.sectors) {
    for (const slug of sector.recommendedProductSlugs) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      slugs.push(slug);
      if (slugs.length === 3) break;
    }
    if (slugs.length === 3) break;
  }
  return slugs.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
}

export default async function CountryExportPage({ params }: Props) {
  const { country: slug } = await params;
  const country = getCountry(slug);
  if (!country) notFound();

  const sections = countrySections(country, products);
  const byId = (id: string) => sections.find((s) => s.id === id)!;

  const breadcrumbItems = [
    { name: "Home", href: paths.home },
    { name: "Export", href: paths.exportHub },
    { name: country.name, href: paths.country(country.slug) },
  ];

  const recommended = topProducts(country);

  const topZones = Array.from(new Set(country.sectors.flatMap((s) => s.zones))).slice(0, 2);
  const sectorsIntro =
    topZones.length > 1
      ? `${country.name}'s demand for cutting and welding capacity concentrates in a handful of manufacturing sectors, most visibly around ${topZones[0]} and ${topZones[1]}.`
      : `${country.name}'s demand for cutting and welding capacity concentrates in the sectors below.`;

  const proseSections = [byId("demand"), byId("shipping"), byId("warranty-spares"), byId("regulatory")];

  const schemaProducts = products.filter((p) =>
    recommended.some((r) => r.slug === p.slug) ||
    country.sectors.some((s) => s.recommendedProductSlugs[0] === p.slug),
  );

  return (
    <>
      <Container>
        <Breadcrumbs items={breadcrumbItems} />
      </Container>

      <Band tone="dark">
        <p className="eyebrow mb-3">Export to {country.name}</p>
        <h1 className="max-w-3xl font-display text-display-lg text-ink">
          Laser Cutting Machine Exporter to {country.name} — Fiber Laser &amp; Robotic Welding from India
        </h1>
        <p className="mt-4 max-w-2xl text-grey-600">
          Export documentation, installation and warranty support built around {country.name}&apos;s ports,
          power supply and manufacturing sectors.
        </p>
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-grey-600 md:text-base">
          <span>
            {country.voltage} · {country.frequency}
          </span>
          <span aria-hidden="true">·</span>
          <span>{country.currency}</span>
          <span aria-hidden="true">·</span>
          <span>{country.ports[0]}</span>
        </p>
      </Band>

      <Section>
        <div className="grid gap-6">
          <AboutBlurb
            context={`This page covers export details specific to ${country.name}: manufacturing sectors we serve, shipping terms, power compatibility and the machines we supply there.`}
          />
          <p className="max-w-prose text-grey-600">
            Machines ship by sea to {country.ports.join(", ")}; urgent spares and small consignments travel by air
            to {country.airports.join(", ")}. {country.currencyNote}
          </p>
          <CtaGroup context={`an enquiry for ${country.name}`} />
        </div>
      </Section>

      <Section title="At a glance">
        <FactStrip facts={countryFacts(country)} />
      </Section>

      <Section title="Why India">
        <DividedList
          items={country.whyIndia.map((text, i) => ({
            title: whyIndiaTitleCycle[i % whyIndiaTitleCycle.length],
            text,
          }))}
        />
      </Section>

      <Section title="Sectors" intro={sectorsIntro}>
        <DividedList
          items={country.sectors.map((sector) => {
            const productSlug = sector.recommendedProductSlugs[0];
            const product = productSlug ? products.find((p) => p.slug === productSlug) : undefined;
            return {
              title: sector.name,
              text: `${sector.zones.join(", ")} — ${sector.note}`,
              href: product ? paths.product(product.category, product.slug) : undefined,
              meta: product?.name,
            };
          })}
        />
        {recommended.length > 0 && (
          <div className="mt-10">
            <p className="eyebrow mb-4">Recommended machines</p>
            <div className="grid gap-5 sm:grid-cols-3">
              {recommended.map((product) => (
                <ProductCard key={product.slug} product={product} compact />
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section title="Export process">
        <Steps steps={exportProcessSteps} />
      </Section>

      <Section title="Shipping & terms">
        <Prose>
          {proseSections.map((section) => (
            <div key={section.id}>
              <h3>{section.h2}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          ))}
        </Prose>
      </Section>

      <Section>
        <Faq items={country.faqs} title={`Frequently asked questions — exporting to ${country.name}`} />
        <div id="quote" className="glass-strong mt-10 p-8 text-center md:p-12">
          <h2 className="section-title mx-auto max-w-2xl text-display-md">Request an export quotation</h2>
          <p className="mx-auto mt-3 max-w-2xl text-grey-600">
            Send your cutting or welding requirement and we will issue a formal quotation with FOB Kolkata and
            CIF options to your nearest port.
          </p>
          <div className="mx-auto mt-8 max-w-xl text-left">
            <ExportForm country={country.name} />
          </div>
        </div>
      </Section>

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
