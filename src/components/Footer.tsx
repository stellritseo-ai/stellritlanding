const CLIENTS = ["CODA", "RATIO:", "BRIXTON", "HSBC", "LAB", "OCTOPUS MONEY", "PICNIQ", "WILDERNESS", "THREECOLTS", "BUCHERER"];

const SERVICES = [
  "UX/UI & Digital Products",
  "High-Performance Websites",
  "Brand Identity & Positioning",
  "Flexible Design Support",
];

const LINKS = ["Latest case studies", "Contact us"];

const HONORS = ["ALLIANCE", "BIMA", "NET", "AGENCY HACKERS"];

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#1a0533] text-white">
      {/* Marquee */}
      <div className="overflow-hidden border-y border-white/10 py-10">
        <div className="flex animate-[marquee_40s_linear_infinite] gap-16 whitespace-nowrap px-8">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <span
              key={i}
              className="font-serif text-2xl tracking-widest text-white/70 md:text-3xl"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 lg:px-20">
        {/* Top: brand + contact */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-16 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-10">
            <span className="font-serif text-5xl font-medium tracking-tight md:text-6xl">
              StellR
            </span>
            <span className="max-w-md text-sm text-white/60 md:text-base">
              Exceptional design, seamless collaboration.
            </span>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm md:items-end md:text-base">
            <a href="mailto:hello@stellr.it" className="text-white/90 transition-colors hover:text-[#ff8a5b]">
              hello@stellr.it
            </a>
            <a href="tel:+4407738288101" className="text-white/70 transition-colors hover:text-white">
              +44 07738 288101
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <h4 className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
              Our Services
            </h4>
            <ul className="space-y-5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-lg text-white/90 transition-colors hover:text-[#ff8a5b] md:text-xl"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
              Useful Links
            </h4>
            <ul className="space-y-5">
              {LINKS.map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-lg text-white/90 transition-colors hover:text-[#ff8a5b] md:text-xl"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
              Honors
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {HONORS.map((h) => (
                <div
                  key={h}
                  className="flex aspect-square items-center justify-center border border-white/15 px-2 text-center text-[10px] font-semibold uppercase tracking-widest text-white/70 transition-colors hover:border-[#ff8a5b] hover:text-white"
                >
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} StellR IT LLC. All rights reserved.</span>
          <nav className="flex flex-wrap gap-8">
            <a href="#" className="transition-colors hover:text-white">Environmental Sustainability</a>
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">AI Policy</a>
          </nav>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
