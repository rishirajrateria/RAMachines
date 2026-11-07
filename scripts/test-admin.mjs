#!/usr/bin/env node
/**
 * scripts/test-admin.mjs — exercises the real API handlers (api/*.js) against
 * PGlite, a genuine Postgres running in WASM, so the SQL is checked for real.
 * `node scripts/test-admin.mjs`   (no network, no Vercel, no Neon needed)
 */
import { createRequire } from "node:module";
import { PGlite } from "@electric-sql/pglite";

const require = createRequire(import.meta.url);
process.env.ADMIN_PASSWORD = "correct horse";
process.env.ADMIN_SECRET = "test-secret";

const db = require("../api/_lib/db");
const auth = require("../api/_lib/auth");
const { parseRange } = require("../api/_lib/stats");
const collect = require("../api/collect");
const adminAuth = require("../api/admin/auth");
const adminStats = require("../api/admin/stats");
const adminLeads = require("../api/admin/leads");

const pg = new PGlite();
db.useClient(async (text, params) => (await pg.query(text, params)).rows);

let failed = 0;
const ok = (name, cond, extra) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : "  " + JSON.stringify(extra)}`);
  if (!cond) failed++;
};

function call(handler, { method = "GET", headers = {}, body, query } = {}) {
  return new Promise((resolve, reject) => {
    const res = {
      statusCode: 200, headers: {}, body: "",
      setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
      end(chunk) { this.body += chunk || ""; resolve(this); },
    };
    const req = { method, headers: { "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit Safari/604.1", ...headers }, body, query };
    Promise.resolve(handler(req, res)).catch(reject);
  });
}
const json = (r) => JSON.parse(r.body);
const SITE = { origin: "https://www.ramachines.com" };
const geoKolkata = { "x-vercel-ip-country": "IN", "x-vercel-ip-country-region": "WB", "x-vercel-ip-city": "Kolkata", "x-forwarded-for": "1.1.1.1" };

// ---- tracking: what the browser sends -------------------------------------------------------
await call(collect, { method: "POST", headers: { ...SITE, ...geoKolkata }, body: { t: "pv", pvid: "pv1", path: "/products?x=1", title: "Products", ref: "https://www.google.com/", q: {}, lang: "en-IN" } });
await call(collect, { method: "POST", headers: { ...SITE, ...geoKolkata }, body: JSON.stringify({ t: "pv", pvid: "pv1", path: "/dup" }) });
await call(collect, { method: "POST", headers: { ...SITE, ...geoKolkata }, body: { t: "ping", pvid: "pv1", d: 42, s: 80 } });
await call(collect, { method: "POST", headers: { ...SITE, ...geoKolkata }, body: { t: "act", type: "phone_copy", label: "+91 82408 55051", path: "/contact" } });
await call(collect, { method: "POST", headers: { ...SITE, ...geoKolkata }, body: { t: "act", type: "drop_table", label: "x" } });
await call(collect, { method: "POST", headers: { ...SITE, ...geoKolkata }, body: { t: "lead", form: "Quote", path: "/products", fields: { name: "Asha Rao", phone: "+91 98300 11111", email: "asha@example.com", company: "Rao Fab", message: "Need a 6 kW laser", _honey: "", _subject: "ignored" } } });
await call(collect, { method: "POST", headers: { ...SITE, ...geoKolkata, "user-agent": "Googlebot/2.1" }, body: { t: "pv", pvid: "bot1", path: "/" } });
await call(collect, { method: "POST", headers: { origin: "https://evil.example", ...geoKolkata }, body: { t: "pv", pvid: "evil1", path: "/" } });
await call(collect, { method: "POST", headers: { ...SITE, ...geoKolkata }, body: { t: "pv", pvid: "adm1", path: "/admin" } });

const count = async (sql) => (await pg.query(sql)).rows[0].n;
ok("one pageview stored (duplicate pvid, bot, foreign origin and /admin dropped)", (await count("SELECT count(*)::int n FROM pageviews")) === 1);
ok("query string stripped from path", (await pg.query("SELECT path FROM pageviews")).rows[0].path === "/products");
ok("ping updated duration and scroll", (await pg.query("SELECT duration, scroll FROM pageviews")).rows[0].duration === 42);
ok("search referrer classified Organic Search", (await pg.query("SELECT channel FROM pageviews")).rows[0].channel === "Organic Search");
ok("geo captured from Vercel headers", (await pg.query("SELECT country, city, device FROM pageviews")).rows[0].city === "Kolkata");
ok("known action stored, unknown action rejected", (await count("SELECT count(*)::int n FROM actions")) === 1);
const lead = (await pg.query("SELECT * FROM leads")).rows[0];
ok("lead stored with mapped columns and no underscore fields", lead.name === "Asha Rao" && lead.phone.includes("98300") && !("_subject" in lead.fields), lead);
ok("lead inherits traffic channel", lead.channel === "Organic Search", lead.channel);

// ---- seeded history for the numbers -----------------------------------------------------------
await pg.exec("DELETE FROM pageviews; DELETE FROM actions; DELETE FROM leads;");
const pv = (pvid, vid, ts, path, extra = {}) =>
  pg.query(
    `INSERT INTO pageviews (pvid, vid, ts, path, channel, source, country, city, device, browser, os, duration)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'Chrome','Android',$10)`,
    [pvid, vid, ts, path, extra.channel || "Direct", extra.source || "(direct)", extra.country || "IN", extra.city || "Kolkata", extra.device || "Mobile", extra.duration || 0],
  );
// A: one page, no time -> bounce.  B: two pages -> engaged.  C: one page, 30 s -> engaged.
// D: one page + phone copy + lead -> engaged.  E: two visits 40 minutes apart -> two sessions (both bounce).
await pv("a", "A", "2026-11-03T05:00:00Z", "/");
await pv("b1", "B", "2026-11-03T05:10:00Z", "/products", { channel: "Organic Search", source: "google.com" });
await pv("b2", "B", "2026-11-03T05:11:00Z", "/contact", { channel: "Organic Search", source: "google.com" });
await pv("c", "C", "2026-11-03T06:00:00Z", "/about", { country: "US", city: "Houston", device: "Desktop", duration: 30 });
await pv("d", "D", "2026-11-03T07:00:00Z", "/export", { channel: "Social", source: "linkedin.com", country: "AE", city: "Dubai" });
await pv("e1", "E", "2026-11-03T08:00:00Z", "/");
await pv("e2", "E", "2026-11-03T08:40:00Z", "/");
await pg.query(`INSERT INTO actions (vid, type, label, ts, country, city) VALUES ('D','phone_copy','+91 82408 55051','2026-11-03T07:02:00Z','AE','Dubai')`);
await pg.query(`INSERT INTO leads (vid, form, name, ts, country, city) VALUES ('D','Export','Omar','2026-11-03T07:05:00Z','AE','Dubai')`);
// 19:00Z on 1 Nov is 00:30 on 2 Nov in India — must land in the 2 Nov bucket.
await pv("edge", "F", "2026-11-01T19:00:00Z", "/");

const range = parseRange("2026-11-03", "2026-11-03");
ok("range parser: single day => hourly buckets", range.unit === "hour" && range.days === 1, range);
ok("range parser: previous period is the day before", range.prevFrom === "2026-11-02" && range.prevTo === "2026-11-02", range);
ok("range parser clamps and swaps", parseRange("2026-11-09", "2026-11-01").from === "2026-11-01");

const cookie = await call(adminAuth, { method: "POST", headers: SITE, body: { password: "correct horse" } });
const session = cookie.headers["set-cookie"].split(";")[0];
const authed = { ...SITE, cookie: session };
ok("login with the right password sets an HttpOnly session cookie", cookie.statusCode === 200 && /HttpOnly/.test(cookie.headers["set-cookie"]));
ok("stats refuse an unauthenticated caller", (await call(adminStats, {})).statusCode === 401);

const stats = json(await call(adminStats, { headers: authed, query: { from: "2026-11-03", to: "2026-11-03" } }));
const k = stats.kpis;
ok("visitors = 5 (A,B,C,D,E)", k.visitors === 5, k);
ok("pageviews = 7", k.pageviews === 7, k);
ok("sessions = 6 (E split by the 30-minute rule)", k.sessions === 6, k);
ok("bounce rate = 3 of 6 (A and both E sessions)", Math.abs(k.bounceRate - 0.5) < 1e-9, k);
ok("leads = 1, phone actions = 1", k.leads === 1 && k.phone === 1, k);
ok("conversion rate = 1 lead / 6 sessions", Math.abs(k.conversionRate - 1 / 6) < 1e-9, k);
ok("previous period includes the IST-midnight edge visit", stats.previous.pageviews === 1, stats.previous);
ok("channels split correctly", stats.channels.find((c) => c.k1 === "Organic Search").sessions === 1 && stats.channels.find((c) => c.k1 === "Direct").sessions === 4, stats.channels);
ok("countries: IN 4 sessions, US 1, AE 1", stats.countries[0].k1 === "IN" && stats.countries[0].sessions === 4 && stats.countries.length === 3, stats.countries);
ok("cities include Dubai with the phone-copy location", stats.actionPlaces.some((r) => r.city === "Dubai" && r.type === "phone_copy" && r.n === 1), stats.actionPlaces);
ok("time series is hourly for a single day", stats.series.length > 1 && stats.series[0].b.length === 16, stats.series[0]);
ok("top page is / (3 views)", stats.pages[0].path === "/" && stats.pages[0].views === 3, stats.pages[0]);

const week = json(await call(adminStats, { headers: authed, query: { from: "2026-11-01", to: "2026-11-03" } }));
ok("3-day range covers the IST edge visit (8 pageviews)", week.kpis.pageviews === 8 && week.series[0].b.startsWith("2026-11-02"), week.series.map((s) => s.b));

// ---- leads list / search / csv ---------------------------------------------------------------------
await pg.query(`INSERT INTO leads (vid, form, name, phone, message, ts, country, city) VALUES ('Z','Quote','=HYPERLINK("x")','+91 98300 11111','needs laser','2026-11-03T09:00:00Z','IN','Pune')`);
const list = json(await call(adminLeads, { headers: authed, query: { from: "2026-11-03", to: "2026-11-03" } }));
ok("leads list returns both, newest first", list.total === 2 && list.rows[0].city === "Pune", list);
const found = json(await call(adminLeads, { headers: authed, query: { from: "2026-11-03", to: "2026-11-03", q: "omar" } }));
ok("lead search is case-insensitive", found.total === 1 && found.rows[0].name === "Omar", found);
const csv = (await call(adminLeads, { headers: authed, query: { from: "2026-11-03", to: "2026-11-03", format: "csv" } })).body;
ok("CSV has a header and rows", csv.split("\r\n").length === 3 && csv.startsWith("ts,form,name"), csv);
ok("CSV neutralises spreadsheet formulas but leaves +91 phones alone", csv.includes(`"'=HYPERLINK`) && csv.includes('"+91 98300 11111"'), csv);

// ---- login brake -----------------------------------------------------------------------------------
const wrong = [];
for (let i = 0; i < 9; i++) wrong.push((await call(adminAuth, { method: "POST", headers: { ...SITE, "x-forwarded-for": "9.9.9.9" }, body: { password: "nope" } })).statusCode);
ok("wrong passwords get 401, then 429 after 8", wrong.slice(0, 8).every((c) => c === 401) && wrong[8] === 429, wrong);
ok("a forged cookie is rejected", (await call(adminStats, { headers: { cookie: "ram_admin=9999999999.deadbeef" } })).statusCode === 401);
ok("the owner's own visits are not tracked", await (async () => {
  await call(collect, { method: "POST", headers: { ...authed, ...geoKolkata }, body: { t: "pv", pvid: "own", path: "/" } });
  return (await count("SELECT count(*)::int n FROM pageviews WHERE pvid = 'own'")) === 0;
})());

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll admin API checks passed");
process.exit(failed ? 1 : 0);
