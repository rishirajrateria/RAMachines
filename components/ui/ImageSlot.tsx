/**
 * components/ui/ImageSlot.tsx — ADR-0007 §2: a glass-framed image box (`.glass`
 * already carries the 28px radius, hairline border and soft shadow — ADR-0005 §2) for
 * `aspect` "16/9" | "4/3" | "3/4" | "1/1", `next/image` with explicit width/height, an
 * optional `caption` below the frame. While a slot uses a generated placeholder, a
 * tiny bottom-left pill (`.photo-label`, app/globals.css) reads `label` (e.g. "Photo:
 * factory floor") — pass `placeholder={false}` once a real photo replaces it and the
 * pill disappears. Wrapped in the same scroll-reveal (`Reveal`) as every other glass
 * surface on the page — a Server Component itself, like `IllustrationCard`/`GlassCard`.
 */
import Image from "next/image";
import type { Img } from "@/data/types";
import Reveal from "./Reveal";

const ASPECT_CLASS: Record<"16/9" | "4/3" | "3/4" | "1/1", string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
};

export default function ImageSlot({
  image,
  aspect = "4/3",
  label,
  placeholder = true,
  caption,
  className = "",
}: {
  image: Img;
  aspect?: "16/9" | "4/3" | "3/4" | "1/1";
  /** e.g. "Photo: factory floor" — shown only while `placeholder` is true. */
  label?: string;
  /** Set false once a real photo replaces the generated placeholder to hide the label pill. */
  placeholder?: boolean;
  caption?: string;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <figure className="glass overflow-hidden p-0">
        <div className={`relative w-full ${ASPECT_CLASS[aspect]}`}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
          {placeholder && label && <span className="photo-label">{label}</span>}
        </div>
        {caption && <figcaption className="px-5 py-3 text-sm text-grey-600">{caption}</figcaption>}
      </figure>
    </Reveal>
  );
}
