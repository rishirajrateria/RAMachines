---
status: Accepted
date: 2026-09-10
---
# ADR-0003 — Trim templated copy; keep unique facts

After ADR-0002 the visual sections were added on top of the original prose, roughly doubling word
counts (state ≈ 2,000–2,450, city ≈ 1,175–1,444, country ≈ 2,000–2,600, home ≈ 2,300, repair ≈ 2,600).
Word count is not a ranking factor; repeated templated text across hundreds of pages is a
"scaled content" risk. This ADR sets lean targets and the rule for what to cut.

## Rule
Keep: every page-specific fact (industries, clusters, industrial areas, ports, voltage, currency,
logistics notes, recommended machines), every FAQ, the H1, one short entity sentence about RA Machine,
and one short paragraph per topic that a panel/graphic does not already state.
Cut: prose that restates a GlancePanel, ProcessSteps or chip row; generic paragraphs repeated verbatim
or near-verbatim across pages (export process narrative, delivery/installation narrative, "why buy from
an Indian manufacturer" generic list, service-coverage boilerplate, training boilerplate); duplicated
intros; second and third alternative phrasings — one clear version is enough.

## Targets (visible words in <main>, floors in brackets are the audit thresholds)
home 600–800 · category 700–1,000 · product 900–1,300 · repair 1,400–1,700 · training 600–800 ·
about 700–900 · contact ≤ 400 · certifications 500–700 · India hub 400–600 · state 950–1,200 [900] ·
city 700–850 [700] · country 1,200–1,400 [1,200] · export hub 800–1,000 [800].

## Ownership
| Worker | Owns |
|---|---|
| trim-core | `app/page.tsx`, `app/_home/**`, `app/about/**`, `app/certifications/**`, `app/services/**`, `app/products/**`, `data/categories.ts` (longCopy only) |
| trim-india | `app/india/**`, `lib/copy/state.ts`, `lib/copy/city.ts` |
| trim-export | `app/export/**`, `lib/copy/country.ts` |
