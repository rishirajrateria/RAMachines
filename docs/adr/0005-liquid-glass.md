---
status: Accepted
date: 2026-09-10
supersedes: ADR-0002, ADR-0004 (visual direction)
---
# ADR-0005 — "Liquid Glass": simple, minimal, futuristic

The owner rejected the previous looks ("too corporate", then "too busy"). New direction: **Apple Liquid
Glass** — calm, near-white, airy pages; frosted translucent surfaces floating over soft coloured light;
pill shapes; large light typography; one accent (teal); almost no decoration. Every SEO/content
requirement (SPEC §5–§6, ADR-0003 word floors) stays — but presented in far fewer, calmer blocks.

## 1. Canvas & light
- Page background `#F6F8F9`. Behind all content, a fixed full-viewport "light layer" (`components/layout/AmbientLight.tsx`,
  `position: fixed; inset: 0; z-index: -1; pointer-events: none`) with 3 large blurred radial gradients
  (teal `#0F766E` at 14 % opacity, aqua `#5EEAD4` at 12 %, white) placed top-left, right, bottom — blur
  via CSS `filter: blur(90px)` on absolutely positioned circles; static (no animation) except a very
  slow 40 s drift that is disabled under `prefers-reduced-motion`.
- Dark bands are gone. The only dark element is text.

## 2. Glass surfaces (`.glass`, `.glass-strong`, `.glass-pill`)
```css
.glass       { background: rgba(255,255,255,.55); backdrop-filter: blur(24px) saturate(160%);
               -webkit-backdrop-filter: blur(24px) saturate(160%);
               border: 1px solid rgba(255,255,255,.75);
               box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 10px 40px rgba(15,26,26,.08); border-radius: 28px; }
.glass-strong{ same with background rgba(255,255,255,.75) and blur(32px) }   /* nav, hero panel */
.glass-pill  { same as .glass with border-radius: 9999px; padding: .5rem 1rem }
@media (max-width: 767px) { .glass, .glass-strong { backdrop-filter: blur(14px) } }  /* GPU budget */
```
Cards have **no** hard borders, no tinted backgrounds, no top-edge accents. Hover: `translateY(-2px)` +
shadow to `0 16px 48px rgba(15,26,26,.12)`, 200 ms, disabled under reduced motion.

## 3. Type
- One family: **Manrope** (400 body, 600 headings). Drop Barlow from headings (keep the file; `font-display` maps to Manrope).
- Scale: H1 `clamp(2.75rem, 6vw, 5rem)` weight 600, letter-spacing −0.03em, line-height 1.02;
  H2 `clamp(1.9rem, 3.4vw, 2.75rem)` −0.02em; body 17px/1.65 (16px on mobile); eyebrow 12px uppercase
  tracking .14em teal; secondary text `grey-600`.
- Headlines are short and plain ("Machines", "Why RA Machine", "Where we work"). No underline bars.

## 4. Colour
- Text ink `#0F1A1A`; secondary `#5B5F68`; hairlines `rgba(15,26,26,.08)`.
- Accent **teal** `#0F766E` only: primary button, links, icons, small numerals, focus ring.
- Remove orange (`spark`) from the UI entirely (keep the token defined so old classes compile, but
  nothing may render it). No gradients on text or buttons.

## 5. Components
- **Header:** floating glass pill bar, `position: fixed; top: 12px`, centred, max-width 1100px, 56px tall:
  wordmark "RA Machine" (600), nav links (15px), "RA Auto ↗" text link, one teal pill "Request quote".
  Mobile: wordmark + a glass circle menu button; menu opens a glass sheet.
- **Buttons:** pills, 48px tall. Primary = teal fill, white text, subtle inner highlight. Secondary =
  `.glass-pill` with ink text. Tertiary = text link with arrow. No outlines with coloured borders.
- **Cards** (`GlassCard`): `.glass`, padding 28px, optional top artwork. Product/category tiles: artwork
  area is a soft light form (radial teal→transparent) with a **line-art glyph** of the machine (single
  1.75px ink stroke, no fills) — not the flat illustrations.
- **Chips:** `.glass-pill` small (34px), ink text; used sparingly (max one row per page section).
- **Facts strip** (`FactStrip`): one wide glass bar with 3–5 facts (big teal number/value, small label) —
  replaces GlancePanel and StatsBar.
- **Steps** (`Steps`): a single horizontal line with numbered dots and 4–6 short labels — replaces ProcessSteps' boxes.
- **List** (`DividedList`): two-column list with hairline dividers, no cards — for industries, sectors, applications.
- **Accordion** (`Faq`): glass container, hairline separators, plus/minus icon, one open at a time.
- **Footer:** plain (no band), hairline top, 4 slim columns, 13px grey text, wordmark.
- **WhatsApp float:** glass circle with the icon in WhatsApp green (only non-teal colour allowed).
- Icons: 1.5px stroke, 22px, teal, inside a 44px `.glass-pill` circle when used as a tile.

## 6. Page anatomy (max 7 sections; ≥ 96px vertical rhythm between sections; content max-width 1200px, prose 66ch)
- **Home:** (1) hero — full-viewport, ambient light, one centred `.glass-strong` panel: eyebrow, H1
  "Laser Cutting Machines Built in India, Trusted Worldwide", one sentence, two pill buttons, three
  tiny text links; (2) FactStrip (4 stats); (3) "Machines" — 4 category tiles (line-art glyph, name,
  one line, arrow); (4) "Why RA Machine" — 3 glass cards (icon, title, one sentence); (5) "Where we
  work" — two glass tiles (India: 8 state pills; World: 10 country pills); (6) certifications as a
  single row of small glass pills with names + "All certifications →"; (7) Faq (8) + one glass CTA
  panel with the QuoteForm. Testimonials: 3 short quotes in one glass strip (optional, keep if ≤ 40 words each).
- **Category / product:** hero panel (name, headline chips, two buttons) + line-art glyph; FactStrip
  (power, bed, materials, warranty); DividedList applications; product tiles; spec table inside glass;
  prose (66ch, calm) ; Faq; CTA.
- **Repair / training:** hero panel; FactStrip; Steps; DividedList (faults / curriculum); form in glass; Faq.
- **State / city / country:** hero panel (H1, one sentence, 3 facts) → FactStrip → "Industries" DividedList
  with machine links → 3 product tiles → Steps (delivery) → prose in one calm column (the unique facts,
  FAQs kept) → Faq → CTA. No chips rows beyond the hero facts; no duplicate "at a glance" panels.
- Breadcrumbs: tiny grey text above the hero panel. AboutBlurb: a single italic-free grey paragraph
  under the hero, 2 sentences max.

## 7. Artwork
Replace flat illustrations with **line-art glyphs** (SVG, stroke only, ink `#0F1A1A` at 1.75px, rounded
joins; 8 products + 4 categories, drawn simply and elegantly) rendered on transparent backgrounds
(PNG/WebP with alpha) at the existing paths/sizes, placed over soft light forms in the tiles. Hero
poster: light forms only (no machine drawing) with a faint line-art gantry on the right third; hero
video: slow drifting light forms. Certificate images: minimal glass badge (ring + name). OG image:
light forms + wordmark + title.

## 8. Performance & a11y
`backdrop-filter` limited to nav, hero panel, cards in view (no more than ~12 glass elements per page
render); mobile blur 14px; all animations respect reduced motion; contrast: ink on glass ≥ 7:1, teal on
glass ≥ 4.5:1 (verify against the lightest glass over the brightest orb); focus ring 2px teal.

## 9. Ownership for this pass
| Worker | Owns |
|---|---|
| glass-design | `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `app/fonts.ts`, `components/**`, `lib/og.tsx`, `scripts/**`, `public/**` (except `public/video`) |
| glass-home | `app/page.tsx`, `app/_home/**`, `app/about/**`, `app/contact/**`, `app/certifications/**`, `app/privacy-policy/**`, `app/terms/**`, `app/not-found.tsx` |
| glass-catalog | `app/products/**`, `app/services/**` |
| glass-india | `app/india/**`, `lib/copy/state.ts`, `lib/copy/city.ts` |
| glass-export | `app/export/**`, `lib/copy/country.ts` |
