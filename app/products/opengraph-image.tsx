import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "RA Machine",
    title: "Laser Cutting Machines & Robotic Welding Systems",
    subtitle: "Fiber laser, tube laser, CO2 laser and robotic MIG/MAG welding — built in Kolkata.",
  });
}
