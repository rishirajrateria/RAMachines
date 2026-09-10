import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { jobWorkFaqs } from "@/data/faqs";
import Section from "@/components/ui/Section";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Faq from "@/components/ui/Faq";
import JobWorkForm from "@/components/forms/JobWorkForm";
import {
  introParagraphs,
  materialsParagraph,
  formatsParagraph,
  turnaroundParagraph,
  quoteIntro,
} from "./copy";

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
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Job Work", href: paths.jobWork }]} />
        <h1 className="mt-4 max-w-4xl font-display text-display-lg text-ink">Laser Cutting Job Work</h1>
        <div className="mt-6 max-w-prose">
          <AboutBlurb context="Alongside our machine range, we also cut parts to your drawing on our own fiber laser equipment for customers who do not need to buy a machine." />
        </div>
        <div className="mt-8 space-y-4 max-w-prose text-grey-700">
          {introParagraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Section>

      <Section title="Materials and thicknesses" tight>
        <p className="max-w-prose text-grey-700">{materialsParagraph}</p>
      </Section>

      <Section title="Drawing formats we accept" tight>
        <p className="max-w-prose text-grey-700">{formatsParagraph}</p>
      </Section>

      <Section title="Turnaround" tight>
        <p className="max-w-prose text-grey-700">{turnaroundParagraph}</p>
      </Section>

      <Section id="quote" title="Request a Quote" tight>
        <p className="max-w-prose text-grey-700">{quoteIntro}</p>
        <div className="mt-6 max-w-xl">
          <JobWorkForm />
        </div>
      </Section>

      <Section tight>
        <Faq items={jobWorkFaqs} title="Frequently asked questions about job work" />
      </Section>
    </>
  );
}
