/* SSRF-safe HTTP GET for the crawler.
 *
 * Hostnames are validated at connect time: the custom `lookup` resolves the
 * name, rejects the connection if ANY returned address is private/reserved,
 * and hands the checked address straight to the socket. Because the check and
 * the connection share one resolution, DNS rebinding cannot swap the address
 * in between. Redirects are followed manually and every hop is re-validated. */

const dns = require('node:dns');
const net = require('node:net');
const http = require('node:http');
const https = require('node:https');

const ALLOWED_PORTS = new Set(['', '80', '443']);
const REDIRECT_CODES = new Set([301, 302, 303, 307, 308]);

function isBlockedIPv4(ip) {
  const p = ip.split('.').map(Number);
  const [a, b, c] = p;
  return a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && (c === 0 || c === 2)) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113);
}

function expandIPv6(ip) {
  let addr = ip.toLowerCase().split('%')[0];
  const v4 = addr.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (v4) {
    const o = v4[1].split('.').map(Number);
    addr = addr.slice(0, -v4[1].length) +
      ((o[0] << 8) | o[1]).toString(16) + ':' + ((o[2] << 8) | o[3]).toString(16);
  }
  const halves = addr.split('::');
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length > 1 && halves[1] ? halves[1].split(':') : [];
  const fill = halves.length > 1 ? new Array(8 - head.length - tail.length).fill('0') : [];
  return head.concat(fill, tail).map(g => parseInt(g || '0', 16));
}

function isBlockedIPv6(ip) {
  const g = expandIPv6(ip);
  const embeddedV4 = (hi, lo) => [hi >> 8, hi & 255, lo >> 8, lo & 255].join('.');
  if (g.every(x => x === 0)) return true;                       // ::
  if (g.slice(0, 7).every(x => x === 0) && g[7] === 1) return true; // ::1
  if ((g[0] & 0xfe00) === 0xfc00) return true;                  // fc00::/7 unique local
  if ((g[0] & 0xffc0) === 0xfe80) return true;                  // fe80::/10 link local
  if ((g[0] & 0xff00) === 0xff00) return true;                  // multicast
  if (g.slice(0, 5).every(x => x === 0) && g[5] === 0xffff) return isBlockedIPv4(embeddedV4(g[6], g[7])); // ::ffff:v4
  if (g.slice(0, 6).every(x => x === 0)) return true;           // deprecated v4-compatible
  if (g[0] === 0x64 && g[1] === 0xff9b) return isBlockedIPv4(embeddedV4(g[6], g[7])); // NAT64
  if (g[0] === 0x2002) return true;                             // 6to4
  if (g[0] === 0x2001 && (g[1] === 0 || g[1] === 0x0db8)) return true; // Teredo, documentation
  return false;
}

function isBlockedIp(ip) {
  const family = net.isIP(ip);
  if (family === 4) return isBlockedIPv4(ip);
  if (family === 6) return isBlockedIPv6(ip);
  return true;
}

/* Syntactic checks before any network activity. Returns a URL object. */
function validateUrl(raw) {
  if (typeof raw !== 'string' || raw.length > 2000) throw new Error('URL is missing or too long.');
  let parsed;
  try { parsed = new URL(raw.trim()); } catch (e) { throw new Error('That is not a valid URL.'); }
  if (!/^https?:$/.test(parsed.protocol)) throw new Error('Only http and https URLs are allowed.');
  if (parsed.username || parsed.password) throw new Error('URLs with credentials are not allowed.');
  if (!ALLOWED_PORTS.has(parsed.port)) throw new Error('Only ports 80 and 443 are allowed.');
  const host = parsed.hostname.toLowerCase().replace(/\.$/, '').replace(/^\[|\]$/g, '');
  if (!host || host === 'localhost' || /\.(localhost|local|internal|lan|home|corp)$/.test(host) ||
      host === 'metadata.google.internal') throw new Error('That host is not allowed.');
  if (net.isIP(host) && isBlockedIp(host)) throw new Error('Private or reserved IP addresses are not allowed.');
  return parsed;
}

function guardedLookup(hostname, options, callback) {
  dns.lookup(hostname, { all: true, verbatim: true }, (err, addresses) => {
    if (err) return callback(err);
    if (!addresses.length || addresses.some(a => isBlockedIp(a.address))) {
      return callback(new Error('That host resolves to a private or reserved address.'));
    }
    if (options && options.all) return callback(null, addresses);
    callback(null, addresses[0].address, addresses[0].family);
  });
}

function requestOnce(url, opts) {
  return new Promise((resolve, reject) => {
    const client = url.protocol === 'https:' ? https : http;
    const req = client.request(url, {
      method: 'GET',
      lookup: guardedLookup,
      agent: false,
      headers: opts.headers
    }, res => {
      if (REDIRECT_CODES.has(res.statusCode)) {
        res.resume();
        return resolve({ status: res.statusCode, location: res.headers.location || '' });
      }
      const type = String(res.headers['content-type'] || '');
      if (res.statusCode < 200 || res.statusCode >= 300) {
        res.resume();
        return reject(new Error('Source returned HTTP ' + res.statusCode + '.'));
      }
      if (!/html/i.test(type)) {
        res.resume();
        return reject(new Error('Source is not HTML (' + type.split(';')[0] + ').'));
      }
      const chunks = [];
      let size = 0;
      let truncated = false;
      res.on('data', chunk => {
        size += chunk.length;
        if (size > opts.maxBytes) {
          truncated = true;
          chunks.push(chunk.subarray(0, chunk.length - (size - opts.maxBytes)));
          res.destroy();
        } else {
          chunks.push(chunk);
        }
      });
      const finish = () => resolve({ status: res.statusCode, html: Buffer.concat(chunks).toString('utf8'), truncated });
      res.on('end', finish);
      res.on('close', finish);
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(opts.timeoutMs, () => req.destroy(new Error('Source timed out.')));
    req.end();
  });
}

async function safeGetHtml(startUrl, options) {
  const opts = Object.assign({
    maxHops: 3,
    maxBytes: 2000000,
    timeoutMs: 9000,
    headers: {
      'user-agent': 'BFAI-Crawler/1.0 (+https://bfstack.vercel.app)',
      'accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5'
    }
  }, options);
  let current = validateUrl(startUrl);
  for (let hop = 0; hop <= opts.maxHops; hop++) {
    const result = await requestOnce(current, opts);
    if (result.location !== undefined && REDIRECT_CODES.has(result.status)) {
      if (!result.location) throw new Error('Redirect without a location.');
      current = validateUrl(new URL(result.location, current).toString());
      continue;
    }
    return { finalUrl: current.toString(), html: result.html, truncated: result.truncated };
  }
  throw new Error('Too many redirects.');
}

module.exports = { safeGetHtml, validateUrl, isBlockedIp };
