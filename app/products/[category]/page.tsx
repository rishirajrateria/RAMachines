import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { categories } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import type { CategorySlug } from "@/data/types";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Prose from "@/components/ui/Prose";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/sections/CtaBand";
import ProductCard from "@/components/cards/ProductCard";
import ComparisonTable from "./ComparisonTable";
import { categoryTitles } from "../meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

function findCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = findCategory(slug);
  if (!category) return {};

  return buildMetadata({
    title: categoryTitles[category.slug as CategorySlug] ?? `${category.name} | RA Machine`,
    description: category.description,
    path: paths.category(category.slug),
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = findCategory(slug);
  if (!category) notFound();

  const categoryProducts = productsByCategory(category.slug);

  return (
    <>
      <Container>
        <Breadcrumbs
          items={[
            { name: "Home", href: paths.home },
            { name: "Products", href: paths.products },
            { name: category.name, href: paths.category(category.slug) },
          ]}
        />
      </Container>

      <Container className="pb-6 pt-2">
        <h1 className="max-w-3xl font-display text-display-lg text-ink">
          {category.name} — Manufacturer in India
        </h1>
        <div className="mt-5 max-w-3xl">
          <AboutBlurb
            context={`Our ${category.shortName.toLowerCase()} range is designed, assembled and supported from our Kolkata facility, for buyers across India and for export.`}
          />
        </div>
        <p className="mt-4 max-w-3xl text-grey-600">{category.intro}</p>
      </Container>

      <Container className="pb-14 md:pb-20">
        <h2 className="font-display text-display-md text-ink">
          {category.name} in our range
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>

      <Container className="pb-14 md:pb-20">
        <Prose>
          {category.longCopy.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Prose>
      </Container>

      <Container className="pb-14 md:pb-20">
        <h2 className="mb-6 font-display text-display-md text-ink">Compare specifications</h2>
        <ComparisonTable products={categoryProducts} specLabels={category.comparisonSpecs} />
      </Container>

      <Container className="pb-14 md:pb-20">
        <h2 className="mb-6 font-display text-display-md text-ink">Applications</h2>
        <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {category.applications.map((application) => (
            <li key={application} className="text-sm text-grey-700">
              {application}
            </li>
          ))}
        </ul>
      </Container>

      <Container className="pb-14 md:pb-20">
        <Faq items={category.faqs} />
      </Container>

      <CtaBand
        title={`Talk to us about a ${category.shortName.toLowerCase()} machine`}
        text="Tell us your material, thickness and production volume and we will recommend the right machine and configuration."
      />
    </>
  );
}
