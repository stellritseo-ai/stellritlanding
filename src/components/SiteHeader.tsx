import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu } from "lucide-react";
import MenuOverlay from "./MenuOverlay";

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
      <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-white">
        StellR<span className="text-[#c9a4ff]">.</span>
        <span className="ml-1 text-xs font-sans tracking-[0.3em] text-white/60">IT LLC</span>
      </Link>
      <nav className="hidden items-center gap-8 lg:flex">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="text-sm text-white/80 transition-colors hover:text-white"
            activeProps={{ className: "text-white" }}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link
          to="/contact"
          className="group glass hidden items-center gap-2 rounded-full bg-white/95 py-2 pl-5 pr-2 text-sm font-medium text-[#2a0860] transition hover:bg-white sm:flex"
        >
          Let's Talk
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c2dd9] text-white transition group-hover:scale-110">
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
