/**
 * components/media/Gallery.tsx — product image gallery: one large main image plus
 * the remaining shots as a plain list of thumbnails (each linking to the full-size
 * image in a new tab). No client JS — this is a Server Component. ADR-0005: glass
 * frame instead of a hard grey border.
 *
 * ADR-0009 §1: renders via `components/media/Img` (`<picture>`, AVIF/WebP
 * srcset, LQIP) instead of `next/image` — the main shot is `priority` (it's
 * usually the product page's LCP image); thumbnails use the "tile" sizes recipe.
 */
import type { Img as ImgData } from "@/data/types";
import Img from "@/components/media/Img";

export default function Gallery({ images }: { images: ImgData[] }) {
  if (images.length === 0) return null;
  const [main, ...rest] = images;

  return (
    <div>
      <div className="glass relative aspect-[4/3] w-full overflow-hidden p-0">
        <Img image={main} sizes="(min-width: 1024px) 33vw, 100vw" priority className="h-full w-full object-cover" />
      </div>
      {rest.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {rest.map((img) => (
            <li key={img.src}>
              <a
                href={img.src}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-hover block overflow-hidden p-0"
                aria-label={`View full size: ${img.alt}`}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Img image={img} sizes="(min-width: 640px) 25vw, 33vw" className="h-full w-full object-cover" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
