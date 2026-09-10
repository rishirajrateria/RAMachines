# RA Machine Website — Functional Specification

You are building a complete, production-ready marketing website for **RA Machine** (a brand of **RA Group**), a Kolkata-based manufacturer and supplier of laser CNC cutting machines and robotic welding systems, serving all of India and exporting worldwide. Build the entire site in one pass, exactly to this spec. Do not ask questions; where something is unspecified, choose the option that is best for SEO, speed and simplicity, and note the assumption in a `NOTES.md`.

## 1. Business facts (use exactly)

- Brand: RA Machine. Parent: RA Group. Sister brand: RA Auto — https://raauto.net (automotive division; must be presented as another RA Group service and linked from the header, footer, home page and About page with a clear "RA Auto ↗" external link that opens in a new tab).
- Address: 16A/2, Bus Stand, Chandra Nath Roy Rd, near 42Nos, Panchanna Pally, Tiljala, Kolkata, West Bengal 700039, India.
- Phone: +91 98361 33102 (use `tel:+919836133102` and WhatsApp `https://wa.me/919836133102`).
- Email: `PLACEHOLDER_EMAIL@ramachine.com` — put this in one constant in `config/site.ts` so it can be changed in one place.
- Hours: Mon–Sat, 10:00–18:00 IST (assumed).
- Company stats: use clearly-marked placeholder numbers (e.g. "500+ machines installed", "25+ countries served", "15+ years", "1,000+ operators trained"). Keep every such number in `config/site.ts` so they can be replaced without touching pages.
- Certifications / licences to display: ISO 9001:2015, CE Marking, GST Registered, MSME / Udyam Registered, IEC (Import Export Code), Indian Railways Listed Vendor, Make in India, Startup India (optional), BIS (optional). Use placeholder certificate images (`/public/certs/*.webp`, same aspect ratio, grey placeholder with the certificate name) that can be swapped later.
- Positioning: India's leading laser cutting machine manufacturer and exporter. Every page should reinforce two things equally: (1) dominant, trusted market leader across India, (2) actively exporting with installation and support worldwide.

## 2. Products (placeholder SKUs — real ones come later)

Create a typed data file `data/products.ts`. Each product: `slug, name, category, shortDescription, longDescription (400–600 words), specs (key/value table), applications[], materials[], faqs[] (6+), images[], brochureUrl (placeholder PDF), relatedSlugs[]`. Seed with these 8 dummy SKUs, written as if real:

1. RA-F1530 Fiber Laser Cutting Machine (1.5 kW, 1500×3000 mm)
2. RA-F3015 Pro Fiber Laser Cutting Machine (3 kW, 1500×3000 mm)
3. RA-F6020 HD Fiber Laser Cutting Machine (6 kW, 2000×6000 mm)
4. RA-F12K Heavy Duty Fiber Laser Cutting Machine (12 kW)
5. RA-T6000 Fiber Laser Tube Cutting Machine
6. RA-C1390 CO2 Laser Cutting & Engraving Machine
7. RA-RW6 Robotic MIG Welding Cell (6-axis)
8. RA-RW10 Robotic MIG/MAG Welding Workstation (dual-station)

Categories: Fiber Laser Cutting Machines, Tube Laser Cutting Machines, CO2 Laser Machines, Robotic Welding Systems. Each category also gets its own landing page.

Every product page has a sticky **Request a Quote** block with four options: Call, WhatsApp, Email, Fill Form (opens an inline short form: name, company, phone, email, city/country, product pre-filled, message). No prices; "Request price" only.

## 3. Sitemap (build every one of these)

```
/                                   Home
/products                           All products (grid, filter by category — client-side, tiny)
/products/[category]                Category landing pages (4)
/products/[category]/[slug]         Product pages (8)
/services/machine-repair            Repair & maintenance (standalone, heavily SEO-optimised)
/services/operator-training         Staff / operator training (simple booking page)
/services/laser-cutting-job-work    Job work on our machines (noindex — see §6)
/about                              About RA Machine + RA Group + RA Auto link
/contact                            Contact page
/certifications                     All licences & certifications, full page
/india/[state]                      36 state/UT pages
/india/[state]/[city]               City pages (see §5)
/export/[country]                   Export country pages (see §5)
/export                             Export hub page listing all countries
/privacy-policy, /terms             Short static pages
/sitemap.xml, /robots.txt, /llms.txt
```

## 4. Page-by-page spec

**Global:** Sticky, minimal header — logo (text logo "RA Machine" in a distinctive typeface, with "an RA Group company" micro-line), nav: Products, Repair, Training, Export, About, Contact, plus an outlined "RA Auto ↗" link and a solid "Request Quote" button. Floating WhatsApp button bottom-right on every page. Footer: address, phone, email, hours, quick links, product categories, top 12 city links, top 10 country links, certifications strip, RA Group / RA Auto links, "Made in India" line.

**Home:**
1. Full-viewport hero with a muted, autoplaying, looping background video (`/public/video/hero.mp4` + `hero.webm`, poster `hero-poster.webp`, `preload="metadata"`, `playsInline`, lazy after LCP; poster image is the LCP element). H1: "Laser Cutting Machines Built in India, Trusted Worldwide". Sub-line + two CTAs: "Explore Machines" and "Request a Quote". Second row of three small text links: "Machine Repair" · "Operator Training" · "Export Enquiry".
2. Trust bar: the placeholder stats.
3. Product categories (4 cards) → product grid (8 cards).
4. "Why RA Machine" — 6 short points (manufacturing in India, pan-India service reach, export & installation support, spares availability, training, Indian Railways vendor).
5. Services strip: Repair, Training, Job Work, RA Auto (each with one-line description + link).
6. **Licences & Certifications section** — grid of certificate cards with name, issuing body, one line, and a "View all certifications" link. This section must be visually prominent (it is for global ad traffic).
7. India + World reach section: short text, list of top states served, list of top export countries served (all links).
8. Testimonials (6 placeholder testimonials with realistic Indian and international company names marked PLACEHOLDER in the data file).
9. FAQ (8 questions) with FAQPage schema.
10. Final CTA band + contact strip.

**Products / Category / Product pages:** As in §2. Category pages get 600–900 words of original copy, comparison table of the machines in the category, applications, FAQ, CTA. Product pages: gallery (placeholder images), spec table, long description, applications, materials & thicknesses table, "Available across India & for export" block linking to states/countries, related products, FAQ, brochure download, quote block.

**/services/machine-repair (must rank on Google and in LLM answers):** H1 "Laser Cutting Machine Repair & CNC Maintenance Service in India". 1,500+ words: we repair RA Machine and all other brands (fiber laser, CO2, plasma, tube laser, robotic welding cells); on-site service pan-India with engineers dispatched from Kolkata; remote diagnostics; spares; AMC plans (Basic / Standard / Premium — describe without prices); common faults we fix (laser source, chiller, cutting head, nozzle/lens, servo/drive, controller, gas system, bed alignment); response time commitment (placeholder); "Book a Repair" short form (name, company, phone, machine brand/model, city, problem description); FAQ (10 questions); Service schema. Include an internal link module to all state pages ("Laser machine repair in [state]").

**/services/operator-training:** Keep it simple. H1 "Laser Cutting Machine Operator Training & CNC Training". ~700 words: we train your staff (operation, safety, basic maintenance, nesting software) at your site or our Kolkata centre; who it's for; outcomes; "Book Staff Training" short form (name, company, phone, email, number of trainees, location, preferred month). FAQ (8). Course schema.

**/services/laser-cutting-job-work:** ~500 words: precision metal cutting on our own machines for customers who don't want to buy a machine; materials, thicknesses, formats accepted (DXF/DWG), turnaround; quote form. **`noindex, follow`**, excluded from sitemap, not linked from nav (only from footer and services strip).

**/about:** Story of RA Group → RA Machine → RA Auto; mission; manufacturing capability; certifications; leadership placeholders; India & export map (static SVG, no heavy map libraries); timeline (placeholder years).

**/contact:** Form (name, company, phone, email, country, subject dropdown: Buy a machine / Repair / Training / Export / Job work / Other, message), full address with Google Maps embed (lazy-loaded, click-to-load facade), Call / WhatsApp / Email CTA cards, hours, "Visit our factory" line. LocalBusiness schema.

**/certifications:** Full page, each certificate as a card with modal image view, plus 400 words on quality & compliance.

## 5. Programmatic SEO pages (the main ranking objective)

Build these as **static pages at build time** from data files (`data/states.ts`, `data/cities.ts`, `data/countries.ts`) using `generateStaticParams`. No thin pages — every page must have unique, substantive, genuinely useful copy generated from structured facts, not spun sentences.

**India structure (chosen to avoid thin-content penalties):**
- 36 state/UT pages `/india/[state]` — 900–1,200 words each: laser cutting machines for sale in [state], the state's key manufacturing industries and clusters (use real facts: e.g. Punjab – Ludhiana bicycle/auto parts; Gujarat – Rajkot engineering, Ahmedabad; Tamil Nadu – Coimbatore pumps/motors, Chennai auto; Maharashtra – Pune auto, Mumbai; Karnataka – Bengaluru aerospace; Rajasthan – Jaipur; West Bengal – Howrah foundries, etc.), which RA machines suit those industries, delivery & installation from Kolkata, service coverage, training availability, list of city pages, FAQ (6), CTA. Target keywords: "laser cutting machine in [state]", "fiber laser cutting machine [state]", "CNC laser machine supplier [state]", "laser cutting machine dealer [state]", "laser machine repair [state]".
- City pages `/india/[state]/[city]` — top cities per state weighted by industry: 8 cities for large industrial states (Maharashtra, Gujarat, Tamil Nadu, Karnataka, Uttar Pradesh, Punjab, Haryana, Rajasthan, West Bengal, Delhi NCR, Telangana, Andhra Pradesh, Madhya Pradesh, Kerala), 4 for the rest, 1–2 for small UTs. Roughly 180 city pages total. 700–900 words each, one page per city covering all machine categories (do NOT create city × SKU pages). Each city page: H1 "Laser Cutting Machine in [City], [State] — Sales, Installation, Repair & Training", local industry context (real), machine recommendations, delivery/installation/service/training details, "also serving nearby: [other cities in state]", FAQ (5), CTA. Include `Product`/`Service` + `LocalBusiness` (areaServed) schema and BreadcrumbList.
- Wording for service reach: describe pan-India installation, on-site service and training with engineers dispatched from our Kolkata headquarters, and international installation support. Do not invent physical branch offices, dealer addresses or local phone numbers in cities where none exist.

**Export countries `/export/[country]` — English only, 1,200–1,600 words each, text-heavy.** Build 30 pages. Countries selected by (a) proven import demand for laser cutting machinery and (b) fast-growing manufacturing where India is a natural China-alternative supplier:

- Proven high-volume importers: United States, Vietnam, Mexico, Turkey, Indonesia, Uzbekistan, Russia, Brazil, Peru, Poland, Germany, United Kingdom, Australia, Canada, South Africa
- Emerging / India-advantaged markets: United Arab Emirates, Saudi Arabia, Qatar, Oman, Kuwait, Bangladesh, Nepal, Sri Lanka, Kenya, Nigeria, Tanzania, Ethiopia, Egypt, Malaysia, Philippines

Each country page: H1 "Laser Cutting Machine Exporter to [Country] — Fiber Laser & Robotic Welding from India", why buy from India vs China (quality, English-speaking support, price, IEC-registered exporter, CE/ISO), that country's manufacturing sectors & industrial zones (real, specific), applicable machines, export process (quotation → proforma invoice → production → pre-shipment video inspection → sea/air freight → remote + on-site installation → training → warranty), shipping terms (FOB Kolkata / CIF nearest port — placeholder), voltage/frequency compatibility, warranty (placeholder 24 months), spares & remote support, payment terms (placeholder), lead time (placeholder), currency note, FAQ (8), export enquiry form pre-filled with country. Use `hreflang="en"` + `x-default`. Schema: Product + Organization (areaServed).

`/export` hub: 800 words + grid of all countries grouped by region.

## 6. SEO requirements (non-negotiable)

- Next.js App Router, `generateMetadata` on every route; unique title (≤60 chars, keyword-first), meta description (≤155 chars), canonical, Open Graph + Twitter cards with a generated OG image per page (`next/og`, static at build).
- JSON-LD on every page via a reusable component: `Organization` (site-wide, with `sameAs`, logo, contact, address), `LocalBusiness` (home/contact), `Product` (product pages, with brand, sku, offers → `PriceSpecification` omitted / "Contact for price"), `Service` (repair, training), `Course` (training), `FAQPage` wherever FAQs exist, `BreadcrumbList` everywhere, `WebSite` with `SearchAction` omitted (no search).
- Semantic HTML: one H1 per page, logical H2/H3, descriptive alt text, visible breadcrumbs.
- Internal linking: every product page → categories, top states, top countries, repair, training; every state page → its cities + all products; every city page → state, neighbouring cities, products, repair; every country page → products, export hub, contact. Add a "Related pages" module at the bottom of programmatic pages. Ensure no page is more than 3 clicks from home.
- `sitemap.xml` (split into index + child sitemaps: pages, products, india, export) and `robots.txt` generated with Next.js metadata routes. Job-work page noindex and excluded.
- `/llms.txt` and `/llms-full.txt` at the root: plain-text description of the company, products, services, service areas, export countries, and contact, written so LLMs can cite it. Also add a clean, factual "About RA Machine" paragraph (who / what / where / since when / certifications) near the top of every key page, because LLM answer engines extract entity facts.
- Target keyword map (weave naturally, never stuff): laser cutting machine, laser machine, CNC laser machine, fiber laser cutting machine, laser cutting machine manufacturer India, laser cutting machine price (answer with "request quote" pages, don't fake prices), robotic welding, robotic MIG welding, MIG welding machine, MAG welding, CNC maintenance, laser cutting machine repair, laser cutting machine operator course / training, laser cutting machine exporter India. Priority order: machines > training > repair > export. Do NOT optimise for "laser cutting job work / laser cutting service" — keep those terms off the indexable pages.
- Every page passes: no orphan pages, no duplicate titles, no duplicate H1s, all images have width/height, no layout shift.

## 7. Performance requirements (target Lighthouse 100/100/100/100 on mobile)

- Next.js 15 (latest stable) App Router, TypeScript, **fully static export** (`output: 'export'`) — no server runtime, no API routes, no database. Everything is pre-rendered at build.
- Tailwind CSS with a small custom design-token layer. Zero UI component libraries, zero animation libraries, no icon library bundles (inline the ~12 SVG icons needed), no analytics, no third-party scripts except the form service below.
- `next/image` with static import or pre-optimised WebP/AVIF in `/public`; hero poster preloaded; all below-fold images lazy.
- Fonts: self-hosted via `next/font/local` (two weights max), `display: swap`, subset to Latin.
- Video: lazy-mount the `<video>` after first paint; never block LCP; total hero video ≤ 3 MB placeholder (put a tiny 5-second placeholder and note the replacement path).
- Client JS only where needed: product filter, mobile nav, FAQ accordion (use native `<details>`), form submit, map facade. Everything else is a Server Component.
- Budget: ≤ 70 KB JS on the home page, CLS 0, LCP < 1.5 s on 4G.

## 8. Forms (no backend)

All forms post to **Web3Forms** (free, no backend, delivers to email). Put the access key in `NEXT_PUBLIC_WEB3FORMS_KEY` and the destination email in `config/site.ts`; add a honeypot field, client-side validation, a success state, and a fallback "or WhatsApp us" link on error. Forms: Quote (product pages + home), Repair booking, Training booking, Job work quote, Contact, Export enquiry. All are short (≤ 7 fields). Document in `NOTES.md` exactly how to create the Web3Forms key and set the recipient email.

## 9. Design direction

- Plain white background, near-black text, one neutral grey scale, a single restrained accent (deep steel blue, used only for links, CTA buttons and small highlights). No gradients, no glassmorphism, no glow, no rounded-blob illustrations, no emoji, no generic "AI startup" look. It should read like a serious European machine-tool manufacturer's site: lots of white space, strong typographic hierarchy, thin 1px dividers, large product photography, square-ish corners (≤ 4px radius), understated hover states.
- Typography: do not use Inter, Roboto, Arial, system-ui, or Geist. Choose a distinctive but corporate pairing and self-host it (e.g. a grotesque such as Söhne-alternative "Instrument Sans" or "Manrope" for UI, with a compact display face for headlines; final choice yours, but justify it in NOTES.md).
- Layout: max-width 1280px container, 12-column grid, consistent 8px spacing scale, mobile-first, all tap targets ≥ 44px.
- Buttons: "Request a Quote" (solid), "Call", "WhatsApp", "Email" (outlined). Consistent across the site.
- Accessibility: WCAG AA contrast, focus rings, skip link, ARIA on nav/accordion/modals, reduced-motion respected (video paused if `prefers-reduced-motion`).

## 10. Deliverables

1. Complete repo, runs with `npm install && npm run build && npm run start` (static export). Deploy target: **Vercel** (include `vercel.json` with immutable caching headers for `/_next/static` and `/public` assets; also make it deployable to Cloudflare Pages without changes).
2. `data/` folder with all products, states, cities, countries, testimonials, FAQs, certifications — each with a comment block explaining how to edit.
3. `config/site.ts` — single place for brand name, phone, email, address, hours, stats, social links, RA Auto URL.
4. `NOTES.md` — assumptions, how to replace placeholder video/images/certificates/products, how to set up Web3Forms, how to deploy to Vercel, how to add a state/city/country.
5. `content-audit.md` — table of every generated URL with its title, H1 and word count, so I can verify nothing is thin.
6. All copy written in clear, confident, professional Indian-English suitable for global B2B buyers. No lorem ipsum anywhere — all placeholder facts are realistic and marked `// PLACEHOLDER` in data files only, never in visible text.

Work through the site systematically: config & data → layout & design system → core pages → product pages → service pages → programmatic India pages → export pages → SEO plumbing (metadata, schema, sitemap, llms.txt) → performance pass → NOTES.md and content-audit.md. When finished, print the full route list with page counts and confirm the build succeeds.
