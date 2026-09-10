/**
 * app/not-found.tsx — ADR-0006 §Polish: a glass panel, one line, two links.
 */
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { paths } from "@/lib/urls";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60svh] items-center justify-center py-24 text-center">
      <Reveal className="glass-strong mx-auto max-w-lg p-10 md:p-12">
        <p className="eyebrow justify-center">404</p>
        <h1 className="mt-3 font-display text-display-lg text-ink">Page not found</h1>
        <p className="mx-auto mt-4 max-w-prose text-grey-600">This page does not exist or may have moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={paths.home} variant="solid">
            Home
          </Button>
          <Button href={paths.products} variant="outline">
            Products
          </Button>
        </div>
      </Reveal>
    </Container>
  );
}
