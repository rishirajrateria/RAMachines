# RA Machine — website

Static marketing site for **RA Machine** (an RA Group company), Kolkata — laser cutting machines,
tube lasers, CO2 lasers and robotic MIG/MAG welding systems, sold and serviced across India and
exported worldwide.

- Next.js 15 App Router, TypeScript, Tailwind CSS, `output: 'export'` — no backend, no CMS, no database.
- ~260 pre-rendered routes: home, products (4 categories, 8 SKUs), services, about/contact/certifications,
  36 state/UT pages, 170 city pages, 30 export-country pages, split sitemaps, `robots.txt`, `llms.txt`.
- Forms post to Web3Forms (see `NOTES.md` §4).

```bash
npm install
npm run build     # static export → out/ (also writes content-audit.md)
npm run start     # serves out/ on http://localhost:3000
```

Read **`NOTES.md`** for assumptions, placeholder replacement, Web3Forms setup, deployment (Vercel /
Cloudflare Pages) and how to add a state, city, country or product. `docs/SPEC.md` is the functional
specification and `docs/adr/` records the binding technical decisions. `content-audit.md` lists every
generated URL with its title, H1 and word count.
