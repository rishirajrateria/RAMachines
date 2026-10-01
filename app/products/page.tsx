/**
 * app/products/page.tsx — the products index: the five machine families (client
 * brief, Oct 2026) as cards, then the whole range at a glance in one table built
 * from each family's own `ranges` — the client's figures, nothing invented.
 * (The earlier per-model grid and its category filter were removed with the
 * placeholder SKUs.)
 */
import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Button from "@/components/ui/Button";
import { Icon, ArrowRight } from "@/components/ui/Icons";
import CategoryCard from "@/components/cards/CategoryCard";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/layout/PageHero";
import { photos } from "@/lib/photos";
import { categoryIcon } from "./category-icons";

export const metadata: Metadata = buildMetadata({
  title: "CNC Laser, Plasma & Welding Machines | RA Machine",
  description:
    "CNC fiber laser (1.5–30 kW) and plasma (100–200 A) cutting machines, MIG/TIG/MMA and SAW welding machines and cobot welding systems, built in India.",
  path: paths.products,
});

export default function ProductsPage() {
  return (
    <>
      <PageHero image={photos["hero-products"]}>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Products", href: paths.products }]} />
        <p className="eyebrow mb-3">Our range</p>
        <h1 className="font-display text-display-lg text-ink">Machines</h1>
        <p className="mt-4 max-w-prose text-grey-700">
          Multiple technologies, one workshop: CNC laser and plasma cutting, MIG, TIG, MMA and submerged arc welding, and
          cobot and robotic welding — engineered, built and tested in India.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#range" variant="solid" icon="ArrowRight">
            Browse machines
          </Button>
          <Button href={site.phoneHref} variant="outline" icon="Phone">
            Call us
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Factory" size={16} className="text-teal" />
            <span className="text-grey-600">Machine families:</span>
            <span className="font-semibold text-ink">{categories.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Badge" size={16} className="text-teal" />
            <span className="text-grey-600">Built in:</span>
            <span className="font-semibold text-ink">India</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-teal" />
            <span className="text-grey-600">Delivery:</span>
            <span className="font-semibold text-ink">Pan-India + export</span>
          </div>
        </div>
      </PageHero>

      <Container>
        <AboutBlurb context="Every machine below is configured to the job and available for delivery and installation across India and for export, backed by our own operator training and after-sales service." />
      </Container>

      <Section id="range" eyebrow="Browse" title="Machine families">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="At a glance"
        title="The range"
        intro="Every machine is configured to the job it will do. These are the ranges we build in; tell us your material, thickness and volume and we will specify the rest."
      >
        <div className="glass overflow-hidden">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">RA Machine range by technology</caption>
            <thead>
              <tr className="border-b border-[color:var(--hairline)] text-xs uppercase tracking-[0.08em] text-grey-500">
                <th scope="col" className="px-5 py-3 font-semibold">
                  Technology
                </th>
                <th scope="col" className="hidden px-5 py-3 font-semibold sm:table-cell">
                  Range
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--hairline)]">
              {categories.map((category) => (
                <tr key={category.slug} className="align-top">
                  <th scope="row" className="px-5 py-4 font-normal">
                    <Link
                      href={paths.category(category.slug)}
                      prefetch={false}
                      className="group inline-flex items-center gap-2 font-semibold text-ink hover:text-teal"
                    >
                      <Icon name={categoryIcon[category.slug]} size={16} className="shrink-0 text-teal" />
                      {category.name}
                      <ArrowRight
                        width={14}
                        height={14}
                        className="shrink-0 text-teal transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                    {/* On phones the range sits under the name instead of in its own column. */}
                    <ul className="mt-1.5 space-y-0.5 text-grey-600 sm:hidden">
                      {category.ranges.map((range) => (
                        <li key={range.label}>
                          {range.label}: <span className="font-semibold text-ink">{range.value}</span>
                        </li>
                      ))}
                    </ul>
                  </th>
                  <td className="hidden px-5 py-4 text-grey-600 sm:table-cell">
                    <ul className="space-y-0.5">
                      {category.ranges.map((range) => (
                        <li key={range.label}>
                          {range.label}: <span className="font-semibold text-ink">{range.value}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <CtaBand
        title="Not sure which machine fits your job"
        text="Tell us your material, thickness and production volume and we will recommend the right technology and configuration."
      />
    </>
  );
}
