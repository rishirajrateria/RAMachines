import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { products } from "@/data/products";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return products.map((product) => ({ category: product.category, slug: product.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = products.find((item) => item.category === category && item.slug === slug);

  return renderOg({
    eyebrow: "RA Machine",
    title: product?.name ?? "RA Machine",
    subtitle: product?.headline,
  });
}
