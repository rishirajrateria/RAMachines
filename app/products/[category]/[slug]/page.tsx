import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import Gallery from "@/components/media/Gallery";
import QuoteBlock from "@/components/sections/QuoteBlock";
import { FactStrip, DividedList } from "@/components/ui/glass";
import { Icon } from "@/components/ui/Icons";
import { productTitles } from "../../meta";
import { categoryIcon } from "../../category-icons";
import { highlightMeta } from "./highlight-icon";
import ProductTile from "../../ProductTile";

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
  const highlightItems = product.highlights.map((highlight) => {
    const meta = highlightMeta(highlight);
    return { title: meta.label, text: highlight };
  });

  return (
    <>
      <Container>
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
      </Container>

      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-5 lg:items-center">
          <div className="lg:col-span-3">
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
          </div>
          <div className="lg:col-span-2">
            <Gallery images={product.images.slice(0, 3)} />
          </div>
        </div>
      </Section>

      <Container>
        <AboutBlurb context={`The ${product.name} is manufactured and supported from our Kolkata facility.`} />
      </Container>

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
