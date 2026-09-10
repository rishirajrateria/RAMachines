import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { countries, getCountry } from "@/data";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return countries.map((c) => ({ country: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = getCountry(slug);

  return renderOg({
    eyebrow: "Export",
    title: `Laser Cutting Machine Exporter to ${country?.name ?? ""}`,
    subtitle: "Fiber laser cutting and robotic welding machines from India, with installation, training and warranty support.",
  });
}
