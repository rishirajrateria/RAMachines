/**
 * components/ui/DividedList.tsx — ADR-0005 §5: two-column list with hairline
 * dividers, no cards — for industries, sectors, applications. `href` makes a row
 * a link (whole row, with an arrow); `meta` is a small detail line under the text.
 *
 * `meta` used to sit in a `shrink-0` column on the right. On a narrow two-column
 * row a long meta (a machine name) refused to shrink, so the title/text column
 * collapsed to a few characters wide — the "broken formatting on the left" the
 * client reported on the Kenya page. Under the text it can never squeeze it.
 *
 * ADR-0008 §3: the divider uses `border-[color:var(--hairline)]` (was a baked-in
 * rgba) so it retints for free inside a `.band-deep` section (app/globals.css).
 *
 * ADR-0009 §2: a bulk link list — every row link opts out of the App Router's
 * viewport prefetch (`prefetch={false}`); these are never the link people click
 * next, and a long list (industries, sectors, applications) can be 20+ rows.
 */
import Link from "next/link";
import { ArrowRight } from "./Icons";
import Reveal from "./Reveal";

export default function DividedList({
  items,
  columns = 2,
}: {
  items: { title: string; text?: string; href?: string; meta?: string }[];
  columns?: 1 | 2;
}) {
  if (!items.length) return null;
  const colClass = columns === 2 ? "md:columns-2 md:gap-x-10" : "";

  return (
    <Reveal className={colClass}>
      {items.map((item) => {
        const row = (
          <div className="flex items-center justify-between gap-4 border-t border-[color:var(--hairline)] py-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{item.title}</p>
              {item.text && <p className="mt-0.5 text-sm text-grey-600">{item.text}</p>}
              {item.meta && <p className="mt-1 text-xs font-medium text-teal">{item.meta}</p>}
            </div>
            {item.href && (
              <ArrowRight width={14} height={14} className="shrink-0 text-teal transition-transform group-hover:translate-x-0.5" />
            )}
          </div>
        );
        return (
          <div key={item.title} className="break-inside-avoid">
            {item.href ? (
              <Link href={item.href} prefetch={false} className="group block">
                {row}
              </Link>
            ) : (
              row
            )}
          </div>
        );
      })}
    </Reveal>
  );
}
