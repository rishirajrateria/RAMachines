/**
 * app/about/page.tsx — About RA Machine. ADR-0005 "Liquid Glass" §6: hero panel,
 * FactStrip, Steps (timeline), two-column prose, certifications pill row,
 * leadership cards, aboutFaqs — 7 calm sections. Long copy lives in ./copy.ts.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { aboutFaqs } from "@/data/faqs";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Faq from "@/components/ui/Faq";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import { FactStrip, Steps } from "@/components/ui/glass";
import CertStrip from "@/components/sections/CertStrip";
import { storyParagraphs, manufacturingParagraphs, leadership, timeline } from "./copy";

export const metadata: Metadata = buildMetadata({
  title: "About RA Machine — Laser Cutting Manufacturer India",
  description:
    "RA Group's Kolkata manufacturer of fiber laser, tube laser, CO2 laser and robotic welding machines — our story, manufacturing capability and certifications.",
  path: paths.about,
});

const aboutFacts = [
  { label: "Founded", value: String(site.foundedYear) },
  { label: "Machines installed", value: site.stats[0].value },
  { label: "Countries served", value: site.stats[1].value },
  { label: "Operators trained", value: site.stats[3].value },
];

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero panel. */}
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "About", href: paths.about }]} />
        <div className="glass-strong mt-4 p-8 md:p-12">
          <h1 className="font-display text-display-lg text-ink">About RA Machine</h1>
          <p className="mt-4 max-w-prose text-grey-600">
            RA Group&rsquo;s Kolkata manufacturer of fiber laser, tube laser, CO2 laser and robotic welding
            machines, engineered, built and supported entirely in-house.
          </p>
          <div className="mt-5 max-w-prose">
            <AboutBlurb context={`We are part of ${site.parent}, alongside our sister business ${site.raAuto.name}.`} />
          </div>
        </div>
      </Section>

      {/* 2. FactStrip. */}
      <Section title="At a glance">
        <FactStrip facts={aboutFacts} />
      </Section>

      {/* 3. Steps — timeline, 5 items. */}
      <Section eyebrow="History" title="Milestones">
        <Steps steps={timeline.slice(0, 5).map((item) => ({ title: String(item.year), text: item.text }))} />
      </Section>

      {/* 4. Two-column prose. */}
      <Section title="Story & manufacturing">
        <div className="grid gap-10 md:grid-cols-2">
          <Prose>
            <h3>Our story</h3>
            {storyParagraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              Learn more about our automotive division at{" "}
              <a href={site.raAuto.url} target="_blank" rel="noopener noreferrer" className="font-semibold">
                RA Auto ↗
              </a>
              .
            </p>
          </Prose>
          <Prose>
            <h3>Manufacturing</h3>
            {manufacturingParagraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
        </div>
      </Section>

      {/* 5. Certifications pill row. */}
      <Section eyebrow="Compliance" icon="Award" title="Certifications">
        <CertStrip />
      </Section>

      {/* 6. Leadership — 3 small glass cards. */}
      <Section eyebrow="Leadership" icon="Users" title="Who runs RA Machine">
        <div className="grid gap-5 sm:grid-cols-3">
          {leadership.map((person) => (
            <GlassCard key={person.role}>
              <Avatar name={person.name} size={48} />
              <p className="mt-4 font-display text-base text-ink">{person.name}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-teal">{person.role}</p>
              <p className="mt-2 text-sm text-grey-600">{person.bio}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* 7. Faq. */}
      <Section>
        <Faq items={aboutFaqs} />
      </Section>
    </>
  );
}
