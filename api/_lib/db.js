/**
 * api/_lib/db.js — the one place that talks to Postgres.
 *
 * Production: Neon (Vercel Marketplace) over HTTPS via @neondatabase/serverless,
 * configured by the DATABASE_URL / POSTGRES_URL variable the integration adds.
 * Tests and local demos inject any `query(text, params) -> rows` function with
 * `useClient()` (scripts/test-admin.mjs uses PGlite, a real Postgres in WASM).
 *
 * No variable set => `configured()` is false and every caller degrades quietly:
 * tracking is dropped, the dashboard shows its setup checklist. Nothing that
 * matters to a visitor (form delivery, page loads) ever depends on this file.
 */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS pageviews (
    pvid text PRIMARY KEY,
    ts timestamptz NOT NULL DEFAULT now(),
    vid text NOT NULL,
    path text NOT NULL,
    title text,
    channel text NOT NULL DEFAULT 'Direct',
    source text,
    medium text,
    campaign text,
    ref_host text,
    country text,
    region text,
    city text,
    device text,
    browser text,
    os text,
    lang text,
    duration integer NOT NULL DEFAULT 0,
    scroll integer NOT NULL DEFAULT 0
  )`,
  `CREATE INDEX IF NOT EXISTS pageviews_ts_idx ON pageviews (ts)`,
  `CREATE INDEX IF NOT EXISTS pageviews_vid_ts_idx ON pageviews (vid, ts)`,
  `CREATE TABLE IF NOT EXISTS actions (
    id bigserial PRIMARY KEY,
    ts timestamptz NOT NULL DEFAULT now(),
    vid text NOT NULL,
    type text NOT NULL,
    label text,
    path text,
    channel text,
    country text,
    region text,
    city text,
    device text
  )`,
  `CREATE INDEX IF NOT EXISTS actions_ts_idx ON actions (ts)`,
  `CREATE TABLE IF NOT EXISTS leads (
    id bigserial PRIMARY KEY,
    ts timestamptz NOT NULL DEFAULT now(),
    vid text,
    form text,
    name text,
    email text,
    phone text,
    company text,
    message text,
    fields jsonb NOT NULL DEFAULT '{}'::jsonb,
    path text,
    channel text,
    country text,
    region text,
    city text,
    device text
  )`,
  `CREATE INDEX IF NOT EXISTS leads_ts_idx ON leads (ts)`,
  `CREATE TABLE IF NOT EXISTS login_attempts (
    id bigserial PRIMARY KEY,
    ts timestamptz NOT NULL DEFAULT now(),
    ip_hash text NOT NULL
  )`,
];

let client = null;
let schemaReady = null;

function connectionString() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

/** True when a database is available (an injected client counts). */
function configured() {
  return !!client || !!connectionString();
}

/** Inject a `query(text, params) -> Promise<row[]>` implementation (tests, demos). */
function useClient(fn) {
  client = fn;
  schemaReady = null;
}

function getClient() {
  if (client) return client;
  const url = connectionString();
  if (!url) throw new Error("No database configured");
  const { neon } = require("@neondatabase/serverless");
  const sql = neon(url);
  client = async (text, params) => sql.query(text, params || []);
  return client;
}

/** Run one parameterised statement and return its rows. */
async function query(text, params) {
  const run = getClient();
  if (!schemaReady) {
    schemaReady = (async () => {
      for (const statement of SCHEMA) await run(statement, []);
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
  return run(text, params || []);
}

module.exports = { configured, query, useClient };
