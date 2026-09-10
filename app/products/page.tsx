import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { products, productsByCategory } from "@/data/products";
import { categories } from "@/data/categories";
import Container from "@/components/ui/Container";
import Band from "@/components/ui/Band";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import SectionHeading from "@/components/ui/SectionHeading";
import Chips from "@/components/ui/Chips";
import { Icon } from "@/components/ui/Icons";
import IllustrationCard from "@/components/ui/IllustrationCard";
import ProductCard from "@/components/cards/ProductCard";
import CtaBand from "@/components/sections/CtaBand";
import ProductFilter from "./ProductFilter";
import { categoryIcon } from "./category-icons";

export const metadata: Metadata = buildMetadata({
  title: "Laser Cutting Machines & Robotic Welding | RA Machine",
  description:
    "Browse RA Machine's full range: fiber laser, tube laser and CO2 laser cutting machines and robotic MIG/MAG welding systems, manufactured in Kolkata.",
  path: paths.products,
});

export default function ProductsPage() {
  const filterOptions = categories.map((category) => ({
    slug: category.slug,
    name: category.shortName,
    icon: categoryIcon[category.slug],
  }));

  return (
    <>
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Products", href: paths.products }]} />
      </Container>

      <Band tone="dark">
        <p className="eyebrow mb-3">
          <Icon name="Laser" size={16} />
          Our range
        </p>
        <h1 className="max-w-3xl font-display text-display-lg text-white">
          Laser Cutting Machines &amp; Robotic Welding Systems
        </h1>
        <p className="mt-4 max-w-2xl text-white/75">
          Four machine families built on the same proven CNC control platform — fiber
          laser, tube laser, CO2 laser and robotic MIG/MAG welding — engineered and
          manufactured in Kolkata for buyers across India and for export.
        </p>
        <div className="mt-6">
          <Chips
            items={categories.map((category) => ({
              label: category.shortName,
              href: paths.category(category.slug),
              icon: categoryIcon[category.slug],
            }))}
          />
        </div>
      </Band>

      <Container className="pb-4 pt-12 md:pt-16">
        <SectionHeading eyebrow="Browse by category" icon="Layers" title="Four machine families" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <IllustrationCard
              key={category.slug}
              image={category.image}
              title={category.name}
              text={category.description}
              href={paths.category(category.slug)}
              badge={`${productsByCategory(category.slug).length} machines`}
            />
          ))}
        </div>
      </Container>

      <Container className="pb-14 pt-10 md:pb-20 md:pt-12">
        <SectionHeading eyebrow="All machines" icon="Sparkles" title="Browse the full range" />
        <div className="mt-8">
          <ProductFilter categories={filterOptions}>
            {products.map((product) => (
              <div key={product.slug} data-category={product.category}>
                <ProductCard product={product} />
              </div>
            ))}
          </ProductFilter>
        </div>
      </Container>

      <Band tone="soft">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="About the range"
              icon="Building"
              title="One CNC platform, four machine families"
            />
            <p className="mt-4 max-w-prose text-grey-700">
              Our range covers four machine families built on the same proven CNC
              control platform: fiber laser cutting machines from 1.5&nbsp;kW to
              12&nbsp;kW for sheet metal, a dedicated fiber laser tube cutting machine,
              a CO2 laser for acrylic, wood and signage work, and robotic MIG/MAG
              welding cells for consistent, high-volume weld quality.
            </p>
            <p className="mt-4 max-w-prose text-grey-700">
              Filter by category above, or open any machine for full specifications,
              applications and a request-a-quote option — no prices are published
              online, so every enquiry receives a quotation matched to your material,
              thickness and production volume.
            </p>
          </div>
          <AboutBlurb context="Every machine above is available for delivery and installation across India and for export, backed by our own operator training and after-sales service." />
        </div>
      </Band>

      <CtaBand
        title="Not sure which machine fits your job"
        text="Tell us your material, thickness and production volume and we will recommend the right machine from our range."
      />
    </>
  );
}
