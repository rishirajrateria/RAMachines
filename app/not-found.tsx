import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { paths } from "@/lib/urls";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-steel">404</p>
      <h1 className="mt-3 font-display text-display-lg text-ink">Page not found</h1>
      <p className="mx-auto mt-4 max-w-prose text-grey-600">
        The page you are looking for does not exist or may have moved. Try one of the
        links below, or head back to the home page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href={paths.home} variant="solid">
          Home
        </Button>
        <Button href={paths.products} variant="outline">
          Products
        </Button>
        <Button href={paths.contact} variant="outline">
          Contact
        </Button>
      </div>
    </Container>
  );
}
