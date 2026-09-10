"use client";

/**
 * components/media/HeroVideo.tsx — full-viewport hero background. The poster image is
 * the LCP element and renders immediately via <Image priority>. The <video> itself is
 * only mounted after first paint (requestIdleCallback, falling back to a short timeout)
 * and only when the visitor has not requested reduced motion, so it never competes with
 * or delays LCP.
 */
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroVideo({
  poster,
  posterAlt,
}: {
  poster: { src: string; width: number; height: number };
  posterAlt: string;
}) {
  const [mountVideo, setMountVideo] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => setMountVideo(true));
    } else {
      timeoutId = window.setTimeout(() => setMountVideo(true), 200);
    }

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden">
      <Image
        src={poster.src}
        alt={posterAlt}
        width={poster.width}
        height={poster.height}
        priority
        className="h-full w-full object-cover"
      />
      {mountVideo && (
        <video
          muted
          loop
          playsInline
          preload="metadata"
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
