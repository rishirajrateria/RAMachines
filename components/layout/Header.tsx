/**
 * components/layout/Header.tsx — sticky, minimal 64px header. Server Component; the
 * only interactive part is <MobileNav />.
 */
import Link from "next/link";
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import { ArrowUpRight } from "@/components/ui/Icons";
import MobileNav from "./MobileNav";

const navLinks = [
  { name: "Products", href: paths.products },
  { name: "Repair", href: paths.repair },
  { name: "Training", href: paths.training },
  { name: "Export", href: paths.exportHub },
  { name: "About", href: paths.about },
  { name: "Contact", href: paths.contact },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-grey-200 bg-white/95 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href={paths.home} className="flex flex-col leading-none">
          <span className="font-display text-xl text-ink">{site.name}</span>
          <span className="text-[11px] text-grey-600">an RA Group company</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-semibold text-ink hover:text-steel">
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
            className="inline-flex h-10 items-center gap-1.5 rounded border border-grey-300 px-4 text-sm font-semibold text-ink transition-colors hover:border-steel hover:text-steel"
          >
            RA Auto <ArrowUpRight width={14} height={14} />
          </a>
          <Link
            href="/contact#quote"
            className="inline-flex h-10 items-center rounded bg-steel px-4 text-sm font-semibold text-white transition-colors hover:bg-steel-hover"
          >
            Request Quote
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
