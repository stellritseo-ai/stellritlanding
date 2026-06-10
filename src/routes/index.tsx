import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import Insights from "@/components/Insights";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";

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
      <Hero />
      <Welcome />
      <Services />
      <CaseStudies />
      <Testimonials />
      <Insights />
      <Footer />
    </main>
  );
}
