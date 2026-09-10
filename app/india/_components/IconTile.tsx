/**
 * app/india/_components/IconTile.tsx — decorative tinted square with one large centred
 * icon. Used as the "aside" column of CopyBlock when a section has no more specific
 * illustration or fact set to show (ADR-0002: prose blocks get an icon column).
 */
import { Icon, type IconName } from "@/components/ui/Icons";

export default function IconTile({
  icon,
  tone = "soft",
}: {
  icon: IconName;
  tone?: "soft" | "spark";
}) {
  const toneClass = tone === "spark" ? "bg-spark-soft text-spark" : "bg-steel-soft text-steel";
  return (
    <div className={`flex aspect-[4/3] w-full items-center justify-center rounded-xl md:aspect-square ${toneClass}`}>
      <Icon name={icon} size={64} />
    </div>
  );
}
