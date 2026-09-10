import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { products, productsByCategory } from "@/data/products";
import { categories } from "@/data/categories";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CategoryCard from "@/components/cards/CategoryCard";
import CtaBand from "@/components/sections/CtaBand";
import ProductFilter from "./ProductFilter";
import ProductTile from "./ProductTile";
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

      <Section tone="dark">
        <p className="eyebrow mb-3">Our range</p>
        <h1 className="font-display text-display-lg text-ink">Machines</h1>
        <p className="mt-4 max-w-prose text-grey-700">
          Four machine families built on one CNC platform — fiber laser, tube laser, CO2 laser
          and robotic MIG/MAG welding — engineered and manufactured in Kolkata.
        </p>
      </Section>

      <Container>
        <AboutBlurb context="Every machine below is available for delivery and installation across India and for export, backed by our own operator training and after-sales service." />
      </Container>

      <Section eyebrow="Browse" title="Machine families">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} count={productsByCategory(category.slug).length} />
          ))}
        </div>
      </Section>

      <Section eyebrow="All machines" title="The full range">
        <ProductFilter categories={filterOptions}>
          {products.map((product) => (
            <div key={product.slug} data-category={product.category}>
              <ProductTile product={product} />
            </div>
          ))}
        </ProductFilter>
      </Section>

      <CtaBand
        title="Not sure which machine fits your job"
        text="Tell us your material, thickness and production volume and we will recommend the right machine from our range."
      />
    </>
  );
}
