/**
 * components/cards/CertCard.tsx — ADR-0005 §5: a glass pill badge — the minimal
 * ring badge image (scripts/generate-placeholders.mjs) at small size, plus the
 * certificate name. Pass `onOpen` from a client parent to make the badge open a
 * modal viewer; without it the badge is a plain link to /certifications.
 */
import Image from "next/image";
import Link from "next/link";
import type { Certification } from "@/data/types";
import { paths } from "@/lib/urls";

export default function CertCard({
  cert,
  onOpen,
  compact = false,
}: {
  cert: Certification;
  onOpen?: (cert: Certification) => void;
  compact?: boolean;
}) {
  const inner = (
    <span
      className="glass glass-hover flex h-full items-center gap-3 py-2 pl-2 pr-4 text-left"
      style={{ borderRadius: "9999px" }}
    >
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-teal-soft/40">
        <Image src={cert.image.src} alt="" width={cert.image.width} height={cert.image.height} className="h-full w-full object-contain p-1" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-ink">{cert.name}</span>
        {!compact && <span className="block truncate text-xs text-grey-500">{cert.oneLiner}</span>}
      </span>
    </span>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={() => onOpen(cert)}
        className="block w-full text-left focus-visible:outline-none"
        aria-label={`View ${cert.name} certificate image`}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={paths.certifications} className="block">
      {inner}
    </Link>
  );
}
