import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "Certifications",
    title: "Licences & Certifications",
    subtitle: "GST registration, Import Export Code and Indian Railways vendor status.",
  });
}
