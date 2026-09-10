/**
 * components/layout/navLinks.ts — the primary nav link list shared by Header (desktop)
 * and MobileNav (mobile, where each link also gets an icon per ADR-0002).
 */
import { paths } from "@/lib/urls";
import type { IconName } from "@/components/ui/Icons";

export const navLinks: { name: string; href: string; icon: IconName }[] = [
  { name: "Products", href: paths.products, icon: "Layers" },
  { name: "Repair", href: paths.repair, icon: "Wrench" },
  { name: "Training", href: paths.training, icon: "GraduationCap" },
  { name: "Export", href: paths.exportHub, icon: "Globe" },
  { name: "About", href: paths.about, icon: "Building" },
  { name: "Contact", href: paths.contact, icon: "Headset" },
];
