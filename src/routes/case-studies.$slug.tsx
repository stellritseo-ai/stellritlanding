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
  head: ({ loaderData }) => {
    const s = loaderData?.study;
    if (!s) return { meta: [{ title: "Case Study — StellR IT LLC" }] };
    return {
      meta: [
        { title: `${s.title} — Case Study | StellR IT LLC` },
        { name: "description", content: `${s.subtitle}. ${s.overview.slice(0, 140)}` },
        { property: "og:title", content: `${s.title} — Case Study` },
        { property: "og:description", content: s.subtitle },
        { property: "og:image", content: s.hero },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: s.hero },
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
      <section className="relative z-10 px-6 pt-10 pb-16 md:px-12 lg:px-20">
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
              <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b]">
                {study.industry} — {study.year}
              </div>
              <h1 className="text-glow mt-6 font-serif text-[56px] font-normal leading-[0.98] tracking-tight text-white md:text-[96px] lg:text-[120px]">
                {study.title}
              </h1>
              <p className="mt-6 max-w-xl text-[19px] leading-[1.5] text-white/85">
                {study.subtitle}
              </p>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="grid grid-cols-2 gap-y-8 self-end text-white md:grid-cols-2"
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
            className={`mt-14 overflow-hidden rounded-sm ${study.ratio} relative`}
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

      {/* Overview / Challenge */}
      <section className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
          <Block eyebrow="The brief" title="Overview" body={study.overview} />
          <Block eyebrow="The problem" title="Challenge" body={study.challenge} />
        </div>
      </section>

      {/* Approach */}
      <section className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b]">Our approach</div>
          <h2 className="mt-5 max-w-3xl font-serif text-[44px] leading-[1.02] tracking-tight text-white md:text-[68px]">
            How we got there.
          </h2>
          <ol className="mt-14 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {study.approach.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="flex gap-5 border-t border-white/10 pt-6"
              >
                <span className="font-serif text-[28px] leading-none text-[#c9a4ff]">
                  0{i + 1}
                </span>
                <p className="text-[16px] leading-[1.65] text-white/80">{a}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Results */}
      <section className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b]">Outcomes</div>
          <h2 className="mt-5 max-w-3xl font-serif text-[44px] leading-[1.02] tracking-tight text-white md:text-[68px]">
            The results.
          </h2>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 md:grid-cols-4">
            {study.results.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="bg-white/[0.03] px-6 py-12 text-white"
              >
                <div className="font-serif text-[48px] leading-none md:text-[64px]">{r.value}</div>
                <div className="mt-4 text-[12px] uppercase tracking-[0.25em] text-white/55">
                  {r.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b]">Gallery</div>
          <h2 className="mt-5 max-w-3xl font-serif text-[44px] leading-[1.02] tracking-tight text-white md:text-[68px]">
            Selected screens.
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {study.gallery.map((g, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: (i % 2) * 0.08 }}
                className={`group ${g.tall ? "md:row-span-2" : ""}`}
              >
                <div
                  className={`relative overflow-hidden rounded-sm ${
                    g.tall ? "aspect-[9/11]" : "aspect-[16/10]"
                  }`}
                >
                  <img
                    src={g.src}
                    alt={g.caption ?? study.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
                {g.caption && (
                  <figcaption className="mt-3 text-[13px] text-white/55">{g.caption}</figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="relative z-10 px-6 py-24 md:px-12 lg:px-20">
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-[1100px] text-center"
        >
          <p className="font-serif text-[32px] leading-[1.25] tracking-tight text-white md:text-[52px]">
            <span className="text-[#ff8a5b]">“</span>
            {study.quote.text}
            <span className="text-[#ff8a5b]">”</span>
          </p>
          <footer className="mt-8 text-[13px] uppercase tracking-[0.3em] text-white/55">
            {study.quote.author} — {study.quote.role}
          </footer>
        </motion.blockquote>
      </section>

      {/* Services tags */}
      <section className="relative z-10 px-6 pb-8 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-[1400px] flex-wrap gap-3">
          {study.services.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/75"
            >
              <Check className="h-3 w-3 text-[#c9a4ff]" />
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Next case study */}
      <section className="relative z-10 px-6 py-20 md:px-12 lg:px-20">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
              <div className="text-[11px] uppercase tracking-[0.4em] text-[#ff8a5b]">Next case study</div>
              <div className="mt-3 flex items-end justify-between gap-6">
                <h3 className="font-serif text-[40px] leading-none text-white md:text-[72px]">
                  {next.title}
                </h3>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-[#2a0860] transition group-hover:scale-110">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 max-w-xl text-[15px] text-white/80">{next.subtitle}</p>
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
