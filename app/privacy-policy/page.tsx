/**
 * app/privacy-policy/page.tsx — short, static privacy policy for a B2B
 * marketing site: enquiry forms (delivered by FormSubmit, with a copy kept in
 * our own private dashboard) and cookie-less first-party visit statistics.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { site } from "@/config/site";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AboutBlurb from "@/components/ui/AboutBlurb";
import Section from "@/components/ui/Section";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | RA Machine",
  description:
    "How RA Machine collects and uses information submitted through our enquiry, quote, repair, training and export forms.",
  path: paths.privacy,
});

export default function PrivacyPolicyPage() {
  return (
    <Section tight>
      <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Privacy Policy", href: paths.privacy }]} />
      <h1 className="mt-2 font-display text-display-lg text-ink">Privacy Policy</h1>
      <div className="mt-4 max-w-2xl">
        <AboutBlurb />
      </div>
      <Prose className="mt-8">
        <p>
          This policy explains what information RA Machine collects through this website and how it
          is used. We collect the information you submit to us directly, plus basic anonymous
          visit statistics described below. There is no advertising tracking on this site, and we do
          not sell or rent visitor data to third parties.
        </p>
        <h2>Information we collect</h2>
        <p>
          When you use our Quote, Repair Booking, Training Booking, Job Work, Contact or Export
          Enquiry forms, we collect the fields you submit, typically your name, company, phone number,
          email address, location and message content, along with which product or service the
          enquiry relates to. We do not ask for payment details, government identification numbers or
          any other sensitive personal data through these forms.
        </p>
        <h2>How your information is used</h2>
        <p>
          Form submissions are used solely to respond to your enquiry — to prepare a quotation, book a
          repair or training visit, process an export enquiry, or answer a general question. We do not
          use the information for marketing unrelated to your enquiry, and we do not share it outside
          RA Machine and RA Group except where needed to fulfil your request, such as coordinating
          shipping documentation for an export order.
        </p>
        <h2>Third-party form processing</h2>
        <p>
          Our website forms are submitted through FormSubmit (formsubmit.co), a third-party form-delivery
          service that receives your submission and forwards it to our email address. FormSubmit processes this data
          solely to deliver your message to us and operates under its own privacy practices. A copy of
          each submission is also kept in a private, password-protected dashboard that only RA
          Machine staff can open, so that enquiries are not lost.
        </p>
        <h2>Visit statistics</h2>
        <p>
          To understand which pages are useful, we record anonymous visit statistics on our own
          servers: the pages viewed, how long a page was open, the website or search engine that sent
          you, your browser and device type, your approximate location (country and city, taken from
          your connection), and whether you tapped or copied our phone number, email address or
          WhatsApp link. We do not store your IP address, and we do not use cookies or anything else
          saved on your device. Visitors are told apart only by a daily code that cannot be traced
          back to you and changes every day. If your browser sends a Do Not Track or Global Privacy
          Control signal, we do not record your visit.
        </p>
        <h2>Cookies and browser storage</h2>
        <p>
          This website does not use cookies for advertising or analytics, and its visit statistics store
          nothing on your device. Where a page uses browser local
          storage for a purely functional purpose — for example, remembering that you dismissed a
          notice — that information stays on your device and is never transmitted to us.
        </p>
        <h2>Your rights and contact</h2>
        <p>
          You may ask us at any time what information we hold about you arising from a form
          submission, or ask us to delete it, by writing to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> or calling {site.phoneDisplay}. We will
          respond to any such request within a reasonable time.
        </p>
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time to reflect changes in how the website operates.
          The version published on this page is always the current one; we encourage you to review it
          periodically if you submit forms to us regularly.
        </p>
      </Prose>
    </Section>
  );
}
