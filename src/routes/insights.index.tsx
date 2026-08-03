import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, ArrowUpRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import ScrollBackground from "@/components/ScrollBackground";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { INSIGHT_ARTICLES } from "@/data/insights";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      {
        title:
          "AI & Tech Insights — Software, Automation & Digital Strategy Blog | StellR IT LLC",
      },
      {
        name: "description",
        content:
          "Expert insights, guides, and articles on AI development, generative AI, software engineering, automation, SaaS, mobile apps, web development, SEO, and digital marketing strategy from the StellR IT LLC engineering team.",
      },
      {
        name: "keywords",
        content:
          "AI development blog, software development insights, generative AI articles, AI automation guide, LLM integration tutorial, SaaS development tips, web development blog, mobile app development guide, digital marketing strategy, SEO tips, business automation, AI for business, machine learning tutorials, AI chatbot guide, RAG implementation, custom software insights, technology blog, engineering blog",
      },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      {
        property: "og:title",
        content: "AI & Tech Insights — Software & Digital Strategy Blog | StellR IT LLC",
      },
      {
        property: "og:description",
        content:
          "Expert articles on AI development, software engineering, SaaS, automation, web & mobile development, SEO and digital marketing from the StellR IT engineering team.",
      },
      { property: "og:url", content: "https://stellrit.com/insights" },
      { property: "og:type", content: "blog" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { property: "og:image:alt", content: "StellR IT LLC Insights — AI & Software Development Blog" },
      { property: "article:publisher", content: "https://www.linkedin.com/company/stellrit" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "AI & Tech Insights — Software Blog | StellR IT LLC",
      },
      {
        name: "twitter:description",
        content:
          "AI development, software engineering, automation & digital marketing insights from the StellR IT LLC team.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com/insights" }],
  }),
  component: InsightsIndexPage,
});

const CATEGORIES = ["ALL INSIGHTS", "INNOVATION", "STRATEGY", "TECHNOLOGY", "CREATIVE"];

function InsightsIndexPage() {
  const [activeTab, setActiveTab] = useState("ALL INSIGHTS");

  const filteredArticles = INSIGHT_ARTICLES.filter(
    (article) => activeTab === "ALL INSIGHTS" || article.category === activeTab
  );

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://stellrit.com/insights#blog",
    name: "StellR IT Insights",
    description:
      "Expert insights, guides, and articles on AI development, custom software engineering, generative AI, SaaS, and digital marketing strategy.",
    url: "https://stellrit.com/insights",
    publisher: {
      "@type": "Organization",
      "@id": "https://stellrit.com/#organization",
      name: "StellR IT LLC",
      logo: { "@type": "ImageObject", url: "https://stellrit.com/fav.png" },
    },
    blogPost: INSIGHT_ARTICLES.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.description,
      keywords: a.tags.join(", "),
      articleSection: a.category,
      url: `https://stellrit.com/insights/${a.slug}`,
      author: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
      publisher: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
      datePublished: a.publishedDate,
      dateModified: a.lastUpdated,
    })),
  };

  const featuredArticle = INSIGHT_ARTICLES[0];

  return (
    <main className="relative min-h-screen text-white bg-[#180028] selection:bg-[#ff8a5b]/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <ScrollBackground />
      <SiteHeader transparent />

      <PageHero
        eyebrow="Insights & Field Notes"
        title={
          <>
            Perspectives on <em className="font-serif italic text-[#c9a4ff]">AI</em>, engineering & growth.
          </>
        }
        description="Field notes, technical guides, and strategic essays from our senior engineering studio on building modern AI, software products, and global brands."
      />

      <section className="bg-[#FAF5EE] text-[#240945] py-[60px]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
          
          {/* Featured Pillar Article Hero Card */}
          {featuredArticle && (
            <div className="mb-16 rounded-3xl bg-[#180028] text-white p-8 md:p-12 border border-[#240945]/10 shadow-2xl relative overflow-hidden group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#ff8a5b]">
                    <span className="px-3 py-1 bg-[#ff8a5b]/10 rounded-full border border-[#ff8a5b]/20">
                      FEATURED GUIDE
                    </span>
                    <span className="flex items-center gap-1 text-white/50">
                      <Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight group-hover:text-[#c9a4ff] transition-colors">
                    <Link to="/insights/$slug" params={{ slug: featuredArticle.slug }}>
                      {featuredArticle.title}
                    </Link>
                  </h2>

                  <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-2xl">
                    {featuredArticle.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      to="/insights/$slug"
                      params={{ slug: featuredArticle.slug }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#a855f7] hover:bg-[#a855f7]/90 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-transform hover:scale-105 shadow-lg"
                    >
                      Read Complete Guide <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 relative">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-12 border-b border-[#240945]/10 pb-6">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === category
                    ? "bg-[#180028] text-[#FAF5EE] shadow-md"
                    : "bg-white/40 text-[#240945]/70 hover:bg-white/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredArticles.map((article) => (
                <article
                  key={article.slug}
                  className="bg-white/70 rounded-2xl p-6 border border-[#240945]/10 flex flex-col justify-between hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <div>
                    <div className="relative rounded-xl overflow-hidden mb-6 aspect-[16/10]">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#180028]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
                        {article.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#240945]/50 mb-3">
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.publishedDate}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#180028] leading-tight mb-3 group-hover:text-[#a855f7] transition-colors">
                      <Link to="/insights/$slug" params={{ slug: article.slug }}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs md:text-sm text-[#240945]/70 leading-relaxed mb-6 line-clamp-3">
                      {article.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#240945]/10 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-[#240945]/40">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to="/insights/$slug"
                      params={{ slug: article.slug }}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#180028] group-hover:text-[#a855f7] transition-colors"
                    >
                      Read <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}
