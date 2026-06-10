import { useState } from "react";
import { Check, Zap, Award, Layers, ArrowUpRight, Clock, ShieldCheck, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

const MODELS = [
  {
    id: "sprint",
    name: "Dedicated Sprint",
    tagline: "High-velocity product squads",
    icon: Zap,
    budget: "$12,500",
    budgetPeriod: "/ week",
    timeline: "2 - 6 weeks",
    timelineDetail: "average duration",
    team: "1 Lead Designer, 2 Senior Engineers, 1 PM",
    description: "Get an elite product squad focused exclusively on your highest-priority goals. Zero overhead, rapid prototyping, and daily shipping.",
    features: [
      "100% exclusive focus on one product stream",
      "Daily asynchronous progress reports",
      "Interactive Figma prototyping in Week 1",
      "Production-ready, highly polished code",
      "Weekly live milestone demonstrations",
    ],
    accentColor: "#a855f7",
    accentGlow: "rgba(168, 85, 247, 0.15)",
    badgeText: "text-[#d8b4fe]",
    badgeBg: "bg-[#a855f7]/10 border-[#a855f7]/20",
  },
  {
    id: "project",
    name: "Project Build",
    tagline: "End-to-end craft from scratch",
    icon: Award,
    budget: "$45,000",
    budgetPeriod: "starting from",
    timeline: "8 - 12 weeks",
    timelineDetail: "average duration",
    team: "Full-stack squad tailored to target scope",
    description: "Best for brand-new platforms, product launches, or complete design transformations. We discover, map the strategy, design, and engineer.",
    features: [
      "In-depth market research & competitive audit",
      "Bespoke brand & component design system",
      "Custom development (Vite, Next, or TanStack)",
      "Vigorous QA, SEO indexing, and speed tuning",
      "30-day post-launch hypercare & handover",
    ],
    accentColor: "#ff8a5b",
    accentGlow: "rgba(255, 138, 91, 0.12)",
    badgeText: "text-[#ffb088]",
    badgeBg: "bg-[#ff8a5b]/10 border-[#ff8a5b]/20",
  },
  {
    id: "retainer",
    name: "Monthly Retainer",
    tagline: "Continuous growth & optimization",
    icon: Layers,
    budget: "$8,000",
    budgetPeriod: "/ month minimum",
    timeline: "3 Months",
    timelineDetail: "minimum term",
    team: "Dedicated hours across design & engineering",
    description: "For scaling brands requiring ongoing campaign assets, marketing pages, conversion rate optimization (CRO), and continuous feature additions.",
    features: [
      "Guaranteed monthly creative & technical capacity",
      "Rapid-response SLA for priority tasks",
      "Monthly metrics reviews & growth roadmapping",
      "Structured conversion optimization & AB tests",
      "Ongoing security patches & library upgrades",
    ],
    accentColor: "#38bdf8",
    accentGlow: "rgba(56, 189, 248, 0.12)",
    badgeText: "text-[#93c5fd]",
    badgeBg: "bg-[#38bdf8]/10 border-[#38bdf8]/20",
  },
];

export default function PartnershipModels() {
  const [activeTab, setActiveTab] = useState(MODELS[0].id);
  const activeModel = MODELS.find((m) => m.id === activeTab)!;
  const ActiveIcon = activeModel.icon;

  return (
    <section className="relative z-10 px-4 py-12 sm:px-6 md:px-12 lg:px-20 md:py-[70px] overflow-hidden">
      {/* Background dynamic radial glow linked to the active tab */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full transition-all duration-1000 ease-in-out opacity-70"
        style={{
          background: `radial-gradient(circle, ${activeModel.accentGlow}, transparent 65%)`,
          filter: "blur(80px)",
        }}
      />

      <div className="mx-auto max-w-[1400px]">
        {/* Header Section */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.5em] text-[#ff8a5b] font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a5b]" />
            How we partner
          </span>
          <h2 className="font-serif text-[28px] leading-[1.08] tracking-tight text-white sm:text-[36px] md:text-[46px] lg:text-[58px]">
            Transparent models,
            <span className="text-white/40 italic font-normal">built for velocity.</span>
          </h2>
          <p className="mt-6 text-[15px] md:text-[17px] leading-[1.65] text-white/55 max-w-xl">
            We replace bloated agency retainers and junior account management with three transparent, execution-focused engagement structures.
          </p>
        </div>

        {/* Apple-style Dock Tab Selector */}
          <div className="mt-10 flex justify-start overflow-x-auto pb-2">
            <div className="p-1.5 bg-[#171127]/60 border border-white/[0.04] backdrop-blur-xl rounded-full flex gap-1 mt-[-40px] flex-shrink-0">
            {MODELS.map((model) => {
              const Icon = model.icon;
              const isActive = model.id === activeTab;
              return (
                <button
                  key={model.id}
                  onClick={() => setActiveTab(model.id)}
                  className={`relative flex items-center gap-2.5 rounded-full px-6 py-3 text-[13px] md:text-sm font-medium transition-colors duration-300 cursor-pointer ${isActive ? "text-white" : "text-white/45 hover:text-white/80"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeModelPill"
                      className="absolute inset-0 rounded-full bg-white/[0.07] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    className="relative z-10 h-4 w-4 transition-colors duration-300"
                    style={{ color: isActive ? activeModel.accentColor : "currentColor" }}
                  />
                  <span className="relative z-10">{model.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Details Card & Layout */}
        <div className="mt-10 min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 gap-12 border-t border-white/[0.08] pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16 lg:gap-24"
            >
              {/* Left Column: Details & Metric Dashboard */}
              <div className="flex flex-col justify-between">
                <div>
                  {/* Title and Tagline */}
                  <div className="flex items-center gap-5">
                    <div
                      className="grid h-14 w-14 place-items-center rounded-2xl border transition-all duration-300"
                      style={{
                        background: `${activeModel.accentColor}12`,
                        borderColor: `${activeModel.accentColor}25`
                      }}
                    >
                      <ActiveIcon
                        className="h-6 w-6"
                        style={{ color: activeModel.accentColor }}
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl md:text-4xl text-white tracking-tight">{activeModel.name}</h3>
                      <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full border text-[10px] tracking-wider uppercase font-semibold ${activeModel.badgeBg} ${activeModel.badgeText}`}>
                        {activeModel.tagline}
                      </span>
                    </div>
                  </div>

                  {/* Model Description */}
                  <p className="mt-8 text-[15px] md:text-base leading-relaxed text-white/75 max-w-2xl">
                    {activeModel.description}
                  </p>

                  {/* Dashboard Metrics Cards */}
                  <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Budget Card */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm relative overflow-hidden group hover:border-white/[0.1] transition-all duration-300">
                      <div
                        className="absolute top-0 left-0 h-1 w-full opacity-60 transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100"
                        style={{ background: activeModel.accentColor }}
                      />
                      <span className="text-[10px] uppercase tracking-widest text-[#ff8a5b] font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="h-3 w-3" /> EXPECTED INVESTMENT
                      </span>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="font-serif text-3xl md:text-4xl text-white font-medium tracking-tight">
                          {activeModel.budget}
                        </span>
                        <span className="text-xs text-white/45 font-medium">
                          {activeModel.budgetPeriod}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Card */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm relative overflow-hidden group hover:border-white/[0.1] transition-all duration-300">
                      <div
                        className="absolute top-0 left-0 h-1 w-full opacity-60 transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100"
                        style={{ background: activeModel.accentColor }}
                      />
                      <span className="text-[10px] uppercase tracking-widest text-[#ff8a5b] font-semibold flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> TYPICAL TIMELINE
                      </span>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="font-serif text-3xl md:text-4xl text-white font-medium tracking-tight">
                          {activeModel.timeline}
                        </span>
                        <span className="text-xs text-white/45 font-medium">
                          {activeModel.timelineDetail}
                        </span>
                      </div>
                    </div>

                    {/* Team Allocation Card */}
                    <div className="sm:col-span-2 p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04] backdrop-blur-sm flex items-start gap-4">
                      <div className="p-2 rounded-xl bg-white/[0.03] text-white/50 mt-0.5">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-white/40 font-semibold">
                          TEAM ALLOCATION
                        </span>
                        <p className="mt-1.5 text-sm md:text-[15px] text-white/85 font-medium leading-relaxed">
                          {activeModel.team}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discuss CTA Action Button */}
                <div className="mt-12 lg:mt-16">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-3.5 rounded-full border border-white/10 bg-white/5 px-9 py-4.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_35px_rgba(255,255,255,0.06)]"
                  >
                    Discuss this model
                    <span
                      className="grid h-8 w-8 place-items-center rounded-full text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-45"
                      style={{ background: `linear-gradient(135deg, ${activeModel.accentColor}, #7c2dd9)` }}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Premium Deliverables Card */}
              <div className="relative self-start rounded-3xl p-px overflow-hidden bg-gradient-to-b from-white/[0.08] to-transparent">
                <div className="rounded-[23px] bg-[#0c061d]/90 border border-white/[0.02] backdrop-blur-xl p-8 md:p-10">
                  <h4 className="font-serif text-xl md:text-2xl text-white tracking-tight pb-5 border-b border-white/[0.08]">
                    Key Deliverables
                  </h4>
                  <ul className="mt-8 space-y-6">
                    {activeModel.features.map((feature, idx) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.06 }}
                        className="flex items-start gap-4 text-sm md:text-[15px] text-white/70 leading-relaxed"
                      >
                        <span
                          className="grid h-5.5 w-5.5 shrink-0 place-items-center rounded-full border text-white mt-0.5 transition-all duration-300"
                          style={{
                            background: `${activeModel.accentColor}15`,
                            borderColor: `${activeModel.accentColor}30`
                          }}
                        >
                          <Check className="h-3 w-3" style={{ color: activeModel.accentColor }} />
                        </span>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
