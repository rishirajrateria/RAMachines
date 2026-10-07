/**
 * app/llms-full.txt/route.ts — the extended companion to /llms.txt: everything an
 * LLM answer engine needs to cite RA Machine in depth (SPEC §6), generated from
 * config/site.ts and data/index.ts. Adds, on top of /llms.txt: each machine
 * family's ranges, intro and buyer guide, repair/training summaries, every India
 * state + city URL, every export country URL, and the FAQ sets from data/faqs.ts
 * (excluding the job-work FAQs — that page is noindex and its wording is kept off
 * every other indexable surface per SPEC §6 / ADR §2).
 */
import { site } from "@/config/site";
import { guides } from "@/data/guides";
import {
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
    `${site.name} designs, fabricates and assembles CNC laser and plasma cutting machines, MIG/TIG/MMA and submerged arc welding machines, and cobot and robotic welding systems at its works in ${site.address.locality}, ${site.address.region}, India. It supplies them across India and can ship and support them abroad. ${site.name} is a brand of ${site.parent}; its sister brand ${site.raAuto.name} (${site.raAuto.url}) is the Group's automotive division.`,
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

/**
 * One section per machine family: the client's own ranges (the only specs the
 * site states — machines are configured per job, there are no model numbers),
 * then the intro, buyer guide and FAQs.
 */
function categorySections(): string[] {
  const lines = ["## Machines — five technologies", ""];
  for (const cat of categories) {
    lines.push(`### ${cat.name}`);
    lines.push(`URL: ${absUrl(paths.category(cat.slug))}`);
    lines.push("Range:");
    for (const range of cat.ranges) lines.push(`- ${range.label}: ${range.value}`);
    lines.push("", cat.intro, "");
    lines.push(...cat.longCopy.flatMap((paragraph) => [paragraph, ""]));
    lines.push(`Applications: ${cat.applications.join("; ")}.`, "");
    for (const faq of cat.faqs) lines.push(`Q: ${faq.q}`, `A: ${faq.a}`, "");
  }
  return lines;
}

/** Every buyer guide in full: answer first, then sections and FAQs. */
function guideSections(): string[] {
  const lines = ["## Buyer guides", ""];
  for (const g of guides) {
    lines.push(`### ${g.h1}`, `URL: ${absUrl(paths.guide(g.slug))}`, `Updated: ${g.updated}`, "", `Short answer: ${g.summary}`, "");
    for (const section of g.sections) {
      lines.push(`#### ${section.h2}`, ...section.paragraphs.flatMap((p) => [p, ""]));
      if (section.bullets) lines.push(...section.bullets.map((b) => `- ${b}`), "");
    }
    for (const faq of g.faqs) lines.push(`Q: ${faq.q}`, `A: ${faq.a}`, "");
  }
  return lines;
}

function serviceSections(): string[] {
  const lines: string[] = [];
  lines.push("## Machine repair & CNC maintenance");
  lines.push(
    `${site.name} repairs and maintains the machines it builds — its own CNC laser and plasma cutting machines, welding machines and robotic welding systems. It does not service other manufacturers' machines and does not currently offer annual maintenance contracts. Coverage is pan-India, with engineers travelling from the Kolkata workshop, remote diagnostics, and stocked spares for common wear parts.`,
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
    ...guideSections(),
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
