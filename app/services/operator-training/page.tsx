import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { courseSchema, serviceSchema } from "@/lib/schema";
import { paths } from "@/lib/urls";
import { trainingFaqs } from "@/data/faqs";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import CtaGroup from "@/components/ui/CtaGroup";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import TrainingForm from "@/components/forms/TrainingForm";
import {
  introParagraphs,
  curriculumIntro,
  curriculumModules,
  locationParagraph,
  whoForParagraph,
  outcomesIntro,
  outcomes,
  outcomesClosing,
  bookIntro,
} from "./copy";

const description =
  "On-site or Kolkata-centre training in laser cutting machine operation, safety, maintenance and nesting software for new and experienced CNC operators.";

export const metadata: Metadata = buildMetadata({
  title: "Laser Cutting Machine Operator Training & CNC Course",
  description,
  path: paths.training,
});

export default function OperatorTrainingPage() {
  return (
    <>
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Operator Training", href: paths.training }]} />
        <h1 className="mt-4 max-w-4xl font-display text-display-lg text-ink">
          Laser Cutting Machine Operator Training &amp; CNC Training
        </h1>
        <div className="mt-6 max-w-prose">
          <AboutBlurb context="We train your operators on machine operation, safety, maintenance and nesting software, either at your site or at our Kolkata training centre." />
        </div>
        <div className="mt-8 space-y-4 max-w-prose text-grey-700">
          {introParagraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <div className="mt-8">
          <CtaGroup context="operator training" />
        </div>
      </Section>

      <Section title="Curriculum" intro={curriculumIntro} tight>
        <div className="grid gap-8 md:grid-cols-2">
          {curriculumModules.map((module) => (
            <div key={module.title}>
              <h3 className="font-display text-lg text-ink">{module.title}</h3>
              <p className="mt-2 max-w-prose text-sm text-grey-700">{module.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="At your site or our Kolkata training centre" tight>
        <p className="max-w-prose text-grey-700">{locationParagraph}</p>
      </Section>

      <Section title="Who this training is for" tight>
        <p className="max-w-prose text-grey-700">{whoForParagraph}</p>
      </Section>

      <Section title="What your team can do afterwards" intro={outcomesIntro} tight>
        <ul className="max-w-prose list-disc space-y-2 pl-5 text-grey-700">
          {outcomes.map((o) => (
            <li key={o.slice(0, 24)}>{o}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-prose text-grey-700">{outcomesClosing}</p>
      </Section>

      <Section id="book" title="Book Staff Training" tight>
        <p className="max-w-prose text-grey-700">{bookIntro}</p>
        <div className="mt-6 max-w-xl">
          <TrainingForm />
        </div>
      </Section>

      <Section tight>
        <Faq items={trainingFaqs} title="Frequently asked questions about operator training" />
      </Section>

      <JsonLd
        data={[
          courseSchema({
            name: "Laser Cutting Machine Operator Training",
            description,
            path: paths.training,
          }),
          serviceSchema({
            name: "Laser Cutting Machine Operator Training",
            description,
            path: paths.training,
            areaServed: "India",
            serviceType: "Operator and CNC training",
          }),
        ]}
      />
    </>
  );
}
