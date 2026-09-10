/**
 * lib/photos.ts — ADR-0007 §3: typed map of every placeholder photo under
 * `/public/photos`, keyed by filename (without extension). `scripts/generate-photos.mjs`
 * writes the binaries this map points at (1920×1080 for `hero-*`, 1600×1200 for
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
  | "hero-tube"
  | "hero-co2"
  | "hero-welding"
  | "hero-product"
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
  | "slot-tube-cutting"
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
  "hero-home": img("hero-home", "Wide industrial photograph of the RA Machine factory floor in soft teal-tinted light", HERO),
  "hero-products": img("hero-products", "Photograph of the RA Machine product range on the factory floor, graphite and teal light", HERO),
  "hero-fiber": img("hero-fiber", "Photograph of a fiber laser cutting machine gantry under industrial light", HERO),
  "hero-tube": img("hero-tube", "Photograph of a tube laser cutting machine with round stock loaded, workshop light", HERO),
  "hero-co2": img("hero-co2", "Photograph of a CO2 laser cutting and engraving machine cabinet, soft studio light", HERO),
  "hero-welding": img("hero-welding", "Photograph of a robotic welding cell mid-weld with bright arc sparks", HERO),
  "hero-product": img("hero-product", "Photograph of a single RA Machine product on the shop floor, backlit", HERO),
  "hero-repair": img("hero-repair", "Photograph of a service engineer working on a machine control panel", HERO),
  "hero-training": img("hero-training", "Photograph of an operator training session beside a laser cutting machine", HERO),
  "hero-jobwork": img("hero-jobwork", "Photograph of contract job-work fabrication in progress on the shop floor", HERO),
  "hero-about": img("hero-about", "Photograph of the RA Machine manufacturing hall, wide interior view", HERO),
  "hero-contact": img("hero-contact", "Photograph of the RA Machine front office and reception desk", HERO),
  "hero-certifications": img("hero-certifications", "Photograph of certification plaques and quality badges in soft light", HERO),
  "hero-india": img("hero-india", "Photograph evoking RA Machine's pan-India delivery network, map light forms", HERO),
  "hero-state": img("hero-state", "Photograph evoking a regional industrial estate served by RA Machine", HERO),
  "hero-city": img("hero-city", "Photograph evoking a city skyline near an RA Machine service hub", HERO),
  "hero-export": img("hero-export", "Photograph of a shipping port with cranes and containers, export light", HERO),
  "hero-country": img("hero-country", "Photograph evoking RA Machine's export reach, globe light forms", HERO),
  "slot-factory": img("slot-factory", "Photograph of the RA Machine factory floor with machines in a row", SLOT),
  "slot-assembly": img("slot-assembly", "Photograph of technicians assembling a machine on the shop floor", SLOT),
  "slot-cutting-head": img("slot-cutting-head", "Close-up photograph of a laser cutting head and nozzle", SLOT),
  "slot-sparks": img("slot-sparks", "Photograph of bright sparks flying during metal cutting", SLOT),
  "slot-tube-cutting": img("slot-tube-cutting", "Photograph of round tube stock being loaded into a tube laser machine", SLOT),
  "slot-robot-weld": img("slot-robot-weld", "Photograph of a robotic welding arm at work on a fixture", SLOT),
  "slot-control-panel": img("slot-control-panel", "Photograph of a machine control panel and touchscreen interface", SLOT),
  "slot-engineer-service": img("slot-engineer-service", "Photograph of a service engineer servicing a machine on-site", SLOT),
  "slot-training-room": img("slot-training-room", "Photograph of a training room with an operator at a control desk", SLOT),
  "slot-crate-shipping": img("slot-crate-shipping", "Photograph of a machine crated and palletised for shipping", SLOT),
  "slot-port": img("slot-port", "Photograph of a container port with cranes at dusk", SLOT),
  "slot-team": img("slot-team", "Photograph of the RA Machine team on the factory floor", SLOT),
  "slot-office": img("slot-office", "Photograph of the RA Machine office workspace", SLOT),
  "slot-installation": img("slot-installation", "Photograph of a machine being installed and leveled on-site", SLOT),
  "slot-quality-check": img("slot-quality-check", "Photograph of a quality inspector checking a cut part with calipers", SLOT),
  "slot-warehouse-spares": img("slot-warehouse-spares", "Photograph of a warehouse spares rack stocked with machine parts", SLOT),
};
