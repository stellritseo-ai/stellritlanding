import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import CaseStudies from "@/components/CaseStudies";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      {
        title:
          "Case Studies \u2014 Enterprise Software Development & Digital Marketing Results | StellR IT LLC",
      },
      {
        name: "description",
        content:
          "Explore real-world case studies from StellR IT LLC: enterprise software development, SaaS product design, AI automation, digital marketing campaigns, and UX redesigns delivering measurable ROI for companies like LiveNation, Upli, and Tilton School.",
      },
      {
        name: "keywords",
        content:
          "enterprise software case studies, saas development results, ux redesign case study, digital marketing roi examples, ai automation case study, software development results, web design case studies, custom software development examples",
      },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content:
          "Case Studies \u2014 Software Development & Marketing Results | StellR IT LLC",
      },
      {
        property: "og:description",
        content:
          "Real results: SaaS design, AI automation, digital marketing & enterprise software. See the ROI we deliver.",
      },
      { property: "og:url", content: "https://stellrit.com/case-studies" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://stellrit.com/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Case Studies \u2014 Software Dev & Marketing ROI | StellR IT",
      },
      {
        name: "twitter:description",
        content:
          "Real ROI: SaaS, AI, digital marketing & software development results.",
      },
      { name: "twitter:image", content: "https://stellrit.com/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://stellrit.com/case-studies" }],
  }),
  component: WorkPage,
});

function WorkPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://stellrit.com" },
      { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://stellrit.com/case-studies" },
    ],
  };

  return (
    <main className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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

      {/* The Bottom Line Table */}
      <section className="relative z-10 px-6 py-16 md:px-12 lg:px-20 bg-white/[0.01] border-t border-b border-white/[0.05]">
        <div className="mx-auto max-w-[1300px]">
          <div className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.5em] text-[#ff8a5b] font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a5b]" />
              Comparative Summary
            </span>
            <h2 className="font-serif text-[28px] leading-[1.1] tracking-tight text-white sm:text-[36px] md:text-[44px]">
              The Bottom Line.
            </h2>
            <p className="mt-4 text-sm md:text-[15px] text-white/50 leading-relaxed max-w-xl">
              An overview of key metrics and return on investment across our core service verticals.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f0a20]/40 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-widest text-white/40">
                    <th className="px-8 py-5 font-semibold">Case Study Focus</th>
                    <th className="px-8 py-5 font-semibold">Core Impact Metric</th>
                    <th className="px-8 py-5 font-semibold text-right">ROI Highlight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.04] text-sm text-white/80 transition hover:bg-white/[0.02]">
                    <td className="px-8 py-6 font-medium flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                      Impressions → Clicks (National Home Services)
                    </td>
                    <td className="px-8 py-6 text-white/60">CTR ↑292% (from 1.2% to 4.7%)</td>
                    <td className="px-8 py-6 text-right font-semibold text-[#ff8a5b]">
                      62% lower CPC
                    </td>
                  </tr>
                  <tr className="border-b border-white/[0.04] text-sm text-white/80 transition hover:bg-white/[0.02] bg-white/[0.005]">
                    <td className="px-8 py-6 font-medium flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#ff8a5b]" />
                      UX/UI for Conversions (Finvise Startup)
                    </td>
                    <td className="px-8 py-6 text-white/60">Signups ↑3.4x (completion up to 41%)</td>
                    <td className="px-8 py-6 text-right font-semibold text-[#ff8a5b]">
                      +$1.2M AUM in 3 months
                    </td>
                  </tr>
                  <tr className="border-b border-white/[0.04] text-sm text-white/80 transition hover:bg-white/[0.02]">
                    <td className="px-8 py-6 font-medium flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                      Cybersecurity Zero Trust (Meridian Trust Bank)
                    </td>
                    <td className="px-8 py-6 text-white/60">Unauthorized access ↓99% (click rate to 2%)</td>
                    <td className="px-8 py-6 text-right font-semibold text-[#ff8a5b]">
                      Full compliance + 90% less IT firefighting
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Your project, next." subtitle="We onboard a few new partners every quarter." />
      <Footer />
      <ChatWidget />
    </main>
  );
}
