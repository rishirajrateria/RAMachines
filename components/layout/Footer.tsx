/**
 * components/layout/Footer.tsx — address, contact, quick links (including the
 * job-work link, which per SPEC §3 appears in the footer only, never in the nav),
 * product categories, top cities, top countries, certification strip and legal links.
 */
import Link from "next/link";
import { site } from "@/config/site";
import { paths } from "@/lib/urls";
import { categories, certifications, topCities, topCountries } from "@/data";
import type { City, Country } from "@/data/types";
import { Phone, Mail, Clock, MapPin } from "@/components/ui/Icons";

const quickLinks = [
  { name: "Products", href: paths.products },
  { name: "Machine Repair", href: paths.repair },
  { name: "Operator Training", href: paths.training },
  { name: "Export Enquiry", href: paths.exportHub },
  { name: "Job Work on Our Machines", href: paths.jobWork },
  { name: "About", href: paths.about },
  { name: "Contact", href: paths.contact },
];

export default function Footer() {
  const cities = topCities(12);
  const countries = topCountries(10);

  return (
    <footer className="border-t border-grey-200 bg-grey-50">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg text-ink">{site.name}</p>
          <p className="mt-1 text-xs text-grey-500">an RA Group company</p>
          <address className="mt-4 flex gap-2 text-sm not-italic text-grey-600">
            <MapPin width={16} height={16} className="mt-0.5 shrink-0 text-grey-400" />
            {site.address.full}
          </address>
          <a href={site.phoneHref} className="mt-3 flex items-center gap-2 text-sm text-grey-600 hover:text-steel">
            <Phone width={16} height={16} className="text-grey-400" /> {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="mt-2 flex items-center gap-2 text-sm text-grey-600 hover:text-steel">
            <Mail width={16} height={16} className="text-grey-400" /> {site.email}
          </a>
          <p className="mt-2 flex items-center gap-2 text-sm text-grey-600">
            <Clock width={16} height={16} className="text-grey-400" /> {site.hours}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">Quick links</p>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-grey-600 hover:text-steel">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">Machines</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">Across India</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">Exporting to</p>
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

      <div className="border-t border-grey-200">
        <div className="container-site py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-grey-500">
            Licences &amp; certifications
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {certifications.map((cert) => (
              <li key={cert.slug}>
                <Link href={paths.certifications} className="text-xs text-grey-600 hover:text-steel">
                  {cert.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-grey-200">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-grey-500 sm:flex-row sm:items-center sm:justify-between">
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
