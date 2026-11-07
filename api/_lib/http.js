/**
 * api/_lib/http.js — request helpers shared by the API routes: body parsing,
 * JSON replies, cookies, the visitor's place (Vercel's geo headers), a
 * privacy-preserving visitor hash, user-agent and traffic-source classification.
 *
 * Privacy: no IP address is ever stored. A visitor is the SHA-256 of
 * (secret + today's date + IP + user-agent) — it changes every day, nothing is
 * written to the visitor's device, and it cannot be turned back into an IP.
 */
const crypto = require("node:crypto");

const SITE_HOSTS = ["ramachines.com", "www.ramachines.com", "ra-machines.vercel.app"];

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "ra-machine-dev-secret";
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function header(req, name) {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value || "";
}

function clientIp(req) {
  return (header(req, "x-forwarded-for").split(",")[0] || header(req, "x-real-ip") || "0.0.0.0").trim();
}

function ipHash(req) {
  return sha256(secret() + "|ip|" + clientIp(req)).slice(0, 32);
}

/** Daily-rotating anonymous visitor id. */
function visitorId(req) {
  const day = new Date().toISOString().slice(0, 10);
  return sha256([secret(), day, clientIp(req), header(req, "user-agent")].join("|")).slice(0, 24);
}

/** Country / region / city from Vercel's edge headers (empty locally). */
function geo(req) {
  const decode = (value) => {
    try {
      return decodeURIComponent(value || "");
    } catch (e) {
      return value || "";
    }
  };
  return {
    country: (header(req, "x-vercel-ip-country") || "").toUpperCase().slice(0, 2) || null,
    region: decode(header(req, "x-vercel-ip-country-region")).slice(0, 40) || null,
    city: decode(header(req, "x-vercel-ip-city")).slice(0, 60) || null,
  };
}

const BOT_RE =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|uptime|monitor|facebookexternalhit|curl|wget|python|java\/|go-http|axios|node-fetch|okhttp|scrapy|httpclient/i;

function isBot(ua) {
  return !ua || BOT_RE.test(ua);
}

function parseUA(ua) {
  ua = ua || "";
  const device = /ipad|tablet|kindle|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))
    ? "Tablet"
    : /mobi|iphone|ipod|android/i.test(ua)
      ? "Mobile"
      : "Desktop";
  let browser = "Other";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/samsungbrowser/i.test(ua)) browser = "Samsung Internet";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua)) browser = "Safari";
  let os = "Other";
  if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/mac os|macintosh/i.test(ua)) os = "macOS";
  else if (/cros/i.test(ua)) os = "ChromeOS";
  else if (/linux/i.test(ua)) os = "Linux";
  return { device, browser, os };
}

const SEARCH_HOSTS = ["google.", "bing.", "yahoo.", "duckduckgo.", "baidu.", "yandex.", "ecosia.", "search.brave.", "startpage.", "naver.", "seznam."];
const SOCIAL_HOSTS = ["facebook.com", "fb.com", "instagram.com", "linkedin.com", "lnkd.in", "twitter.com", "x.com", "t.co", "youtube.com", "youtu.be", "whatsapp.com", "wa.me", "pinterest.", "reddit.com", "telegram.org", "t.me", "quora.com", "threads.net"];
const SOCIAL_NAMES = ["facebook", "fb", "instagram", "ig", "linkedin", "twitter", "x", "youtube", "whatsapp", "pinterest", "reddit", "telegram", "quora", "threads"];

const hostIn = (host, list) => list.some((h) => (h.endsWith(".") ? host.includes("." + h) || host.startsWith(h) : host === h || host.endsWith("." + h)));

/**
 * Where a visit came from: { channel, source, medium, campaign, refHost }.
 * Channels: Direct · Organic Search · Paid · Social · Email · Referral.
 */
function classifySource(referrer, query) {
  query = query || {};
  let refHost = "";
  try {
    refHost = referrer ? new URL(referrer).hostname.replace(/^www\./, "") : "";
  } catch (e) {}
  if (SITE_HOSTS.some((h) => refHost === h.replace(/^www\./, ""))) refHost = "";

  const medium = String(query.utm_medium || "").toLowerCase().slice(0, 40);
  const source = String(query.utm_source || "").toLowerCase().slice(0, 60);
  const campaign = String(query.utm_campaign || "").slice(0, 80);
  const base = { source: source || refHost || null, medium: medium || null, campaign: campaign || null, refHost: refHost || null };

  if (query.gclid || /^(cpc|ppc|paid|paidsearch|paid_social|display)$/.test(medium)) {
    return { ...base, channel: "Paid", source: source || refHost || "google" };
  }
  if (/^e-?mail$/.test(medium) || source === "email" || source === "newsletter") return { ...base, channel: "Email" };
  if (medium === "social" || SOCIAL_NAMES.includes(source) || (!medium && hostIn(refHost, SOCIAL_HOSTS))) {
    return { ...base, channel: "Social" };
  }
  if (medium === "organic" || (!medium && hostIn(refHost, SEARCH_HOSTS))) return { ...base, channel: "Organic Search" };
  if (refHost || source) return { ...base, channel: "Referral" };
  return { ...base, channel: "Direct", source: "(direct)" };
}

async function readBody(req) {
  let body = req.body;
  if (body === undefined) {
    body = await new Promise((resolve) => {
      let raw = "";
      req.on("data", (chunk) => {
        raw += chunk;
        if (raw.length > 100000) req.destroy();
      });
      req.on("end", () => resolve(raw));
      req.on("error", () => resolve(""));
    });
  }
  if (Buffer.isBuffer(body)) body = body.toString("utf8");
  if (typeof body === "string") {
    const text = body.trim();
    if (!text) return {};
    if (text[0] === "{") {
      try {
        return JSON.parse(text);
      } catch (e) {
        return {};
      }
    }
    return Object.fromEntries(new URLSearchParams(text));
  }
  return body && typeof body === "object" ? body : {};
}

function send(res, status, payload, extra) {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  for (const key of Object.keys(extra || {})) res.setHeader(key, extra[key]);
  if (payload === undefined) return res.end();
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(JSON.stringify(payload));
}

function parseCookies(req) {
  const out = {};
  for (const part of header(req, "cookie").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}

/** Same-origin guard: the site itself, its previews and localhost only. */
function originAllowed(req) {
  const origin = header(req, "origin") || header(req, "referer");
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return SITE_HOSTS.includes(host) || host.endsWith(".vercel.app") || host === "localhost" || host === "127.0.0.1";
  } catch (e) {
    return false;
  }
}

const clip = (value, max) => (value == null ? null : String(value).slice(0, max));

module.exports = {
  sha256, header, clientIp, ipHash, visitorId, geo, isBot, parseUA, classifySource,
  readBody, send, parseCookies, originAllowed, clip, secret,
};
