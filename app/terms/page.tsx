/**
 * app/terms/page.tsx — short, static terms of use for the marketing website.
 * Commercial terms for an actual machine purchase are agreed separately in a
 * formal quotation and proforma invoice, not on this page.
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
  title: "Terms of Use | RA Machine",
  description: "Terms of use for the RA Machine website, including content, quotations, intellectual property and liability.",
  path: paths.terms,
});

export default function TermsPage() {
  return (
    <Section tight>
      <Breadcrumbs items={[{ name: "Home", href: paths.home }, { name: "Terms", href: paths.terms }]} />
      <h1 className="mt-2 font-display text-display-lg text-ink">Terms of Use</h1>
      <div className="mt-4 max-w-2xl">
        <AboutBlurb />
      </div>
      <Prose className="mt-8">
        <p>
          These terms govern your use of the RA Machine website. By browsing this site or submitting
          any form on it, you agree to the terms set out below. If you do not agree with them, please
          do not use this website.
        </p>
        <h2>Website content</h2>
        <p>
          We take reasonable care to keep product specifications, service descriptions and other
          content on this website accurate and current, but specifications, images and availability
          may change without notice as our product range and manufacturing process evolve. Content on
          this site is provided for general information and does not itself constitute a binding offer
          to sell.
        </p>
        <h2>Quotations and orders</h2>
        <p>
          No prices are published on this website. Submitting a Quote, Repair Booking, Training
          Booking, Job Work or Export Enquiry form is a request for information, not a purchase order.
          A binding commercial agreement is formed only when we issue a formal written quotation or
          proforma invoice and you confirm it in the manner stated in that document; terms in this
          page do not override or amend those commercial documents.
        </p>
        <h2>Intellectual property</h2>
        <p>
          The text, images, logos and layout on this website belong to RA Machine or {site.parent}, or
          are used under licence, and may not be copied, reproduced or reused for commercial purposes
          without our prior written permission. You may view and print pages for your own reference in
          evaluating our products and services.
        </p>
        <h2>Third-party links</h2>
        <p>
          This website links to {site.raAuto.name} and to third-party services such as our map and
          form providers. We are not responsible for the content or practices of external websites we
          link to, and inclusion of a link does not imply endorsement of everything on that site.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the extent permitted by law, RA Machine is not liable for any loss or damage arising from
          your use of this website or reliance on its content, beyond what is expressly agreed in a
          formal quotation, purchase order or contract for goods or services. Nothing in these terms
          limits liability that cannot lawfully be excluded.
        </p>
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of India, and any dispute arising from your use of this
          website is subject to the jurisdiction of the courts having authority over Kolkata, West
          Bengal.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
          or by calling {site.phoneDisplay}.
        </p>
      </Prose>
    </Section>
  );
}
