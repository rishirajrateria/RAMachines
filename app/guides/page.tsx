/**
 * app/guides/page.tsx — the buyer-guides index. Each guide answers one question
 * buyers ask before choosing a machine (laser vs plasma, MIG vs TIG vs MMA,
 * importing from India…). Written answer-first, so the "short answer" shown on
 * each card is also what search and AI answer engines quote.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { absUrl, buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { guides } from "@/data/guides";
import { categories } from "@/data/categories";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import AboutBlurb from "@/components/ui/AboutBlurb";
import JsonLd from "@/components/ui/JsonLd";
import { ArrowRight } from "@/components/ui/Icons";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/layout/PageHero";
import { photos } from "@/lib/photos";

export const metadata: Metadata = buildMetadata({
  title: "CNC Cutting & Welding Machine Buyer Guides",
  description:
    "Plain answers to the questions buyers ask: laser vs plasma, MIG vs TIG vs MMA, SAW, cobots, laser power, factory preparation and importing from India.",
  path: paths.guides,
});

const familyName = (slug: string) => categories.find((c) => c.slug === slug)?.shortName ?? slug;

export default function GuidesPage() {
  return (
    <>
      <PageHero image={photos["hero-products"]}>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Guides", href: paths.guides }]} />
        <p className="eyebrow mb-3">Buyer guides</p>
        <h1 className="font-display text-display-lg text-ink">Cutting &amp; Welding Machine Guides</h1>
        <p className="mt-4 max-w-prose text-grey-700">
          Straight answers to the questions buyers ask before choosing a CNC cutting or welding machine, written by
          the team that builds them in India.
        </p>
      </PageHero>

      <Container>
        <AboutBlurb />
      </Container>

      <Section eyebrow="Guides" title="All guides">
        <div className="grid gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={paths.guide(guide.slug)}
              prefetch={false}
              className="glass group flex h-full flex-col p-6 transition-shadow hover:shadow-lift"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">
                {guide.families.map(familyName).join(" · ")}
              </p>
              <h2 className="mt-2 font-display text-xl text-ink">{guide.h1}</h2>
              <p className="mt-3 line-clamp-4 text-sm text-grey-600">{guide.summary}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-teal">
                Read the guide
                <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Have a question we haven't answered"
        text="Tell us what you cut or weld, how thick it is and how much you produce, and our engineers will recommend the right machine."
      />

      <JsonLd
        data={{
          "@type": "ItemList",
          name: "RA Machine buyer guides",
          itemListElement: guides.map((g, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: g.h1,
            url: absUrl(paths.guide(g.slug)),
          })),
        }}
      />
    </>
  );
}
