import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import CaseStudies from "@/components/CaseStudies";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies — Selected Work | StellR IT LLC" },
      {
        name: "description",
        content:
          "Selected case studies from StellR IT — work for LiveNation, News Corp, Upli, Tilton School and more.",
      },
      { property: "og:title", content: "Case Studies — StellR IT LLC" },
      {
        property: "og:description",
        content: "Selected work for enterprise brands and category leaders.",
      },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Selected Work"
        title={
          <>
            Work that moves <em className="font-serif italic text-[#c9a4ff]">markets</em>, not just metrics.
          </>
        }
        description="A small selection of partnerships across entertainment, fintech, education and enterprise. Full case studies available on request."
      />
      <CaseStudies />
      <CtaBand title="Your project, next." subtitle="We onboard a few new partners every quarter." />
      <Footer />
      <ChatWidget />
    </main>
  );
}
