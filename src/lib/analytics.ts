/**
 * Lightweight GTM dataLayer analytics helper for conversion & AI-search referral tracking.
 * Works with the existing Google Tag Manager container (GTM-NVSV2BZN) with zero extra scripts.
 */

const AI_REFERRER_PATTERNS: Array<{ source: string; match: RegExp }> = [
  { source: "chatgpt", match: /(^|\.)(chatgpt\.com|chat\.openai\.com)$/i },
  { source: "perplexity", match: /(^|\.)perplexity\.ai$/i },
  { source: "gemini", match: /(^|\.)(gemini\.google\.com|bard\.google\.com)$/i },
  { source: "copilot", match: /(^|\.)copilot\.microsoft\.com$/i },
  { source: "claude", match: /(^|\.)claude\.ai$/i },
  { source: "you", match: /(^|\.)you\.com$/i },
  { source: "phind", match: /(^|\.)phind\.com$/i },
];

export function trackEvent(event: string, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;
  try {
    const win = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({
      event,
      page_path: window.location.pathname,
      ...params,
    });
  } catch {
    // Never break UI interactions if dataLayer is blocked
  }
}

export function trackAiReferralOnce() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  try {
    if (sessionStorage.getItem("stellr_ai_ref_checked")) return;
    sessionStorage.setItem("stellr_ai_ref_checked", "1");

    const ref = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source") || "";

    let aiSource: string | null = null;
    if (ref) {
      try {
        const host = new URL(ref).hostname;
        const matched = AI_REFERRER_PATTERNS.find((p) => p.match.test(host));
        if (matched) aiSource = matched.source;
      } catch {
        // Ignore malformed referrer
      }
    }
    if (!aiSource && /^(chatgpt\.com|perplexity|gemini|copilot|claude)$/i.test(utmSource)) {
      aiSource = utmSource.toLowerCase().replace(".com", "");
    }

    if (aiSource) {
      trackEvent("ai_referral_visit", {
        ai_source: aiSource,
        referrer_url: ref || utmSource,
        landing_page: window.location.pathname,
      });
    }
  } catch {
    // Ignore storage restrictions
  }
}
