# BF/AI — live Black Friday deals for the AI stack

A zero-build static deal aggregator for AI tools, software, APIs, compute and hardware. Deals are filtered by **how you pay** — lifetime, annual, credits or BYOK — before category.

Every card carries a source link and a check date. Live data was checked between 9 November and 27 November 2026 (Black Friday); Cyber Monday is 30 November. The banner and footer dates are derived from `checkedOn` fields in `deals.js`, so they update when data is refreshed.

**Theme:** light by default, with a header toggle to dark. The choice persists in `localStorage` under `bfai-theme` and is applied by an inline head script before paint. AppSumo deals come from the live BFCM Drop 1 collection (`https://appsumo.com/collections/black-friday-2026-drop-1/`); each drop is at its lowest price for 48 hours, so `ends` dates on those rows are short.

## Verification standard

A deal is included only when a public tracker reported reading the offer on a page the vendor controls, with a check date:

| Evidence | URL | Checked |
| --- | --- | --- |
| PromptsRush — vendor-page-only tracker | https://promptsrush.com/blog/black-friday-ai-tool-deals | 16 Nov 2026 |
| TechBonna — vendor-checked AI deals | https://techbonna.com/black-friday-ai-deals/ | 15 Nov 2026 |
| WPOS — vendor-checked roundup | https://wpos.ai/blog/ai-black-friday-deals | 15 Nov 2026 |
| Resourify — credits/API deal feed | https://resourify.com/topics/ai | 9 Nov 2026 |
| The Ground Plane — price-history checked hardware | https://thegroundplane.com/reviews/black-friday-tech-2026 | 14 Nov 2026 |
| Tech Cing — laptop deals | https://www.techcing.com/black-friday-laptop-deals-2026 | 15 Nov 2026 |
| blackfriday.tools | https://blackfriday.tools/ | 17 Nov 2026 |
| SaaS Black Friday | https://saasblackfriday.online/?status=live | 17 Nov 2026 |
| Credit for Startups | https://creditforstartups.com/black-friday-software-deals | 16 Nov 2026 |
| Black Friday Vault | https://blackfridayvault.com/ | 17 Nov 2026 |
| thuongtin BFCM list | https://github.com/thuongtin/awesome-bfcm-2026 | 17 Nov 2026 |
| DealMirror | https://dealmirror.com/ | 17 Nov 2026 |

A further **26 checked sources** are published in the on-site directory (`BFAI_SOURCE_DIRECTORY`): trackers, GitHub lists, LTD marketplaces and price-verification tools. Every URL was confirmed as a live, relevant page between 17 and 27 November 2026. Deals can be filtered by source in the UI or via `?source=<name>` (e.g. `?source=blackfriday.tools`), and searched with `?q=<term>`.

`sourceUrl` is the evidence; `cta` is the vendor. If they disagree, the vendor page wins. Trackers can be wrong and offers expire — re-check before publishing further changes.

**What is deliberately absent:** ChatGPT, Claude, Gemini, Cursor, GitHub Copilot, Midjourney, Perplexity, Grammarly, Notion, HeyGen, Descript, Canva, Ahrefs and Semrush had no live offer at check time. Coupon-site codes such as "50% off Cursor" or "ChatGPT lifetime $49.50" are not vendor-verified and are excluded. Most advertised AI percentages are annual-billing switches or first-month trials, not seasonal price cuts — the card text says so where it matters.

## Run locally

No install step. From the repo root:

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## Add or edit a deal

All content lives in [`deals.js`](deals.js). Add one object to `window.BFAI_DEALS`:

```js
{
  id: "unique-slug",
  name: "Tool name",
  vendor: "Company",
  category: "AI Tools",          // must exist in BFAI_CATEGORIES
  model: "lifetime",             // lifetime | annual | credits | byok
  tagline: "Short hook",
  description: "What the offer covers, including renewal caveats.",
  originalPrice: 240,
  dealPrice: 120,
  per: "/yr",                    // "/yr", "/mo 6mo", "/1st mo", "once"
  discountLabel: "50% OFF",      // badge text
  discountPct: 50,               // used for sorting + the average stat
  cta: "https://vendor.example/pricing",
  source: "PromptsRush",         // evidence provider
  sourceUrl: "https://...",      // link to the evidence page
  checkedOn: "16 Nov",           // when the evidence was read
  ends: "1 Dec",                 // optional printed end date / countdown / rolling
  priceText: "Up to 50% off",    // optional: replaces the numeric price display
  modelLabel: "First month",     // optional: overrides the model pill text
  featured: false                // optional
}
```

Add a new category to `BFAI_CATEGORIES`; add a pricing model to `BFAI_MODELS` (give it an `accent` hex — card colour encodes the model). `BFAI_NO_DEAL` drives the "no live offer yet" watchlist.

## Crawling sources (admin only)

Crawling is a maintainer tool, not a public feature: the site has no crawl UI. It fetches a page server-side and returns **deal candidates for review**. It never edits `deals.js` automatically.

- `scripts/crawl.js` — **preferred**, runs locally with no public attack surface:
  ```bash
  node scripts/crawl.js                                  # crawls all crawl-targets.json entries
  node scripts/crawl.js https://example.com/deals --out results.json
  ```
- `api/crawl.js` — optional Vercel function. **Disabled (404) unless `CRAWL_ADMIN_TOKEN` is set** in the project's environment; every request must send `Authorization: Bearer <token>`. GET lists seeded targets; POST `{ "url": "..." }` returns `{ title, finalUrl, candidates }`. Leave the variable unset to keep the endpoint off.
- `lib/safe-fetch.js` — SSRF-safe fetcher shared by both. http/https on ports 80/443 only, no credentials, DNS resolved at connect time with every address checked against private/reserved IPv4 and IPv6 ranges (rebinding-safe), every redirect re-validated, 3 hops, timeout and 2 MB cap.
- `lib/extract-deals.js` — shared, dependency-free extractor. Splits on `h2`–`h6` and `li`, looks for prices and percentages, dedupes, marks confidence.
- `crawl-targets.json` — seeded targets with check dates, candidate counts and notes.

Also set a Vercel Spend Management limit and a Firewall rate-limit rule on `/api/crawl`; the in-code limiter is per-instance and best-effort.

## Tests

```bash
node scripts/test-security.js   # SSRF guard, crawl auth, deal URL hygiene, vercel.json headers
```

Seeded on 18 Nov 2026: AppSumo BFCM hub (10 candidates), OttoKit roundup (9), 6amtech AI list (2 — mostly "Coming Soon"). Review before publishing; the extractor is deliberately recall-first, not truth-first.

## Keep it current

- Delete a deal when its `ends` date passes, unless the vendor extends it.
- Never add a deal without `sourceUrl` and `checkedOn`.
- Record the renewal price in `description` for first-month / first-year offers.
- A scraper can regenerate `deals.js` on a cron from the channels below, but keep the evidence fields.

| Channel | Examples |
| --- | --- |
| Open-source lists | `Awesome-Black-Friday-Cyber-Monday`, `black-friday-ai` repos |
| LTD marketplaces | AppSumo, StackSocial, DealMirror, PitchGround |
| AI directories | TAAFT, Product Hunt, Futurepedia, Toolify |
| SaaS affiliate networks | PartnerStack, Rewardful, FirstPromoter, Lemon Squeezy, Gumroad |
| Cloud + hardware | RunPod, Lambda, Vast.ai, Hugging Face; NVIDIA, Apple, Newegg, B&H |
| Social listening | `#BlackFridayAI`, `#buildinpublic`; r/LocalLLaMA, r/SaaS, r/appsumo |

Note: RunPod, Lambda, Nebius, CoreWeave and the hyperscalers had **no** official GPU-cloud sale as of 16–17 November. Hardware prices are elevated by the memory shortage; availability can beat waiting for a discount.

## Deploy

Vercel picks it up as a static site — no build command required.

```bash
vercel --prod
```

The repo is at `https://github.com/themacmarketer/bfstack`; production is https://bfstack.vercel.app (Vercel project under the `maplecommerce-projects` team, deployment protection disabled so the URL is public).
