/** api/admin/stats.js — GET ?from=YYYY-MM-DD&to=YYYY-MM-DD -> every dashboard number (signed-in only). */
const auth = require("../_lib/auth");
const db = require("../_lib/db");
const h = require("../_lib/http");
const { parseRange, dashboard } = require("../_lib/stats");

module.exports = async function adminStats(req, res) {
  if (!auth.authorised(req)) return h.send(res, 401, { error: "Not signed in" });
  if (!db.configured()) return h.send(res, 200, { setup: { database: false } });
  try {
    const range = parseRange(req.query && req.query.from, req.query && req.query.to);
    return h.send(res, 200, await dashboard(range));
  } catch (err) {
    console.error("stats failed:", err && err.message);
    return h.send(res, 500, { error: "Could not load the numbers: " + (err && err.message) });
  }
};
