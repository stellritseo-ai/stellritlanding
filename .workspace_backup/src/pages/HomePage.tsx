import { useEffect } from "react";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Services from "@/components/Services";
import PartnershipModels from "@/components/PartnershipModels";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Insights from "@/components/Insights";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import MarqueeStrip from "@/components/MarqueeStrip";
import StatsBand from "@/components/StatsBand";
import ParallaxText from "@/components/ParallaxText";

export default function HomePage() {
  useEffect(() => {
    document.title = "StellR IT LLC — Digital Evolution for Business";
  }, []);

  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <Hero />

      <MarqueeStrip
        items={["BRAND IDENTITY", "WEB DESIGN", "ENGINEERING", "GROWTH MARKETING", "UX STRATEGY", "DIGITAL EVOLUTION", "AI INTEGRATION", "CRO & ANALYTICS"]}
        speed={30}
        dir="left"
        size="md"
      />

      <Welcome />
      <StatsBand />

      <ParallaxText text="WE BUILD DIGITAL" dir="left" opacity={0.06} className="-my-4" />

      <Services />

      <MarqueeStrip
        items={["NEXT.JS", "REACT", "FIGMA", "FRAMER", "WEBFLOW", "SHOPIFY", "NODE.JS", "PYTHON", "AWS", "VERCEL"]}
        speed={22}
        dir="right"
        size="sm"
      />

      <ParallaxText text="CRAFT · STRATEGY · IMPACT" dir="right" opacity={0.055} className="-my-4" />

      <PartnershipModels />

      <ParallaxText text="SELECTED WORK" dir="left" opacity={0.065} className="-my-2" />

      <CaseStudies />

      <MarqueeStrip
        items={["TRUSTED BY 230+ BRANDS", "AWWWARDS NOMINEE", "WEBBY NOMINEE", "SOC II CERTIFIED", "GDPR COMPLIANT", "12+ YEARS OF CRAFT"]}
        speed={26}
        dir="left"
        size="sm"
      />

      <Testimonials />
      <Faq />

      <ParallaxText text="INSIGHTS & IDEAS" dir="right" opacity={0.06} className="-my-2" />

      <Insights />
      <Footer />
      <ChatWidget />
    </main>
  );
}
