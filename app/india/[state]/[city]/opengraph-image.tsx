import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { cities, getCity, getState } from "@/data";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return cities.map((city) => ({ state: city.stateSlug, city: city.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCity(stateSlug, citySlug);
  const state = city ? getState(city.stateSlug) : undefined;

  return renderOg({
    eyebrow: "India",
    title: city && state ? `Laser Cutting Machine in ${city.name}, ${state.name}` : "RA Machine",
    subtitle: city ? "Sales, installation, repair and training, delivered from Kolkata." : undefined,
  });
}
