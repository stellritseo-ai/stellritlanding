import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import imgAnalytics from "@/assets/conver.webp";
import imgFintech from "@/assets/uxui.png";
import imgCyber from "@/assets/cyber.jpg";

type Study = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  image: string;
  ratio: string;
  align: "left" | "right";
  offsetY?: string;
  accentColor: string;
  glowColor: string;
};

const STUDIES: Study[] = [
  {
    slug: "impressions-to-clicks",
    title: "Converting Impressions to Clicks",
    subtitle: "Converting ad impressions into action for National Home Services",
    tags: ["SEM Strategy", "A/B Testing", "Conversion Rate", "SEO"],
    image: imgAnalytics,
    ratio: "aspect-[16/10]",
    align: "left",
    accentColor: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.15)",
  },
  {
    slug: "ux-ui-conversions",
    title: "How UX/UI Increases Conversion Rates",
    subtitle: "Redesigning Finvise to reduce bounce rates and maximize signups",
    tags: ["UX/UI Design", "Frictionless Checkout", "Conversion Optimization"],
    image: imgFintech,
    ratio: "aspect-[9/11]",
    align: "right",
    offsetY: "md:mt-12 lg:mt-16",
    accentColor: "#10b981", // Emerald to match the new case study theme
    glowColor: "rgba(16, 185, 129, 0.15)",
  },
  {
    slug: "cybersecurity-zero-trust",
    title: "Cybersecurity – Zero Trust for a Financial Institution",
    subtitle: "Deploying complete security framework for Meridian Trust Bank",
    tags: ["Zero Trust Network", "Multi-Factor Authentication", "Compliance", "SIEM"],
    image: imgCyber,
    ratio: "aspect-[16/11]",
    align: "left",
    offsetY: "md:-mt-[425px]",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.12)",
  },
];

export default function CaseStudies() {
  return (
    <section className="relative z-10 py-10 md:py-14 overflow-hidden">
      {/* Background ambient glows */}
      <div
        className="pointer-events-none absolute -left-40 top-1/4 h-[600px] w-[600px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="mx-auto max-w-[1150px] px-6">
        {/* Section Title */}
        <div className="max-w-4xl mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.5em] text-[#ff8a5b] font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a5b]" />
            Case Studies
          </span>
          <h2 className="font-serif text-[32px] leading-[1.05] tracking-tight text-white sm:text-[44px] md:text-[60px] lg:text-[72px]">
            Selected digital <span className="text-white/40 italic font-normal">craftsmanship.</span>
          </h2>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-10">
          {STUDIES.map((s, i) => (
            <CaseCard key={s.title} study={s} index={i} />
          ))}
        </div>

        {/* Global CTA */}
        <div className="mt-[14px] flex justify-start">
          <Link
            to="/case-studies"
            className="group inline-flex items-center gap-3.5 rounded-full border border-white/10 bg-white/5 px-9 py-4.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_35px_rgba(255,255,255,0.06)]"
          >
            All Case Studies
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c2dd9] text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ study, index }: { study: Study; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const isLinked = study.slug === "impressions-to-clicks" || study.slug === "ux-ui-conversions" || study.slug === "cybersecurity-zero-trust";
  const Wrapper = isLinked ? Link : "div";
  const wrapperProps = isLinked
    ? { to: `/case-studies/${study.slug}` as any, className: "block" }
    : { className: "block" };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-85px" }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative ${study.offsetY ?? ""} ${isLinked ? "cursor-pointer" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Wrapper {...(wrapperProps as any)}>
        {/* Image Card Frame */}
        <div
          className={`overflow-hidden rounded-2xl ${study.ratio} relative border border-white/[0.06] bg-[#0c061d] transition-all duration-500 ease-out`}
          style={{
            boxShadow: isHovered
              ? `0 0 50px ${study.glowColor}, 0 20px 40px rgba(0,0,0,0.4)`
              : "0 4px 30px rgba(0,0,0,0.25)",
            transform: isHovered ? "translateY(-4px)" : "translateY(0)"
          }}
        >
          {/* Overlay gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-85 z-10 transition-opacity duration-300 group-hover:opacity-90" />

          {/* Floating Top Tags Overlay */}
          <div className="absolute top-5 left-5 z-20 flex flex-wrap gap-2 max-w-[80%]">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-wider uppercase font-semibold text-white/95 bg-[#0f0a20]/80 border border-white/[0.08] backdrop-blur-md px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Floating View Arrow Icon */}
          <div
            className="absolute top-5 right-5 z-20 h-10 w-10 rounded-full border flex items-center justify-center text-white transition-all duration-500 ease-out backdrop-blur-md"
            style={{
              borderColor: isHovered ? `${study.accentColor}60` : "rgba(255,255,255,0.08)",
              background: isHovered ? `${study.accentColor}25` : "rgba(15,10,32,0.6)",
              transform: isHovered ? "scale(1.1) rotate(45deg)" : "scale(0.9) rotate(0deg)",
              opacity: isHovered ? 1 : 0.6
            }}
          >
            <ArrowUpRight className="h-4.5 w-4.5" />
          </div>

          {/* Card Image */}
          <motion.img
            src={study.image}
            alt={study.title}
            loading="lazy"
            className="h-full w-full object-cover origin-center"
            animate={{
              scale: isHovered ? 1.05 : 1.0,
            }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Description & Typography Block */}
        <div className="mt-8 px-1">
          <h3 className="inline-flex items-center gap-3 font-serif text-[28px] md:text-[34px] leading-tight text-white tracking-tight transition-colors duration-300">
            {study.title}
            <span
              className="w-1.5 h-1.5 rounded-full transition-transform duration-500"
              style={{
                background: study.accentColor,
                transform: isHovered ? "scale(2.2)" : "scale(1.0)"
              }}
            />
          </h3>
          <p className="mt-2 text-[14px] md:text-[15px] text-white/55 font-medium leading-relaxed max-w-md">
            {study.subtitle}
          </p>
        </div>
      </Wrapper>
    </motion.article>
  );
}
