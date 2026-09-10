import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "Contact",
    title: "Contact RA Machine",
    subtitle: "Kolkata, India — quotations, repair, training and export enquiries.",
  });
}
