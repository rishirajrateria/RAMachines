#!/usr/bin/env node
/**
 * scripts/verify-interactions.mjs — ADR-0010's regression guard.
 *
 * Dropping React from the client means nothing type-checks the behaviour of
 * public/enhance.js against the markup its Server Components emit: if someone
 * renames a `data-*` hook on one side, the build still passes and the feature
 * just silently stops working. This exercises every one of those contracts in a
 * real browser, and — just as importantly — the no-JS fallback each one is
 * supposed to degrade to, since those only exist on paper otherwise.
 *
 * Usage:
 *   npm run build && npx serve out -l 3000 &
 *   node scripts/verify-interactions.mjs          # or BASE=https://... to hit a deploy
 *
 * Exits non-zero on the first failing contract, listing them all.
 */
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const results = [];
const ok = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});

// ---------------------------------------------------------------- JS enabled
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const errors = [];
ctx.on("weberror", (e) => errors.push(String(e.error())));

const page = await ctx.newPage();
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

ok("runtime booted (window.__enh)", await page.evaluate(() => window.__enh === true));
ok("no React/Next runtime on page", await page.evaluate(() =>
  !document.querySelector('script[src*="/_next/"]') && typeof window.__next_f === "undefined"));

// reveal
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "instant" }));
await page.waitForTimeout(1500);
const revealState = await page.evaluate(() => {
  // Only judge elements FULLY inside the viewport: a scroll-driven reveal is
  // legitimately mid-animation while an element is still entering.
  const els = [...document.querySelectorAll(".reveal")].filter((e) => {
    const r = e.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= innerHeight && r.height > 0;
  });
  const cssPath = CSS.supports("animation-timeline: view()");
  const visible = els.filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.9);
  return { total: els.length, visible: visible.length, cssPath };
});
ok("every fully-visible .reveal element is opaque", revealState.total > 0 && revealState.visible === revealState.total,
  `${revealState.visible}/${revealState.total}, cssScrollTimeline=${revealState.cssPath}`);

// countup ends on the true value
const counts = await page.evaluate(() =>
  [...document.querySelectorAll("[data-countup]")].map((e) => e.textContent.trim()));
ok("countup values settled", counts.every((c) => c.length > 0) && counts.some((c) => /\d/.test(c)),
  counts.join(" | "));

// header pill scroll state
const pillScrolled = await page.evaluate(() =>
  document.querySelector(".header-pill")?.classList.contains("is-scrolled"));
ok("header pill gets .is-scrolled after scroll", pillScrolled === true);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
const cleared = await page
  .waitForFunction(() => !document.querySelector(".header-pill")?.classList.contains("is-scrolled"), null, { timeout: 4000 })
  .then(() => true, () => false);
ok("header pill clears .is-scrolled back at top", cleared);

// hero video mounted from <template>
ok("hero video mounted from template", await page.evaluate(() =>
  !!document.querySelector("[data-herovideo] video")));

// sheen sets custom props on pointermove
const card = await page.$(".glass-sheen");
if (card) {
  await card.hover();
  await page.mouse.move(400, 400);
  await page.waitForTimeout(150);
}
ok("card sheen responds to pointer", await page.evaluate(() =>
  [...document.querySelectorAll(".glass-sheen")].some((c) => c.style.getPropertyValue("--mx") !== "")));

// ------------------------------------------------------------- product filter
await page.goto(`${BASE}/products`, { waitUntil: "networkidle" });
const beforeFilter = await page.evaluate(() =>
  [...document.querySelectorAll("[data-category]")].filter((c) => !c.hidden).length);
await page.click('[data-filter="tube-laser-cutting-machines"]');
await page.waitForTimeout(200);
const afterFilter = await page.evaluate(() => ({
  shown: [...document.querySelectorAll("[data-category]")].filter((c) => !c.hidden).length,
  allCorrect: [...document.querySelectorAll("[data-category]")]
    .filter((c) => !c.hidden)
    .every((c) => c.dataset.category === "tube-laser-cutting-machines"),
  pressed: document.querySelector('[data-filter="tube-laser-cutting-machines"]').getAttribute("aria-pressed"),
  url: location.pathname,
}));
ok("product filter narrows the grid", afterFilter.shown > 0 && afterFilter.shown < beforeFilter,
  `${beforeFilter} → ${afterFilter.shown}`);
ok("product filter shows only the chosen category", afterFilter.allCorrect);
ok("product filter sets aria-pressed", afterFilter.pressed === "true");
ok("filter chips are promoted to button semantics", await page.$$eval("[data-filter]", (a) => a.every((x) => x.getAttribute("role") === "button")));
ok("product filter does not navigate", afterFilter.url === "/products");
await page.click('[data-filter="all"]');
await page.waitForTimeout(200);
ok("'All machines' restores every card", await page.evaluate(() =>
  [...document.querySelectorAll("[data-category]")].every((c) => !c.hidden)));

// ------------------------------------------------------------- cert modal
await page.goto(`${BASE}/certifications`, { waitUntil: "networkidle" });
const certSlug = await page.evaluate(() => document.querySelector("[data-cert]")?.dataset.cert);
await page.click("[data-cert]");
await page.waitForTimeout(250);
const modal = await page.evaluate((slug) => {
  const d = document.getElementById("cert-dialog");
  const shown = [...d.querySelectorAll("[data-cert-panel]")].filter((p) => !p.hidden);
  return { open: d.open, count: shown.length, slug: shown[0]?.dataset.certPanel, want: slug };
}, certSlug);
ok("certificate dialog opens", modal.open === true);
ok("exactly one certificate panel is shown", modal.count === 1, `showing ${modal.slug}`);
ok("the clicked certificate is the one shown", modal.slug === modal.want);
await page.click("[data-cert-close]");
await page.waitForTimeout(250);
ok("certificate dialog closes", await page.evaluate(() => !document.getElementById("cert-dialog").open));

// ------------------------------------------------------------------- map
await page.goto(`${BASE}/contact`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
ok("map iframe absent before click", await page.evaluate(() => !document.querySelector("[data-map] iframe")));
await page.click("[data-map-load]");
await page.waitForTimeout(300);
ok("map iframe loads on click", await page.evaluate(() => !!document.querySelector("[data-map] iframe")));

// --------------------------------------------------------------- mobile nav
const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await mob.newPage();
mp.on("pageerror", (e) => errors.push(String(e)));
await mp.goto(`${BASE}/`, { waitUntil: "networkidle" });
const panelHidden = await mp.evaluate(() => {
  const p = document.getElementById("mobile-nav-panel");
  return getComputedStyle(p).opacity === "0" && p.hasAttribute("inert");
});
ok("mobile nav starts closed and inert", panelHidden);
ok("menu button shows exactly one icon when closed", await mp.evaluate(() => {
  const shown = [...document.querySelectorAll("[data-navicon]")]
    .filter((i) => getComputedStyle(i).display !== "none");
  return shown.length === 1 && shown[0].dataset.navicon === "open";
}));
await mp.click("[data-navtoggle]");
const navOpened = await mp
  .waitForFunction(() => getComputedStyle(document.getElementById("mobile-nav-panel")).opacity === "1", null, { timeout: 4000 })
  .then(() => true, () => false);
const opened = await mp.evaluate(() => {
  const p = document.getElementById("mobile-nav-panel");
  const t = document.querySelector("[data-navtoggle]");
  return {
    open: p.classList.contains("is-open"),
    opacity: getComputedStyle(p).opacity,
    expanded: t.getAttribute("aria-expanded"),
    inert: p.hasAttribute("inert"),
    // Computed style, not the `hidden` property: a display utility on the same
    // element can override the attribute, which is exactly how both icons once
    // ended up on screen at the same time.
    closeIconShown: getComputedStyle(document.querySelector('[data-navicon="close"]')).display !== "none",
    openIconShown: getComputedStyle(document.querySelector('[data-navicon="open"]')).display !== "none",
  };
});
ok("mobile nav opens", navOpened && opened.open, `opacity=${opened.opacity}`);
ok("mobile nav sets aria-expanded", opened.expanded === "true");
ok("mobile nav panel is no longer inert", opened.inert === false);
ok("mobile nav swaps to the close icon", opened.closeIconShown && !opened.openIconShown,
  `close=${opened.closeIconShown} open=${opened.openIconShown}`);
await mp.keyboard.press("Escape");
const navClosed = await mp
  .waitForFunction(() => !document.getElementById("mobile-nav-panel").classList.contains("is-open"), null, { timeout: 4000 })
  .then(() => true, () => false);
ok("Escape closes mobile nav", navClosed);

// horizontal overflow
for (const path of ["/", "/products", "/about", "/contact", "/india/west-bengal/kolkata"]) {
  await mp.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(`no horizontal overflow at 390px: ${path}`, overflow <= 1, `${overflow}px`);
}

// ------------------------------------------------------------------- no JS
const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
const np = await nojs.newPage();
await np.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
const hiddenReveals = await np.$$eval(".reveal", (els) =>
  els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9).length);
ok("no-JS: no content is left hidden", hiddenReveals === 0, `${hiddenReveals} hidden`);
ok("no-JS: html has no .js class", (await np.getAttribute("html", "class") || "").includes("js") === false);
ok("no-JS: quote form posts to Web3Forms", await np.$eval('form[action*="web3forms"]', (f) => f.method.toLowerCase()) === "post");
ok("no-JS: countup shows the real value", (await np.$$eval("[data-countup]", (e) => e.map((x) => x.textContent))).every((t) => t.trim().length));
// mobile nav :target fallback
await np.goto(`${BASE}/#mobile-nav-panel`, { waitUntil: "domcontentloaded" });
await np.waitForTimeout(1200);
ok("no-JS: mobile nav opens via :target", await np.$eval("#mobile-nav-panel", (p) => getComputedStyle(p).opacity === "1"));
await np.goto(`${BASE}/certifications`, { waitUntil: "domcontentloaded" });
ok("no-JS: certificate rows link to the image", await np.$eval("[data-cert]", (a) => /\.(webp|png|jpe?g|avif)$/i.test(a.getAttribute("href"))));
await np.goto(`${BASE}/products`, { waitUntil: "domcontentloaded" });
ok("no-JS: every product card is visible", await np.$$eval("[data-category]", (c) => c.every((x) => !x.hidden)));
ok("no-JS: filter chips are real links", await np.$eval('[data-filter="tube-laser-cutting-machines"]', (a) => a.getAttribute("href")?.startsWith("/products/")));
ok("no-JS: filter chips claim no button semantics", await np.$$eval("[data-filter]", (a) => a.every((x) => !x.hasAttribute("aria-pressed") && !x.hasAttribute("role"))));

// Form success state — the `?sent=1#sent` round trip, with JS off entirely.
await np.goto(`${BASE}/contact`, { waitUntil: "domcontentloaded" });
ok("no-JS: success panel hidden before submit", await np.$eval("#sent", (e) => getComputedStyle(e).display === "none"));
ok("no-JS: form redirects back to #sent", await np.$eval('input[name="redirect"]', (e) => e.value.endsWith("?sent=1#sent")));
await np.goto(`${BASE}/contact?sent=1#sent`, { waitUntil: "domcontentloaded" });
await np.waitForTimeout(400);
ok("no-JS: success panel shows on ?sent=1#sent", await np.$eval("#sent", (e) => getComputedStyle(e).display !== "none"));
ok("no-JS: the form is replaced by the confirmation", await np.$eval("form.form-on-sent", (e) => getComputedStyle(e).display === "none"));

ok("no console/page errors", errors.length === 0, errors.slice(0, 3).join(" ~ "));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log("FAILURES:");
  for (const f of failed) console.log(`  ✗ ${f.name} ${f.detail}`);
  process.exit(1);
}
