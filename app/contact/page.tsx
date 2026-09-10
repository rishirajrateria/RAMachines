/**
 * app/contact/page.tsx — Contact (SPEC §4 "/contact"). ContactForm, full
 * address, MapFacade, Call/WhatsApp/Email cards, hours, "visit our factory"
 * line, LocalBusiness schema. Anchor id="quote" (linked from the header's
 * "Request Quote" button as /contact#quote).
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
import ContactStrip from "@/components/sections/ContactStrip";
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
      <Section tight>
        <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Contact", href: paths.contact }]} />
        <h1 className="mt-2 font-display text-display-lg text-ink">Contact RA Machine</h1>
        <div className="mt-4 max-w-2xl">
          <AboutBlurb />
        </div>
        <p className="mt-4 max-w-prose text-grey-600">
          Whether you are ready to request a quotation, need to book a repair visit, want to arrange
          operator training, are enquiring about export shipping, or have a general question, the
          fastest way to reach our team is by phone or WhatsApp during business hours, or by the form
          below at any time. We aim to respond to every enquiry, including export and job work
          enquiries, within one working day.
        </p>
      </Section>

      <Section id="quote" eyebrow="Get in touch" title="Send us your requirement">
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div>
            <p className="mb-6 max-w-prose text-sm text-grey-600">
              Fill in the form below with as much detail as you can — material, thickness, sheet or
              tube size, and production volume for a machine enquiry; brand, model and problem
              description for a repair booking; or country and product for an export enquiry. The more
              context you give us, the more precisely our sales engineers can respond on the first
              reply instead of needing a follow-up question.
            </p>
            <ContactForm />
          </div>
          <div>
            <ContactStrip />
            <p className="mt-6 max-w-prose text-sm text-grey-600">
              Prefer to speak with someone directly? Call or WhatsApp us during business hours and ask
              for sales, service or export, depending on your enquiry, and we will connect you with the
              right person straight away.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Our works" title="Visit our factory">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="max-w-prose text-grey-600">
              Our manufacturing works and head office are located in Tiljala, Kolkata, where every RA
              Machine unit is fabricated, assembled and tested before dispatch. Visitors are welcome by
              prior appointment — call or email ahead and we will arrange a walk-through of the shop
              floor and, where a suitable machine is available, a live demonstration cut or weld.
            </p>
            <address className="mt-6 flex items-start gap-2 text-sm not-italic text-grey-700">
              <MapPin width={18} height={18} className="mt-0.5 shrink-0 text-grey-400" />
              {site.address.full}
            </address>
            <p className="mt-3 text-sm text-grey-600">Hours: {site.hours}</p>
          </div>
          <MapFacade />
        </div>
      </Section>

      <JsonLd data={localBusinessSchema()} />
    </>
  );
}
