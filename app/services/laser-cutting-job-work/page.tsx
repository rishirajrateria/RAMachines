import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { jobWorkFaqs } from "@/data/faqs";
import Container from "@/components/ui/Container";
import Band from "@/components/ui/Band";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import SectionHeading from "@/components/ui/SectionHeading";
import GlancePanel from "@/components/ui/GlancePanel";
import Chips from "@/components/ui/Chips";
import CtaGroup from "@/components/ui/CtaGroup";
import Faq from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icons";
import JobWorkForm from "@/components/forms/JobWorkForm";
import {
  introParagraphs,
  materialsParagraph,
  formatsParagraph,
  turnaroundParagraph,
  quoteIntro,
  heroLead,
  heroChips,
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
      <Container>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Job Work", href: paths.jobWork }]} />
      </Container>

      <Band tone="dark">
        <p className="eyebrow mb-3">
          <Icon name="Sheet" size={16} />
          Job Work
        </p>
        <h1 className="max-w-4xl font-display text-display-lg text-white">Laser Cutting Job Work</h1>
        <p className="mt-4 max-w-prose text-white/75">{heroLead}</p>
        <div className="mt-6">
          <Chips items={heroChips} />
        </div>
        <div className="mt-8">
          <CtaGroup context="job work" />
        </div>
      </Band>

      <Container className="pb-14 pt-12 md:pb-20 md:pt-16">
        <GlancePanel
          title="Job work at a glance"
          facts={[
            { icon: "Layers", label: "Materials", value: "Steel, stainless, aluminium, brass, copper" },
            { icon: "Ruler", label: "Formats", value: "DXF, DWG, PDF or sketch" },
            { icon: "Clock", label: "Turnaround", value: "A few working days" },
            { icon: "Currency", label: "Pricing", value: "Confirmed before we start" },
          ]}
        />
      </Container>

      <Container className="pb-14 md:pb-20">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-steel-soft text-steel">
            <Icon name="Sheet" size={28} />
          </span>
          <div className="space-y-4 max-w-prose text-grey-700">
            {introParagraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </Container>

      <Band tone="soft">
        <div className="space-y-12">
          <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-steel shadow-card">
              <Icon name="Layers" size={28} />
            </span>
            <div>
              <h2 className="section-title text-display-md">Materials and thicknesses</h2>
              <p className="mt-4 max-w-prose text-grey-700">{materialsParagraph}</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-spark shadow-card">
              <Icon name="Ruler" size={28} />
            </span>
            <div>
              <h2 className="section-title text-display-md">Drawing formats we accept</h2>
              <p className="mt-4 max-w-prose text-grey-700">{formatsParagraph}</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-steel shadow-card">
              <Icon name="Clock" size={28} />
            </span>
            <div>
              <h2 className="section-title text-display-md">Turnaround</h2>
              <p className="mt-4 max-w-prose text-grey-700">{turnaroundParagraph}</p>
            </div>
          </div>
        </div>
      </Band>

      <Container className="pb-14 pt-14 md:pb-20 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Request a quote" icon="Currency" title="Request a Quote" />
            <p className="mt-4 max-w-prose text-grey-700">{quoteIntro}</p>
            <div className="mt-6">
              <AboutBlurb context="Alongside our machine range, we also cut parts to your drawing on our own fiber laser equipment for customers who do not need to buy a machine." />
            </div>
          </div>
          <div id="quote" className="rounded-xl border border-grey-200 bg-white p-6 shadow-card">
            <JobWorkForm />
          </div>
        </div>
      </Container>

      <Container className="pb-14 md:pb-20">
        <Faq items={jobWorkFaqs} title="Frequently asked questions about job work" />
      </Container>
    </>
  );
}
