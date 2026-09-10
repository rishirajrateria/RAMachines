import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "India",
    title: "Laser Cutting Machine & Robotic Welding Supplier Across India",
    subtitle: "Delivery, installation, AMC service and training in every state and union territory, from Kolkata.",
  });
}
