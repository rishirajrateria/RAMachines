/**
 * api/_lib/auth.js — the admin session: one password (ADMIN_PASSWORD), a signed
 * HttpOnly cookie, and a database-backed brake on password guessing.
 *
 * The cookie is `<expiry>.<hmac>` signed with ADMIN_SECRET. There is no user
 * table and nothing to steal from the browser except a 12-hour token.
 */
const crypto = require("node:crypto");
const db = require("./db");
const { parseCookies, ipHash, secret, sha256 } = require("./http");

const COOKIE = "ram_admin";
const MAX_AGE = 12 * 60 * 60; // seconds

function sign(expires) {
  return crypto.createHmac("sha256", secret()).update(String(expires)).digest("hex");
}

function issueCookie() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${COOKIE}=${expires}.${sign(expires)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

function clearCookie() {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function authorised(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return false;
  const [expires, mac] = token.split(".");
  if (!expires || !mac || Number(expires) < Date.now() / 1000) return false;
  const good = Buffer.from(sign(expires));
  const given = Buffer.from(mac);
  return good.length === given.length && crypto.timingSafeEqual(good, given);
}

function passwordConfigured() {
  return !!process.env.ADMIN_PASSWORD;
}

function passwordMatches(candidate) {
  const want = sha256("pw|" + (process.env.ADMIN_PASSWORD || ""));
  const got = sha256("pw|" + String(candidate || ""));
  return passwordConfigured() && crypto.timingSafeEqual(Buffer.from(want), Buffer.from(got));
}

/** At most 8 failed attempts per 15 minutes per visitor (needs the database). */
async function tooManyAttempts(req) {
  if (!db.configured()) return false;
  const rows = await db.query(
    `SELECT count(*)::int AS n FROM login_attempts WHERE ip_hash = $1 AND ts > now() - interval '15 minutes'`,
    [ipHash(req)],
  );
  return rows[0].n >= 8;
}

async function recordFailure(req) {
  if (db.configured()) await db.query(`INSERT INTO login_attempts (ip_hash) VALUES ($1)`, [ipHash(req)]);
}

module.exports = { authorised, issueCookie, clearCookie, passwordConfigured, passwordMatches, tooManyAttempts, recordFailure };
