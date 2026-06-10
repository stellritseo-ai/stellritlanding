const STATS = [
  { value: "230+", label: "Enterprise brands" },
  { value: "$95B",  label: "Business sales handled" },
  { value: "92%",   label: "Partner retention" },
  { value: "62%",   label: "Avg. conversion lift" },
  { value: "12+",   label: "Years of craft" },
  { value: "27",    label: "Countries served" },
];

export default function StatsBand() {
  return (
    <section className="relative z-10 border-y border-white/10 bg-white/[0.015] py-16 md:py-20 overflow-hidden">
      {/* Subtle purple glow behind */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.5), transparent 70%)", filter: "blur(80px)" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="group flex flex-col items-start border-l border-white/10 px-6 py-4 first:border-l-0"
            >
              <span className="font-serif text-[48px] leading-none tracking-tight text-white md:text-[56px]">
                {s.value}
              </span>
              <span className="mt-2 text-[12px] uppercase tracking-[0.25em] text-white/55">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
