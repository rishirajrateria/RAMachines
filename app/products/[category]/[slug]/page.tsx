import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { productSchema } from "@/lib/schema";
import { products, getProduct } from "@/data/products";
import { categories } from "@/data/categories";
import Container from "@/components/ui/Container";
import Band from "@/components/ui/Band";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import SectionHeading from "@/components/ui/SectionHeading";
import Prose from "@/components/ui/Prose";
import SpecTable from "@/components/ui/SpecTable";
import IconCard from "@/components/ui/IconCard";
import Faq from "@/components/ui/Faq";
import Chips from "@/components/ui/Chips";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/ui/JsonLd";
import Gallery from "@/components/media/Gallery";
import ProductCard from "@/components/cards/ProductCard";
import QuoteBlock from "@/components/sections/QuoteBlock";
import ReachSection from "@/components/sections/ReachSection";
import { Icon } from "@/components/ui/Icons";
import { productTitles } from "../../meta";
import { categoryIcon } from "../../category-icons";
import { highlightMeta } from "./highlight-icon";

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

      <Band tone="soft">
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
                  ...headlineParts.map((part, i) => ({ label: part, icon: i === 0 ? "Power" as const : "Ruler" as const })),
                  ...(categoryEntry
                    ? [{ label: categoryEntry.shortName, href: paths.category(categoryEntry.slug), icon }]
                    : []),
                ]}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <Gallery images={product.images} />
          </div>
        </div>
      </Band>

      <Container className="pb-14 pt-12 md:pb-20 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Highlights" icon="Sparkles" title="Why this machine" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {product.highlights.map((highlight) => {
                const meta = highlightMeta(highlight);
                return <IconCard key={highlight} icon={meta.icon} title={meta.label} text={highlight} />;
              })}
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <SectionHeading eyebrow="Specification" icon="Ruler" title="Full technical specification" />
              <div className="mt-6">
                <SpecTable rows={product.specs} caption={`${product.name} — specification`} icon={icon} />
              </div>
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <SectionHeading eyebrow="Materials" icon="Layers" title="Materials & thickness" />
              <div className="mt-6">
                <SpecTable
                  rows={product.materials.map((material) => ({
                    label: material.material,
                    value: material.maxThickness,
                  }))}
                  caption={`${product.name} — materials & thickness`}
                  icon="Layers"
                />
              </div>
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <SectionHeading eyebrow="Where it's used" icon="Factory" title="Applications" />
              <div className="mt-6">
                <Chips items={product.applications.map((application) => ({ label: application, icon: "Check" as const }))} />
              </div>
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <SectionHeading
                eyebrow="Reach"
                icon="Globe"
                title="Available across India & for export"
              />
              <div className="mt-8">
                <ReachSection />
              </div>
              <div className="mt-6">
                <Chips
                  items={[
                    { label: "Machine repair & maintenance", href: paths.repair, icon: "Wrench" },
                    { label: "Operator training", href: paths.training, icon: "GraduationCap" },
                  ]}
                />
              </div>
            </div>

            {relatedProducts.length > 0 && (
              <div className="mt-14 border-t border-grey-200 pt-14">
                <SectionHeading eyebrow="Related" icon={icon} title="Related machines" />
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {relatedProducts.map((related) => (
                    <ProductCard key={related.slug} product={related} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-14 border-t border-grey-200 pt-14">
              <Button href={product.brochureUrl} variant="outline" icon="Download" download>
                Download brochure (PDF)
              </Button>
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <SectionHeading eyebrow="Overview" icon="Layers" title="Overview" />
              <Prose className="mt-5">
                {product.longDescription.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </Prose>
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <AboutBlurb context={`The ${product.name} is manufactured and supported from our Kolkata facility.`} />
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <Faq items={product.faqs} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <QuoteBlock product={product} sticky />
          </div>
        </div>
      </Container>

      <JsonLd data={productSchema(product)} />
    </>
  );
}
