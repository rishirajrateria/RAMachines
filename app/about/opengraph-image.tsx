import { renderOg, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderOg({
    eyebrow: "About",
    title: "About RA Machine",
    subtitle: "RA Group's Kolkata manufacturer of laser cutting and robotic welding machines.",
  });
}
