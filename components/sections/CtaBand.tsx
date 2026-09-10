/**
 * components/sections/CtaBand.tsx — full-width closing CTA band used near the bottom of
 * most pages. Optional `product` pre-fills the Request a Quote form.
 */
import CtaGroup from "@/components/ui/CtaGroup";
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
    <div className="border-t border-grey-200 bg-grey-50 py-14 md:py-16">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-display-md text-ink">{title}</h2>
          <p className="mt-3 text-grey-600">{text}</p>
          <div className="mt-6">
            <CtaGroup product={product} />
          </div>
        </div>
      </Container>
    </div>
  );
}
