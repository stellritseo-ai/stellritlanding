import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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

export default function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] overflow-y-auto"
          style={{ background: "#1a0a3a" }}
        >
          {/* Header row with logo, Let's Talk, close */}
          <header className="flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
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
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-12 w-12 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          {/* Body */}
          <div className="grid gap-12 px-6 pb-16 md:grid-cols-[1fr_320px] md:px-12 md:pb-20">
            {/* Left: nav */}
            <nav className="flex flex-col">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-white/10 py-6"
                >
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="group block font-serif text-5xl text-white transition hover:text-[#c9a4ff] md:text-6xl lg:text-7xl"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    {item.label}
                  </a>
                  {item.children && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {item.children.map((c) => (
                        <a
                          key={c}
                          href="#"
                          onClick={onClose}
                          className="flex items-center gap-2 text-sm text-white/90 transition hover:text-white"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7]" />
                          {c}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Right: meta */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex flex-col gap-8 md:pt-32"
            >
              <div>
                <div className="text-xs font-semibold tracking-[0.2em] text-[#ff8a5b]">WORKING WORLDWIDE</div>
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

              <a href="#contact" onClick={onClose} className="text-lg text-white underline underline-offset-4 hover:text-[#c9a4ff]">
                Discuss a project
              </a>

              <div>
                <div className="text-xs font-semibold tracking-[0.2em] text-[#ff8a5b]">PHONE</div>
                <a href="tel:+13109169510" className="mt-3 block text-lg text-white underline underline-offset-4">
                  (310) 916-9510
                </a>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
