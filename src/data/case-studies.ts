import brand3Step from "@/assets/portfolio_collect/brand_building/3-Step-Hair-Growth.jpg";
import brandGoatMilk from "@/assets/portfolio_collect/brand_building/Goat-Milk.jpg";
import brandHairButter from "@/assets/portfolio_collect/brand_building/Hair-Butter.jpg";
import brandMobile from "@/assets/portfolio_collect/brand_building/Mobile.jpg";
import brandDesktop from "@/assets/portfolio_collect/brand_building/desktop.jpg";
import brandLaptop from "@/assets/portfolio_collect/brand_building/laptop.jpg";
import brandLaptop1 from "@/assets/portfolio_collect/brand_building/laptop1.jpg";
import brandProductHair from "@/assets/portfolio_collect/brand_building/product-hair-butter.jpg";

import prodPools1 from "@/assets/portfolio_collect/product_development/pools1.jpg";
import prodPools2 from "@/assets/portfolio_collect/product_development/pools2.jpg";
import prodPools3 from "@/assets/portfolio_collect/product_development/pools3.jpg";
import prodPools4 from "@/assets/portfolio_collect/product_development/pools4.jpg";
import prodProduct1 from "@/assets/portfolio_collect/product_development/product1.jpg";
import prodProduct2 from "@/assets/portfolio_collect/product_development/product2.jpg";
import prodProduct3 from "@/assets/portfolio_collect/product_development/product3.jpg";
import prodProduct4 from "@/assets/portfolio_collect/product_development/product4.jpg";

import mktgA1 from "@/assets/portfolio_collect/growth-marketing/a1.jpg";
import mktgA2 from "@/assets/portfolio_collect/growth-marketing/a2.jpg";

import aiA1 from "@/assets/portfolio_collect/ai_automation/a1.jpg";
import aiA2 from "@/assets/portfolio_collect/ai_automation/a2.jpg";

import appMobile1 from "@/assets/portfolio_collect/app_development/Mobile-1.jpg";
import appMobile2 from "@/assets/portfolio_collect/app_development/Mobile-2.jpg";
import appMobile from "@/assets/portfolio_collect/app_development/Mobile.jpg";
import appProd1 from "@/assets/portfolio_collect/app_development/product1.jpg";
import appProd2 from "@/assets/portfolio_collect/app_development/product2.jpg";
import appProd3 from "@/assets/portfolio_collect/app_development/product3.jpg";
import appProd4 from "@/assets/portfolio_collect/app_development/product4.jpg";

import web1A1 from "@/assets/portfolio_collect/websites/first/a1.jpg";
import web1A2 from "@/assets/portfolio_collect/websites/first/a2.jpg";
import web1A3 from "@/assets/portfolio_collect/websites/first/a3.jpg";

import poolsImg1 from "@/assets/portfolio_collect/pools/pools1.jpg";
import poolsImg2 from "@/assets/portfolio_collect/pools/pools2.jpg";
import poolsImg3 from "@/assets/portfolio_collect/pools/pools3.jpg";
import poolsImg4 from "@/assets/portfolio_collect/pools/pools4.jpg";

import web2B1 from "@/assets/portfolio_collect/websites/second/b1.jpg";
import web2B2 from "@/assets/portfolio_collect/websites/second/b2.jpg";
import web2B3 from "@/assets/portfolio_collect/websites/second/b3.jpg";

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
  projectUrl?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "brand-building",
    title: "TSR Skin & Hair Care Brand Identity",
    subtitle: "Creating a premium packaging identity and coherent digital guidelines",
    client: "TSR Organic Cosmetics LLC",
    year: "2026",
    industry: "Brand Strategy & Identity",
    tags: ["Brand Strategy", "Packaging Design", "Visual Identity", "Art Direction"],
    hero: brandDesktop,
    ratio: "aspect-[16/10]",
    align: "left",
    overview:
      "TSR required an identity that matched its natural science formulation values. We designed a holistic brand guideline package, detailed packaging textures, and responsive digital asset libraries that position the brand as a premium luxury provider in cosmetics.",
    challenge: "Inconsistent brand communication across retail partners, high bounce rates on product listings, and disjointed product packaging design language.",
    approachIntro: "Our senior design team refined the visual ecosystem:",
    approach: [
      "Designed Unified Packaging Systems – Formulated custom print-ready designs for Hair Butter, Goat Milk formula, and 3-step kits.",
      "Established Digital Color Palettes – Formulated elegant, muted natural gradients that optimize text contrast and readability.",
      "Engineered Brand Assets Directory – Provided central libraries of 3D renders, vector typography, and photography styles.",
      "Created Comprehensive Guidelines – Developed modular CSS variables and components to guarantee 100% brand consistency.",
    ],
    results: [
      { value: "+240%", label: "Brand Engagement" },
      { value: "+180%", label: "Inquiry Volume" },
      { value: "100%", label: "Consistent Guidelines" },
      { value: "24/7", label: "Brand Access" },
    ],
    impactTable: [
      { metric: "Inquiry Volume", before: "Baseline", after: "+180%" },
      { metric: "Guideline Compliance", before: "45%", after: "100%" },
      { metric: "Retail Onboarding Time", before: "4 weeks", after: "3 days" },
    ],
    services: ["Visual Identity Design", "Packaging Engineering", "Brand Book Development", "Art Direction"],
    gallery: [
      { src: brand3Step, caption: "TSR 3-Step Hair Growth packaging lineup" },
      { src: brandGoatMilk, caption: "Premium Goat Milk moisturizer packaging details" },
      { src: brandHairButter, caption: "Hair Butter product container mockup" },
      { src: brandMobile, caption: "Mobile brand book guidelines display", tall: true },
      { src: brandLaptop1, caption: "Responsive shop mockup view" },
      { src: brandProductHair, caption: "Natural ingredients and product closeups" },
    ],
    quote: {
      text: "Consistency is the soul of luxury. When packaging speaks the same language as the digital store, trust is immediate.",
      author: "STELLR IT Design Lead",
      role: "Art Director",
    },
    nextSlug: "ux-ui-conversions",
    projectUrl: "https://www.tsrskinandhaircare.com/",
  },
  {
    slug: "ux-ui-conversions",
    title: "Pingbuz SaaS Product Design",
    subtitle: "Redesigning Finvise to reduce bounce rates and maximize signups",
    client: "Finvise (investment advisory startup)",
    year: "2024",
    industry: "Fintech / Advisory",
    tags: ["UI/UX Design", "SaaS Dashboard", "Frictionless Flow", "Framer Motion"],
    hero: prodProduct4,
    ratio: "w-full aspect-[16/10]",
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
      { src: prodProduct1, caption: "Central analytics and investment dashboard view" },
      { src: prodProduct2, caption: "Streamlined 4-field signup flow on mobile devices" },
      { src: prodProduct3, caption: "Typography and component guidelines card mapping" },
    ],
    quote: {
      text: "Every extra form field costs you customers. Remove friction, not features.",
      author: "STELLR IT Takeaway",
      role: "Key Takeaway",
    },
    nextSlug: "ai-automation",
    projectUrl: "#",
  },
  {
    slug: "ai-automation",
    title: "Enterprise AI Automated Systems",
    subtitle: "Deploying autonomous AI support agent networks and automated task routing",
    client: "Meridian Trust Bank (Customer Support Automation Division)",
    year: "2026",
    industry: "AI Engineering & Automation",
    tags: ["AI Agents", "Workflow Automation", "NLP Routing", "Enterprise Integration"],
    hero: aiA1,
    ratio: "aspect-[16/11]",
    align: "left",
    overview:
      "Meridian Trust Bank wanted to reduce wait times and operational costs in its customer support queues. We architected a network of autonomous AI agents using natural language processing (NLP) to route and auto-resolve support tickets with high security compliance.",
    challenge: "High support ticket backlog, average response times exceeding 2 hours, and high manual triage cost across customer channels.",
    approach: [
      "NLP Classification Engine – Deployed real-time sentence transformers to classify support intents within 50ms.",
      "Autonomous Agent Swarms – Enforced multi-agent systems to cross-verify database changes before final response.",
      "Secure Sandbox APIs – Bound system access to read-only databases for unverified queries and secure write paths for verified users.",
      "SIEM Integration & Alerts – Wired logs directly into bank security dashboards for full oversight.",
    ],
    results: [
      { value: "90%", label: "Auto-Resolved" },
      { value: "2.5x", label: "Response Velocity" },
      { value: "-45%", label: "Operational Cost" },
      { value: "0ms", label: "Triage Latency" },
    ],
    impactTable: [
      { metric: "Support Ticket Backlog", before: "1,200/day", after: "0/day (real-time resolution)" },
      { metric: "Response Time", before: "2.3 Hours", after: "< 2 Seconds" },
      { metric: "Triage Accuracy", before: "76%", after: "98.5%" },
    ],
    services: ["Multi-Agent Orchestration", "Natural Language Processing", "API Integration", "Security Sandboxing"],
    gallery: [
      { src: aiA1, caption: "Agent performance and natural language model diagnostics dashboard" },
      { src: aiA2, caption: "Centralized AI model confidence logs and routing path views" },
    ],
    quote: {
      text: "AI in enterprise isn't about replacing humans; it's about solving the trivial immediately so human experts can resolve the critical.",
      author: "STELLR IT AI Lead",
      role: "Principal Architect",
    },
    nextSlug: "growth-marketing",
    projectUrl: "https://meridiantrustbank.com",
  },
  {
    slug: "growth-marketing",
    title: "National Home Services Campaign",
    subtitle: "Converting ad impressions into action for National Home Services",
    client: "National Home Services",
    year: "2024",
    industry: "SEM & Conversion Optimization",
    tags: ["Google Ads (SEM)", "SEO Ranking Strategy", "A/B Testing", "Landing Page CRO"],
    hero: mktgA1,
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
      { src: mktgA1, caption: "SEO and SEM performance mapping across states" },
      { src: mktgA2, caption: "Interactive Google Ads search query and CTR analytics charts" },
    ],
    quote: {
      text: "Impressions are vanity. Clicks are sanity. Fix intent, headlines, and visuals first.",
      author: "STELLR IT Takeaway",
      role: "Key Takeaway",
    },
    nextSlug: "app-development",
    projectUrl: "https://nationalhomeservices.com",
  },
  {
    slug: "app-development",
    title: "Ping Buz Mobile Application",
    subtitle: "Engineering a scalable cross-platform mobile application and real-time communication engine",
    client: "Ping Buz Inc.",
    year: "2026",
    industry: "Mobile App Development",
    tags: ["React Native", "iOS & Android", "Real-Time WebSockets", "App Store Optimizations"],
    hero: appMobile2,
    ratio: "aspect-[16/10]",
    align: "left",
    overview:
      "Ping Buz required a high-performance cross-platform application that allowed thousands of active users to communicate in real-time. We engineered a scalable React Native frontend connected to a robust WebSocket-based message server.",
    challenge: "High message latency, app crashes on old mobile hardware, and slow user feedback cycles.",
    approach: [
      "React Native Refactoring – Optimized components to avoid unnecessary rerenders and leverage GPU-accelerated layouts.",
      "WebSocket Messaging Server – Engineered microservices to handle message broadcasts within 20ms.",
      "Local Caching System – Stored messages locally with offline read/write capabilities.",
      "App Store Optimization (ASO) – Designed eye-catching preview cards and optimized descriptive copy to boost organic search volume.",
    ],
    results: [
      { value: "4.9★", label: "App Store Rating" },
      { value: "150K+", label: "Active Users" },
      { value: "99.9%", label: "Crash-Free Sessions" },
      { value: "20ms", label: "Latency" },
    ],
    impactTable: [
      { metric: "Average Message Latency", before: "1.2s", after: "20ms" },
      { metric: "Crash-Free Sessions", before: "92.5%", after: "99.9%" },
      { metric: "Organic Store Downloads", before: "Baseline", after: "+280%" },
    ],
    services: ["React Native Engineering", "WebSocket Infrastructure", "UI Design System", "ASO Strategy"],
    gallery: [
      { src: appMobile, caption: "App home screen and notification layout designs", tall: true },
      { src: appMobile1, caption: "Real-time communication chat views and keyboard optimization" },
      { src: appProd1, caption: "Integrated wallets and asset transaction interfaces" },
      { src: appProd2, caption: "User profile settings and system notifications panel" },
      { src: appProd3, caption: "Mobile layout modular components and button scaling" },
      { src: appProd4, caption: "Real-time diagnostics and data synchronization monitors" },
    ],
    quote: {
      text: "Users demand native-grade reactivity. A latency of more than 100ms feels broken. Build light, cache locally.",
      author: "STELLR IT Mobile Lead",
      role: "Technical Architect",
    },
    nextSlug: "pool-supply-wholesalers",
    projectUrl: "#",
  },
  {
    slug: "pool-supply-wholesalers",
    title: "Pool Supply Wholesalers",
    subtitle: "Headless e-commerce solution with a real-time admin sales and inventory dashboard",
    client: "Pool Supply Wholesalers LLC",
    year: "2026",
    industry: "E-Commerce & Operations",
    tags: ["E-Commerce", "Admin Dashboard", "Next.js / React", "Tailwind CSS", "High-Performance Search"],
    hero: poolsImg1,
    ratio: "w-full aspect-[16/10]",
    align: "left",
    overview:
      "Pool Supply Wholesalers is a high-volume distributor of pool equipment and components. We engineered a dual-faceted solution: a lightning-fast headless Next.js customer storefront coupled with an interactive administrative dashboard. This provides staff with immediate access to real-time sales reports, customer analytics, and inventory updates.",
    challenge: "Legacy software was sluggish, resulting in a 6.2-second search delay, high cart drop-offs, and no central panel to manage inventory and view customer metrics.",
    approach: [
      "Headless E-Commerce Front – Developed a Next.js catalog rendering 50,000+ parts instantaneously via SSG/ISR.",
      "Real-Time Admin Dashboard – Designed a premium sales dashboard tracking orders, inventory fluctuations, and metrics.",
      "Algolia Search Integration – Reduced catalog search response latency from 6.2s to 120ms with typo tolerance.",
      "One-Click Checkout – Streamlined custom billing invoice systems into a single-page secure checkout.",
    ],
    results: [
      { value: "+320%", label: "Online Revenue" },
      { value: "0.2s", label: "Core Web Vitals LCP" },
      { value: "4.8%", label: "Conversion Rate" },
      { value: "120ms", label: "Search Latency" },
    ],
    impactTable: [
      { metric: "Core Web Vitals LCP", before: "4.8s", after: "0.2s" },
      { metric: "Search Query Response", before: "6.2s", after: "120ms" },
      { metric: "Checkout Conversion Rate", before: "1.4%", after: "4.8%" },
    ],
    services: ["Next.js E-Commerce Dev", "Operations Dashboard Design", "Algolia Tuning", "Checkout CRO"],
    gallery: [
      { src: poolsImg2, caption: "Interactive admin sales dashboard and inventory charts" },
      { src: poolsImg3, caption: "Real-time analytics monitor and customer metrics overview" },
      { src: poolsImg4, caption: "Secure billing dashboard and mobile order invoice layout" },
    ],
    quote: {
      text: "Immediate analytics combined with instantaneous storefront search transforms standard transactions into a smooth operational flow.",
      author: "STELLR IT E-Commerce Lead",
      role: "Lead Systems Engineer",
    },
    nextSlug: "cinco-tile-platform",
    projectUrl: "https://poolsupply.vercel.app/",
  },
  {
    slug: "cinco-tile-platform",
    title: "Revitalize Real Estate",
    subtitle: "Tampa Bay's trusted partner for real estate, remodeling & home improvement",
    client: "Revitalize Real Estate",
    year: "2026",
    industry: "Real Estate & Construction",
    tags: ["Real Estate Development", "Home Remodeling", "Property Marketing", "Lead Generation", "UX Design"],
    hero: web2B1,
    ratio: "w-full aspect-[16/10]",
    align: "left",
    overview:
      "Revitalize Real Estate is Tampa Bay's trusted partner for real estate sales, remodeling, and home improvement. Serving 14+ cities across the Tampa Bay area, the brand needed a unified digital platform that displays property listings, remodeling showcase galleries, and an interactive quote calculator for home improvements.",
    challenge: "Disconnected marketing channels, slow loading of high-resolution property and remodeling galleries, and difficulty capturing high-intent remodeling and real estate leads.",
    approach: [
      "Unified Real Estate Listings – Designed a high-performance database displaying properties with interactive neighborhood details.",
      "Remodeling Gallery Engine – Showcased high-res transformation galleries showing before-and-after work on 14+ cities.",
      "Interactive Cost Calculator – Integrated a custom estimation tool for prospective home improvement and remodeling budgets.",
      "Local SEO Strategy – Created city-specific landing pages that rank at the top of local search queries.",
    ],
    results: [
      { value: "+210%", label: "Lead Generation" },
      { value: "1.2s", label: "Avg Page Load" },
      { value: "14+", label: "Cities Serviced" },
      { value: "4.9★", label: "Customer Rating" },
    ],
    impactTable: [
      { metric: "Lead Conversion Rate", before: "1.2%", after: "3.8%" },
      { metric: "Page Load Time (image heavy)", before: "3.8s", after: "1.2s" },
      { metric: "Organic Local Search Traffic", before: "Baseline", after: "+180% in 90 days" },
    ],
    services: ["Real Estate Web Design", "Remodeling Galleries", "Local SEO Campaign", "Lead Capture CRO"],
    gallery: [
      { src: web2B1, caption: "Revitalize Real Estate home landing page showcasing hot properties" },
      { src: web2B2, caption: "Interactive remodeling gallery and before-and-after projects catalog" },
      { src: web2B3, caption: "Online quote estimation page and customer lead intake dashboard" },
    ],
    quote: {
      text: "By combining real estate listings with remodeling visual assets in a fast, elegant interface, we saw an immediate boost in high-quality property inquiries.",
      author: "STELLR IT Real Estate Lead",
      role: "Lead UX Architect",
    },
    nextSlug: "harmony-residential-care",
    projectUrl: "https://revitalize-real.vercel.app/",
  },
  {
    slug: "harmony-residential-care",
    title: "Harmony Residential Care",
    subtitle: "A compassionate digital experience and secure enquiry system for premium elderly care",
    client: "Harmony Residential Care LLC",
    year: "2025",
    industry: "Healthcare / Elderly Care",
    tags: ["Healthcare UX", "Accessibility (WCAG)", "Inquiry Conversion", "Tailwind CSS"],
    hero: web1A1,
    ratio: "w-full aspect-[16/10]",
    align: "left",
    overview:
      "Harmony Residential Care LLC is a premier senior living and care provider. We designed and built a highly accessible, compassionate digital experience. The platform facilitates simple family communication, displays rich facility galleries, and integrates a secure inquiry funnel to streamline intake operations.",
    challenge: "Families seeking elder care faced high anxiety, further amplified by a hard-to-navigate legacy website. Furthermore, the facility struggled to manage secure inquiry messages from interested families.",
    approach: [
      "Compassionate Web Design – Created a warm visual hierarchy using soothing, accessibility-compliant colors and readable typography.",
      "Streamlined Inquiry Portals – Implemented a direct secure inquiry system with simple form inputs, reducing cognitive load on families.",
      "WCAG AA Compliance – Optimized navigation, keyboard controls, and screen-reader tags to assist visitors of all ages.",
      "High-Res Facility Galleries – Developed fast-loading image carousels that display the care home's welcoming rooms and environments.",
    ],
    results: [
      { value: "+140%", label: "Monthly Inquiries" },
      { value: "100%", label: "WCAG Compliance" },
      { value: "100%", label: "Secure Data Handling" },
      { value: "2.1s", label: "Page Load Time" },
    ],
    impactTable: [
      { metric: "Digital Inquiry Conversion", before: "1.1%", after: "3.4%" },
      { metric: "WCAG Accessibility Score", before: "45%", after: "100% (AA standard)" },
      { metric: "Average Form Abandonment", before: "74%", after: "18%" },
    ],
    services: ["UX/UI Design Strategy", "React & Next.js Development", "WCAG Accessibility Audit", "Conversion Optimization"],
    gallery: [
      { src: web1A1, caption: "Warm and inviting homepage design for Harmony Residential Care" },
      { src: web1A2, caption: "Comprehensive services and care programs detailed overview" },
      { src: web1A3, caption: "Secure contact portal and direct family inquiry form layout" },
    ],
    quote: {
      text: "Moving a loved one to residential care is a deeply emotional decision. A website should offer peace of mind, immediate clarity, and easy contact.",
      author: "STELLR IT Care Lead",
      role: "Lead Frontend Engineer",
    },
    nextSlug: "brand-building",
    projectUrl: "https://www.harmonyresidentialcarellc.com/",
  },
];

export const getCaseStudy = (slug: string) =>
  CASE_STUDIES.find((c) => c.slug === slug);
