import { useEffect } from "react";
import { Link } from "react-router-dom";

import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";

const STATS = [
  { v: "12+", l: "Years of craft" },
  { v: "180+", l: "Brands launched" },
  { v: "42", l: "Industry awards" },
  { v: "27", l: "Countries served" },
];

const VALUES = [
  { t: "Craft over output", d: "We ship fewer things, better. Every pixel, motion curve and line of code earns its place." },
  { t: "Strategy first", d: "Beautiful work that doesn't move metrics is decoration. We design to outcomes, not opinions." },
  { t: "Senior by default", d: "No layered agencies, no juniors learning on your dime. The team you meet is the team that delivers." },
  { t: "Long-term partners", d: "Most clients stay 3+ years. We invest in your roadmap like it's our own product." },
];

const TEAM = [
  { name: "Aiman Raza", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80&auto=format&fit=crop" },
  { name: "Daniel Ortiz", role: "Executive Creative Director", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80&auto=format&fit=crop" },
  { name: "Priya Anand", role: "Head of Strategy", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop" },
  { name: "Marcus Whitfield", role: "VP Engineering", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop" },
];

export default function AboutPage() {
  useEffect(() => { document.title = "About — StellR IT LLC | Premium Digital Agency"; }, []);

  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="The Agency"
        title={<>A studio for the <em className="font-serif italic text-[#c9a4ff]">next</em> era of digital brands.</>}
        description="StellR IT LLC is a senior-only digital agency based in Los Angeles and Lahore. We help category-defining companies move faster, design sharper, and ship work that earns attention."
      />

      <section className="relative z-10 px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px border-y border-white/10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.l} className="px-6 py-12 text-white">
              <div className="font-serif text-[56px] leading-none text-white md:text-[72px]">{s.v}</div>
              <div className="mt-3 text-[12px] uppercase tracking-[0.25em] text-white/55">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-serif text-[44px] leading-[1.05] tracking-tight text-white md:text-[72px]">What we believe.</h2>
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
            {VALUES.map((v, i) => (
              <div key={v.t} className="border-t border-white/15 pt-8">
                <div className="text-[12px] uppercase tracking-[0.3em] text-[#ff8a5b]">0{i + 1}</div>
                <h3 className="mt-4 font-serif text-[32px] leading-tight text-white md:text-[40px]">{v.t}</h3>
                <p className="mt-4 max-w-md text-[15px] leading-[1.65] text-white/70">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-[44px] leading-[1.05] tracking-tight text-white md:text-[72px]">The leadership.</h2>
            <Link to="/careers" className="hidden text-sm text-white/70 underline-offset-4 hover:text-white hover:underline md:block">Join the team →</Link>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {TEAM.map((p, i) => (
              <div key={p.name}>
                <div className="aspect-[4/5] overflow-hidden rounded-sm bg-[#1a0533]">
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
                <h3 className="mt-4 font-serif text-[22px] text-white">{p.name}</h3>
                <p className="text-[13px] text-white/60">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Want to work with us?" subtitle="We take on a limited number of partnerships each quarter." />
      <Footer />
      <ChatWidget />
    </main>
  );
}
