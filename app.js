/* BF/AI — interaction layer */
(function () {
  "use strict";

  var deals = window.BFAI_DEALS || [];
  var models = window.BFAI_MODELS || [];
  var categories = window.BFAI_CATEGORIES || [];
  var sources = window.BFAI_SOURCES || [];

  var state = { model: "all", category: "all", source: "all", query: "", sort: "featured" };

  var grid = document.getElementById("deal-grid");
  var empty = document.getElementById("empty");
  var countEl = document.getElementById("result-count");
  var searchEl = document.getElementById("search");
  var clearEl = document.getElementById("clear-search");
  var sortEl = document.getElementById("sort");

  var money = function (n) { return "$" + Number(n).toLocaleString("en-US"); };
  var modelById = function (id) {
    return models.find(function (m) { return m.id === id; }) || { id: id, short: id, accent: "#c8ff4d" };
  };

  /* ---------- Filter pills ---------- */
  function buildPills(container, items, key) {
    var allCount = deals.length;
    container.innerHTML = "";
    var all = document.createElement("button");
    all.type = "button";
    all.className = "pill";
    all.textContent = "All" + (key === "model" ? "" : " " + allCount);
    all.setAttribute("aria-pressed", state[key] === "all" ? "true" : "false");
    all.addEventListener("click", function () { state[key] = "all"; refresh(); });
    container.appendChild(all);

    items.forEach(function (item) {
      var id = typeof item === "string" ? item : item.id;
      var label = typeof item === "string" ? item : (item.short || item.label || item.id);
      var n = deals.filter(function (d) {
        var v = key === "model" ? d.model : key === "category" ? d.category : d.source;
        return v === id;
      }).length;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pill";
      btn.dataset.value = id;
      btn.innerHTML = label + '<span class="pill__count">' + n + "</span>";
      btn.setAttribute("aria-pressed", state[key] === id ? "true" : "false");
      btn.addEventListener("click", function () { state[key] = id; refresh(); });
      container.appendChild(btn);
    });
  }

  function buildSourcePills() {
    var counts = {};
    deals.forEach(function (d) { counts[d.source] = (counts[d.source] || 0) + 1; });
    var items = Object.keys(counts).sort(function (a, b) {
      return counts[b] - counts[a] || a.localeCompare(b);
    }).map(function (s) { return { id: s, label: s }; });
    buildPills(document.getElementById("source-filters"), items, "source");
  }

  function syncPills() {
    [["model-filters", "model"], ["category-filters", "category"], ["source-filters", "source"]].forEach(function (pair) {
      var btns = document.getElementById(pair[0]).querySelectorAll(".pill");
      btns.forEach(function (b, i) {
        var val = i === 0 ? "all" : b.dataset.value;
        b.setAttribute("aria-pressed", state[pair[1]] === val ? "true" : "false");
      });
    });
  }

  /* ---------- Filtering + sorting ---------- */
  function visibleDeals() {
    var q = state.query.trim().toLowerCase();
    var out = deals.filter(function (d) {
      if (state.model !== "all" && d.model !== state.model) return false;
      if (state.category !== "all" && d.category !== state.category) return false;
      if (state.source !== "all" && d.source !== state.source) return false;
      if (!q) return true;
      var hay = [d.name, d.vendor, d.tagline, d.description, d.category, d.source,
        modelById(d.model).label].join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    if (state.sort === "discount") out.sort(function (a, b) { return b.discountPct - a.discountPct; });
    if (state.sort === "price-low") out.sort(function (a, b) { return a.dealPrice - b.dealPrice; });
    if (state.sort === "price-high") out.sort(function (a, b) { return b.dealPrice - a.dealPrice; });
    if (state.sort === "name") out.sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (state.sort === "featured") out.sort(function (a, b) {
      if (!!b.featured !== !!a.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return b.discountPct - a.discountPct;
    });
    return out;
  }

  /* ---------- Card rendering ---------- */
  function priceBlock(d) {
    if (d.priceText) {
      return '<div class="price"><span class="price__new price__new--text">' + esc(d.priceText) + "</span></div>";
    }
    if (d.isFree) {
      return '<div class="price"><span class="price__new">Free</span><span class="price__per">' + esc(d.per) + "</span></div>";
    }
    if (d.isCredit) {
      return '<div class="price"><span class="price__old">' + money(d.originalPrice) + " base</span>" +
        '<span class="price__new">' + money(d.dealPrice) + ' <span class="price__per">' + esc(d.per) + "</span></span></div>";
    }
    return '<div class="price"><span class="price__old">' + money(d.originalPrice) + "</span>" +
      '<span class="price__new">' + money(d.dealPrice) + ' <span class="price__per">' + esc(d.per) + "</span></span></div>";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function cardHTML(d) {
    var m = modelById(d.model);
    return '<article class="deal-card' + (d.featured ? " deal-card--featured" : "") + '"' +
      ' style="--card-accent:' + m.accent + '">' +
      '<div class="deal-card__top">' +
        '<div class="deal-logo" aria-hidden="true">' + esc(d.name.charAt(0)) + "</div>" +
        '<div class="deal-card__title"><div class="deal-card__name">' + esc(d.name) + "</div>" +
        '<div class="deal-card__vendor">' + esc(d.vendor) + "</div></div>" +
        '<span class="discount-badge">' + esc(d.discountLabel) + "</span>" +
      "</div>" +
      '<p class="deal-card__desc">' + esc(d.tagline) + " " + esc(d.description) + "</p>" +
      '<div class="deal-card__tags">' +
        (d.featured ? '<span class="tag tag--featured">✦ Featured</span>' : "") +
        '<span class="tag tag--model">' + esc(d.modelLabel || m.short) + "</span>" +
        '<span class="tag">' + esc(d.category) + "</span>" +
        '<span class="tag tag--verified">✓ CHECKED</span>' +
      "</div>" +
      '<div class="deal-card__bottom">' + priceBlock(d) +
        '<a class="deal-cta" href="' + esc(d.cta) + '" target="_blank" rel="noopener noreferrer"' +
        ' data-name="' + esc(d.name) + '">Get deal <span aria-hidden="true">↗</span></a>' +
      "</div>" +
      '<div class="deal-card__meta">' +
        "<span>" + (d.checkedOn ? "Checked " + esc(d.checkedOn) : "Checked") +
          (d.ends ? " · ends " + esc(d.ends) : "") + "</span>" +
        '<a href="' + esc(d.sourceUrl || d.cta) + '" target="_blank" rel="noopener noreferrer">Source: ' +
          esc(d.source || d.vendor) + " ↗</a>" +
      "</div>" +
    "</article>";
  }

  function refresh() {
    var list = visibleDeals();
    grid.innerHTML = list.map(cardHTML).join("");
    empty.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    countEl.textContent = list.length + (list.length === 1 ? " deal" : " deals");
    syncPills();
    clearEl.hidden = !state.query;
  }

  /* ---------- Countdown ---------- */
  function initCountdown() {
    var target = new Date(2026, 10, 27, 0, 0, 0).getTime();
    var ids = ["cd-days", "cd-hours", "cd-mins", "cd-secs"].map(function (id) { return document.getElementById(id); });
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        ids.forEach(function (el) { el.textContent = "00"; });
        document.querySelector(".countdown__label").textContent = "BFCM is live — go get them";
        return;
      }
      var s = Math.floor(diff / 1000);
      var vals = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
      ids.forEach(function (el, i) { el.textContent = String(vals[i]).padStart(2, "0"); });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Stats + structured data ---------- */
  function initStats() {
    document.getElementById("stat-deals").textContent = deals.length;
    var real = deals.filter(function (d) { return !d.isCredit && !d.isFree; });
    var avg = real.reduce(function (sum, d) { return sum + d.discountPct; }, 0) / (real.length || 1);
    document.getElementById("stat-avg").textContent = Math.round(avg) + "%";
    document.getElementById("stat-sources").textContent = sources.length;
  }

  function initStructuredData() {
    // Names, descriptions and vendor URLs only — no price claims in schema.
    var items = deals.map(function (d, i) {
      return {
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "SoftwareApplication", name: d.name, url: d.cta, description: d.tagline,
          applicationCategory: d.category }
      };
    });
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "ItemList",
      name: "BF/AI — live Black Friday 2026 AI deals", itemListElement: items
    });
    document.head.appendChild(script);
  }

  function initSourceDirectory() {
    var grid = document.getElementById("source-directory");
    var list = window.BFAI_SOURCE_DIRECTORY || [];
    if (!grid || !list.length) return;
    grid.innerHTML = list.map(function (s, i) {
      return '<a class="source-card" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="source-card__num">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="source-card__type">' + esc(s.type) + "</span>" +
        "<h3>" + esc(s.name) + "</h3>" +
        "<p>" + esc(s.note) + "</p>" +
        '<span class="source-card__go">Open source ↗</span>' +
      "</a>";
    }).join("");
    document.getElementById("source-count").textContent = list.length + " sources";
  }

  function initWatchlist() {
    var el = document.getElementById("no-deal-list");
    var none = window.BFAI_NO_DEAL || [];
    if (!el || !none.length) return;
    el.textContent = none.join(" · ");
  }

  /* ---------- Freshness label derived from deal check dates ---------- */
  function initFreshness() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var latest = null;
    deals.forEach(function (d) {
      var m = String(d.checkedOn || "").match(/^(\d{1,2})\s+([A-Za-z]{3})/);
      if (!m) return;
      var mi = months.indexOf(m[2].charAt(0).toUpperCase() + m[2].slice(1).toLowerCase());
      if (mi < 0) return;
      var dt = new Date(2026, mi, Number(m[1]));
      if (!latest || dt > latest) latest = dt;
    });
    if (!latest) return;
    var label = latest.getDate() + " " + months[latest.getMonth()] + " " + latest.getFullYear();
    ["freshness-date", "freshness-range"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = label;
    });
  }

  /* ---------- Source submission / crawler ---------- */
  function initCrawler() {
    var form = document.getElementById("crawl-form");
    if (!form) return;
    var input = document.getElementById("crawl-url");
    var btn = document.getElementById("crawl-button");
    var status = document.getElementById("crawl-status");
    var results = document.getElementById("crawl-results");
    var seedsEl = document.getElementById("crawl-seeds");
    var seeds = [];
    var last = null;

    fetch("crawl-targets.json").then(function (r) { return r.json(); })
      .then(function (d) {
        seeds = d.targets || [];
        seedsEl.innerHTML = '<span class="crawl-seeds__label">Seeded targets</span>' +
          seeds.map(function (s) {
            return '<button type="button" class="crawl-seed" data-url="' + esc(s.url) + '">' + esc(s.url) + "</button>";
          }).join("");
      }).catch(function () {});

    function today() {
      var d = new Date();
      return d.getDate() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
    }

    function toRow(c, sourceUrl) {
      var pct = c.discountPct && c.discountPct < 101 ? c.discountPct : null;
      return {
        id: c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40),
        name: c.name,
        vendor: c.source || "Unknown",
        category: "Software",
        model: "lifetime",
        tagline: (c.description || "").slice(0, 90),
        description: c.description || "",
        originalPrice: c.listPrice || 0,
        dealPrice: c.dealPrice || 0,
        per: "once",
        discountLabel: pct ? pct + "% OFF" : "REVIEW",
        discountPct: pct || 0,
        cta: c.url || sourceUrl,
        source: c.source || "Unknown",
        sourceUrl: sourceUrl,
        checkedOn: today(),
        ends: "review"
      };
    }

    function copy(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      return Promise.resolve();
    }

    function render(data) {
      last = data;
      results.hidden = false;
      var candidates = data.candidates || [];
      var headline = '<div class="crawl-results__head"><h3>' + esc(data.title || "Fetched page") +
        '</h3><div><a href="' + esc(data.finalUrl) + '" target="_blank" rel="noopener">Open source ↗</a>' +
        (candidates.length ? ' · <button type="button" class="crawl-copy" id="copy-all">Copy all rows</button>' : "") +
        "</div></div>";
      var list = candidates.length
        ? '<div class="crawl-list">' + candidates.map(function (c, i) {
            var bits = [];
            if (c.dealPrice != null) bits.push("$" + c.dealPrice);
            if (c.listPrice != null) bits.push("was $" + c.listPrice);
            if (c.discountPct) bits.push(c.discountPct + "% off");
            return '<div class="crawl-item"><div class="crawl-item__main">' +
              '<div class="crawl-item__name">' + esc(c.name) + "</div>" +
              '<div class="crawl-item__meta">' + esc(bits.join(" · ") || "no price on page") + " · " +
                esc(c.confidence) + " confidence</div></div>" +
              '<span class="crawl-item__conf crawl-item__conf--' + esc(c.confidence) + '">' + esc(c.confidence) + "</span>" +
              '<button type="button" class="crawl-copy" data-copy="' + i + '">Copy row</button></div>';
          }).join("") + "</div>"
        : '<div class="crawl-empty">No deal candidates found on this page. Try a source that prints prices or percentages.</div>';

      results.innerHTML = headline + list;
      var all = document.getElementById("copy-all");
      if (all) all.addEventListener("click", function () {
        copy(JSON.stringify(candidates.map(function (c) { return toRow(c, data.finalUrl); }), null, 2))
          .then(function () { toast("Copied " + candidates.length + " candidate rows"); });
      });
      results.querySelectorAll("[data-copy]").forEach(function (b) {
        b.addEventListener("click", function () {
          var c = candidates[Number(b.dataset.copy)];
          copy(JSON.stringify(toRow(c, data.finalUrl), null, 2))
            .then(function () { toast("Row copied — verify before pasting into deals.js"); });
        });
      });
    }

    seedsEl.addEventListener("click", function (e) {
      var b = e.target.closest(".crawl-seed");
      if (!b) return;
      input.value = b.dataset.url;
      run(b.dataset.url);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      run(input.value.trim());
    });

    function run(url) {
      if (!url) { status.textContent = "Enter a URL"; return; }
      status.textContent = "Crawling…";
      btn.disabled = true;
      fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url })
      }).then(function (r) {
        return r.json().then(function (d) { return { ok: r.ok, data: d }; });
      }).then(function (res) {
        btn.disabled = false;
        if (!res.ok || !res.data.ok) throw new Error(res.data.error || "Crawl failed.");
        status.textContent = res.data.count + " candidates";
        render(res.data);
        toast("Crawled — " + res.data.count + " candidates for review");
      }).catch(function (err) {
        btn.disabled = false;
        var message = String(err.message || err).replace(/\.$/, "");
        var localHint = /fetch|network|unexpected token|not found|404/i.test(message)
          ? " Endpoint unavailable in a local preview — run <code>node scripts/crawl.js " + esc(url) + "</code> in the repo." : "";
        status.textContent = "Crawl failed";
        results.hidden = false;
        results.innerHTML = '<div class="crawl-error">' + esc(message) + "." + localHint + "</div>";
      });
    }
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 3200);
  }

  /* ---------- Theme ---------- */
  function initTheme() {
    var root = document.documentElement;
    var btn = document.getElementById("theme-toggle");
    var label = document.getElementById("theme-label");
    if (!btn) return;
    function apply(t) {
      root.setAttribute("data-theme", t);
      btn.setAttribute("aria-label", t === "light" ? "Switch to dark theme" : "Switch to light theme");
      if (label) label.textContent = t === "light" ? "Light" : "Dark";
      try { localStorage.setItem("bfai-theme", t); } catch (e) {}
    }
    apply(root.getAttribute("data-theme") || "light");
    btn.addEventListener("click", function () {
      apply(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }

  /* ---------- Wire up ---------- */
  initTheme();
  buildPills(document.getElementById("model-filters"), models, "model");
  buildPills(document.getElementById("category-filters"), categories, "category");
  buildSourcePills();
  refresh();
  initCountdown();
  initStats();
  initStructuredData();
  initSourceDirectory();
  initWatchlist();
  initCrawler();
  initFreshness();

  var params = new URLSearchParams(location.search);
  var urlQuery = params.get("q");
  var urlSource = params.get("source");
  if (urlSource) state.source = urlSource;
  if (urlQuery || urlSource) {
    if (urlQuery) { state.query = urlQuery; searchEl.value = urlQuery; }
    refresh();
  }

  searchEl.addEventListener("input", function () { state.query = searchEl.value; refresh(); });
  searchEl.addEventListener("keydown", function (e) { if (e.key === "Escape") { searchEl.value = ""; state.query = ""; refresh(); } });
  clearEl.addEventListener("click", function () { searchEl.value = ""; state.query = ""; refresh(); searchEl.focus(); });
  sortEl.addEventListener("change", function () { state.sort = sortEl.value; refresh(); });
  document.getElementById("reset-filters").addEventListener("click", function () {
    state.model = "all"; state.category = "all"; state.source = "all"; state.query = ""; state.sort = "featured";
    searchEl.value = ""; sortEl.value = "featured"; refresh();
  });
  document.getElementById("submit-btn").addEventListener("click", function () {
    toast("Repo opens in a new tab — add your deal to deals.js");
  });
  document.addEventListener("click", function (e) {
    var cta = e.target.closest(".deal-cta");
    if (cta) toast("Confirm the price and renewal terms on " + cta.dataset.name + "'s site.");
  });
})();
