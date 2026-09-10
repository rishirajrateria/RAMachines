import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { categories } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import type { CategorySlug } from "@/data/types";
import Container from "@/components/ui/Container";
import Band from "@/components/ui/Band";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import SectionHeading from "@/components/ui/SectionHeading";
import GlancePanel from "@/components/ui/GlancePanel";
import Chips from "@/components/ui/Chips";
import { Icon } from "@/components/ui/Icons";
import CtaGroup from "@/components/ui/CtaGroup";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/sections/CtaBand";
import ProductCard from "@/components/cards/ProductCard";
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

      <Band tone="dark">
        <div className="grid gap-10 lg:grid-cols-5 lg:items-center">
          <div className="lg:col-span-3">
            <p className="eyebrow mb-3">
              <Icon name={icon} size={16} />
              {category.shortName}
            </p>
            <h1 className="font-display text-display-lg text-white">
              {category.name} — Manufacturer in India
            </h1>
            <p className="mt-4 max-w-prose text-white/75">{category.intro}</p>
            <div className="mt-6">
              <Chips
                items={categoryProducts.map((product) => ({
                  label: product.sku,
                  href: paths.product(product.category, product.slug),
                  icon,
                }))}
              />
            </div>
            <div className="mt-8">
              <CtaGroup context={category.shortName} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-white/10">
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
      </Band>

      <Container className="pb-14 pt-12 md:pb-20 md:pt-16">
        <GlancePanel title={`${category.shortName} at a glance`} facts={categoryGlance[category.slug]} />
      </Container>

      <Container className="pb-14 md:pb-20">
        <SectionHeading
          eyebrow="In our range"
          icon={icon}
          title={`${category.name} we manufacture`}
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Container>

      <Container className="pb-14 md:pb-20">
        <SectionHeading eyebrow="Compare" icon="Ruler" title="Compare specifications" />
        <div className="mt-8">
          <ComparisonTable products={categoryProducts} specLabels={category.comparisonSpecs} icon={icon} categoryName={category.name} />
        </div>
      </Container>

      <Band tone="soft">
        <SectionHeading eyebrow="Where it's used" icon="Factory" title="Applications" />
        <div className="mt-6">
          <Chips items={category.applications.map((application) => ({ label: application, icon: "Check" }))} />
        </div>
      </Band>

      <Container className="pb-14 pt-14 md:pb-20 md:pt-20">
        <LongCopySections category={category} />
      </Container>

      <Container className="pb-14 md:pb-20">
        <AboutBlurb
          context={`Our ${category.shortName.toLowerCase()} range is designed, assembled and supported from our Kolkata facility, for buyers across India and for export.`}
        />
      </Container>

      <Container className="pb-14 md:pb-20">
        <Faq items={category.faqs} title={`Frequently asked questions — ${category.shortName.toLowerCase()}`} />
      </Container>

      <CtaBand
        title={`Talk to us about a ${category.shortName.toLowerCase()} machine`}
        text="Tell us your material, thickness and production volume and we will recommend the right machine and configuration."
      />
    </>
  );
}
