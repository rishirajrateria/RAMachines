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
 * The existing `.glass-strong` panel sits over the image, carrying whatever the page
 * worker passes as `children` (breadcrumbs, eyebrow, H1, one sentence, buttons, the
 * page's 3 inline facts — "nothing else in the hero", ADR-0007 §1): `align="center"`
 * (home) centres it; `align="start"` (every inner page, the default) bottom-left
 * aligns it. `.page-hero .glass-strong` is raised to a stronger opacity in
 * app/globals.css so panel text keeps AA contrast over a photographic background.
 *
 * `overlay` renders above the image at 35% opacity, below the scrim and panel — home
 * passes the existing `<HeroVideo/>` here so its drifting light forms still show
 * through, without HeroVideo having to know anything about the photo underneath it.
 */
import type { ReactNode } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";

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
    <section className={`page-hero relative flex w-full overflow-hidden py-16 ${heightClass} ${verticalAlign}`}>
      <div className="kenburns absolute inset-0">
        <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
      </div>
      {overlay && <div className="absolute inset-0 opacity-35">{overlay}</div>}
      <div className="hero-scrim absolute inset-0" />
      <Container className="relative w-full">
        <div className={`hero-panel hero-stagger glass-strong p-8 md:p-16 ${panelAlign}`}>{children}</div>
      </Container>
    </section>
  );
}
