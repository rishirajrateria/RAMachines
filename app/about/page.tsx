/**
 * app/about/page.tsx — About RA Machine. ADR-0005 "Liquid Glass" §6 / ADR-0007
 * §1, §4: image hero, FactStrip, image band, Steps (timeline), story +
 * manufacturing (each paired with an image, alternating sides), certifications
 * pill row, leadership cards, aboutFaqs. Long copy lives in ./copy.ts.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { photos } from "@/lib/photos";
import { aboutFaqs } from "@/data/faqs";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Faq from "@/components/ui/Faq";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import PageHero from "@/components/layout/PageHero";
import { FactStrip, Steps, ImageSlot, ImageBand } from "@/components/ui/glass";
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
      {/* 1. Hero — full-bleed photo banner. */}
      <PageHero image={photos["hero-about"]} size="tall" align="start">
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "About", href: paths.about }]} />
        <p className="eyebrow">Kolkata, India · Manufacturing since {site.foundedYear}</p>
        <h1 className="mt-4 font-display text-display-lg text-ink">About RA Machine</h1>
        <p className="mt-4 max-w-prose text-grey-600">
          RA Group&rsquo;s Kolkata manufacturer of fiber laser, tube laser, CO2 laser and robotic welding
          machines, engineered, built and supported entirely in-house.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={paths.certifications} variant="solid">
            View certifications
          </Button>
          <Button href={paths.contact} variant="outline">
            Contact us
          </Button>
        </div>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-teal">
          {aboutFacts.slice(0, 3).map((fact) => (
            <span key={fact.label}>
              {fact.value} <span className="font-normal text-grey-600">{fact.label}</span>
            </span>
          ))}
        </div>
      </PageHero>

      {/* 2. At a glance — AboutBlurb (moved under the hero) + FactStrip. */}
      <Section title="At a glance">
        <div className="mb-8 max-w-prose">
          <AboutBlurb context={`We are part of ${site.parent}, alongside our sister business ${site.raAuto.name}.`} />
        </div>
        <FactStrip facts={aboutFacts} />
      </Section>

      <ImageBand image={photos["slot-factory"]} overlayText="Built and tested at our Kolkata works" label="Photo: factory floor" />

      {/* 3. Steps — timeline, 5 items. */}
      <Section eyebrow="History" title="Milestones">
        <Steps steps={timeline.slice(0, 5).map((item) => ({ title: String(item.year), text: item.text }))} />
      </Section>

      {/* 4. Our story — text paired with an image. */}
      <Section title="Our story">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Prose>
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
          <ImageSlot image={photos["slot-assembly"]} aspect="4/3" label="Photo: assembly line" />
        </div>
      </Section>

      {/* 5. Manufacturing — image paired with text, alternating side. */}
      <Section title="Manufacturing">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <ImageSlot image={photos["slot-team"]} aspect="4/3" label="Photo: RA Machine team" className="md:order-1" />
          <Prose className="md:order-2">
            {manufacturingParagraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Prose>
        </div>
      </Section>

      {/* 6. Certifications pill row. */}
      <Section eyebrow="Compliance" icon="Award" title="Certifications">
        <CertStrip />
      </Section>

      {/* 7. Leadership — 3 small glass cards, unchanged. */}
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

      {/* 8. Faq. */}
      <Section>
        <Faq items={aboutFaqs} />
      </Section>
    </>
  );
}
