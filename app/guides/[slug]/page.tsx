/**
 * app/guides/[slug]/page.tsx — one buyer guide. Anatomy: hero (H1, updated
 * date) → "Short answer" box (the quotable summary) → sections → the machine
 * families it leads to → FAQ → related guides → CTA.
 *
 * JSON-LD: Article (author/publisher = the organisation, no invented bylines),
 * plus the FAQPage and BreadcrumbList the shared components already emit.
 */
import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { articleSchema } from "@/lib/schema";
import { guides, getGuide } from "@/data/guides";
import { familiesFor } from "@/lib/families";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import { ArrowRight } from "@/components/ui/Icons";
import CategoryCard from "@/components/cards/CategoryCard";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/layout/PageHero";
import { photos } from "@/lib/photos";
import { categoryHero } from "@/app/products/category-heroes";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return buildMetadata({ title: guide.title, description: guide.description, path: paths.guide(guide.slug) });
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const families = familiesFor(guide.families);
  const related = guide.related.map((s) => getGuide(s)).filter((g): g is NonNullable<typeof g> => Boolean(g));
  const hero = photos[categoryHero[guide.families[0]]];

  return (
    <>
      <PageHero image={hero}>
        <Breadcrumbs
          items={[
            { name: "Home", href: paths.home },
            { name: "Guides", href: paths.guides },
            { name: guide.h1, href: paths.guide(guide.slug) },
          ]}
        />
        <p className="eyebrow mb-3">Buyer guide</p>
        <h1 className="max-w-4xl font-display text-display-lg text-ink">{guide.h1}</h1>
        <p className="mt-4 text-sm text-grey-600">
          RA Machine · Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
        </p>
      </PageHero>

      <Section>
        <aside className="glass max-w-prose border-l-4 border-teal p-6" aria-label="Short answer">
          <p className="eyebrow mb-2">Short answer</p>
          <p className="text-base text-ink">{guide.summary}</p>
        </aside>
        {/* Headings, paragraphs and lists are direct children of .prose so its
            "> * + *" rhythm spaces them (a wrapper element per section broke it). */}
        <Prose className="mt-4 max-w-prose">
          {guide.sections.map((section) => (
            <Fragment key={section.h2}>
              <h2>{section.h2}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((b) => (
                    <li key={b.slice(0, 40)}>{b}</li>
                  ))}
                </ul>
              )}
            </Fragment>
          ))}
        </Prose>
      </Section>

      {families.length > 0 && (
        <Section eyebrow="Our range" title="Machines for this job">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {families.map((family) => (
              <CategoryCard key={family.slug} category={family} />
            ))}
          </div>
        </Section>
      )}

      <Section>
        <Faq items={guide.faqs} title="Frequently asked questions" />
      </Section>

      {related.length > 0 && (
        <Section eyebrow="Keep reading" title="Related guides">
          <ul className="grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={paths.guide(r.slug)} prefetch={false} className="glass group flex h-full flex-col p-5">
                  <span className="font-semibold text-ink">{r.h1}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                    Read
                    <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand
        title="Talk to an engineer"
        text="Tell us your material, thickness and production volume and we will recommend and quote the right configuration."
      />

      <JsonLd data={articleSchema(guide)} />
    </>
  );
}
