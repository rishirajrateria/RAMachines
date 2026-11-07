/* public/admin/dashboard.js — the /admin dashboard: sign-in, date range, and five tabs
 * (Overview · Leads · Locations · Calls & contact · Traffic & pages). Reads /api/admin/*. */
(function () {
  "use strict";
  var C = window.Charts, esc = C.esc, num = C.num;
  var $ = function (id) { return document.getElementById(id); };
  var ACTION = {
    phone_click: "Phone number tapped", phone_copy: "Phone number copied", whatsapp_click: "WhatsApp clicked",
    email_click: "Email clicked", email_copy: "Email copied", form_start: "Started a form",
  };
  var PRESETS = [
    ["today", "Today"], ["yesterday", "Yesterday"], ["7d", "Last 7 days"], ["30d", "Last 30 days"],
    ["month", "This month"], ["lastmonth", "Last month"], ["90d", "Last 90 days"],
  ];
  var state = { from: "", to: "", preset: "7d", tab: "overview", metric: "visitors", page: 1, q: "", form: "", data: null, leads: null };

  function presetRange(key) {
    var t = C.istToday();
    if (key === "today") return [t, t];
    if (key === "yesterday") return [C.addDays(t, -1), C.addDays(t, -1)];
    if (key === "7d") return [C.addDays(t, -6), t];
    if (key === "30d") return [C.addDays(t, -29), t];
    if (key === "90d") return [C.addDays(t, -89), t];
    if (key === "month") return [t.slice(0, 8) + "01", t];
    var first = t.slice(0, 8) + "01", lastPrev = C.addDays(first, -1);
    return [lastPrev.slice(0, 8) + "01", lastPrev];
  }

  function api(path) {
    return fetch(path, { credentials: "same-origin", cache: "no-store" }).then(function (r) {
      if (r.status === 401) { showLogin(); throw new Error("signed-out"); }
      return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || "Request failed"); return j; });
    });
  }
  function say(text, isErr) {
    var el = $("status");
    el.hidden = !text; el.textContent = text || ""; el.className = "status" + (isErr ? " err" : "");
  }

  /* ---------- sign-in ---------- */
  function showLogin() { $("app").hidden = true; $("login").hidden = false; $("password").focus(); }
  function showApp() { $("login").hidden = true; $("app").hidden = false; }

  $("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("login-error"); err.hidden = true;
    fetch("/api/admin/auth", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: $("password").value }) })
      .then(function (r) { return r.json().then(function (j) { return [r.ok, j]; }); })
      .then(function (res) {
        if (res[0]) { $("password").value = ""; showApp(); load(); return; }
        err.textContent = res[1].error || "Could not sign in."; err.hidden = false;
      })
      .catch(function () { err.textContent = "Network problem — try again."; err.hidden = false; });
  });
  $("logout").addEventListener("click", function () {
    fetch("/api/admin/auth", { method: "DELETE", credentials: "same-origin" }).then(showLogin);
  });
  $("refresh").addEventListener("click", function () { load(); });

  /* ---------- date range ---------- */
  function buildPresets() {
    $("presets").innerHTML = PRESETS.map(function (p) {
      return '<button class="chip" type="button" data-p="' + p[0] + '" aria-pressed="' + (state.preset === p[0]) + '">' + p[1] + "</button>";
    }).join("");
  }
  $("presets").addEventListener("click", function (e) {
    var key = e.target && e.target.getAttribute("data-p");
    if (!key) return;
    var r = presetRange(key);
    state.preset = key; state.from = r[0]; state.to = r[1]; state.page = 1; save(); load();
  });
  $("apply").addEventListener("click", function () {
    if (!$("from").value || !$("to").value) return say("Pick both dates.", true);
    state.preset = ""; state.from = $("from").value; state.to = $("to").value; state.page = 1; save(); load();
  });
  function save() { try { localStorage.setItem("ram_admin_range", JSON.stringify({ p: state.preset, f: state.from, t: state.to })); } catch (e) {} }
  function restore() {
    var r = presetRange("7d");
    try {
      var s = JSON.parse(localStorage.getItem("ram_admin_range") || "null");
      if (s && s.f && s.t) { state.preset = s.p; state.from = s.f; state.to = s.t; return; }
    } catch (e) {}
    state.from = r[0]; state.to = r[1];
  }

  /* ---------- tabs ---------- */
  $("tabs").addEventListener("click", function (e) {
    var tab = e.target && e.target.getAttribute("data-tab");
    if (!tab) return;
    state.tab = tab;
    [].forEach.call($("tabs").children, function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-tab") === tab)); });
    render();
  });

  /* ---------- loading ---------- */
  function qs(extra) {
    var p = "from=" + state.from + "&to=" + state.to;
    return p + (extra ? "&" + extra : "");
  }
  function load() {
    buildPresets();
    $("from").value = state.from; $("to").value = state.to;
    say("Loading…");
    var jobs = [api("/api/admin/stats?" + qs()).then(function (d) { state.data = d; })];
    jobs.push(loadLeads());
    return Promise.all(jobs).then(function () {
      say("");
      var d = state.data;
      $("setup").hidden = !(d && d.setup);
      if (d && d.setup) $("setup").innerHTML = setupHtml();
      $("live").querySelector("b").textContent = d && d.live != null ? d.live : 0;
      $("range-note").textContent = d && d.range
        ? C.dayLabel(d.range.from) + " – " + C.dayLabel(d.range.to) + " · compared with " + C.dayLabel(d.range.prevFrom) + " – " + C.dayLabel(d.range.prevTo)
        : "";
      render();
    }).catch(function (e) { if (e.message !== "signed-out") say(e.message, true); });
  }
  function loadLeads() {
    var extra = "page=" + state.page + (state.q ? "&q=" + encodeURIComponent(state.q) : "") + (state.form ? "&form=" + encodeURIComponent(state.form) : "");
    return api("/api/admin/leads?" + qs(extra)).then(function (l) { state.leads = l; });
  }

  function setupHtml() {
    return "<h2>Finish setup: connect the database</h2><p class=\"muted\">The dashboard is installed but nothing is being recorded yet.</p><ol>" +
      "<li>Vercel → your project → <b>Storage</b> → <b>Create Database</b> → <b>Neon (Postgres)</b> → connect it to this project. It adds <code>DATABASE_URL</code> automatically.</li>" +
      "<li>Vercel → <b>Settings → Environment Variables</b>: add <code>ADMIN_PASSWORD</code> (your sign-in password) and <code>ADMIN_SECRET</code> (any long random text).</li>" +
      "<li><b>Redeploy</b> the site. Visits and enquiries appear here within seconds.</li></ol>";
  }

  /* ---------- rendering ---------- */
  function delta(cur, prev, opts) {
    opts = opts || {};
    if (opts.rate) {
      var pp = (cur - prev) * 100;
      if (!isFinite(pp) || (!prev && !cur)) return '<span class="delta">—</span>';
      var good = opts.lowerBetter ? pp < 0 : pp > 0;
      return '<span class="delta ' + (Math.abs(pp) < 0.05 ? "" : good ? "up" : "down") + '">' + (pp > 0 ? "▲ " : "▼ ") + Math.abs(pp).toFixed(1) + " pts vs previous</span>";
    }
    if (!prev) return '<span class="delta">' + (cur ? "new this period" : "—") + "</span>";
    var ch = ((cur - prev) / prev) * 100;
    return '<span class="delta ' + (ch === 0 ? "" : ch > 0 ? "up" : "down") + '">' + (ch >= 0 ? "▲ " : "▼ ") + Math.abs(ch).toFixed(0) + "% vs previous</span>";
  }
  function kpi(label, value, deltaHtml) {
    return '<div class="kpi"><div class="label">' + esc(label) + '</div><div class="value num">' + value + "</div>" + deltaHtml + "</div>";
  }
  function card(title, body, note) {
    return '<section class="card"><header><h2>' + esc(title) + "</h2>" + (note ? '<span class="muted">' + esc(note) + "</span>" : "") + "</header>" + body + "</section>";
  }
  function place(r) {
    var city = r.city || r.k2, cc = r.country || r.k1;
    return (city ? city + ", " : "") + C.country(cc);
  }
  function table(head, rows) {
    if (!rows.length) return '<p class="empty">No data in this range yet.</p>';
    return '<div class="table-wrap"><table><thead><tr>' + head.map(function (h) { return '<th class="' + (h[1] ? "n" : "") + '">' + esc(h[0]) + "</th>"; }).join("") +
      "</tr></thead><tbody>" + rows.map(function (r) { return "<tr>" + r.map(function (c, i) { return '<td class="' + (head[i][1] ? "n" : "") + '">' + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
  }

  function seriesPoints(d) {
    var r = d.range, map = {};
    d.series.forEach(function (s) { map[s.b] = s; });
    var keys = [];
    if (r.unit === "hour") for (var h = 0; h < 24; h++) keys.push(r.from + "T" + (h < 10 ? "0" : "") + h + ":00");
    else if (r.unit === "day") for (var t = r.from; t <= r.to; t = C.addDays(t, 1)) keys.push(t + "T00:00");
    else d.series.forEach(function (s) { keys.push(s.b); });
    return keys.map(function (k) {
      var s = map[k] || {}, date = k.slice(0, 10);
      var label = r.unit === "hour" ? (parseInt(k.slice(11, 13), 10) % 12 || 12) + (parseInt(k.slice(11, 13), 10) < 12 ? "a" : "p") : C.dayLabel(date);
      return { label: label, tip: r.unit === "hour" ? C.dayLabel(date) + ", " + k.slice(11, 16) : r.unit === "week" ? "Week of " + C.dayLabel(date) : C.dayLabel(date), s: s };
    });
  }

  function renderOverview(d) {
    var k = d.kpis, p = d.previous, m = state.metric;
    var metrics = { visitors: ["Visitors", "visitors", "var(--c1)"], pageviews: ["Page views", "pageviews", "var(--c3)"], leads: ["Leads", "leads", "var(--c2)"], actions: ["Calls & contact clicks", "actions", "var(--c4)"] };
    var tabs = Object.keys(metrics).map(function (key) {
      return '<button class="chip" type="button" data-metric="' + key + '" aria-pressed="' + (m === key) + '">' + metrics[key][0] + "</button>";
    }).join("");
    var contacts = k.phone + k.whatsapp + k.email, pcontacts = p.phone + p.whatsapp + p.email;
    return '<div class="kpis">' +
      kpi("Visitors", num(k.visitors), delta(k.visitors, p.visitors)) +
      kpi("Page views", num(k.pageviews), delta(k.pageviews, p.pageviews)) +
      kpi("Sessions", num(k.sessions), delta(k.sessions, p.sessions)) +
      kpi("Bounce rate", C.pct(k.bounceRate), delta(k.bounceRate, p.bounceRate, { rate: true, lowerBetter: true })) +
      kpi("Avg. time on site", C.dur(k.avgDuration), delta(k.avgDuration, p.avgDuration)) +
      kpi("Leads", num(k.leads), delta(k.leads, p.leads)) +
      kpi("Calls & contact", num(contacts), delta(contacts, pcontacts)) +
      kpi("Lead conversion", C.pct(k.conversionRate, 2), delta(k.conversionRate, p.conversionRate, { rate: true })) +
      "</div>" +
      card("Trend", '<div class="metric-tabs" id="metric-tabs" style="margin-bottom:10px">' + tabs + '</div><div id="trend" class="chart"></div>', "India time") +
      '<div class="grid g2">' +
      card("Where visitors come from", C.bars(d.channels.map(function (r) { return { name: r.k1, value: r.sessions, sub: C.pct(r.sessions / (k.sessions || 1), 0) }; })), "sessions by channel") +
      card("Top pages", C.bars(d.pages.slice(0, 8).map(function (r) { return { name: r.path, value: r.views }; })), "page views") +
      card("Top countries", C.bars(d.countries.slice(0, 8).map(function (r) { return { name: C.flag(r.k1) + "  " + C.country(r.k1), value: r.visitors }; })), "visitors") +
      card("Devices", C.bars(d.devices.map(function (r) { return { name: r.k1, value: r.sessions, sub: C.pct(r.sessions / (k.sessions || 1), 0) }; })), "sessions") +
      "</div>";
  }

  function drawTrend(d) {
    var el = $("trend"); if (!el) return;
    var m = state.metric, pts = seriesPoints(d).map(function (p) { return { label: p.label, tip: p.tip, y: p.s[m] || 0 }; });
    var colors = { visitors: "var(--c1)", pageviews: "var(--c3)", leads: "var(--c2)", actions: "var(--c4)" };
    C.line(el, pts, { color: colors[m], unit: m === "actions" ? "contact clicks" : m, label: m + " over time" });
  }

  function renderLeads() {
    var l = state.leads || { rows: [], total: 0, forms: [], pageSize: 25 };
    var pages = Math.max(1, Math.ceil(l.total / l.pageSize));
    var opts = '<option value="">All forms</option>' + l.forms.map(function (f) { return '<option value="' + esc(f) + '"' + (f === state.form ? " selected" : "") + ">" + esc(f) + "</option>"; }).join("");
    var rows = l.rows.map(function (r, i) {
      var fields = r.fields || {}, extra = Object.keys(fields).map(function (key) { return "<dt>" + esc(key) + "</dt><dd>" + esc(fields[key]) + "</dd>"; }).join("");
      return '<tr class="lead-row" data-i="' + i + '"><td class="num">' + esc(C.istTime(r.ts)) + "</td><td><b>" + esc(r.name || "—") + "</b><br><span class=\"muted\">" + esc(r.company || "") + "</span></td>" +
        "<td>" + (r.phone ? '<a href="tel:' + esc(r.phone.replace(/[^\d+]/g, "")) + '">' + esc(r.phone) + "</a>" : "—") + "<br>" + (r.email ? '<a href="mailto:' + esc(r.email) + '">' + esc(r.email) + "</a>" : "") + "</td>" +
        '<td><span class="pill">' + esc(r.form || "Form") + "</span></td><td>" + esc(place(r)) + '</td><td class="muted">' + esc(r.channel || "") + "</td></tr>" +
        '<tr class="detail" id="detail-' + i + '" hidden><td colspan="6"><dl>' + extra + "<dt>Page</dt><dd>" + esc(r.path || "") + "</dd><dt>Device</dt><dd>" + esc(r.device || "") + "</dd></dl></td></tr>";
    }).join("");
    return card("Leads (" + num(l.total) + ")",
      '<div class="tools"><input type="search" id="lead-q" placeholder="Search name, phone, email, company, message…" value="' + esc(state.q) + '"><select id="lead-form">' + opts + '</select>' +
      '<a class="btn" href="/api/admin/leads?' + qs("format=csv" + (state.q ? "&q=" + encodeURIComponent(state.q) : "") + (state.form ? "&form=" + encodeURIComponent(state.form) : "")) + '">Download CSV</a></div>' +
      (l.rows.length ? '<div class="table-wrap"><table><thead><tr><th>When (IST)</th><th>Who</th><th>Contact</th><th>Form</th><th>Location</th><th>Source</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
        '<div class="pager"><span class="muted">Page ' + l.page + " of " + pages + '</span><button class="btn" id="prev"' + (l.page <= 1 ? " disabled" : "") + '>Previous</button><button class="btn" id="next"' + (l.page >= pages ? " disabled" : "") + ">Next</button></div>"
        : '<p class="empty">No leads in this range' + (state.q || state.form ? " matching your filter" : "") + ". Click a row to see everything the visitor sent.</p>"));
  }

  function renderPlaces(d) {
    return '<div class="grid g2">' +
      card("Countries", table([["Country"], ["Visitors", 1], ["Sessions", 1], ["Bounce", 1]], d.countries.map(function (r) { return [C.flag(r.k1) + " " + esc(C.country(r.k1)), num(r.visitors), num(r.sessions), C.pct(r.bounceRate, 0)]; }))) +
      card("Cities", table([["City"], ["Visitors", 1], ["Sessions", 1], ["Bounce", 1]], d.cities.map(function (r) { return [esc(r.k2 || "Unknown") + ' <span class="muted">' + esc(C.country(r.k1)) + "</span>", num(r.visitors), num(r.sessions), C.pct(r.bounceRate, 0)]; }))) +
      card("States / regions", table([["Region"], ["Visitors", 1], ["Sessions", 1]], d.regions.map(function (r) { return [esc(r.k2 || "Unknown") + ' <span class="muted">' + esc(C.country(r.k1)) + "</span>", num(r.visitors), num(r.sessions)]; }))) +
      card("Where leads come from", table([["Location"], ["Leads", 1]], d.leadPlaces.map(function (r) { return [esc(place(r)), num(r.n)]; }))) +
      "</div>";
  }

  function renderContact(d) {
    var k = d.kpis;
    return '<div class="kpis">' + kpi("Phone taps & copies", num(k.phone), delta(k.phone, d.previous.phone)) + kpi("WhatsApp clicks", num(k.whatsapp), delta(k.whatsapp, d.previous.whatsapp)) +
      kpi("Email clicks & copies", num(k.email), delta(k.email, d.previous.email)) + kpi("Leads from forms", num(k.leads), delta(k.leads, d.previous.leads)) + "</div>" +
      '<div class="grid g2">' +
      card("What people did", C.bars(d.actionTypes.map(function (r) { return { name: ACTION[r.type] || r.type, value: r.n, sub: num(r.people) + " people" }; }))) +
      card("Leads by form", C.bars(d.leadForms.map(function (r) { return { name: r.form, value: r.n }; }))) + "</div>" +
      card("Who contacted us, and from where", table([["Action"], ["Location"], ["Times", 1]], d.actionPlaces.map(function (r) { return [esc(ACTION[r.type] || r.type), esc(place(r)), num(r.n)]; })),
        "phone, WhatsApp, email");
  }

  function renderTraffic(d) {
    var srcRows = d.sources.map(function (r) { return [esc(r.k2 || "(direct)"), '<span class="pill">' + esc(r.k1) + "</span>", num(r.sessions), C.pct(r.bounceRate, 0), C.dur(r.avgDuration)]; });
    var pageRows = d.pages.map(function (r) { return [esc(r.path), num(r.views), num(r.visitors), C.dur(r.avg_time), r.avg_scroll ? r.avg_scroll + "%" : "—"]; });
    return card("Traffic sources", table([["Source"], ["Channel"], ["Sessions", 1], ["Bounce", 1], ["Avg time", 1]], srcRows), "who sent the visitor") +
      card("Pages", table([["Page"], ["Views", 1], ["Visitors", 1], ["Avg time", 1], ["Scrolled", 1]], pageRows)) +
      '<div class="grid g2">' +
      card("Landing pages", table([["First page seen"], ["Sessions", 1], ["Bounce", 1]], d.landing.map(function (r) { return [esc(r.k1), num(r.sessions), C.pct(r.bounceRate, 0)]; }))) +
      card("Busiest hours", C.heat(d.heatmap)) +
      card("Browsers", C.bars(d.browsers.map(function (r) { return { name: r.k1, value: r.sessions }; }))) +
      card("Operating systems", C.bars(d.os.map(function (r) { return { name: r.k1, value: r.sessions }; }))) + "</div>";
  }

  function render() {
    var d = state.data, v = $("view");
    if (!d) return;
    if (d.setup) { v.innerHTML = ""; return; }
    var html = { overview: renderOverview, leads: renderLeads, places: renderPlaces, contact: renderContact, traffic: renderTraffic }[state.tab](d);
    v.innerHTML = html;
    if (state.tab === "overview") drawTrend(d);
  }

  /* ---------- delegated events inside the view ---------- */
  $("view").addEventListener("click", function (e) {
    var t = e.target;
    var metric = t.getAttribute && t.getAttribute("data-metric");
    if (metric) { state.metric = metric; render(); return; }
    if (t.id === "prev" || t.id === "next") { state.page += t.id === "next" ? 1 : -1; loadLeads().then(render); return; }
    var row = t.closest && t.closest("tr.lead-row");
    if (row && !t.closest("a")) { var det = $("detail-" + row.getAttribute("data-i")); if (det) det.hidden = !det.hidden; }
  });
  var searchTimer = 0;
  $("view").addEventListener("input", function (e) {
    if (e.target.id !== "lead-q") return;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.q = e.target.value.trim(); state.page = 1;
      loadLeads().then(function () { render(); var q = $("lead-q"); q.focus(); q.setSelectionRange(q.value.length, q.value.length); });
    }, 350);
  });
  $("view").addEventListener("change", function (e) {
    if (e.target.id === "lead-form") { state.form = e.target.value; state.page = 1; loadLeads().then(render); }
  });
  var resizeTimer = 0;
  window.addEventListener("resize", function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { if (state.tab === "overview" && state.data && !state.data.setup) drawTrend(state.data); }, 150); });

  /* ---------- start ---------- */
  restore();
  fetch("/api/admin/auth", { credentials: "same-origin", cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (s) {
      if (!s.passwordConfigured) {
        $("login-note").textContent = "No admin password is set yet. In Vercel → Settings → Environment Variables, add ADMIN_PASSWORD, then redeploy.";
      }
      if (s.authenticated) { showApp(); load(); } else showLogin();
    })
    .catch(function () { showLogin(); $("login-error").textContent = "The admin service is not reachable."; $("login-error").hidden = false; });
})();
