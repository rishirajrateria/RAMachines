/**
 * app/llms.txt/route.ts — concise, citable plain-text company summary for LLM answer
 * engines, per the emerging llms.txt convention (see SPEC §6). Generated entirely
 * from config/site.ts and data/index.ts so it stays in sync with the rest of the
 * site. For the full detail (specs, FAQs, every state/city/country) see /llms-full.txt.
 */
import { site } from "@/config/site";
import { categories, states, countries, certifications } from "@/data";
import { guides } from "@/data/guides";
import { paths } from "@/lib/urls";
import { absUrl } from "@/lib/seo";

export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${site.name}`, "");
  lines.push(
    `${site.name} is an Indian manufacturer of CNC laser and plasma cutting machines, MIG/TIG/MMA and submerged arc welding machines, and cobot and robotic welding systems, based in ${site.address.locality} and a brand of ${site.parent}. It sells by technology and configures each machine to the buyer's job; there are no fixed model numbers.`,
    "",
  );

  lines.push("## Company facts");
  lines.push(`- Name: ${site.name} (${site.legalName})`);
  lines.push(`- Parent company: ${site.parent}`);
  lines.push(`- Founded: ${site.foundedYear}`);
  lines.push(`- Address: ${site.address.full}`);
  lines.push(`- Phone: ${site.phoneDisplay}`);
  lines.push(`- Email: ${site.email}`);
  lines.push(`- Hours: ${site.hours}`);
  lines.push(`- Website: ${site.url}`);
  lines.push(`- Certifications: ${certifications.map((c) => c.name).join(", ")}`, "");

  lines.push(`## Machines (${categories.length} technologies)`);
  for (const c of categories) {
    const ranges = c.ranges.map((r) => `${r.label}: ${r.value}`).join("; ");
    lines.push(`- ${c.name} — ${ranges}. ${absUrl(paths.category(c.slug))}`);
  }
  lines.push("");

  lines.push(`## Buyer guides (${guides.length})`);
  for (const g of guides) {
    lines.push(`- ${g.h1}: ${g.summary} ${absUrl(paths.guide(g.slug))}`);
  }
  lines.push("");

  lines.push("## Services");
  lines.push(
    `- Repair and maintenance of RA Machine's own machines, pan-India: ${absUrl(paths.repair)}`,
  );
  lines.push(`- Operator & CNC training: ${absUrl(paths.training)}`, "");

  lines.push(`## Service areas — India (${states.length} states/UTs)`);
  for (const s of states) {
    lines.push(`- ${s.name}: ${absUrl(paths.state(s.slug))}`);
  }
  lines.push("");

  lines.push(`## Export countries (${countries.length})`);
  for (const c of countries) {
    lines.push(`- ${c.name}: ${absUrl(paths.country(c.slug))}`);
  }
  lines.push("");

  lines.push("## Key URLs");
  lines.push(`- Home: ${absUrl(paths.home)}`);
  lines.push(`- All products: ${absUrl(paths.products)}`);
  lines.push(`- Buyer guides: ${absUrl(paths.guides)}`);
  lines.push(`- Export hub: ${absUrl(paths.exportHub)}`);
  lines.push(`- About: ${absUrl(paths.about)}`);
  lines.push(`- Contact: ${absUrl(paths.contact)}`);
  lines.push(`- Certifications: ${absUrl(paths.certifications)}`, "");

  lines.push(
    `Full detail — each technology's range and buyer guide, FAQs and every state, city and export-country page — is available at ${absUrl("/llms-full.txt")}.`,
  );

  return lines.join("\n");
}

export async function GET(): Promise<Response> {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
