/**
 * components/sections/ReachSection.tsx — "India + World reach" module (SPEC §4.7).
 * ADR-0002: two illustrated cards (India map, world/export map) each followed by a row
 * of link chips (top states served / top export countries served).
 */
import { topStates, topCountries } from "@/data";
import type { State, Country } from "@/data/types";
import { paths } from "@/lib/urls";
import IllustrationCard from "@/components/ui/IllustrationCard";
import Chips from "@/components/ui/Chips";

export default function ReachSection() {
  const states = topStates(8);
  const countries = topCountries(10);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <IllustrationCard
          image={{
            src: "/about/india-reach.webp",
            alt: "Stylised map of India marking RA Machine's pan-India installation and service reach",
            width: 1200,
            height: 750,
          }}
          title="Leading across India"
          text="Machines installed and serviced across every major industrial belt, with engineers dispatched from our Kolkata headquarters."
          href={paths.state(states[0]?.slug ?? "west-bengal")}
        />
        <div className="mt-4">
          <Chips
            items={states.map((state: State) => ({
              label: state.name,
              href: paths.state(state.slug),
              icon: "MapPin",
            }))}
          />
        </div>
      </div>
      <div>
        <IllustrationCard
          image={{
            src: "/about/world-reach.webp",
            alt: "Stylised globe with shipping routes marking RA Machine's export destinations",
            width: 1200,
            height: 750,
          }}
          title="Exporting worldwide"
          text="CE-marked machines shipped and installed across established and emerging manufacturing markets, with remote support and training."
          href={paths.exportHub}
        />
        <div className="mt-4">
          <Chips
            items={countries.map((country: Country) => ({
              label: country.name,
              href: paths.country(country.slug),
              icon: "Flag",
            }))}
          />
        </div>
      </div>
    </div>
  );
}
