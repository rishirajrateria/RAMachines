import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import type { CategorySlug } from "@/data/types";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Button from "@/components/ui/Button";
import { FactStrip, DividedList } from "@/components/ui/glass";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icons";
import ProductTile from "../ProductTile";
import ComparisonTable from "./ComparisonTable";
import LongCopySections from "./LongCopySections";
import { categoryTitles } from "../meta";
import { categoryIcon } from "../category-icons";
import { categoryGlance } from "./glance";

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
  const icon = categoryIcon[category.slug];
  const facts = [
    ...categoryGlance[category.slug],
    { icon: "Factory" as const, label: "Machines", value: `${categoryProducts.length} in the range` },
  ];

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

      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-5 lg:items-center">
          <div className="lg:col-span-3">
            <p className="eyebrow mb-3">
              <Icon name={icon} size={16} />
              {category.shortName}
            </p>
            <h1 className="font-display text-display-lg text-ink">{category.name}</h1>
            <p className="mt-4 max-w-prose text-grey-700">{category.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#quote" variant="solid" icon="ArrowRight">
                Request a Quote
              </Button>
              <Button href={site.phoneHref} variant="outline" icon="Phone">
                Call us
              </Button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_50%_40%,rgba(15,118,110,0.10),transparent_70%)]">
              <Image
                src={category.image.src}
                alt={category.image.alt}
                width={category.image.width}
                height={category.image.height}
                className="h-full w-full object-contain p-6"
              />
            </div>
          </div>
        </div>
      </Section>

      <Container>
        <AboutBlurb
          context={`Our ${category.shortName.toLowerCase()} range is designed, assembled and supported from our Kolkata facility, for buyers across India and for export.`}
        />
      </Container>

      <Section eyebrow="At a glance" title="Key figures">
        <FactStrip facts={facts} />
      </Section>

      <Section eyebrow="In our range" title="The machines" intro={category.intro}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductTile key={product.slug} product={product} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Where it's used" title="Applications">
        <DividedList items={category.applications.map((application) => ({ title: application }))} />
      </Section>

      <Section eyebrow="Compare" title="Compare specs">
        <ComparisonTable products={categoryProducts} specLabels={category.comparisonSpecs} categoryName={category.name} />
      </Section>

      <Section eyebrow="How it works" title="The engineering">
        <LongCopySections category={category} />
      </Section>

      <Section>
        <Faq items={category.faqs} title={`Questions about ${category.shortName.toLowerCase()}`} />
      </Section>

      <CtaBand
        title={`Talk to us about a ${category.shortName.toLowerCase()} machine`}
        text="Tell us your material, thickness and production volume and we will recommend the right machine and configuration."
      />
    </>
  );
}
