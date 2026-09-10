import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "Job Work",
    title: "Laser Cutting Job Work",
    subtitle: "Precision metal cutting on our fiber laser machines, from your DXF or DWG drawing.",
  });
}
