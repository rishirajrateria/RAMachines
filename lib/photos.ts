/**
 * lib/photos.ts — ADR-0007 §3: typed map of every placeholder photo under
 * `/public/photos`, keyed by filename (without extension). `scripts/generate-photos.mjs`
 * writes the binaries this map points at (illustrations until real photos arrive — alt
 * text says "Illustration of"; change it to describe the photo when one is dropped in) (1920×1080 for `hero-*`, 1600×1200 for
 * `slot-*`, WebP q78). A real photo later drops in at the same path/filename — this
 * map, `PageHero`, `ImageSlot` and `ImageBand` never need to change, only the
 * generator stops being run for that one key (pass `placeholder={false}` where the
 * page worker renders it, so the "Photo: …" label pill disappears too).
 */
import type { Img } from "@/data/types";

export type PhotoKey =
  | "hero-home"
  | "hero-products"
  | "hero-fiber"
  | "hero-welding"
  | "hero-plasma"
  | "hero-arc-welding"
  | "hero-saw"
  | "hero-repair"
  | "hero-training"
  | "hero-jobwork"
  | "hero-about"
  | "hero-contact"
  | "hero-certifications"
  | "hero-india"
  | "hero-state"
  | "hero-city"
  | "hero-export"
  | "hero-country"
  | "slot-factory"
  | "slot-assembly"
  | "slot-cutting-head"
  | "slot-sparks"
  | "slot-robot-weld"
  | "slot-control-panel"
  | "slot-engineer-service"
  | "slot-training-room"
  | "slot-crate-shipping"
  | "slot-port"
  | "slot-team"
  | "slot-office"
  | "slot-installation"
  | "slot-quality-check"
  | "slot-warehouse-spares";

const HERO = { width: 1920, height: 1080 } as const;
const SLOT = { width: 1600, height: 1200 } as const;

function img(key: PhotoKey, alt: string, size: { width: number; height: number }): Img {
  return { src: `/photos/${key}.webp`, alt, width: size.width, height: size.height };
}

export const photos: Record<PhotoKey, Img> = {
  "hero-home": img("hero-home", "Wide illustration of the RA Machine factory floor in soft teal-tinted light", HERO),
  "hero-products": img("hero-products", "Illustration of the RA Machine product range on the factory floor, graphite and teal light", HERO),
  "hero-fiber": img("hero-fiber", "Illustration of a fiber laser cutting machine gantry under industrial light", HERO),
  "hero-welding": img("hero-welding", "Illustration of a robotic welding cell mid-weld with bright arc sparks", HERO),
  "hero-plasma": img("hero-plasma", "Illustration of a CNC plasma cutting table with the torch cutting steel plate", HERO),
  "hero-arc-welding": img("hero-arc-welding", "Illustration of a MIG welding set on a trolley with the torch welding a workpiece", HERO),
  "hero-saw": img("hero-saw", "Illustration of a submerged arc welding tractor running along a plate seam", HERO),
  "hero-repair": img("hero-repair", "Illustration of a service engineer working on a machine control panel", HERO),
  "hero-training": img("hero-training", "Illustration of an operator training session beside a laser cutting machine", HERO),
  "hero-jobwork": img("hero-jobwork", "Illustration of contract job-work fabrication in progress on the shop floor", HERO),
  "hero-about": img("hero-about", "Illustration of the RA Machine manufacturing hall, wide interior view", HERO),
  "hero-contact": img("hero-contact", "Illustration of the RA Machine front office and reception desk", HERO),
  "hero-certifications": img("hero-certifications", "Illustration of certification plaques and quality badges in soft light", HERO),
  "hero-india": img("hero-india", "Illustration evoking RA Machine's pan-India delivery network, map light forms", HERO),
  "hero-state": img("hero-state", "Illustration evoking a regional industrial estate served by RA Machine", HERO),
  "hero-city": img("hero-city", "Illustration evoking a city skyline near an RA Machine service hub", HERO),
  "hero-export": img("hero-export", "Illustration of a shipping port with cranes and containers, export light", HERO),
  "hero-country": img("hero-country", "Illustration evoking RA Machine's export reach, globe light forms", HERO),
  "slot-factory": img("slot-factory", "Illustration of the RA Machine factory floor with machines in a row", SLOT),
  "slot-assembly": img("slot-assembly", "Illustration of technicians assembling a machine on the shop floor", SLOT),
  "slot-cutting-head": img("slot-cutting-head", "Close-up illustration of a laser cutting head and nozzle", SLOT),
  "slot-sparks": img("slot-sparks", "Illustration of bright sparks flying during metal cutting", SLOT),
  "slot-robot-weld": img("slot-robot-weld", "Illustration of a robotic welding arm at work on a fixture", SLOT),
  "slot-control-panel": img("slot-control-panel", "Illustration of a machine control panel and touchscreen interface", SLOT),
  "slot-engineer-service": img("slot-engineer-service", "Illustration of a service engineer servicing a machine on-site", SLOT),
  "slot-training-room": img("slot-training-room", "Illustration of a training room with an operator at a control desk", SLOT),
  "slot-crate-shipping": img("slot-crate-shipping", "Illustration of a machine crated and palletised for shipping", SLOT),
  "slot-port": img("slot-port", "Illustration of a container port with cranes at dusk", SLOT),
  "slot-team": img("slot-team", "Illustration of the RA Machine team on the factory floor", SLOT),
  "slot-office": img("slot-office", "Illustration of the RA Machine office workspace", SLOT),
  "slot-installation": img("slot-installation", "Illustration of a machine being installed and leveled on-site", SLOT),
  "slot-quality-check": img("slot-quality-check", "Illustration of a quality inspector checking a cut part with calipers", SLOT),
  "slot-warehouse-spares": img("slot-warehouse-spares", "Illustration of a warehouse spares rack stocked with machine parts", SLOT),
};
