import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import Container from "@/components/ui/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import ProductCard from "@/components/cards/ProductCard";
import CtaBand from "@/components/sections/CtaBand";
import ProductFilter from "./ProductFilter";

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
  }));

  return (
    <>
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Products", href: paths.products }]} />
      </Container>

      <Container className="pb-14 pt-2 md:pb-20">
        <h1 className="max-w-3xl font-display text-display-lg text-ink">
          Laser Cutting Machines &amp; Robotic Welding Systems
        </h1>
        <div className="mt-5 max-w-3xl">
          <AboutBlurb context="Every machine below is available for delivery and installation across India and for export, backed by our own operator training and after-sales service." />
        </div>
        <p className="mt-4 max-w-3xl text-grey-600">
          Our range covers four machine families built on the same proven CNC control
          platform: fiber laser cutting machines from 1.5&nbsp;kW to 12&nbsp;kW for sheet
          metal, a dedicated fiber laser tube cutting machine, a CO2 laser for acrylic,
          wood and signage work, and robotic MIG/MAG welding cells for consistent,
          high-volume weld quality. Filter by category below, or open any machine for
          full specifications, applications and a request-a-quote option — no prices are
          published online, so every enquiry receives a quotation matched to your
          material, thickness and production volume.
        </p>

        <div className="mt-10">
          <ProductFilter categories={filterOptions}>
            {products.map((product) => (
              <div key={product.slug} data-category={product.category}>
                <ProductCard product={product} />
              </div>
            ))}
          </ProductFilter>
        </div>
      </Container>

      <CtaBand
        title="Not sure which machine fits your job"
        text="Tell us your material, thickness and production volume and we will recommend the right machine from our range."
      />
    </>
  );
}
