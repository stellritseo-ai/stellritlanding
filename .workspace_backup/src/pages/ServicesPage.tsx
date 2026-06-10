import { useEffect } from "react";

import { Check } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import PartnershipModels from "@/components/PartnershipModels";

const SERVICES = [
  { num: "01", title: "Brand Building", blurb: "Distinctive identity systems, naming, editorial and motion. We build brands that feel inevitable.", items: ["Visual Identity", "Naming & Verbal", "Editorial Design", "Brand Motion", "Guidelines"] },
  { num: "02", title: "Product Design", blurb: "Strategy-led UX and UI for web, SaaS and mobile. Calm interfaces engineered to convert and retain.", items: ["UX Research", "Design Systems", "Web & SaaS", "Mobile Apps", "Prototyping"] },
  { num: "03", title: "Engineering", blurb: "Full-stack delivery in TypeScript, React, Next and edge runtimes. Performance is a feature.", items: ["Web Platforms", "Headless Commerce", "CMS Architecture", "Edge & APIs", "DevOps"] },
  { num: "04", title: "Growth Marketing", blurb: "Paid, organic and lifecycle programs powered by analytics. We measure what matters and compound it.", items: ["Paid Media", "SEO & SEM", "Conversion Rate Optimisation", "Lifecycle & Email", "Analytics"] },
];

const PROCESS = [
  { t: "Discover", d: "Workshops, audits and stakeholder interviews to align on the actual problem." },
  { t: "Define", d: "Strategy, IA, positioning and a measurable success model the team rallies behind." },
  { t: "Design", d: "Concept exploration, design systems, prototypes and iterative refinement." },
  { t: "Develop", d: "Production engineering with the same craft as the design. Shipped and observable." },
  { t: "Distribute", d: "Launch, growth programs and continuous optimisation against KPIs." },
];

export default function ServicesPage() {
  useEffect(() => { document.title = "Services — Brand, Product, Growth | StellR IT LLC"; }, []);

  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Services"
        title={<>One team. The <em className="font-serif italic text-[#c9a4ff]">full</em> digital stack.</>}
        description="From brand foundations to engineered platforms and the growth programs that scale them. We replace the agency-of-agencies model with one accountable senior team."
      />

      <section className="relative z-10 px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px] space-y-px">
          {SERVICES.map((s, i) => (
            <div key={s.title} className="grid grid-cols-1 gap-8 border-t border-white/15 py-14 md:grid-cols-[120px_1fr_1fr] md:gap-14">
              <div className="font-serif text-[44px] text-[#ff8a5b]">{s.num}</div>
              <div>
                <h3 className="font-serif text-[40px] leading-tight text-white md:text-[56px]">{s.title}</h3>
                <p className="mt-4 max-w-md text-[15px] leading-[1.65] text-white/70">{s.blurb}</p>
              </div>
              <ul className="space-y-3 self-center">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-[15px] text-white/85">
                    <Check className="h-4 w-4 text-[#c9a4ff]" />{it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-serif text-[44px] leading-[1.05] tracking-tight text-white md:text-[72px]">How we work.</h2>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-5">
            {PROCESS.map((p, i) => (
              <div key={p.t} className="border-t border-white/10 pt-6">
                <div className="text-[11px] uppercase tracking-[0.3em] text-[#ff8a5b]">Step 0{i + 1}</div>
                <h3 className="mt-3 font-serif text-[26px] text-white">{p.t}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-white/65">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnershipModels />
      <CtaBand title="Have a project in mind?" subtitle="Share the brief — we'll respond with a senior point of view, fast." />
      <Footer />
      <ChatWidget />
    </main>
  );
}
