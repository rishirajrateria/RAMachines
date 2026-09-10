/**
 * components/sections/CtaBand.tsx — ADR-0005 §5: a closing CTA glass panel
 * (replaces the old dark ink→teal gradient band) with a primary teal pill
 * "Request a Quote" + a secondary glass pill "Call us". Optional `product`
 * pre-fills the Request a Quote form.
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
    <div className="section-rhythm">
      <Container>
        <div className="glass-strong p-8 text-center md:p-12">
          <h2 className="section-title mx-auto max-w-2xl text-display-md">{title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-grey-600">{text}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              href="#quote"
              variant="solid"
              size="lg"
              icon="ArrowRight"
              aria-label={product ? `Request a quote for ${product}` : "Request a quote"}
            >
              Request a Quote
            </Button>
            <Button href={site.phoneHref} variant="outline" size="lg" icon="Phone">
              Call {site.phoneDisplay}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
