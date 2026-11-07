/**
 * api/_lib/stats.js — every number on the dashboard, computed in Postgres.
 *
 * Dates are calendar days in India (Asia/Kolkata), inclusive: from=2026-11-01,
 * to=2026-11-07 is seven whole IST days. A "session" is one visitor's run of
 * page views with no gap over 30 minutes; it is "engaged" (not a bounce) if it
 * had 2+ pages, 10+ seconds on the page, a contact action or a lead — the
 * same rule Google Analytics 4 uses.
 */
const db = require("./db");

const TZ = "Asia/Kolkata";
const RANGE = `ts >= ($1::date)::timestamp AT TIME ZONE '${TZ}' AND ts < (($2::date + 1))::timestamp AT TIME ZONE '${TZ}'`;

const DAY = 86400000;
const toISO = (ms) => new Date(ms).toISOString().slice(0, 10);

/** Validate ?from&to (default: last 7 days incl. today), clamp to 400 days. */
function parseRange(from, to) {
  const ok = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v || "") && !Number.isNaN(Date.parse(v));
  const todayIST = toISO(Date.now() + 5.5 * 3600000);
  let end = ok(to) ? to : todayIST;
  let start = ok(from) ? from : toISO(Date.parse(end) - 6 * DAY);
  if (start > end) [start, end] = [end, start];
  if (Date.parse(end) - Date.parse(start) > 400 * DAY) start = toISO(Date.parse(end) - 400 * DAY);
  const days = Math.round((Date.parse(end) - Date.parse(start)) / DAY) + 1;
  const prevEnd = toISO(Date.parse(start) - DAY);
  const prevStart = toISO(Date.parse(start) - days * DAY);
  const unit = days === 1 ? "hour" : days > 92 ? "week" : "day";
  return { from: start, to: end, days, prevFrom: prevStart, prevTo: prevEnd, unit };
}

/** Sessions built from page views, with the engaged flag. Uses $1/$2. */
const SESSIONS = `
  pv AS (
    SELECT vid, ts, duration, channel, source, country, region, city, device, browser, os, path
    FROM pageviews WHERE ${RANGE}
  ),
  flagged AS (
    SELECT *, CASE WHEN lag(ts) OVER w IS NULL OR ts - lag(ts) OVER w > interval '30 minutes' THEN 1 ELSE 0 END AS ns
    FROM pv WINDOW w AS (PARTITION BY vid ORDER BY ts)
  ),
  numbered AS (SELECT *, sum(ns) OVER (PARTITION BY vid ORDER BY ts ROWS UNBOUNDED PRECEDING) AS sn FROM flagged),
  raw AS (
    SELECT vid, sn, min(ts) AS started, count(*)::int AS pages, coalesce(sum(duration), 0)::int AS dur,
      (array_agg(channel ORDER BY ts))[1] AS channel, (array_agg(source ORDER BY ts))[1] AS source,
      (array_agg(country ORDER BY ts))[1] AS country, (array_agg(region ORDER BY ts))[1] AS region,
      (array_agg(city ORDER BY ts))[1] AS city, (array_agg(device ORDER BY ts))[1] AS device,
      (array_agg(browser ORDER BY ts))[1] AS browser, (array_agg(os ORDER BY ts))[1] AS os,
      (array_agg(path ORDER BY ts))[1] AS landing
    FROM numbered GROUP BY vid, sn
  ),
  sess AS (
    SELECT r.*, (r.pages >= 2 OR r.dur >= 10
      OR EXISTS (SELECT 1 FROM actions a WHERE a.vid = r.vid AND a.ts >= r.started AND a.ts < r.started + interval '30 minutes')
      OR EXISTS (SELECT 1 FROM leads l WHERE l.vid = r.vid AND l.ts >= r.started AND l.ts < r.started + interval '30 minutes')
    ) AS engaged FROM raw r
  )`;

const AGG = `count(*)::int AS sessions, count(DISTINCT vid)::int AS visitors, sum(pages)::int AS pageviews,
  sum(CASE WHEN engaged THEN 0 ELSE 1 END)::int AS bounces, coalesce(sum(dur), 0)::int AS dur`;

const DIMS = [
  ["total", "NULL", "NULL"], ["channel", "channel", "NULL"], ["source", "channel", "source"],
  ["country", "country", "NULL"], ["city", "country", "city"], ["region", "country", "region"],
  ["device", "device", "NULL"], ["browser", "browser", "NULL"], ["os", "os", "NULL"], ["landing", "landing", "NULL"],
];

/** One round trip: every session-based breakdown. */
async function sessionBreakdowns(from, to, onlyTotal) {
  const dims = onlyTotal ? DIMS.slice(0, 1) : DIMS;
  const union = dims
    .map(([dim, k1, k2]) => `SELECT '${dim}' AS dim, ${k1}::text AS k1, ${k2}::text AS k2, ${AGG} FROM sess ${dim === "total" ? "" : `GROUP BY ${k1}${k2 === "NULL" ? "" : ", " + k2}`}`)
    .join(" UNION ALL ");
  return db.query(`WITH ${SESSIONS} ${union}`, [from, to]);
}

async function counts(from, to) {
  const [leads, actions] = await Promise.all([
    db.query(`SELECT count(*)::int AS n FROM leads WHERE ${RANGE}`, [from, to]),
    db.query(`SELECT count(*) FILTER (WHERE type IN ('phone_click','phone_copy'))::int AS phone,
                     count(*) FILTER (WHERE type = 'whatsapp_click')::int AS whatsapp,
                     count(*) FILTER (WHERE type IN ('email_click','email_copy'))::int AS email
              FROM actions WHERE ${RANGE}`, [from, to]),
  ]);
  return { leads: leads[0].n, phone: actions[0].phone, whatsapp: actions[0].whatsapp, email: actions[0].email };
}

function totals(rows, extra) {
  const t = rows.find((r) => r.dim === "total") || { sessions: 0, visitors: 0, pageviews: 0, bounces: 0, dur: 0 };
  return {
    visitors: t.visitors, sessions: t.sessions, pageviews: t.pageviews,
    bounceRate: t.sessions ? t.bounces / t.sessions : 0,
    avgDuration: t.sessions ? Math.round(t.dur / t.sessions) : 0,
    pagesPerSession: t.sessions ? t.pageviews / t.sessions : 0,
    ...extra,
    conversionRate: t.sessions ? extra.leads / t.sessions : 0,
  };
}

const rowsOf = (rows, dim) => rows.filter((r) => r.dim === dim).sort((a, b) => b.sessions - a.sessions);

async function dashboard(range) {
  const { from, to, prevFrom, prevTo, unit } = range;
  const bucket = `date_trunc('${unit}', ts AT TIME ZONE '${TZ}')`;
  const [cur, prev, curCounts, prevCounts, series, leadSeries, actionSeries, pages, actionTypes, actionPlaces,
    leadForms, leadPlaces, live, heat] = await Promise.all([
    sessionBreakdowns(from, to), sessionBreakdowns(prevFrom, prevTo, true), counts(from, to), counts(prevFrom, prevTo),
    db.query(`SELECT to_char(${bucket}, 'YYYY-MM-DD"T"HH24:MI') AS b, count(*)::int AS pageviews, count(DISTINCT vid)::int AS visitors
              FROM pageviews WHERE ${RANGE} GROUP BY 1 ORDER BY 1`, [from, to]),
    db.query(`SELECT to_char(${bucket}, 'YYYY-MM-DD"T"HH24:MI') AS b, count(*)::int AS n FROM leads WHERE ${RANGE} GROUP BY 1`, [from, to]),
    db.query(`SELECT to_char(${bucket}, 'YYYY-MM-DD"T"HH24:MI') AS b, count(*)::int AS n FROM actions
              WHERE ${RANGE} AND type IN ('phone_click','phone_copy','whatsapp_click','email_click','email_copy') GROUP BY 1`, [from, to]),
    db.query(`SELECT path, count(*)::int AS views, count(DISTINCT vid)::int AS visitors,
                     coalesce(round(avg(NULLIF(duration, 0))), 0)::int AS avg_time, coalesce(round(avg(NULLIF(scroll, 0))), 0)::int AS avg_scroll
              FROM pageviews WHERE ${RANGE} GROUP BY path ORDER BY views DESC LIMIT 20`, [from, to]),
    db.query(`SELECT type, count(*)::int AS n, count(DISTINCT vid)::int AS people FROM actions WHERE ${RANGE} GROUP BY type ORDER BY n DESC`, [from, to]),
    db.query(`SELECT type, country, city, count(*)::int AS n FROM actions
              WHERE ${RANGE} AND type <> 'form_start' GROUP BY type, country, city ORDER BY n DESC LIMIT 40`, [from, to]),
    db.query(`SELECT coalesce(form, 'Form') AS form, count(*)::int AS n FROM leads WHERE ${RANGE} GROUP BY 1 ORDER BY n DESC`, [from, to]),
    db.query(`SELECT country, city, count(*)::int AS n FROM leads WHERE ${RANGE} GROUP BY 1, 2 ORDER BY n DESC LIMIT 20`, [from, to]),
    db.query(`SELECT count(DISTINCT vid)::int AS n FROM pageviews WHERE ts > now() - interval '5 minutes'`, []),
    db.query(`SELECT extract(isodow FROM ts AT TIME ZONE '${TZ}')::int AS d, extract(hour FROM ts AT TIME ZONE '${TZ}')::int AS h, count(*)::int AS n
              FROM pageviews WHERE ${RANGE} GROUP BY 1, 2`, [from, to]),
  ]);

  const merge = {};
  for (const r of series) merge[r.b] = { b: r.b, pageviews: r.pageviews, visitors: r.visitors, leads: 0, actions: 0 };
  for (const r of leadSeries) (merge[r.b] = merge[r.b] || { b: r.b, pageviews: 0, visitors: 0, leads: 0, actions: 0 }).leads = r.n;
  for (const r of actionSeries) (merge[r.b] = merge[r.b] || { b: r.b, pageviews: 0, visitors: 0, leads: 0, actions: 0 }).actions = r.n;

  const withRates = (r) => ({ ...r, bounceRate: r.sessions ? r.bounces / r.sessions : 0, avgDuration: r.sessions ? Math.round(r.dur / r.sessions) : 0 });
  const dim = (name, limit) => rowsOf(cur, name).slice(0, limit).map(withRates);

  return {
    range,
    kpis: totals(cur, curCounts),
    previous: totals(prev, prevCounts),
    live: live[0].n,
    series: Object.values(merge).sort((a, b) => (a.b < b.b ? -1 : 1)),
    channels: dim("channel", 10),
    sources: dim("source", 15),
    countries: dim("country", 25),
    cities: dim("city", 25),
    regions: dim("region", 25),
    devices: dim("device", 5),
    browsers: dim("browser", 8),
    os: dim("os", 8),
    landing: dim("landing", 10),
    pages,
    actionTypes,
    actionPlaces,
    leadForms,
    leadPlaces,
    heatmap: heat,
  };
}

module.exports = { parseRange, dashboard, RANGE };
