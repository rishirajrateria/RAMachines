/**
 * app/llms-full.txt/route.ts — the extended companion to /llms.txt: everything an
 * LLM answer engine needs to cite RA Machine in depth (SPEC §6), generated from
 * config/site.ts and data/index.ts. Adds, on top of /llms.txt: full product spec
 * and materials tables, category intros, repair/training summaries, every India
 * state + city URL, every export country URL, and the FAQ sets from data/faqs.ts
 * (excluding the job-work FAQs — that page is noindex and its wording is kept off
 * every other indexable surface per SPEC §6 / ADR §2).
 */
import { site } from "@/config/site";
import {
  products,
  categories,
  states,
  cities,
  countries,
  certifications,
  homeFaqs,
  repairFaqs,
  trainingFaqs,
  exportHubFaqs,
  aboutFaqs,
  certificationFaqs,
} from "@/data";
import type { FaqItem } from "@/data/types";
import { paths } from "@/lib/urls";
import { absUrl } from "@/lib/seo";

export const dynamic = "force-static";

function faqSection(title: string, items: FaqItem[]): string[] {
  const lines = [`## FAQ — ${title}`, ""];
  for (const item of items) {
    lines.push(`Q: ${item.q}`);
    lines.push(`A: ${item.a}`, "");
  }
  return lines;
}

function companyFacts(): string[] {
  const lines: string[] = [];
  lines.push(`# ${site.name} — full reference`, "");
  lines.push(
    `${site.name} designs, fabricates and assembles laser cutting machines and robotic welding systems at its facility in ${site.address.locality}, ${site.address.region}, India, and supplies them across India and to export markets worldwide. ${site.name} is a brand of ${site.parent}; its sister brand ${site.raAuto.name} (${site.raAuto.url}) is the Group's automotive division.`,
    "",
  );
  lines.push("## Company facts");
  lines.push(`- Name: ${site.name} (${site.legalName})`);
  lines.push(`- Parent company: ${site.parent}`);
  lines.push(`- Founded: ${site.foundedYear}`);
  lines.push(`- Address: ${site.address.full}`);
  lines.push(`- Phone: ${site.phoneDisplay}`);
  lines.push(`- WhatsApp: ${site.whatsappHref}`);
  lines.push(`- Email: ${site.email}`);
  lines.push(`- Hours: ${site.hours}`);
  lines.push(`- Website: ${site.url}`, "");
  lines.push("## Certifications");
  for (const c of certifications) {
    lines.push(`- ${c.name} (${c.issuer}): ${c.oneLiner}`);
  }
  lines.push("");
  return lines;
}

function categorySections(): string[] {
  const lines = ["## Product categories", ""];
  for (const cat of categories) {
    lines.push(`### ${cat.name}`);
    lines.push(`URL: ${absUrl(paths.category(cat.slug))}`);
    lines.push(cat.intro, "");
  }
  return lines;
}

function productSections(): string[] {
  const lines = ["## Products — full specifications", ""];
  for (const p of products) {
    const categoryName = categories.find((c) => c.slug === p.category)?.name ?? p.category;
    lines.push(`### ${p.name} (${p.sku})`);
    lines.push(`Category: ${categoryName}`);
    lines.push(`Headline: ${p.headline}`);
    lines.push(p.shortDescription);
    lines.push(`URL: ${absUrl(paths.product(p.category, p.slug))}`);
    lines.push("Specifications:");
    for (const spec of p.specs) lines.push(`- ${spec.label}: ${spec.value}`);
    lines.push("Materials & maximum thickness:");
    for (const m of p.materials) lines.push(`- ${m.material}: ${m.maxThickness}`);
    lines.push("");
  }
  return lines;
}

function serviceSections(): string[] {
  const lines: string[] = [];
  lines.push("## Machine repair & CNC maintenance");
  lines.push(
    `${site.name} repairs fiber laser, CO2 laser, plasma, tube laser and robotic welding equipment of any manufacturer, not only its own machines. Coverage is pan-India, with engineers dispatched from the Kolkata headquarters, remote diagnostics, Basic / Standard / Premium AMC plans, and stocked spares for common wear parts (nozzles, lenses, filters, drive components).`,
  );
  lines.push(`URL: ${absUrl(paths.repair)}`, "");
  lines.push("## Operator & CNC training");
  lines.push(
    `${site.name} trains operators, shop-floor supervisors and maintenance staff on safe machine operation, day-to-day maintenance and nesting/cutting-path software, delivered either at the customer's site (often bundled with installation) or at the Kolkata training centre. Trainees receive a certificate of completion.`,
  );
  lines.push(`URL: ${absUrl(paths.training)}`, "");
  return lines;
}

function indiaSections(): string[] {
  const lines = [`## India — all ${states.length} state/UT pages and their cities`, ""];
  for (const s of states) {
    lines.push(`### ${s.name}`);
    lines.push(`URL: ${absUrl(paths.state(s.slug))}`);
    const stateCities = cities.filter((c) => c.stateSlug === s.slug);
    for (const c of stateCities) lines.push(`- ${c.name}: ${absUrl(paths.city(s.slug, c.slug))}`);
    lines.push("");
  }
  return lines;
}

function exportSections(): string[] {
  const lines = [`## Export — hub page and all ${countries.length} country pages`, ""];
  lines.push(`Export hub: ${absUrl(paths.exportHub)}`, "");
  for (const c of countries) {
    lines.push(`- ${c.name} (${c.region}): ${absUrl(paths.country(c.slug))}`);
  }
  lines.push("");
  return lines;
}

function buildLlmsFullTxt(): string {
  return [
    ...companyFacts(),
    ...categorySections(),
    ...productSections(),
    ...serviceSections(),
    ...indiaSections(),
    ...exportSections(),
    ...faqSection("general", homeFaqs),
    ...faqSection("machine repair", repairFaqs),
    ...faqSection("operator training", trainingFaqs),
    ...faqSection("export", exportHubFaqs),
    ...faqSection("about RA Machine", aboutFaqs),
    ...faqSection("certifications", certificationFaqs),
  ].join("\n");
}

export async function GET(): Promise<Response> {
  return new Response(buildLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
