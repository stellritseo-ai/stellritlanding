import liveNation from "@/assets/case-livenation.jpg";
import upli from "@/assets/case-upli.jpg";
import tilton from "@/assets/case-tilton.jpg";
import newscorp from "@/assets/case-newscorp.jpg";

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  industry: string;
  tags: string[];
  hero: string;
  ratio: string;
  align: "left" | "right";
  offsetY?: string;
  overview: string;
  challenge: string;
  approachIntro?: string;
  approach: string[];
  results: { value: string; label: string }[];
  impactTable?: { metric: string; before: string; after: string }[];
  services: string[];
  gallery: { src: string; caption?: string; tall?: boolean }[];
  quote: { text: string; author: string; role: string };
  nextSlug: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "impressions-to-clicks",
    title: "Converting Impressions to Clicks",
    subtitle: "Converting ad impressions into action for National Home Services",
    client: "National Home Services (home warranty & repair lead generation)",
    year: "2024",
    industry: "SEM & Conversion Optimization",
    tags: ["SEM Strategy", "A/B Testing", "Conversion Rate", "SEO"],
    hero: liveNation,
    ratio: "aspect-[16/10]",
    align: "left",
    overview:
      "National Home Services generated millions of ad impressions, but struggled to turn eyeballs into actionable phone calls and form submissions. We engineered an intent-driven landing page optimization strategy that aligned user search intent directly with high-converting value propositions.",
    challenge: "2M+ monthly ad impressions but a CTR of only 1.2%. High visibility, low action.",
    approachIntro: "We optimized every step between “saw” and “clicked”:",
    approach: [
      "Aligned Search Intent – Rewrote 45 landing pages to match specific user queries (“emergency AC repair” vs. “scheduled maintenance”).",
      "Wrote Compelling Headlines – Tested emotional triggers, numbers, and value props. Winner: “No AC in August? See a fix in 2 hours.”",
      "Optimized Meta Descriptions – Kept every snippet under 160 characters with a clear CTA: “Get Free Quote.”",
      "Implemented Schema Markup – Added FAQ and review rich snippets to search results.",
      "A/B Tested Visuals – Swapped generic stock photos for real customer before/after images and high-contrast orange CTAs.",
    ],
    results: [
      { value: "4.7%", label: "CTR" },
      { value: "↓62%", label: "Cost-per-click" },
      { value: "↑215%", label: "Qualified form fills" },
      { value: "2M+", label: "Monthly Impressions" },
    ],
    impactTable: [
      { metric: "CTR", before: "1.2%", after: "4.7%" },
      { metric: "Cost-per-click", before: "Baseline", after: "↓62%" },
      { metric: "Qualified form fills", before: "Baseline", after: "↑215%" },
    ],
    services: ["SEM Strategy", "Copywriting", "A/B Testing", "Schema Engineering"],
    gallery: [
      { src: liveNation, caption: "Intent-mapped local search campaign flows", tall: false },
      { src: tilton, caption: "Before & after performance dashboard", tall: true },
      { src: newscorp, caption: "Head-to-head ad copy variation tests", tall: false },
      { src: upli, caption: "Mobile landing page variants", tall: false },
    ],
    quote: {
      text: "Impressions are vanity. Clicks are sanity. Fix intent, headlines, and visuals first.",
      author: "STELLR IT Takeaway",
      role: "Key Takeaway",
    },
    nextSlug: "ux-ui-conversions",
  },
  {
    slug: "ux-ui-conversions",
    title: "How UX/UI Increases Conversion Rates",
    subtitle: "Redesigning Finvise to reduce bounce rates and maximize signups",
    client: "Finvise (investment advisory startup)",
    year: "2024",
    industry: "Fintech / Advisory",
    tags: ["UX/UI Design", "Frictionless Checkout", "Conversion Optimization"],
    hero: upli,
    ratio: "aspect-[9/11]",
    align: "right",
    offsetY: "md:mt-24",
    overview:
      "Finvise, an investment advisory startup, faced severe dropoffs on its critical pricing and onboarding steps. We overhauled the user experience structure to introduce a frictionless 4-field sign-up process, thumb-optimized components, and a clear visual hierarchy.",
    challenge: "58% bounce rate on pricing page. 72% abandonment on a 3-step signup form.",
    approach: [
      "Simplified Navigation – Reduced menu items from 11 to 5. Added a sticky CTA ('Start Investing') on every page.",
      "Optimized Layout Architecture – Moved risk-free guarantee and primary CTA above the fold.",
      "Enhanced Visual Hierarchy – Increased button size (44px → 64px). Used contrast (green vs. grey) + whitespace to draw the eye.",
      "Streamlined Checkout Flows – Cut 12 form fields down to 4 (name, email, phone, investment goal). Added progress indicator.",
      "Accelerated Mobile Responsiveness – Thumb-optimized tap targets. Achieved 2-second load time on 4G.",
    ],
    results: [
      { value: "27%", label: "Bounce rate" },
      { value: "41%", label: "Signup completion" },
      { value: "+$1.2M", label: "AUM in 3 Months" },
      { value: "3.4×", label: "Signup conversion rate" },
    ],
    impactTable: [
      { metric: "Bounce rate", before: "58%", after: "27%" },
      { metric: "Signup completion", before: "72% abandonment", after: "41% completion" },
      { metric: "AUM (assets under management)", before: "Baseline", after: "+$1.2M in 3 months" },
    ],
    services: ["UX Research", "Frictionless Checkout Design", "UI Design System", "Conversion Optimization"],
    gallery: [
      { src: upli, caption: "Optimized 4-field checkout form interface", tall: true },
      { src: liveNation, caption: "Pricing matrix hierarchy revisions", tall: false },
      { src: newscorp, caption: "Mobile interface responsive layouts", tall: true },
      { src: tilton, caption: "User onboarding navigation maps", tall: false },
    ],
    quote: {
      text: "Every extra form field costs you customers. Remove friction, not features.",
      author: "STELLR IT Takeaway",
      role: "Key Takeaway",
    },
    nextSlug: "cybersecurity-zero-trust",
  },
  {
    slug: "cybersecurity-zero-trust",
    title: "Cybersecurity – Zero Trust for a Financial Institution",
    subtitle: "Deploying complete security framework for Meridian Trust Bank",
    client: "Meridian Trust Bank (mid-sized, 8 branches, 45,000 customers)",
    year: "2023",
    industry: "Financial Services / Banking",
    tags: ["Zero Trust Architecture", "Multi-Factor Authentication", "Compliance", "SIEM"],
    hero: newscorp,
    ratio: "aspect-[16/11]",
    align: "left",
    offsetY: "md:-mt-16",
    overview:
      "Meridian Trust Bank was vulnerable to phishing and ransomware attacks, threatening their compliance standing. We deployed a unified Zero Trust Network Access (ZTNA) model, enforced biometric and hardware MFA, and built automated SIEM alert playbooks.",
    challenge: "12+ phishing incidents per week. No unified incident response plan. IT team spent 20 hours/week manually hunting threats. Compliance audit at risk.",
    approach: [
      "Zero Trust Network Access (ZTNA) – Replaced legacy VPN. Verified every access request continuously (user, device, location).",
      "Mandatory Multi-Factor Authentication (MFA) – Enforced for all 520 employees + third-party vendors. Hardware tokens + biometric fallback.",
      "Unified Incident Response Plan – Created 4 playbooks (phishing, ransomware, credential theft, insider threat). Automated alert-to-remediation via SIEM integration.",
      "Ongoing Phishing Simulations – Monthly simulated attacks with real-time training for low-scoring employees.",
    ],
    results: [
      { value: "0–1", label: "Attempts / mo" },
      { value: "2%", label: "Click rate" },
      { value: "2h/wk", label: "IT threat hunting" },
      { value: "SOC 2", label: "Type II Certified" },
    ],
    impactTable: [
      { metric: "Successful unauthorized access attempts", before: "~35/month", after: "0–1/month" },
      { metric: "Phishing click rate", before: "18%", after: "2%" },
      { metric: "IT team time on incident response", before: "20 hours/week", after: "2 hours/week" },
      { metric: "Regulatory compliance", before: "At risk", after: "SOC 2 Type II achieved" },
    ],
    services: ["Zero Trust Integration", "Hardware MFA Deployment", "Incident Playbooks", "SIEM Automation"],
    gallery: [
      { src: newscorp, caption: "SIEM centralized alert dashboard", tall: false },
      { src: tilton, caption: "ZTNA secure endpoint gateway configurations", tall: true },
      { src: upli, caption: "Phishing simulation analytics reports", tall: false },
      { src: liveNation, caption: "Zero Trust verification logs", tall: false },
    ],
    quote: {
      text: "Trust is a vulnerability. Zero Trust is a strategy.",
      author: "STELLR IT Takeaway",
      role: "Key Takeaway",
    },
    nextSlug: "impressions-to-clicks",
  },
];

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((c) => c.slug === slug);
