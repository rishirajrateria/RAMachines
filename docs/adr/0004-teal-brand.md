---
status: Accepted
date: 2026-09-10
supersedes: ADR-0002 palette
---
# ADR-0004 — Teal brand palette with subtle gradients

The owner's brand colour is **teal**. Replace steel blue as the primary everywhere and add subtle,
tasteful gradients (never loud, never rainbow).

## Palette
- `teal` primary #0F766E · hover #0B5C56 · deep #084C47 · light #2A9D93 · soft tint #E6F4F2 · softer #F2FAF9
- `spark` warm accent stays (#F26A21, soft #FFF1EA) but is used sparingly: primary CTA highlight,
  laser sparks in artwork, small numerals. Everything that was `steel` becomes `teal`
  (keep the `steel` token name as an alias pointing at teal values so nothing breaks).
- `ink` #0F1A1A (slightly teal-black) for dark bands and text; greys unchanged.

## Gradients (subtle)
- Hero / dark bands: `linear-gradient(135deg, #0F1A1A 0%, #0B3B38 55%, #0F766E 130%)` plus a soft
  radial teal glow behind the artwork.
- Soft bands: `linear-gradient(180deg, #F2FAF9 0%, #FFFFFF 100%)` or teal-soft → white.
- Primary buttons: `linear-gradient(180deg, #14857C, #0F766E)` with a 1px darker border; hover lifts
  and darkens. Spark buttons likewise (#F5772F → #F26A21).
- Cards: white with a 1px teal-soft border and `shadow-card`; hover gets a faint teal-soft gradient
  top edge (2px) — no full-card gradients.
- GlancePanel / AboutBlurb: teal-soft → white gradient background.
- Section titles: spark underline becomes a short teal→spark gradient bar.
- Stat numbers: teal gradient text (`background-clip: text`) — large text only.
- Footer: ink → deep-teal gradient top band.
Contrast: all body text stays AA; teal on white is fine for text ≥ 14px semibold; never light-teal text
on white.

## Artwork
Recolour illustrations: steel blues → teal family; keep spark orange for sparks/beam; badges tinted
teal/spark alternately; hero poster background follows the dark gradient above.
