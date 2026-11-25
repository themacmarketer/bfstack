/* ------------------------------------------------------------------
 * BF/AI — LIVE deal data (researched 15–17 November 2026)
 *
 * VERIFICATION STANDARD
 * A deal is included only when a public tracker reported reading the offer
 * on a page the vendor controls, with a check date. `sourceUrl` points to
 * that evidence; `cta` points to the vendor. `checkedOn` is when the
 * evidence was read. Vendor pages win if they disagree with a tracker.
 *
 * Fields:
 *   id, name, vendor, category, model, tagline, description,
 *   originalPrice, dealPrice, per, discountLabel, discountPct,
 *   cta, source, sourceUrl, checkedOn, ends(optional),
 *   priceText(optional override), modelLabel(optional override),
 *   featured, isCredit, isFree (optional flags)
 * ------------------------------------------------------------------ */

window.BFAI_SOURCES = [
  "PromptsRush verified tracker", "TechBonna vendor checks", "WPOS vendor checks",
  "Resourify deal feed", "Micro Center / retailers", "Vendor pricing pages"
];

window.BFAI_MODELS = [
  { id: "lifetime", label: "Lifetime / pay once", short: "Lifetime", accent: "#c8ff4d" },
  { id: "annual",   label: "Annual / subscription discount", short: "Annual", accent: "#a78bfa" },
  { id: "credits",  label: "Free API / compute credits", short: "Credits", accent: "#5ecbf5" },
  { id: "byok",     label: "Bring your own key", short: "BYOK", accent: "#ff6b57" }
];

window.BFAI_CATEGORIES = [
  "AI Tools", "Software", "API & Dev", "Cloud & Compute", "Hardware"
];

var PR = "https://promptsrush.com/blog/black-friday-ai-tool-deals";
var TB = "https://techbonna.com/black-friday-ai-deals/";
var WP = "https://wpos.ai/blog/ai-black-friday-deals";
var RS = "https://resourify.com/topics/ai";
var TG = "https://thegroundplane.com/reviews/black-friday-tech-2026";
var TC = "https://www.techcing.com/black-friday-laptop-deals-2026";
var BFT = "https://blackfriday.tools/";
var SBF = "https://saasblackfriday.online/?status=live";
var CFS = "https://creditforstartups.com/black-friday-software-deals";
var BFV = "https://blackfridayvault.com/";
var THT = "https://github.com/thuongtin/awesome-bfcm-2026";
var DM = "https://dealmirror.com/";
var AS = "https://appsumo.com/blackfriday";
var AS2 = "https://appsumo.com/collections/black-friday-2026-drop-2";
var OT = "https://ottokit.com/blog/top-black-friday-deals/";
var SXT = "https://6amtech.com/blog/best-ai-black-friday-deals/";

window.BFAI_DEALS = [
  /* ---- AI Tools ------------------------------------------------- */
  {
    id: "elevenlabs", name: "ElevenLabs", vendor: "ElevenLabs", category: "AI Tools", model: "annual",
    modelLabel: "First month",
    tagline: "Commercial voice licence for $1.",
    description: "Starter $1 first month, then $6/mo. Creator $11 first month, then $22/mo. Not branded as a Black Friday sale.",
    originalPrice: 6, dealPrice: 1, per: "/1st mo", discountLabel: "83% OFF", discountPct: 83,
    cta: "https://elevenlabs.io/pricing", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "1 Dec",
    featured: true
  },
  {
    id: "higgsfield", name: "Higgsfield", vendor: "Higgsfield", category: "AI Tools", model: "annual",
    tagline: "AI video, up to 60% off annual.",
    description: "Plus $27/mo billed yearly (was $49, 45% off); Ultra $50/mo (was $129, 60% off). Headline says 65% — the popular tier is 45%.",
    originalPrice: 129, dealPrice: 50, per: "/mo yr", discountLabel: "60% OFF", discountPct: 60,
    cta: "https://higgsfield.ai/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "countdown"
  },
  {
    id: "imagineart", name: "ImagineArt", vendor: "ImagineArt", category: "AI Tools", model: "credits",
    priceText: "Up to 50% off generations",
    tagline: "Cheaper Seedance video generation.",
    description: "Scale plans get 50% off Seedance generation costs, Creator 35%, Ultimate 20%. Cuts usage cost, not the plan price.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://imagine.art/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "30 Nov"
  },
  {
    id: "magnific", name: "Magnific", vendor: "Freepik", category: "AI Tools", model: "credits",
    priceText: "40% off credits",
    tagline: "Image upscaling credits, discounted.",
    description: "Individual subscriptions only, separate from the standing 24% annual discount. Ends 10 December.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "40% OFF", discountPct: 40,
    cta: "https://www.freepik.com/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "10 Dec"
  },
  {
    id: "runway", name: "Runway", vendor: "Runway", category: "AI Tools", model: "credits",
    priceText: "25% off Kling 4.0 generations",
    tagline: "Generation discount, plan price unchanged.",
    description: "25% off Kling 4.0 generation costs until 30 November. Your subscription price does not change.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "25% OFF", discountPct: 25,
    cta: "https://runwayml.com/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "30 Nov"
  },
  {
    id: "invideo", name: "InVideo", vendor: "InVideo", category: "AI Tools", model: "annual",
    priceText: "50% off annual + 30 days unlimited",
    tagline: "Video editor with unlimited image models.",
    description: "50% off annual plans plus 30 days of unlimited image models. No end date printed on the vendor page.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://invideo.io/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "rolling"
  },
  {
    id: "pictory", name: "Pictory", vendor: "Pictory", category: "AI Tools", model: "annual",
    tagline: "Text-to-video, half price annually.",
    description: "Professional $29.50/mo billed annually, down from $59/mo. Listed as a Black Friday offer.",
    originalPrice: 59, dealPrice: 29.5, per: "/mo yr", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://pictory.ai/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "rolling"
  },
  {
    id: "decktopus", name: "Decktopus", vendor: "Decktopus", category: "AI Tools", model: "annual",
    tagline: "AI decks, 66% off the first year.",
    description: "66% off annual Pro and Business with code BF26. Pro lands at $3.40/mo billed yearly.",
    originalPrice: 10, dealPrice: 3.4, per: "/mo yr", discountLabel: "66% OFF", discountPct: 66,
    cta: "https://www.decktopus.com/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "11 Dec"
  },
  {
    id: "youmind", name: "YouMind", vendor: "YouMind", category: "AI Tools", model: "annual",
    priceText: "50% off Max plan",
    tagline: "AI research workspace, half price.",
    description: "50% off the Max plan until 30 November.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://youmind.com/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "30 Nov"
  },
  {
    id: "trinka", name: "Trinka", vendor: "Trinka", category: "AI Tools", model: "annual",
    tagline: "Academic writing assistant, 40% off.",
    description: "40% off annual plans. Premium drops from $80 to $48.",
    originalPrice: 80, dealPrice: 48, per: "/yr", discountLabel: "40% OFF", discountPct: 40,
    cta: "https://www.trinka.ai/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "30 Nov"
  },
  {
    id: "hitpaw", name: "HitPaw", vendor: "HitPaw", category: "AI Tools", model: "lifetime",
    priceText: "Up to 60% off bundles",
    tagline: "AI media tools, bundled and discounted.",
    description: "60% off the 5-in-1 bundle, 30–40% off single apps and 20% off online credits.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "60% OFF", discountPct: 60,
    cta: "https://www.hitpaw.com/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "7 Dec"
  },

  /* ---- Software ------------------------------------------------- */
  {
    id: "scalenut", name: "Scalenut", vendor: "Scalenut", category: "Software", model: "annual",
    tagline: "SEO content, 65% off plus 3× usage.",
    description: "65% off every annual plan with 3× usage limits. Starter drops from $59 to $21/mo, billed yearly.",
    originalPrice: 59, dealPrice: 21, per: "/mo yr", discountLabel: "65% OFF", discountPct: 65,
    cta: "https://www.scalenut.com/", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "rolling",
    featured: true
  },
  {
    id: "mindpal", name: "MindPal", vendor: "MindPal", category: "Software", model: "annual",
    tagline: "AI agents, 60% off year one.",
    description: "60% off the first year with code BLACKFRIDAY2026. Pro $192/yr, down from $468.",
    originalPrice: 468, dealPrice: 192, per: "/yr", discountLabel: "60% OFF", discountPct: 60,
    cta: "https://mindpal.io/", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "11 Dec"
  },
  {
    id: "zipwp", name: "ZipWP", vendor: "ZipWP", category: "Software", model: "annual",
    tagline: "AI site builder, 47% off year one.",
    description: "Starter $79 for the first year, down from $149, with up to $695 in bundled plugins. One-time plans from $79.",
    originalPrice: 149, dealPrice: 79, per: "/yr", discountLabel: "47% OFF", discountPct: 47,
    cta: "https://zipwp.com/", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "7 Dec"
  },
  {
    id: "hostinger", name: "Hostinger AI Builder", vendor: "Hostinger", category: "Software", model: "annual",
    tagline: "AI website builder from $2.79/mo.",
    description: "Up to 85% off long-term plans with double AI credits. Base rate $18.99/mo before discount.",
    originalPrice: 18.99, dealPrice: 2.79, per: "/mo", discountLabel: "85% OFF", discountPct: 85,
    cta: "https://www.hostinger.com/website-builder", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "14 Dec"
  },
  {
    id: "cloudways", name: "Cloudways", vendor: "Cloudways", category: "Cloud & Compute", model: "annual",
    priceText: "80% off for 2 months",
    tagline: "Managed hosting, including AI agents.",
    description: "80% off for two months with code BFCM802, up to $200 off per month. Applies to AI agents and website builder too.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "80% OFF", discountPct: 80,
    cta: "https://www.cloudways.com/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "4 Dec"
  },
  {
    id: "tidio", name: "Tidio Lyro", vendor: "Tidio", category: "Software", model: "annual",
    modelLabel: "First 2 months",
    priceText: "$1/mo for 2 months",
    tagline: "AI support agent for a dollar.",
    description: "Lyro AI Agent at $1/month for the first two months on monthly plans with code BFCM50.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "$1 DEAL", discountPct: 90,
    cta: "https://www.tidio.com/", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "5 Dec"
  },
  {
    id: "adcreative", name: "AdCreative.ai", vendor: "AdCreative.ai", category: "Software", model: "annual",
    priceText: "50% off + double credits",
    tagline: "Ad creatives, half price and double credits.",
    description: "50% off quarterly and yearly plans, plus double credits.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://www.adcreative.ai/", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "rolling"
  },
  {
    id: "landbot", name: "Landbot", vendor: "Landbot", category: "Software", model: "annual",
    tagline: "Pay 6 months, get 12.",
    description: "New annual Starter, Professional and WhatsApp Professional plans. Starter drops from $45 to $22.50/mo billed yearly.",
    originalPrice: 45, dealPrice: 22.5, per: "/mo yr", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://landbot.io/", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "30 Nov"
  },
  {
    id: "topaz", name: "Topaz Labs", vendor: "Topaz Labs", category: "Software", model: "lifetime",
    priceText: "Up to 67% off bundles",
    tagline: "Photo enhancement, one-time licence.",
    description: "Up to 67% off app bundles, or 15% off single apps. One-time purchase, not a subscription.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "67% OFF", discountPct: 67,
    cta: "https://www.topazlabs.com/", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "rolling"
  },
  {
    id: "luminar", name: "Luminar", vendor: "Skylum", category: "Software", model: "lifetime",
    priceText: "Up to 77% off licences",
    tagline: "AI photo editor, pay once.",
    description: "Up to 77% off one-time Luminar licences.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "77% OFF", discountPct: 77,
    cta: "https://skylum.com/luminar", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "rolling"
  },
  {
    id: "pdfpals", name: "PDF Pals", vendor: "PDF Pals", category: "Software", model: "lifetime",
    tagline: "Chat with PDFs, lifetime licence.",
    description: "Lifetime licence at $149, down from $249, until 1 December.",
    originalPrice: 249, dealPrice: 149, per: "once", discountLabel: "40% OFF", discountPct: 40,
    cta: "https://pdfpals.com/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "1 Dec"
  },
  {
    id: "adobe-cc", name: "Creative Cloud Pro", vendor: "Adobe", category: "Software", model: "annual",
    tagline: "$29.99/mo for the first year.",
    description: "Creative Cloud Pro at $29.99/month for twelve months, instead of $69.99. Ends 27 November.",
    originalPrice: 69.99, dealPrice: 29.99, per: "/mo yr", discountLabel: "57% OFF", discountPct: 57,
    cta: "https://www.adobe.com/", source: "WPOS", sourceUrl: WP, checkedOn: "15 Nov", ends: "27 Nov"
  },
  {
    id: "adobe-firefly", name: "Firefly", vendor: "Adobe", category: "Software", model: "annual",
    modelLabel: "First 6 months",
    tagline: "Generative AI, up to 60% off.",
    description: "Pro $9.99/mo (was $19.99), Pro Plus $19.99/mo (was $49.99) for six months. Renewal price is higher.",
    originalPrice: 49.99, dealPrice: 19.99, per: "/mo 6mo", discountLabel: "60% OFF", discountPct: 60,
    cta: "https://www.adobe.com/products/firefly.html", source: "WPOS", sourceUrl: WP, checkedOn: "15 Nov", ends: "6 Dec"
  },
  {
    id: "zerorank", name: "ZeroRank", vendor: "ZeroRank", category: "Software", model: "annual",
    priceText: "45% off first year",
    tagline: "AI visibility tracking, discounted.",
    description: "45% off the first year of annual AI visibility tracking plans versus monthly billing. Starter $49/mo billed $588.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "45% OFF", discountPct: 45,
    cta: "https://zerorank.io/", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "30 Nov"
  },

  /* ---- BYOK ----------------------------------------------------- */
  {
    id: "boltai", name: "BoltAI", vendor: "BoltAI", category: "Software", model: "byok",
    modelLabel: "BYOK · lifetime",
    tagline: "Bring your own key, pay once.",
    description: "Up to $160 off one-time licences with code BFCM2026. Pro $59 (was $99), Pro+ $119, Lifetime $239.",
    originalPrice: 99, dealPrice: 59, per: "once", discountLabel: "40% OFF", discountPct: 40,
    cta: "https://boltai.com/blackfriday", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "1 Dec",
    featured: true
  },
  {
    id: "typingmind", name: "TypingMind", vendor: "TypingMind", category: "Software", model: "byok",
    modelLabel: "BYOK · lifetime",
    tagline: "Your keys, your chat UI, forever.",
    description: "60% off lifetime Premium at $79, down from $198. One of the longest-running BYOK front ends.",
    originalPrice: 198, dealPrice: 79, per: "once", discountLabel: "60% OFF", discountPct: 60,
    cta: "https://www.typingmind.com/", source: "PromptsRush", sourceUrl: PR, checkedOn: "16 Nov", ends: "15 Dec"
  },

  /* ---- API & credits -------------------------------------------- */
  {
    id: "mercury3", name: "Mercury 3 API", vendor: "Inception Labs", category: "API & Dev", model: "credits",
    priceText: "100M free tokens + 50% off",
    tagline: "Free tokens on a new account.",
    description: "100 million free API tokens, no card required, plus 50% off launch pricing from $0.10 per million input tokens.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "FREE TOKENS", discountPct: 100,
    cta: "https://www.inceptionlabs.ai/", source: "Resourify", sourceUrl: RS, checkedOn: "9 Nov", ends: "limited",
    isFree: true
  },
  {
    id: "anthropic-credits", name: "Claude Usage Credits", vendor: "Anthropic", category: "API & Dev", model: "credits",
    priceText: "$1,000 credits for $700",
    tagline: "10–30% off prepaid usage.",
    description: "$50 for $45, $250 for $200, or $1,000 for $700. For Pro, Max, Ultra and Team subscribers with usage credits enabled. Roundup claim — check your account.",
    originalPrice: 1000, dealPrice: 700, per: "credits", discountLabel: "30% OFF", discountPct: 30,
    cta: "https://claude.ai/", source: "Resourify", sourceUrl: RS, checkedOn: "9 Nov", ends: "limited"
  },
  {
    id: "wavespeed", name: "WaveSpeed AI", vendor: "WaveSpeed AI", category: "API & Dev", model: "credits",
    priceText: "$1 credits + 20% off Kling",
    tagline: "Free starter credits, no card.",
    description: "$1 in free AI generation credits for eligible new accounts, plus 20% off Kling 4.0 generation.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "FREE CREDITS", discountPct: 100,
    cta: "https://wavespeed.ai/", source: "Resourify", sourceUrl: RS, checkedOn: "9 Nov", ends: "limited",
    isFree: true
  },

  /* ---- Cloud & Compute ------------------------------------------ */
  {
    id: "hostinger-vps", name: "Hostinger VPS", vendor: "Hostinger", category: "Cloud & Compute", model: "annual",
    tagline: "Self-host n8n for $6.49/mo.",
    description: "Up to 70% off VPS hosting. KVM 1 on a 24-month term drops from $19.49 to $6.49/month.",
    originalPrice: 19.49, dealPrice: 6.49, per: "/mo", discountLabel: "67% OFF", discountPct: 67,
    cta: "https://www.hostinger.com/vps-hosting", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "rolling"
  },
  {
    id: "kinsta", name: "Kinsta", vendor: "Kinsta", category: "Cloud & Compute", model: "annual",
    priceText: "3 months free on annual",
    tagline: "Managed cloud, three months free.",
    description: "50% off the first three months on monthly plans, or three months free on annual plans, for new customers.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "3 MO FREE", discountPct: 50,
    cta: "https://kinsta.com/", source: "TechBonna", sourceUrl: TB, checkedOn: "15 Nov", ends: "1 Dec"
  },

  /* ---- Hardware ------------------------------------------------- */
  {
    id: "macbook-air-m5", name: "MacBook Air 13 (M5)", vendor: "Apple · Amazon", category: "Hardware", model: "lifetime",
    tagline: "16GB / 512GB at $1,099.",
    description: "Down $200 from $1,299 on 14 November. Caveat: price history puts a 'good price' at $989 or less, so this is a discount, not a record low.",
    originalPrice: 1299, dealPrice: 1099, per: "once", discountLabel: "$200 OFF", discountPct: 15,
    cta: "https://www.amazon.com/", source: "The Ground Plane", sourceUrl: TG, checkedOn: "14 Nov", ends: "rolling"
  },
  {
    id: "macbook-pro-m5", name: "MacBook Pro M5", vendor: "Apple · B&H", category: "Hardware", model: "lifetime",
    priceText: "Up to $300 off",
    tagline: "High-memory machines for local work.",
    description: "B&H Photo had up to $300 off M5 MacBook Pros when checked. 16GB minimum recommended for local tooling.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "$300 OFF", discountPct: 12,
    cta: "https://www.bhphotovideo.com/", source: "Tech Cing", sourceUrl: TC, checkedOn: "15 Nov", ends: "rolling"
  },

  /* ---- Added from the expanded source directory (checked 17 Nov) --- */
  {
    id: "pixara-ai", name: "Pixara AI", vendor: "Pixara", category: "AI Tools", model: "annual",
    tagline: "27 video + 28 image models in one studio.",
    description: "Up to 70% off yearly plans: Pro $20/mo (was $60), Ultimate $75/mo (was $250). No code needed.",
    originalPrice: 60, dealPrice: 20, per: "/mo yr", discountLabel: "67% OFF", discountPct: 67,
    cta: "https://saasblackfriday.online/go/pixara-ai/", source: "SaaS Black Friday", sourceUrl: SBF, checkedOn: "17 Nov", ends: "30 Nov"
  },
  {
    id: "prowritingaid", name: "ProWritingAid", vendor: "ProWritingAid", category: "Software", model: "annual",
    tagline: "50% off yearly and lifetime plans.",
    description: "Premium and Premium Pro yearly and lifetime plans 50% off, plus 25% off Story Credits.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "50% OFF", discountPct: 50, priceText: "50% off annual + lifetime",
    cta: "https://prowritingaid.com/", source: "SaaS Black Friday", sourceUrl: SBF, checkedOn: "17 Nov", ends: "4 Dec"
  },
  {
    id: "translatewp", name: "TranslateWP", vendor: "TranslateWP", category: "Software", model: "annual",
    tagline: "$59/yr with the renewal price locked.",
    description: "Orbital plan at $59/year, down from $119, with the discount locked in on renewals. Rare structural saving.",
    originalPrice: 119, dealPrice: 59, per: "/yr", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://translatewp.com/", source: "blackfriday.tools", sourceUrl: BFT, checkedOn: "17 Nov", ends: "7 Dec"
  },
  {
    id: "seedeo", name: "Seedeo", vendor: "Seedeo", category: "AI Tools", model: "credits",
    priceText: "20,000 credits for $99",
    tagline: "Non-expiring AI video credits.",
    description: "20,000 non-expiring credits for $99 instead of $259.90. Credit packs, not a subscription.",
    originalPrice: 259.9, dealPrice: 99, per: "credits", discountLabel: "62% OFF", discountPct: 62,
    cta: "https://blackfriday.tools/deals/seedeo", source: "blackfriday.tools", sourceUrl: BFT, checkedOn: "17 Nov", ends: "30 Nov"
  },
  {
    id: "citation-rocket", name: "Citation Rocket", vendor: "Citation Rocket", category: "Software", model: "lifetime",
    tagline: "AI citation tracking, lifetime licence.",
    description: "40% off the lifetime licence: $59 instead of $99. Agency with white-label PDF reports $89, down from $149.",
    originalPrice: 99, dealPrice: 59, per: "once", discountLabel: "40% OFF", discountPct: 40,
    cta: "https://blackfriday.tools/deals/citation-rocket", source: "blackfriday.tools", sourceUrl: BFT, checkedOn: "17 Nov", ends: "2 Dec"
  },
  {
    id: "layerwise", name: "Layerwise", vendor: "Layerwise", category: "Software", model: "byok",
    modelLabel: "BYOK · 12 months",
    tagline: "Bring your own ChatGPT or Claude subscription.",
    description: "20% off all plans for 12 months, monthly or annual, when you build with your own ChatGPT or Claude subscription.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "20% OFF", discountPct: 20, priceText: "20% off for 12 months",
    cta: "https://layerwise.app/pricing", source: "Credit for Startups", sourceUrl: CFS, checkedOn: "16 Nov", ends: "2 Dec"
  },
  {
    id: "grackerai", name: "GrackerAI", vendor: "GrackerAI", category: "Software", model: "annual",
    tagline: "AI search visibility for B2B SaaS.",
    description: "20% off: Individual drops from $99/mo to $79.20/mo. AEO and GEO tracking for cybersecurity and B2B brands.",
    originalPrice: 99, dealPrice: 79.2, per: "/mo", discountLabel: "20% OFF", discountPct: 20,
    cta: "https://gracker.ai/blog/black-friday-deals", source: "Credit for Startups", sourceUrl: CFS, checkedOn: "16 Nov", ends: "15 Dec"
  },
  {
    id: "piloterr", name: "Piloterr", vendor: "Piloterr", category: "API & Dev", model: "annual",
    priceText: "50% off for 3 months",
    tagline: "Scraping API with browser rotation.",
    description: "Web-scraping API handling headless browsers and proxy rotation. 50% off for three months.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://www.piloterr.com/blackfriday", source: "Credit for Startups", sourceUrl: CFS, checkedOn: "16 Nov", ends: "rolling"
  },
  {
    id: "clipugc", name: "ClipUGC", vendor: "ClipUGC", category: "AI Tools", model: "annual",
    modelLabel: "First 2 months",
    tagline: "AI UGC videos from an App Store link.",
    description: "50% off any plan for the first two months. Professional drops from $14.99 to $7.50/month.",
    originalPrice: 14.99, dealPrice: 7.5, per: "/mo", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://clipugc.com/black-friday", source: "Credit for Startups", sourceUrl: CFS, checkedOn: "16 Nov", ends: "6 Dec"
  },
  {
    id: "coderick", name: "Coderick AI", vendor: "SiteGround", category: "Software", model: "annual",
    tagline: "AI site builder with hosting, half price.",
    description: "50% off all annual plans for the first year: Essential $50, Plus $100, Pro $200. Monthly plans and renewals full price.",
    originalPrice: 100, dealPrice: 50, per: "/yr", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://www.siteground.com/coderick-ai", source: "Credit for Startups", sourceUrl: CFS, checkedOn: "16 Nov", ends: "27 Nov"
  },
  {
    id: "magica", name: "Magica", vendor: "Magica", category: "Software", model: "lifetime",
    tagline: "Lifetime licence at $499.",
    description: "Lifetime access at $499, down from $1,999. Listed as a Black Friday only offer.",
    originalPrice: 1999, dealPrice: 499, per: "once", discountLabel: "75% OFF", discountPct: 75,
    cta: "https://blackfridayvault.com/deal/magica/", source: "Black Friday Vault", sourceUrl: BFV, checkedOn: "17 Nov", ends: "BF only"
  },
  {
    id: "rezi", name: "Rezi", vendor: "Rezi", category: "Software", model: "annual",
    modelLabel: "First 3 months",
    tagline: "AI CV builder, 70% off.",
    description: "70% off Pro for three months at $8.70/month, down from $29. Code Blackfriday2026.",
    originalPrice: 29, dealPrice: 8.7, per: "/mo", discountLabel: "70% OFF", discountPct: 70,
    cta: "https://blackfridayvault.com/deal/rezi/", source: "Black Friday Vault", sourceUrl: BFV, checkedOn: "17 Nov", ends: "rolling"
  },
  {
    id: "costgoat", name: "CostGoat", vendor: "CostGoat", category: "Software", model: "lifetime",
    tagline: "Track AI and cloud spend, pay once.",
    description: "50% off lifetime at $99, down from $199. Code FCBF26. Tracks AI, cloud and SaaS costs in real time.",
    originalPrice: 199, dealPrice: 99, per: "once", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://github.com/thuongtin/awesome-bfcm-2026", source: "thuongtin BFCM list", sourceUrl: THT, checkedOn: "17 Nov", ends: "1 Dec"
  },
  {
    id: "justdocz", name: "JustDocz", vendor: "DealMirror", category: "Software", model: "lifetime",
    tagline: "Private AI document search, $29 lifetime.",
    description: "AI-powered local document search with OCR at $29 lifetime, down from $149. DealMirror 30-day refund for regular buyers.",
    originalPrice: 149, dealPrice: 29, per: "once", discountLabel: "81% OFF", discountPct: 81,
    cta: "https://dealmirror.com/product/justdocz/", source: "DealMirror", sourceUrl: DM, checkedOn: "17 Nov", ends: "20 Nov"
  },
  {
    id: "radiantly", name: "Radiantly", vendor: "Radiantly", category: "AI Tools", model: "annual",
    modelLabel: "First year",
    tagline: "60% off the first annual payment.",
    description: "Pro $91.20/year (was $228), Max $283.20/year. New users only, code BF60.",
    originalPrice: 228, dealPrice: 91.2, per: "/yr", discountLabel: "60% OFF", discountPct: 60,
    cta: "https://blackfridayvault.com/deal/radiantly/", source: "Black Friday Vault", sourceUrl: BFV, checkedOn: "17 Nov", ends: "rolling"
  },

  /* ---- AppSumo Black Friday 2026 · Drop 1 (checked 17 Nov) -------- */
  {
    id: "visby", name: "Visby", vendor: "AppSumo", category: "Software", model: "lifetime",
    tagline: "Track AI brand mentions and GEO gaps.",
    description: "GEO and AI search optimisation: benchmark share of voice and close SEO/GEO content gaps. Tier 1 $79, $958 reference. Price rose from $69 when Drop 1's 48h window ended.",
    originalPrice: 958, dealPrice: 79, per: "once", discountLabel: "92% OFF", discountPct: 92,
    cta: "https://appsumo.com/products/visby/", source: "AppSumo", sourceUrl: AS, checkedOn: "19 Nov", ends: "2 Dec"
  },
  {
    id: "press-ranger", name: "Press Ranger", vendor: "AppSumo", category: "Software", model: "lifetime",
    tagline: "AI journalist pitching, inside your chatbot.",
    description: "Find and pitch journalists and podcasters; MCP server runs campaigns from Claude, ChatGPT and Codex. Tier 1 $74, $500 reference.",
    originalPrice: 500, dealPrice: 74, per: "once", discountLabel: "85% OFF", discountPct: 85,
    cta: "https://appsumo.com/products/press-ranger/", source: "AppSumo", sourceUrl: AS, checkedOn: "19 Nov", ends: "2 Dec"
  },
  {
    id: "emailit", name: "Emailit", vendor: "AppSumo", category: "API & Dev", model: "lifetime",
    tagline: "Transactional email via REST API or SMTP.",
    description: "Send transactional email through a REST API or SMTP relay, with marketing campaigns and automations. 217 reviews. Price rose from $54 after Drop 1's window.",
    originalPrice: 288, dealPrice: 64, per: "once", discountLabel: "78% OFF", discountPct: 78,
    cta: "https://appsumo.com/products/emailit/", source: "AppSumo", sourceUrl: AS, checkedOn: "19 Nov", ends: "2 Dec"
  },
  {
    id: "clugtm", name: "CluGTM", vendor: "AppSumo", category: "Software", model: "lifetime",
    tagline: "AI lead research across 1B+ profiles.",
    description: "Formerly Cleanlist AI. Search over a billion profiles, enrich from 25+ providers and research leads with AI. 133 reviews. Tier 1 now $89, not $79.",
    originalPrice: 600, dealPrice: 89, per: "once", discountLabel: "85% OFF", discountPct: 85,
    cta: "https://appsumo.com/products/clugtm/", source: "AppSumo", sourceUrl: AS, checkedOn: "19 Nov", ends: "2 Dec"
  },
  {
    id: "robinreach", name: "RobinReach", vendor: "AppSumo", category: "Software", model: "lifetime",
    tagline: "AI social content across 13 platforms.",
    description: "Automate social publishing across 13 platforms with AI content creation, repurposing and MCP integration. 123 reviews. Tier 1 now $79.",
    originalPrice: 99, dealPrice: 79, per: "once", discountLabel: "20% OFF", discountPct: 20,
    cta: "https://appsumo.com/products/robinreach/", source: "AppSumo", sourceUrl: AS, checkedOn: "19 Nov", ends: "2 Dec"
  },

  /* ---- From the three submitted crawl targets (checked 18 Nov) ---- */
  {
    id: "sbl-so", name: "Sbl.so", vendor: "AppSumo", category: "AI Tools", model: "lifetime",
    tagline: "AI LinkedIn outreach and lead qualification.",
    description: "AI writes replies, clones voice notes, extracts leads from an ideal-customer prompt and books calls once a prospect qualifies. Tier 1 now $99 (was $1,188).",
    originalPrice: 1188, dealPrice: 99, per: "once", discountLabel: "92% OFF", discountPct: 92,
    cta: "https://appsumo.com/products/sbl/", source: "AppSumo", sourceUrl: AS, checkedOn: "19 Nov", ends: "2 Dec"
  },
  {
    id: "fraud-blocker", name: "Fraud Blocker", vendor: "AppSumo", category: "Software", model: "lifetime",
    tagline: "Ad-fraud detection with your own AI model.",
    description: "Plus Exclusive. Detects fake clicks from 500M+ ad clicks of training data; choose OpenAI or Claude for plain-language explanations of blocked IPs.",
    originalPrice: 396, dealPrice: 89, per: "once", discountLabel: "78% OFF", discountPct: 78,
    cta: "https://appsumo.com/products/fraud-blocker/", source: "AppSumo", sourceUrl: AS, checkedOn: "19 Nov", ends: "2 Dec"
  },
  {
    id: "boostspace-agentos", name: "Boost.space AgentOS", vendor: "AppSumo", category: "AI Tools", model: "lifetime",
    tagline: "Manage AI agents across 1,400+ models.",
    description: "Role-based access, 1,400+ AI models, 21B data records and value tracking. Early-access lifetime price now live on the BF hub.",
    originalPrice: 299, dealPrice: 89, per: "once", discountLabel: "70% OFF", discountPct: 70,
    cta: "https://appsumo.com/products/boostspaceagents/", source: "AppSumo", sourceUrl: AS, checkedOn: "18 Nov", ends: "2 Dec"
  },
  {
    id: "vistacreate", name: "VistaCreate", vendor: "AppSumo", category: "Software", model: "lifetime",
    tagline: "AI-assisted design for small business.",
    description: "Social posts, ads, product listings and print materials with AI. 370 reviews. Reference list price $399.",
    originalPrice: 399, dealPrice: 109, per: "once", discountLabel: "73% OFF", discountPct: 73,
    cta: "https://appsumo.com/products/vistacreate/", source: "AppSumo", sourceUrl: AS, checkedOn: "18 Nov", ends: "2 Dec"
  },
  {
    id: "depositphotos", name: "DepositPhotos", vendor: "AppSumo", category: "Software", model: "lifetime",
    tagline: "Stock library with a generative AI tool.",
    description: "Millions of royalty-free assets plus generative AI. 559 reviews. Reference list price $300.",
    originalPrice: 300, dealPrice: 59, per: "once", discountLabel: "80% OFF", discountPct: 80,
    cta: "https://appsumo.com/products/depositphotos/", source: "AppSumo", sourceUrl: AS, checkedOn: "18 Nov", ends: "2 Dec"
  },
  {
    id: "botsify", name: "Botsify", vendor: "Botsify", category: "AI Tools", model: "lifetime",
    priceText: "Lifetime from $399",
    tagline: "AI agents for support and lead gen.",
    description: "One-time plans: Business $399 (3 agents), Agency $799 (unlimited agents, white-label, voice), Agency Unlimited $999. No reference price published.",
    originalPrice: 0, dealPrice: 399, per: "once", discountLabel: "LIFETIME", discountPct: 0,
    cta: "https://botsify.com/black-friday", source: "6amtech", sourceUrl: SXT, checkedOn: "18 Nov", ends: "5 Dec"
  },
  {
    id: "ai-bud-wp", name: "AI Bud WP", vendor: "OttoKit", category: "Software", model: "annual",
    priceText: "50% off",
    tagline: "In-dashboard AI for WordPress content and SEO.",
    description: "OttoKit's roundup lists 50% off with no absolute price printed. Confirm the price on the vendor page before buying.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://ottokit.com/blog/top-black-friday-deals/", source: "OttoKit", sourceUrl: OT, checkedOn: "18 Nov", ends: "rolling"
  },
  {
    id: "ottokit-lifetime", name: "OttoKit", vendor: "OttoKit", category: "Software", model: "lifetime",
    priceText: "64% off lifetime",
    tagline: "Automation platform, 64% off lifetime.",
    description: "64% off lifetime plans, auto-applied, valid 17 Nov to 5 Dec. The headline moved from 57% to 64% on 19 Nov.",
    originalPrice: 0, dealPrice: 0, per: "", discountLabel: "64% OFF", discountPct: 64,
    cta: "https://ottokit.com/blog/top-black-friday-deals/", source: "OttoKit", sourceUrl: OT, checkedOn: "19 Nov", ends: "5 Dec"
  },

  /* ---- AppSumo Drop 2: AI Agents & Automation (checked 19 Nov) ----- */
  {
    id: "dm-champ", name: "DM Champ", vendor: "AppSumo", category: "AI Tools", model: "lifetime",
    tagline: "AI sales agent for DM apps.",
    description: "AI agent that closes deals 24/7 in WhatsApp, Instagram, iMessage and other DM apps. Tier 1 $59, $804 reference.",
    originalPrice: 804, dealPrice: 59, per: "once", discountLabel: "93% OFF", discountPct: 93,
    cta: "https://appsumo.com/products/dm-champ/", source: "AppSumo", sourceUrl: AS2, checkedOn: "19 Nov", ends: "20 Nov"
  },
  {
    id: "lety-ai", name: "Lety.ai", vendor: "AppSumo", category: "AI Tools", model: "lifetime",
    tagline: "Sell white-label AI agents.",
    description: "Agentic CRM with 900+ MCP integrations and subscription billing for reselling AI agents. Tier 1 $69, $299 reference.",
    originalPrice: 299, dealPrice: 69, per: "once", discountLabel: "77% OFF", discountPct: 77,
    cta: "https://appsumo.com/products/lety-ai/", source: "AppSumo", sourceUrl: AS2, checkedOn: "19 Nov", ends: "20 Nov"
  },
  {
    id: "zerowork", name: "ZeroWork", vendor: "AppSumo", category: "AI Tools", model: "lifetime",
    tagline: "No-code AI browser automation.",
    description: "Scrape data, generate leads and run social tasks with no-code AI browser automation. Tier 1 $99, $488 reference.",
    originalPrice: 488, dealPrice: 99, per: "once", discountLabel: "80% OFF", discountPct: 80,
    cta: "https://appsumo.com/products/zerowork/", source: "AppSumo", sourceUrl: AS2, checkedOn: "19 Nov", ends: "20 Nov"
  },
  {
    id: "dialora", name: "Dialora", vendor: "AppSumo", category: "AI Tools", model: "lifetime",
    tagline: "No-code AI voice agent for calls.",
    description: "Answers calls, qualifies leads and books appointments 24/7 with a no-code AI voice agent. Tier 1 $59, $989 reference.",
    originalPrice: 989, dealPrice: 59, per: "once", discountLabel: "94% OFF", discountPct: 94,
    cta: "https://appsumo.com/products/dialora/", source: "AppSumo", sourceUrl: AS2, checkedOn: "19 Nov", ends: "20 Nov"
  },
  {
    id: "kavout", name: "Kavout", vendor: "AppSumo", category: "AI Tools", model: "lifetime",
    tagline: "AI research agents for market data.",
    description: "Turns real-time market data into actionable insights with AI research agents. Tier 1 $69, $124 reference.",
    originalPrice: 124, dealPrice: 69, per: "once", discountLabel: "44% OFF", discountPct: 44,
    cta: "https://appsumo.com/products/kavout/", source: "AppSumo", sourceUrl: AS2, checkedOn: "19 Nov", ends: "20 Nov"
  },
  {
    id: "blip-ai", name: "Blip AI", vendor: "AppSumo", category: "AI Tools", model: "lifetime",
    tagline: "Speech-to-text with a hotkey.",
    description: "Turn speech into ready-to-send text in any app with one hotkey. Tier 1 $59, $144 reference.",
    originalPrice: 144, dealPrice: 59, per: "once", discountLabel: "59% OFF", discountPct: 59,
    cta: "https://appsumo.com/products/blip-ai/", source: "AppSumo", sourceUrl: AS2, checkedOn: "19 Nov", ends: "20 Nov"
  },
  {
    id: "triplo-ai", name: "Triplo AI", vendor: "AppSumo", category: "AI Tools", model: "lifetime",
    tagline: "AI agent in any app, any model.",
    description: "Rewrite, search your docs and delegate to an AI agent from any app with one hotkey and any model. Tier 1 $69, $102 reference.",
    originalPrice: 102, dealPrice: 69, per: "once", discountLabel: "32% OFF", discountPct: 32,
    cta: "https://appsumo.com/products/triplo-ai/", source: "AppSumo", sourceUrl: AS2, checkedOn: "19 Nov", ends: "20 Nov"
  },
  {
    id: "amical", name: "Amical", vendor: "AppSumo", category: "AI Tools", model: "lifetime",
    tagline: "Local or cloud dictation, 100+ languages.",
    description: "Turn speech into polished text in any app with local or cloud AI and support for 100+ languages. Tier 1 $49, $180 reference.",
    originalPrice: 180, dealPrice: 49, per: "once", discountLabel: "73% OFF", discountPct: 73,
    cta: "https://appsumo.com/products/amical/", source: "AppSumo", sourceUrl: AS2, checkedOn: "19 Nov", ends: "20 Nov"
  },
  {
    id: "backlinkgenie", name: "BacklinkGenie", vendor: "BacklinkGenie", category: "Software", model: "annual",
    tagline: "AI link-building agent with an MCP server.",
    description: "Finds posts where your product belongs, writes each pitch for your approval, sends and follows up, and checks won links stay live. 50% off yearly or 30% off monthly, every billing cycle while subscribed; Starter $990 to $495/yr.",
    originalPrice: 990, dealPrice: 495, per: "/yr", discountLabel: "50% OFF", discountPct: 50,
    cta: "https://backlinkgenie.com/black-friday/?utm_source=bfstack&utm_medium=deal&utm_campaign=bfcm2026", source: "dqhieu/black-friday-deals", sourceUrl: "https://github.com/dqhieu/black-friday-deals", checkedOn: "25 Nov", ends: "31 Dec"
  }
];

/* Big names with no live offer at check time — shown as a watchlist. */
window.BFAI_NO_DEAL = [
  "ChatGPT", "Claude", "Gemini", "Cursor", "GitHub Copilot",
  "Midjourney", "Perplexity", "Grammarly", "Notion", "HeyGen",
  "Descript", "Canva", "Ahrefs", "Semrush"
];

/* 20 additional deal sources, each checked as a live page on 17 Nov 2026.
   type: Tracker | GitHub list | Marketplace | Verification tool */
window.BFAI_SOURCE_DIRECTORY = [
  { name: "blackfriday.tools", type: "Tracker", url: "https://blackfriday.tools/", note: "Hand-verified SaaS and AI deals with expiry tracked to the minute; 20 live AI deals at check. Exposes an MCP/API feed." },
  { name: "SaaS Black Friday", type: "Tracker", url: "https://saasblackfriday.online/?status=live", note: "240+ SaaS and AI tools across 14 categories, with per-tool deal history labelled by year and email alerts." },
  { name: "Black Friday AI Tools", type: "Tracker", url: "https://blackfridayai.tools/", note: "20 AI tools tracked, offers checked against official pricing pages; states confirmed-offer and verified-brand counts." },
  { name: "Credit for Startups", type: "Tracker", url: "https://creditforstartups.com/black-friday-software-deals", note: "Strong AI-tool and startup-credit coverage, with a visible 'no deal found' column for big names." },
  { name: "AIDeals.app", type: "Tracker", url: "https://aideals.app/deals/black-friday", note: "Dated codes, end dates and price-history pages; also publishes a buyer FAQ on caps and renewal traps." },
  { name: "Black Friday Vault", type: "Tracker", url: "https://blackfridayvault.com/", note: "132 live deals with AI filters, working codes and community ranking; alerts by category and minimum discount." },
  { name: "Black Friday Times", type: "Tracker", url: "https://blackfridaytimes.com/", note: "Directory focused on tools for makers — AI, dev, design and marketing software, with early-BF status labels." },
  { name: "Black Friday Deals for Devs", type: "Tracker", url: "https://blackfridaydeals.dev/", note: "Curated BFCM hub for developers and designers: AI tools, hosting, courses and design resources." },
  { name: "trungdq88 Awesome BFCM", type: "GitHub list", url: "https://github.com/trungdq88/Awesome-Black-Friday-Cyber-Monday", note: "7.5k stars, hand-reviewed software-only list from the maker of TypingMind. Explicitly rejects half-finished AI slop." },
  { name: "mRs-/Black-Friday-Deals", type: "GitHub list", url: "https://github.com/mRs-/Black-Friday-Deals", note: "2.3k stars; the reference macOS/iOS software list, with a substantial AI-tools section." },
  { name: "twf-nikhila BFCM list", type: "GitHub list", url: "https://github.com/twf-nikhila/Awesome-Black-Friday-Cyber-Monday-deals", note: "Structured categories including AI assistants, SEO visibility, developer tools and Mac utilities." },
  { name: "LabEx BFCM deals", type: "GitHub list", url: "https://github.com/labex-labs/black-friday-cyber-monday-deals", note: "Curated developer, cloud, security and AI deals in price/code/end-date tables." },
  { name: "Pimjo black-friday-deals", type: "GitHub list", url: "https://github.com/Pimjo/black-friday-deals", note: "11 categories for developers and designers; official links only, active or upcoming deals, PR-reviewed within 48h." },
  { name: "thuongtin awesome-bfcm-2026", type: "GitHub list", url: "https://github.com/thuongtin/awesome-bfcm-2026", note: "Deeply categorised 2026 list covering AI/SaaS, dev tools, hosting and electronics; updated daily." },
  { name: "AppSumo", type: "Marketplace", url: "https://appsumo.com/", note: "The main lifetime-deal marketplace. 2026 sale started 16 Nov with themed 48-hour drops and a 60-day refund promise." },
  { name: "StackSocial", type: "Marketplace", url: "https://stacksocial.com/", note: "AI bundles and lifetime subscriptions with review counts; check individual listing terms carefully." },
  { name: "LTD Explorer", type: "Tracker", url: "https://ltdexplorer.com/blog/black-friday-lifetime-deals-2026", note: "Tracks AppSumo, RocketHub, Earlybird, Dealify, DealMirror and StackSocial; flags guessed versus vendor-confirmed dates." },
  { name: "DealMirror", type: "Marketplace", url: "https://dealmirror.com/", note: "Secondary LTD marketplace with many niche AI tools; 30-day refund for regular buyers, 60 days for Prime." },
  { name: "PCPartPicker", type: "Verification tool", url: "https://pcpartpicker.com/", note: "Part-level price history and cross-retailer comparison. The right way to verify an AI-workstation 'discount' in a shortage year." },
  { name: "Keepa", type: "Verification tool", url: "https://keepa.com/", note: "Amazon price history back to 2011, stock and seller data, with a free browser extension — catches inflated 'was' prices." }
];
