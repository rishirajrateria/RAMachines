/**
 * lib/og.tsx — shared Open Graph image renderer. Every route's opengraph-image.tsx
 * calls `renderOg({ title, subtitle?, eyebrow? })`. Runs in the Node runtime (needed to
 * read font files with `fs`) and is compatible with `output: 'export'` because it is
 * evaluated at build time only, never at request time.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const uiFont = readFileSync(join(process.cwd(), "app/fonts/manrope-latin-600-normal.woff"));
const displayFont = readFileSync(
  join(process.cwd(), "app/fonts/barlow-semi-condensed-latin-600-normal.woff"),
);

/** Wraps a title into lines of roughly `max` characters, capped at 3 lines. */
function wrapTitle(title: string, max = 40): string[] {
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "72px 80px",
          fontFamily: "Manrope",
        }}
      >
        <div style={{ width: 64, height: 3, backgroundColor: "#1F4E79", display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {o.eyebrow && (
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#1F4E79",
                marginBottom: 20,
                display: "flex",
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
                  fontFamily: "Barlow Semi Condensed",
                  fontSize: 68,
                  lineHeight: 1.05,
                  color: "#111214",
                  display: "flex",
                }}
              >
                {line}
              </div>
            ))}
          </div>
          {o.subtitle && (
            <div style={{ marginTop: 24, fontSize: 28, color: "#5B5F68", display: "flex" }}>
              {o.subtitle}
            </div>
          )}
        </div>

        <div style={{ fontSize: 22, color: "#7A7E87", display: "flex" }}>
          ramachine.com · Kolkata, India · Exporting worldwide
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Manrope", data: uiFont, weight: 600, style: "normal" },
        { name: "Barlow Semi Condensed", data: displayFont, weight: 600, style: "normal" },
      ],
    },
  );
}
