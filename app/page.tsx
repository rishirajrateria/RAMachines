/**
 * app/page.tsx — Home (SPEC §4 "Home"). All 10 sections in order: hero, stats,
 * categories → products, "Why RA Machine", services strip, certifications,
 * reach, testimonials, FAQ, final CTA band. Long copy lives in ./_home/copy.ts.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema } from "@/lib/schema";
import { categories, products, homeFaqs } from "@/data";
import JsonLd from "@/components/ui/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Faq from "@/components/ui/Faq";
import StatsBar from "@/components/sections/StatsBar";
import CertStrip from "@/components/sections/CertStrip";
import ReachSection from "@/components/sections/ReachSection";
import TestimonialGrid from "@/components/sections/TestimonialGrid";
import ContactStrip from "@/components/sections/ContactStrip";
import CategoryCard from "@/components/cards/CategoryCard";
import ProductCard from "@/components/cards/ProductCard";
import QuoteForm from "@/components/forms/QuoteForm";
import HeroVideo from "@/components/media/HeroVideo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { heroSub, introParagraph, whyPoints, servicesStrip, certIntro, reachIntro, ctaText } from "./_home/copy";

export const metadata: Metadata = buildMetadata({
  title: "Laser Cutting Machine Manufacturer India | RA Machine",
  description:
    "RA Machine designs, manufactures and exports fiber laser, tube laser, CO2 laser and robotic welding machines from Kolkata, with installation, training and service across India and worldwide.",
  path: paths.home,
});

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-ink text-white">
        <HeroVideo
          poster={{ src: "/hero-poster.webp", width: 1920, height: 1080 }}
          posterAlt="RA Machine fiber laser cutting machine cutting steel sheet on the factory floor"
        />
        <div className="absolute inset-0 bg-ink/55" />
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
              <Button href={paths.products} variant="outline" size="lg" className="!border-white !text-white hover:!border-white hover:!text-white/80">
                Explore Machines
              </Button>
              <Button href="#quote" variant="solid" size="lg">
                Request a Quote
              </Button>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <li>
                <Link href={paths.repair} className="text-white/80 hover:text-white">
                  Machine Repair
                </Link>
              </li>
              <li className="text-white/40">·</li>
              <li>
                <Link href={paths.training} className="text-white/80 hover:text-white">
                  Operator Training
                </Link>
              </li>
              <li className="text-white/40">·</li>
              <li>
                <Link href={paths.exportHub} className="text-white/80 hover:text-white">
                  Export Enquiry
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }]} />
        <div className="mt-2 grid gap-8 md:grid-cols-[2fr_3fr] md:items-start">
          <AboutBlurb />
          <p className="text-sm text-grey-600">{introParagraph}</p>
        </div>
      </Section>

      <Section tight>
        <StatsBar />
      </Section>

      <Section
        eyebrow="Product range"
        title="Machines for every stage of fabrication"
        intro="Four categories built around how Indian and export fabricators actually work — sheet, tube, non-metal and welded assembly."
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
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Why RA Machine" title="Six reasons fabricators across India and abroad choose us">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {whyPoints.map((point) => (
            <div key={point.title}>
              <h3 className="font-display text-lg text-ink">{point.title}</h3>
              <p className="mt-2 text-sm text-grey-600">{point.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Beyond the machine" title="Repair, training, job work and RA Auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {servicesStrip.map((item) => (
            <div key={item.name}>
              <h3 className="font-display text-lg text-ink">{item.name}</h3>
              <p className="mt-2 text-sm text-grey-600">{item.text}</p>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-steel hover:text-steel-hover"
                >
                  Visit {item.name} <ArrowUpRight width={14} height={14} />
                </a>
              ) : (
                <Link href={item.href} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-steel hover:text-steel-hover">
                  Learn more
                </Link>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Compliance" title="Licences & Certifications" intro={certIntro}>
        <CertStrip />
      </Section>

      <Section eyebrow="Reach" title="India + World Reach" intro={reachIntro}>
        <ReachSection />
      </Section>

      <Section eyebrow="Customers" title="What fabricators say about working with us">
        <TestimonialGrid />
      </Section>

      <Section>
        <Faq items={homeFaqs} />
      </Section>

      <div id="quote" className="border-t border-grey-200 bg-grey-50 py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
            <div>
              <h2 className="font-display text-display-md text-ink">Ready to talk to our team</h2>
              <p className="mt-3 max-w-prose text-grey-600">{ctaText}</p>
              <div className="mt-8 max-w-lg">
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
