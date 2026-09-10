/**
 * app/about/page.tsx — About RA Machine (SPEC §4 "/about"). Story of RA Group →
 * RA Machine → RA Auto, mission, manufacturing capability, certifications,
 * leadership, India & export reach map, timeline, aboutFaqs. Long copy lives in
 * ./copy.ts; the map graphic is in ./IndiaReachMap.tsx.
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
import CertStrip from "@/components/sections/CertStrip";
import CtaBand from "@/components/sections/CtaBand";
import IndiaReachMap from "./IndiaReachMap";
import {
  storyParagraphs,
  missionText,
  manufacturingParagraphs,
  certSummary,
  leadership,
  reachIntroText,
  exportRegions,
  timeline,
} from "./copy";

export const metadata: Metadata = buildMetadata({
  title: "About RA Machine — Laser Cutting Manufacturer India",
  description:
    "RA Group's Kolkata manufacturer of fiber laser, tube laser, CO2 laser and robotic welding machines — our story, manufacturing capability and certifications.",
  path: paths.about,
});

export default function AboutPage() {
  return (
    <>
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "About", href: paths.about }]} />
        <h1 className="mt-2 font-display text-display-lg text-ink">About RA Machine</h1>
        <div className="mt-4 max-w-2xl">
          <AboutBlurb context={`We are part of ${site.parent}, alongside our sister business ${site.raAuto.name}.`} />
        </div>
      </Section>

      <Section eyebrow="Our story" title="RA Group, RA Machine and RA Auto">
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
      </Section>

      <Section eyebrow="Mission" title="Why we build machines in India">
        <p className="max-w-prose text-grey-600">{missionText}</p>
      </Section>

      <Section eyebrow="Manufacturing" title="Our Kolkata manufacturing capability">
        <Prose>
          {manufacturingParagraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Prose>
      </Section>

      <Section eyebrow="Compliance" title="Certifications" intro={certSummary}>
        <CertStrip />
      </Section>

      <Section eyebrow="Leadership" title="Who runs RA Machine">
        <div className="grid gap-8 sm:grid-cols-3">
          {leadership.map((person) => (
            <div key={person.role}>
              <p className="font-display text-lg text-ink">{person.name}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-steel">{person.role}</p>
              <p className="mt-2 text-sm text-grey-600">{person.bio}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Reach" title="India & export reach" intro={reachIntroText}>
        <IndiaReachMap regions={exportRegions} />
      </Section>

      <Section eyebrow="History" title="Milestones">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {timeline.map((item) => (
            <li key={item.year} className="border-l-2 border-steel pl-4">
              <p className="font-display text-lg text-ink">{item.year}</p>
              <p className="mt-1 text-sm text-grey-600">{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <Faq items={aboutFaqs} title="About RA Machine — frequently asked questions" />
      </Section>

      <CtaBand
        title="Talk to RA Machine about your requirement"
        text="Whether you are choosing your first machine or expanding an existing line, our sales engineers can recommend the right fit."
      />
    </>
  );
}
