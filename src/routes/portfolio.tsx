import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Sparkles, Shield, Coins, BarChart3, HelpCircle, CheckCircle2, Smartphone, Globe } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";

// Import custom category portfolio images
import imgBrandBrand from "@/assets/portfolio_collect/brand_building/desktop.jpg";
import imgProdProd from "@/assets/portfolio_collect/product_development/product4.jpg";
import imgMktgMktg from "@/assets/portfolio_collect/growth-marketing/a1.jpg";
import imgAiAi from "@/assets/portfolio_collect/ai_automation/a1.jpg";
import imgAppApp from "@/assets/portfolio_collect/app_development/Mobile-2.jpg";
import imgWeb1 from "@/assets/portfolio_collect/pools/pools1.jpg";
import imgWeb2 from "@/assets/portfolio_collect/websites/second/b1.jpg";
import imgHarmony from "@/assets/portfolio_collect/websites/first/a1.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      {
        title:
          "Portfolio — Custom Software & SaaS Development Projects | StellR IT LLC",
      },
      {
        name: "description",
        content:
          "Browse StellR IT LLC's portfolio of custom software development, SaaS products, AI automation, brand identity, mobile apps, and digital marketing campaigns delivering measurable ROI for enterprise clients.",
      },
      {
        name: "keywords",
        content:
          "software development portfolio, saas development case studies, ux ui design portfolio, brand identity portfolio, ai automation projects, mobile app development portfolio, web design projects, digital marketing results, enterprise software examples",
      },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content: "Portfolio — Software Development & Design Projects | StellR IT LLC",
      },
      {
        property: "og:description",
        content:
          "Custom software, SaaS, AI automation, brand identity, mobile apps & digital marketing. Explore proven case studies with measurable ROI.",
      },
      { property: "og:url", content: "https://stellrit.com/portfolio" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Portfolio — Software & SaaS Development Projects | StellR IT",
      },
      {
        name: "twitter:description",
        content:
          "Software, SaaS, AI, brand, apps & digital marketing portfolio. Real results.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com/portfolio" }],
  }),
  component: PortfolioPage,
});

type Project = {
  slug: string;
  title: string;
  category: "all" | "brand" | "product" | "marketing" | "ai" | "app" | "website";
  categoryLabel: string;
  description: string;
  metrics: { value: string; label: string }[];
  tags: string[];
  image: string;
  accentColor: string;
  glowColor: string;
  gradient: string;
  icon: any;
};

const PROJECTS: Project[] = [
  {
    slug: "brand-building",
    title: "TSR Skin & Hair Care Brand Identity",
    category: "brand",
    categoryLabel: "Brand Building",
    description:
      "A premium visual identity, packaging design, and complete digital design system for TSR Skin and Hair Care.",
    metrics: [
      { value: "+240%", label: "Brand Engagement" },
      { value: "+180%", label: "Inquiry Volume" },
      { value: "100%", label: "Consistent Guidelines" },
    ],
    tags: ["Brand Strategy", "Packaging Design", "Visual Identity", "Art Direction"],
    image: imgBrandBrand,
    accentColor: "#a855f7", // Purple
    glowColor: "rgba(168, 85, 247, 0.25)",
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    icon: Sparkles,
  },
  {
    slug: "ux-ui-conversions",
    title: "Finvise SaaS Product Design",
    category: "product",
    categoryLabel: "Product Development",
    description:
      "A complete user experience overhaul and high-fidelity interface design for Finvise, streamlining SaaS signup and data visualization pipelines.",
    metrics: [
      { value: "41%", label: "Signup Completion" },
      { value: "27%", label: "Bounce Rate (Down from 58%)" },
      { value: "+$1.2M", label: "AUM in 3 Months" },
    ],
    tags: ["UI/UX Design", "SaaS Dashboard", "Frictionless Flow", "Framer Motion"],
    image: imgProdProd,
    accentColor: "#10b981", // Emerald
    glowColor: "rgba(16, 185, 129, 0.25)",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    icon: Coins,
  },
  {
    slug: "ai-automation",
    title: "Enterprise AI Automated Systems",
    category: "ai",
    categoryLabel: "AI Automation",
    description:
      "Architecting and deploying autonomous AI agents and automated support workflows for enterprise customer operations.",
    metrics: [
      { value: "90%", label: "Auto-Resolved Issues" },
      { value: "2.5x", label: "Response Velocity" },
      { value: "-45%", label: "Operational Cost" },
    ],
    tags: ["AI Agents", "Workflow Automation", "NLP Routing", "Enterprise Integration"],
    image: imgAiAi,
    accentColor: "#0ea5e9", // Sky blue
    glowColor: "rgba(14, 165, 233, 0.25)",
    gradient: "from-sky-500/20 via-sky-500/5 to-transparent",
    icon: Shield,
  },
  {
    slug: "growth-marketing",
    title: "National Home Services Campaign",
    category: "marketing",
    categoryLabel: "Growth Marketing",
    description:
      "A national-scale search engine marketing and SEO campaign driven by aggressive keyword mapping and optimized conversion funnels.",
    metrics: [
      { value: "4.7%", label: "Click-Through Rate (Up from 1.2%)" },
      { value: "-62%", label: "Cost Per Click (CPC)" },
      { value: "+292%", label: "Conversion Volume Increase" },
    ],
    tags: ["Google Ads (SEM)", "SEO Ranking Strategy", "A/B Testing", "Landing Page CRO"],
    image: imgMktgMktg,
    accentColor: "#f59e0b", // Amber
    glowColor: "rgba(245, 158, 11, 0.25)",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    icon: BarChart3,
  },
  {
    slug: "app-development",
    title: "Ping Buz Mobile Application",
    category: "app",
    categoryLabel: "App Development",
    description:
      "Engineering a scalable cross-platform mobile application deploying real-time social networking tools and microservice communication engines.",
    metrics: [
      { value: "4.9★", label: "App Store Rating" },
      { value: "150K+", label: "Active Users" },
      { value: "99.9%", label: "Crash-Free Sessions" },
    ],
    tags: ["React Native", "iOS & Android", "Real-Time WebSockets", "App Store Optimizations"],
    image: imgAppApp,
    accentColor: "#3b82f6", // Blue
    glowColor: "rgba(59, 130, 246, 0.25)",
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    icon: Smartphone,
  },
  {
    slug: "pool-supply-wholesalers",
    title: "Pool Supply Wholesalers",
    category: "website",
    categoryLabel: "Website",
    description:
      "A headless Next.js customer storefront and integrated admin dashboard for real-time sales reporting and inventory management.",
    metrics: [
      { value: "+320%", label: "Online Revenue" },
      { value: "0.2s", label: "Core Web Vitals LCP" },
      { value: "4.8%", label: "Conversion Rate" },
    ],
    tags: ["E-Commerce", "Admin Dashboard", "Next.js / React", "Tailwind CSS", "High-Performance Search"],
    image: imgWeb1,
    accentColor: "#06b6d4", // Cyan
    glowColor: "rgba(6, 182, 212, 0.25)",
    gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    icon: Globe,
  },
  {
    slug: "cinco-tile-platform",
    title: "Revitalize Real Estate",
    category: "website",
    categoryLabel: "Website",
    description:
      "Tampa Bay's trusted partner website for real estate, remodeling, and home improvement, optimized for lead generation across 14+ cities.",
    metrics: [
      { value: "+210%", label: "Lead Generation" },
      { value: "1.2s", label: "Page Load Time" },
      { value: "14+", label: "Cities Serviced" },
    ],
    tags: ["Real Estate Development", "Home Remodeling", "Property Marketing", "UX Design"],
    image: imgWeb2,
    accentColor: "#ec4899", // Pink
    glowColor: "rgba(236, 72, 153, 0.25)",
    gradient: "from-pink-500/20 via-pink-500/5 to-transparent",
    icon: Globe,
  },
  {
    slug: "harmony-residential-care",
    title: "Harmony Residential Care",
    category: "website",
    categoryLabel: "Website",
    description:
      "A compassionate, WCAG-compliant web presence and secure inquiry routing platform designed to guide families seeking elder care.",
    metrics: [
      { value: "+140%", label: "Monthly Inquiries" },
      { value: "100%", label: "WCAG Compliance" },
      { value: "2.1s", label: "Page Load Time" },
    ],
    tags: ["Healthcare UX", "Accessibility (WCAG)", "Next.js / React", "Tailwind CSS"],
    image: imgHarmony,
    accentColor: "#14b8a6", // Teal
    glowColor: "rgba(20, 184, 166, 0.25)",
    gradient: "from-teal-500/20 via-teal-500/5 to-transparent",
    icon: Globe,
  },
];

const FILTERS = [
  { id: "all", label: "All Projects" },
  { id: "brand", label: "Brand Building" },
  { id: "product", label: "Product Development" },
  { id: "marketing", label: "Growth Marketing" },
  { id: "ai", label: "AI Automation" },
  { id: "app", label: "App Development" },
  { id: "website", label: "Website" },
] as const;

function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "brand" | "product" | "marketing" | "ai" | "app" | "website">("all");

  const filteredProjects = PROJECTS.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  const { scrollY } = useScroll();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://stellrit.com" },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: "https://stellrit.com/portfolio" },
    ],
  };

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://stellrit.com/portfolio#projects",
    name: "StellR IT LLC Portfolio",
    description: "Custom software development, SaaS, AI automation, brand identity, and digital marketing projects.",
    itemListElement: PROJECTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: p.title,
        description: p.description,
        creator: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
        keywords: p.tags.join(", "),
        url: `https://stellrit.com/case-studies/${p.slug}`,
      },
    })),
  };

  // Scroll-Reactive Glowing Blobs (Parallax + Color Morphing)
  const blobColor1 = useTransform(
    scrollY,
    [0, 500, 1000, 1500],
    [
      "rgba(168, 85, 247, 0.25)",  // Purple at top
      "rgba(16, 185, 129, 0.25)",  // Emerald near UX
      "rgba(14, 165, 233, 0.25)",  // Sky blue near Cyber
      "rgba(168, 85, 247, 0.25)"   // Purple near Marketing
    ]
  );

  const blobColor2 = useTransform(
    scrollY,
    [0, 600, 1100, 1700],
    [
      "rgba(255, 138, 91, 0.18)",  // Orange at top
      "rgba(14, 165, 233, 0.22)",  // Sky blue near UX
      "rgba(16, 185, 129, 0.22)",  // Emerald near Cyber
      "rgba(255, 138, 91, 0.22)"   // Orange near Marketing
    ]
  );

  const blobY1 = useTransform(scrollY, [0, 2500], [0, 450]);
  const blobScale1 = useTransform(scrollY, [0, 1000], [1, 1.25]);
  const blobOpacity1 = useTransform(scrollY, [0, 1000], [0.8, 1]);

  const blobY2 = useTransform(scrollY, [0, 2500], [0, -350]);
  const blobScale2 = useTransform(scrollY, [0, 1000], [1, 0.75]);
  const blobOpacity2 = useTransform(scrollY, [0, 1000], [0.8, 1]);

  return (
    <main className="relative min-h-screen bg-[#180028] text-white overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }} />
      <ScrollBackground />
      <SiteHeader transparent />

      {/* Hero section with Broadcom SVG background styles */}
      <PageHero
        eyebrow="Selected Projects"
        title={
          <>
            Crafting digital <br />
            <span className="shimmer-gold italic">monuments</span>.
          </>
        }
        description="From high-performance engineering to conversion-optimized interface design and military-grade network defenses. We build solutions designed to dominate."
      />

      {/* Blended Background Container with Scroll-Reactive Parallax Blobs */}
      <div className="bg-gradient-to-b from-[#180028] via-[#140224]/95 to-[#0b011c] relative z-10 overflow-clip">
        {/* Subtle grid lines background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
        
        {/* Scroll-Reactive Glowing Blobs (Parallax + Morphing Colors) */}
        <motion.div
          style={{ y: blobY1, backgroundColor: blobColor1, scale: blobScale1, opacity: blobOpacity1 }}
          className="absolute top-[10%] left-[-15%] w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none z-0 transition-colors duration-1000"
        />
        <motion.div
          style={{ y: blobY2, backgroundColor: blobColor2, scale: blobScale2, opacity: blobOpacity2 }}
          className="absolute bottom-[15%] right-[-15%] w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-1000"
        />

        {/* Interactive Filtering Navigation */}
        <section className="relative z-20 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto mb-16 pt-12">
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`relative px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeFilter === f.id
                  ? "text-black bg-white shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                  : "text-white/50 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Portfolio Grid Layout */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto pb-32">
        <div className="grid grid-cols-1 gap-20">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p, idx) => {
              const IconComponent = p.icon;
              return (
                <motion.article
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center rounded-3xl border border-white/[0.06] bg-[#0c0a20]/40 backdrop-blur-xl p-8 md:p-12 overflow-hidden hover:border-white/10 transition-colors duration-500"
                  style={{
                    boxShadow: "0 30px 100px -20px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.02)",
                  }}
                >
                  {/* Subtle inner background gradient blur matching item's color */}
                  <div
                    className="absolute -right-24 -bottom-24 w-[350px] h-[350px] rounded-full opacity-10 blur-[60px] pointer-events-none transition-all duration-700 group-hover:scale-125"
                    style={{ background: p.accentColor }}
                  />

                  {/* Left Column: Information Card */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="relative p-2 rounded-lg bg-white/5 border border-white/10">
                        <IconComponent className="h-4 w-4 text-white" style={{ color: p.accentColor }} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/60">
                        {p.categoryLabel}
                      </span>
                    </div>

                    <h2 className="font-serif text-[32px] md:text-[44px] leading-tight text-white tracking-tight">
                      {p.title}
                    </h2>

                    <p className="mt-5 text-sm md:text-base text-white/55 leading-relaxed font-light">
                      {p.description}
                    </p>

                    {/* Dynamic Tags */}
                    <div className="flex flex-wrap gap-2 mt-6">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] tracking-wider uppercase font-semibold text-white/80 bg-white/5 border border-white/5 px-2.5 py-1 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Custom Metric Stats Block */}
                    <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 mt-8">
                      {p.metrics.map((m, mIdx) => (
                        <div key={mIdx}>
                          <div className="text-xl md:text-2xl font-bold tracking-tight text-white" style={{ color: p.accentColor }}>
                            {m.value}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-white/40 mt-1 font-medium leading-normal">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View Project Action */}
                    <Link
                      to="/case-studies/$slug"
                      params={{ slug: p.slug }}
                      className="group/btn inline-flex items-center gap-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-3.5 text-xs font-semibold text-white w-fit mt-8 transition-all duration-300"
                    >
                      Explore Projects
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full text-white transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                        style={{ background: p.accentColor }}
                      >
                        <ArrowUpRight className="h-3 w-3 text-black" />
                      </span>
                    </Link>
                  </div>

                  {/* Right Column: High Quality Image Mockup */}
                  <div className="lg:col-span-7 relative h-[250px] sm:h-[350px] lg:h-[450px] w-full rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors duration-500 shadow-2xl">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a20]/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Comparative ROI Summary Section */}
      <section className="relative z-10 px-6 py-20 md:px-12 lg:px-20 border-t border-white/10 bg-gradient-to-b from-white/[0.01] to-[#04010f]/80">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Column 1: Info panel */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.5em] text-[#ff8a5b] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a5b]" />
                PERFORMANCE METRICS
              </span>
              <h3 className="font-serif text-[32px] md:text-[44px] leading-tight text-white">
                The Proof is in <br />
                the Results.
              </h3>
              <p className="text-sm md:text-base text-white/50 leading-relaxed font-light mt-2">
                We design and engineer digital platforms that produce clear, auditable performance gains. This comparative matrix lists the baseline vs. optimized growth indicators of our core operations.
              </p>
            </div>

            {/* Column 2: Table block */}
            <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0a20]/40 backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[9px] uppercase tracking-widest text-white/40">
                      <th className="px-6 py-4.5 font-semibold">Initiative Focus</th>
                      <th className="px-6 py-4.5 font-semibold">Core metric shift</th>
                      <th className="px-6 py-4.5 font-semibold text-right">ROI Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/[0.04] text-xs md:text-sm text-white/80 transition hover:bg-white/[0.02]">
                      <td className="px-6 py-5.5 font-medium flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-purple-400" />
                        National Home Services SEO & SEM
                      </td>
                      <td className="px-6 py-5.5 text-white/50">CTR: 1.2% → 4.7%</td>
                      <td className="px-6 py-5.5 text-right font-semibold text-[#ff8a5b]">
                        62% lower CPC
                      </td>
                    </tr>
                    <tr className="border-b border-white/[0.04] text-xs md:text-sm text-white/80 transition hover:bg-white/[0.02] bg-white/[0.005]">
                      <td className="px-6 py-5.5 font-medium flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        Finvise UX/UI Redesign & Funnels
                      </td>
                      <td className="px-6 py-5.5 text-white/50">Signup completion: 12% → 41%</td>
                      <td className="px-6 py-5.5 text-right font-semibold text-[#ff8a5b]">
                        +$1.2M AUM in 3 Months
                      </td>
                    </tr>
                    <tr className="border-b border-white/[0.04] text-xs md:text-sm text-white/80 transition hover:bg-white/[0.02]">
                      <td className="px-6 py-5.5 font-medium flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-sky-400" />
                        Meridian Trust Bank Zero Trust Network
                      </td>
                      <td className="px-6 py-5.5 text-white/50">Access Threats: ~35 → 0-1/mo</td>
                      <td className="px-6 py-5.5 text-right font-semibold text-[#ff8a5b]">
                        99% threat reduction
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>

      <CtaBand title="Make your project next." subtitle="We are currently onboarding partners for the upcoming quarter." />
      <Footer />
      <ChatWidget />

      <style>{`
        .shimmer-gold {
          background: linear-gradient(135deg, #c9a4ff 0%, #ffffff 50%, #ff8a5b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </main>
  );
}
