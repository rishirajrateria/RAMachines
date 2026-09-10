---
status: Accepted
date: 2026-09-10
supersedes: ADR-0001 §1 (tokens/radius), SPEC §9 design direction (partially)
---
# ADR-0002 — Visual refresh: warmer, more visual, less corporate

The owner reviewed the first build and asked for a site that is "more visually appealing, not so
corporate — too much text, no images or icons". This ADR replaces the restrained European-machine-tool
look with a warmer industrial look while keeping every SEO/content requirement of SPEC §5–§6 intact.

## Direction
- **Palette:** keep white ground + `ink` text + `steel` blue (#1F4E79) for links/primary buttons, and ADD a
  warm laser accent `spark` (#F26A21, hover #D65A17, soft tint #FFF1EA) for highlights, icons, badges,
  numbers, section eyebrows and secondary CTAs. Add tinted section backgrounds: `steel-soft` (#E8EEF5),
  `spark-soft` (#FFF1EA), `grey-50`, and one dark band style `ink` with white text for the hero/CTA.
  Subtle linear gradients are now allowed on the hero/CTA dark bands and on illustration backgrounds only.
- **Shape:** radius scale up to 16px (`rounded-xl` = 16px, `rounded-lg` = 12px, `rounded-md` = 8px); cards
  get soft shadows (`shadow-card`: 0 1px 2px rgba(17,18,20,.06), 0 8px 24px rgba(17,18,20,.08)).
- **Icons everywhere:** every section eyebrow, every "why" point, every service, every FAQ group, every
  spec group, every process step, every stat and every nav item gets an inline SVG icon (24px stroke
  icons, 1.75 stroke, rounded caps). Expand `components/ui/Icons.tsx` to ≈ 36 icons.
- **Illustrations instead of grey boxes:** generate stylised SVG artwork (flat, 2–3 colour: ink, steel,
  spark on tinted backgrounds) for the 8 products (machine silhouettes: flatbed fiber laser with gantry,
  tube laser with chuck, CO2 engraver, 6-axis robot arm on a table, dual-station cell), the 4 categories,
  the hero poster (a laser head cutting a sheet with a spark burst, dark ink background), the about/factory
  image and the 9 certificate badges (rosette/ribbon badge style with the certificate name). Render them
  to WebP/PNG with `sharp` at the existing paths/sizes so nothing else needs to change.
- **Less wall-of-text:** long copy stays in the HTML (SEO), but the page top must be visual: hero band with
  icon chips, an "At a glance" panel (icons + facts: industries, delivery time, service, training,
  voltage/ports on export pages), industry chips, product picks as illustrated cards, a numbered
  process-steps graphic, then the prose in alternating two-column blocks with an icon column, then FAQ.
  Paragraph max-width 65ch, generous spacing, h2 with a spark underline accent.
- **Home page:** hero (illustrated poster + short punchy copy + two buttons + icon chip row), stats with big
  spark numbers, illustrated category cards, product carousel-style grid (CSS scroll-snap on mobile),
  "Why RA Machine" as 6 icon cards on a tinted band, services as 4 illustrated cards, certifications as
  badge grid, India + world reach as two illustrated cards with flag/pin icons and link chips,
  testimonials as cards with initials avatars, FAQ, dark CTA band.
- Keep: accessibility (AA contrast — spark on white is for large text/icons only, never small body text),
  one H1, breadcrumbs, JSON-LD, forms, performance rules (all images sized, illustrations ≤ 60 KB each).

## Ownership for this refresh
| Worker | Owns |
|---|---|
| design2 | `tailwind.config.ts`, `app/globals.css`, `components/**`, `lib/**` (except `lib/copy/**`), `scripts/generate-placeholders.mjs`, `public/**` (except `public/video`) |
| home2 | `app/page.tsx`, `app/_home/**`, `app/about/**`, `app/contact/**`, `app/certifications/**` |
| catalog2 | `app/products/**`, `app/services/**` |
| india2 | `app/india/**`, `lib/copy/state.ts`, `lib/copy/city.ts` |
| export2 | `app/export/**`, `lib/copy/country.ts` |
