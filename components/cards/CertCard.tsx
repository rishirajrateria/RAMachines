/**
 * components/cards/CertCard.tsx — certification card (home strip + /certifications
 * grid). Pass `onOpen` from a client parent to make the image open a modal viewer;
 * without it the card is a plain link to /certifications.
 */
import Image from "next/image";
import Link from "next/link";
import type { Certification } from "@/data/types";
import { paths } from "@/lib/urls";

export default function CertCard({
  cert,
  onOpen,
}: {
  cert: Certification;
  onOpen?: (cert: Certification) => void;
}) {
  const imageEl = (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded bg-grey-100">
      <Image
        src={cert.image.src}
        alt={cert.image.alt}
        width={cert.image.width}
        height={cert.image.height}
        className="h-full w-full object-cover"
      />
    </div>
  );

  return (
    <div className="rounded border border-grey-200 p-4">
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
