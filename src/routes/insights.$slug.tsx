import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ChevronDown, Clock, Calendar, Share2, Check, Bookmark, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import { getInsightArticle, INSIGHT_ARTICLES, type InsightArticle } from "@/data/insights";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const article = getInsightArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "Insight Article — StellR IT LLC" }] };

    const title = `${a.title} | StellR IT Insights`;
    const description = a.description;
    const url = `https://stellrit.com/insights/${params.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: a.tags.join(", ") },
        { name: "author", content: a.author.name },
        { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },

        // Open Graph
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: a.image },
        { property: "og:image:alt", content: a.title },
        { property: "article:published_time", content: a.publishedDate },
        { property: "article:modified_time", content: a.lastUpdated },
        { property: "article:section", content: a.category },
        { property: "article:publisher", content: "https://www.linkedin.com/company/stellrit" },

        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: a.image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                "@id": `${url}#article`,
                isPartOf: { "@id": "https://stellrit.com/insights#blog" },
                headline: a.title,
                description: a.description,
                image: [a.image],
                datePublished: a.publishedDate,
                dateModified: a.lastUpdated,
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
                author: {
                  "@type": "Organization",
                  name: a.author.name,
                  url: "https://stellrit.com/about",
                },
                publisher: {
                  "@type": "Organization",
                  "@id": "https://stellrit.com/#organization",
                  name: "StellR IT LLC",
                  logo: { "@type": "ImageObject", url: "https://stellrit.com/fav.png" },
                },
                articleSection: a.category,
                keywords: a.tags.join(", "),
                inLanguage: "en-US",
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://stellrit.com" },
                  { "@type": "ListItem", position: 2, name: "Insights", item: "https://stellrit.com/insights" },
                  { "@type": "ListItem", position: 3, name: a.title, item: url },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: a.faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: InsightDetailArticlePage,
});

function InsightDetailArticlePage() {
  const { article } = Route.useLoaderData() as { article: InsightArticle };
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative min-h-screen text-white bg-[#180028] selection:bg-[#ff8a5b]/30">
      <ScrollBackground />
      <SiteHeader transparent />

      {/* Hero / Header */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto">
        <Link
          to="/insights"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Insights
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.15em] text-[#ff8a5b] mb-4">
          <span className="px-3 py-1 bg-[#ff8a5b]/10 border border-[#ff8a5b]/20 rounded-full font-bold">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-white/50">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
          <span className="flex items-center gap-1.5 text-white/50">
            <Calendar className="w-3.5 h-3.5" /> Updated {article.lastUpdated}
          </span>
        </div>

        <h1 className="font-serif text-[36px] md:text-[56px] lg:text-[64px] font-bold leading-[1.1] tracking-tight mb-6 text-white">
          {article.title}
        </h1>

        <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-4xl mb-8">
          {article.subtitle}
        </p>

        {/* Author bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-4">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border border-white/20"
            />
            <div>
              <strong className="block text-sm font-bold text-white">{article.author.name}</strong>
              <span className="text-xs text-white/50">{article.author.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/15 rounded-full text-xs font-semibold transition-all text-white/80 hover:text-white"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? "Link Copied!" : "Share"}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Banner Image */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto mb-16">
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[16/9] md:aspect-[21/9]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#180028] via-transparent to-transparent opacity-60" />
        </div>
      </section>

      {/* Key Takeaways Box */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto mb-16">
        <div className="glass rounded-2xl p-6 md:p-8 border border-[#a855f7]/30 bg-[#a855f7]/5 relative overflow-hidden">
          <div className="flex items-center gap-3 text-[#a855f7] font-bold text-sm uppercase tracking-wider mb-4">
            <Sparkles className="w-5 h-5" /> Executive Key Takeaways
          </div>
          <ul className="space-y-3">
            {article.keyTakeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-base text-white/85 leading-relaxed">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#ff8a5b] shrink-0" />
                {takeaway}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Main Article Grid: Content + Sidebar */}
      <section className="px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Table of Contents (Desktop Sticky Sidebar) */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-28 space-y-6">
              <div className="glass rounded-xl p-6 border border-white/10 bg-white/5">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-4 block">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {article.tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-xs md:text-sm text-white/70 hover:text-[#ff8a5b] transition-colors py-1 leading-snug"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* CTA Box in Sidebar */}
              <div className="rounded-xl p-6 border border-[#a855f7]/30 bg-gradient-to-br from-[#7a2adc]/20 to-[#ff8a5b]/10 text-center">
                <h4 className="font-serif text-lg font-bold mb-2">Build With AI Today</h4>
                <p className="text-xs text-white/70 mb-4">
                  Need a custom AI software solution, LLM integration, or RAG architecture?
                </p>
                <Link
                  to="/contact"
                  className="inline-flex w-full items-center justify-center px-4 py-2.5 bg-[#a855f7] hover:bg-[#a855f7]/90 text-white rounded-full text-xs font-bold transition-all shadow-lg"
                >
                  Schedule Free Consultation
                </Link>
              </div>
            </div>
          </aside>

          {/* Article Body Content */}
          <article className="lg:col-span-8 order-1 lg:order-2 space-y-12 text-white/85 leading-[1.8] text-base md:text-lg">
            {article.content.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-32 space-y-6">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight pt-4 border-t border-white/10">
                  {sec.heading}
                </h2>

                {sec.body.map((p, pIdx) => (
                  <p key={pIdx} className="text-white/80">
                    {p}
                  </p>
                ))}

                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <div className="bg-white/5 border-l-2 border-[#ff8a5b] p-5 rounded-r-xl my-6">
                    <ul className="space-y-2.5">
                      {sec.bulletPoints.map((bp, bpIdx) => (
                        <li key={bpIdx} className="flex items-start text-sm text-white/90">
                          <span className="mr-2 text-[#ff8a5b]">✓</span> {bp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {sec.calloutBox && (
                  <div className="glass rounded-xl p-6 border border-white/15 bg-white/5 my-6">
                    <strong className="block text-sm font-bold text-[#ff8a5b] uppercase tracking-wider mb-2">
                      {sec.calloutBox.title}
                    </strong>
                    <p className="text-sm md:text-base text-white/90 italic">
                      "{sec.calloutBox.text}"
                    </p>
                  </div>
                )}
              </section>
            ))}

            {/* In-Article Action Link */}
            <div className="p-8 rounded-2xl border border-white/15 bg-gradient-to-r from-[#180028] via-[#240945] to-[#180028] my-12 text-center">
              <h3 className="font-serif text-2xl font-bold mb-3 text-white">
                Ready to Implement Custom Generative AI?
              </h3>
              <p className="text-sm text-white/70 max-w-xl mx-auto mb-6">
                StellR IT LLC provides dedicated senior AI engineers to build, security-audit, and scale custom AI solutions for your enterprise.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#a855f7] hover:bg-[#a855f7]/90 text-white font-bold text-sm rounded-full transition-transform hover:scale-105 shadow-xl"
              >
                Hire AI Developers Today
              </Link>
            </div>

            {/* Article FAQs Section */}
            {article.faqs && article.faqs.length > 0 && (
              <section id="faqs" className="scroll-mt-32 pt-8 border-t border-white/10 space-y-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff8a5b] block">
                  FAQ
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-3 pt-4">
                  {article.faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="glass rounded-xl border border-white/10 bg-white/5 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        aria-expanded={openFaq === i}
                        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                      >
                        <span className="font-semibold text-sm md:text-base text-white">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-white/50 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="px-6 pb-4">
                          <p className="text-sm text-white/75 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tags footer */}
            <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40 mr-2">
                Topics:
              </span>
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-white/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}
