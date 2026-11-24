/**
 * Server-side bot protection, vulnerability-probe blocking, and sliding-window rate limiting.
 *
 * Allows legitimate search engines & social link-preview crawlers (Google, Bing, Apple,
 * DuckDuckGo, LinkedIn, Twitter/X, Slack, WhatsApp, Discord) while blocking aggressive
 * scrapers, bulk AI training bots, headless automation tools, and vulnerability scanners
 * before they reach SSR, MongoDB, email notifications, or Gemini AI endpoints.
 */

// Legitimate search engines, on-demand AI search bots & social preview crawlers — NEVER block these
const GOOD_BOT_RE =
  /\b(googlebot|google-inspectiontool|googleother|adsbot-google|mediapartners-google|bingbot|bingpreview|msnbot|applebot|duckduckbot|duckassistbot|twitterbot|linkedinbot|slackbot|whatsapp|discordbot|facebookexternalhit|telegrambot|oai-searchbot|chatgpt-user|perplexitybot|perplexity-user|claude-searchbot|vercel-screenshot|uptime|statuscake)\b/i;

// Known aggressive scrapers, spam bots, bulk AI crawlers, headless tools, and scanners
const BAD_BOT_RE =
  /(ahrefsbot|semrushbot|mj12bot|dotbot|blexbot|dataforseobot|bytespider|petalbot|barkrowler|megaindex|ccbot|gptbot|claudebot|claude-web|anthropic-ai|amazonbot|meta-externalagent|facebookbot|cohere-ai|imagesiftbot|diffbot|omgilibot|omgili|turnitinbot|zoominfobot|seekport|sentibot|yandexbot|baiduspider|sogou|seznambot|scrapy|python-requests|python-urllib|python-httpx|aiohttp|httpx|go-http-client|java\/|libwww-perl|perl|wget|httrack|curl\/|httpie|sqlmap|nikto|nmap|masscan|zgrab|nuclei|censysinspect|shodan|headlesschrome|phantomjs|slimerjs|selenium|playwright|puppeteer|node-fetch|undici|axios\/|postmanruntime|insomnia)/i;

// Any generic bot/crawler/spider UA (used to exclude bots from visitor analytics & forms)
const ANY_BOT_RE =
  /(bot|crawler|spider|scraper|headless|phantom|selenium|playwright|puppeteer|curl|wget|python|go-http|java\/|perl|libwww|axios|postman|insomnia|lighthouse|pagespeed|gtmetrix|pingdom)/i;

// Common WordPress / PHP / secret-file vulnerability probe paths
const PROBE_PATH_RE =
  /^\/(wp-admin|wp-login|wp-content|wp-includes|wp-json|xmlrpc\.php|phpmyadmin|pma|myadmin|mysql|admin\.php|config\.php|setup\.php|install\.php|shell\.php|eval-stdin\.php|cgi-bin|boaform|actuator|vendor\/phpunit|\.env|\.git|\.svn|\.hg|\.DS_Store|\.well-known\/(?:eval|shell)|autodiscover)/i;

// ── Bounded Sliding-Window Rate Limiter ──────────────────────────────────────
interface RateEntry {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateEntry>();
const MAX_BUCKETS = 5000;

function pruneBuckets(now: number) {
  if (rateBuckets.size < MAX_BUCKETS) return;
  for (const [k, v] of rateBuckets) {
    if (v.resetAt <= now) rateBuckets.delete(k);
  }
  // If still above cap under extreme flood, evict oldest entries
  if (rateBuckets.size >= MAX_BUCKETS) {
    const excess = rateBuckets.size - Math.floor(MAX_BUCKETS * 0.8);
    let removed = 0;
    for (const k of rateBuckets.keys()) {
      rateBuckets.delete(k);
      if (++removed >= excess) break;
    }
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  pruneBuckets(now);

  const existing = rateBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSec: 0 };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
export function getClientIpFromRequest(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp =
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-vercel-forwarded-for");
  return realIp?.trim() || "unknown";
}

export function isGoodBot(userAgent: string): boolean {
  return GOOD_BOT_RE.test(userAgent);
}

export function isBlockedBot(userAgent: string): boolean {
  const ua = userAgent.trim();
  if (!ua || ua.length < 10) return true;
  if (GOOD_BOT_RE.test(ua)) return false;
  return BAD_BOT_RE.test(ua);
}

export function isAnyBotUserAgent(userAgent: string): boolean {
  const ua = userAgent.trim();
  if (!ua || ua.length < 10) return true;
  return GOOD_BOT_RE.test(ua) || BAD_BOT_RE.test(ua) || ANY_BOT_RE.test(ua);
}

export function isSpamText(text: string): boolean {
  if (!text) return false;
  // Excessive links are a strong automated spam signal
  const urlMatches = text.match(/https?:\/\/|www\./gi);
  if (urlMatches && urlMatches.length > 3) return true;
  // Classic SEO/casino/crypto spam phrases
  if (/\b(viagra|cialis|casino online|crypto recovery|buy backlinks|adult dating|seo rank #1)\b/i.test(text)) {
    return true;
  }
  return false;
}

// Static asset extensions that should skip rate-limit overhead
const STATIC_EXT_RE = /\.(?:js|css|png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|eot|mp4|webm|map|json|xml|txt)$/i;

/**
 * Edge/Server request gate called at the entry of `src/server.ts`.
 * Returns a Response immediately to block bots/scanners/floods, or `null` to allow.
 */
export function inspectIncomingRequest(request: Request): Response | null {
  let pathname = "/";
  try {
    pathname = new URL(request.url).pathname;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  // Always serve robots.txt, llms.txt, and sitemaps cleanly
  if (
    pathname === "/robots.txt" ||
    pathname === "/llms.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/sitemap-images.xml"
  ) {
    return null;
  }

  // 1. Instantly reject CMS / PHP / dotfiles vulnerability probes before SSR or DB runs
  if (PROBE_PATH_RE.test(pathname) || /\.php$/i.test(pathname)) {
    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
    });
  }

  // Allow static assets through cleanly
  if (STATIC_EXT_RE.test(pathname) || pathname.startsWith("/assets/")) {
    return null;
  }

  const ua = request.headers.get("user-agent") || "";
  const ip = getClientIpFromRequest(request);

  // Allow localhost / local dev traffic without UA friction
  const isLocal = ip === "127.0.0.1" || ip === "::1" || ip === "unknown";

  // 2. Block known bad scrapers, spam crawlers, and empty-UA bots
  if (!isLocal && isBlockedBot(ua)) {
    return new Response("Forbidden", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex, nofollow" },
    });
  }

  // 3. Block bots from hitting private/server-function routes directly
  const isServerFn = pathname.startsWith("/_serverFn");
  if (isServerFn && !isLocal && isAnyBotUserAgent(ua)) {
    return new Response("Forbidden", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // 4. Sliding-window per-IP rate limiting (skip good verified search bots on GET)
  if (!isLocal && !(request.method === "GET" && isGoodBot(ua))) {
    if (isServerFn || request.method === "POST") {
      const rl = checkRateLimit(`post:${ip}`, 40, 60_000);
      if (!rl.allowed) {
        return new Response("Too Many Requests", {
          status: 429,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "retry-after": String(rl.retryAfterSec),
          },
        });
      }
    } else {
      const rl = checkRateLimit(`page:${ip}`, 120, 60_000);
      if (!rl.allowed) {
        return new Response("Too Many Requests", {
          status: 429,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "retry-after": String(rl.retryAfterSec),
          },
        });
      }
    }
  }

  return null;
}

