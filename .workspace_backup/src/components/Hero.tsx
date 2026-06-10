import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import MenuOverlay from "./MenuOverlay";

const CENTER_VIDEO =
  "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/ISA_FLOR_04__444_enp2ps";

const LOGOS = [
  "RAZOR", "HONEST", "LUMEN", "ORBIT", "NOVA", "VERTEX",
  "ATLAS", "PRISM", "ÆTHER", "HALO", "MERIDIAN", "CIPHER",
];

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative h-screen min-h-[700px] w-full overflow-hidden noise-overlay bg-[#0c0428]">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(180,80,255,0.35), transparent 70%)", filter: "blur(40px)" }}
        />
        <div
          className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(120,40,200,0.4), transparent 70%)", filter: "blur(50px)" }}
        />
      </div>

      {/* Nav */}
      <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <div className="font-serif text-2xl font-semibold tracking-tight text-glow text-white">
          StellR<span className="text-[#c9a4ff]">.</span>
          <span className="ml-1 text-xs font-sans tracking-[0.3em] text-white/60">IT LLC</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/contact" className="group glass flex items-center gap-2 rounded-full bg-white/95 py-2 pl-5 pr-2 text-sm font-medium text-[#2a0860] transition hover:bg-white">
            Let's Talk
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c2dd9] text-white transition group-hover:scale-110">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="glass grid h-12 w-12 place-items-center rounded-full text-white transition hover:bg-white/10">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Center hero video */}
      <div
        className="pointer-events-none absolute left-1/2 top-[20%] z-10 h-[360px] w-[360px] -translate-x-1/2 md:top-[18%] md:h-[480px] md:w-[480px] lg:h-[540px] lg:w-[540px]"
      >
        <div className="relative h-full w-full">
          <video
            src={CENTER_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={{
              maskImage: "radial-gradient(circle, black 55%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 75%)",
            }}
          />
        </div>
      </div>

      {/* Headline */}
      <h1 className="text-glow absolute left-1/2 top-[14%] z-30 w-full max-w-[1800px] -translate-x-1/2 px-6 text-center font-serif text-[60px] font-normal leading-[0.95] tracking-[-0.02em] text-white">
        Digital Evolution for Business
      </h1>

      {/* Left content */}
      <div className="absolute left-6 top-[42%] z-20 max-w-[320px] md:left-12">
        <p className="text-[15px] leading-[1.55] text-white/85">
          Our <a href="#" className="underline decoration-white/60 underline-offset-4 hover:decoration-white">creative studio</a> helps enterprise brands and market leaders navigate digital, evolve profitably, and launch unforgettable websites, products, and campaigns.
        </p>
      </div>

      {/* Right logo slider */}
      <div className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 md:block">
        <div
          className="relative h-[70px] w-[280px] overflow-hidden lg:w-[320px]"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="animate-scroll-left flex h-full flex-row flex-nowrap items-center gap-8 px-8">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div
                key={i}
                className="flex shrink-0 items-center justify-center whitespace-nowrap font-serif text-lg tracking-[0.2em] text-white/70 transition hover:text-white lg:text-2xl"
                style={{ opacity: 0.5 + ((i % 4) * 0.12) }}
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
