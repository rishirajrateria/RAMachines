/**
 * components/cards/CertCard.tsx — certification card (home strip + /certifications
 * grid). Pass `onOpen` from a client parent to make the image open a modal viewer;
 * without it the card is a plain link to /certifications. ADR-0002: the badge image
 * sits on a spark-tinted panel with a small ribbon-style name label.
 */
import Image from "next/image";
import Link from "next/link";
import type { Certification } from "@/data/types";
import { paths } from "@/lib/urls";
import { Award } from "@/components/ui/Icons";

export default function CertCard({
  cert,
  onOpen,
}: {
  cert: Certification;
  onOpen?: (cert: Certification) => void;
}) {
  const imageEl = (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-spark-soft">
      <Image
        src={cert.image.src}
        alt={cert.image.alt}
        width={cert.image.width}
        height={cert.image.height}
        className="h-full w-full object-contain p-4"
      />
      <span className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 rounded-md bg-ink/85 px-2 py-1 text-[11px] font-semibold text-white">
        <Award width={13} height={13} className="shrink-0 text-spark" />
        <span className="truncate">{cert.name}</span>
      </span>
    </div>
  );

  return (
    <div className="card-hover rounded-xl border border-grey-200 bg-white p-4 shadow-card">
      {onOpen ? (
        <button
          type="button"
          onClick={() => onOpen(cert)}
          className="block w-full text-left focus-visible:outline-none"
          aria-label={`View ${cert.name} certificate image`}
        >
          {imageEl}
        </button>
      ) : (
        <Link href={paths.certifications}>{imageEl}</Link>
      )}
      <h3 className="mt-3 text-sm font-semibold text-ink">{cert.name}</h3>
      <p className="mt-1 text-xs text-grey-600">{cert.oneLiner}</p>
    </div>
  );
}
