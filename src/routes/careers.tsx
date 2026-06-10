import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Join StellR IT LLC" },
      {
        name: "description",
        content:
          "Open roles at StellR IT. Senior designers, engineers and strategists shaping the next era of digital brands.",
      },
      { property: "og:title", content: "Careers — StellR IT LLC" },
      {
        property: "og:description",
        content: "Senior-only studio. Remote-friendly. Open roles in design, engineering and strategy.",
      },
    ],
  }),
  component: CareersPage,
});

const ROLES = [
  { title: "Senior Product Designer", team: "Design", location: "Garland, TX / Remote", type: "Full‑time" },
  { title: "Staff Front‑End Engineer", team: "Engineering", location: "Remote (Americas)", type: "Full‑time" },
  { title: "Brand Design Lead", team: "Brand", location: "Garland, TX", type: "Full‑time" },
  { title: "Growth Strategist", team: "Growth", location: "Remote (Global)", type: "Full‑time" },
  { title: "Motion Designer", team: "Design", location: "Remote", type: "Contract" },
  { title: "Project Director", team: "Operations", location: "Garland, TX", type: "Full‑time" },
];

const PERKS = [
  { t: "Senior-only team", d: "Work alongside people you'll learn from every day." },
  { t: "Remote-friendly", d: "Hub in Garland, TX. Async by default." },
  { t: "Real ownership", d: "Equity participation for full-time roles after year one." },
  { t: "Learning budget", d: "$2,000/year for books, courses, conferences." },
  { t: "Top-tier tooling", d: "Whatever helps you do the best work of your career." },
  { t: "Time off", d: "Unlimited PTO with a 20-day floor. We track to enforce it." },
];

function CareersPage() {
  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent />
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Make the best work of your <em className="font-serif italic text-[#c9a4ff]">career</em>.
          </>
        }
        description="We hire senior practitioners and trust them to lead. If you want to ship work you're proud of with people who care deeply about craft — read on."
      />

      {/* Perks */}
      <section className="relative z-10 px-4 sm:px-6 pb-12 md:pb-24 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p, i) => (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            >
              <h3 className="font-serif text-[24px] text-white">{p.t}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-white/65">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Roles */}
      <section className="relative z-10 px-4 sm:px-6 py-16 md:py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-serif text-[38px] leading-[1.05] tracking-tight text-white md:text-[72px]">
            Open roles.
          </h2>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {ROLES.map((r, i) => (
              <motion.a
                key={r.title}
                href="mailto:info@stellrit.com?subject=Application: "
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="group grid grid-cols-1 items-center gap-3 py-6 md:grid-cols-[1.4fr_1fr_1fr_auto] md:gap-8"
              >
                <h3 className="font-serif text-[22px] text-white transition-colors group-hover:text-[#c9a4ff] md:text-[28px] lg:text-[30px]">{r.title}</h3>
                <span className="text-[13px] uppercase tracking-[0.2em] text-white/60">{r.team}</span>
                <span className="flex items-center gap-2 text-[14px] text-white/70">
                  <MapPin className="h-4 w-4" /> {r.location}
                </span>
                <span className="flex items-center gap-2 text-[13px] text-white/70">
                  {r.type}
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition group-hover:border-[#ff8a5b] group-hover:text-[#ff8a5b]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </span>
              </motion.a>
            ))}
          </div>
          <p className="mt-10 text-[14px] text-white/60">
            Don't see your role? Email{" "}
            <a href="mailto:info@stellrit.com" className="text-white underline underline-offset-4 hover:text-[#ff8a5b]">
              info@stellrit.com
            </a>{" "}
            with what you'd bring.
          </p>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}
