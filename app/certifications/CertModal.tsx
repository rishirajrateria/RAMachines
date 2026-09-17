/**
 * app/certifications/CertModal.tsx — divided list of certificates (name, issuer,
 * one line) with a native <dialog> image viewer. Recreates the hairline
 * two-column divided-list look (matching components/ui/DividedList.tsx, which
 * only supports link/static rows) using one row per certificate.
 *
 * ADR-0010: a Server Component. Every certificate's panel is pre-rendered inside
 * a single closed `<dialog>`; because a closed dialog is `display: none`, none of
 * those lazy-loaded certificate images is fetched until the dialog is opened.
 * public/enhance.js unhides the matching panel and calls `showModal()`.
 *
 * Without JavaScript each row is an ordinary link straight to the full-size
 * certificate image, so the certificates are still all reachable.
 */
import { ArrowRight, Close } from "@/components/ui/Icons";
import type { Certification } from "@/data/types";

export default function CertModal({ certifications }: { certifications: Certification[] }) {
  return (
    <div>
      <div className="md:columns-2 md:gap-x-10">
        {certifications.map((cert) => (
          <div key={cert.slug} className="break-inside-avoid border-t border-[rgba(15,26,26,0.08)] py-4">
            <a
              data-cert={cert.slug}
              href={cert.image.src}
              className="group flex w-full items-start justify-between gap-4 text-left"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{cert.name}</span>
                <span className="mt-0.5 block text-xs text-grey-500">{cert.issuer}</span>
                <span className="mt-1 block text-sm text-grey-600">{cert.oneLiner}</span>
              </span>
              <span className="mt-0.5 flex shrink-0 items-center gap-1.5 text-sm font-semibold text-teal">
                View
                <ArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>
        ))}
      </div>

      <dialog
        id="cert-dialog"
        aria-label="Certificate"
        className="w-[calc(100%-2rem)] max-w-md rounded-[28px] border border-white/75 p-0 backdrop:bg-ink/60"
      >
        {certifications.map((cert) => (
          <div key={cert.slug} data-cert-panel={cert.slug} hidden className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg text-ink">{cert.name}</h2>
                <p className="text-xs text-grey-500">{cert.issuer}</p>
              </div>
              <button
                type="button"
                data-cert-close
                aria-label="Close certificate view"
                className="text-grey-500 hover:text-ink"
              >
                <Close width={20} height={20} />
              </button>
            </div>
            <div className="relative mt-4 aspect-[3/4] w-full overflow-hidden rounded-[14px] bg-grey-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cert.image.src}
                alt={cert.image.alt}
                width={cert.image.width}
                height={cert.image.height}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 text-sm text-grey-600">{cert.description}</p>
          </div>
        ))}
      </dialog>
    </div>
  );
}
