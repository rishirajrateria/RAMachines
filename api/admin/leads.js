/**
 * api/admin/leads.js — GET ?from&to&q&form&page[&format=csv] (signed-in only).
 * JSON: { total, page, pageSize, forms, rows }. CSV: every matching lead (max 5000) as a download.
 */
const auth = require("../_lib/auth");
const db = require("../_lib/db");
const h = require("../_lib/http");
const { parseRange, RANGE } = require("../_lib/stats");

const PAGE = 25;
const COLUMNS = ["ts", "form", "name", "phone", "email", "company", "message", "country", "region", "city", "channel", "device", "path"];

const csvCell = (value) => {
  let text = value == null ? "" : String(value instanceof Date ? value.toISOString() : value);
  if (/^[=@\t\r]/.test(text) || /^[+-][^\d\s(]/.test(text)) text = "'" + text; // neutralise spreadsheet formulas
  return `"${text.replace(/"/g, '""')}"`;
};

module.exports = async function adminLeads(req, res) {
  if (!auth.authorised(req)) return h.send(res, 401, { error: "Not signed in" });
  if (!db.configured()) return h.send(res, 200, { setup: { database: false }, rows: [], total: 0 });
  try {
    const query = req.query || {};
    const range = parseRange(query.from, query.to);
    const where = [RANGE];
    const params = [range.from, range.to];
    if (query.form) {
      params.push(String(query.form));
      where.push(`form = $${params.length}`);
    }
    if (query.q) {
      params.push("%" + String(query.q).slice(0, 80).replace(/[%_\\]/g, "\\$&") + "%");
      const n = params.length;
      where.push(`(name ILIKE $${n} OR email ILIKE $${n} OR phone ILIKE $${n} OR company ILIKE $${n} OR message ILIKE $${n} OR city ILIKE $${n})`);
    }
    const clause = where.join(" AND ");

    if (query.format === "csv") {
      const rows = await db.query(`SELECT ${COLUMNS.join(", ")} FROM leads WHERE ${clause} ORDER BY ts DESC LIMIT 5000`, params);
      const lines = [COLUMNS.join(","), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(","))];
      res.statusCode = 200;
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="ra-machine-leads-${range.from}-to-${range.to}.csv"`);
      return res.end(lines.join("\r\n"));
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const [total, rows, forms] = await Promise.all([
      db.query(`SELECT count(*)::int AS n FROM leads WHERE ${clause}`, params),
      db.query(`SELECT id, ts, form, name, email, phone, company, message, fields, path, channel, country, region, city, device
                FROM leads WHERE ${clause} ORDER BY ts DESC LIMIT ${PAGE} OFFSET ${(page - 1) * PAGE}`, params),
      db.query(`SELECT DISTINCT form FROM leads WHERE form IS NOT NULL ORDER BY form`, []),
    ]);
    return h.send(res, 200, { total: total[0].n, page, pageSize: PAGE, forms: forms.map((f) => f.form), rows });
  } catch (err) {
    console.error("leads failed:", err && err.message);
    return h.send(res, 500, { error: "Could not load leads." });
  }
};
