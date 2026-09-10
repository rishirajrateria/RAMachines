/**
 * components/ui/Icons.tsx — the site's entire icon set as inline SVG (no icon library
 * bundle). 24px, stroke 1.75, round caps (ADR-0002). Every icon is built by `icon()`
 * from its raw path/shape markup — one line per icon instead of a repeated <svg> JSX
 * wrapper — but each is still a real, independently importable component, so every
 * pre-refresh named export (Phone, WhatsApp, Mail, ArrowRight, ArrowUpRight, Check,
 * Menu, Close, Download, MapPin, Clock, Shield, Play) keeps its name and call signature.
 *
 * `IconName` + `<Icon name size className />` let data-driven components (FeatureGrid,
 * GlancePanel, ProcessSteps, Chips…) reference an icon by string without importing each
 * one individually.
 */
import type { JSX, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

// ADR-0005 §5: 1.5px stroke, teal, sits inside a 44px .glass-pill circle when used as a tile.
const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Builds one icon component from its inner SVG markup (trusted, hand-authored — never
 * user input). `overrides` lets the two solid icons (Play, Star, Quote) flip to a filled
 * style instead of the default stroked one. */
function icon(inner: string, overrides: Partial<IconProps> = {}) {
  return function IconComponent(props: IconProps) {
    return <svg {...base} {...overrides} {...props} dangerouslySetInnerHTML={{ __html: inner }} />;
  };
}

export const Phone = icon(
  `<path d="M4.5 4.5c0-1 .8-1.8 1.8-1.8h2.2c.8 0 1.5.5 1.7 1.3l.9 3a1.8 1.8 0 0 1-.5 1.8l-1.5 1.4a13.5 13.5 0 0 0 5.7 5.7l1.4-1.5a1.8 1.8 0 0 1 1.8-.5l3 .9c.8.2 1.3.9 1.3 1.7v2.2c0 1-.8 1.8-1.8 1.8h-1C10.7 20.5 3.5 13.3 3.5 4.5v-1Z"/>`,
);
export const WhatsApp = icon(
  `<path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.9L3.5 20.5l4.2-1.1A8.5 8.5 0 1 0 12 3.5Z"/><path d="M8.3 8.4c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .5.3.2.4.6 1.4.6 1.5.1.1.1.3 0 .4-.1.2-.2.3-.3.4l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.2 1.6 1.9 1.1 1 2 1.2 2.3 1.4.3.1.5.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.4.7c.2.1.4.2.4.4 0 .2 0 1-.4 1.4-.4.4-1.2.8-2 .8-.6 0-2-.2-3.6-1.6-1.9-1.7-3.1-3.7-3.2-3.9-.1-.2-.9-1.3-.9-2.4 0-1.2.6-1.7.8-2Z"/>`,
);
export const Mail = icon(`<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4.5 6.5 7.5 6 7.5-6"/>`);
export const ArrowRight = icon(`<path d="M4.5 12h15"/><path d="M13.5 6.5 19 12l-5.5 5.5"/>`);
export const ArrowUpRight = icon(`<path d="M7 17 17 7"/><path d="M9 7h8v8"/>`);
export const Check = icon(`<path d="m4.5 12.5 5 5 10-11"/>`);
export const Menu = icon(`<path d="M3.5 6.5h17"/><path d="M3.5 12h17"/><path d="M3.5 17.5h17"/>`);
export const Close = icon(`<path d="m5 5 14 14"/><path d="m19 5-14 14"/>`);
export const Download = icon(`<path d="M12 3.5v12"/><path d="m6.5 10.5 5.5 5.5 5.5-5.5"/><path d="M4.5 19.5h15"/>`);
export const MapPin = icon(`<path d="M12 21s7-6.7 7-12a7 7 0 1 0-14 0c0 5.3 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/>`);
export const Clock = icon(`<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`);
export const Shield = icon(`<path d="M12 3.5 5 6v6c0 4.7 3 7.9 7 8.5 4-.6 7-3.8 7-8.5V6l-7-2.5Z"/><path d="m9 12 2 2 4-4"/>`);
export const Play = icon(`<path d="M8 5.5v13l11-6.5-11-6.5Z"/>`, { fill: "currentColor", stroke: "none" });

/* --------------------------- ADR-0002 additions --------------------------- */

export const Laser = icon(
  `<rect x="9.5" y="2.5" width="5" height="7" rx="1.5"/><path d="M12 9.5v3.5"/><path d="m8 21 4-8 4 8"/><path d="M6 21h12"/>`,
);
export const Beam = icon(`<path d="M12 3v6"/><path d="m9 9 3 8 3-8"/><path d="M4 20h16"/><path d="M10.5 20 12 17l1.5 3"/>`);
export const Sheet = icon(
  `<rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="M7 9.5h4v4H7z"/><path d="M14 9.5h3"/><path d="M14 13.5h3"/>`,
);
export const Tube = icon(`<ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v9a7 2.6 0 0 0 14 0V6"/><path d="M12 8.6v9"/>`);
export const Robot = icon(
  `<rect x="6" y="9" width="12" height="9" rx="2"/><path d="M12 5.5v3.5"/><circle cx="12" cy="4" r="1.3"/><path d="M9.5 13h.01"/><path d="M14.5 13h.01"/><path d="M9 18v2.5"/><path d="M15 18v2.5"/>`,
);
export const Weld = icon(`<path d="M4 15.5 10 9.5"/><path d="m14 5.5 4.5 4.5-8 8L6 21l1-4.5Z"/><path d="m16 3.5 4.5 4.5"/>`);
export const Wrench = icon(`<path d="M14.7 6.3a4 4 0 0 0-5.4 5l-6 6a1.9 1.9 0 0 0 2.7 2.7l6-6a4 4 0 0 0 5-5.4l-2.6 2.6-2.7-.6-.6-2.7Z"/>`);
export const Gear = icon(
  `<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M17.8 6.2l-1.5 1.5M7.7 16.3l-1.5 1.5M17.8 17.8l-1.5-1.5M7.7 7.7 6.2 6.2"/>`,
);
export const Gauge = icon(`<path d="M4 15.5a8 8 0 1 1 16 0"/><path d="M12 15.5 15.5 10"/><path d="M4 15.5h16"/>`);
export const Bolt = icon(`<path d="M12.5 2.5 5 14h5.5L11 21.5 19 10h-5.5l-1-7.5Z"/>`);
export const Factory = icon(`<path d="M3.5 20.5v-8l5 3.2v-3.2l5 3.2V8.5l6-3.5v15.5Z"/><path d="M3.5 20.5h16"/><path d="M8 5v2"/>`);
export const Truck = icon(
  `<rect x="2.5" y="8" width="11" height="8" rx="1"/><path d="M13.5 11h4l3 3v2h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/>`,
);
export const Ship = icon(`<path d="M4 15.5 5.5 21h13L20 15.5"/><path d="M6.5 15.5V6h5l3 4"/><path d="M4 15.5h16"/><path d="M11.5 3v3"/>`);
export const Plane = icon(`<path d="M3.5 13.5 21 7l-2.3 6.5L21 20l-6.3-2.3L11 21l-1-5-5-1 2-3Z"/>`);
export const Globe = icon(
  `<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5a13 13 0 0 1 0 17"/><path d="M12 3.5a13 13 0 0 0 0 17"/>`,
);
export const Flag = icon(`<path d="M5.5 3v18"/><path d="M5.5 4.5h12l-3 4 3 4h-12"/>`);
export const Award = icon(`<circle cx="12" cy="9" r="5"/><path d="m8.5 13 -1.5 8 5-2.6L16 21l-1.5-8"/>`);
export const Badge = icon(
  `<path d="M12 2.5 14 6l4 .6-2.9 2.8.7 4-3.8-2-3.8 2 .7-4L6 6.6 10 6Z"/><path d="M9 14.5v7l3-1.8 3 1.8v-7"/>`,
);
export const Certificate = icon(
  `<rect x="3" y="3.5" width="18" height="12.5" rx="1.5"/><path d="M6.5 7.5h11M6.5 10.5h7"/><circle cx="9" cy="19" r="1.8"/><path d="m9 20.8-1 2.2 2-1 2 1-1-2.2"/>`,
);
export const GraduationCap = icon(
  `<path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z"/><path d="M6.5 11.7v4.3c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4.3"/><path d="M21 9.5v5.5"/>`,
);
export const Users = icon(
  `<circle cx="9" cy="8.5" r="3"/><path d="M3 20v-1.2a5 5 0 0 1 5-4.8h2a5 5 0 0 1 5 4.8V20"/><path d="M16 4.8a3 3 0 0 1 0 5.9"/><path d="M19 14.2a4.4 4.4 0 0 1 2.5 4v1.8"/>`,
);
export const Headset = icon(
  `<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="5.5" rx="1.3"/><rect x="17" y="13" width="4" height="5.5" rx="1.3"/><path d="M19 18.5v.7a2.3 2.3 0 0 1-2.3 2.3H13"/>`,
);
export const Calendar = icon(`<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17"/><path d="M8 3v3.5M16 3v3.5"/>`);
export const Package = icon(`<path d="M12 3 20.5 7.5v9L12 21l-8.5-4.5v-9Z"/><path d="M3.5 7.5 12 12l8.5-4.5"/><path d="M12 12v9"/>`);
export const Ruler = icon(
  `<rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(-8 12 12)"/><path d="m7 9 .7 2.2M11 8.3l.7 2.2M15 7.7l.7 2.2"/>`,
);
export const Layers = icon(
  `<path d="m12 3 8.5 4.5L12 12 3.5 7.5Z"/><path d="m3.5 12 8.5 4.5 8.5-4.5"/><path d="m3.5 16.5 8.5 4.5 8.5-4.5"/>`,
);
export const Sparkles = icon(
  `<path d="M12 3.5 13.3 8l4.5 1.3-4.5 1.3L12 15l-1.3-4.5L6.2 9.3l4.5-1.3Z"/><path d="M18.5 15.5 19.3 18l2.5.8-2.5.8-.8 2.4-.8-2.4-2.5-.8 2.5-.8Z"/>`,
);
export const Star = icon(`<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 17l-5.2 2.8 1-5.9-4.3-4.2 5.9-.8Z"/>`, {
  fill: "currentColor",
  stroke: "none",
});
export const Quote = icon(
  `<path d="M4.5 8.5c0-2.8 1.9-4.6 4.6-5l.6 1.7c-1.6.5-2.4 1.5-2.5 2.8h2.3v4.5H4.5Zm9 0c0-2.8 1.9-4.6 4.6-5l.6 1.7c-1.6.5-2.4 1.5-2.5 2.8h2.3v4.5h-5Z"/>`,
  { fill: "currentColor", stroke: "none" },
);
export const Building = icon(
  `<rect x="5" y="3.5" width="10" height="17" rx="1"/><rect x="15" y="9.5" width="5" height="11" rx="1"/><path d="M8 7h1M11 7h1M8 10.5h1M11 10.5h1M8 14h1M11 14h1"/>`,
);
export const Power = icon(`<path d="M12 3.5v7"/><path d="M7 6.3a8 8 0 1 0 10 0"/>`);
export const Currency = icon(
  `<circle cx="12" cy="12" r="8.5"/><path d="M9.5 8h3.2a2.3 2.3 0 0 1 0 4.6H9.5"/><path d="M9.5 12.6h3.2a2.3 2.3 0 0 1 0 4.6H9.5"/><path d="M9.5 8v9.2"/>`,
);

/* --------------------------- name → component map -------------------------- */

const registry = {
  Laser,
  Beam,
  Sheet,
  Tube,
  Robot,
  Weld,
  Wrench,
  Gear,
  Gauge,
  Bolt,
  Factory,
  Truck,
  Ship,
  Plane,
  MapPin,
  Globe,
  Flag,
  Shield,
  Award,
  Badge,
  Certificate,
  GraduationCap,
  Users,
  Headset,
  Clock,
  Calendar,
  Package,
  Ruler,
  Layers,
  Sparkles,
  Check,
  ArrowRight,
  ArrowUpRight,
  Phone,
  WhatsApp,
  Mail,
  Menu,
  Close,
  Download,
  Play,
  Star,
  Quote,
  Building,
  Power,
  Currency,
} satisfies Record<string, (props: IconProps) => JSX.Element>;

export type IconName = keyof typeof registry;

/**
 * <Icon name="Gauge" /> — looks an icon up by name, for components that receive their
 * icon as data (FeatureGrid items, GlancePanel facts, ProcessSteps, Chips…) rather than
 * as an imported component reference.
 */
export function Icon({
  name,
  size = 24,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Cmp = registry[name];
  return <Cmp width={size} height={size} className={className} />;
}
