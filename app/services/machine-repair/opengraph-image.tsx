import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "Repair & Maintenance",
    title: "RA Machine Repair & Maintenance",
    subtitle: "Repair and maintenance for RA Machine equipment — pan-India on-site service, remote diagnostics and spares.",
  });
}
