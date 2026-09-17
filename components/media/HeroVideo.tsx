/**
 * components/media/HeroVideo.tsx — full-viewport hero background. The poster image is
 * the LCP element and renders immediately via `Img priority` (ADR-0009 §1: `<picture>`,
 * AVIF/WebP srcset, LQIP — instead of `next/image`).
 *
 * ADR-0010: a Server Component. The clip lives in an inert `<template>`, so the
 * browser never fetches it during parse; public/enhance.js clones that template
 * into the page only once the hero is near the viewport, and skips it entirely
 * under `prefers-reduced-motion`, `navigator.connection.saveData`, or an
 * `effectiveType` slower than 4G. Without JavaScript the poster image — which is
 * the LCP element either way — is simply the hero, and no video bytes are ever
 * requested.
 */
import Img from "@/components/media/Img";

export default function HeroVideo({
  poster,
  posterAlt,
}: {
  poster: { src: string; width: number; height: number };
  posterAlt: string;
}) {
  return (
    <div data-herovideo className="absolute inset-0 h-full w-full overflow-hidden">
      <Img
        image={{ src: poster.src, alt: posterAlt, width: poster.width, height: poster.height }}
        sizes="100vw"
        priority
        className="h-full w-full object-cover"
      />
      <template
        dangerouslySetInnerHTML={{
          __html: `<video muted loop playsinline preload="none" poster="${poster.src}" class="absolute inset-0 h-full w-full object-cover"><source src="/video/hero.webm" type="video/webm" /><source src="/video/hero.mp4" type="video/mp4" /></video>`,
        }}
      />
    </div>
  );
}
