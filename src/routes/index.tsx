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
import MarqueeStrip from "@/components/MarqueeStrip";
import ParallaxText from "@/components/ParallaxText";
import PartnershipModels from "@/components/PartnershipModels";
import Portfolio from "@/components/Portfolio";
import CustomCursor from "@/components/CustomCursor";
import { useEffect } from "react";
import { logVisitorFn } from "@/lib/dashboard.functions.server";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "StellR IT LLC — Custom Software Development Company | Garland, TX",
      },
      {
        name: "description",
        content:
          "StellR IT LLC is a custom software development company and digital agency based in Garland, TX. We build enterprise web apps, SaaS platforms, AI automation systems, and growth-driven digital experiences for businesses worldwide.",
      },
      {
        name: "keywords",
        content:
          "custom software development company, enterprise software development services, saas development agency, custom web application development, software outsourcing company, software engineer consulting, mvp development, api development, digital agency garland texas, web design company, ux design agency, brand identity design, digital marketing agency",
      },
      { name: "robots", content: "index, follow" },
      // Open Graph
      {
        property: "og:title",
        content: "StellR IT LLC — Custom Software Development Company | Garland, TX",
      },
      {
        property: "og:description",
        content:
          "We build enterprise software, SaaS platforms, AI automation, and premium digital experiences. Based in Garland, TX — serving clients nationwide.",
      },
      { property: "og:url", content: "https://stellrit.com" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "StellR IT LLC — Custom Software Development & Digital Agency",
      },
      {
        name: "twitter:description",
        content:
          "Enterprise software, SaaS, AI automation & digital marketing. Garland, TX.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com" }],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    logVisitorFn().catch((err) => console.error("Failed to log visitor view:", err));
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://stellrit.com/#organization",
        name: "StellR IT LLC",
        url: "https://stellrit.com",
        logo: "https://stellrit.com/fav.png",
        description:
          "Custom software development company and digital agency in Garland, TX specializing in enterprise web apps, SaaS development, AI automation, and digital marketing.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Garland",
          addressRegion: "TX",
          addressCountry: "US",
        },
        areaServed: "US",
        priceRange: "$$",
        sameAs: ["https://twitter.com/StellRIT"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Digital Services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Software Development" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "SaaS Development" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Automation" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "UX Design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digital Marketing" } },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://stellrit.com/#website",
        url: "https://stellrit.com",
        name: "StellR IT LLC",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://stellrit.com/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <main className="relative min-h-screen">
      <CustomCursor />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollBackground />
      <SiteHeader transparent homepage />
      <Hero />
      <Welcome />


      <Services />

      <PartnershipModels />

      <CaseStudies />

      {/* <MarqueeStrip
        items={["TRUSTED BY 230+ BRANDS", "AWWWARDS NOMINEE", "WEBBY NOMINEE", "SOC II CERTIFIED", "GDPR COMPLIANT", "12+ YEARS OF CRAFT"]}
        speed={26}
        dir="left"
        size="sm"
      /> */}

      <Testimonials />
      <Portfolio />

      {/* <ParallaxText text="INSIGHTS & IDEAS" dir="right" opacity={0.06} className="-my-2" /> */}

      <Insights />
      <Footer />
      <ChatWidget />
    </main>
  );
}


