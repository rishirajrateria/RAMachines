/**
 * app/page.tsx — Home. ADR-0008 §3: the same 7-section spirit as ADR-0005 §6
 * (image hero, trust strip, Machines, Why RA Machine, Where we work,
 * Certifications, Faq + CTA) but with real editorial hierarchy — a deep,
 * bento-grid "Machines" showcase led by one flagship machine, and a deep CTA
 * closing section, per the value-rhythm rule ("at least two dark sections").
 * Long copy lives in ./_home/copy.ts.
 */
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { localBusinessSchema } from "@/lib/schema";
import { site } from "@/config/site";
import { photos } from "@/lib/photos";
import { categories, products, topStates, topCountries, homeFaqs, getProduct } from "@/data";
import JsonLd from "@/components/ui/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Chips from "@/components/ui/Chips";
import Faq from "@/components/ui/Faq";
import { Icon, ArrowRight } from "@/components/ui/Icons";
import GlassCard from "@/components/ui/GlassCard";
import PageHero from "@/components/layout/PageHero";
import BentoGrid from "@/components/ui/BentoGrid";
import BentoTile from "@/components/ui/BentoTile";
import { FactStrip, ImageSlot, ImageBand } from "@/components/ui/glass";
import CertStrip from "@/components/sections/CertStrip";
import HeroVideo from "@/components/media/HeroVideo";
import CategoryCard from "@/components/cards/CategoryCard";
import ProductCard from "@/components/cards/ProductCard";
import QuoteForm from "@/components/forms/QuoteForm";
import {
  heroSentence,
  glanceContext,
  machinesEyebrow,
  machinesHeadingLines,
  machinesIntro,
  flagshipPitch,
  whyPoints,
  ctaText,
} from "./_home/copy";

export const metadata: Metadata = buildMetadata({
  title: "Laser Cutting Machine Manufacturer India | RA Machine",
  description:
    "RA Machine designs, manufactures and exports fiber laser, tube laser, CO2 laser and robotic welding machines from Kolkata, with installation, training and service across India and worldwide.",
  path: paths.home,
});

const whyImageKeys = ["slot-quality-check", "slot-engineer-service", "slot-installation"] as const;
const whyImageLabels = ["Photo: quality check", "Photo: service engineer", "Photo: installation"];

// The Machines showcase leads with this flagship model — the best-selling fiber
// laser — plus one machine each from the tube, CO2 and robotic-welding lines.
const flagship = getProduct("ra-f3015-pro")!;
const spotlightSlugs = ["ra-t6000", "ra-rw6"] as const;
const spotlightMachines = spotlightSlugs.map((slug) => getProduct(slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));

const flagshipStats = [
  { label: flagship.specs[0].label, value: "3 kW" },
  { label: flagship.specs[1].label, value: "1.5 × 3 m" },
  { label: flagship.specs[2].label, value: "25 mm" },
];

export default function HomePage() {
  const states = topStates(6);
  const countries = topCountries(8);

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

      {/* 2. Trust strip — AboutBlurb entity facts + the four headline stats. */}
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

      {/* 3. Machines — the centrepiece: a deep bento grid led by the flagship
          RA-F3015 Pro, then the 4 categories and 3 more machines. */}
      <Section id="machines" tone="dark">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="eyebrow mb-3">
            <Icon name="Layers" size={16} />
            {machinesEyebrow}
          </p>
          <h2 className="section-title text-display-md">
            {machinesHeadingLines[0]}
            <br className="hidden sm:block" />
            {machinesHeadingLines[1]}
          </h2>
          <p className="mt-3 text-grey-600">{machinesIntro}</p>
        </div>

        <BentoGrid>
          <BentoTile span="feature">
            <GlassCard
              href={paths.product(flagship.category, flagship.slug)}
              strong
              className="h-full shadow-lift"
              artwork={
                <div className="pedestal relative aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgba(45,212,191,0.18),transparent_70%)] lg:aspect-auto lg:h-52">
                  <Image
                    src={flagship.images[0].src}
                    alt={flagship.images[0].alt}
                    width={flagship.images[0].width}
                    height={flagship.images[0].height}
                    priority
                    className="pedestal-render mx-auto h-full w-4/5 object-contain"
                  />
                </div>
              }
            >
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">Flagship machine</p>
              <h3 className="mt-1 font-display text-xl text-ink">{flagship.name}</h3>
              <p className="mt-1.5 line-clamp-1 text-sm text-grey-600">{flagshipPitch}</p>
              <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-[color:var(--hairline)] pt-4">
                {flagshipStats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="text-stat text-ink">{stat.value}</dd>
                    <dt className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-grey-500">{stat.label}</dt>
                  </div>
                ))}
              </dl>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                View machine
                <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </GlassCard>
          </BentoTile>

          {categories.map((category) => (
            <BentoTile key={category.slug} className="lg:row-span-2">
              <CategoryCard
                category={category}
                count={products.filter((p) => p.category === category.slug).length}
              />
            </BentoTile>
          ))}

          {spotlightMachines.map((product) => (
            <BentoTile key={product.slug} className="lg:row-span-2">
              <ProductCard product={product} compact />
            </BentoTile>
          ))}
        </BentoGrid>
      </Section>

      {/* 4. Why RA Machine — 3 glass cards, each with an image top. */}
      <Section eyebrow="Why us" icon="Sparkles" title="Why RA Machine">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyPoints.map((item, i) => (
            <GlassCard
              key={item.title}
              className="shadow-lift"
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

      {/* 6. Certifications — single quiet row of badges + link. */}
      <Section eyebrow="Compliance" icon="Award" title="Certifications">
        <CertStrip />
      </Section>

      {/* 7. Faq (light) + a deep CTA section with the quote form. */}
      <Section>
        <Faq items={homeFaqs} />
      </Section>

      <Section id="quote" tone="dark" eyebrow="Get in touch" icon="Headset" title="Ready to talk" intro={ctaText}>
        <div className="glass-strong p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[3fr_2fr]">
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
