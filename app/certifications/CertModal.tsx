"use client";

/**
 * app/certifications/CertModal.tsx — certification grid with a native <dialog>
 * modal image viewer (ADR §1: client components limited to a short list, this
 * being the certifications modal). Renders every cert as a CertCard whose image
 * opens the dialog with a larger view, issuer and full description.
 */
import { useRef, useState } from "react";
import Image from "next/image";
import CertCard from "@/components/cards/CertCard";
import { Close } from "@/components/ui/Icons";
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
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {certifications.map((cert) => (
          <CertCard key={cert.slug} cert={cert} onOpen={openCert} />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active ? `${active.name} certificate` : "Certificate"}
        className="w-[calc(100%-2rem)] max-w-md rounded border border-grey-200 p-0 backdrop:bg-ink/60"
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        {active && (
          <div className="p-5">
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
            <div className="relative mt-4 aspect-[3/4] w-full overflow-hidden rounded bg-grey-100">
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
