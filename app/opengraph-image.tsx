import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { site } from "@/config/site";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "RA Machine",
    title: site.tagline,
    subtitle: "CNC laser and plasma cutting, MIG/TIG/MMA and SAW welding, cobot and robotic welding — manufactured in India.",
  });
}
