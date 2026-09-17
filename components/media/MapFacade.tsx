/**
 * components/media/MapFacade.tsx — click-to-load Google Maps embed. Shows a glass
 * preview with a MapPin icon and the address until the visitor taps the button, so
 * the heavy Maps iframe never loads (or blocks anything) unless requested.
 *
 * ADR-0010: a Server Component. The iframe sits in an inert `<template>` that
 * public/enhance.js clones in on click, replacing the facade. Without JavaScript
 * the control is a plain link that opens the same location on Google Maps in a
 * new tab, so the address is never a dead end.
 */
import { site } from "@/config/site";
import { MapPin } from "@/components/ui/Icons";

export default function MapFacade() {
  return (
    <div data-map>
      <div className="glass flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 p-6 text-center sm:aspect-video">
        <span className="glass-pill flex h-11 w-11 items-center justify-center p-0 text-teal">
          <MapPin width={20} height={20} />
        </span>
        <p className="max-w-sm text-sm text-grey-600">{site.address.full}</p>
        <a
          data-map-load
          href={site.address.mapsLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-pill flex h-11 items-center px-5 text-sm font-semibold text-ink"
        >
          Load map
        </a>
      </div>
      <template
        dangerouslySetInnerHTML={{
          __html: `<div class="glass aspect-[4/3] w-full overflow-hidden p-0 sm:aspect-video"><iframe src="${site.address.mapsEmbedUrl}" title="Map showing ${site.name} location in Kolkata" class="h-full w-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`,
        }}
      />
    </div>
  );
}
