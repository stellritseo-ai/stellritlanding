import { motion } from "framer-motion";

const STATS = [
  { value: "230+", label: "Enterprise brands that have partnered with us" },
  { value: "$95B", label: "Business sales we have been trusted with" },
  { value: "92%", label: "Partner retention rate over seven years" },
  { value: "62%", label: "Average boost in conversion rate" },
];

const TESTIMONIALS = [
  {
    quote:
      "Isadora Agency brings empathy to human-computer interaction, setting them apart from other providers.",
    brand: "KBB.COM",
    brandSub: "Kelley Blue Book",
    span: "md:col-span-2",
  },
  {
    quote:
      "Extraordinarily grateful for Isadora's dedication in propelling our brand forward.",
    brand: "Popcornopolis",
    brandClass: "font-serif italic text-[28px]",
    span: "md:col-span-2",
  },
  {
    quote:
      "Transparent, responsive, and organized—ensuring success on time and within budget.",
    brand: "NCCER",
    brandClass: "font-bold tracking-wider text-[26px]",
  },
  {
    quote: "Isadora transformed our vision into an award-winning website.",
    brand: "logitech",
    brandClass: "text-[26px] lowercase tracking-tight",
  },
  {
    quote: "They delivered exactly what we wanted. Highly recommend.",
    brand: "✸ Razor",
    brandClass: "font-bold text-[26px]",
  },
];

export default function Testimonials() {
  return (
    <section className="relative z-10 bg-[#1a0033] py-28 md:py-36">
      <div className="mx-auto max-w-[1240px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-serif text-[32px] leading-[1.15] tracking-tight text-white md:text-[52px] lg:text-[60px]"
        >
          Leading brands turn to us at pivotal moments of digital evolution. Our
          global creative <Underlined>team</Underlined> fuses story,{" "}
          <Underlined>technology,</Underlined> and <Underlined>design</Underlined>{" "}
          to make experiences that captivate and <Underlined>convert.</Underlined>
        </motion.h2>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-1 gap-y-14 gap-x-12 sm:grid-cols-2 md:mt-32 md:gap-y-20">
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
              className="flex items-start gap-6"
            >
              <span className="font-serif text-[72px] leading-none tracking-tight text-[#f5b59a] md:text-[88px]">
                {s.value}
              </span>
              <span className="mt-3 max-w-[200px] text-sm leading-snug text-white/80">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Testimonial grid */}
        <div className="mt-24 grid grid-cols-1 border-l border-t border-white/15 md:mt-32 md:grid-cols-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className={`group relative flex flex-col justify-between border-b border-r border-white/15 p-8 transition-colors duration-500 hover:bg-white/[0.03] md:p-10 ${t.span ?? "md:col-span-2"}`}
            >
              <span className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-[#ff8a5b]/70" />
              <p className="text-[15px] leading-relaxed text-white/85 md:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-12 flex items-end justify-end">
                {t.brandSub ? (
                  <div className="flex items-center gap-2 text-white">
                    <span className="grid h-9 w-9 place-items-center rounded-sm bg-white/10 text-[8px] font-bold leading-tight">
                      BLUE<br/>BOOK
                    </span>
                    <div className="leading-tight">
                      <div className="text-[10px] uppercase tracking-wider text-white/70">{t.brandSub}</div>
                      <div className="text-lg font-bold tracking-wide">{t.brand}</div>
                      <div className="text-[9px] uppercase tracking-wider text-white/60">The Trusted Resource</div>
                    </div>
                  </div>
                ) : (
                  <span className={`text-white ${t.brandClass ?? "text-2xl"}`}>{t.brand}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Underlined({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <span className="absolute left-0 right-0 -bottom-1 h-px bg-white/90" />
    </span>
  );
}
