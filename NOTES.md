# NOTES — RA Machine website

Fully static Next.js 15 site (App Router, `output: 'export'`), Tailwind CSS, no backend, no CMS.
`npm install && npm run build && npm run start` builds to `out/` and serves it on port 3000.

## 1. Assumptions made (spec left these open)
| Topic | Assumption |
|---|---|
| Domain | `https://www.ramachine.com` in `config/site.ts → url` (PLACEHOLDER). Change before deploy; sitemaps, canonicals, OG and JSON-LD all derive from it. `NEXT_PUBLIC_SITE_URL` overrides it at build time. |
| Founded year | 2009 (PLACEHOLDER) → `site.foundedYear`, drives the About timeline and the "since" entity sentence. |
| Hours | Mon–Sat 10:00–18:00 IST as suggested. |
| Service commitments | 48-hour on-site response (metros/major clusters), 4-working-hour remote response, 24-month warranty, 6–8 week lead time, 30/70 export payment, FOB Kolkata / CIF nearest port — all in `site.service` and all PLACEHOLDER. |
| City count | 169 city pages: 8 for the 14 large industrial states/UTs (Delhi uses its industrial areas — Okhla, Bawana, Narela… — as "cities"), 4 for medium states and J&K, 2 for the seven north-eastern states, 1–2 for small UTs. |
| Job-work page | Reachable only from the footer and the home services strip; `noindex, follow`; excluded from sitemaps; the only page allowed to use the phrase "laser cutting job work". |
| Images | `next/image` with `unoptimized: true` (required for static export) and pre-generated WebP; every image has explicit width/height. |
| Delhi NCR | Gurugram/Faridabad/Manesar sit under Haryana and Noida/Ghaziabad under Uttar Pradesh; Delhi UT gets its own page with industrial areas. |
| Video | A 5-second, 7–9 KB synthetic placeholder is committed so the hero works out of the box. |

## 2. Typography (why these fonts)
- **Manrope** (400/600) for UI and body: a contemporary grotesque with open counters and tabular-friendly numerals, so spec tables read cleanly; corporate without looking like Inter/Roboto.
- **Barlow Semi Condensed** (600) for headlines: an engineered, slightly industrial face that keeps long keyword-rich H1s ("Laser Cutting Machine in Chhatrapati Sambhajinagar…") on two lines on mobile. Its DIN-like character suits a machine-tool manufacturer.
- Both are OFL, self-hosted from the `@fontsource` packages, Latin subset only, `display: swap`, loaded via `next/font/local` in `app/fonts.ts` (three files, ~51 KB total). To change a font: drop the `.woff2` in `app/fonts/` and edit `app/fonts.ts`.

## 3. Replacing placeholders
| What | Where | How |
|---|---|---|
| Hero video | `public/video/hero.mp4`, `hero.webm`, poster `public/hero-poster.webp` | Replace with a real 1080p clip (≤ 3 MB, muted, 5–10 s loop; H.264 mp4 + VP9 webm). Poster must be a real frame, 1920×1080 WebP. |
| Product photos | `public/products/<slug>-1.webp` … `-3.webp` (1200×900) | Same file names, same aspect ratio. Update `alt` text in `data/products.ts`. |
| Category images | `public/categories/<slug>.webp` (1200×800) | Same names. |
| Certificates | `public/certs/<slug>.webp` (600×800, 3:4) | Replace with scans; keep 3:4 so cards and the modal do not shift. |
| Brochures | `public/brochures/<slug>.pdf` | Replace the one-page placeholder PDFs. |
| Logo / favicon | `public/logo.svg`, `app/icon.svg` | Replace SVGs; keep square icon. |
| Company stats | `config/site.ts → stats` | Edit the four numbers. |
| Email / phone / address / hours / social | `config/site.ts` | One place; every page and every JSON-LD block reads from it. |
| Products | `data/products.ts` | Replace the 8 dummy SKUs; keep the `Product` shape from `data/types.ts`. Slugs are used in URLs and in state/city/country recommendations — search for a slug before renaming it. |
| Testimonials | `data/testimonials.ts` | Each entry is marked `// PLACEHOLDER`. |
| Regenerate placeholders | `npm run placeholders` | Re-creates every grey placeholder asset (uses `sharp`). Safe to delete the script once real assets are in. |

## 4. Forms — Web3Forms setup (no backend)
1. Go to https://web3forms.com, enter the destination email (use the same address you put in `config/site.ts → email`) and confirm the email you receive. You get an **Access Key**.
2. Locally: copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_WEB3FORMS_KEY=<your key>`.
3. On Vercel: Project → Settings → Environment Variables → add `NEXT_PUBLIC_WEB3FORMS_KEY` for Production (and Preview), then redeploy. The key is public by design (it is only a routing identifier); spam is limited by the hidden honeypot field (`botcheck`) and Web3Forms' own filters. Optional: enable hCaptcha in the Web3Forms dashboard.
4. Change the recipient later by generating a new key for the new address in the Web3Forms dashboard and updating the environment variable — no code change.
5. Each form posts JSON to `https://api.web3forms.com/submit` with `from_name` = "RA Machine website" and a `subject` that names the form (Quote / Repair / Training / Job work / Contact / Export) so emails are easy to filter. On failure the form shows a WhatsApp fallback link.

## 5. Deploying
**Vercel (primary):** import the repo; `vercel.json` pins the project to a plain static deployment (`framework: null`, build `npm run build`, output `out`, clean URLs, immutable cache headers, PNG content-type for the extension-less OG images). This deliberately bypasses Vercel's Next.js builder, which fails on `output: 'export'` projects with a "routes-manifest.json couldn't be found" error. Add the env var from §4. Production follows the `main` branch; set the production domain, then update `config/site.ts → url`.

**Cloudflare Pages:** create a Pages project from the repo, build command `npm run build`, output directory `out`, Node 20+. Add the same env var. No adapter is needed because the site is a pure static export; `_headers` is not required (Cloudflare caches hashed `/_next/static` assets by default).

Any static host works (Netlify, S3 + CloudFront, nginx): serve `out/` with clean URLs (`/about` → `/about.html`).

## 6. Adding places and products
- **State/UT:** add it to `data/india-index.ts` (slug, name, type, tier, region, capital, cities), then add a `State` entry in `data/states.ts` and a `City` entry per city in `data/cities/*.ts`. Pages, sitemaps, footers, llms.txt and the audit pick it up automatically.
- **City:** add to the state's `cities` array in `data/india-index.ts`, then add the `City` entry. Set `isTop: true` to show it in the footer (keep 12).
- **Country:** add a `Country` entry in `data/countries/<region>.ts`. Set `isTop: true` for the footer (keep 10).
- **Product / category:** `data/products.ts`, `data/categories.ts`. Add images and a brochure with the same slug.
Run `npm run build` — the post-build audit (`content-audit.md`) flags any thin page, duplicate title or duplicate H1.

## 7. How this repo was built (ruflo)
The site was produced by a ruflo swarm (`npx ruflo init`, `.claude/agents/`, `.mcp.json`): the integration owner wrote the contracts (`docs/SPEC.md`, `docs/adr/0001-stack-and-ownership.md`, `config/`, `data/types.ts`, `data/india-index.ts`) and dispatched ruflo `coder`/`reviewer` agents as headless workers with disjoint file ownership via `scripts/ruflo-worker.sh`. Agent definitions are kept so future work can use the same workflow; runtime state (`.claude-flow/data`, `.swarm`, `ruvector.db`) is git-ignored. The `.mcp.json` server starts on demand only inside Claude Code and is not part of the website build.

## 8. Performance — measured on the final build
| Metric (home page, static export) | Value |
|---|---|
| Pre-rendered HTML pages | 260 (+ 277 static OG images, split sitemaps, robots, llms.txt, llms-full.txt) |
| Home HTML (gzipped) | 27.5 KB |
| CSS (gzipped, single file, all pages) | 5.3 KB |
| Site-specific JS on home (gzipped) | ≈ 15 KB (layout 2.6 KB, page 3.9 KB, shared UI chunks ≈ 8.6 KB) |
| Next.js 15 + React 19 client runtime (gzipped) | ≈ 101 KB (two framework chunks) |
| Legacy polyfills (gzipped) | 39.5 KB — `nomodule`, downloaded only by browsers without ES-module support |
| Fonts | 3 WOFF2 files, 51 KB total, preloaded, `display: swap` |
| LCP element | `hero-poster.webp` (`<link rel="preload" as="image">`, `priority`, explicit 1920×1080) |
| Layout shift | Every image has width/height; the video mounts inside the poster's box; no late-loading fonts without fallback metrics |

**About the "≤ 70 KB JS" budget in the spec:** the site-specific JavaScript is well under it (~15 KB gzipped), but the React 19 + Next.js App Router client runtime alone is ~101 KB gzipped on every Next 15 site, regardless of how few client components exist. That floor cannot be removed without leaving Next.js (e.g. Astro with zero-JS islands). Everything within our control is minimised: only six client components exist (mobile nav, product filter, forms, map facade, cert modal, hero video mounter); everything else is server-rendered HTML. On a 4G profile the ~130 KB of modern-browser JS is non-blocking (deferred, loaded after the HTML and poster) and does not affect LCP, which is the poster image.

- Hero: the poster `<Image priority>` is the LCP element; the `<video>` mounts after first paint (`requestIdleCallback`), `preload="metadata"`, `muted loop playsInline`, and is skipped entirely under `prefers-reduced-motion`.
- Google Maps loads only after the user clicks the facade. No third-party scripts load on any page by default; Web3Forms is a `fetch` on submit only.
- `hreflang` renders as `hrefLang="en"` / `x-default` (React attribute casing; HTML attributes are case-insensitive, so search engines read it as `hreflang`).
- The placeholder email `PLACEHOLDER_EMAIL@ramachine.com` is, by the spec's instruction, the one visible placeholder string on the site (footer, contact page, JSON-LD, llms.txt); replacing `site.email` removes every occurrence.

## 9. Route inventory (from `content-audit.md`)
| Section | Pages | Words (min / median / max) |
|---|---|---|
| Home | 1 | 2,216 |
| Products index | 1 | 492 |
| Category landing pages | 4 | 1,177 / 1,247 / 1,631 |
| Product pages | 8 | 1,243 / 1,278 / 1,300 |
| Machine repair | 1 | 2,347 |
| Operator training | 1 | 1,143 |
| Job work (noindex) | 1 | 728 |
| About / Contact / Certifications | 3 | 1,338 / 386 / 824 |
| Privacy / Terms | 2 | 450 / 462 |
| India hub | 1 | 724 |
| State / UT pages | 36 | 1,644 / 1,779 / 1,925 |
| City pages | 170 | 934 / 1,017 / 1,139 |
| Export hub | 1 | 1,609 |
| Export country pages | 30 | 1,508 / 1,591 / 1,873 |
| **Total** | **260** | no page below its ADR §5 threshold; no duplicate titles or H1s |
