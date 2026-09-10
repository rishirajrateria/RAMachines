"use client";

/**
 * app/certifications/CertModal.tsx — divided list of certificates (name, issuer,
 * one line) with a native <dialog> modal image viewer. Recreates the hairline
 * two-column divided-list look (matching components/ui/DividedList.tsx, which
 * only supports link/static rows, not a click handler) using buttons so each
 * row's "View" control opens the modal instead of navigating.
 */
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Close } from "@/components/ui/Icons";
import type { Certification } from "@/data/types";

export default function CertModal({ certifications }: { certifications: Certification[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Certification | null>(null);

  function openCert(cert: Certification) {
    setActive(cert);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <div>
      <div className="md:columns-2 md:gap-x-10">
        {certifications.map((cert) => (
          <div key={cert.slug} className="break-inside-avoid border-t border-[rgba(15,26,26,0.08)] py-4">
            <button type="button" onClick={() => openCert(cert)} className="group flex w-full items-start justify-between gap-4 text-left">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{cert.name}</p>
                <p className="mt-0.5 text-xs text-grey-500">{cert.issuer}</p>
                <p className="mt-1 text-sm text-grey-600">{cert.oneLiner}</p>
              </div>
              <span className="mt-0.5 flex shrink-0 items-center gap-1.5 text-sm font-semibold text-teal">
                View
                <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active ? `${active.name} certificate` : "Certificate"}
        className="w-[calc(100%-2rem)] max-w-md rounded-[28px] border border-white/75 p-0 backdrop:bg-ink/60"
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        {active && (
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg text-ink">{active.name}</h2>
                <p className="text-xs text-grey-500">{active.issuer}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close certificate view"
                className="text-grey-500 hover:text-ink"
              >
                <Close width={20} height={20} />
              </button>
            </div>
            <div className="relative mt-4 aspect-[3/4] w-full overflow-hidden rounded-[14px] bg-grey-100">
              <Image
                src={active.image.src}
                alt={active.image.alt}
                width={active.image.width}
                height={active.image.height}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 text-sm text-grey-600">{active.description}</p>
          </div>
        )}
      </dialog>
    </div>
  );
}
