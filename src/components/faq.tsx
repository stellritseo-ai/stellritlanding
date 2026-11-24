import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Sparkles, ArrowRight, HelpCircle } from "lucide-react";

export const homeFAQs = [
  {
    q: "What is StellR IT LLC and what does an AI development company do?",
    a: "StellR IT LLC is a US-based AI development and custom software engineering company headquartered in Garland, Texas. An AI development company designs, integrates, and maintains custom software powered by machine learning and large language models—including generative AI applications, Retrieval-Augmented Generation (RAG) chatbots, autonomous AI agents, workflow automation, and full-stack SaaS, web, and mobile platforms.",
  },
  {
    q: "How much does custom AI development or an AI chatbot cost?",
    a: "Investment depends on integration depth and compliance scope. Focused RAG chatbots and single-workflow AI prototypes typically range from $8,000 to $25,000, while production enterprise AI platforms, multi-agent automation networks, and deep CRM/ERP integrations generally range from $35,000 to $100,000+. We scope every project transparently before engineering starts.",
  },
  {
    q: "What is Retrieval-Augmented Generation (RAG) and why does it matter for businesses?",
    a: "Retrieval-Augmented Generation (RAG) connects a large language model to your private, live company documents and databases at query time. Instead of relying on generic public training data, the AI retrieves verified passages from your encrypted vector database to produce grounded, accurate answers with minimal hallucination and zero exposure to public model training.",
  },
  {
    q: "How do autonomous AI agents differ from traditional chatbots?",
    a: "Traditional chatbots follow rigid decision trees or only answer static questions. Autonomous AI agents understand unstructured intent, plan multi-step workflows, invoke approved APIs (such as querying a database, routing a support ticket, or updating a CRM), verify results against guardrails, and escalate complex edge cases to human specialists.",
  },
  {
    q: "What is the difference between custom software development and off-the-shelf SaaS?",
    a: "Off-the-shelf SaaS tools are standardized subscriptions ideal for commodity tasks like payroll or email, but they impose recurring per-seat fees and rigid workflows. Custom software is engineered specifically for your unique operational processes, integrates cleanly with legacy databases, and gives your business 100% intellectual property ownership.",
  },
  {
    q: "How long does custom software or SaaS development take?",
    a: "Focused web applications and AI MVPs typically launch in 4 to 8 weeks. Multi-tenant SaaS products, mobile apps, and complex enterprise software platforms with third-party API integrations generally take 8 to 16 weeks using transparent two-week agile sprints.",
  },
  {
    q: "How do I hire dedicated AI developers or a remote engineering team from StellR IT?",
    a: "Contact StellR IT LLC via our contact page, email info@stellrit.com, or call (214) 838-0543. We align on your stack, seniority needs, and US timezone overlap, present vetted senior AI and full-stack engineers for your technical interviews, and integrate approved engineers directly into your Slack, Jira, and GitHub workflows.",
  },
  {
    q: "Where is StellR IT LLC located and which regions do you serve?",
    a: "StellR IT LLC is headquartered at 5305 Creek CT, Garland, Texas 75043, USA (Dallas-Fort Worth metroplex). We partner with clients across Dallas, Texas, and throughout the United States, as well as international organizations in Canada, the United Kingdom, Australia, and Europe.",
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
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(255,138,91,0.3) 50%, transparent 70%)",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
        {/* Left Column: Sticky Title & Support Card */}
        <div className="lg:col-span-5 relative z-20 h-full">
          <div className="sticky top-[100px] lg:top-[120px] space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#ff8a5b] text-xs font-bold uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" /> GOT QUESTIONS?
              </div>
              <h2 className="font-serif text-[32px] sm:text-[42px] lg:text-[50px] font-bold text-white leading-[1.1] tracking-tight">
                Frequently Asked{" "}
                <span className="italic bg-gradient-to-r from-[#d9b8ff] via-[#cc7aff] to-[#ff9f7a] bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="mt-4 text-base text-white/70 leading-relaxed max-w-md font-sans">
                Direct answers about StellR IT LLC, custom AI development, RAG architectures, software
                timelines, and hiring dedicated engineering teams.
              </p>
            </div>

            {/* Support CTA Card */}
            <div className="rounded-2xl p-6 md:p-8 border border-white/10 bg-gradient-to-br from-[#1f0538]/80 to-[#120022]/90 backdrop-blur-md relative overflow-hidden group shadow-2xl">
              <div
                className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full group-hover:scale-150 transition-transform duration-500"
                style={{
                  background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#ff8a5b] flex items-center justify-center text-white shadow-lg">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Have a specific project in mind?
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                  Can’t find the answer you’re looking for? Talk directly with our senior AI software
                  architects.
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

        {/* Right Column: Crawlable Accordions (CSS grid-rows collapse keeps all answers in SSR HTML) */}
        <div className="lg:col-span-7 space-y-4">
          {homeFAQs.map((faq, i) => {
            const isOpen = open === i;
            const indexFormatted = String(i + 1).padStart(2, "0");

            return (
              <div
                key={i}
                className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#1f0538]/80 border-[#a855f7]/50 shadow-[0_10px_30px_rgba(168,85,247,0.15)]"
                    : "bg-[#180028]/40 border-white/10 hover:border-white/20 hover:bg-[#180028]/60"
                }`}
              >
                {isOpen && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#a855f7] to-[#ff8a5b]" />
                )}

                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-6 text-left focus:outline-none group cursor-pointer"
                  id={`faq-btn-${i}`}
                  aria-controls={`faq-panel-${i}`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <span
                      className={`text-xs font-mono font-bold tracking-widest transition-colors ${
                        isOpen ? "text-[#ff8a5b]" : "text-white/30 group-hover:text-white/60"
                      }`}
                    >
                      {indexFormatted}
                    </span>
                    <span
                      className={`font-serif text-lg md:text-xl font-bold transition-colors ${
                        isOpen ? "text-white" : "text-white/85 group-hover:text-white"
                      }`}
                    >
                      {faq.q}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-[#a855f7] text-white rotate-180 shadow-md"
                        : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 md:px-8 pb-6 pt-2 pl-12 md:pl-16 border-t border-white/5">
                      <p className="text-sm md:text-base text-white/75 leading-[1.75] font-sans font-light">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
