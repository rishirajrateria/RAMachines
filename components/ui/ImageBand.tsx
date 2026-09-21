/**
 * components/ui/ImageBand.tsx — ADR-0007 §2: a full-bleed 16:9 → 21:9 image between
 * sections (unframed, edge-to-edge — unlike the glass-framed `ImageSlot`), with an
 * optional short overlay line (`overlayText`) in a small glass pill and the same
 * bottom-left placeholder label pill as `ImageSlot` (`label`, hidden once
 * `placeholder` is false). Wrapped in the same scroll-reveal (`Reveal`) as every
 * other glass surface — a Server Component, no page-level change needed to opt in.
 *
 * ADR-0009 §1/§4: the image renders via `components/media/Img` (`fill`,
 * `sizes="100vw"`). The root carries `.image-band` so `app/globals.css` can keep
 * `backdrop-filter` on the `overlayText` pill (it sits on a photo) while the same
 * `.glass-strong` class loses it everywhere else on the page.
 */
import type { Img as ImgData } from "@/data/types";
import Img from "@/components/media/Img";
import Reveal from "./Reveal";

export default function ImageBand({
  image,
  overlayText,
  label,
  placeholder = true,
  className = "",
}: {
  image: ImgData;
  overlayText?: string;
  /** e.g. "Photo: shop floor" — shown only while `placeholder` is true. */
  label?: string;
  /** Set false once a real photo replaces the generated placeholder to hide the label pill. */
  placeholder?: boolean;
  className?: string;
}) {
  return (
    <div className={`image-band section-rhythm-tight w-full ${className}`.trim()}>
      <Reveal>
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
          <Img image={image} sizes="100vw" fill />
          <div className="hero-scrim absolute inset-0" />
          {placeholder && label && <span className="photo-label">{label}</span>}
          {overlayText && (
            <div className="absolute inset-x-0 bottom-0 flex justify-center p-6 md:p-10">
              <p className="glass-strong px-5 py-3 text-center text-base font-semibold text-ink md:text-lg">
                {overlayText}
              </p>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
