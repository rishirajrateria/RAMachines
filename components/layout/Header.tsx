/**
 * components/layout/Header.tsx — sticky, 64px header. Server Component; the only
 * interactive part is <MobileNav />. ADR-0002: softer border/blur, spark "Request
 * Quote" button (the site's one deliberately warm, attention-grabbing CTA).
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
    <header className="sticky top-0 z-30 h-16 border-b border-grey-200/70 bg-white/95 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href={paths.home} className="flex flex-col leading-none">
          <span className="font-display text-xl text-ink">{site.name}</span>
          <span className="text-[11px] text-grey-600">an RA Group company</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-semibold text-ink transition-colors hover:text-spark">
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
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-grey-300 px-4 text-sm font-semibold text-ink transition-colors hover:border-steel hover:text-steel"
          >
            RA Auto <ArrowUpRight width={14} height={14} />
          </a>
          <Button href="/contact#quote" variant="solid" tone="spark" size="md">
            Request Quote
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
