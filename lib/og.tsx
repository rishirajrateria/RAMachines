/**
 * lib/og.tsx — shared Open Graph image renderer. Every route's opengraph-image.tsx
 * calls `renderOg({ title, subtitle?, eyebrow? })`. Runs in the Node runtime (needed
 * to read font files with `fs`) and is compatible with `output: 'export'` because it
 * is evaluated at build time only, never at request time.
 *
 * ADR-0008 §3 "Make it stunning": matches the new depth system — a `.band-deep`-style
 * ink → teal-deep gradient background (was the light canvas + light-form orbs) with
 * white/teal-light/grey-200 text, a large display title, and a stat-style accent: a
 * `subtitle` that reads as a spec string (contains a digit — true for every product
 * card's "1.5 kW · 1500 × 3000 mm" headline) renders large, bold and tabular, echoing
 * `.text-stat`; a plain descriptive sentence (home/about/etc.) stays a calm paragraph.
 * One typeface (Manrope, ADR-0005 §3) — satori cannot parse WOFF2, so the .woff copy
 * is read directly.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const uiFontRegular = readFileSync(join(process.cwd(), "app/fonts/manrope-latin-400-normal.woff"));
const uiFontBold = readFileSync(join(process.cwd(), "app/fonts/manrope-latin-600-normal.woff"));

// ADR-0008 §3 palette — mirrors `.band-deep` (app/globals.css) and the `ink.deep`/
// `teal.deep`/`teal.light` tokens (tailwind.config.ts).
const INK_DEEP = "#0B1414";
const TEAL_DEEP = "#084C47";
const TEAL_LIGHT = "#2A9D93";
const WHITE = "#FFFFFF";
const GREY_200 = "#E1E2E5";

/** True for spec-like subtitles ("1.5 kW · 1500 × 3000 mm") — rendered as a
 *  stat-style accent instead of a plain sentence. */
function isStatLike(text: string): boolean {
  return /\d/.test(text) && text.length <= 40;
}

/** Wraps a title into lines of roughly `max` characters, capped at 3 lines. */
function wrapTitle(title: string, max = 22): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
    if (lines.length === 3) break;
  }
  if (current && lines.length < 3) lines.push(current);

  return lines.slice(0, 3);
}

export function renderOg(o: { title: string; subtitle?: string; eyebrow?: string }): ImageResponse {
  const lines = wrapTitle(o.title);
  const statSubtitle = o.subtitle && isStatLike(o.subtitle);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK_DEEP,
          // ADR-0008 §3: the `.band-deep` gradient (ink → teal-deep) plus one soft
          // teal ambient highlight, top-left, for depth.
          backgroundImage:
            "radial-gradient(circle at 6% 4%, rgba(42,157,147,0.35) 0%, rgba(42,157,147,0) 48%), " +
            `linear-gradient(155deg, ${INK_DEEP} 0%, ${INK_DEEP} 55%, ${TEAL_DEEP} 100%)`,
          fontFamily: "Manrope",
          padding: "72px 76px",
        }}
      >
        {o.eyebrow && (
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: TEAL_LIGHT,
            }}
          >
            {o.eyebrow}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column" }}>
          {lines.map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                fontSize: 78,
                fontWeight: 600,
                lineHeight: 1.02,
                letterSpacing: -3,
                color: WHITE,
              }}
            >
              {line}
            </div>
          ))}
          {o.subtitle && statSubtitle && (
            // Stat-style accent — echoes `.text-stat` (large, 600, tabular numerals)
            // for spec-like subtitles, e.g. a product's "1.5 kW · 1500 × 3000 mm".
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 34,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                color: TEAL_LIGHT,
              }}
            >
              {o.subtitle}
            </div>
          )}
          {o.subtitle && !statSubtitle && (
            <div style={{ display: "flex", marginTop: 22, fontSize: 26, color: GREY_200 }}>{o.subtitle}</div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: WHITE }}>RA Machine</div>
          <div style={{ display: "flex", fontSize: 18, color: GREY_200 }}>
            ramachine.com · Kolkata, India · Exporting worldwide
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Manrope", data: uiFontRegular, weight: 400, style: "normal" },
        { name: "Manrope", data: uiFontBold, weight: 600, style: "normal" },
      ],
    },
  );
}
