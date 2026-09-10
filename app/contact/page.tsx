/**
 * app/contact/page.tsx — Contact. ADR-0005 "Liquid Glass" §6 / ADR-0007 §1, §4:
 * image hero (H1, one sentence, call/WhatsApp buttons, three inline facts) →
 * two panels side by side (ContactForm | address + hours + map + image) →
 * LocalBusiness schema.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { photos } from "@/lib/photos";
import { localBusinessSchema } from "@/lib/schema";
import JsonLd from "@/components/ui/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/forms/ContactForm";
import MapFacade from "@/components/media/MapFacade";
import { MapPin } from "@/components/ui/Icons";
import PageHero from "@/components/layout/PageHero";
import { ImageSlot } from "@/components/ui/glass";

export const metadata: Metadata = buildMetadata({
  title: "Contact RA Machine — Kolkata, India",
  description:
    "Contact RA Machine for a quotation, machine repair, operator training or export enquiry. Call, WhatsApp, email or fill in our form — Kolkata, West Bengal.",
  path: paths.contact,
});

export default function ContactPage() {
  return (
    <>
      {/* 1. Hero — full-bleed photo banner. */}
      <PageHero image={photos["hero-contact"]} align="start">
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Contact", href: paths.contact }]} />
        <p className="eyebrow">Sales & service desk</p>
        <h1 className="mt-4 font-display text-display-lg text-ink">Contact RA Machine</h1>
        <p className="mt-4 max-w-prose text-grey-600">
          Reach our Kolkata sales and service desk by phone, WhatsApp, email or the form below — replies
          within one working day.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button href={site.phoneHref} variant="solid">
            Call {site.phoneDisplay}
          </Button>
          <Button href={site.whatsappHref} variant="outline" external>
            WhatsApp us
          </Button>
        </div>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-teal">
          <a href={`mailto:${site.email}`}>Email</a>
          <span className="font-normal text-grey-600">{site.address.locality}, {site.address.region}</span>
          <span className="font-normal text-grey-600">{site.hours}</span>
        </div>
      </PageHero>

      {/* 2. Two panels side by side: form | address + hours + map + image. */}
      <Section id="quote">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass p-6 md:p-8">
            <h2 className="font-display text-lg text-ink">Send an enquiry</h2>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>
          <div>
            <h2 className="font-display text-lg text-ink">Visit our works</h2>
            <div className="mt-4 max-w-prose">
              <AboutBlurb />
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:items-start">
              <div>
                <address className="flex items-start gap-2 text-sm not-italic text-grey-600">
                  <MapPin width={18} height={18} className="mt-0.5 shrink-0 text-teal" />
                  {site.address.full}
                </address>
                <p className="mt-2 text-sm text-grey-600">Hours: {site.hours}</p>
                <div className="mt-5">
                  <MapFacade />
                </div>
              </div>
              <ImageSlot image={photos["slot-office"]} aspect="4/3" label="Photo: RA Machine office" />
            </div>
          </div>
        </div>
      </Section>

      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
