/**
 * app/about/page.tsx — About RA Machine (SPEC §4 "/about"). ADR-0002 visual refresh:
 * every section leads with a visual (icon chips, ProcessSteps, IconCards, GlancePanel
 * + factory photo, Avatar leadership cards, icon milestone cards) with the full
 * original copy kept intact as shorter prose blocks underneath. Long copy lives in
 * ./copy.ts; the map graphic is in ./IndiaReachMap.tsx.
 */
import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { aboutFaqs } from "@/data/faqs";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";
import Faq from "@/components/ui/Faq";
import Chips from "@/components/ui/Chips";
import GlancePanel from "@/components/ui/GlancePanel";
import ProcessSteps from "@/components/ui/ProcessSteps";
import IconCard from "@/components/ui/IconCard";
import Avatar from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import CertStrip from "@/components/sections/CertStrip";
import CtaBand from "@/components/sections/CtaBand";
import IndiaReachMap from "./IndiaReachMap";
import {
  storyParagraphs,
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

const storySteps = [
  { icon: "Building", title: "A Kolkata workshop", text: "RA Group's roots as a precision fabrication workshop." },
  { icon: "Factory", title: "A dedicated machine builder", text: "Grew into an in-house laser cutting and welding machine manufacturer." },
  { icon: "Bolt", title: "RA Auto, our sister business", text: "The same engineering discipline now also serves India's automotive sector." },
] as const;

const missionPillars = [
  { icon: "Wrench", title: "Built to last", text: "Machines engineered for years of continuous production, not just the day they ship." },
  { icon: "Headset", title: "Support that stays", text: "A service and spares network that does not disappear once the invoice is settled." },
  { icon: "Users", title: "Measured by loyalty", text: "Success measured by how many early customers still run the same machine a decade later." },
] as const;

const capabilityFacts = [
  { icon: "Factory", label: "Frame fabrication", value: "Cut, welded & stress-relieved in-house" },
  { icon: "Gauge", label: "QC checks", value: "Electrical, calibration & repeatability" },
  { icon: "Play", label: "Test run", value: "Live test cut or weld before dispatch" },
  { icon: "Ship", label: "Export QC", value: "Pre-shipment video inspection" },
] as const;

const manufacturingHeadings = ["Structural fabrication", "Assembly & quality control", "Test run before dispatch"];

export default function AboutPage() {
  return (
    <>
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "About", href: paths.about }]} />
        <h1 className="mt-2 font-display text-display-lg text-ink">About RA Machine</h1>
        <div className="mt-4">
          <Chips
            items={[
              { label: `Est. ${site.foundedYear}`, icon: "Calendar" },
              { label: "ISO 9001:2015", icon: "Certificate" },
              { label: "25+ export countries", icon: "Globe" },
              { label: "Indian Railways vendor", icon: "Badge" },
            ]}
          />
        </div>
        <div className="mt-5 max-w-2xl">
          <AboutBlurb context={`We are part of ${site.parent}, alongside our sister business ${site.raAuto.name}.`} />
        </div>
      </Section>

      <Section eyebrow="Our story" icon="Building" title="RA Group, RA Machine and RA Auto">
        <ProcessSteps steps={[...storySteps]} />
        <h3 className="mt-12 font-display text-lg text-ink">The full story</h3>
        <div className="mt-4">
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
        </div>
      </Section>

      <Section tone="soft" eyebrow="Mission" icon="Sparkles" title="Why we build machines in India">
        <div className="grid gap-5 sm:grid-cols-3">
          {missionPillars.map((pillar) => (
            <IconCard key={pillar.title} icon={pillar.icon} title={pillar.title} text={pillar.text} tone="spark" />
          ))}
        </div>
      </Section>

      <Section eyebrow="Manufacturing" icon="Factory" title="Our Kolkata manufacturing capability">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[8/5] w-full overflow-hidden rounded-xl bg-steel-soft shadow-card">
            <Image
              src="/about/factory.webp"
              alt="Stylised illustration of RA Machine's Kolkata manufacturing works"
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
            />
          </div>
          <GlancePanel title="How a machine is built" facts={[...capabilityFacts]} />
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {manufacturingParagraphs.map((p, i) => (
            <div key={p.slice(0, 24)}>
              <h3 className="font-display text-lg text-ink">{manufacturingHeadings[i]}</h3>
              <p className="mt-2 text-sm text-grey-600">{p}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Compliance" icon="Award" title="Certifications" intro={certSummary}>
        <CertStrip />
      </Section>

      <Section tone="soft" eyebrow="Leadership" icon="Users" title="Who runs RA Machine">
        <div className="grid gap-6 sm:grid-cols-3">
          {leadership.map((person) => (
            <div key={person.role} className="card-hover h-full rounded-xl border border-grey-200 bg-white p-6 shadow-card">
              <Avatar name={person.name} size={56} />
              <p className="mt-4 font-display text-lg text-ink">{person.name}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-steel">{person.role}</p>
              <p className="mt-2 text-sm text-grey-600">{person.bio}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Reach" icon="Globe" title="India & export reach" intro={reachIntroText}>
        <IndiaReachMap regions={[...exportRegions]} />
      </Section>

      <Section eyebrow="History" icon="Calendar" title="Milestones">
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {timeline.map((item) => (
            <li key={item.year} className="rounded-xl border border-grey-200 bg-white p-5 shadow-card">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-steel-soft text-steel">
                <Icon name="Calendar" size={20} />
              </span>
              <p className="mt-3 font-display text-lg text-ink">{item.year}</p>
              <p className="mt-1.5 text-sm text-grey-600">{item.text}</p>
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
