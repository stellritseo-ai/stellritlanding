import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo.png";

const MENU_IMAGES: Record<string, string> = {
  "Case Studies": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop",
  "Agency": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format&fit=crop",
  "Services": "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&q=80&auto=format&fit=crop",
  "Insights": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80&auto=format&fit=crop",
  "Careers": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format&fit=crop",
  "Contact": "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&q=80&auto=format&fit=crop",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&q=80&auto=format&fit=crop";
const DEFAULT_VIDEO = "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/ISA_FLOR_04__444_enp2ps";


const NAV: { label: string; to: string; children?: { label: string; to: string }[] }[] = [
  { label: "Case Studies", to: "/case-studies" },
  { label: "Agency", to: "/about" },
  {
    label: "Services",
    to: "/services",
    children: [
      { label: "UX Research & Strategy", to: "/services" },
      { label: "Web & Product Design", to: "/services" },
      { label: "Brand Identity & Campaigns", to: "/services" },
      { label: "Web Development", to: "/services" },
      { label: "Digital Marketing & CRO", to: "/services" },
    ],
  },
  { label: "Insights", to: "/insights" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
  { label: "Pay Now", to: "https://buy.stripe.com/aEUg0X1pe7v52yI002" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

const backdrop: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  show: {
    opacity: 1,
    backdropFilter: "blur(24px)",
    transition: { duration: 0.5, ease: EASE },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.4, ease: EASE, delay: 0.3 },
  },
};

const panel: Variants = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.9, ease: EASE },
  },
  exit: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.7, ease: EASE, delay: 0.15 },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.35, staggerChildren: 0.07 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const lineWrap: Variants = {
  hidden: {},
  show: {},
  exit: {},
};

const lineItem: Variants = {
  hidden: { y: "110%", opacity: 0, filter: "blur(8px)" },
  show: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
  exit: {
    y: "110%",
    opacity: 0,
    filter: "blur(8px)",
    transition: { duration: 0.45, ease: EASE },
  },
};

const fadeUp: Variants = {
  hidden: { y: 30, opacity: 0, filter: "blur(6px)" },
  show: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
  exit: { y: 20, opacity: 0, filter: "blur(6px)", transition: { duration: 0.35, ease: EASE } },
};

import { createPortal } from "react-dom";

export default function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [time, setTime] = useState(new Date());
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [open]);

  const formatTime = (tz: string) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(time);
  };

  const activeImage = (hoveredItem && MENU_IMAGES[hoveredItem]) || DEFAULT_IMAGE;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          variants={backdrop}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ background: "rgba(12,4,40,0.55)" }}
        >
          {/* Panel with clip-path reveal */}
          <motion.div
            variants={panel}
            className="absolute inset-0 overflow-y-auto lg:overflow-hidden"
            style={{
              background:
                "radial-gradient(120% 80% at 80% 0%, rgba(120,40,200,0.35), transparent 60%), linear-gradient(180deg, #190640 0%, #0e0228 100%)",
            }}
          >
            {/* Ambient glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 1.2, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="pointer-events-none absolute -right-40 -top-40 h-[700px] w-[700px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            <motion.div variants={stagger} initial="hidden" animate="show" exit="exit">
              {/* Header */}
              <motion.header
                variants={fadeUp}
                className="relative flex items-center justify-between px-6 py-4 md:px-12 md:py-5"
              >
                <Link to="/" onClick={onClose} className="block">
                  <img src={logoImg} alt="StellR IT" className="h-14 md:h-16 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
                </Link>
                <div className="flex items-center gap-3">
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="group relative flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all duration-500 overflow-hidden hover:border-[#ff8a5b]/40 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(190,80,255,0.25)]"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    <span className="relative z-10">Let's Talk</span>
                    <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#7a2adc] to-[#ff8a5b] text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <motion.button
                    onClick={onClose}
                    aria-label="Close menu"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="grid h-12 w-12 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.button>
                </div>
              </motion.header>

              {/* Body */}
              <div className="relative grid grid-cols-1 gap-8 px-4 pb-8 sm:px-6 md:grid-cols-[1fr_300px] md:px-12 md:pb-10 lg:gap-16 lg:grid-cols-[1fr_320px]">
                {/* Left: nav */}
                <nav className="flex flex-col">
                  {NAV.map((item) => (
                    <motion.div
                      key={item.label}
                      variants={lineWrap}
                      className="border-b border-white/10 py-2.5 md:py-3.5"
                    >
                      <div className="overflow-hidden">
                        <motion.div variants={lineItem}>
                          <Link
                            to={item.to}
                            onClick={onClose}
                            onMouseEnter={() => setHoveredItem(item.label)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="group flex items-center justify-between font-serif text-3xl text-white sm:text-4xl md:text-5xl lg:text-6xl"
                            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                          >
                            <span className="bg-gradient-to-r from-white via-white to-[#c9a4ff] bg-[length:200%_100%] bg-left transition-all duration-500 group-hover:bg-right bg-clip-text text-transparent group-hover:text-transparent">
                              {item.label}
                            </span>
                            <ArrowUpRight className="h-8 w-8 text-white/30 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#c9a4ff] md:h-12 md:w-12" />
                          </Link>
                        </motion.div>
                      </div>
                      {item.children && (
                        <motion.div
                          variants={fadeUp}
                          className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
                        >
                          {item.children.map((c) => (
                            <Link
                              key={c.label}
                              to={c.to}
                              onClick={onClose}
                              onMouseEnter={() => setHoveredItem("Services")}
                              onMouseLeave={() => setHoveredItem(null)}
                              className="group flex items-center gap-2 text-xs md:text-sm text-white/70 transition-colors hover:text-white"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7] transition-colors group-hover:bg-[#ff8a5b]" />
                              <span className="transition-transform duration-300 group-hover:translate-x-1">
                                {c.label}
                              </span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </nav>

                {/* Right: meta */}
                <motion.aside variants={fadeUp} className="hidden md:flex flex-col gap-6 md:pt-2">
                  {/* Hover Image Block with Clocks */}
                  <div className="flex flex-col gap-3">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-white/5 border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                      <AnimatePresence mode="wait">
                        {!hoveredItem ? (
                          <motion.video
                            key="default-video"
                            src={DEFAULT_VIDEO}
                            autoPlay
                            loop
                            muted
                            playsInline
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <motion.img
                            key={activeImage}
                            src={activeImage}
                            alt={hoveredItem}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* 3 US Timezones Clocks */}
                    <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
                      <div>
                        <div className="text-[9px] font-semibold tracking-wider text-white/45 uppercase">PST (LA)</div>
                        <div className="mt-0.5 font-mono text-xs text-[#ff8a5b] font-medium">{formatTime("America/Los_Angeles")}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-semibold tracking-wider text-white/45 uppercase">CST (CHI)</div>
                        <div className="mt-0.5 font-mono text-xs text-[#c9a4ff] font-medium">{formatTime("America/Chicago")}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-semibold tracking-wider text-white/45 uppercase">EST (NY)</div>
                        <div className="mt-0.5 font-mono text-xs text-white font-medium">{formatTime("America/New_York")}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold tracking-[0.2em] text-[#ff8a5b] mb-4">
                      WORKING WORLDWIDE
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-white">USA</div>
                        <span className="block text-xs text-white/60 leading-normal">
                          5305 Creek CT<br />Garland, TX 75043
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
                    <Link
                      to="/contact"
                      onClick={onClose}
                      className="text-sm text-white underline underline-offset-4 hover:text-[#c9a4ff] font-medium"
                    >
                      Discuss a project →
                    </Link>
                    <a
                      href="tel:2148380543"
                      className="text-xs text-white/60 hover:text-[#ff8a5b] transition-colors"
                    >
                      Call: (214) 838-0543
                    </a>
                    <a
                      href="tel:3254808108"
                      className="text-xs text-white/60 hover:text-[#ff8a5b] transition-colors"
                    >
                      Toll Free: (325) 480-8108
                    </a>
                  </div>
                </motion.aside>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
