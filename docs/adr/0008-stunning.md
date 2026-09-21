---
status: Accepted
date: 2026-09-17
extends: ADR-0005, ADR-0006, ADR-0007
---
# ADR-0008 — Make it stunning: real product renders, scene imagery, editorial layout

The owner: "the website can be better looking… I want it to look stunning." An honest audit of the
current build shows three causes, in order of impact:

1. **The machines are wireframes.** Product/category art is thin 1.75px outline glyphs floating in
   large pale boxes. On a machine-tool site the machine is the hero; a wireframe reads as unfinished.
2. **The imagery has no subject.** The photo placeholders are blurred teal gradients with a faint
   silhouette — atmospheric fog, not a scene. Nothing to look at.
3. **No contrast or hierarchy.** Everything is one pale value (#F6F8F9 + white glass + teal), every
   card the same size, every heading the same weight. Calm, but flat and forgettable.

This ADR fixes all three. Liquid Glass (ADR-0005), the motion system (ADR-0006) and the photography
structure (ADR-0007) all stay; what changes is the quality of what fills them.

## 1. Product renders (highest priority)
Replace every outline glyph with a **3/4-perspective vector render** (SVG → WebP via sharp, drawn at
2× and downsampled). Each machine must read as a real object:
- **Form:** viewed from slightly above and to the front-left, with correct perspective — parallel
  machine edges converge; the bed is a parallelogram, not a rectangle.
- **Material:** painted steel body in graphite→teal vertical gradients with panel seams and rounded
  enclosure corners; brushed-metal rails (fine linear gradient); dark rubber feet; a smoked-glass
  guard panel with a translucent white sheen.
- **Light:** one key light upper-left (soft specular sweep across top surfaces), a cool rim light on
  the leading edge, ambient occlusion where parts meet, and a soft elliptical contact shadow plus a
  short fading floor reflection under the machine.
- **Detail that sells it:** slatted bed with visible depth, a sheet with cut-out parts (gear,
  bracket, flange), cable chain, cutting head with nozzle cone and sensor ring, control cabinet with a
  faint UI on its screen, a small nameplate with the SKU, gas cylinders where relevant.
- **The beam:** a thin bright core line with an additive bloom halo, striking the sheet in a spark
  burst — 12–18 radiating sparks of varying length/opacity with small glowing tips and a hot white
  core fading to amber (#FFB067) then teal ambient. This is the one warm accent allowed.
- Transparent background (alpha) so tiles supply their own ground. Keep every existing filename,
  dimension and the three angles per SKU (front 3/4, detail close-up, in-use with sparks).
- The machines must differ visibly: F1530 compact open-frame; F3015 Pro mid enclosure + exchange
  table; F6020 HD long bed, heavier gantry, full enclosure; F12K largest with cabin and stairs;
  T6000 tube laser with chuck, rollers, tube rack and a cut tube; C1390 CO2 with lift lid, honeycomb
  bed and engraved panel; RW6 robot arm on pedestal with torch, fixture and fence; RW10 dual-station
  cell with turntable, two fixtures and a curtain.

## 2. Scene imagery
Replace the fog with **composed scenes** built from layers, not blurs:
- **Factory interior** (`hero-*`, `slot-factory`, `slot-assembly`, `slot-warehouse-spares`):
  one-point perspective — floor plane with a reflective sheen and receding grid, ceiling trusses,
  hanging lamps casting visible light cones through a faint haze, a row of machines diminishing into
  depth, a scale figure, crates. Warm light pools against cool shadow; atmospheric perspective (distant
  objects lower contrast, bluer); fine film grain; vignette.
- **Macro** (`slot-cutting-head`, `slot-sparks`): extreme close-up of the head and the cut line with a
  bright molten point, a spark shower with motion streaks, and a strongly blurred background (large
  soft bokeh discs) — genuine shallow depth of field.
- Other slots (`slot-port`, `slot-crate-shipping`, `slot-training-room`, `slot-office`,
  `slot-engineer-service`, `slot-team`, `slot-installation`, `slot-quality-check`,
  `slot-robot-weld`, `slot-control-panel`, `slot-tube-cutting`): each a distinct composed scene with a
  clear subject, foreground/midground/background separation and directional light.
- Heroes are darker and more cinematic than slots (they carry white text): keep the left 45 % calmer.
- Keep filenames, sizes and the ≤ 180 KB budget (heroes ≤ 220 KB).

## 3. Layout: contrast and editorial hierarchy
- **Value rhythm:** the page alternates light (#F6F8F9) and **deep sections** (`ink` #0B1414 → teal
  deep gradient, white text, glass panels at 12 % white). At least two dark sections on the home page
  (the machine showcase and the CTA) and one on inner pages. Dark sections carry a faint grain overlay.
- **Bento grid:** the home "Machines" section becomes an asymmetric grid — one feature tile spanning
  2 columns × 2 rows with a large render and big spec numerals, plus smaller tiles. Not four equal cards.
- **Type:** display scale up (H1 `clamp(3rem, 7vw, 6rem)`, −0.04em); a new `text-stat`
  (`clamp(2.5rem,5vw,4rem)`, 600, tabular numerals) for spec/stat numerals; eyebrows 11px/.18em;
  body 17/1.7 unchanged. Section headings may run to two lines with a deliberate line break.
- **Product presentation:** each machine sits on a soft radial "pedestal" glow with its contact
  shadow, spec chips as large tabular numerals beneath, and the render scaled to fill ~80 % of its tile
  (currently ~35 %). On hover the render lifts 6px and its pedestal glow brightens.
- **Depth:** two-layer shadows (tight contact + wide ambient), 1px inner highlight on the top edge of
  every surface, and a 2 % monochrome grain overlay on dark sections only.
- Accessibility unchanged: AA contrast, reduced-motion honoured, no horizontal overflow.

## 4. Ownership
| Worker | Owns |
|---|---|
| art-machines | `scripts/illustrations/**`, `scripts/generate-placeholders.mjs`, `public/products/**`, `public/categories/**`, `public/illustrations/**` |
| art-scenes | `scripts/generate-photos.mjs`, `public/photos/**` |
| design-depth | `tailwind.config.ts`, `app/globals.css`, `components/**`, `lib/og.tsx` |
| home-editorial | `app/page.tsx`, `app/_home/**` |
