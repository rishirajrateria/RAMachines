---
status: Accepted
date: 2026-09-10
---
# ADR-0001 — Stack, design tokens, component contracts and file ownership

This ADR is **binding** for every agent working on this repository. `docs/SPEC.md` says *what*;
this file says *how*. Do not diverge silently — if you must, write a successor ADR.

## 1. Stack (fixed — do not add dependencies)
- Next.js **15.5** App Router, TypeScript strict, `output: 'export'` (fully static). No API routes,
  no server actions, no middleware, no `dynamic`/`headers()`/`cookies()`.
- Tailwind CSS 3.4 with tokens in `tailwind.config.ts` (`ink`, `grey-50…900`, `steel`, `font-sans`,
  `font-display`, `max-w-site`, radius ≤ 4px). No UI/animation/icon libraries. Icons are inline SVG in
  `components/ui/Icons.tsx`.
- Fonts via `app/fonts.ts` (`fontUi` → `--font-ui` Manrope 400/600, `fontDisplay` → `--font-display`
  Barlow Semi Condensed 600). Headings use `font-display`, body uses `font-sans`.
- Images: `next/image` with `unoptimized` (set globally) and explicit `width`/`height` always. Assets are
  pre-generated WebP under `/public`. Never omit dimensions (CLS = 0).
- Forms post to Web3Forms from a client component; every other component is a Server Component.
  Client components are limited to: mobile nav, product filter, forms, map facade, cert modal.
- Path alias `@/` = repo root (`@/config/site`, `@/data/products`, `@/components/...`, `@/lib/...`).
- Only the integration owner edits `package.json`, lockfiles, `next.config.ts`, `tsconfig.json`,
  `tailwind.config.ts`. Workers never run `npm install`.

## 2. Content rules
- Indian-English, confident B2B tone. No lorem ipsum, no emoji, no exclamation marks.
- The word "PLACEHOLDER" appears only in code comments in `data/` and `config/`, never in rendered text.
- Do not fabricate branch offices, dealer addresses or local phone numbers. Service reach is always
  "engineers dispatched from our Kolkata headquarters" + remote diagnostics + international installation
  support.
- Do not use the phrases "laser cutting job work" or "laser cutting service" on indexable pages.
- Keyword priority: machines > training > repair > export. Weave naturally; never stuff.
- Every page: exactly one `<h1>`, logical h2/h3, visible breadcrumbs, one "About RA Machine" entity
  paragraph near the top (use `<AboutBlurb />`).

## 3. Shared library contracts (built by the design worker; consumed by page workers)
```ts
// lib/seo.ts
export function buildMetadata(o: { title: string; description: string; path: string; noindex?: boolean;
  ogTitle?: string }): Metadata;            // sets canonical, OG, twitter (summary_large_image), robots, alternates en + x-default
export function absUrl(path: string): string;
export function truncate(s: string, n: number): string;

// lib/schema.ts — return plain objects (JSON-LD). All accept optional overrides.
export function organizationSchema(): object;
export function localBusinessSchema(extra?: { areaServed?: string | string[]; name?: string; url?: string }): object;
export function websiteSchema(): object;
export function breadcrumbSchema(items: { name: string; href: string }[]): object;
export function faqSchema(items: { q: string; a: string }[]): object;
export function productSchema(p: Product): object;          // brand, sku, offers with "Contact for price", no price
export function serviceSchema(o: { name: string; description: string; path: string; areaServed?: string | string[]; serviceType?: string }): object;
export function courseSchema(o: { name: string; description: string; path: string }): object;

// lib/og.tsx
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export function renderOg(o: { title: string; subtitle?: string; eyebrow?: string }): ImageResponse; // Node runtime, fonts read from app/fonts via fs

// lib/urls.ts
export const paths = { home: "/", products: "/products", category: (c: string) => `/products/${c}`,
  product: (c: string, s: string) => `/products/${c}/${s}`, repair: "/services/machine-repair",
  training: "/services/operator-training", jobWork: "/services/laser-cutting-job-work", about: "/about",
  contact: "/contact", certifications: "/certifications", state: (s: string) => `/india/${s}`,
  city: (s: string, c: string) => `/india/${s}/${c}`, exportHub: "/export", country: (c: string) => `/export/${c}`,
  privacy: "/privacy-policy", terms: "/terms" };

// lib/words.ts
export function wordCount(...parts: (string | string[] | undefined)[]): number;

// data/index.ts (design worker) — typed accessors over the data files
export { products, getProduct, productsByCategory } from "@/data/products";   // getProduct(slug)
export { categories, getCategory } from "@/data/categories";
export { states, getState, statesByRegion, topStates } from "@/data/states";  // topStates(n)
export { cities, getCity, citiesByState, topCities } from "@/data/cities";
export { countries, getCountry, countriesByRegion, topCountries } from "@/data/countries";
export { certifications } from "@/data/certifications";
export { testimonials } from "@/data/testimonials";
export { homeFaqs } from "@/data/faqs";
```
Components (all default-exported unless noted; all server components unless marked *client*):
```
components/layout/Header.tsx, Footer.tsx, MobileNav.tsx (*client*), WhatsAppFloat.tsx, SkipLink.tsx
components/ui/Container.tsx ({className?, children})           // max-w-site, px-4 md:px-6
components/ui/Section.tsx   ({id?, eyebrow?, title?, intro?, children, className?, tight?}) // h2 title, 1px top divider
components/ui/Button.tsx    ({href, variant: "solid"|"outline"|"ghost", external?, children, className?, size?: "md"|"lg"})
components/ui/CtaGroup.tsx  ({product?: string, context?: string, showForm?: boolean}) // Request a Quote (solid) + Call / WhatsApp / Email (outline)
components/ui/Icons.tsx     (named exports: Phone, WhatsApp, Mail, ArrowRight, ArrowUpRight, Check, Menu, Close, Download, MapPin, Clock, Shield, Play)
components/ui/Prose.tsx     ({children, className?})            // typographic wrapper for long copy
components/ui/SpecTable.tsx ({rows: {label,value}[], caption?})
components/ui/Breadcrumbs.tsx ({items: {name, href}[]})        // visible nav + BreadcrumbList JSON-LD (last item = current page)
components/ui/Faq.tsx       ({items: FaqItem[], title?, id?})   // native <details>, emits FAQPage JSON-LD
components/ui/JsonLd.tsx    ({data: object | object[]})
components/ui/RelatedPages.tsx ({title?, links: {name, href, hint?}[]})
components/ui/AboutBlurb.tsx ({context?: string})               // entity paragraph: who/what/where/since/certs
components/ui/LinkGrid.tsx  ({links: {name, href}[], columns?: 2|3|4})
components/cards/ProductCard.tsx ({product}), CategoryCard.tsx ({category, count}), CertCard.tsx ({cert, onOpen?})
components/sections/QuoteBlock.tsx ({product?: Product, country?: string, sticky?: boolean}) // Call/WhatsApp/Email + inline QuoteForm toggle (*client* inside)
components/sections/CtaBand.tsx ({title?, text?, product?}), ContactStrip.tsx, StatsBar.tsx, CertStrip.tsx, ReachSection.tsx, TestimonialGrid.tsx
components/forms/Web3Form.tsx (*client*; {formName, fields: FieldDef[], hidden?: Record<string,string>, submitLabel, successTitle, successText})
components/forms/QuoteForm.tsx, RepairForm.tsx, TrainingForm.tsx, JobWorkForm.tsx, ContactForm.tsx, ExportForm.tsx  (thin wrappers around Web3Form; ≤7 fields; all *client*)
components/media/MapFacade.tsx (*client*), HeroVideo.tsx (*client*, lazy-mounts <video> after first paint, respects reduced motion), Gallery.tsx
```
Every `opengraph-image.tsx` follows this exact shape:
```tsx
import { renderOg, ogSize, ogContentType } from "@/lib/og";
export const size = ogSize; export const contentType = ogContentType; export const dynamic = "force-static";
export default function Image(/* { params } for dynamic routes */) { return renderOg({ title: "...", subtitle: "..." }); }
```
Dynamic segments export `generateStaticParams` and `generateMetadata`; `dynamicParams = false`.

## 4. File ownership (one writer per file — never edit a file you do not own)
| Worker | Owns |
|---|---|
| design | `app/globals.css`, `app/layout.tsx`, `app/not-found.tsx`, `app/opengraph-image.tsx`, `app/icon.svg`, `components/**`, `lib/**` (except `lib/copy/**`), `data/index.ts`, `scripts/generate-placeholders.mjs`, `public/**` |
| data-catalog | `data/products.ts`, `data/categories.ts`, `data/certifications.ts`, `data/testimonials.ts`, `data/faqs.ts` |
| data-india | `data/states.ts`, `data/cities.ts` |
| data-export | `data/countries.ts` |
| core-pages | `app/page.tsx`, `app/about/**`, `app/contact/**`, `app/certifications/**`, `app/privacy-policy/**`, `app/terms/**` |
| products | `app/products/**` |
| services | `app/services/**` |
| india | `app/india/**`, `lib/copy/state.ts`, `lib/copy/city.ts` |
| export | `app/export/**`, `lib/copy/country.ts` |
| seo | `app/sitemap.xml/**`, `app/sitemaps/**`, `app/robots.ts`, `app/llms.txt/**`, `app/llms-full.txt/**`, `scripts/content-audit.mjs` |
| owner | manifests, `docs/**`, `NOTES.md`, `content-audit.md`, `README.md` |

`data/india-index.ts` (canonical list of states/UTs and their cities, slugs and tiers) is owned by the
integration owner and is read-only for everyone. `data/types.ts` and `config/site.ts` are read-only.

## 5. Word-count targets (rendered visible text, excluding header/footer/nav)
Home ≥ 900 · category 600–900 · product ≥ 700 (long description 400–600) · repair ≥ 1,500 ·
training ≈ 700 · job work ≈ 500 · about ≥ 700 · contact ≥ 300 · certifications ≥ 600 ·
state 900–1,200 · city 700–900 · country 1,200–1,600 · export hub ≥ 800.
Programmatic copy is composed in `lib/copy/*.ts` from the structured facts in `data/*` — vary section
order and sentence structure by fact, never by random spinning.
