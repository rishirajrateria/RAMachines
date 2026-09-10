/**
 * components/layout/Footer.tsx — address, contact, quick links (including the
 * job-work link, which per SPEC §3 appears in the footer only, never in the nav),
 * product categories, top cities, top countries, certification strip and legal links.
 * ADR-0002: a tinted top band, an icon beside each column header, and the
 * certifications shown as small badge images rather than a text list.
 */
import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import { categories, certifications, topCities, topCountries } from "@/data";
import type { City, Country } from "@/data/types";
import { Phone, Mail, Clock, MapPin, Icon, type IconName } from "@/components/ui/Icons";

const quickLinks = [
  { name: "Products", href: paths.products },
  { name: "Machine Repair", href: paths.repair },
  { name: "Operator Training", href: paths.training },
  { name: "Export Enquiry", href: paths.exportHub },
  { name: "Job Work on Our Machines", href: paths.jobWork },
  { name: "About", href: paths.about },
  { name: "Contact", href: paths.contact },
];

function ColumnHeading({ icon, children }: { icon: IconName; children: string }) {
  return (
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-steel">
      <Icon name={icon} size={16} />
      {children}
    </p>
  );
}

export default function Footer() {
  const cities = topCities(12);
  const countries = topCountries(10);

  return (
    <footer className="band-soft border-t border-grey-200">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg text-ink">{site.name}</p>
          <p className="mt-1 text-xs text-grey-600">an RA Group company</p>
          <address className="mt-4 flex gap-2 text-sm not-italic text-grey-600">
            <MapPin width={16} height={16} className="mt-0.5 shrink-0 text-steel" />
            {site.address.full}
          </address>
          <a href={site.phoneHref} className="mt-3 flex items-center gap-2 text-sm text-grey-600 hover:text-steel">
            <Phone width={16} height={16} className="text-steel" /> {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="mt-2 flex items-center gap-2 text-sm text-grey-600 hover:text-steel">
            <Mail width={16} height={16} className="text-steel" /> {site.email}
          </a>
          <p className="mt-2 flex items-center gap-2 text-sm text-grey-600">
            <Clock width={16} height={16} className="text-steel" /> {site.hours}
          </p>
        </div>

        <div>
          <ColumnHeading icon="Bolt">Quick links</ColumnHeading>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-grey-600 hover:text-steel">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <ColumnHeading icon="Layers">Machines</ColumnHeading>
          </div>
          <ul className="mt-3 space-y-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={paths.category(category.slug)} className="text-sm text-grey-600 hover:text-steel">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColumnHeading icon="MapPin">Across India</ColumnHeading>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {cities.map((city: City) => (
              <li key={city.slug}>
                <Link href={paths.city(city.stateSlug, city.slug)} className="text-sm text-grey-600 hover:text-steel">
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColumnHeading icon="Globe">Exporting to</ColumnHeading>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {countries.map((country: Country) => (
              <li key={country.slug}>
                <Link href={paths.country(country.slug)} className="text-sm text-grey-600 hover:text-steel">
                  {country.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-grey-200 bg-white/60">
        <div className="container-site py-8">
          <ColumnHeading icon="Award">Licences &amp; certifications</ColumnHeading>
          <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
            {certifications.map((cert) => (
              <li key={cert.slug}>
                <Link
                  href={paths.certifications}
                  className="flex items-center gap-2 text-xs font-semibold text-grey-600 hover:text-steel"
                >
                  <Image
                    src={cert.image.src}
                    alt={cert.image.alt}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-md object-cover"
                  />
                  {cert.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-grey-200">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-grey-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              &copy; {new Date().getFullYear()} {site.legalName}. Made in India.
            </span>
            <a href={site.url} className="hover:text-steel">
              {site.parent}
            </a>
            <a href={site.raAuto.url} target="_blank" rel="noopener noreferrer" className="hover:text-steel">
              {site.raAuto.name} ↗
            </a>
          </div>
          <div className="flex gap-4">
            <Link href={paths.privacy} className="hover:text-steel">
              Privacy Policy
            </Link>
            <Link href={paths.terms} className="hover:text-steel">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
