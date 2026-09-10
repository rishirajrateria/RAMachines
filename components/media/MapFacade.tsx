"use client";

/**
 * components/media/MapFacade.tsx — click-to-load Google Maps embed. Shows a static grey
 * preview with a MapPin icon and the address until the visitor taps the button, so the
 * heavy Maps iframe never loads (or blocks anything) unless requested.
 */
import { useState } from "react";
import { site } from "@/config/site";
import { MapPin } from "@/components/ui/Icons";

export default function MapFacade() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden rounded border border-grey-200 sm:aspect-video">
        <iframe
          src={site.address.mapsEmbedUrl}
          title={`Map showing ${site.name} location in Kolkata`}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded border border-grey-200 bg-grey-100 p-6 text-center sm:aspect-video">
      <MapPin width={28} height={28} className="text-grey-500" />
      <p className="max-w-sm text-sm text-grey-600">{site.address.full}</p>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="inline-flex h-11 items-center justify-center rounded border border-grey-300 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-steel hover:text-steel"
      >
        Load map
      </button>
    </div>
  );
}
