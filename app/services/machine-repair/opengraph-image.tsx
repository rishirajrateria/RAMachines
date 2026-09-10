import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "Repair & Maintenance",
    title: "Laser Cutting Machine Repair & CNC Maintenance",
    subtitle: "Pan-India on-site service, remote diagnostics, spares and AMC — engineers dispatched from Kolkata.",
  });
}
