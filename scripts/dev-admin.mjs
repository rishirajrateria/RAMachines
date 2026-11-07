#!/usr/bin/env node
/**
 * scripts/dev-admin.mjs — run the /admin dashboard locally with DEMO data
 * (`node scripts/dev-admin.mjs [port]`, password "demo"). Serves public/ and the
 * real api/ handlers on an in-memory PGlite database; nothing touches production.
 */
import http from "node:http";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { PGlite } from "@electric-sql/pglite";

const require = createRequire(import.meta.url);
process.env.ADMIN_PASSWORD = "demo";
process.env.ADMIN_SECRET = "demo-secret";
const db = require("../api/_lib/db");
const routes = {
  "/api/collect": require("../api/collect"),
  "/api/admin/auth": require("../api/admin/auth"),
  "/api/admin/stats": require("../api/admin/stats"),
  "/api/admin/leads": require("../api/admin/leads"),
};

const pg = new PGlite();
db.useClient(async (text, params) => (await pg.query(text, params)).rows);
await db.query("SELECT 1", []);

// ---- demo history: 45 days of plausible B2B machine-site traffic ----
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pick = (list) => list[Math.floor(rnd() * list.length)];
const weighted = (pairs) => { let r = rnd() * pairs.reduce((a, p) => a + p[1], 0); for (const [v, w] of pairs) if ((r -= w) <= 0) return v; return pairs[0][0]; };
const places = [["IN","Kolkata",30],["IN","Ludhiana",14],["IN","Pune",12],["IN","Mumbai",10],["IN","Delhi",10],["IN","Rajkot",6],["BD","Dhaka",6],["AE","Dubai",5],["NP","Kathmandu",3],["US","Houston",2],["DE","Berlin",1],["KE","Nairobi",1]];
const channels = [["Direct","(direct)",30],["Organic Search","google.com",36],["Social","linkedin.com",8],["Social","facebook.com",5],["Referral","indiamart.com",9],["Referral","tradeindia.com",4],["Paid","google",6],["Email","newsletter",2]];
const pagesAll = ["/","/products","/products/fiber-laser-cutting-machines","/products/cnc-plasma-cutting-machines","/products/mig-tig-arc-welding-machines","/products/robotic-welding-systems","/contact","/export","/services/machine-repair","/guides","/about"];
const forms = ["Quote","Contact","Export","Repair","Training"];
const names = ["Rohit Sharma","Anita Das","Imran Khan","Suresh Patel","Meera Iyer","Karim Uddin","Vikram Singh","Pooja Gupta","Sanjay Rao","Farhan Ali"];
const companies = ["Sharma Fabricators","Das Engineering","Khan Metals","Patel Steel Works","Iyer Auto Parts","Uddin Industries","Singh Forge","Gupta Sheet Metal","Rao Tools","Ali Machinery"];
const now = Date.now();
let n = 0;
for (let day = 44; day >= 0; day--) {
  const visits = Math.round((18 + rnd() * 22) * (day < 20 ? 1.4 : 1) * ([0, 6].includes(new Date(now - day * 864e5).getDay()) ? 0.6 : 1));
  for (let i = 0; i < visits; i++) {
    const [country, city] = weighted(places.map((p) => [[p[0], p[1]], p[2]]));
    const [channel, source] = weighted(channels.map((c) => [[c[0], c[1]], c[2]]));
    const vid = "v" + n++;
    const device = weighted([["Mobile", 58], ["Desktop", 38], ["Tablet", 4]]);
    const browser = device === "Desktop" ? weighted([["Chrome", 70], ["Edge", 15], ["Firefox", 8], ["Safari", 7]]) : weighted([["Chrome", 78], ["Safari", 14], ["Samsung Internet", 8]]);
    const os = device === "Desktop" ? weighted([["Windows", 80], ["macOS", 15], ["Linux", 5]]) : weighted([["Android", 82], ["iOS", 18]]);
    let ts = now - day * 864e5 - Math.floor(rnd() * 14 * 3600e3) + 3 * 3600e3 - 12 * 3600e3;
    if (ts > now) ts = now - Math.floor(rnd() * 3e5);
    const pages = rnd() < 0.42 ? 1 : 2 + Math.floor(rnd() * 4);
    for (let p = 0; p < pages; p++) {
      const path = p === 0 && rnd() < 0.5 ? "/" : pick(pagesAll);
      await pg.query(`INSERT INTO pageviews (pvid, vid, ts, path, channel, source, country, city, region, device, browser, os, duration, scroll) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [vid + "p" + p, vid, new Date(ts), path, channel, source, country, city, country === "IN" ? "WB" : "", device, browser, os, pages === 1 && rnd() < 0.7 ? Math.floor(rnd() * 8) : 15 + Math.floor(rnd() * 120), Math.floor(rnd() * 100)]);
      ts += 40e3 + rnd() * 90e3;
    }
    if (rnd() < 0.07) await pg.query(`INSERT INTO actions (vid, type, label, ts, path, channel, country, city, device) VALUES ($1,$2,'+91 82408 55051',$3,'/contact',$4,$5,$6,$7)`, [vid, weighted([["phone_click", 45], ["phone_copy", 30], ["whatsapp_click", 20], ["email_click", 5]]), new Date(ts), channel, country, city, device]);
    if (rnd() < 0.04) {
      const k = Math.floor(rnd() * 10), form = pick(forms);
      await pg.query(`INSERT INTO leads (vid, ts, form, name, email, phone, company, message, fields, path, channel, country, city, device) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,'/products',$10,$11,$12,$13)`,
        [vid, new Date(ts), form, names[k], names[k].split(" ")[0].toLowerCase() + "@example.com", "+91 98" + Math.floor(10000000 + rnd() * 89999999), companies[k], "Looking for a quote on a " + pick(["6 kW fiber laser", "CNC plasma table", "SAW setup", "robotic welding cell"]) + " for our workshop.", JSON.stringify({ name: names[k], product: "Demo" }), channel, country, city, device]);
    }
  }
}
console.log("demo data ready:", (await pg.query("SELECT count(*)::int n FROM pageviews")).rows[0].n, "page views");

const TYPES = { ".htm": "text/html", ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" };
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const handler = routes[url.pathname];
  if (handler) {
    req.query = Object.fromEntries(url.searchParams);
    if (req.method === "POST") {
      let raw = ""; for await (const chunk of req) raw += chunk;
      req.body = raw;
    }
    return handler(req, res);
  }
  const file = url.pathname === "/admin" ? "/admin/index.htm" : url.pathname;
  try {
    const body = await readFile(join("public", file));
    res.setHeader("Content-Type", TYPES[extname(file)] || "application/octet-stream");
    res.end(body);
  } catch { res.statusCode = 404; res.end("not found"); }
}).listen(Number(process.argv[2]) || 3100, () => console.log("admin demo on http://localhost:" + (process.argv[2] || 3100) + "/admin  (password: demo)"));
