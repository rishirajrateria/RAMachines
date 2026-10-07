import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { guides } from "@/data/guides";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  return renderOg({
    eyebrow: "RA Machine · Buyer guide",
    title: guide?.h1 ?? "Buyer guide",
    subtitle: guide?.description,
  });
}
