import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import CaseStudies from "@/components/CaseStudies";
import { CASE_STUDIES } from "@/data/case-studies";
import {
  SITE_URL,
  buildBreadcrumbSchema,
  buildRouteHead,
  buildWebPageSchema,
  canonicalUrl,
} from "@/lib/seo";

export const Route = createFileRoute("/case-studies/")({
  head: () =>
    buildRouteHead({
      title: "Case Studies — AI, Custom Software & Digital Engineering | StellR IT LLC",
      description:
        "Review engineering and design case studies from StellR IT LLC across autonomous AI systems, SaaS product UX, React Native mobile apps, headless commerce, and growth marketing.",
      path: "/case-studies",
      imageAlt: "StellR IT LLC Case Studies — AI & Software Engineering",
    }),
  component: WorkPage,
});

function WorkPage() {
  const webPageSchema = buildWebPageSchema({
    type: "CollectionPage",
    name: "Case Studies — StellR IT LLC",
    description:
      "AI automation, custom software, SaaS UX, mobile app, headless eCommerce, and growth marketing case studies by StellR IT LLC.",
    path: "/case-studies",
  });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/case-studies#list`,
    name: "StellR IT LLC Case Studies",
    itemListElement: CASE_STUDIES.map((cs, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Article",
        name: cs.title,
        description: cs.subtitle,
        url: canonicalUrl(`/case-studies/${cs.slug}`),
      },
    })),
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Case Studies", path: "/case-studies" },
  ]);

  return (
    <main className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
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
