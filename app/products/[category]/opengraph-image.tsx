import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { categories } from "@/data/categories";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  return renderOg({
    eyebrow: "RA Machine",
    title: category?.name ?? "RA Machine",
    subtitle: category?.description,
  });
}
