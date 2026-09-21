/**
 * components/sections/WorldReach.tsx — the "Where we work" section.
 *
 * Replaces two stock-looking photo cards with the actual claim, drawn: a world
 * map with India picked out, a marker on every export market, and routes
 * fanning out from the Kolkata works.
 *
 * The map is `public/world-map.svg`, generated at build time by
 * scripts/generate-world-map.mjs from real Natural Earth geometry — the markers
 * are true country centroids taken from the same dataset as the country list,
 * so they cannot drift from the countries the site actually sells to.
 *
 * It is referenced as an image rather than inlined: the land geometry is ~26 KB,
 * which would roughly double the home page's HTML and break its budget, whereas
 * as its own file it is fetched once and cached immutably. Its animation lives
 * inside the SVG (CSS animations do run in an img-loaded SVG), so the whole
 * thing costs no JavaScript at all.
 *
 * The `<picture>` is not decoration. `prefers-reduced-motion` does NOT reach
 * inside an img-loaded SVG — measured: with the preference set, the animated
 * file still drew its routes over several seconds, exactly as with it unset,
 * because the image renders in its own context and never sees the page's
 * evaluation of that query. The `media` attribute on `<source>` IS evaluated by
 * the page, so a visitor who asked for less motion is simply served the still
 * version, and the animated one is never even fetched.
 */
import Chips from "@/components/ui/Chips";
import { paths } from "@/lib/urls";
import type { Country, State } from "@/data/types";

export default function WorldReach({
  states,
  countries,
}: {
  states: State[];
  countries: Country[];
}) {
  return (
    <div>
      <figure className="m-0">
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet="/world-map-still.svg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/world-map.svg"
            width={1000}
            height={439}
            alt="World map: RA Machine ships from its Kolkata works to 30 export markets across North and South America, Europe, the Middle East, Africa, Asia and Oceania."
            loading="lazy"
            decoding="async"
            className="w-full"
          />
        </picture>
        <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/70">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-white" />
            Kolkata works
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-[#7ff0e2]" />
            Export market
          </span>
        </figcaption>
      </figure>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-display text-lg text-white">India</h3>
          <p className="mt-2 text-sm text-white/75">
            Delivered, installed and serviced across every major industrial state.
          </p>
          <div className="mt-5">
            <Chips items={states.map((state) => ({ label: state.name, href: paths.state(state.slug) }))} />
          </div>
        </div>
        <div>
          <h3 className="font-display text-lg text-white">World</h3>
          <p className="mt-2 text-sm text-white/75">
            Exported to more than 25 countries across five continents.
          </p>
          <div className="mt-5">
            <Chips items={countries.map((country) => ({ label: country.name, href: paths.country(country.slug) }))} />
          </div>
        </div>
      </div>
    </div>
  );
}
