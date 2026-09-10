import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { courseSchema, serviceSchema } from "@/lib/schema";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { trainingFaqs } from "@/data/faqs";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Prose from "@/components/ui/Prose";
import Button from "@/components/ui/Button";
import Faq from "@/components/ui/Faq";
import JsonLd from "@/components/ui/JsonLd";
import { Icon } from "@/components/ui/Icons";
import { FactStrip, Steps, DividedList, ImageSlot } from "@/components/ui/glass";
import PageHero from "@/components/layout/PageHero";
import { photos } from "@/lib/photos";
import TrainingForm from "@/components/forms/TrainingForm";
import {
  introParagraphs,
  curriculumIntro,
  curriculumModules,
  locationParagraph,
  whoForParagraph,
  outcomesIntro,
  outcomes,
  bookIntro,
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
      <PageHero image={photos["hero-training"]}>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Operator Training", href: paths.training }]} />
        <p className="eyebrow mb-3">
          <Icon name="GraduationCap" size={16} />
          Operator Training
        </p>
        <h1 className="max-w-4xl font-display text-display-lg text-ink">
          Laser Cutting Machine Operator Training &amp; CNC Training
        </h1>
        <p className="mt-4 max-w-prose text-grey-700">
          Hands-on training on the exact machine your team will run, on-site or at our Kolkata training centre.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#book" variant="solid" icon="ArrowRight">
            Book Staff Training
          </Button>
          <Button href={site.phoneHref} variant="outline" icon="Phone">
            Call us
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={16} className="text-teal" />
            <span className="text-grey-600">Session length:</span>
            <span className="font-semibold text-ink">With install, or scheduled separately</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-teal" />
            <span className="text-grey-600">Location:</span>
            <span className="font-semibold text-ink">Your site or our Kolkata centre</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Users" size={16} className="text-teal" />
            <span className="text-grey-600">Group size:</span>
            <span className="font-semibold text-ink">4–6 trainees per batch</span>
          </div>
        </div>
      </PageHero>

      <Container>
        <AboutBlurb context="We train your operators on machine operation, safety, maintenance and nesting software, either at your site or at our Kolkata training centre." />
      </Container>

      <Section eyebrow="Training" title="At a glance">
        <FactStrip
          facts={[
            { icon: "Calendar", label: "Session length", value: "With installation, or scheduled separately" },
            { icon: "MapPin", label: "Location options", value: "Your site or our Kolkata centre" },
            { icon: "Users", label: "Group size", value: "4–6 trainees per batch" },
            { icon: "Certificate", label: "On completion", value: "Certificate of completion" },
          ]}
        />
      </Section>

      <Section eyebrow="Curriculum" title="What you learn" intro={curriculumIntro}>
        <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-3">
            <Prose>
              {introParagraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <p>{locationParagraph}</p>
              <p>{whoForParagraph}</p>
            </Prose>
            <div className="mt-8">
              <DividedList items={curriculumModules.map((module) => ({ title: module.title, text: module.body }))} />
            </div>
            <div className="mt-8">
              <p className="text-sm font-semibold text-ink">{outcomesIntro}</p>
              <div className="mt-3">
                <DividedList items={outcomes.map((o) => ({ title: o }))} columns={1} />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <ImageSlot image={photos["slot-training-room"]} label="Photo: training room with operator at desk" />
          </div>
        </div>
      </Section>

      <Section eyebrow="Process" title="How it's scheduled">
        <Steps steps={trainingProcessSteps.map((step) => ({ title: step.title, text: step.text }))} />
      </Section>

      <Section eyebrow="Book training" title="Book Staff Training">
        <p className="max-w-prose text-grey-700">{bookIntro}</p>
        <div id="book" className="glass mt-6 max-w-xl p-6 md:p-8">
          <TrainingForm />
        </div>
      </Section>

      <Section>
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
