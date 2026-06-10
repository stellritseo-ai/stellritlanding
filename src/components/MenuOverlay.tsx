import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

const NAV = [
  { label: "Case Studies", href: "#case-studies" },
  { label: "Agency", href: "#agency" },
  {
    label: "Services",
    href: "#services",
    children: [
      "UX Research & Strategy",
      "Web & Product Design",
      "Brand Identity & Campaigns",
      "Web Development",
      "Digital Marketing & CRO",
    ],
  },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
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

export default function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          variants={backdrop}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[60] overflow-hidden"
          style={{ background: "rgba(12,4,40,0.55)" }}
        >
          {/* Panel with clip-path reveal */}
          <motion.div
            variants={panel}
            className="absolute inset-0 overflow-y-auto"
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
                className="relative flex items-center justify-between px-6 py-6 md:px-12 md:py-8"
              >
                <div className="font-serif text-2xl font-semibold tracking-tight text-white">
                  StellR<span className="text-[#c9a4ff]">.</span>
                  <span className="ml-1 text-xs font-sans tracking-[0.3em] text-white/60">IT LLC</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="group flex items-center gap-2 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-medium text-[#2a0860] transition hover:bg-white/90">
                    Let's Talk
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c2dd9] text-white transition group-hover:scale-110">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </button>
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
              <div className="relative grid gap-12 px-6 pb-16 md:grid-cols-[1fr_320px] md:px-12 md:pb-20">
                {/* Left: nav */}
                <nav className="flex flex-col">
                  {NAV.map((item) => (
                    <motion.div
                      key={item.label}
                      variants={lineWrap}
                      className="border-b border-white/10 py-6"
                    >
                      <div className="overflow-hidden">
                        <motion.a
                          variants={lineItem}
                          href={item.href}
                          onClick={onClose}
                          className="group block font-serif text-5xl text-white transition hover:text-[#c9a4ff] md:text-6xl lg:text-7xl"
                          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                        >
                          {item.label}
                        </motion.a>
                      </div>
                      {item.children && (
                        <motion.div
                          variants={fadeUp}
                          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                        >
                          {item.children.map((c) => (
                            <a
                              key={c}
                              href="#"
                              onClick={onClose}
                              className="flex items-center gap-2 text-sm text-white/90 transition hover:translate-x-1 hover:text-white"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7]" />
                              {c}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </nav>

                {/* Right: meta */}
                <motion.aside variants={fadeUp} className="flex flex-col gap-8 md:pt-32">
                  <div>
                    <div className="text-xs font-semibold tracking-[0.2em] text-[#ff8a5b]">
                      WORKING WORLDWIDE
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="text-xl text-white">Los Angeles</div>
                      <a href="#" className="block text-sm text-white/80 underline underline-offset-4">
                        1600 Rosecrans Avenue Manhattan Beach, CA 90266
                      </a>
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="text-xl text-white">New York</div>
                      <a href="#" className="block text-sm text-white/80 underline underline-offset-4">
                        125 W 25th Street New York, NY 10001
                      </a>
                    </div>
                  </div>

                  <a
                    href="#contact"
                    onClick={onClose}
                    className="text-lg text-white underline underline-offset-4 hover:text-[#c9a4ff]"
                  >
                    Discuss a project
                  </a>

                  <div>
                    <div className="text-xs font-semibold tracking-[0.2em] text-[#ff8a5b]">PHONE</div>
                    <a
                      href="tel:+13109169510"
                      className="mt-3 block text-lg text-white underline underline-offset-4"
                    >
                      (310) 916-9510
                    </a>
                  </div>
                </motion.aside>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
