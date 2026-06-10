import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import Insights from "@/components/Insights";

export default function InsightsPage() {
  useEffect(() => {
    document.title = "Insights — Essays on Brand, Product & Growth | StellR IT";
  }, []);

  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Journal"
        title={
          <>
            Field notes from the <em className="font-serif italic text-[#c9a4ff]">studio</em>.
          </>
        }
        description="Essays on craft, strategy, design systems and growth. Written by the team, edited for signal."
      />
      <Insights />
      <CtaBand title="Want these in your inbox?" subtitle="One thoughtful dispatch a month. No filler, ever." />
      <Footer />
      <ChatWidget />
    </main>
  );
}
