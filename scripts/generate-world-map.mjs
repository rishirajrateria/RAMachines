#!/usr/bin/env node
/**
 * scripts/generate-world-map.mjs — builds public/world-map.svg, the "Where we
 * work" visual: a Natural Earth projection of the world with India picked out,
 * a marker on every export market, and great-circle routes drawn out from the
 * Kolkata works.
 *
 * WHY A STANDALONE SVG FILE, not inline markup: the land geometry is ~30 KB
 * even simplified, which would roughly double the home page's HTML and blow the
 * per-route budget. As its own file it is fetched once, cached immutably, and
 * costs the document nothing. The animation therefore lives INSIDE the SVG (CSS
 * animations run in an <img>-loaded SVG; script does not), which also means the
 * whole visual needs no JavaScript at all — consistent with ADR-0010.
 *
 * Geometry comes from world-atlas (Natural Earth 110m) at build time only; no
 * mapping library ships to the browser. Country markers are real centroids from
 * that same data rather than hand-typed coordinates, so they cannot drift from
 * the countries the site actually lists.
 *
 * Run: npm run generate:map   (output is committed; re-run if the country list changes)
 */
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as topojson from "topojson-client";
import { presimplify, simplify, filter, filterWeight } from "topojson-simplify";
import { geoNaturalEarth1, geoPath, geoCentroid } from "d3-geo";

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const WIDTH = 1000;
/**
 * The drawn area, in degrees. Antarctica is not drawn, so fitting to the whole
 * sphere left a dead band across the bottom of the frame. Fitting to the
 * inhabited latitudes instead means the map fills its container.
 */
const VIEW_BAND = {
  type: "Polygon",
  coordinates: [[[-180, -58], [180, -58], [180, 84], [-180, 84], [-180, -58]]],
};
const KOLKATA = [88.3639, 22.5726];

/** The export markets, exactly as data/countries/*.ts names them. */
const MARKETS = [
  "United States", "Canada", "Mexico", "Brazil", "Peru", "Germany", "United Kingdom",
  "Poland", "Turkey", "Russia", "United Arab Emirates", "Saudi Arabia", "Qatar", "Oman",
  "Kuwait", "Egypt", "Bangladesh", "Nepal", "Sri Lanka", "Vietnam", "Indonesia",
  "Malaysia", "Philippines", "Uzbekistan", "South Africa", "Kenya", "Nigeria",
  "Tanzania", "Ethiopia", "Australia",
];

/** world-atlas uses a few different names from ours. */
const ALIASES = {
  "United States": "United States of America",
  Russia: "Russia",
  Tanzania: "United Republic of Tanzania",
};

/**
 * Integer coordinates. At a 1000x500 viewBox rendered ~1000px wide that is
 * sub-pixel precision, and it is worth roughly a fifth of the file size.
 */
const round = (n) => Math.round(n);

/**
 * geoPath emits full floating-point precision; at a 1000x500 viewBox that is
 * many digits of noise per point and was the single biggest contributor to the
 * file size (144 KB -> 25 KB). Integers are sub-pixel here.
 */
const roundPath = (d) => (d ?? "").replace(/-?\d+\.\d+/g, (m) => String(Math.round(Number(m))));

/**
 * How aggressively to drop detail. Natural Earth 110m is already a low-detail
 * cut, but unsimplified it produced a 180 KB SVG — far too much for a
 * decorative panel. Measured across a sweep of weights (land path size, at this
 * viewBox, integer coordinates):
 *
 *     0 -> 78.0 KB   0.5 -> 28.4 KB   2 -> 15.0 KB   10 -> 7.4 KB
 *
 * 1 keeps every continent silhouette honest and all 30 export markets present
 * as distinct geometry, while removing coastline wiggle nothing can resolve at
 * this size. The script fails loudly if a market's geometry is ever simplified
 * away, so this number cannot quietly become wrong.
 */
const SIMPLIFY_WEIGHT = 1;

async function main() {
  const raw = JSON.parse(await readFile(require.resolve("world-atlas/countries-110m.json"), "utf8"));
  // Visvalingam simplification, then drop rings too small to survive it.
  const simplified = filter(
    simplify(presimplify(raw), SIMPLIFY_WEIGHT),
    filterWeight(presimplify(raw), SIMPLIFY_WEIGHT),
  );
  const geo = topojson.feature(simplified, simplified.objects.countries);

  const projection = geoNaturalEarth1().fitWidth(WIDTH, VIEW_BAND);
  const path = geoPath(projection);
  // Height follows from the fitted band rather than being asserted up front.
  const [[, top], [, bottom]] = path.bounds(VIEW_BAND);
  const HEIGHT = Math.ceil(bottom - top);
  projection.translate([projection.translate()[0], projection.translate()[1] - top]);

  const byName = new Map(geo.features.map((f) => [f.properties.name, f]));
  const find = (name) => byName.get(ALIASES[name] ?? name) ?? byName.get(name);

  // Land: everything except India, which is drawn separately so it can be
  // highlighted as the place the machines are built.
  const india = find("India");
  // Antarctica is a wide white-noise blob along the bottom edge that no visitor
  // reads as information here, and it is one of the larger paths in the file.
  const others = geo.features.filter(
    (f) => f.properties.name !== "India" && f.properties.name !== "Antarctica",
  );
  const landPath = roundPath(path({ type: "FeatureCollection", features: others }));
  const indiaPath = roundPath(path(india));
  const spherePath = roundPath(path({ type: "Sphere" }));

  const [rawOx, rawOy] = projection(KOLKATA);
  const originX = round(rawOx);
  const originY = round(rawOy);

  // Markers, from each country's real centroid.
  const missing = [];
  const markers = [];
  for (const name of MARKETS) {
    const feature = find(name);
    if (!feature) { missing.push(name); continue; }
    const [x, y] = projection(geoCentroid(feature));
    markers.push({ name, x: round(x), y: round(y) });
  }
  if (missing.length) {
    console.error(`[world-map] no geometry for: ${missing.join(", ")}`);
    process.exitCode = 1;
    return;
  }


  /*
   * Routes are arcs drawn in PROJECTED space, not true great circles.
   *
   * Sampling a real great circle and projecting it is the geographically honest
   * version, and it looked wrong: Kolkata to North America genuinely runs over
   * the Arctic, so those routes climbed off the top edge of the map and read as
   * a rendering bug rather than as a flight path. A quadratic arc between the
   * two projected points bows north, stays in frame, and is what every reader
   * expects this kind of diagram to mean.
   *
   * Curvature scales with distance, so short hops (Nepal, Bangladesh) stay
   * nearly flat while long ones (Brazil, Australia) sweep.
   */
  const routes = [];
  for (const { name, x, y } of markers) {
    const dx = x - originX;
    const dy = y - originY;
    const distance = Math.hypot(dx, dy);
    const cx = round((originX + x) / 2);
    const cy = round((originY + y) / 2 - distance * 0.3);
    routes.push({ name, d: `M${originX} ${originY}Q${cx} ${cy} ${x} ${y}` });
  }

  /*
   * Two files, because `prefers-reduced-motion` does NOT reach inside an
   * <img>-loaded SVG. Measured: with the preference set, the animated file
   * still drew its routes over several seconds (28% complete at 250ms with the
   * preference off, 35% with it on — i.e. no different). An SVG loaded as an
   * image renders in its own context and does not inherit the page's
   * evaluation of that media query, so the @media rule inside it never fires.
   *
   * The static variant is selected by a <source media="(prefers-reduced-motion:
   * reduce)"> in components/sections/WorldReach.tsx. THAT media query is
   * evaluated by the page, so the browser simply fetches the still image and
   * the animated one is never requested.
   */
  const common = { spherePath, landPath, indiaPath, markers, routes, origin: { x: originX, y: originY }, height: HEIGHT };
  const animated = renderSvg({ ...common, animated: true });
  const still = renderSvg({ ...common, animated: false });
  await writeFile(join(ROOT, "public", "world-map.svg"), animated);
  await writeFile(join(ROOT, "public", "world-map-still.svg"), still);
  console.log(
    `[world-map] ${markers.length} markets · ${routes.length} routes · ` +
      `animated ${(Buffer.byteLength(animated) / 1024).toFixed(1)} KB · still ${(Buffer.byteLength(still) / 1024).toFixed(1)} KB`,
  );
}

function renderSvg({ spherePath, landPath, indiaPath, markers, routes, origin, height, animated }) {
  // Stagger the routes so they draw in sequence rather than all at once.
  //
  // `pathLength` must be an SVG ATTRIBUTE — as a CSS declaration it is ignored,
  // which silently turned the draw-on animation into a 1-unit dashed line (the
  // long routes rendered as dots). Normalising every route to length 1 lets a
  // single stroke-dasharray/dashoffset pair draw them all at the same rate,
  // whatever their real length.
  const routeEls = routes
    .map((r, i) => `<path class="route" pathLength="1" style="--i:${i}" d="${r.d}"/>`)
    .join("");
  const markerEls = markers
    .map(
      (m, i) =>
        `<circle class="mk" style="--i:${i}" cx="${m.x}" cy="${m.y}" r="3.2"><title>${escapeXml(m.name)}</title></circle>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${height}" role="img" aria-label="World map showing RA Machine exporting from Kolkata, India to 30 countries across five continents">
<style>
  /* Tuned to sit on the site's deep band (.band-deep, an ink -> teal-deep
     gradient): the sphere is a barely-there panel so the band still reads
     through it, and the land is one step lighter than the band rather than a
     flat block. */
  .sphere { fill: rgba(255,255,255,.035); }
  .land   { fill: rgba(210,255,248,.10); }
  .india  { fill: #2a9d93; }
  .route  { fill: none; stroke: #5fd8c9; stroke-width: 1.1; stroke-linecap: round; opacity: .5; }
  .mk     { fill: #7ff0e2; }
  .origin { fill: #fff; }
  .halo   { fill: none; stroke: #7ff0e2; stroke-width: 1.4; opacity: .7; }

${animated ? ANIMATION_CSS : STILL_CSS}
</style>
<path class="sphere" d="${spherePath}"/>
<path class="land" d="${landPath}"/>
<path class="india" d="${indiaPath}"/>
${routeEls}
${markerEls}
<circle class="halo" cx="${origin.x}" cy="${origin.y}" r="4"/>
<circle class="origin" cx="${origin.x}" cy="${origin.y}" r="4"><title>Kolkata, India — our works</title></circle>
</svg>
`;
}

/** Routes draw out from Kolkata one after another; markers pop in behind them. */
const ANIMATION_CSS = `
  @keyframes draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes pop  { from { opacity: 0; transform: scale(.2); } to { opacity: 1; transform: scale(1); } }
  @keyframes ping { 0% { r: 4; opacity: .7; } 70%, 100% { r: 20; opacity: 0; } }
  .route {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw 1.5s ease-out forwards;
    animation-delay: calc(var(--i) * .09s);
  }
  .mk {
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    animation: pop .5s ease-out forwards;
    animation-delay: calc(var(--i) * .09s + 1.1s);
  }
  .halo { animation: ping 3s ease-out infinite; }`;

/** The finished picture, with nothing in motion. */
const STILL_CSS = `
  .halo { display: none; }`;

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]);
}

main().catch((err) => {
  console.error("[world-map] failed:", err);
  process.exitCode = 1;
});
