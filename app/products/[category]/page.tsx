/**
 * app/products/[category]/page.tsx — one page per machine family (client brief,
 * Oct 2026): CNC laser, CNC plasma, MIG/TIG/MMA welding, SAW, cobot/robotic
 * welding. There are no per-model pages; RA Machine configures each machine to
 * the buyer's job, so the page states only the client's own ranges
 * (`category.ranges`) and asks for the job details instead of listing SKUs.
 *
 * Anatomy: image hero (range facts) → AboutBlurb → "The range" (intro + range
 * table beside a sticky QuoteBlock) → applications → engineering long copy →
 * the other four families → FAQ → CTA.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Button from "@/components/ui/Button";
import { DividedList } from "@/components/ui/glass";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import CtaBand from "@/components/sections/CtaBand";
import QuoteBlock from "@/components/sections/QuoteBlock";
import CategoryCard from "@/components/cards/CategoryCard";
import PageHero from "@/components/layout/PageHero";
import { photos } from "@/lib/photos";
import { familySchema } from "@/lib/schema";
import { Icon } from "@/components/ui/Icons";
import LongCopySections from "./LongCopySections";
import { guidesForFamily } from "@/data/guides";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { categoryTitles } from "../meta";
import { categoryIcon } from "../category-icons";
import { categoryHero } from "../category-heroes";

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
    title: categoryTitles[category.slug] ?? `${category.name} | RA Machine`,
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

  const icon = categoryIcon[category.slug];
  const others = categories.filter((c) => c.slug !== category.slug);
  const familyGuides = guidesForFamily(category.slug);

  return (
    <>
      <PageHero image={photos[categoryHero[category.slug]]}>
        <Breadcrumbs
          items={[
            { name: "Home", href: paths.home },
            { name: "Products", href: paths.products },
            { name: category.name, href: paths.category(category.slug) },
          ]}
        />
        <p className="eyebrow mb-3">
          <Icon name={icon} size={16} />
          {category.shortName}
        </p>
        <h1 className="font-display text-display-lg text-ink">{category.name}</h1>
        <p className="mt-4 max-w-prose text-grey-700">
          Engineered, built and tested in India and configured to your job, with installation, operator training and
          service from the team that built it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#quote" variant="solid" icon="ArrowRight">
            Request a Quote
          </Button>
          <Button href={site.phoneHref} variant="outline" icon="Phone">
            Call us
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {category.ranges.map((range) => (
            <div key={range.label} className="flex items-center gap-2">
              <Icon name={icon} size={16} className="text-teal" />
              <span className="text-grey-600">{range.label}:</span>
              <span className="font-semibold text-ink">{range.value}</span>
            </div>
          ))}
        </div>
      </PageHero>

      <Container>
        <AboutBlurb
          context={`Our ${category.name} are designed, built and supported by our own team in India, for buyers across India and abroad.`}
        />
      </Container>

      <Section eyebrow="Specifications" title="The range">
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start">
          <div>
            <p className="max-w-prose text-grey-700">{category.intro}</p>
            <dl className="glass mt-8 divide-y divide-[color:var(--hairline)] px-6">
              {category.ranges.map((range) => (
                <div key={range.label} className="grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                  <dt className="text-sm font-semibold text-grey-600">{range.label}</dt>
                  <dd className="font-semibold text-ink">{range.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 max-w-prose text-sm text-grey-600">
              Every machine is configured to the job it will do. Send us your material, thickness and production
              volume and we will recommend and quote the right configuration.
            </p>
          </div>
          <QuoteBlock family={category} sticky />
        </div>
      </Section>

      <Section eyebrow="Where it's used" title="Applications">
        <DividedList items={category.applications.map((application) => ({ title: application }))} />
      </Section>

      <Section eyebrow="How it works" title="The engineering">
        <LongCopySections category={category} />
      </Section>

      <Section eyebrow="Our range" title="Other technologies">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((other) => (
            <CategoryCard key={other.slug} category={other} />
          ))}
        </div>
      </Section>

      {familyGuides.length > 0 && (
        <Section eyebrow="Buyer guides" title="Before you choose">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {familyGuides.map((g) => (
              <li key={g.slug}>
                <Link href={paths.guide(g.slug)} prefetch={false} className="glass group flex h-full flex-col p-5">
                  <span className="font-semibold text-ink">{g.h1}</span>
                  <span className="mt-2 line-clamp-3 text-sm text-grey-600">{g.summary}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-teal">
                    Read the guide
                    <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section>
        <Faq items={category.faqs} title={`Questions about ${category.name}`} />
      </Section>

      <CtaBand
        title={`Talk to us about ${category.name}`}
        text="Tell us your material, thickness and production volume and we will recommend the right configuration."
      />

      <JsonLd data={familySchema(category)} />
    </>
  );
}
