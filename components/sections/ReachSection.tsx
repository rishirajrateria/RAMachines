/**
 * components/sections/ReachSection.tsx — "India + World reach" module (SPEC §4.7):
 * short text plus link lists of the top states served and top export countries.
 */
import Link from "next/link";
import { topStates, topCountries } from "@/data";
import type { State, Country } from "@/data/types";
import { paths } from "@/lib/urls";

export default function ReachSection() {
  const states = topStates(8);
  const countries = topCountries(10);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <h3 className="font-display text-lg text-ink">Leading across India</h3>
        <p className="mt-2 text-sm text-grey-600">
          Machines installed and serviced across every major industrial belt, with
          engineers dispatched from our Kolkata headquarters.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-2">
          {states.map((state: State) => (
            <li key={state.slug}>
              <Link href={paths.state(state.slug)} className="text-sm text-grey-700 hover:text-steel">
                {state.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-display text-lg text-ink">Exporting worldwide</h3>
        <p className="mt-2 text-sm text-grey-600">
          CE-marked machines shipped and installed across established and emerging
          manufacturing markets, with remote support and training.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-2">
          {countries.map((country: Country) => (
            <li key={country.slug}>
              <Link href={paths.country(country.slug)} className="text-sm text-grey-700 hover:text-steel">
                {country.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
