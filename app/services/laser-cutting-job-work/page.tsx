import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { jobWorkFaqs } from "@/data/faqs";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Button from "@/components/ui/Button";
import Faq from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icons";
import { DividedList } from "@/components/ui/glass";
import JobWorkForm from "@/components/forms/JobWorkForm";
import { introParagraphs, materialsParagraph, formatsParagraph, turnaroundParagraph, quoteIntro, heroLead } from "./copy";

export const metadata: Metadata = buildMetadata({
  title: "Laser Cutting Job Work — Custom Metal Cutting",
  description:
    "Laser cutting job work on RA Machine fiber laser equipment: materials, thicknesses, DXF/DWG drawings accepted, and confirmed turnaround.",
  path: paths.jobWork,
  noindex: true,
});

export default function LaserCuttingJobWorkPage() {
  return (
    <>
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Job Work", href: paths.jobWork }]} />
      </Container>

      <Section tone="dark">
        <p className="eyebrow mb-3">
          <Icon name="Sheet" size={16} />
          Job Work
        </p>
        <h1 className="max-w-4xl font-display text-display-lg text-ink">Laser Cutting Job Work</h1>
        <p className="mt-4 max-w-prose text-grey-700">{heroLead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#quote" variant="solid" icon="ArrowRight">
            Request a Quote
          </Button>
          <Button href={site.phoneHref} variant="outline" icon="Phone">
            Call us
          </Button>
        </div>
      </Section>

      <Container>
        <AboutBlurb context="Alongside our machine range, we also cut parts to your drawing on our own fiber laser equipment for customers who do not need to buy a machine." />
      </Container>

      <Section eyebrow="Job work" title="What we need" intro={introParagraphs[0]}>
        <DividedList
          items={[
            { title: "Materials & thickness", text: materialsParagraph },
            { title: "Drawing formats", text: formatsParagraph },
            { title: "Turnaround", text: turnaroundParagraph },
            { title: "Pricing", text: "Confirmed before we start, at the quotation stage." },
          ]}
          columns={1}
        />
      </Section>

      <Section eyebrow="Request a quote" title="Get a Quote">
        <p className="max-w-prose text-grey-700">{quoteIntro}</p>
        <div id="quote" className="glass mt-6 max-w-xl p-6 md:p-8">
          <JobWorkForm />
        </div>
      </Section>

      <Section>
        <Faq items={jobWorkFaqs} title="Frequently asked questions about job work" />
      </Section>
    </>
  );
}
