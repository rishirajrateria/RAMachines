import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { productSchema } from "@/lib/schema";
import { products, getProduct } from "@/data/products";
import { categories } from "@/data/categories";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Prose from "@/components/ui/Prose";
import SpecTable from "@/components/ui/SpecTable";
import Faq from "@/components/ui/Faq";
import Chips from "@/components/ui/Chips";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/ui/JsonLd";
import QuoteBlock from "@/components/sections/QuoteBlock";
import { FactStrip, DividedList, ImageSlot } from "@/components/ui/glass";
import PageHero from "@/components/layout/PageHero";
import { photos } from "@/lib/photos";
import { Icon } from "@/components/ui/Icons";
import { productTitles } from "../../meta";
import { categoryIcon } from "../../category-icons";
import { highlightMeta } from "./highlight-icon";
import ProductTile from "../../ProductTile";

// ADR-0007 §4: laser machines get a cutting-head/sparks/control-panel gallery,
// welding cells get a robot-weld/sparks/control-panel gallery instead.
const laserGallery = [
  { key: "slot-cutting-head", label: "Photo: cutting head close-up" },
  { key: "slot-sparks", label: "Photo: sparks during cutting" },
  { key: "slot-control-panel", label: "Photo: control panel" },
] as const;

const weldingGallery = [
  { key: "slot-robot-weld", label: "Photo: robotic arm welding" },
  { key: "slot-sparks", label: "Photo: weld sparks" },
  { key: "slot-control-panel", label: "Photo: control panel" },
] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ category: product.category, slug: product.slug }));
}

function findProduct(category: string, slug: string) {
  const product = getProduct(slug);
  if (!product || product.category !== category) return undefined;
  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const product = findProduct(category, slug);
  if (!product) return {};

  return buildMetadata({
    title: productTitles[product.slug] ?? `${product.name} | RA Machine`,
    description: product.shortDescription,
    path: paths.product(product.category, product.slug),
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = findProduct(category, slug);
  if (!product) notFound();

  const categoryEntry = categories.find((entry) => entry.slug === product.category);
  const icon = categoryIcon[product.category];
  const relatedProducts = product.relatedSlugs
    .map((relatedSlug) => getProduct(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => Boolean(related));
  const headlineParts = product.headline.split(" · ");
  const keySpecs = product.specs.slice(0, 4).map((spec) => ({ label: spec.label, value: spec.value }));
  const heroSpecs = product.specs.slice(0, 3);
  const glyph = product.images[0];
  const gallerySlots = product.category === "robotic-welding-systems" ? weldingGallery : laserGallery;
  const highlightItems = product.highlights.map((highlight) => {
    const meta = highlightMeta(highlight);
    return { title: meta.label, text: highlight };
  });

  return (
    <>
      <PageHero image={photos["hero-product"]}>
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <Breadcrumbs
              items={[
                { name: "Home", href: paths.home },
                { name: "Products", href: paths.products },
                ...(categoryEntry
                  ? [{ name: categoryEntry.name, href: paths.category(categoryEntry.slug) }]
                  : []),
                { name: product.name, href: paths.product(product.category, product.slug) },
              ]}
            />
            <p className="eyebrow mb-3">
              <Icon name={icon} size={16} />
              {categoryEntry?.shortName ?? "RA Machine"}
            </p>
            <h1 className="font-display text-display-lg text-ink">{product.name}</h1>
            <p className="mt-4 max-w-prose text-grey-700">{product.shortDescription}</p>
            <div className="mt-5">
              <Chips
                items={[
                  ...headlineParts.map((part, i) => ({ label: part, icon: i === 0 ? ("Power" as const) : ("Ruler" as const) })),
                  ...(categoryEntry
                    ? [{ label: categoryEntry.shortName, href: paths.category(categoryEntry.slug), icon }]
                    : []),
                ]}
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#quote" variant="solid" icon="ArrowRight">
                Request a Quote
              </Button>
              <Button href={product.brochureUrl} variant="outline" icon="Download" download>
                Download brochure
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {heroSpecs.map((spec) => (
                <div key={spec.label} className="flex items-center gap-2">
                  <span className="text-grey-600">{spec.label}:</span>
                  <span className="font-semibold text-ink">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
          {glyph && (
            <div className="hidden shrink-0 sm:block">
              <Image
                src={glyph.src}
                alt={glyph.alt}
                width={96}
                height={72}
                className="rounded-xl object-contain opacity-90"
              />
            </div>
          )}
        </div>
      </PageHero>

      <Container>
        <AboutBlurb context={`The ${product.name} is manufactured and supported from our Kolkata facility.`} />
      </Container>

      <Section eyebrow="Gallery" title="Photos">
        <div className="grid gap-6 sm:grid-cols-3">
          {gallerySlots.map((slot) => (
            <ImageSlot key={slot.key} image={photos[slot.key]} label={slot.label} />
          ))}
        </div>
      </Section>

      <Section eyebrow="At a glance" title="Key specs">
        <FactStrip facts={keySpecs} />
      </Section>

      <Section eyebrow="Highlights" title="Why this machine">
        <DividedList items={highlightItems} />
      </Section>

      <Section eyebrow="Specification" title="Specifications">
        <div className="space-y-6">
          <SpecTable rows={product.specs} caption="Full specification" />
          <SpecTable
            rows={product.materials.map((material) => ({ label: material.material, value: material.maxThickness }))}
            caption="Materials & thickness"
          />
        </div>
      </Section>

      <Section eyebrow="Overview" title="Overview">
        <Prose>
          {product.longDescription.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p>Typical applications: {product.applications.join(", ")}.</p>
        </Prose>
      </Section>

      {relatedProducts.length > 0 && (
        <Section eyebrow="Related" title="Related machines">
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedProducts.map((related) => (
              <ProductTile key={related.slug} product={related} />
            ))}
          </div>
        </Section>
      )}

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Faq items={product.faqs} />
          </div>
          <div className="lg:col-span-1">
            <QuoteBlock product={product} sticky />
          </div>
        </div>
      </Section>

      <JsonLd data={productSchema(product)} />
    </>
  );
}
