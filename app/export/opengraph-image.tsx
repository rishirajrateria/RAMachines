import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "Export",
    title: "Laser Cutting Machine Exporter from India",
    subtitle: "CE-marked, ISO 9001:2015-certified machines shipped to 30 countries, with installation, training and warranty support.",
  });
}
