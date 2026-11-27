/* Vercel serverless function: POST /api/crawl { url } -> deal candidates.
 * ADMIN ONLY. Disabled (404) unless CRAWL_ADMIN_TOKEN is set, and every call
 * must send `Authorization: Bearer <token>`. Returns candidates for review;
 * it never writes to deals.js. Public visitors do not use this endpoint. */

const crypto = require('node:crypto');
const { extractDeals, stripTags } = require('../lib/extract-deals');
const { safeGetHtml } = require('../lib/safe-fetch');
const seeds = require('../crawl-targets.json');

const WINDOW_MS = 60000;
const MAX_PER_WINDOW = 10;
const hits = new Map(); // best-effort per-instance limiter; Vercel Firewall is the real limit

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

function rateLimited(req) {
  const fwd = String(req.headers && req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const key = fwd || 'unknown';
  const now = Date.now();
  const recent = (hits.get(key) || []).filter(t => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 500) for (const [k, v] of hits) if (!v.some(t => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

function authorised(req, token) {
  const header = String(req.headers && req.headers.authorization || '');
  const presented = header.startsWith('Bearer ') ? header.slice(7) : '';
  const a = crypto.createHash('sha256').update(presented).digest();
  const b = crypto.createHash('sha256').update(token).digest();
  return crypto.timingSafeEqual(a, b);
}

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 8192) throw new Error('Request body too large.');
  }
  try { return JSON.parse(raw || '{}'); } catch (e) { throw new Error('Invalid JSON body.'); }
}

module.exports = async function handler(req, res) {
  const token = process.env.CRAWL_ADMIN_TOKEN;
  if (!token) return json(res, 404, { ok: false, error: 'Not found.' });
  if (rateLimited(req)) return json(res, 429, { ok: false, error: 'Too many requests.' });
  if (!authorised(req, token)) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    return json(res, 401, { ok: false, error: 'Unauthorised.' });
  }

  if (req.method === 'GET') {
    return json(res, 200, {
      ok: true,
      usage: 'POST { "url": "https://example.com/deals" }',
      note: 'Returns deal candidates for review. Nothing is published automatically.',
      targets: seeds.targets.map(t => t.url)
    });
  }
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed.' });

  try {
    const body = await readBody(req);
    const requested = body.url;
    const page = await safeGetHtml(requested);
    const titleMatch = page.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const candidates = extractDeals(page.html, page.finalUrl, { limit: 20 });
    return json(res, 200, {
      ok: true,
      requestedUrl: String(requested).slice(0, 200),
      finalUrl: page.finalUrl,
      title: titleMatch ? stripTags(titleMatch[1]).slice(0, 160) : '',
      fetchedAt: new Date().toISOString(),
      truncated: page.truncated,
      count: candidates.length,
      warning: 'Candidates are heuristic matches, not verified offers. Check each on the vendor page before adding it to deals.js.',
      candidates
    });
  } catch (err) {
    return json(res, 400, { ok: false, error: String(err && err.message || err).slice(0, 300) });
  }
};
