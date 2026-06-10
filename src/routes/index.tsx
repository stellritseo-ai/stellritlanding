import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Services from "@/components/Services";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
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
      <section className="relative z-10 bg-[#180028] py-32 text-center">
        <p className="mx-auto max-w-2xl px-6 font-serif text-3xl italic leading-snug text-white/80 md:text-4xl">
          More chapters below — services, work, and the people behind StellR.
        </p>
      </section>
    </main>
  );
}
