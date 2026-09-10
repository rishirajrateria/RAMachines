import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { courseSchema, serviceSchema } from "@/lib/schema";
import { paths } from "@/lib/urls";
import { trainingFaqs } from "@/data/faqs";
import Container from "@/components/ui/Container";
import Band from "@/components/ui/Band";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import SectionHeading from "@/components/ui/SectionHeading";
import GlancePanel from "@/components/ui/GlancePanel";
import ProcessSteps from "@/components/ui/ProcessSteps";
import IconCard from "@/components/ui/IconCard";
import Chips from "@/components/ui/Chips";
import CtaGroup from "@/components/ui/CtaGroup";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import { Icon } from "@/components/ui/Icons";
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
  heroLead,
  heroChips,
  moduleIcons,
  trainingProcessSteps,
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
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Operator Training", href: paths.training }]} />
      </Container>

      <Band tone="dark">
        <p className="eyebrow mb-3">
          <Icon name="GraduationCap" size={16} />
          Operator Training
        </p>
        <h1 className="max-w-4xl font-display text-display-lg text-white">
          Laser Cutting Machine Operator Training &amp; CNC Training
        </h1>
        <p className="mt-4 max-w-prose text-white/75">{heroLead}</p>
        <div className="mt-6">
          <Chips items={heroChips} />
        </div>
        <div className="mt-8">
          <CtaGroup context="operator training" />
        </div>
      </Band>

      <Container className="pb-14 pt-12 md:pb-20 md:pt-16">
        <GlancePanel
          title="Training at a glance"
          facts={[
            { icon: "Calendar", label: "Session length", value: "With installation, or scheduled separately" },
            { icon: "MapPin", label: "Location options", value: "Your site or our Kolkata centre" },
            { icon: "Users", label: "Group size", value: "4–6 trainees per batch" },
            { icon: "Certificate", label: "On completion", value: "Certificate of completion" },
          ]}
        />
      </Container>

      <Container className="pb-14 md:pb-20">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-steel-soft text-steel">
            <Icon name="GraduationCap" size={28} />
          </span>
          <div className="space-y-4 max-w-prose text-grey-700">
            {introParagraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </Container>

      <Band tone="soft">
        <SectionHeading eyebrow="Curriculum" icon="Layers" title="What the programme covers" intro={curriculumIntro} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {curriculumModules.map((module) => (
            <IconCard
              key={module.title}
              icon={moduleIcons[module.title] ?? "Check"}
              title={module.title}
              text={module.body}
            />
          ))}
        </div>
      </Band>

      <Container className="pb-14 pt-14 md:pb-20 md:pt-16">
        <SectionHeading eyebrow="Process" icon="ArrowRight" title="How training is scheduled" />
        <div className="mt-10">
          <ProcessSteps steps={trainingProcessSteps} />
        </div>
      </Container>

      <Container className="space-y-14 pb-14 md:space-y-16 md:pb-20">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-spark-soft text-spark">
            <Icon name="MapPin" size={28} />
          </span>
          <div>
            <h2 className="section-title text-display-md">At your site or our Kolkata training centre</h2>
            <p className="mt-4 max-w-prose text-grey-700">{locationParagraph}</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-steel-soft text-steel">
            <Icon name="Users" size={28} />
          </span>
          <div>
            <h2 className="section-title text-display-md">Who this training is for</h2>
            <p className="mt-4 max-w-prose text-grey-700">{whoForParagraph}</p>
          </div>
        </div>
      </Container>

      <Band tone="soft">
        <SectionHeading eyebrow="Outcomes" icon="Check" title="What your team can do afterwards" intro={outcomesIntro} />
        <ul className="mt-8 grid max-w-prose gap-3">
          {outcomes.map((o) => (
            <li key={o.slice(0, 24)} className="flex items-start gap-3 text-grey-700">
              <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-spark" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-prose text-grey-700">{outcomesClosing}</p>
      </Band>

      <Container className="pb-14 pt-14 md:pb-20 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Book training" icon="Calendar" title="Book Staff Training" />
            <p className="mt-4 max-w-prose text-grey-700">{bookIntro}</p>
            <div className="mt-6">
              <AboutBlurb context="We train your operators on machine operation, safety, maintenance and nesting software, either at your site or at our Kolkata training centre." />
            </div>
          </div>
          <div id="book" className="rounded-xl border border-grey-200 bg-white p-6 shadow-card">
            <TrainingForm />
          </div>
        </div>
      </Container>

      <Container className="pb-14 md:pb-20">
        <Faq items={trainingFaqs} title="Frequently asked questions about operator training" />
      </Container>

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
