import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
import MarqueeStrip from "@/components/MarqueeStrip";
import ParallaxText from "@/components/ParallaxText";
import PartnershipModels from "@/components/PartnershipModels";
import Portfolio from "@/components/Portfolio";
import CustomCursor from "@/components/CustomCursor";
import HomeFAQSection, { homeFAQs } from "@/components/faq";
import { useEffect } from "react";
import { logVisitorFn } from "@/lib/dashboard.functions.server";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      {
        title:
          "StellR IT LLC — Custom Software & AI Development Company USA",
      },
      {
        name: "description",
        content:
          "StellR IT LLC is a leading custom software development company and AI development company in the USA. We provide web development, SaaS, mobile apps, digital marketing, and dedicated engineering teams in Dallas, TX.",
      },
      {
        name: "keywords",
        content:
          "web development company USA, custom software development company USA, software development company USA, AI development company USA, AI automation company USA, custom AI development services, mobile app development company USA, eCommerce development company USA, UI UX design agency USA, digital product development company, SaaS development company USA, custom web development company, web development company Dallas TX, software development company Dallas TX, AI development company Dallas TX, AI automation company Dallas TX, mobile app development Dallas TX, eCommerce development Dallas TX, SEO company Dallas TX, digital marketing agency Dallas TX, AI software development, generative AI development, LLM integration, custom AI solutions, React development, Next.js development, Flutter development, dedicated development team, offshore development company, white label development, staff augmentation, IT outsourcing, digital transformation company",
      },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      // Open Graph
      {
        property: "og:title",
        content:
          "StellR IT LLC — AI Development Company | Custom Software | Digital Transformation",
      },
      {
        property: "og:description",
        content:
          "Leading AI development, custom software engineering, SaaS, mobile apps & digital transformation. Dedicated remote engineering teams for agencies and enterprises worldwide.",
      },
      { property: "og:url", content: "https://stellrit.com" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { property: "og:image:alt", content: "StellR IT LLC — AI Development & Software Engineering Company" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "StellR IT LLC — AI Development Company | Custom Software Development",
      },
      {
        name: "twitter:description",
        content:
          "Leading AI development, software engineering, SaaS & digital transformation. Dedicated remote teams worldwide.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com" }],
  }),
  component: Index,
}));

function Index() {
  useEffect(() => {
    logVisitorFn().catch((err) => console.error("Failed to log visitor view:", err));
  }, []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFAQs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://stellrit.com/#services",
    name: "StellR IT LLC — AI & Software Development Services",
    description: "Comprehensive AI development, software engineering, and digital transformation services",
    itemListElement: [
      {
        "@type": "ListItem", position: 1,
        item: {
          "@type": "Service",
          name: "AI Software Development",
          description: "Custom AI software development including generative AI, LLM integration, chatbots, voice agents, and AI automation systems.",
          provider: { "@id": "https://stellrit.com/#organization" },
          serviceType: "AI Development",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 2,
        item: {
          "@type": "Service",
          name: "Custom Software Development",
          description: "Enterprise-grade custom software development, SaaS platforms, web applications, and API development.",
          provider: { "@id": "https://stellrit.com/#organization" },
          serviceType: "Software Development",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 3,
        item: {
          "@type": "Service",
          name: "Mobile App Development",
          description: "iOS, Android, Flutter, and React Native mobile app development for enterprises and startups.",
          provider: { "@id": "https://stellrit.com/#organization" },
          serviceType: "Mobile Development",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 4,
        item: {
          "@type": "Service",
          name: "Dedicated Engineering Teams",
          description: "Fully managed dedicated remote development teams including AI engineers, full-stack developers, designers, QA, and DevOps.",
          provider: { "@id": "https://stellrit.com/#organization" },
          serviceType: "Staff Augmentation",
          areaServed: "Worldwide",
          url: "https://stellrit.com/services",
        },
      },
      {
        "@type": "ListItem", position: 5,
        item: {
          "@type": "Service",
          name: "Digital Marketing & SEO",
          description: "Data-driven SEO, Google Ads, social media marketing, content marketing, and conversion rate optimization.",
          provider: { "@id": "https://stellrit.com/#organization" },
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
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://stellrit.com/#organization",
    name: "StellR IT LLC",
    url: "https://stellrit.com",
    logo: "https://stellrit.com/og-image.png",
    image: "https://stellrit.com/og-image.png",
    description: "Leading AI development company and custom software development firm offering generative AI, automation systems, SaaS platforms, and dedicated engineering teams.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Garland",
      addressRegion: "TX",
      addressCountry: "US"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@stellrit.com"
    },
    sameAs: [
      "https://www.linkedin.com/company/stellrit"
    ]
  };

  const siteNavSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://stellrit.com/#sitelinks",
    name: "StellR IT Navigation",
    itemListElement: [
      { "@type": "SiteNavigationElement", position: 1, name: "Services", url: "https://stellrit.com/services" },
      { "@type": "SiteNavigationElement", position: 2, name: "About Us", url: "https://stellrit.com/about" },
      { "@type": "SiteNavigationElement", position: 3, name: "Portfolio", url: "https://stellrit.com/portfolio" },
      { "@type": "SiteNavigationElement", position: 4, name: "Case Studies", url: "https://stellrit.com/case-studies" },
      { "@type": "SiteNavigationElement", position: 5, name: "Insights", url: "https://stellrit.com/insights" },
      { "@type": "SiteNavigationElement", position: 6, name: "Careers", url: "https://stellrit.com/careers" },
      { "@type": "SiteNavigationElement", position: 7, name: "Contact", url: "https://stellrit.com/contact" },
    ],
  };

  return (
    <main className="relative min-h-screen w-full max-w-full">
      <CustomCursor />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavSchema) }}
      />
      <ScrollBackground />
      <SiteHeader transparent homepage />
      <Hero />
      {/* content-visibility:auto skips rendering off-screen sections until scrolled into view */}
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 800px" }}>
        <Welcome />
        <Services />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 900px" }}>
        <PartnershipModels />
        <CaseStudies />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 900px" }}>
        <Testimonials />
        <Portfolio />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "0 700px" }}>
        <Insights />
      </div>
      <HomeFAQSection />

      <Footer />
      <ChatWidget />
    </main>
  );
}
