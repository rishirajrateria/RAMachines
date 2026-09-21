/**
 * components/layout/PageHero.tsx — ADR-0007 §1: every page starts with a full-bleed
 * image banner. `size="full"` (home) is `min-height: 100svh`; `size="tall"` (every
 * other page, the default) is `min-height: 70svh` on mobile, `78svh` from `md:`. The
 * image is `next/image` with `fill` + `priority` + `object-cover`, explicit
 * `sizes="100vw"` (it is always viewport-width) and a slow Ken Burns drift
 * (`.kenburns`, scale 1 → 1.06 over 18s, alternate, off under reduced motion — see
 * app/globals.css). A soft scrim (`.hero-scrim`) fades the image into the page
 * canvas at the bottom so content below sits on the same `#F6F8F9` background.
 *
 * The copy — whatever the page passes as `children` (breadcrumbs, eyebrow, H1, one
 * sentence, buttons, the page's 3 inline facts — "nothing else in the hero",
 * ADR-0007 §1) — sits DIRECTLY on the photograph, with no panel behind it:
 * `align="center"` (home) centres it, `align="start"` (every inner page, the
 * default) bottom-left aligns it.
 *
 * Legibility comes from `.hero-scrim` (a cinematic darkening gradient over the
 * image) plus the `.hero-copy` colour rules in app/globals.css, which flip the
 * copy to white — measured, not assumed: scripts/verify-hero-contrast.mjs samples
 * the real rendered pixels behind the H1 and body text on a representative set of
 * routes and fails if any falls under WCAG AA.
 *
 * `pt-28` (not the symmetric `py-16` this used to carry) is deliberate: now that
 * the hero runs to the top of the viewport, the floating header sits INSIDE it.
 * On pages with a tall H1 the copy grows upwards until it would tuck under that
 * header — the breadcrumb was landing within 8px of it — so the top padding
 * reserves the header's own height plus clearance.
 *
 * `overlay` renders above the image at 35% opacity, below the scrim and panel — home
 * passes the existing `<HeroVideo/>` here so its drifting light forms still show
 * through, without HeroVideo having to know anything about the photo underneath it.
 *
 * ADR-0009 §1: the image renders via `components/media/Img` (`<picture>`,
 * AVIF/WebP srcset, LQIP) instead of `next/image` — `fill` + `priority` + `sizes="100vw"`.
 */
import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Img from "@/components/media/Img";

export default function PageHero({
  image,
  size = "tall",
  align = "start",
  overlay,
  children,
}: {
  image: { src: string; alt: string };
  size?: "full" | "tall";
  align?: "center" | "start";
  overlay?: ReactNode;
  children: ReactNode;
}) {
  const heightClass = size === "full" ? "min-h-[100svh]" : "min-h-[70svh] md:min-h-[78svh]";
  const verticalAlign = align === "center" ? "items-center" : "items-end";
  const panelAlign = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl text-left";

  return (
    <section className={`page-hero relative flex w-full overflow-hidden pb-16 pt-28 ${heightClass} ${verticalAlign}`}>
      <div className="kenburns absolute inset-0">
        <Img image={image} sizes="100vw" fill priority />
      </div>
      {overlay && <div className="absolute inset-0 opacity-35">{overlay}</div>}
      <div className="hero-scrim absolute inset-0" />
      <Container className="relative w-full">
        <div className={`hero-copy hero-stagger ${panelAlign}`}>{children}</div>
      </Container>
    </section>
  );
}
