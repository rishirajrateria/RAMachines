/**
 * app/contact/page.tsx — Contact. ADR-0005 "Liquid Glass" §6: hero panel (H1,
 * one sentence, three text links) → two panels side by side (ContactForm |
 * address + hours + MapFacade) → LocalBusiness schema.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import { localBusinessSchema } from "@/lib/schema";
import JsonLd from "@/components/ui/JsonLd";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import ContactForm from "@/components/forms/ContactForm";
import MapFacade from "@/components/media/MapFacade";
import { MapPin } from "@/components/ui/Icons";

export const metadata: Metadata = buildMetadata({
  title: "Contact RA Machine — Kolkata, India",
  description:
    "Contact RA Machine for a quotation, machine repair, operator training or export enquiry. Call, WhatsApp, email or fill in our form — Kolkata, West Bengal.",
  path: paths.contact,
});

export default function ContactPage() {
  return (
    <>
      {/* 1. Hero panel. */}
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Contact", href: paths.contact }]} />
        <div className="glass-strong mt-4 p-8 md:p-12">
          <h1 className="font-display text-display-lg text-ink">Contact RA Machine</h1>
          <p className="mt-4 max-w-prose text-grey-600">
            Reach our sales and service desk in Kolkata by phone, WhatsApp, email or the form below —
            we aim to respond to every enquiry within one working day.
          </p>
          <div className="mt-5 max-w-prose">
            <AboutBlurb />
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-teal">
            <a href={site.phoneHref}>Call {site.phoneDisplay}</a>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={`mailto:${site.email}`}>Email</a>
          </div>
        </div>
      </Section>

      {/* 2. Two panels side by side: form | address + hours + map. */}
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
            <address className="mt-4 flex items-start gap-2 text-sm not-italic text-grey-600">
              <MapPin width={18} height={18} className="mt-0.5 shrink-0 text-teal" />
              {site.address.full}
            </address>
            <p className="mt-2 text-sm text-grey-600">Hours: {site.hours}</p>
            <div className="mt-5">
              <MapFacade />
            </div>
          </div>
        </div>
      </Section>

      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
