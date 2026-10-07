import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "Export",
    title: "CNC Laser, Plasma & Welding Machines from India",
    subtitle: "Built in India and shipped worldwide, with export documentation, installation, training and warranty support.",
  });
}
