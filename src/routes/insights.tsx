import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import Insights from "@/components/Insights";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Essays on Brand, Product & Growth | StellR IT" },
      {
        name: "description",
        content:
          "Essays, case notes and field reports on brand, product design, engineering and growth from the StellR IT studio.",
      },
      { property: "og:title", content: "Insights — StellR IT LLC" },
      {
        property: "og:description",
        content: "Field notes from the StellR studio on craft, strategy and growth.",
      },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
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
        className="py-[70px]"
      />
      <Insights className="py-[70px]" />
      <CtaBand title="Want these in your inbox?" subtitle="One thoughtful dispatch a month. No filler, ever." className="py-[70px]" />
      <Footer />
      <ChatWidget />
    </main>
  );
}
