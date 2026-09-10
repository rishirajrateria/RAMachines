/**
 * app/llms.txt/route.ts — concise, citable plain-text company summary for LLM answer
 * engines, per the emerging llms.txt convention (see SPEC §6). Generated entirely
 * from config/site.ts and data/index.ts so it stays in sync with the rest of the
 * site. For the full detail (specs, FAQs, every state/city/country) see /llms-full.txt.
 */
import { site } from "@/config/site";
import { products, categories, states, countries, certifications } from "@/data";
import { paths } from "@/lib/urls";
import { absUrl } from "@/lib/seo";

export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${site.name}`, "");
  lines.push(
    `${site.name} is a ${site.address.locality}-based manufacturer and exporter of laser cutting machines and robotic welding systems, and a brand of ${site.parent}.`,
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

  lines.push(`## Products (${products.length})`);
  for (const p of products) {
    lines.push(`- ${p.name} — ${p.headline}. ${p.shortDescription} ${absUrl(paths.product(p.category, p.slug))}`);
  }
  lines.push("");

  lines.push("## Product categories");
  for (const c of categories) {
    lines.push(`- ${c.name}: ${c.description} ${absUrl(paths.category(c.slug))}`);
  }
  lines.push("");

  lines.push("## Services");
  lines.push(
    `- Laser cutting machine repair & CNC maintenance, pan-India, all brands: ${absUrl(paths.repair)}`,
  );
  lines.push(`- Laser cutting machine operator & CNC training: ${absUrl(paths.training)}`, "");

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
  lines.push(`- Export hub: ${absUrl(paths.exportHub)}`);
  lines.push(`- About: ${absUrl(paths.about)}`);
  lines.push(`- Contact: ${absUrl(paths.contact)}`);
  lines.push(`- Certifications: ${absUrl(paths.certifications)}`, "");

  lines.push(
    `Full detail — product specifications, materials tables, FAQs and every state, city and export-country page — is available at ${absUrl("/llms-full.txt")}.`,
  );

  return lines.join("\n");
}

export async function GET(): Promise<Response> {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
