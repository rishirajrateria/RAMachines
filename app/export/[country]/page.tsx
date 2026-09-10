/**
 * app/export/[country]/page.tsx — one static page per export country (30 total).
 * Body copy is composed by lib/copy/country.ts `countrySections`; this file only
 * handles routing, metadata, JSON-LD and layout around that copy.
 * ADR-0002 visual refresh: a dark hero band, an "at a glance" facts panel, a
 * "why buy from India" FeatureGrid and sector IconCards lead the page, followed by
 * a ProcessSteps graphic and a shipping/power/warranty/regulatory block.
 * ADR-0003: the 8-step export process is the same for every country, so its
 * ProcessSteps captions are the shared `exportProcessSteps` from ../copy (also used
 * on the hub) rather than a bespoke per-country narrative. The payment-terms/
 * lead-time/Incoterms/currency/voltage/warranty figures GlancePanel already shows
 * are not repeated in a SpecTable next to it, and the separate "recommended
 * machines" ProductCard grid is dropped — the sector cards above already link to
 * the same machines by name, so a second, longer card for each one added ~250
 * words without a new fact.
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
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import RelatedPages from "@/components/ui/RelatedPages";
import CtaBand from "@/components/sections/CtaBand";
import ExportForm from "@/components/forms/ExportForm";
import Band from "@/components/ui/Band";
import GlancePanel from "@/components/ui/GlancePanel";
import FeatureGrid from "@/components/ui/FeatureGrid";
import ProcessSteps from "@/components/ui/ProcessSteps";
import Chips from "@/components/ui/Chips";
import { Icon } from "@/components/ui/Icons";
import { buildMetadata, truncate } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { organizationSchema, productSchema } from "@/lib/schema";
import { countrySections } from "@/lib/copy/country";
import { countries, getCountry, categories, products } from "@/data";
import { exportProcessSteps } from "../copy";
import {
  whyIndiaTitleCycle,
  whyIndiaIconCycle,
  whyIndiaStandard,
  sectorIcon,
  countryGlanceFacts,
} from "../visuals";
import SectorCard from "../SectorCard";

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
  const byId = (id: string) => sections.find((s) => s.id === id)!;
  const sectionProductSlugs = new Set(byId("sectors").list?.map((l) => l.href));
  const schemaProducts = products.filter((p) => sectionProductSlugs.has(paths.product(p.category, p.slug)));

  const breadcrumbItems = [
    { name: "Home", href: paths.home },
    { name: "Export", href: paths.exportHub },
    { name: country.name, href: paths.country(country.slug) },
  ];

  const related = relatedCountries(country.slug, country.region);

  const whyIndiaSection = byId("why-india");
  const whyIndiaItems = whyIndiaSection.paragraphs.map((text, i) => ({
    icon: whyIndiaIconCycle[i % whyIndiaIconCycle.length],
    title: whyIndiaTitleCycle[i % whyIndiaTitleCycle.length],
    text,
  }));

  const sectorsSection = byId("sectors");
  const sectorParagraphs = sectorsSection.paragraphs.slice(1);

  const processSteps = exportProcessSteps;

  const logisticsSections = [byId("shipping"), byId("power-supply"), byId("warranty-spares"), byId("regulatory")];

  const demandSection = byId("demand");

  return (
    <>
      <Container>
        <Breadcrumbs items={breadcrumbItems} />
      </Container>

      <Band tone="dark">
        <p className="eyebrow mb-3">
          <Icon name="Flag" size={16} />
          Export to {country.name}
        </p>
        <h1 className="max-w-3xl font-display text-display-lg text-white">
          Laser Cutting Machine Exporter to {country.name} — Fiber Laser &amp; Robotic Welding from India
        </h1>
        <p className="mt-4 max-w-2xl text-white/75">
          Export documentation, installation and warranty support built around {country.name}&apos;s ports,
          power supply and manufacturing sectors.
        </p>
        <div className="mt-6">
          <Chips
            items={[
              { label: country.name, icon: "Flag" },
              { label: country.region, icon: "MapPin" },
              { label: `${country.voltage} · ${country.frequency}`, icon: "Power" },
              { label: country.currency, icon: "Currency" },
              { label: country.ports[0], icon: "Ship" },
            ]}
          />
        </div>
      </Band>

      <Section tight>
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <AboutBlurb
              context={`This page covers export details specific to ${country.name}: manufacturing sectors we serve, shipping terms, power compatibility and the machines we supply there.`}
            />
            <div className="mt-6">
              <CtaGroup context={`an enquiry for ${country.name}`} />
            </div>
          </div>
          <GlancePanel title="At a glance" facts={countryGlanceFacts(country)} />
        </div>
      </Section>

      <Section title={whyIndiaSection.h2} icon={whyIndiaSection.icon} tight>
        <FeatureGrid items={[...whyIndiaItems, ...whyIndiaStandard]} />
      </Section>

      <Section title={sectorsSection.h2} icon={sectorsSection.icon} intro={sectorsSection.paragraphs[0]}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {country.sectors.map((sector, i) => (
            <SectorCard
              key={sector.name}
              icon={sectorIcon(sector.name)}
              title={sector.name}
              text={sectorParagraphs[i]}
              products={sector.recommendedProductSlugs
                .map((s) => products.find((p) => p.slug === s))
                .filter((p): p is NonNullable<typeof p> => Boolean(p))
                .map((p) => ({ name: p.name, href: paths.product(p.category, p.slug) }))}
            />
          ))}
        </div>
      </Section>

      <Section title={`Our export process to ${country.name}, from quotation to installation`} icon="Package" tight>
        <ProcessSteps steps={processSteps} />
      </Section>

      <Section title={`Shipping, power supply and support for ${country.name}`} icon="Ship" tight>
        <div className="space-y-8">
          {logisticsSections.map((section) => (
            <div key={section.id}>
              <h3 className="mb-2 flex items-center gap-2 font-display text-lg text-ink">
                <Icon name={section.icon} size={18} className="text-spark" />
                {section.h2}
              </h3>
              <Prose>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </Prose>
            </div>
          ))}
        </div>
      </Section>

      <Section title={demandSection.h2} icon={demandSection.icon} intro={demandSection.paragraphs[0]} tight>
        <Prose>
          {demandSection.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </Prose>
      </Section>

      <Section title="All RA Machine products" intro={`Every machine we manufacture is available for export to ${country.name}, grouped by category below.`}>
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.slug}>
              <h3 className="mb-3 font-display text-lg text-ink">{category.name}</h3>
              <LinkGrid
                links={products
                  .filter((p) => p.category === category.slug)
                  .map((p) => ({ name: p.name, href: paths.product(p.category, p.slug) }))}
                variant="chips"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section tight>
        <Faq items={country.faqs} title={`Frequently asked questions — exporting to ${country.name}`} />
      </Section>

      <Section id="quote" title="Request an export quotation" icon="Mail" tight>
        <div className="max-w-xl rounded-xl border border-grey-200 bg-white p-6 shadow-card">
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
