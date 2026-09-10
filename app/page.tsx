/**
 * app/page.tsx — Home (SPEC §4 "Home"). ADR-0002 visual refresh: hero band with icon
 * chips, an "at a glance" panel, illustrated category/product cards, a soft-band
 * FeatureGrid for "Why RA Machine", icon service cards, badge certifications, reach
 * cards, testimonials, FAQ and a dark CTA band. Long copy lives in ./_home/copy.ts.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema } from "@/lib/schema";
import { site } from "@/config/site";
import { categories, products, homeFaqs } from "@/data";
import JsonLd from "@/components/ui/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Chips from "@/components/ui/Chips";
import GlancePanel from "@/components/ui/GlancePanel";
import FeatureGrid from "@/components/ui/FeatureGrid";
import IconCard from "@/components/ui/IconCard";
import Faq from "@/components/ui/Faq";
import StatsBar from "@/components/sections/StatsBar";
import CertStrip from "@/components/sections/CertStrip";
import CtaBand from "@/components/sections/CtaBand";
import ReachSection from "@/components/sections/ReachSection";
import TestimonialGrid from "@/components/sections/TestimonialGrid";
import ContactStrip from "@/components/sections/ContactStrip";
import CategoryCard from "@/components/cards/CategoryCard";
import ProductCard from "@/components/cards/ProductCard";
import QuoteForm from "@/components/forms/QuoteForm";
import HeroVideo from "@/components/media/HeroVideo";
import { Icon, ArrowUpRight } from "@/components/ui/Icons";
import { heroSub, introParagraph, whyPoints, servicesStrip, certIntro, reachIntro, ctaText } from "./_home/copy";

export const metadata: Metadata = buildMetadata({
  title: "Laser Cutting Machine Manufacturer India | RA Machine",
  description:
    "RA Machine designs, manufactures and exports fiber laser, tube laser, CO2 laser and robotic welding machines from Kolkata, with installation, training and service across India and worldwide.",
  path: paths.home,
});

const glanceFacts = [
  { icon: "Clock", label: "Lead time", value: `${site.service.leadTimeWeeks} weeks` },
  { icon: "Shield", label: "Warranty", value: `${site.service.warrantyMonths} months` },
  { icon: "Headset", label: "On-site response", value: site.service.responseTime },
  { icon: "GraduationCap", label: "Training", value: "Included with purchase" },
  { icon: "Layers", label: "Machine categories", value: String(categories.length) },
  { icon: "Globe", label: "Export markets", value: "25+ countries" },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-ink text-white">
        <HeroVideo
          poster={{ src: "/hero-poster.webp", width: 1920, height: 1080 }}
          posterAlt="RA Machine fiber laser cutting machine cutting steel sheet on the factory floor"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/25" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <Container className="relative z-10 py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
              Manufactured in Kolkata · Exported worldwide
            </p>
            <h1 className="mt-4 font-display text-display-xl text-white">
              Laser Cutting Machines Built in India, Trusted Worldwide
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">{heroSub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={paths.products} variant="solid" tone="spark" size="lg" icon="ArrowRight">
                Explore Machines
              </Button>
              <Button
                href="#quote"
                variant="outline"
                size="lg"
                icon="ArrowRight"
                className="!border-white/70 !text-white hover:!border-white hover:!text-white/80"
              >
                Request a Quote
              </Button>
            </div>
            <div className="mt-7">
              <Chips
                items={[
                  { label: "Pan-India installation", icon: "MapPin" },
                  { label: "Export to 25+ countries", icon: "Globe" },
                  { label: "ISO 9001", icon: "Certificate" },
                  { label: "Indian Railways vendor", icon: "Badge" },
                ]}
              />
            </div>
          </div>
        </Container>
      </section>

      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }]} />
        <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading eyebrow="Built in Kolkata" icon="Factory" title="Engineered and supported in India" />
            <p className="mt-4 max-w-prose text-grey-600">{introParagraph}</p>
          </div>
          <GlancePanel title="RA Machine at a glance" facts={[...glanceFacts]} />
        </div>
      </Section>

      <Section tight>
        <StatsBar />
      </Section>

      <Section
        eyebrow="Product range"
        icon="Layers"
        title="Machines for every stage of fabrication"
        intro="Four categories built around how Indian and export fabricators actually work."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              count={products.filter((p) => p.category === category.slug).length}
            />
          ))}
        </div>
        <h3 className="mt-14 font-display text-lg text-ink">All machines</h3>
        <div className="mt-5 flex gap-4 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory] sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.slug}
              className="w-[75vw] max-w-[280px] flex-none [scroll-snap-align:start] sm:w-auto sm:max-w-none"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </Section>

      <Section tone="soft" eyebrow="Why RA Machine" icon="Sparkles" title="Six reasons fabricators choose us">
        <FeatureGrid items={whyPoints} columns={3} />
      </Section>

      <Section eyebrow="Beyond the machine" icon="Wrench" title="Repair, training, job work and RA Auto">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {servicesStrip.map((item) =>
            item.external ? (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover group block h-full rounded-xl border border-grey-200 bg-white p-6 shadow-card"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-spark-soft text-spark">
                  <Icon name={item.icon} size={22} />
                </span>
                <h3 className="mt-4 font-display text-lg text-ink">{item.name}</h3>
                <p className="mt-2 text-sm text-grey-600">{item.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel">
                  Visit {item.name}
                  <ArrowUpRight width={14} height={14} />
                </span>
              </a>
            ) : (
              <IconCard key={item.name} icon={item.icon} title={item.name} text={item.text} href={item.href} />
            ),
          )}
        </div>
      </Section>

      <Section eyebrow="Compliance" icon="Award" title="Licences & Certifications" intro={certIntro}>
        <div className="mb-8 max-w-2xl">
          <AboutBlurb />
        </div>
        <CertStrip />
      </Section>

      <Section eyebrow="Reach" icon="Globe" title="India + World Reach" intro={reachIntro}>
        <ReachSection />
      </Section>

      <Section eyebrow="Customers" icon="Quote" title="What fabricators say about working with us">
        <TestimonialGrid />
      </Section>

      <Section>
        <Faq items={homeFaqs} />
      </Section>

      <CtaBand title="Ready to talk to our team" text={ctaText} />

      <div id="quote" className="border-t border-grey-200 bg-grey-50 py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
            <div>
              <SectionHeading eyebrow="Get in touch" icon="ArrowRight" title="Send us your requirement" />
              <div className="mt-6 max-w-lg">
                <QuoteForm />
              </div>
            </div>
            <div>
              <ContactStrip />
            </div>
          </div>
        </Container>
      </div>

      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
