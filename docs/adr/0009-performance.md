---
status: Accepted
date: 2026-09-17
extends: ADR-0005, ADR-0006, ADR-0007, ADR-0008
---
# ADR-0009 — Performance: measured baseline and the work that actually pays

The owner wants the site "extremely well optimised for the best speed". Measured on the current
static export (gzipped, 260 pages):

| Metric | Baseline |
|---|---|
| Home HTML | 22.6 KB · state page 24.5 KB · product page 22.6 KB |
| JS on home, modern browsers | ~126 KB (53 KB React + 45.6 KB Next shared + ~27 KB app) |
| JS, legacy `nomodule` polyfills | 38.6 KB (not loaded by modern browsers) |
| CSS (one file, all pages) | 8.3 KB |
| Fonts | 2 × WOFF2, preloaded |
| Images on disk | photos 1.2 MB · products 320 KB · categories 48 KB · certs 152 KB · video 164 KB |
| Largest single asset | 55.6 KB (`hero-welding.webp`) |
| Internal links per page | 53 home · 55 state · 49 country · **80 repair** |
| `prefetch={false}` in use | none |
| Client components | 19 |

## Where the time actually goes, in order
1. **Route prefetching.** App Router prefetches every `<Link>` that enters the viewport; static export
   serves an RSC payload (`.txt`) per route. A state page has 55 links, the repair page 80 — that is
   up to 80 extra requests triggered by a scroll, on mobile data. Nothing about the page looks slow in
   a lab test; it is bandwidth and main-thread cost nobody sees.
2. **One image size for every screen.** A 1920-wide hero is delivered whole to a 390 px phone, and
   everything is WebP-only with no AVIF. This is the single biggest byte saving available.
3. **Per-element JavaScript.** One `IntersectionObserver` per `Reveal` (30+ per page), one
   `pointermove` listener per `GlassCard`, a client accordion, a client count-up — all main-thread
   work for effects the platform can now do in CSS.
4. **`backdrop-filter` count.** Every glass surface composites a blurred backdrop; on low-end Android
   this dominates paint. Surfaces sitting on a flat background do not need it.

## Targets (mobile, Slow 4G, mid-range Android)
- LCP < 1.2 s · CLS 0 · INP < 100 ms · TBT < 100 ms
- First-view image bytes ≤ 150 KB on a 390 px viewport (from ~400 KB today)
- App JS (excluding React/Next runtime) ≤ 15 KB gz on the home page
- Requests on first view ≤ 25 (from 60+ once prefetch fires)
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO

## The work
1. **Responsive, modern images.** A build step (`scripts/optimize-images.mjs`) emits AVIF + WebP at
   640 / 1024 / 1600 / 1920 for every hero, slot, product and category image, plus a 20 px base64 LQIP.
   A `components/media/Img.tsx` renders `<picture>` with `srcset`/`sizes`, intrinsic width/height, the
   LQIP as a CSS background that fades out on load, `fetchpriority="high"` + `decoding="sync"` for the
   LCP hero and `loading="lazy"` + `decoding="async"` everywhere else. Every image component
   (`PageHero`, `ImageSlot`, `ImageBand`, `ProductCard`, `CategoryCard`, `Gallery`, `CertCard`) moves
   to it. `lib/photos.ts` carries the variant metadata.
2. **Prefetch discipline.** `prefetch={false}` on every bulk link list (city/state/country grids,
   `DividedList`, `LinkGrid`, `Chips`, `RelatedPages`, footer columns). Keep prefetch on the header
   nav, primary CTAs and product tiles — the links people actually click next.
3. **Less JavaScript for the same effect.**
   - Reveal: one shared module-level `IntersectionObserver` for all targets (not one each), and where
     `animation-timeline: view()` is supported, a pure-CSS reveal under `@supports` with the JS path as
     the fallback.
   - FAQ: native `<details name="faq">` exclusive accordion with CSS animation — delete the client component.
   - GlassCard sheen: one delegated `pointermove` listener on `document` (or CSS-only), not one per card.
   - Header scroll state: an `IntersectionObserver` sentinel instead of a scroll listener.
   - CountUp: driven by the shared observer; skipped entirely under reduced motion or Save-Data.
4. **Paint cost.** Keep `backdrop-filter` only where a surface genuinely overlaps imagery (nav, hero
   panel, panels on dark bands); elsewhere use an opaque/translucent background with the same look.
   Add `content-visibility: auto` + `contain-intrinsic-size` to below-the-fold sections.
5. **Delivery.** `vercel.json`: immutable caching already set — add it for `/photos`, `/products`,
   `/categories`, `/certs`; `Accept-CH`/`Vary` not needed for a static `<picture>`. Hero video gains
   `preload="none"`, mounts only on intersection, and is skipped on `navigator.connection.saveData`
   or `effectiveType` slower than `4g`.
6. **Guard rail.** `scripts/perf-budget.mjs` runs after `next build`, fails loudly if home JS, the
   largest image, or first-view bytes exceed the budgets above, and prints a per-route table.

Nothing here may change how the site looks (ADR-0008 governs that) or reduce rendered copy (ADR-0003).
