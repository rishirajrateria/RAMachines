import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "RA Machine",
    title: "CNC Laser, Plasma & Welding Machines",
    subtitle: "CNC laser and plasma cutting, MIG/TIG/MMA and SAW welding, cobot and robotic welding — built in India.",
  });
}
