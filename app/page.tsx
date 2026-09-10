/**
 * app/page.tsx — Home. ADR-0005 "Liquid Glass" §6 / ADR-0007 §1, §4: exactly 7
 * calm sections — image hero, FactStrip, Machines, Why RA Machine, Where we
 * work, Certifications, Faq + CTA. Long copy lives in ./_home/copy.ts.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema } from "@/lib/schema";
import { site } from "@/config/site";
import { photos } from "@/lib/photos";
import { categories, products, topStates, topCountries, homeFaqs } from "@/data";
import JsonLd from "@/components/ui/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Chips from "@/components/ui/Chips";
import Faq from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icons";
import GlassCard from "@/components/ui/GlassCard";
import PageHero from "@/components/layout/PageHero";
import { FactStrip, ImageSlot, ImageBand } from "@/components/ui/glass";
import CertStrip from "@/components/sections/CertStrip";
import HeroVideo from "@/components/media/HeroVideo";
import CategoryCard from "@/components/cards/CategoryCard";
import QuoteForm from "@/components/forms/QuoteForm";
import { heroSentence, glanceContext, whyPoints, ctaText } from "./_home/copy";

export const metadata: Metadata = buildMetadata({
  title: "Laser Cutting Machine Manufacturer India | RA Machine",
  description:
    "RA Machine designs, manufactures and exports fiber laser, tube laser, CO2 laser and robotic welding machines from Kolkata, with installation, training and service across India and worldwide.",
  path: paths.home,
});

const whyImageKeys = ["slot-quality-check", "slot-engineer-service", "slot-installation"] as const;
const whyImageLabels = ["Photo: quality check", "Photo: service engineer", "Photo: installation"];

export default function HomePage() {
  const states = topStates(8);
  const countries = topCountries(10);

  return (
    <>
      {/* 1. Hero — full-bleed photo banner, HeroVideo light drift as overlay. */}
      <PageHero
        image={photos["hero-home"]}
        size="full"
        align="center"
        overlay={
          <HeroVideo
            poster={{ src: "/hero-poster.webp", width: 1920, height: 1080 }}
            posterAlt="Soft teal light forms with a faint outline of a fiber laser cutting gantry"
          />
        }
      >
        <Breadcrumbs items={[{ name: "Home", href: paths.home }]} />
        <p className="eyebrow justify-center">Manufactured in Kolkata · Exported worldwide</p>
        <h1 className="mt-4 font-display text-display-xl text-ink">
          Laser Cutting Machines Built in India, Trusted Worldwide
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-grey-600 sm:text-lg">{heroSentence}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={paths.products} variant="solid" size="lg" icon="ArrowRight">
            Explore machines
          </Button>
          <Button href="#quote" variant="outline" size="lg">
            Request a quote
          </Button>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-teal">
          <Link href={paths.repair}>Machine repair</Link>
          <Link href={paths.training}>Operator training</Link>
          <Link href={paths.exportHub}>Export enquiry</Link>
        </div>
      </PageHero>

      {/* 2. At a glance — AboutBlurb (entity facts) + FactStrip (headline numbers). */}
      <Section eyebrow="Overview" title="At a glance">
        <div className="mb-8 max-w-prose">
          <AboutBlurb context={glanceContext} />
        </div>
        <FactStrip facts={[...site.stats]} />
      </Section>

      <ImageBand
        image={photos["slot-factory"]}
        overlayText="Built and tested at our Kolkata works"
        label="Photo: factory floor"
      />

      {/* 3. Machines — 4 category tiles. */}
      <Section
        eyebrow="Product range"
        icon="Layers"
        title="Machines"
        intro="Four categories built around how fabricators actually work."
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
      </Section>

      {/* 4. Why RA Machine — 3 glass cards, each with an image top. */}
      <Section eyebrow="Why us" icon="Sparkles" title="Why RA Machine">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyPoints.map((item, i) => (
            <GlassCard
              key={item.title}
              artwork={<ImageSlot image={photos[whyImageKeys[i]]} aspect="16/9" label={whyImageLabels[i]} />}
            >
              <span className="glass-pill inline-flex h-10 w-10 items-center justify-center p-0 text-teal">
                <Icon name={item.icon} size={20} />
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm text-grey-600">{item.text}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* 5. Where we work — two glass tiles, each with an image header. */}
      <Section eyebrow="Reach" icon="Globe" title="Where we work">
        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard artwork={<ImageSlot image={photos["slot-crate-shipping"]} aspect="16/9" label="Photo: crate shipping" />}>
            <h3 className="font-display text-lg text-ink">India</h3>
            <p className="mt-2 text-sm text-grey-600">
              Installed and serviced across every major Indian industrial state.
            </p>
            <div className="mt-5">
              <Chips items={states.map((state) => ({ label: state.name, href: paths.state(state.slug) }))} />
            </div>
          </GlassCard>
          <GlassCard artwork={<ImageSlot image={photos["slot-port"]} aspect="16/9" label="Photo: container port" />}>
            <h3 className="font-display text-lg text-ink">World</h3>
            <p className="mt-2 text-sm text-grey-600">Exported to more than 25 countries across five continents.</p>
            <div className="mt-5">
              <Chips items={countries.map((country) => ({ label: country.name, href: paths.country(country.slug) }))} />
            </div>
          </GlassCard>
        </div>
      </Section>

      {/* 6. Certifications — single pill row + link. */}
      <Section eyebrow="Compliance" icon="Award" title="Certifications">
        <CertStrip />
      </Section>

      {/* 7. Faq + one glass CTA panel with QuoteForm and text contact links. */}
      <Section>
        <Faq items={homeFaqs} />
        <div id="quote" className="glass-strong mt-12 p-8 md:p-10">
          <h3 className="font-display text-2xl text-ink">Ready to talk</h3>
          <p className="mt-2 max-w-prose text-grey-600">{ctaText}</p>
          <div className="mt-6 grid gap-8 md:grid-cols-[3fr_2fr]">
            <QuoteForm />
            <div className="flex flex-col gap-2 text-sm font-semibold text-ink">
              <a href={site.phoneHref}>{site.phoneDisplay}</a>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp us
              </a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </div>
        </div>
      </Section>

      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
