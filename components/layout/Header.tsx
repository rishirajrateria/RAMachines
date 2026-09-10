/**
 * components/layout/Header.tsx — ADR-0005 §5: a floating glass pill bar, fixed
 * top: 12px, centred, max-width 1100px, 56px tall: wordmark, nav links, a
 * "RA Auto ↗" text link, one teal pill "Request quote". Server Component; the
 * only interactive parts are <HeaderBar> (ADR-0006 §Motion 3: scroll state),
 * <HeaderNavLinks> (active-link highlight) and <MobileNav />. app/layout.tsx
 * compensates with pt-24 on <main> so this never overlaps page content.
 */
import Link from "next/link";
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import { ArrowUpRight } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";
import HeaderBar from "./HeaderBar";
import HeaderNavLinks from "./HeaderNavLinks";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-3 z-30 mx-auto max-w-[1100px] px-4">
      <HeaderBar>
        <Link href={paths.home} className="flex flex-col leading-none">
          <span className="font-display text-lg text-ink">{site.name}</span>
        </Link>

        <HeaderNavLinks />

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={site.raAuto.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="RA Auto, opens in new tab"
            className="inline-flex items-center gap-1 text-sm font-medium text-ink/80 hover:text-ink"
          >
            RA Auto <ArrowUpRight width={13} height={13} />
          </a>
          <Button href="/contact#quote" variant="solid" size="md">
            Request quote
          </Button>
        </div>

        <MobileNav />
      </HeaderBar>
    </header>
  );
}
