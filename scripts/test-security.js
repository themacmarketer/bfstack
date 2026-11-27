/* Security regression tests. Run: node scripts/test-security.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { validateUrl, isBlockedIp } = require('../lib/safe-fetch');

let failed = 0;
function check(name, ok) {
  console.log((ok ? 'PASS ' : 'FAIL ') + name);
  if (!ok) failed++;
}
function throws(fn) { try { fn(); return false; } catch (e) { return true; } }

// IP guard
['127.0.0.1', '10.1.2.3', '172.16.0.1', '172.31.255.255', '192.168.1.1', '169.254.169.254',
 '100.64.0.1', '0.0.0.0', '224.0.0.1', '::1', '::', 'fc00::1', 'fd12::1', 'fe80::1',
 '::ffff:127.0.0.1', '::ffff:7f00:1', '::ffff:169.254.169.254', '64:ff9b::7f00:1', '2002:7f00:1::1']
  .forEach(ip => check('blocks ' + ip, isBlockedIp(ip)));
['8.8.8.8', '1.1.1.1', '172.32.0.1', '2606:4700:4700::1111', '::ffff:8.8.8.8']
  .forEach(ip => check('allows ' + ip, !isBlockedIp(ip)));

// URL validation (parser normalises decimal/hex/octal IPv4 forms)
['http://localhost/', 'http://127.0.0.1/', 'http://2130706433/', 'http://0x7f.1/', 'http://017700000001/',
 'http://[::1]/', 'http://[::ffff:127.0.0.1]/', 'http://169.254.169.254/latest/meta-data',
 'http://metadata.google.internal/', 'http://foo.internal/', 'http://user:pw@example.com/',
 'ftp://example.com/', 'file:///etc/passwd', 'javascript:alert(1)', 'https://example.com:8443/',
 'http://example.com:22/']
  .forEach(u => check('rejects ' + u, throws(() => validateUrl(u))));
check('accepts https://example.com/deals', !throws(() => validateUrl('https://example.com/deals')));

// Crawl endpoint fails closed
(async function () {
  const handler = require('../api/crawl');
  const res = () => ({ statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(s) { this.body = s; } });
  const req = (headers, method) => ({ method: method || 'GET', headers: headers || {}, async *[Symbol.asyncIterator]() {} });

  delete process.env.CRAWL_ADMIN_TOKEN;
  let r = res(); await handler(req(), r);
  check('crawl disabled (404) without CRAWL_ADMIN_TOKEN', r.statusCode === 404);

  process.env.CRAWL_ADMIN_TOKEN = 'test-token-not-a-secret';
  r = res(); await handler(req({ 'x-forwarded-for': '9.9.9.1' }), r);
  check('crawl 401 without bearer token', r.statusCode === 401);
  r = res(); await handler(req({ 'x-forwarded-for': '9.9.9.2', authorization: 'Bearer wrong' }), r);
  check('crawl 401 with wrong token', r.statusCode === 401);
  r = res(); await handler(req({ 'x-forwarded-for': '9.9.9.3', authorization: 'Bearer test-token-not-a-secret' }), r);
  check('crawl 200 with correct token', r.statusCode === 200);
  let last;
  for (let i = 0; i < 12; i++) { last = res(); await handler(req({ 'x-forwarded-for': '9.9.9.4' }), last); }
  check('crawl rate limits repeated calls (429)', last.statusCode === 429);

  // Deal data: only https destinations
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'deals.js'), 'utf8') +
    '\n;this.__deals = window.BFAI_DEALS || [];', sandbox);
  const deals = sandbox.__deals;
  check('deals.js parsed (' + deals.length + ' deals)', deals.length > 0);
  const bad = deals.filter(d => !/^https:\/\//i.test(d.cta) || (d.sourceUrl && !/^https:\/\//i.test(d.sourceUrl)));
  check('every deal cta/sourceUrl is https' + (bad.length ? ' — bad: ' + bad.map(d => d.id).join(',') : ''), bad.length === 0);

  // vercel.json headers
  const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
  const names = ((cfg.headers || [])[0] || { headers: [] }).headers.map(h => h.key);
  ['Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy',
   'Permissions-Policy', 'Strict-Transport-Security'].forEach(n => check('vercel.json sets ' + n, names.includes(n)));

  // CSP hash matches the inline theme script
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const inline = html.match(/<script>([\s\S]*?)<\/script>/);
  const hash = require('crypto').createHash('sha256').update(inline[1]).digest('base64');
  const csp = cfg.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
  check('CSP hash matches inline theme script', csp.includes("'sha256-" + hash + "'"));
  check('index.html has no public crawler form', !/id="crawl-form"/.test(html));

  console.log(failed ? '\n' + failed + ' FAILED' : '\nAll passed');
  process.exit(failed ? 1 : 0);
})();
