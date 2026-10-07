import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "Buyer guides",
    title: "Cutting & Welding Machine Guides",
    subtitle: "Laser vs plasma, MIG vs TIG vs MMA, SAW, cobots, factory preparation and importing from India.",
  });
}
