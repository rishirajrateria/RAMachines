/**
 * components/media/Gallery.tsx — product image gallery: one large main image plus
 * the remaining shots as a plain list of thumbnails (each linking to the full-size
 * image in a new tab). No client JS — this is a Server Component. ADR-0005: glass
 * frame instead of a hard grey border.
 */
import Image from "next/image";
import type { Img } from "@/data/types";

export default function Gallery({ images }: { images: Img[] }) {
  if (images.length === 0) return null;
  const [main, ...rest] = images;

  return (
    <div>
      <div className="glass relative aspect-[4/3] w-full overflow-hidden p-0">
        <Image src={main.src} alt={main.alt} width={main.width} height={main.height} priority className="h-full w-full object-cover" />
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
                  <Image src={img.src} alt={img.alt} width={img.width} height={img.height} className="h-full w-full object-cover" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
