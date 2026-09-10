"use client";

/**
 * components/media/MapFacade.tsx — click-to-load Google Maps embed. Shows a glass
 * preview with a MapPin icon and the address until the visitor taps the button, so
 * the heavy Maps iframe never loads (or blocks anything) unless requested.
 */
import { useState } from "react";
import { site } from "@/config/site";
import { MapPin } from "@/components/ui/Icons";

export default function MapFacade() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="glass aspect-[4/3] w-full overflow-hidden p-0 sm:aspect-video">
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
    <div className="glass flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 p-6 text-center sm:aspect-video">
      <span className="glass-pill flex h-11 w-11 items-center justify-center p-0 text-teal">
        <MapPin width={20} height={20} />
      </span>
      <p className="max-w-sm text-sm text-grey-600">{site.address.full}</p>
      <button type="button" onClick={() => setLoaded(true)} className="glass-pill h-11 px-5 text-sm font-semibold text-ink">
        Load map
      </button>
    </div>
  );
}
