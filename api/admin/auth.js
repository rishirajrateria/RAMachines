/**
 * api/admin/auth.js — dashboard sign-in.
 *   GET    -> { authenticated, passwordConfigured, databaseConfigured }
 *   POST   { password } -> sets the session cookie (8 wrong guesses / 15 min locks you out)
 *   DELETE -> signs out
 */
const auth = require("../_lib/auth");
const db = require("../_lib/db");
const h = require("../_lib/http");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = async function adminAuth(req, res) {
  try {
    if (req.method === "GET") {
      return h.send(res, 200, {
        authenticated: auth.authorised(req),
        passwordConfigured: auth.passwordConfigured(),
        databaseConfigured: db.configured(),
      });
    }
    if (req.method === "DELETE") return h.send(res, 200, { ok: true }, { "Set-Cookie": auth.clearCookie() });
    if (req.method !== "POST") return h.send(res, 405, { error: "Method not allowed" });

    if (!h.originAllowed(req)) return h.send(res, 403, { error: "Forbidden" });
    if (!auth.passwordConfigured()) return h.send(res, 503, { error: "ADMIN_PASSWORD is not set in Vercel yet." });
    if (await auth.tooManyAttempts(req)) return h.send(res, 429, { error: "Too many attempts. Try again in 15 minutes." });

    const body = await h.readBody(req);
    if (auth.passwordMatches(body.password)) return h.send(res, 200, { ok: true }, { "Set-Cookie": auth.issueCookie() });

    await auth.recordFailure(req).catch(() => {});
    await sleep(700);
    return h.send(res, 401, { error: "Wrong password." });
  } catch (err) {
    console.error("auth failed:", err && err.message);
    return h.send(res, 500, { error: "Something went wrong." });
  }
};
