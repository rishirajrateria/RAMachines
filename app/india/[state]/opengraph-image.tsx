import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { states, getState } from "@/data";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return states.map((state) => ({ state: state.slug }));
}

export default async function Image({ params }: { params: Promise<{ state: string }> }) {
  const { state: slug } = await params;
  const state = getState(slug);

  return renderOg({
    eyebrow: "India",
    title: state ? `Laser Cutting Machine in ${state.name}` : "RA Machine",
    subtitle: state ? `Manufacturer, supplier and service across ${state.name}, delivered from Kolkata.` : undefined,
  });
}
