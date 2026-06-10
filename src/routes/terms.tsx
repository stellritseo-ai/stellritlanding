import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — StellR IT LLC" },
      { name: "description", content: "Terms governing the use of the StellR IT LLC website and services." },
      { property: "og:title", content: "Terms of Use — StellR IT LLC" },
      { property: "og:description", content: "Terms governing use of stellr.it and our services." },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    t: "Acceptance",
    d: "By accessing stellr.it you agree to these Terms. If you disagree with any part, please discontinue use of the site.",
  },
  {
    t: "Use of content",
    d: "All content on this site is © StellR IT LLC unless otherwise noted. You may share with attribution; commercial reuse requires written permission.",
  },
  {
    t: "Engagements",
    d: "Project work is governed by a separate Master Services Agreement and Statement of Work signed by both parties.",
  },
  {
    t: "Disclaimers",
    d: "The site is provided 'as is'. We make no warranties regarding accuracy, availability or fitness for a particular purpose.",
  },
  {
    t: "Limitation of liability",
    d: "To the maximum extent permitted by law, StellR IT LLC shall not be liable for indirect, incidental or consequential damages arising from your use of the site.",
  },
  {
    t: "Governing law",
    d: "These Terms are governed by the laws of the State of California, USA. Any disputes shall be resolved in the courts located in Los Angeles County.",
  },
  {
    t: "Changes",
    d: "We may revise these Terms from time to time. Continued use after changes constitutes acceptance of the updated Terms.",
  },
];

function TermsPage() {
  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="Last updated June 10, 2026. The terms governing your use of the StellR IT LLC website."
      />
      <article className="relative z-10 mx-auto max-w-[860px] px-6 pb-32 md:px-12">
        <div className="space-y-10">
          {SECTIONS.map((s, i) => (
            <section key={s.t}>
              <h2 className="font-serif text-[28px] text-white">
                {i + 1}. {s.t}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-white/75">{s.d}</p>
            </section>
          ))}
        </div>
      </article>
      <Footer />
    </main>
  );
}
