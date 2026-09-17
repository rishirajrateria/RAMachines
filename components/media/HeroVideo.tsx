"use client";

/**
 * components/media/HeroVideo.tsx — full-viewport hero background. The poster image is
 * the LCP element and renders immediately via `Img priority` (ADR-0009 §1: `<picture>`,
 * AVIF/WebP srcset, LQIP — instead of `next/image`).
 *
 * ADR-0009 §5: the `<video>` itself gets `preload="none"` and only mounts once this
 * element is (about to be) on screen, via the shared reveal `IntersectionObserver`
 * (`components/ui/observer`) — not an idle callback, so a visitor who never scrolls
 * the hero into a relevant view never pays for it. It's also skipped outright under
 * `prefers-reduced-motion`, `navigator.connection.saveData`, or an `effectiveType`
 * slower than 4G, so a constrained connection never fetches the clip at all.
 */
import { useEffect, useRef, useState } from "react";
import Img from "@/components/media/Img";
import { observeOnce } from "@/components/ui/observer";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export default function HeroVideo({
  poster,
  posterAlt,
}: {
  poster: { src: string; width: number; height: number };
  posterAlt: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mountVideo, setMountVideo] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /^(slow-2g|2g|3g)$/.test(connection.effectiveType)) return;

    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setMountVideo(true));
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 h-full w-full overflow-hidden">
      <Img image={{ src: poster.src, alt: posterAlt, width: poster.width, height: poster.height }} sizes="100vw" priority className="h-full w-full object-cover" />
      {mountVideo && (
        <video
          muted
          loop
          playsInline
          preload="none"
          poster={poster.src}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
