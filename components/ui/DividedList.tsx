/**
 * components/ui/DividedList.tsx — ADR-0005 §5: two-column list with hairline
 * dividers, no cards — for industries, sectors, applications. `href` makes a row
 * a link (whole row, with an arrow); `meta` is a small right-aligned detail.
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
          <div className="flex items-center justify-between gap-4 border-t border-[rgba(15,26,26,0.08)] py-4">
            <div className="min-w-0">
              <p className="font-semibold text-ink">{item.title}</p>
              {item.text && <p className="mt-0.5 text-sm text-grey-600">{item.text}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {item.meta && <span className="text-sm text-grey-500">{item.meta}</span>}
              {item.href && (
                <ArrowRight width={14} height={14} className="text-teal transition-transform group-hover:translate-x-0.5" />
              )}
            </div>
          </div>
        );
        return (
          <div key={item.title} className="break-inside-avoid">
            {item.href ? (
              <Link href={item.href} className="group block">
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
