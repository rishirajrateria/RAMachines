/**
 * components/ui/IconCard.tsx — the standard "why us" / service / point card: a tinted
 * icon tile, title, one-line text, and an optional link (whole card becomes clickable).
 */
import Link from "next/link";
import { Icon, type IconName } from "./Icons";

const toneClasses: Record<"steel" | "spark" | "plain", string> = {
  steel: "bg-steel-soft text-steel",
  spark: "bg-spark-soft text-spark",
  plain: "bg-grey-100 text-ink",
};

export default function IconCard({
  icon,
  title,
  text,
  href,
  tone = "steel",
}: {
  icon: IconName;
  title: string;
  text: string;
  href?: string;
  tone?: "steel" | "spark" | "plain";
}) {
  const inner = (
    <div className="card-hover h-full rounded-xl border border-grey-200 bg-white p-6 shadow-card">
      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        <Icon name={icon} size={22} />
      </span>
      <h3 className="mt-4 font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm text-grey-600">{text}</p>
      {href && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel">
          Learn more
          <Icon name="ArrowRight" size={14} />
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
