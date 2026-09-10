/**
 * components/sections/CtaBand.tsx — full-width closing CTA band used near the bottom of
 * most pages. Optional `product` pre-fills the Request a Quote form. ADR-0004: a dark
 * ink→teal gradient band (`.band-dark`) with two buttons (spark solid "Request a Quote"
 * + outlined "Call us", both readable on dark).
 */
import { site } from "@/config/site";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function CtaBand({
  title = "Ready to talk to our team",
  text = "Tell us about your material, thickness and production volume, and we will recommend the right machine.",
  product,
}: {
  title?: string;
  text?: string;
  product?: string;
}) {
  return (
    <div className="band-dark section-rhythm">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-display-md text-white">{title}</h2>
          <p className="mt-3 text-white/75">{text}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              href="#quote"
              variant="solid"
              tone="spark"
              size="lg"
              icon="ArrowRight"
              aria-label={product ? `Request a quote for ${product}` : "Request a quote"}
            >
              Request a Quote
            </Button>
            <Button
              href={site.phoneHref}
              variant="outline"
              size="lg"
              icon="Phone"
              className="border-white/30 text-white hover:border-white hover:text-white"
            >
              Call {site.phoneDisplay}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
