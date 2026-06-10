import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu } from "lucide-react";
import MenuOverlay from "./MenuOverlay";
import logoImg from "@/assets/logo.png";

const NAV = [
  { to: "/case-studies", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "Agency" },
  { to: "/insights", label: "Insights" },
  { to: "/careers", label: "Careers" },
];

export default function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={`relative z-40 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 ${
        transparent ? "" : "border-b border-white/5"
      }`}
    >
      <Link to="/" className="block">
        <img src={logoImg} alt="StellR IT" className="h-14 md:h-16 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
      </Link>
      <nav className="hidden items-center gap-8 lg:flex">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="relative py-1 text-sm text-white/80 transition-colors hover:text-white group"
            activeProps={{ className: "text-white font-medium" }}
          >
            {n.label}
            <span className="absolute bottom-0 left-0 h-[2px] w-full scale-x-0 bg-gradient-to-r from-[#a855f7] via-[#ff8a5b] to-[#ff8a5b] transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link
          to="/contact"
          className="group relative hidden items-center gap-3 rounded-full bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all duration-500 overflow-hidden hover:border-[#ff8a5b]/40 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(190,80,255,0.25)] sm:inline-flex"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          <span className="relative z-10">Let's Talk</span>
          <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#7a2adc] to-[#ff8a5b] text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="glass grid h-12 w-12 place-items-center rounded-full text-white transition hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
