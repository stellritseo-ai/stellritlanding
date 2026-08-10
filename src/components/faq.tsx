import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Sparkles, ArrowRight, HelpCircle } from "lucide-react";

export const homeFAQs = [
  {
    q: "What is StellR IT LLC?",
    a: "StellR IT LLC is a global AI development and custom software engineering company based in Garland, Texas. We specialize in AI software development, generative AI, chatbots, voice agents, business automation, SaaS platforms, web and mobile applications, and providing dedicated remote engineering teams for businesses worldwide.",
  },
  {
    q: "What AI services does StellR IT LLC offer?",
    a: "StellR IT LLC offers comprehensive AI services including: custom AI software development, generative AI applications, AI chatbot development, AI voice agent development, LLM integration (OpenAI, Claude, Gemini), RAG (Retrieval-Augmented Generation) systems, vector database development, AI workflow automation, AI CRM automation, AI customer support systems, computer vision, predictive analytics, and AI consulting.",
  },
  {
    q: "Does StellR IT provide dedicated development teams?",
    a: "Yes. StellR IT LLC provides fully managed dedicated remote engineering teams including AI engineers, full-stack developers, React developers, Next.js developers, Flutter developers, mobile developers, UI/UX designers, QA engineers, DevOps engineers, and project managers. We serve digital agencies, startups, SMBs, and enterprises worldwide.",
  },
  {
    q: "Which industries does StellR IT LLC serve?",
    a: "StellR IT serves a wide range of industries including healthcare, dental clinics, legal, finance, real estate, education, construction, retail, eCommerce, restaurants, hospitality, transportation, logistics, nonprofits, government, manufacturing, automotive, and technology startups and enterprises.",
  },
  {
    q: "Where is StellR IT LLC located and do they work globally?",
    a: "StellR IT LLC is headquartered in Garland, Texas, USA. We operate fully remotely and serve clients worldwide across the United States, Canada, United Kingdom, Australia, Europe, the Middle East (UAE, Saudi Arabia), and Asia (Singapore, India, Nepal, Malaysia, Indonesia).",
  },
  {
    q: "How do I hire dedicated AI developers from StellR IT?",
    a: "You can hire dedicated AI developers and engineers from StellR IT by contacting us at info@stellrit.com or calling (214) 838-0543. We offer flexible engagement models including full-time dedicated teams, part-time resources, and project-based collaborations. Projects typically start within 48-72 hours.",
  },
  {
    q: "Does StellR IT build SaaS products?",
    a: "Yes. StellR IT LLC has extensive experience building custom SaaS platforms from MVP to enterprise scale. We handle full product development including architecture design, backend/frontend development, API development, cloud deployment, DevOps, and ongoing maintenance.",
  },
  {
    q: "What makes StellR IT different from other software development companies?",
    a: "StellR IT LLC combines deep AI expertise with full-stack software engineering — offering both AI development and traditional software under one roof. We provide dedicated teams with senior engineers, transparent communication, and a track record of delivering complex projects across diverse industries worldwide.",
  },
];

export default function HomeFAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      aria-label="Frequently Asked Questions about StellR IT LLC"
      className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 py-[50px]"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(255,138,91,0.3) 50%, transparent 70%)",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Sticky Title & Support Card */}
        <div className="lg:col-span-5 relative z-20 self-start">
          <div className="sticky top-[100px] space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#ff8a5b] text-xs font-bold uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" /> GOT QUESTIONS?
              </div>
              <h2 className="font-serif text-[32px] sm:text-[42px] lg:text-[50px] font-bold text-white leading-[1.1] tracking-tight">
                Frequently Asked <span className="italic bg-gradient-to-r from-[#d9b8ff] via-[#cc7aff] to-[#ff9f7a] bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="mt-4 text-base text-white/70 leading-relaxed max-w-md font-sans">
                Everything you need to know about StellR IT LLC, our custom AI development services, team scaling models, and implementation processes.
              </p>
            </div>

            {/* Support CTA Card */}
            <div className="rounded-2xl p-6 md:p-8 border border-white/10 bg-gradient-to-br from-[#1f0538]/80 to-[#120022]/90 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#a855f7]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#ff8a5b] flex items-center justify-center text-white shadow-lg">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">Have a specific project in mind?</h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                  Can’t find the answer you’re looking for? Talk directly with our senior AI software architects.
                </p>
                <div className="pt-2">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white text-[#180028] hover:bg-[#ff8a5b] hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105"
                  >
                    Contact Engineering Team <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Interactive Accordions */}
        <div className="lg:col-span-7 space-y-4">
          {homeFAQs.map((faq, i) => {
            const isOpen = open === i;
            const indexFormatted = String(i + 1).padStart(2, "0");

            return (
              <motion.div
                key={i}
                initial={false}
                className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                  ? "bg-[#1f0538]/80 border-[#a855f7]/50 shadow-[0_10px_30px_rgba(168,85,247,0.15)]"
                  : "bg-[#180028]/40 border-white/10 hover:border-white/20 hover:bg-[#180028]/60"
                  }`}
              >
                {/* Active Left Gradient Indicator */}
                {isOpen && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#a855f7] to-[#ff8a5b]" />
                )}

                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-6 text-left focus:outline-none group cursor-pointer"
                  id={`faq-btn-${i}`}
                  aria-controls={`faq-panel-${i}`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <span className={`text-xs font-mono font-bold tracking-widest transition-colors ${isOpen ? "text-[#ff8a5b]" : "text-white/30 group-hover:text-white/60"
                      }`}>
                      {indexFormatted}
                    </span>
                    <span className={`font-serif text-lg md:text-xl font-bold transition-colors ${isOpen ? "text-white" : "text-white/85 group-hover:text-white"
                      }`}>
                      {faq.q}
                    </span>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? "bg-[#a855f7] text-white rotate-180 shadow-md" : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"
                    }`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 md:px-8 pb-6 pt-2 pl-12 md:pl-16 border-t border-white/5">
                        <p className="text-sm md:text-base text-white/75 leading-[1.75] font-sans font-light">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
