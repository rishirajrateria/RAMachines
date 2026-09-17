# ADR-0010 — Ship the static site without React hydration

Status: accepted
Supersedes parts of: ADR-0009 §3 (which optimised *within* the hydration model)

## Context

`npm run build` produces a fully static export (`output: 'export'`, 261 routes).
Measured on the build of 2026-09-17:

| | home | inner pages |
|---|---|---|
| modern-browser JS (gz) | 135.6 KB | 114.2 KB |
| of which React/Next framework | 111.7 KB | 111.7 KB |
| HTML (raw) | 213.4 KB | ~190 KB |
| of which RSC hydration payload | **123.9 KB (58%)** | ~55% |

So roughly **112 KB of JS and half of every HTML document exist only to hydrate
React on the client**. What that hydration actually buys this site is:

1. reveal-on-scroll (already has a pure-CSS path — `animation-timeline: view()`)
2. a stat count-up animation
3. a pointermove specular sheen on cards
4. the header pill's scrolled state
5. the mobile nav sheet open/close
6. the hero video's lazy mount
7. click-to-load map
8. certificate image modal
9. the /products category filter
10. a `fetch()` enhancement over a form that already works as a native POST

Items 1–9 are each a few lines of DOM work; item 10 is optional by construction.
None of them needs a virtual DOM, and none of them needs the server-rendered
markup to be re-created on the client. The active-nav-link state (`usePathname`)
does not need JS at all: every route is pre-rendered, so the correct link is
already marked in each page's HTML.

Paying 112 KB of parse/compile/execute plus a doubled document to get ~4 KB of
behaviour is the wrong trade for a static marketing site.

## Decision

**The exported HTML is shipped as HTML.** React renders the pages at build time
and is then dropped entirely from the client. A single hand-written vanilla
script, `public/enhance.js`, provides all of the behaviour above.

Mechanically:

- Every component that previously carried `"use client"` becomes a Server
  Component that renders complete, final markup plus `data-*` hooks. Where a
  component had two visual states (nav open/closed, filter active/inactive,
  modal panel shown/hidden), **both** states are rendered and toggled by
  attribute, never constructed at runtime.
- `scripts/dehydrate.mjs` runs after `next build` and, for each `out/**/*.html`:
  removes Next's `<script src="/_next/...">` tags, removes the inline
  `self.__next_f.push(...)` RSC payload scripts, and injects
  `<script src="/enhance.js" defer>`. It then deletes the now-unreferenced
  `_next` chunk files and the `.txt` RSC route payloads.
- JSON-LD (`<script type="application/ld+json">`) is explicitly preserved — it
  is page content, not runtime.

## Consequences

**Navigation is a normal browser navigation.** No client-side router, no
prefetch. Each document is ~10–14 KB gzipped and CDN-cached with an immutable
CSS/font/image layer, so a cold click is a single small HTML fetch. This also
removes the per-link RSC `.txt` prefetch traffic ADR-0009 flagged as a cost on
pages carrying 53–80 links.

**No-JS is a first-class path, and must stay that way.** Every interaction
degrades to something usable without `enhance.js`:

| feature | without JS |
|---|---|
| reveal-on-scroll | content is simply visible (the `js` class is never added) |
| count-up | the final number is already in the HTML |
| sheen, header pill | static resting state |
| mobile nav | `:target` CSS fallback opens the sheet |
| hero video | poster image (which is the LCP element anyway) |
| map | a link to Google Maps instead of the embed |
| certificate modal | `<dialog>` rows link to the full-size image |
| product filter | all cards visible, chips are links to the category pages |
| quote form | native `<form method="POST">` to Web3Forms |

**Failure mode is guarded.** The `js` class gates the reveal's hidden initial
state, so a failed `enhance.js` fetch could otherwise leave content invisible.
The inline bootstrap therefore removes `js` again if `enhance.js` has not booted
within 3s (`window.__enh`).

**If a future feature genuinely needs React on the client**, delete the
`dehydrate` step from `postbuild`. Everything else keeps working — the
components are still valid React, they simply stopped needing to be interactive.

## Targets (replaces ADR-0009 §Targets for JS)

- any route, modern-browser JS: **≤ 8 KB gz** (was 130 KB on home)
- home HTML: ≤ 19 KB gz; any other route: ≤ 16 KB gz
- single optimised image: ≤ 120 KB (unchanged)
- home first-view images at 390px: ≤ 150 KB (unchanged)

`scripts/perf-budget.mjs` enforces these for every route, not just the home page.
