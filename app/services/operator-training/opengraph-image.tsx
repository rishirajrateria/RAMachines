import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "Operator Training",
    title: "Laser Cutting Machine Operator Training",
    subtitle: "Operation, safety, maintenance and nesting software — on-site or at our Kolkata training centre.",
  });
}
