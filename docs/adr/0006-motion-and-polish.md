---
status: Accepted
date: 2026-09-10
extends: ADR-0005
---
# ADR-0006 — Motion & polish for the Liquid Glass UI

Owner feedback: "right path — make it better, add slight animations if necessary". This ADR adds a
restrained motion system and finishing details. Rules: every animation ≤ 700 ms, eased
(`cubic-bezier(.22,.61,.36,1)`), GPU-only properties (transform/opacity/filter), no layout thrash, no
libraries, everything off under `prefers-reduced-motion: reduce` (elements simply appear).

## Motion
1. **Reveal on scroll** — `components/ui/Reveal.tsx` (*client*, IntersectionObserver, threshold .15,
   once): children start `opacity:0; translateY(14px)` and animate to rest; supports `delay` and
   `stagger` for children (`data-stagger`, 60 ms steps, max 6). `Section`, `GlassCard`, `FactStrip`,
   `DividedList`, `Steps`, `Faq`, product/category tiles are wrapped automatically — pages need no change.
   Server-render visible (no-JS = visible): add the hidden state only after hydration via a class on `<html>`.
2. **Hero entrance** — glass panel: opacity 0 → 1, translateY(18px) → 0, scale(.985) → 1 over 700 ms on load;
   eyebrow, H1, text, buttons stagger 80 ms. Ambient light drifts (40 s loop, ±3 %).
3. **Nav** — on scroll > 24px the pill gets slightly more opaque (.75 → .85), blur 32 → 40, height 56 → 50,
   shadow deepens; 250 ms. Active link gets a soft glass pill behind it (`layout`-free: pseudo-element).
4. **Hover** — cards: translateY(-3px) + shadow; a specular sheen (radial highlight following the cursor via
   CSS vars `--mx/--my` set in a tiny pointermove handler in `GlassCard`; desktop only, pointer:fine).
   Buttons: scale(1.02) + brighter inner highlight; primary teal gets a faint outer glow. Links: underline
   grows from left (background-size transition). Tiles: glyph rises 4px.
5. **Numbers** — `FactStrip` values that parse as numbers count up over 900 ms when revealed (respect
   prefixes/suffixes like "500+", "6–8 weeks" → only animate pure numbers).
6. **Accordion** — `Faq` opens with height animation (grid-template-rows 0fr → 1fr, 300 ms) and the
   plus rotates to a minus. Only one open at a time.
7. **Mobile menu** — glass sheet slides down + fades (250 ms); backdrop fades.
8. **Focus** — teal ring with 2px offset; visible on keyboard only (`:focus-visible`).

## Polish
- Glass edge: add a 1px specular top-left highlight via `::before` with a masked gradient border
  (`linear-gradient(135deg, rgba(255,255,255,.9), rgba(255,255,255,.15) 40%, transparent)`).
- Type: H1 letter-spacing −0.035em; body 17px/1.7; eyebrow 11.5px tracking .16em; section titles get
  a one-line grey "lede" beneath when provided.
- Rhythm: section spacing 112px desktop / 72px mobile; hero panel padding 64px desktop.
- Tiles: glyph sits on a soft radial light; add a faint 1px hairline separator above the tile footer.
- FactStrip: values 34px 600, labels 13px grey, hairline dividers between facts on desktop.
- Footer: 13px, hairline, wordmark left, four columns, "Made in India" line — no motion.
- WhatsApp float: glass circle with a soft green ring pulse (2 s, subtle, reduced-motion off).
- 404 page: glass panel, one line, two links.
- Scrollbar: thin, grey (WebKit/Firefox), only on desktop.
- Meta theme-color `#F6F8F9`; selection colour teal-soft.
