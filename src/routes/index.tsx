import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import Insights from "@/components/Insights";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import PartnershipModels from "@/components/PartnershipModels";
import Portfolio from "@/components/Portfolio";
import CustomCursor from "@/components/CustomCursor";
import HomeFAQSection, { homeFAQs } from "@/components/faq";
import { useEffect } from "react";
import { logVisitorFn } from "@/lib/dashboard.functions.server";
import {
  SITE_URL,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildRouteHead,
  buildWebPageSchema,
  canonicalUrl,
} from "@/lib/seo";

export const Route = createFileRoute("/")(({
  head: () =>
    buildRouteHead({
      title: "StellR IT LLC — AI Development & Custom Software Company | Garland, TX",
      description:
        "StellR IT LLC is a US-based AI development and custom software engineering company in Garland, Texas. We build custom AI applications, autonomous AI agents, RAG chatbots, SaaS platforms, web & mobile apps, and dedicated engineering teams.",
      path: "/",
      imageAlt: "StellR IT LLC — AI Development & Custom Software Engineering Company",
    }),
  component: Index,
}));

function Index() {
  useEffect(() => {
    // Skip automated/headless browsers and duplicate logs within the same browser session
    if (typeof navigator !== "undefined" && navigator.webdriver) return;
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
    try {
      if (sessionStorage.getItem("stellr_visit_logged")) return;
      sessionStorage.setItem("stellr_visit_logged", "1");
    } catch {
      // sessionStorage unavailable
    }
    logVisitorFn().catch((err) => console.error("Failed to log visitor view:", err));
  }, []);

  const webPageSchema = buildWebPageSchema({
    type: "WebPage",
    name: "StellR IT LLC — AI Development & Custom Software Engineering Company",
    description:
      "Custom AI development, autonomous AI agents, RAG chatbots, SaaS platforms, web & mobile engineering, and dedicated remote teams from Garland, Texas.",
    path: "/",
  });

  const faqSchema = buildFaqSchema(homeFAQs);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#services`,
    name: "StellR IT LLC — AI & Software Development Services",
    description:
      "Core AI development, custom software engineering, SaaS, mobile, and digital growth services.",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Service",
          name: "AI Software Development",
          description:
            "Custom AI software development, generative AI applications, LLM integration, and secure enterprise AI systems.",
          provider: { "@id": `${SITE_URL}/#organization` },
          serviceType: "AI Development",
          areaServed: "United States",
          url: canonicalUrl("/services/ai-software-development"),
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Service",
          name: "AI Automation & Autonomous Agents",
          description:
            "Autonomous AI agents, workflow automation, CRM/ERP orchestration, and AI customer support systems.",
          provider: { "@id": `${SITE_URL}/#organization` },
          serviceType: "AI Workflow Automation",
          areaServed: "United States",
          url: canonicalUrl("/services/ai-automation-agents"),
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Service",
          name: "Custom AI Chatbot & RAG Development",
          description:
            "Enterprise RAG chatbots, vector search pipelines, and omnichannel conversational AI.",
          provider: { "@id": `${SITE_URL}/#organization` },
          serviceType: "Conversational AI",
          areaServed: "United States",
          url: canonicalUrl("/services/ai-chatbot-development"),
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Service",
          name: "Custom Web & Software Development",
          description:
            "Full-stack custom software, Next.js/React web platforms, headless eCommerce, and API engineering.",
          provider: { "@id": `${SITE_URL}/#organization` },
          serviceType: "Custom Software Development",
          areaServed: "United States",
          url: canonicalUrl("/services/web-development"),
        },
      },
      {
        "@type": "ListItem",
        position: 5,
        item: {
          "@type": "Service",
          name: "SaaS Development",
          description:
            "Multi-tenant SaaS architecture, MVP-to-enterprise product engineering, billing, and DevOps.",
          provider: { "@id": `${SITE_URL}/#organization` },
          serviceType: "SaaS Development",
          areaServed: "United States",
          url: canonicalUrl("/services/saas-development"),
        },
      },
      {
        "@type": "ListItem",
        position: 6,
        item: {
          "@type": "Service",
          name: "Mobile App Development",
          description:
            "Cross-platform React Native, Flutter, iOS, and Android mobile application engineering.",
          provider: { "@id": `${SITE_URL}/#organization` },
          serviceType: "Mobile App Development",
          areaServed: "United States",
          url: canonicalUrl("/services/mobile-app-development"),
        },
      },
      {
        "@type": "ListItem",
        position: 7,
        item: {
          "@type": "Service",
          name: "Dedicated Engineering Teams",
          description:
            "Dedicated AI engineers, full-stack developers, designers, QA, and staff augmentation with US timezone overlap.",
          provider: { "@id": `${SITE_URL}/#organization` },
          serviceType: "Staff Augmentation",
          areaServed: "United States",
          url: canonicalUrl("/services/dedicated-teams"),
        },
      },
      {
        "@type": "ListItem",
        position: 8,
        item: {
          "@type": "Service",
          name: "Digital Marketing, SEO & CRO",
          description:
            "Technical SEO, AI search readiness (AEO/GEO), paid search, and conversion rate optimization.",
          provider: { "@id": `${SITE_URL}/#organization` },
          serviceType: "Digital Marketing & SEO",
          areaServed: "United States",
          url: canonicalUrl("/services/digital-marketing"),
        },
      },
    ],
  };

  const breadcrumbSchema = buildBreadcrumbSchema([{ name: "Home", path: "/" }]);

  return (
    <main className="relative min-h-screen w-full max-w-full">
      <CustomCursor />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ScrollBackground />
      <SiteHeader transparent homepage />
      <Hero />
      {/* content-visibility:auto skips rendering off-screen sections until scrolled into view;
          auto keyword remembers rendered heights to prevent scroll jumping */}
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "auto none auto 1100px" }}>
        <Welcome />
        <Services />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "auto none auto 1200px" }}>
        <PartnershipModels />
        <CaseStudies />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "auto none auto 1200px" }}>
        <Testimonials />
        <Portfolio />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "auto none auto 700px" }}>
        <Insights />
      </div>
      <HomeFAQSection />

      <Footer />
      <ChatWidget />
    </main>
  );
}
