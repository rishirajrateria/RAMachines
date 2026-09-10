import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "Certifications",
    title: "Licences & Certifications",
    subtitle: "ISO 9001:2015, CE marking, GST, MSME, IEC and Indian Railways vendor status.",
  });
}
