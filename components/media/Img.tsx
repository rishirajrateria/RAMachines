/**
 * components/media/Img.tsx — ADR-0009 §1: a Server Component `<picture>` with
 * AVIF + WebP `srcset` (from the build-time `lib/image-manifest.json`,
 * scripts/optimize-images.mjs), a correct `sizes`, intrinsic width/height (CLS 0)
 * and the 20px LQIP as a blurred inline background that fades out on load.
 *
 * The `<source>`/`<img>` markup is assembled as a raw HTML string and attached
 * via `dangerouslySetInnerHTML` so the fade-out can be a literal, browser-parsed
 * `onload="…"` HTML attribute rather than a React `onLoad` handler — a handler
 * needs a JS function reference, which would force this component (and every
 * page that renders it) into a client bundle. A plain attribute string needs no
 * client JS at all: the browser runs it directly, no React state, no hydration.
 *
 * `priority` sets `fetchpriority="high"` + `loading="eager"` + `decoding="sync"`
 * for the LCP image (PageHero, the product gallery's main shot); everything else
 * gets `loading="lazy"` + `decoding="async"`.
 *
 * `fill` renders an absolutely positioned, `object-cover` image for a pre-sized
 * `position:relative` parent (PageHero, ImageBand). Otherwise the image carries
 * its own width/height attributes and `className` controls sizing/object-fit
 * (ImageSlot, Gallery, ProductCard, CategoryCard, CertCard, IllustrationCard).
 * The `<picture>` element itself is `display: contents` so it never becomes part
 * of the box/containing-block chain — every existing Tailwind sizing class
 * (`h-full`, `w-full`, `object-contain`, …) keeps working exactly as it did when
 * these components rendered a plain `<img>`/`next/image` directly.
 *
 * Falls back to the original source path (no srcset) when `image.src` isn't in
 * the manifest — e.g. a path outside the five optimised directories.
 */
import imageManifest from "@/lib/image-manifest.json";

type Variant = { w: number; src: string };
type ManifestEntry = { width: number; height: number; lqip: string; variants: { avif: Variant[]; webp: Variant[] } };
type Manifest = Record<string, ManifestEntry>;

const manifest = imageManifest as Manifest;

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toSrcSet(variants: Variant[]): string {
  return variants.map((v) => `${v.src} ${v.w}w`).join(", ");
}

export default function Img({
  image,
  sizes,
  fill = false,
  priority = false,
  className = "",
}: {
  /** `width`/`height` are optional only because `fill` (PageHero/ImageBand) ignores them. */
  image: { src: string; alt: string; width?: number; height?: number };
  /** Required — ADR-0009 §1: hero `100vw`; tile `(min-width:1024px) 33vw, 100vw`; slot `(min-width:768px) 50vw, 100vw`. */
  sizes: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const entry = manifest[image.src];
  const avifSrcSet = entry ? toSrcSet(entry.variants.avif) : "";
  const webpSrcSet = entry ? toSrcSet(entry.variants.webp) : "";
  const fallbackSrc = entry?.variants.webp.at(-1)?.src ?? image.src;
  const lqip = entry?.lqip;

  const sizingClass = fill ? `absolute inset-0 h-full w-full object-cover ${className}`.trim() : className;
  const dimAttrs = fill || image.width == null || image.height == null ? "" : ` width="${image.width}" height="${image.height}"`;
  const loadingAttrs = priority
    ? `fetchpriority="high" loading="eager" decoding="sync"`
    : `loading="lazy" decoding="async"`;
  const bgStyle = lqip ? ` style="background-image:url('${lqip}');background-size:cover;background-position:center"` : "";
  // Literal browser-parsed attribute (see file header) — fades the LQIP background
  // out once the real image has painted. No-op (never set) when there's no LQIP.
  const onload = lqip ? ` onload="this.style.backgroundImage='none'"` : "";

  const sourceTags = [
    avifSrcSet && `<source type="image/avif" srcset="${avifSrcSet}" sizes="${escapeAttr(sizes)}">`,
    webpSrcSet && `<source type="image/webp" srcset="${webpSrcSet}" sizes="${escapeAttr(sizes)}">`,
  ]
    .filter(Boolean)
    .join("");

  const imgTag = `<img src="${escapeAttr(fallbackSrc)}" alt="${escapeAttr(image.alt)}"${dimAttrs} class="${escapeAttr(sizingClass)}"${bgStyle}${onload} ${loadingAttrs}>`;

  return <picture style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: sourceTags + imgTag }} />;
}
