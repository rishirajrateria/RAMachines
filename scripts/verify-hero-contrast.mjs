#!/usr/bin/env node
/**
 * scripts/verify-hero-contrast.mjs — the hero copy sits directly on a
 * photograph, so its legibility is not something CSS can promise on its own: it
 * depends on the actual pixels of the actual image behind each line of text.
 *
 * This renders a representative route from every hero family, finds the real
 * on-screen box of each piece of text, then repaints that text TRANSPARENT and
 * screenshots the region to sample the true backdrop — image, scrim and any
 * glass surface, as actually composited, rather than the CSS colour we hoped
 * for — and computes the WCAG contrast ratio against the colour the text is
 * really painted in.
 *
 * Repainting the glyphs (rather than hiding the element) matters for anything
 * that sits on its own surface: hiding a button would take its glass pill away
 * with it and measure the photograph behind the button instead, which reads as
 * a catastrophic failure that does not exist.
 *
 * Pages are rendered with reduced motion so the measurement is deterministic:
 * the hero entrance fades the copy in and the Ken Burns pan is a continuous
 * 18s animation, so an un-frozen page returns a different answer every run —
 * early runs of this script reported contrast against a half-faded hero.
 *
 * It measures the union of the GLYPH rectangles (via a Range over the text
 * nodes), not the element's padding box. That distinction matters: an element's
 * box can extend into whatever sits above or below it — the breadcrumb's padding
 * reached 4px into the floating header — and sampling that padding reports a
 * contrast failure against pixels no letter is ever drawn on.
 *
 * It reports the WORST backdrop pixel in each box, not the average — a bright
 * highlight under one letter is exactly the failure a mean would hide.
 *
 * Thresholds: WCAG AA, 3.0 for large text (the H1s and lead paragraphs here are
 * all well over 24px), 4.5 for normal text.
 *
 * Usage: npx serve out -l 3000 &  node scripts/verify-hero-contrast.mjs
 */
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import sharp from "sharp";

const BASE = process.env.BASE || "http://localhost:3000";

// One route per distinct hero image/layout family.
const ROUTES = [
  ["/", "home (centred, full height)"],
  ["/products", "products hub"],
  ["/products/fiber-laser-cutting-machines/ra-f3015-pro", "product detail"],
  ["/india/west-bengal/kolkata", "city"],
  ["/india/west-bengal", "state"],
  ["/export/united-states", "export country"],
  ["/about", "about"],
  ["/contact", "contact"],
  ["/certifications", "certifications"],
  ["/services/machine-repair", "service"],
];

const TARGETS = [
  { sel: ".hero-copy h1", label: "H1", large: true },
  { sel: ".hero-copy > p:not(.eyebrow)", label: "body", large: true },
  { sel: ".hero-copy .eyebrow", label: "eyebrow", large: false },
  { sel: ".hero-copy nav", label: "breadcrumb", large: false },
  // The header floats INSIDE every hero now, and the hero's own buttons sit on
  // the photograph, so both are light-on-dark surfaces worth holding to AA.
  { sel: '.header-pill a[href="/products"]', label: "header link", large: false },
  { sel: ".header-pill .font-display", label: "wordmark", large: false },
  { sel: ".hero-copy a.glass-pill", label: "2nd button", large: false },
  { sel: ".hero-copy a.bg-teal", label: "1st button", large: false },
];

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
/** Returns [r, g, b, a] — alpha defaults to 1 for `rgb()`. */
const parseRgb = (s) => {
  const n = (s.match(/[\d.]+/g) || []).map(Number);
  return [n[0] ?? 0, n[1] ?? 0, n[2] ?? 0, n[3] ?? 1];
};
/**
 * Several hero colours are translucent white (the body copy is 90% white, the
 * breadcrumb 72%). Scoring those as solid white overstates their contrast, so
 * composite the foreground over the actual backdrop pixel first.
 */
const over = ([r, g, b, a], bg) =>
  a >= 1 ? [r, g, b] : [0, 1, 2].map((i) => Math.round([r, g, b][i] * a + bg[i] * (1 - a)));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const failures = [];
const rows = [];

for (const [route, family] of ROUTES) {
  for (const [w, h, device] of [[1280, 900, "desktop"], [390, 844, "mobile"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(1400); // let the hero entrance settle

    for (const t of TARGETS) {
      const info = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        // Union of the actual glyph rects, so we sample only pixels a letter is
        // painted on — not padding that may overlap a neighbouring surface.
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
        if (!rects.length) return null;
        const left = Math.min(...rects.map((r) => r.left));
        const top = Math.min(...rects.map((r) => r.top));
        const right = Math.max(...rects.map((r) => r.right));
        const bottom = Math.max(...rects.map((r) => r.bottom));
        if (right - left < 4 || bottom - top < 4 || top > innerHeight || bottom < 0) return null;
        const x = Math.max(0, Math.floor(left));
        const y = Math.max(0, Math.floor(top));
        return {
          color: getComputedStyle(el).color,
          box: {
            x,
            y,
            width: Math.min(Math.ceil(right - left), innerWidth - x),
            height: Math.min(Math.ceil(bottom - top), innerHeight - y),
          },
        };
      }, t.sel);
      if (!info) continue;

      // Repaint the glyphs transparent — keeping every background intact — so
      // the screenshot is exactly what sits behind the text.
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        // Descendants too: a breadcrumb's links and its current-page span each
        // set their own colour, so recolouring only the <nav> leaves their
        // glyphs painted and measures text against text (~1.1:1 every time).
        for (const n of [el, ...el.querySelectorAll("*")]) {
          n.style.color = "transparent";
          n.style.textShadow = "none";
        }
      }, t.sel);
      const shot = await page.screenshot({ clip: info.box });
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        for (const n of [el, ...el.querySelectorAll("*")]) {
          n.style.color = "";
          n.style.textShadow = "";
        }
      }, t.sel);

      const { data, info: meta } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
      const fg = parseRgb(info.color);
      let worst = Infinity;
      let worstPx = null;
      for (let i = 0; i < data.length; i += meta.channels) {
        const px = [data[i], data[i + 1], data[i + 2]];
        const cr = ratio(over(fg, px), px);
        if (cr < worst) {
          worst = cr;
          worstPx = px;
        }
      }
      const need = t.large ? 3.0 : 4.5;
      const pass = worst >= need;
      rows.push(
        `${pass ? "PASS" : "FAIL"}  ${route.padEnd(48)} ${device.padEnd(8)} ${t.label.padEnd(11)} ` +
          `${worst.toFixed(2)}:1 (need ${need.toFixed(1)})  worst backdrop rgb(${worstPx})` +
            (fg[3] < 1 ? ` (fg ${Math.round(fg[3] * 100)}% white, composited)` : ""),
      );
      if (!pass) {
        failures.push(`${route} ${device} ${t.label}: ${worst.toFixed(2)}:1, needs ${need.toFixed(1)}:1 (${family})`);
      }
    }
    await ctx.close();
  }
}

await browser.close();
for (const r of rows) console.log(r);
console.log(`\n${rows.length - failures.length}/${rows.length} hero text regions meet WCAG AA`);
if (failures.length) {
  console.log("\nFAILURES:");
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
