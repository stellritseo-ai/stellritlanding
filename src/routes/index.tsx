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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StellR IT LLC — Digital Evolution for Business" },
      { name: "description", content: "StellR IT LLC is a premium digital agency crafting unforgettable websites, products, and campaigns for enterprise brands." },
      { property: "og:title", content: "StellR IT LLC — Digital Evolution for Business" },
      { property: "og:description", content: "Premium digital agency for enterprise brands. Award-winning design, engineering, and storytelling." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
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

