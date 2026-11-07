/**
 * api/collect.js — the site's tracking endpoint (POST, same-origin only).
 *
 * public/enhance.js sends small JSON beacons here:
 *   { t: "pv",   pvid, path, title, ref, q, lang }   a page was viewed
 *   { t: "ping", pvid, d, s }                         time on page (s) and scroll depth (%)
 *   { t: "act",  type, label, path }                  phone tap/copy, WhatsApp, email, form start…
 *   { t: "lead", form, fields, path }                 a form was submitted (a copy of what FormSubmit emails)
 *
 * It never fails loudly: bots, the owner's own visits, foreign origins and
 * database problems are all answered 204 and dropped. Enquiry delivery does not
 * go through here — the forms still post straight to FormSubmit.
 */
const db = require("./_lib/db");
const { authorised } = require("./_lib/auth");
const h = require("./_lib/http");

const ACTION_TYPES = new Set([
  "phone_click", "phone_copy", "whatsapp_click", "email_click", "email_copy", "form_start",
]);

const FIELD_ALIASES = {
  name: ["name", "full_name", "fullname"],
  email: ["email"],
  phone: ["phone", "mobile", "tel"],
  company: ["company", "organisation", "organization"],
  message: ["message", "problem", "requirement", "requirements", "details"],
};

function pick(fields, names) {
  for (const key of names) if (fields[key]) return String(fields[key]);
  return null;
}

async function channelFor(vid) {
  const rows = await db.query(`SELECT channel FROM pageviews WHERE vid = $1 ORDER BY ts DESC LIMIT 1`, [vid]);
  return rows[0] ? rows[0].channel : "Direct";
}

async function pageview(body, ctx) {
  const pvid = h.clip(body.pvid, 40);
  const path = h.clip(String(body.path || "/").split("?")[0], 300);
  if (!pvid || !path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return;
  const src = h.classifySource(body.ref, body.q);
  await db.query(
    `INSERT INTO pageviews (pvid, vid, path, title, channel, source, medium, campaign, ref_host,
       country, region, city, device, browser, os, lang)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) ON CONFLICT (pvid) DO NOTHING`,
    [pvid, ctx.vid, path, h.clip(body.title, 200), src.channel, src.source, src.medium, src.campaign, src.refHost,
      ctx.geo.country, ctx.geo.region, ctx.geo.city, ctx.ua.device, ctx.ua.browser, ctx.ua.os, h.clip(body.lang, 12)],
  );
}

async function ping(body) {
  const pvid = h.clip(body.pvid, 40);
  const seconds = Math.max(0, Math.min(Number(body.d) || 0, 3600));
  const scroll = Math.max(0, Math.min(Number(body.s) || 0, 100));
  if (!pvid) return;
  await db.query(
    `UPDATE pageviews SET duration = GREATEST(duration, $2), scroll = GREATEST(scroll, $3) WHERE pvid = $1`,
    [pvid, Math.round(seconds), Math.round(scroll)],
  );
}

async function action(body, ctx) {
  if (!ACTION_TYPES.has(body.type)) return;
  await db.query(
    `INSERT INTO actions (vid, type, label, path, channel, country, region, city, device)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [ctx.vid, body.type, h.clip(body.label, 120), h.clip(body.path, 300), await channelFor(ctx.vid),
      ctx.geo.country, ctx.geo.region, ctx.geo.city, ctx.ua.device],
  );
}

async function lead(body, ctx) {
  const raw = body.fields && typeof body.fields === "object" ? body.fields : {};
  const fields = {};
  for (const key of Object.keys(raw).slice(0, 30)) {
    if (!key.startsWith("_")) fields[h.clip(key, 40)] = h.clip(raw[key], 2000);
  }
  if (!Object.keys(fields).length) return;
  await db.query(
    `INSERT INTO leads (vid, form, name, email, phone, company, message, fields, path, channel, country, region, city, device)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14)`,
    [ctx.vid, h.clip(String(body.form || "Form").replace(/^./, (c) => c.toUpperCase()), 80), h.clip(pick(fields, FIELD_ALIASES.name), 120), h.clip(pick(fields, FIELD_ALIASES.email), 160),
      h.clip(pick(fields, FIELD_ALIASES.phone), 40), h.clip(pick(fields, FIELD_ALIASES.company), 160),
      h.clip(pick(fields, FIELD_ALIASES.message), 4000), JSON.stringify(fields), h.clip(body.path, 300),
      await channelFor(ctx.vid), ctx.geo.country, ctx.geo.region, ctx.geo.city, ctx.ua.device],
  );
}

module.exports = async function collect(req, res) {
  try {
    if (req.method !== "POST") return h.send(res, 204);
    const ua = h.header(req, "user-agent");
    if (h.isBot(ua) || !h.originAllowed(req) || !db.configured() || authorised(req)) return h.send(res, 204);
    const body = await h.readBody(req);
    const ctx = { vid: h.visitorId(req), geo: h.geo(req), ua: h.parseUA(ua) };
    if (body.t === "pv") await pageview(body, ctx);
    else if (body.t === "ping") await ping(body);
    else if (body.t === "act") await action(body, ctx);
    else if (body.t === "lead") await lead(body, ctx);
  } catch (err) {
    console.error("collect failed:", err && err.message);
  }
  return h.send(res, 204);
};
