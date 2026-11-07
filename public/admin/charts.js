/* public/admin/charts.js — tiny dependency-free helpers for the admin dashboard: escaping, number
 * formatting, IST dates, bar lists, a hover line chart and the day×hour heat map. */
(function () {
  "use strict";
  var nf = new Intl.NumberFormat("en-IN");
  var SVGNS = "http://www.w3.org/2000/svg";

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function num(n) { return nf.format(Math.round(n || 0)); }
  function pct(r, d) { return ((r || 0) * 100).toFixed(d == null ? 1 : d) + "%"; }
  function dur(s) {
    s = Math.round(s || 0);
    return s >= 60 ? Math.floor(s / 60) + "m " + (s % 60) + "s" : s + "s";
  }
  function istToday() { return new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10); }
  function addDays(iso, n) { return new Date(Date.parse(iso) + n * 86400000).toISOString().slice(0, 10); }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function dayLabel(iso) { return parseInt(iso.slice(8, 10), 10) + " " + MONTHS[parseInt(iso.slice(5, 7), 10) - 1]; }
  function istTime(ts) {
    return new Date(ts).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true });
  }
  var regionNames = null;
  try { regionNames = new Intl.DisplayNames(["en"], { type: "region" }); } catch (e) {}
  function country(code) {
    if (!code) return "Unknown";
    try { return (regionNames && regionNames.of(code)) || code; } catch (e) { return code; }
  }
  function flag(code) {
    if (!code || code.length !== 2) return "🌐";
    return String.fromCodePoint.apply(null, code.toUpperCase().split("").map(function (c) { return 127397 + c.charCodeAt(0); }));
  }

  /** rows: [{name, value, sub?, href?}] -> <ul class="bars"> */
  function bars(rows, fmt) {
    if (!rows.length) return '<p class="empty">No data in this range yet.</p>';
    var max = Math.max.apply(null, rows.map(function (r) { return r.value; })) || 1;
    return '<ul class="bars">' + rows.map(function (r) {
      return '<li><span class="name" title="' + esc(r.name) + '">' + esc(r.name) + (r.sub ? '<span class="sub">' + esc(r.sub) + "</span>" : "") +
        '</span><span class="val">' + (fmt ? fmt(r.value) : num(r.value)) + '</span><span class="track"><span class="fill" style="width:' +
        Math.max(2, (r.value / max) * 100).toFixed(1) + '%;background:' + (r.color || "var(--teal)") + '"></span></span></li>';
    }).join("") + "</ul>";
  }

  /**
   * Line chart with area fill and hover tooltip.
   * points: [{label, tip, y}] ; opts: {color}
   */
  function line(container, points, opts) {
    opts = opts || {};
    container.innerHTML = "";
    var W = Math.max(container.clientWidth || 640, 280), H = 260;
    var L = 38, R = 10, T = 14, B = 26;
    var max = Math.max.apply(null, points.map(function (p) { return p.y; }).concat([1]));
    var step = Math.pow(10, Math.floor(Math.log10(max)));
    var top = Math.ceil(max / step) * step;
    if (top / step < 2) top = step * 2;
    var x = function (i) { return L + (points.length === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (points.length - 1)); };
    var y = function (v) { return T + (1 - v / top) * (H - T - B); };
    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", opts.label || "Trend chart");
    var html = "";
    for (var g = 0; g <= 4; g++) {
      var gv = (top / 4) * g, gy = y(gv);
      html += '<line class="grid-line" x1="' + L + '" x2="' + (W - R) + '" y1="' + gy + '" y2="' + gy + '"/><text class="axis" x="' + (L - 6) + '" y="' + (gy + 4) + '" text-anchor="end">' + num(gv) + "</text>";
    }
    var every = Math.ceil(points.length / Math.max(2, Math.floor((W - L) / 70)));
    points.forEach(function (p, i) {
      if (i % every === 0) html += '<text class="axis" x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(p.label) + "</text>";
    });
    var color = opts.color || "var(--c1)";
    var path = points.map(function (p, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.y).toFixed(1); }).join(" ");
    html += '<path d="' + path + " L" + x(points.length - 1).toFixed(1) + " " + y(0) + " L" + x(0).toFixed(1) + " " + y(0) + ' Z" fill="' + color + '" opacity=".13"/>';
    html += '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
    if (points.length <= 45) points.forEach(function (p, i) { html += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.y).toFixed(1) + '" r="3" fill="' + color + '"/>'; });
    html += '<line id="cursor" class="grid-line" y1="' + T + '" y2="' + (H - B) + '" stroke-dasharray="3 3" style="display:none"/>';
    svg.innerHTML = html;
    container.appendChild(svg);
    var tip = document.createElement("div");
    tip.className = "tip";
    tip.style.display = "none";
    container.appendChild(tip);
    var cursor = svg.querySelector("#cursor");
    function move(ev) {
      var box = svg.getBoundingClientRect();
      var px = ((ev.clientX - box.left) / box.width) * W;
      var i = Math.max(0, Math.min(points.length - 1, Math.round(((px - L) / (W - L - R)) * (points.length - 1)) || 0));
      var p = points[i];
      cursor.setAttribute("x1", x(i)); cursor.setAttribute("x2", x(i)); cursor.style.display = "";
      tip.innerHTML = "<b>" + esc(p.tip || p.label) + "</b><br>" + num(p.y) + " " + esc(opts.unit || "");
      tip.style.left = (x(i) / W) * box.width + "px";
      tip.style.top = (y(p.y) / H) * box.height + "px";
      tip.style.display = "";
    }
    svg.addEventListener("mousemove", move);
    svg.addEventListener("touchmove", function (e) { if (e.touches[0]) move(e.touches[0]); }, { passive: true });
    svg.addEventListener("mouseleave", function () { tip.style.display = "none"; cursor.style.display = "none"; });
  }

  /** rows: [{d: 1-7 (Mon-Sun), h: 0-23, n}] */
  function heat(rows) {
    var grid = {}, max = 0;
    rows.forEach(function (r) { grid[r.d + "-" + r.h] = r.n; if (r.n > max) max = r.n; });
    if (!max) return '<p class="empty">No data in this range yet.</p>';
    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], out = '<div class="heat"><span></span>';
    for (var h = 0; h < 24; h++) out += '<span class="lab" style="text-align:center">' + (h % 3 === 0 ? h : "") + "</span>";
    days.forEach(function (name, di) {
      out += '<span class="lab">' + name + "</span>";
      for (var h2 = 0; h2 < 24; h2++) {
        var n = grid[di + 1 + "-" + h2] || 0;
        out += '<span class="cell" title="' + name + " " + h2 + ":00 — " + n + ' views" style="opacity:' + (n ? 0.15 + (n / max) * 0.85 : 0.06).toFixed(2) + '"></span>';
      }
    });
    return out + "</div><p class=\"muted\" style=\"font-size:12px;margin:8px 0 0\">Hour of day in IST. Darker = more page views.</p>";
  }

  window.Charts = { esc: esc, num: num, pct: pct, dur: dur, istToday: istToday, addDays: addDays, dayLabel: dayLabel, istTime: istTime, country: country, flag: flag, bars: bars, line: line, heat: heat };
})();
