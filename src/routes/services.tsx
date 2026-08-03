import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import ScrollBackground from "@/components/ScrollBackground";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

import uxVideo from "@/assets/video/UX.mp4";
import brandVideo from "@/assets/video/Brand.mp4";
import webProductVideo from "@/assets/video/Web-Product.mp4";
import webDevVideo from "@/assets/video/Web-Development.mp4";
import marketingVideo from "@/assets/video/Website-Management.mp4";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      {
        title:
          "AI & Software Development Services | StellR IT LLC — Web, Mobile, SaaS & Automation",
      },
      {
        name: "description",
        content:
          "StellR IT LLC offers AI development, custom software, SaaS, web & mobile development, dedicated engineering teams, UX/UI design, brand identity, API development, and digital marketing. Serving startups to enterprises worldwide. Free consultation.",
      },
      {
        name: "keywords",
        content:
          "AI development services, AI software development, generative AI services, AI chatbot development, AI automation services, LLM integration services, custom software development services, SaaS development services, web development services, mobile app development services, React development services, Next.js development services, Flutter development services, dedicated AI engineers, dedicated software developers, remote development team services, staff augmentation services, IT outsourcing services, white label development services, UX UI design services, brand identity design, API development services, DevOps services, digital marketing services, SEO services, enterprise software development, healthcare software development, dental AI solutions, business process automation services, AI consulting services, CRM development services, ERP development services, ecommerce development services, Shopify development, WordPress development",
      },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      {
        property: "og:title",
        content: "AI & Software Development Services — StellR IT LLC",
      },
      {
        property: "og:description",
        content:
          "Complete AI development, software engineering, SaaS, web & mobile development services. Dedicated remote teams for agencies and enterprises. Free consultation.",
      },
      { property: "og:url", content: "https://stellrit.com/services" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { property: "og:image:alt", content: "StellR IT LLC — AI & Software Development Services" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "AI & Software Development Services — StellR IT LLC",
      },
      {
        name: "twitter:description",
        content:
          "AI, software, SaaS, web, mobile & dedicated teams. Full-service digital engineering.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com/services" }],
  }),
  component: ServicesPage,
});

const avatar1 = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop";
const avatar2 = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&auto=format&fit=crop";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-10">
      {items.map((item, i) => (
        <li key={i} className="flex items-start text-[14px] text-[#240945]/80 font-medium">
          <span className="mr-3 mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#ff8a5b]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

const servicesFAQs = [
  {
    q: "What software development services does StellR IT LLC offer?",
    a: "StellR IT LLC offers end-to-end software development services including: custom software development, SaaS platform development, web application development, mobile app development (iOS, Android, Flutter, React Native), API development, CRM and ERP development, eCommerce development (Shopify, WooCommerce), cloud application development, and DevOps services.",
  },
  {
    q: "Does StellR IT develop AI-powered applications?",
    a: "Yes. StellR IT LLC specializes in AI software development including generative AI applications, AI chatbots, AI voice agents, LLM integrations (OpenAI GPT, Claude, Gemini), RAG (Retrieval-Augmented Generation) systems, AI workflow automation, AI customer support systems, AI CRM, computer vision, and predictive analytics.",
  },
  {
    q: "Can StellR IT provide dedicated development teams for my agency?",
    a: "Absolutely. StellR IT LLC provides white-label dedicated development teams for digital agencies and businesses worldwide. We offer dedicated AI engineers, full-stack developers, React/Next.js developers, Flutter developers, UI/UX designers, QA engineers, DevOps engineers, and project managers — fully managed and ready to integrate with your team.",
  },
  {
    q: "How does StellR IT handle web development projects?",
    a: "Our web development process covers everything from UX research and wireframing to development and deployment. We specialize in React, Next.js, custom web applications, headless CMS, eCommerce, and corporate websites. All projects include performance optimization, SEO foundation, accessibility (WCAG), and mobile-first responsive design.",
  },
  {
    q: "What digital marketing services does StellR IT provide?",
    a: "StellR IT LLC's digital marketing services include SEO (technical, local, enterprise), Google Ads, Facebook Ads, content marketing, social media marketing, email marketing, conversion rate optimization (CRO), and analytics setup (GA4, Google Tag Manager, Meta Pixel, LinkedIn Insight Tag).",
  },
  {
    q: "How quickly can StellR IT start a new project?",
    a: "StellR IT LLC typically onboards new clients within 48-72 business hours. After an initial free consultation, we provide a detailed proposal and can have a dedicated team assembled and working within one week. For urgent projects, we can begin scoping and planning within 24 hours.",
  },
];

function ServicesFAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section
      aria-label="Frequently Asked Questions about StellR IT LLC Services"
      className="bg-[#FAF5EE] text-[#240945] py-[60px]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
        <div className="mb-10">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">
            FAQ
          </span>
          <h2 className="font-serif text-[36px] md:text-[48px] font-bold leading-tight mb-4">
            Services FAQ
          </h2>
          <p className="text-[16px] text-[#240945]/70 max-w-xl">
            Common questions about our services, capabilities, and how we work.
          </p>
        </div>
        <div className="space-y-3">
          {servicesFAQs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#240945]/10 bg-white/60 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                id={`svc-faq-btn-${i}`}
                aria-controls={`svc-faq-panel-${i}`}
              >
                <span className="font-semibold text-[15px] text-[#180028]">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-[#240945]/50 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div
                  id={`svc-faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`svc-faq-btn-${i}`}
                  className="px-6 pb-5"
                >
                  <p className="text-[14px] text-[#240945]/75 leading-[1.7]">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPage() {
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://stellrit.com/services#services",
    name: "StellR IT LLC — Complete AI & Software Development Services",
    itemListElement: [
      {
        "@type": "ListItem", position: 1,
        item: {
          "@type": "Service",
          name: "AI Software Development",
          description: "Custom AI software development: generative AI, LLM integration, chatbots, voice agents, AI automation, RAG systems.",
          provider: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
          serviceType: "AI Development",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 2,
        item: {
          "@type": "Service",
          name: "UX Research & Strategy",
          description: "Strategy-led UX and UI for web, SaaS, and mobile. We engineer calm, intuitive interfaces designed to convert and retain your users.",
          provider: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
          serviceType: "UX Design",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 3,
        item: {
          "@type": "Service",
          name: "Brand Identity Design",
          description: "Crafting iconic identities that command attention. We build distinctive brand systems, naming, and messaging.",
          provider: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
          serviceType: "Brand Design",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 4,
        item: {
          "@type": "Service",
          name: "Custom Software & Web Development",
          description: "Full-stack development in React, Next.js, and modern frameworks. Enterprise-grade reliability and performance.",
          provider: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
          serviceType: "Software Development",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 5,
        item: {
          "@type": "Service",
          name: "Mobile App Development",
          description: "iOS, Android, Flutter, and React Native mobile applications for enterprises, startups, and agencies.",
          provider: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
          serviceType: "Mobile Development",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 6,
        item: {
          "@type": "Service",
          name: "Dedicated Engineering Teams",
          description: "White-label dedicated remote development teams: AI engineers, full-stack developers, designers, QA, DevOps for agencies worldwide.",
          provider: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
          serviceType: "Staff Augmentation",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 7,
        item: {
          "@type": "Service",
          name: "SaaS Development",
          description: "End-to-end SaaS product development from MVP to enterprise scale including architecture, APIs, billing, and DevOps.",
          provider: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
          serviceType: "SaaS Development",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 8,
        item: {
          "@type": "Service",
          name: "Digital Marketing & SEO",
          description: "Data-driven paid and organic campaigns: SEO, Google Ads, content marketing, social media, email marketing, and CRO.",
          provider: { "@type": "Organization", "@id": "https://stellrit.com/#organization" },
          serviceType: "Digital Marketing",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://stellrit.com" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://stellrit.com/services" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: servicesFAQs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <main className="relative min-h-screen selection:bg-[#ff8a5b]/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ScrollBackground />
      <SiteHeader transparent />

      <PageHero
        eyebrow="Services"
        title={
          <>
            One team. The <em className="font-serif italic text-[#c9a4ff]">full</em> digital stack.
          </>
        }
        description="From AI development and brand foundations to engineered platforms and the growth programs that scale them. We replace the agency-of-agencies model with one accountable senior team."
      />

      <section className="bg-[#FAF5EE] text-[#240945] py-[60px]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-[60px] md:text-[96px] lg:text-[120px] font-bold leading-none tracking-tight mb-[60px]"
          >
            Our Perspective
          </motion.h1>

          {/* 1. UX Research */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-[60px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#a855f7]/20 blur-[80px] rounded-full pointer-events-none" />
              <video
                src={uxVideo}
                autoPlay
                muted
                loop
                playsInline
                aria-label="UX Research and Strategy demonstration video"
                className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_40px_rgba(36,9,69,0.1)] bg-white/50 border border-[#240945]/5"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">UX Research & Strategy</span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold leading-[1.15] mb-8">
                Strategy-led UX and UI for web, SaaS, and mobile. We engineer calm, intuitive interfaces designed to convert and retain your users.
              </h2>
              <BulletList
                items={[
                  "UX Research & Discovery",
                  "User Personas & Journeys",
                  "Information Architecture",
                  "Wireframing & Prototyping",
                  "Usability Testing",
                  "UX/UI Design Workshops",
                ]}
              />
              <Link to="/services/$slug" params={{ slug: "ux-research-strategy" }} className="inline-flex items-center justify-center px-8 py-3.5 bg-[#180028] text-[#FAF5EE] rounded-full text-[13px] font-semibold transition-transform hover:bg-[#240945] hover:scale-105 shadow-xl">
                View UX Research Service
              </Link>
            </motion.div>
          </div>

          {/* 2. Brand Identity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-[60px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">Brand Identity</span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold leading-[1.15] mb-8">
                Crafting iconic identities that command attention. We build distinctive brand systems, naming, and messaging that feel inevitable.
              </h2>
              <BulletList
                items={[
                  "Brand Positioning",
                  "Visual Identity",
                  "Naming & Verbal Strategy",
                  "Brand Architecture",
                  "Brand Guidelines",
                  "Content Strategy",
                ]}
              />
              <Link to="/services/$slug" params={{ slug: "brand-identity" }} className="inline-flex items-center justify-center px-8 py-3.5 bg-[#180028] text-[#FAF5EE] rounded-full text-[13px] font-semibold transition-transform hover:bg-[#240945] hover:scale-105 shadow-xl">
                View Brand Services
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ff8a5b]/20 blur-[80px] rounded-full pointer-events-none" />
              <video
                src={brandVideo}
                autoPlay
                muted
                loop
                playsInline
                aria-label="Brand Identity Design demonstration video"
                className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_40px_rgba(36,9,69,0.1)] bg-white/50 border border-[#240945]/5"
              />
            </motion.div>
          </div>

          {/* Testimonial 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#180028] text-white rounded-[24px] px-8 md:px-12 py-[60px] text-center relative overflow-hidden mb-[60px] shadow-2xl"
          >
            <p className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-white/95 mb-12 max-w-4xl mx-auto">
              "StellR IT LLC completely transformed our digital presence. Their attention to detail and engineering speed helped us launch our new platform months ahead of schedule."
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-4">
                <img src={avatar1} alt="David Chen, CTO at TechNova" width={48} height={48} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                <div className="text-left">
                  <strong className="block text-[14px] font-bold">David Chen</strong>
                  <span className="block text-[12px] text-white/60">CTO</span>
                </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-white/20 mx-4" />
              <span className="font-serif italic font-bold text-[28px] text-white/90">TechNova</span>
            </div>
          </motion.div>

          {/* 3. Web & Product Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-[60px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#cc7aff]/20 blur-[80px] rounded-full pointer-events-none" />
              <video
                src={webProductVideo}
                autoPlay
                muted
                loop
                playsInline
                aria-label="Web and Product Design demonstration video"
                className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_40px_rgba(36,9,69,0.1)] bg-white/50 border border-[#240945]/5"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">Web & Product Design</span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold leading-[1.15] mb-8">
                From concept to conversion — we design beautifully engineered digital products and SaaS platforms that scale with your ambition.
              </h2>
              <BulletList
                items={[
                  "Web Design & Architecture",
                  "SaaS Product Design",
                  "Design Systems",
                  "Mobile Applications",
                  "Interactive Prototyping",
                ]}
              />
              <Link to="/services/$slug" params={{ slug: "web-product-design" }} className="inline-flex items-center justify-center px-8 py-3.5 bg-[#180028] text-[#FAF5EE] rounded-full text-[13px] font-semibold transition-transform hover:bg-[#240945] hover:scale-105 shadow-xl">
                View Design Services
              </Link>
            </motion.div>
          </div>

          {/* 4. Web Development */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-[60px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">Web Development</span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold leading-[1.15] mb-8">
                Full-stack delivery in modern frameworks. For us, performance and reliability are core features, not afterthoughts.
              </h2>
              <BulletList
                items={[
                  "Custom Web Platforms",
                  "Headless Commerce",
                  "CMS Architecture",
                  "Edge & APIs",
                  "DevOps & Automation",
                ]}
              />
              <Link to="/services/$slug" params={{ slug: "web-development" }} className="inline-flex items-center justify-center px-8 py-3.5 bg-[#180028] text-[#FAF5EE] rounded-full text-[13px] font-semibold transition-transform hover:bg-[#240945] hover:scale-105 shadow-xl">
                View Web Services
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#7a2adc]/20 blur-[80px] rounded-full pointer-events-none" />
              <video
                src={webDevVideo}
                autoPlay
                muted
                loop
                playsInline
                aria-label="Web Development demonstration video"
                className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_40px_rgba(36,9,69,0.1)] bg-white/50 border border-[#240945]/5"
              />
            </motion.div>
          </div>

          {/* Testimonial 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#180028] text-white rounded-[24px] px-8 md:px-12 py-[60px] text-center relative overflow-hidden mb-[60px] shadow-2xl"
          >
            <p className="font-serif text-[24px] md:text-[32px] leading-[1.3] text-white/95 mb-12 max-w-4xl mx-auto">
              "The brand identity and product design work from StellR has elevated our market positioning entirely. The team is incredibly talented and accountable."
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-4">
                <img src={avatar2} alt="Sarah Jenkins, CMO at Nexus" width={48} height={48} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                <div className="text-left">
                  <strong className="block text-[14px] font-bold">Sarah Jenkins</strong>
                  <span className="block text-[12px] text-white/60">CMO</span>
                </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-white/20 mx-4" />
              <span className="font-serif tracking-[0.2em] uppercase font-bold text-[24px] text-white/90">NEXUS</span>
            </div>
          </motion.div>

          {/* 5. Digital Marketing & CRO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ff8a5b]/20 blur-[80px] rounded-full pointer-events-none" />
              <video
                src={marketingVideo}
                autoPlay
                muted
                loop
                playsInline
                aria-label="Digital Marketing and CRO demonstration video"
                className="relative z-10 w-full h-auto rounded-2xl shadow-[0_20px_40px_rgba(36,9,69,0.1)] bg-white/50 border border-[#240945]/5"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#240945]/60 mb-4 block">Digital Marketing & CRO</span>
              <h2 className="font-serif text-[32px] md:text-[40px] font-bold leading-[1.15] mb-8">
                Data-driven paid and organic campaigns that unlock compounding growth across every channel that matters.
              </h2>
              <BulletList
                items={[
                  "Paid Media & Advertising",
                  "SEO & SEM Strategy",
                  "Conversion Rate Optimization",
                  "Lifecycle & Email Marketing",
                  "Advanced Analytics",
                ]}
              />
              <Link to="/services/$slug" params={{ slug: "digital-marketing" }} className="inline-flex items-center justify-center px-8 py-3.5 bg-[#180028] text-[#FAF5EE] rounded-full text-[13px] font-semibold transition-transform hover:bg-[#240945] hover:scale-105 shadow-xl">
                View Marketing Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services FAQ Section */}
      <ServicesFAQSection />

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
            Start a Project
          </Link>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}
