/**
 * app/privacy-policy/page.tsx — short, static privacy policy for a B2B
 * marketing site whose only data collection is through Web3Forms-powered
 * enquiry forms. No analytics or tracking scripts are used on this site.
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
          is used. We collect information only when you submit it directly to us — there is no
          analytics or advertising tracking on this site, and we do not sell or rent visitor data to
          third parties.
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
          Our website forms are submitted through Web3Forms, a third-party form-delivery service that
          receives your submission and forwards it to our email address. Web3Forms processes this data
          solely to deliver your message to us and operates under its own privacy practices; we do not
          store form submissions in a database on this website, since the site itself has no backend
          or server-side storage.
        </p>
        <h2>Cookies and browser storage</h2>
        <p>
          This website does not use advertising or analytics cookies. Where a page uses browser local
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
