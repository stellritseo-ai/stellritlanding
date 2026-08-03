import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import ScrollBackground from "@/components/ScrollBackground";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

import productImg from "@/assets/product.jpg";
import brandImg from "@/assets/service-brand.jpg";
import aiImg from "@/assets/ai.jpg";
import marketingImg from "@/assets/marketing.webp";
import uxuiImg from "@/assets/uxui.png";
import appImg from "@/assets/app.jpg";

export const Route = createFileRoute("/insights")({
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
  component: InsightsPage,
});

const CATEGORIES = ["ALL INSIGHTS", "CREATIVE", "INNOVATION", "STRATEGY", "TECHNOLOGY"];

const ARTICLES = [
  {
    id: 1,
    title: "Product Design Can Bridge Marketing, Product, and Engineering",
    description: "In complex organizations, it's not uncommon for marketing, product, and engineering teams to each operate at full speed, yet out of alignment. Design thinking acts as the universal translator.",
    category: "STRATEGY",
    tags: ["BUSINESS STRATEGY", "PRODUCT DESIGN"],
    image: productImg,
  },
  {
    id: 2,
    title: "Choose an Enterprise Web Design Agency That Can Scale Your Business",
    description: "Most enterprise websites fail not from bad design, but from weak engineering foundations. Learn how to choose a web agency that can truly scale with your business's ambition.",
    category: "STRATEGY",
    tags: ["BUSINESS STRATEGY", "ENTERPRISE WEBSITE", "GROWTH"],
    image: brandImg,
  },
  {
    id: 3,
    title: "People-First AI & Web Development",
    description: "Since its public release, Generative AI has accelerated from a niche technology into a force reshaping user expectations. Here's how to integrate AI without losing the human touch.",
    category: "INNOVATION",
    tags: ["AI", "ENGINEERING", "WEB DEVELOPMENT"],
    image: aiImg,
  },
  {
    id: 4,
    title: "Is Your SEO Ready for Google's AI Overviews?",
    description: "Google's AI Overviews are reshaping the search experience, pushing traditional organic results even further down. Here is what that means for your brand's visibility and how to adapt.",
    category: "TECHNOLOGY",
    tags: ["SEO", "CONTENT CREATION", "MARKETING"],
    image: marketingImg,
  },
  {
    id: 5,
    title: "Web Animation: Wake Up Your Site!",
    description: "Wake up your static business website with purposeful web animation. Motion design isn't just about aesthetics; it's a critical tool for guiding user attention and reducing cognitive load.",
    category: "CREATIVE",
    tags: ["UX AGENCY", "WEB DESIGN", "MOTION"],
    image: uxuiImg,
  },
  {
    id: 6,
    title: "The Value of Continuous User Feedback",
    description: "User feedback is valuable, but the sheer volume of review requests can be overwhelming. As requests skyrocket, making it crucial for B2B platforms to be strategic in how they listen.",
    category: "STRATEGY",
    tags: ["STRATEGY", "USER FEEDBACK", "B2B SAAS"],
    image: appImg,
  },
];


function InsightsPage() {
  const [activeTab, setActiveTab] = useState("ALL INSIGHTS");

  const filteredArticles = ARTICLES.filter(
    (article) => activeTab === "ALL INSIGHTS" || article.category === activeTab
  );

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://stellrit.com/insights#blog",
    name: "StellR IT Insights",
    description:
      "Expert insights, case notes, and field reports on custom software development, UX/UI design, AI automation, SaaS, and digital marketing strategy.",
    url: "https://stellrit.com/insights",
    publisher: {
      "@type": "Organization",
      "@id": "https://stellrit.com/#organization",
      name: "StellR IT LLC",
      logo: { "@type": "ImageObject", url: "https://stellrit.com/fav.png" },
    },
    blogPost: ARTICLES.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.description,
      keywords: a.tags.join(", "),
      articleSection: a.category,
      author: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
      publisher: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
      datePublished: "2025-06-01",
      dateModified: "2026-07-01",
      url: `https://stellrit.com/insights`,
      mainEntityOfPage: { "@type": "WebPage", "@id": "https://stellrit.com/insights" },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://stellrit.com" },
      { "@type": "ListItem", position: 2, name: "Insights", item: "https://stellrit.com/insights" },
    ],
  };

  return (
    <main className="relative min-h-screen selection:bg-[#a855f7]/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ScrollBackground />
      <SiteHeader transparent />

      <PageHero
        eyebrow="Insights"
        title="Insights"
        description="For industry leaders, fintech, e-commerce, arts & entertainment, consumer goods, healthcare, commercial real estate, non-profits, and education."
      />

      <section className="bg-[#FAF5EE] pt-32 md:pt-40 pb-20 text-[#240945]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-16 border-b border-[#240945]/10 pb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`relative pb-4 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors ${
                  activeTab === cat ? "text-[#a855f7]" : "text-[#240945]/60 hover:text-[#240945]"
                }`}
              >
                {cat}
                {activeTab === cat && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a855f7]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Articles */}
          <div className="flex flex-col gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article) => (
                <motion.article
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative bg-transparent hover:bg-white overflow-hidden flex flex-col md:flex-row md:items-center transition-all duration-300 hover:shadow-[0_10px_40px_rgba(36,9,69,0.05)] cursor-pointer"
                >
                  {/* Left content */}
                  <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                    <h2 className="font-serif text-[24px] md:text-[32px] lg:text-[36px] leading-[1.15] tracking-tight font-medium mb-4 text-[#240945] group-hover:text-[#a855f7] transition-colors duration-300">
                      {article.title}
                    </h2>
                    <p className="text-[13px] md:text-[14px] leading-[1.6] text-[#240945]/70 mb-8 max-w-xl">
                      {article.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-auto relative z-20">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 border border-[#240945]/10 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase text-[#240945]/60 bg-transparent transition-colors group-hover:border-[#240945]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="w-full md:w-[40%] lg:w-[45%] h-[200px] md:h-[220px] lg:h-[240px] relative overflow-hidden bg-[#f4eff8] md:mr-8 lg:mr-10 md:rounded-xl">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-10 h-10 rounded-full bg-[#a855f7] flex items-center justify-center text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-lg z-10 pointer-events-none">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>



        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#180028] border-t border-white/10 py-[60px]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 relative">
          <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-gradient-to-tl from-[#ff8a5b]/20 to-transparent blur-[80px] rounded-full pointer-events-none" />
          
          <motion.h2 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[40px] md:text-[50px] leading-[1.05] tracking-tight text-white mb-10 max-w-[1000px] relative z-10"
          >
            We look forward to hearing about your project. Let's collaborate, win new customers, and move your brand forward.
          </motion.h2>
          <Link to="/contact" className="inline-flex relative z-10 items-center justify-center px-10 py-5 bg-[#a855f7] text-white rounded-full text-[15px] font-bold tracking-wide transition-transform hover:scale-105 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            Partner With Us
          </Link>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}
