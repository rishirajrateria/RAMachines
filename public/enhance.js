/*!
 * public/enhance.js — ADR-0010: the entire client-side runtime for RA Machine.
 *
 * The site is a static export whose HTML is final; React is a build-time tool
 * only and is stripped from the output by scripts/dehydrate.mjs. Everything the
 * pages do in the browser lives in this one file.
 *
 * Contract with the markup (all of it server-rendered, both states present):
 *   .reveal                    -> gets .is-in once scrolled into view
 *   [data-stagger]             -> CSS handles the per-sibling delay
 *   [data-countup]             -> text content animates 0 -> its final value
 *   .glass-sheen               -> --mx/--my track the mouse
 *   #scroll-sentinel           -> .header-pill gets .is-scrolled when it leaves
 *   [data-navtoggle]           -> toggles .is-open on .mobilenav-panel/-backdrop
 *   [data-herovideo]           -> <template> inside is mounted when near view
 *   [data-map]                 -> button swaps in the <template>'d iframe
 *   [data-cert]                -> opens <dialog id="cert-dialog">, shows [data-cert-panel]
 *   [data-filter]              -> toggles [hidden] on [data-category] cards
 *
 * No feature here is required for the page to work — see ADR-0010 "Consequences".
 */
(function () {
  "use strict";

  // Tell the stylesheet JS is alive. `window.__enh` is the signal the inline
  // bootstrap in <head> waits for; if this file never loads it removes the
  // `js` class again so `.reveal` content can't be left invisible.
  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");
  window.__enh = true;

  var reduceMotion = false;
  try {
    reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  var conn = navigator.connection || {};
  var saveData = !!conn.saveData;
  var slowNet = /^(slow-2g|2g|3g)$/.test(conn.effectiveType || "");

  function each(sel, fn, ctx) {
    var nodes = (ctx || doc).querySelectorAll(sel);
    for (var i = 0; i < nodes.length; i++) fn(nodes[i], i);
  }

  /* ---------------------------------------------------------------- observer
   * One IntersectionObserver for every scroll-triggered effect on the page
   * (ADR-0009 §3 kept this property; it just isn't React any more). An element
   * already on screen fires synchronously, with no observer round-trip.
   */
  var registry = new Map();
  var io = null;

  function onEntries(entries) {
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (!entry.isIntersecting && entry.boundingClientRect.top >= innerHeight) continue;
      var cb = registry.get(entry.target);
      if (!cb) continue;
      registry.delete(entry.target);
      io.unobserve(entry.target);
      cb(entry.target);
    }
  }

  function observeOnce(el, cb) {
    var rect = el.getBoundingClientRect();
    if (rect.top < innerHeight && rect.bottom > 0) return cb(el);
    if (typeof IntersectionObserver === "undefined") return cb(el);
    if (!io) io = new IntersectionObserver(onEntries, { threshold: 0, rootMargin: "120px" });
    registry.set(el, cb);
    io.observe(el);
  }

  /* ------------------------------------------------------------------ reveal
   * Browsers with scroll-driven CSS animations (animation-timeline: view())
   * already reveal in pure CSS — globals.css hides this JS path from them, so
   * don't spend an observer per element there.
   */
  var cssReveal = CSS && CSS.supports && CSS.supports("animation-timeline: view()");
  if (!cssReveal && !reduceMotion) {
    each(".reveal", function (el) {
      observeOnce(el, function (node) {
        node.classList.add("is-in");
      });
    });
  }

  /* ----------------------------------------------------------------- countup
   * The final value is already the element's text, so this only ever replaces
   * it briefly — a no-JS or reduced-motion visitor sees the real number.
   */
  if (!reduceMotion && !saveData) {
    each("[data-countup]", function (el) {
      var final = el.textContent.trim();
      var match = /^(\d[\d,]*)(\D*)$/.exec(final);
      if (!match) return;
      var target = parseInt(match[1].replace(/,/g, ""), 10);
      var suffix = match[2] || "";
      if (!isFinite(target)) return;

      observeOnce(el, function (node) {
        var start = performance.now();
        node.textContent = "0" + suffix;
        (function tick(now) {
          var p = Math.min((now - start) / 900, 1);
          node.textContent = Math.round(target * p).toLocaleString("en-US") + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else node.textContent = final;
        })(start);
      });
    });
  }

  /* ------------------------------------------------------------------- sheen
   * One delegated pointermove for every card on the page. Mouse only.
   */
  doc.addEventListener(
    "pointermove",
    function (e) {
      if (e.pointerType !== "mouse") return;
      var card = e.target && e.target.closest && e.target.closest(".glass-sheen");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    },
    { passive: true }
  );

  /* ------------------------------------------------------------------ header
   * `.is-scrolled` == "the 24px sentinel at the top of the page has left the
   * viewport". Fires once per crossing instead of on every scroll frame.
   */
  var sentinel = doc.getElementById("scroll-sentinel");
  var pill = doc.querySelector(".header-pill");
  if (pill) {
    var setPill = function (scrolled) {
      pill.classList.toggle("is-scrolled", scrolled);
      pill.classList.toggle("h-[50px]", scrolled);
      pill.classList.toggle("h-14", !scrolled);
    };
    if (sentinel && typeof IntersectionObserver !== "undefined") {
      new IntersectionObserver(
        function (entries) {
          setPill(!entries[0].isIntersecting);
        },
        { threshold: 0 }
      ).observe(sentinel);
    } else {
      addEventListener("scroll", function () {
        setPill(scrollY > 24);
      }, { passive: true });
    }
  }

  /* --------------------------------------------------------------- mobile nav
   * Both states are in the DOM; this toggles classes and `inert`. The CSS
   * `:target` fallback (globals.css) covers the no-JS case, so the toggle is a
   * real <a href="#mobile-nav-panel"> upgraded to a button here.
   */
  var navToggle = doc.querySelector("[data-navtoggle]");
  var navPanel = doc.getElementById("mobile-nav-panel");
  var navBackdrop = doc.querySelector(".mobilenav-backdrop");
  if (navToggle && navPanel) {
    var navOpen = false;
    var setNav = function (open) {
      navOpen = open;
      navPanel.classList.toggle("is-open", open);
      if (navBackdrop) navBackdrop.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) navPanel.removeAttribute("inert");
      else navPanel.setAttribute("inert", "");
      each("[data-navicon]", function (icon) {
        icon.hidden = icon.getAttribute("data-navicon") !== (open ? "close" : "open");
      }, navToggle);
    };
    setNav(false);
    navToggle.addEventListener("click", function (e) {
      e.preventDefault();
      setNav(!navOpen);
    });
    if (navBackdrop) navBackdrop.addEventListener("click", function () { setNav(false); });
    each("a", function (a) { a.addEventListener("click", function () { setNav(false); }); }, navPanel);
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navOpen) setNav(false);
    });
  }

  /* ------------------------------------------------------------- hero video
   * The poster is the LCP element and is already painted. The clip is only
   * mounted when it's near the viewport, and never on a constrained connection.
   */
  if (!reduceMotion && !saveData && !slowNet) {
    each("[data-herovideo]", function (host) {
      var tpl = host.querySelector("template");
      if (!tpl) return;
      observeOnce(host, function () {
        host.appendChild(tpl.content.cloneNode(true));
        var v = host.querySelector("video");
        if (v && v.play) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      });
    });
  }

  /* -------------------------------------------------------------------- map
   * Click-to-load: the heavy Google Maps iframe never loads unless asked for.
   */
  each("[data-map]", function (host) {
    var btn = host.querySelector("[data-map-load]");
    var tpl = host.querySelector("template");
    if (!btn || !tpl) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var frame = tpl.content.cloneNode(true);
      host.replaceChildren(frame);
    });
  });

  /* ------------------------------------------------------- certificate modal
   * Every panel is pre-rendered inside a closed <dialog> (so its images, being
   * display:none + lazy, are never fetched until opened).
   */
  var certDialog = doc.getElementById("cert-dialog");
  if (certDialog && certDialog.showModal) {
    var showPanel = function (slug) {
      each("[data-cert-panel]", function (panel) {
        panel.hidden = panel.getAttribute("data-cert-panel") !== slug;
      }, certDialog);
    };
    each("[data-cert]", function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        showPanel(btn.getAttribute("data-cert"));
        certDialog.showModal();
      });
    });
    each("[data-cert-close]", function (btn) {
      btn.addEventListener("click", function () { certDialog.close(); });
    }, certDialog);
    // Click on the backdrop (the dialog element itself) closes it.
    certDialog.addEventListener("click", function (e) {
      if (e.target === certDialog) certDialog.close();
    });
  }

  /* ---------------------------------------------------------- product filter
   * Chips are real links to the category pages without JS; here they filter in
   * place instead. Because that changes what they ARE, promote them from link
   * to button semantics at the same moment we take the clicks over —
   * `aria-pressed` is not valid on a link, and a screen reader should not be
   * told "link" for a control that no longer navigates.
   */
  var chips = doc.querySelectorAll("[data-filter]");
  if (chips.length) {
    each("[data-filter]", function (chip, i) {
      chip.setAttribute("role", "button");
      chip.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    });
    var activeClasses = ["!border-teal", "!bg-teal", "!text-white", "[&_svg]:!text-white"];
    var idleClasses = ["border-transparent", "hover:!border-teal", "hover:!text-teal-hover"];
    var setFilter = function (slug) {
      each("[data-category]", function (card) {
        card.hidden = slug !== "all" && card.getAttribute("data-category") !== slug;
      });
      each("[data-filter]", function (chip) {
        var on = chip.getAttribute("data-filter") === slug;
        chip.setAttribute("aria-pressed", on ? "true" : "false");
        chip.classList.toggle("is-active", on);
        activeClasses.forEach(function (c) { chip.classList.toggle(c, on); });
        idleClasses.forEach(function (c) { chip.classList.toggle(c, !on); });
      });
    };
    each("[data-filter]", function (chip) {
      chip.addEventListener("click", function (e) {
        e.preventDefault();
        setFilter(chip.getAttribute("data-filter"));
      });
    });
  }
})();
