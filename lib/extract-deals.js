/* Dead-simple, dependency-free deal candidate extractor.
 * Used by both api/crawl.js (Vercel) and scripts/crawl.js (local).
 * It returns CANDIDATES for human review — it never decides what is live. */

function decode(s) {
  return String(s || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;/gi, "'")
    .replace(/&#(\d+);/g, function (_, n) { return String.fromCharCode(+n); });
}

function stripTags(s) {
  return decode(String(s || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function absolute(href, base) {
  if (!href) return "";
  try { return new URL(href, base).toString(); } catch (e) { return ""; }
}

function cleanHeading(s) {
  return stripTags(s).replace(/^(✦|⭐|🔥|👍)\s*/, "").slice(0, 120);
}

/* Cards often put the product <a> BEFORE the heading, so taking the first
 * href inside a heading-split chunk points at the next product. Search the
 * source around the name and prefer an anchor whose text contains it. */
function findUrlForName(name, html, base) {
  var lower = html.toLowerCase();
  var needle = name.toLowerCase();
  var idx = lower.indexOf(needle);
  if (idx < 0) return "";
  var from = Math.max(0, idx - 2000);
  var window = html.slice(from, idx + needle.length + 500);
  var re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]{0,700}?)<\/a>/gi;
  var m, best = "", bestScore = Infinity;
  while ((m = re.exec(window)) !== null) {
    var text = stripTags(m[2]);
    if (!text) continue;
    var score = Math.abs(from + m.index - idx);
    if (text.toLowerCase().indexOf(needle) !== -1) score -= 5000;
    if (score < bestScore) { bestScore = score; best = m[1]; }
  }
  return absolute(best, base);
}

function extractDeals(html, baseUrl, options) {
  options = options || {};
  var limit = options.limit || 20;
  var source = options.source || (function () {
    try { return new URL(baseUrl).hostname.replace(/^www\./, ""); } catch (e) { return baseUrl; }
  })();

  var clean = String(html || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");

  // Split on headings and list rows — both are common deal containers.
  var chunks = clean.split(/(?=<h[2-6]\b|<li\b)/i);
  var out = [];
  var seen = {};

  chunks.forEach(function (chunk) {
    if (out.length >= limit * 3) return;

    var headingMatch = chunk.match(/<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/i);
    var name = headingMatch ? cleanHeading(headingMatch[2]) : "";
    var fromLi = false;
    if (!name) {
      var liMatch = chunk.match(/^<li\b[^>]*>([\s\S]{0,400})/i);
      if (liMatch) { name = cleanHeading(liMatch[1].split(/[.<!]/)[0]); fromLi = true; }
    }
    if (!name || name.length < 3) return;
    if (/^(ends in|black friday|before you go|lifetime black friday deals)/i.test(name)) return;
    if (/^(why |how |what is|voice agents|key features|✨|🧩|☁️|🤖)/i.test(name)) return;

    var text = stripTags(chunk).slice(0, 900);
    var prices = [];
    var re = /\$\s?([\d,]+(?:\.\d{2})?)/g;
    var m;
    while ((m = re.exec(text)) !== null && prices.length < 4) {
      prices.push(Number(m[1].replace(/,/g, "")));
    }
    var discountMatch = text.match(/(\d{1,3})\s?%\s?(?:off|discount)/i) ||
      text.match(/save\s+(\d{1,3})\s?%/i) ||
      text.match(/(?:up\s+to\s+)?(\d{1,3})\s?%\s+OFF/i);
    var discount = discountMatch ? Number(discountMatch[1]) : null;

    if (!prices.length && !discount) return;
    if (fromLi && !prices.length) return;
    if (prices[0] > 5000 && !prices[1] && !discount) return;

    var hrefMatch = chunk.match(/<a\b[^>]*href=["']([^"']+)["']/i);
    var url = findUrlForName(name, clean, baseUrl) || absolute(hrefMatch && hrefMatch[1], baseUrl);
    var desc = text.replace(name, "").trim().slice(0, 220);

    var key = name.toLowerCase().slice(0, 60) + "|" + (prices[0] || "") + "|" + discount;
    if (seen[key]) return;
    seen[key] = true;

    out.push({
      name: name,
      dealPrice: prices.length ? prices[0] : null,
      listPrice: prices.length > 1 ? prices[1] : null,
      discountPct: discount,
      description: desc,
      url: url,
      source: source,
      confidence: prices.length && discount ? "high" : prices.length || discount ? "medium" : "low"
    });
  });

  out.sort(function (a, b) {
    var rank = { high: 0, medium: 1, low: 2 };
    return rank[a.confidence] - rank[b.confidence];
  });
  return out.slice(0, limit);
}

module.exports = { extractDeals: extractDeals, stripTags: stripTags };
