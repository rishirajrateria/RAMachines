import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { productSchema } from "@/lib/schema";
import { products, getProduct } from "@/data/products";
import { categories } from "@/data/categories";
import { topStates } from "@/data/states";
import { topCountries } from "@/data/countries";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Prose from "@/components/ui/Prose";
import SpecTable from "@/components/ui/SpecTable";
import Faq from "@/components/ui/Faq";
import RelatedPages from "@/components/ui/RelatedPages";
import JsonLd from "@/components/ui/JsonLd";
import Gallery from "@/components/media/Gallery";
import ProductCard from "@/components/cards/ProductCard";
import QuoteBlock from "@/components/sections/QuoteBlock";
import { Check, Download } from "@/components/ui/Icons";
import { productTitles } from "../../meta";

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
  const relatedProducts = product.relatedSlugs
    .map((relatedSlug) => getProduct(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => Boolean(related));

  const reachLinks = [
    ...topStates(8).map((state) => ({
      name: state.name,
      href: paths.state(state.slug),
      hint: "Delivery, installation & service",
    })),
    ...topCountries()
      .slice(0, 10)
      .map((country) => ({
        name: country.name,
        href: paths.country(country.slug),
        hint: "Export & installation",
      })),
    { name: "Export hub — all countries", href: paths.exportHub },
    { name: "Machine repair & maintenance", href: paths.repair },
    { name: "Operator training", href: paths.training },
  ];

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

      <Container className="pb-14 pt-2 md:pb-20">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-steel">
              {product.headline}
            </p>
            <h1 className="mt-2 font-display text-display-lg text-ink">{product.name}</h1>
            <div className="mt-5 max-w-prose">
              <AboutBlurb context={`The ${product.name} is manufactured and supported from our Kolkata facility.`} />
            </div>

            <div className="mt-8">
              <Gallery images={product.images} />
            </div>

            <div className="mt-10">
              <h2 className="font-display text-display-md text-ink">Highlights</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-grey-700">
                    <Check width={16} height={16} className="mt-0.5 shrink-0 text-steel" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <h2 className="mb-6 font-display text-display-md text-ink">Specifications</h2>
              <SpecTable rows={product.specs} caption={`${product.name} — full technical specification`} />
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <h2 className="mb-6 font-display text-display-md text-ink">Overview</h2>
              <Prose>
                {product.longDescription.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </Prose>
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <h2 className="mb-6 font-display text-display-md text-ink">Applications</h2>
              <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {product.applications.map((application) => (
                  <li key={application} className="text-sm text-grey-700">
                    {application}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <h2 className="mb-6 font-display text-display-md text-ink">Materials &amp; thickness</h2>
              <SpecTable
                rows={product.materials.map((material) => ({
                  label: material.material,
                  value: material.maxThickness,
                }))}
              />
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <RelatedPages title="Available across India & for export" links={reachLinks} />
            </div>

            {relatedProducts.length > 0 && (
              <div className="mt-14 border-t border-grey-200 pt-14">
                <h2 className="mb-6 font-display text-display-md text-ink">Related machines</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {relatedProducts.map((related) => (
                    <ProductCard key={related.slug} product={related} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-14 border-t border-grey-200 pt-14">
              <Faq items={product.faqs} />
            </div>

            <div className="mt-14 border-t border-grey-200 pt-14">
              <a
                href={product.brochureUrl}
                download
                className="inline-flex h-11 items-center gap-2 rounded border border-grey-300 px-4 text-sm font-semibold text-ink hover:border-steel hover:text-steel"
              >
                <Download width={16} height={16} /> Download brochure (PDF)
              </a>
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
