/**
 * app/export/SectorCard.tsx — one manufacturing sector on a country page: icon tile,
 * sector name, the original composed sentence (unchanged, for word-count parity) and
 * chips linking to the machines recommended for it. Same visual language as
 * components/ui/IconCard.tsx, extended with a chip row IconCard has no slot for.
 */
import Chips from "@/components/ui/Chips";
import { Icon, type IconName } from "@/components/ui/Icons";

export default function SectorCard({
  icon,
  title,
  text,
  products,
}: {
  icon: IconName;
  title: string;
  text: string;
  products: { name: string; href: string }[];
}) {
  return (
    <div className="h-full rounded-xl border border-grey-200 bg-white p-6 shadow-card">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-spark-soft text-spark">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="mt-4 font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm text-grey-600">{text}</p>
      {products.length > 0 && (
        <div className="mt-4">
          <Chips items={products.map((p) => ({ label: p.name, href: p.href, icon: "ArrowRight" as IconName }))} />
        </div>
      )}
    </div>
  );
}
