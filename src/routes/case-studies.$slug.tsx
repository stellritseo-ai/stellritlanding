import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
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

  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />

      {/* Hero */}
      <section className="relative z-10 px-6 pt-10 pb-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
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
            className={`mt-14 overflow-hidden rounded-2xl ${study.ratio} relative border border-white/10`}
          >
            <img
              src={study.hero}
              alt={study.title}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
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
                        className={`border-b border-white/[0.04] text-sm text-white/80 transition hover:bg-white/[0.02] ${
                          index % 2 === 1 ? "bg-white/[0.005]" : ""
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
