/**
 * components/layout/Header.tsx — ADR-0005 §5: a floating glass pill bar, fixed
 * top: 12px, centred, max-width 1100px, 56px tall: wordmark, nav links, a
 * "RA Auto ↗" text link, one teal pill "Request quote". Server Component; the
 * only interactive part is <MobileNav />. app/layout.tsx compensates with
 * pt-24 on <main> so this never overlaps page content.
 */
import Link from "next/link";
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import { ArrowUpRight } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";
import MobileNav from "./MobileNav";
import { navLinks } from "./navLinks";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-3 z-30 mx-auto max-w-[1100px] px-4">
      <div className="glass-strong flex h-14 items-center justify-between gap-4 rounded-full px-4 md:px-5">
        <Link href={paths.home} className="flex flex-col leading-none">
          <span className="font-display text-lg text-ink">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-medium text-ink/80 transition-colors hover:text-ink">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

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
      </div>
    </header>
  );
}
