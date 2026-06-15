import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import { CASE_STUDIES, getCaseStudy, type CaseStudy } from "@/data/case-studies";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: ({ params }) => {
    const study = getCaseStudy(params.slug);
    if (!study) throw notFound();
    return { study };
  },
  head: ({ loaderData, params }) => {
    const s = loaderData?.study;
    if (!s) return { meta: [{ title: "Case Study — StellR IT LLC" }] };
    const title = `${s.title} — ${s.subtitle} | StellR IT LLC`;
    const description = `${s.subtitle}. ${s.overview.slice(0, 155)}`.replace(/\s+/g, " ").trim();
    const url = `/case-studies/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: [s.industry, s.client, ...s.services, ...s.tags].join(", ") },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: s.hero },
        { property: "article:section", content: s.industry },
        { property: "article:published_time", content: `${s.year}-01-01` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: s.hero },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${s.title} — ${s.subtitle}`,
            description,
            image: [s.hero],
            datePublished: `${s.year}-01-01`,
            author: { "@type": "Organization", name: "StellR IT LLC" },
            publisher: {
              "@type": "Organization",
              name: "StellR IT LLC",
              logo: { "@type": "ImageObject", url: "/favicon.ico" },
            },
            about: { "@type": "Organization", name: s.client },
            articleSection: s.industry,
            keywords: [...s.services, ...s.tags].join(", "),
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Case Studies", item: "/case-studies" },
              { "@type": "ListItem", position: 3, name: s.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { study } = Route.useLoaderData() as { study: CaseStudy };
  const next = CASE_STUDIES.find((c) => c.slug === study.nextSlug) ?? CASE_STUDIES[0];
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />

      {/* Hero */}
      <section className="relative z-10 px-6 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#180028] text-white">
        {/* Background SVGs (Broadcom style) */}
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen">
          {/* SVG 1 - Top Left Circle */}
          <div className="absolute -top-[10%] -left-[10%] w-[50%] min-w-[400px] max-w-[700px] opacity-80">
            <svg width="665" height="665" viewBox="0 0 665 665" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <circle cx="332.285" cy="332.285" r="332.285" transform="matrix(-0.866025 -0.5 -0.5 0.866025 786.488 210.816)" fill="url(#gradient2_case)"></circle>
              <defs>
                <linearGradient id="gradient2_case" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8E5CC0">
                    <animate attributeName="stop-color" values="#8E5CC0; transparent;  #8E5CC0" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="100%" stopColor="transparent">
                    <animate attributeName="stop-color" values="transparent; #8E5CC0;  transparent" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="0 .5 .5" dur="10s" repeatCount="indefinite"></animateTransform>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* SVG 4 - Mid Left Circle */}
          <div className="absolute top-[40%] -left-[5%] w-[30%] min-w-[200px] max-w-[400px] opacity-70">
            <svg width="294" height="294" viewBox="0 0 294 294" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <circle cx="146.676" cy="146.676" r="146.676" transform="matrix(-0.866025 -0.5 -0.5 0.866025 347.326 93.6133)" fill="url(#gradient4_case)" fillOpacity="0.5"></circle>
              <defs>
                <linearGradient id="gradient4_case" x1="286.099" y1="95.3143" x2="-27.3396" y2="155.732" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8E5CC0">
                    <animate attributeName="stop-color" values="#8E5CC0; transparent;  #8E5CC0" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="100%" stopColor="transparent">
                    <animate attributeName="stop-color" values="transparent; #8E5CC0;  transparent" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="0 .5 .5" dur="10s" repeatCount="indefinite"></animateTransform>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* SVG 5 - Top Right Rounded Rect */}
          <div className="absolute top-[10%] right-[15%] w-[15%] min-w-[150px] max-w-[250px] opacity-60">
            <svg width="173" height="173" viewBox="0 0 173 173" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <rect width="172" height="172" rx="86" transform="matrix(0.866025 0.5 0.5 -0.866025 -31.3096 118.428)" fill="url(#pattern5_case)"></rect>
              <defs>
                <linearGradient id="pattern5_case" x1="1080.03" y1="210.887" x2="0.929331" y2="210.887" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8052CD">
                    <animate attributeName="stop-color" values="#8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="25%" stopColor="#D15A8A">
                    <animate attributeName="stop-color" values="#D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="42%" stopColor="#8054DC">
                    <animate attributeName="stop-color" values=" #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="57%" stopColor="#BD6C95">
                    <animate attributeName="stop-color" values="#BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="64%" stopColor="#E09050">
                    <animate attributeName="stop-color" values="#E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="79%" stopColor="#9172B9">
                    <animate attributeName="stop-color" values="#9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="100%" stopColor="#695FE4">
                    <animate attributeName="stop-color" values="#695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="0 .5 .5" dur="10s" repeatCount="indefinite"></animateTransform>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* SVG 2 - Bottom Left Wave */}
          <div className="absolute -bottom-[5%] left-0 w-[60%] min-w-[600px] max-w-[1000px] opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="846" height="422" viewBox="0 0 846 422" fill="none" className="w-full h-auto">
              <path d="M500.86 181.789L459.086 105.015C416.182 31.6271 381.182 0.0141094 305.536 0.0141061C229.891 0.0141027 194.891 31.6271 151.987 105.015L110.213 181.789C91.0193 217.918 57.1482 250.66 -12.8521 250.66L-129.143 250.66C-317.692 250.66 -221.724 509.21 -78.3363 390.661L194.891 182.918C236.665 150.176 263.762 136.628 305.536 137.757C347.311 136.628 374.408 150.176 416.182 182.918L689.409 390.661C832.797 509.21 928.765 250.66 740.216 250.66L623.925 250.66C553.925 250.66 520.054 217.918 500.86 181.789Z" fill="url(#pattern0_case)"></path>
              <defs>
                <linearGradient id="pattern0_case" x1="1080.03" y1="210.887" x2="0.929331" y2="210.887" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8052CD">
                    <animate attributeName="stop-color" values="#8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="25%" stopColor="#D15A8A">
                    <animate attributeName="stop-color" values="#D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="42%" stopColor="#8054DC">
                    <animate attributeName="stop-color" values=" #8054DC; #BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="57%" stopColor="#BD6C95">
                    <animate attributeName="stop-color" values="#BD6C95; #E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="64%" stopColor="#E09050">
                    <animate attributeName="stop-color" values="#E09050; #9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="79%" stopColor="#9172B9">
                    <animate attributeName="stop-color" values="#9172B9; #695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="100%" stopColor="#695FE4">
                    <animate attributeName="stop-color" values="#695FE4; #8052CD; #D15A8A; #8054DC; #BD6C95; #E09050; #9172B9; #695FE4" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="0 .5 .5" dur="10s" repeatCount="indefinite"></animateTransform>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* SVG 3 - Bottom Right Wave */}
          <div className="absolute -bottom-[5%] right-0 w-[60%] min-w-[700px] max-w-[1100px] opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="423" viewBox="0 0 1080 423" fill="none" className="w-full h-auto">
              <path d="M345.126 240.681L386.901 317.456C429.804 390.844 464.804 422.457 540.45 422.457C616.095 422.457 651.096 390.844 693.999 317.456L735.773 240.681C754.967 204.552 788.838 171.81 858.838 171.81L975.129 171.81C1163.68 171.81 1067.71 -86.7395 924.323 31.8095L651.096 239.552C609.321 272.295 582.224 285.843 540.45 284.714C498.676 285.843 471.579 272.295 429.804 239.552L156.577 31.8095C13.1894 -86.7394 -82.7788 171.81 105.77 171.81L222.061 171.81C292.062 171.81 325.933 204.552 345.126 240.681Z" fill="url(#gradient3_case)"></path>
              <defs>
                <linearGradient id="gradient3_case" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#240945">
                    <animate attributeName="stop-color" values="#240945; #772588; #E35375; #F94F39; #C65CEB; #5D00DB; #240945" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="20%" stopColor="#772588">
                    <animate attributeName="stop-color" values="#772588; #E35375; #F94F39; #C65CEB; #5D00DB; #240945; #772588" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="40%" stopColor="#E35375">
                    <animate attributeName="stop-color" values="#E35375; #F94F39; #C65CEB; #5D00DB; #240945; #772588; #E35375" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="60%" stopColor="#F94F39">
                    <animate attributeName="stop-color" values="#F94F39; #C65CEB; #5D00DB; #240945; #772588; #E35375; #F94F39" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="80%" stopColor="#C65CEB">
                    <animate attributeName="stop-color" values="#C65CEB; #5D00DB; #240945; #772588; #E35375; #F94F39; #C65CEB" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <stop offset="100%" stopColor="#5D00DB">
                    <animate attributeName="stop-color" values="#5D00DB; #240945; #772588; #E35375; #F94F39; #C65CEB; #5D00DB" dur="10s" repeatCount="indefinite"></animate>
                  </stop>
                  <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="0 .5 .5" dur="10s" repeatCount="indefinite"></animateTransform>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> All case studies
          </Link>

          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b] font-semibold">
                {study.industry} — {study.year}
              </div>
              <h1 className="text-glow mt-6 font-serif text-[48px] sm:text-[68px] md:text-[84px] lg:text-[100px] font-normal leading-[0.98] tracking-tight text-white">
                {study.title}
              </h1>
              <p className="mt-6 max-w-xl text-[17px] md:text-[19px] leading-[1.5] text-white/70">
                {study.subtitle}
              </p>

              {study.projectUrl && (
                <a
                  href={study.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/10 hover:border-[#ff8a5b]/40 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(190,80,255,0.25)] px-6 py-3 text-xs font-semibold text-white tracking-wider uppercase transition-all duration-500 mt-8"
                >
                  View Live Project
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#7a2adc] to-[#ff8a5b] text-white transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-45">
                    <ArrowUpRight className="h-3.5 w-3.5 text-white" />
                  </span>
                </a>
              )}
            </motion.div>

            <motion.dl
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="grid grid-cols-2 gap-y-8 gap-x-6 self-end text-white"
            >
              <Meta label="Client" value={study.client} />
              <Meta label="Year" value={study.year} />
              <Meta label="Industry" value={study.industry} />
              <Meta label="Services" value={study.services.join(" · ")} />
            </motion.dl>
          </div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-14 overflow-hidden rounded-2xl relative border border-white/10 w-full"
          >
            <img
              src={study.hero}
              alt={study.title}
              className="w-full h-auto block"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Challenge Callout Banner */}
      <section className="relative z-10 px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-white/[0.08] bg-[#0c061d]/60 backdrop-blur-xl p-8 md:p-14 relative overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute top-0 left-0 h-1.5 w-full bg-[#ff8a5b]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#ff8a5b] font-semibold">The Challenge</span>
            <h2 className="mt-5 font-serif text-[24px] sm:text-[32px] md:text-[40px] leading-tight tracking-tight text-white max-w-4xl">
              {study.challenge}
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Approach */}
      <section className="relative z-10 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b] font-semibold">Our approach</div>
          <h2 className="mt-5 max-w-3xl font-serif text-[36px] sm:text-[44px] md:text-[56px] leading-[1.02] tracking-tight text-white">
            The STELLR IT Approach
          </h2>
          {study.approachIntro && (
            <p className="mt-6 text-[16px] md:text-[18px] text-white/70 max-w-3xl leading-relaxed">
              {study.approachIntro}
            </p>
          )}
          <ol className="mt-12 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {study.approach.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="flex gap-6 border-t border-white/10 pt-6"
              >
                <span className="font-serif text-[28px] leading-none text-[#c9a4ff] font-semibold">
                  0{i + 1}
                </span>
                <p className="text-[15px] md:text-[16px] leading-[1.6] text-white/85">{a}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Results & Outcomes */}
      <section className="relative z-10 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b] font-semibold">Outcomes</div>
          <h2 className="mt-5 max-w-3xl font-serif text-[36px] sm:text-[44px] md:text-[56px] leading-[1.02] tracking-tight text-white">
            The Impact
          </h2>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 md:grid-cols-4">
            {study.results.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="bg-white/[0.03] px-6 py-10 text-white"
              >
                <div className="font-serif text-[42px] leading-none md:text-[52px] font-semibold">{r.value}</div>
                <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-white/50">
                  {r.label}
                </div>
              </motion.div>
            ))}
          </div>

          {study.impactTable && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8 }}
              className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0f0a20]/40 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="px-6 py-5 border-b border-white/10 bg-white/[0.01]">
                <h3 className="font-serif text-lg text-white">Before vs. After Metrics</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-widest text-white/45 bg-white/[0.005]">
                      <th className="px-8 py-4.5 font-semibold">Metric</th>
                      <th className="px-8 py-4.5 font-semibold">Before</th>
                      <th className="px-8 py-4.5 font-semibold text-right">After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {study.impactTable.map((row, index) => (
                      <tr
                        key={row.metric}
                        className={`border-b border-white/[0.04] text-sm text-white/80 transition hover:bg-white/[0.02] ${index % 2 === 1 ? "bg-white/[0.005]" : ""
                          }`}
                      >
                        <td className="px-8 py-5.5 font-medium">{row.metric}</td>
                        <td className="px-8 py-5.5 text-white/50">{row.before}</td>
                        <td className="px-8 py-5.5 text-right font-semibold text-purple-300">
                          {row.after}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      {study.gallery && study.gallery.length > 0 && (
        <section className="relative z-10 px-6 py-16 md:px-12 lg:px-20 border-t border-white/[0.05]">
          <div className="mx-auto max-w-[1400px]">
            <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b] font-semibold mb-6">Gallery & Deliverables</div>
            <h2 className="font-serif text-[36px] sm:text-[44px] md:text-[56px] leading-[1.02] tracking-tight text-white mb-12">
              Visual Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {study.gallery.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative overflow-hidden rounded-2xl border border-white/10 group cursor-zoom-in ${img.tall ? "row-span-2 aspect-[3/4]" : "aspect-[16/10]"
                    }`}
                >
                  <img
                    src={img.src}
                    alt={img.caption || "Gallery Image"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-4 transform scale-95 group-hover:scale-100 transition-transform duration-300">
                      <ArrowUpRight className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  {img.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <p className="text-xs uppercase tracking-wider text-white font-medium">
                        {img.caption}
                      </p>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Takeaway Block */}
      <section className="relative z-10 px-6 py-16 md:px-12 lg:px-20 border-t border-white/[0.05]">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#a855f7]/05 to-[#ff8a5b]/05 p-8 md:p-14 text-center relative overflow-hidden"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#ff8a5b] font-semibold block mb-6">STELLR IT Takeaway</span>
            <p className="font-serif text-[24px] sm:text-[32px] md:text-[38px] leading-tight tracking-tight text-white max-w-4xl mx-auto">
              “{study.quote.text}”
            </p>
          </motion.div>
        </div>
      </section>

      {/* Next case study */}
      <section className="relative z-10 px-6 py-16 md:px-12 lg:px-20 border-t border-white/[0.05]">
        <Link
          to="/case-studies/$slug"
          params={{ slug: next.slug }}
          className="group relative mx-auto block max-w-[1400px] overflow-hidden rounded-3xl border border-white/10"
        >
          <div className="relative aspect-[16/7]">
            <img
              src={next.hero}
              alt={next.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
              <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b] font-semibold">Next case study</div>
              <div className="mt-3 flex items-end justify-between gap-6">
                <h3 className="font-serif text-[36px] md:text-[60px] leading-none text-white">
                  {next.title}
                </h3>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-[#2a0860] transition group-hover:scale-110">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 max-w-xl text-[14px] md:text-[15px] text-white/80">{next.subtitle}</p>
            </div>
          </div>
        </Link>
      </section>

      <CtaBand
        title="Want results like these?"
        subtitle="Tell us about your project — a senior partner replies within one business day."
      />
      <Footer />
      <ChatWidget />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md cursor-zoom-out"
            onClick={() => setActiveImageIndex(null)}
          >
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 rounded-full bg-white/10 hover:bg-white/20 p-2 md:p-3 text-white transition-colors duration-300 cursor-pointer"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            {/* Navigation Arrows */}
            {study.gallery && study.gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === 0 ? study.gallery.length - 1 : prev! - 1));
                  }}
                  className="absolute left-2 md:left-6 rounded-full bg-white/5 hover:bg-white/10 p-2 md:p-3 text-white transition-colors duration-300 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === study.gallery.length - 1 ? 0 : prev! + 1));
                  }}
                  className="absolute right-2 md:right-6 rounded-full bg-white/5 hover:bg-white/10 p-2 md:p-3 text-white transition-colors duration-300 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-xl border border-white/10 bg-[#0c0a20]"
            >
              <img
                src={study.gallery[activeImageIndex].src}
                alt={study.gallery[activeImageIndex].caption || "Zoomed Gallery Image"}
                className="max-h-[75vh] max-w-full object-contain mx-auto block"
              />
              {study.gallery[activeImageIndex].caption && (
                <div className="bg-black/60 border-t border-white/5 p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-white font-medium">
                    {study.gallery[activeImageIndex].caption}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.3em] text-white/45">{label}</dt>
      <dd className="mt-2 text-[15px] text-white/90">{value}</dd>
    </div>
  );
}

function Block({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b]">{eyebrow}</div>
      <h2 className="mt-4 font-serif text-[36px] leading-[1.05] tracking-tight text-white md:text-[52px]">
        {title}
      </h2>
      <p className="mt-6 text-[17px] leading-[1.65] text-white/80">{body}</p>
    </motion.div>
  );
}
