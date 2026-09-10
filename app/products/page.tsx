import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { products, productsByCategory } from "@/data/products";
import { categories } from "@/data/categories";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import CategoryCard from "@/components/cards/CategoryCard";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/layout/PageHero";
import { photos } from "@/lib/photos";
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
      <PageHero image={photos["hero-products"]}>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Products", href: paths.products }]} />
        <p className="eyebrow mb-3">Our range</p>
        <h1 className="font-display text-display-lg text-ink">Machines</h1>
        <p className="mt-4 max-w-prose text-grey-700">
          Four machine families — fiber, tube and CO2 laser cutting, and robotic welding — engineered and built in Kolkata.
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
            <span className="font-semibold text-ink">4</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Badge" size={16} className="text-teal" />
            <span className="text-grey-600">Manufactured:</span>
            <span className="font-semibold text-ink">Kolkata, India</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-teal" />
            <span className="text-grey-600">Delivery:</span>
            <span className="font-semibold text-ink">Pan-India + export</span>
          </div>
        </div>
      </PageHero>

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

      <Section id="range" eyebrow="All machines" title="The full range">
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
