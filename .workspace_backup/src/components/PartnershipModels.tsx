import { useState } from "react";
import { Check, Zap, Award, Layers, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Magnetic from "./Magnetic";

const MODELS = [
  {
    id: "sprint",
    name: "Dedicated Sprint",
    tagline: "High-velocity product squads",
    icon: Zap,
    budget: "$12,500 / week",
    timeline: "2 - 6 weeks average",
    team: "1 Lead Designer, 2 Senior Engineers, 1 PM",
    description: "Get an elite product squad focused exclusively on your highest-priority goals. Zero overhead, rapid prototyping, and daily shipping.",
    features: [
      "100% exclusive focus on one product stream",
      "Daily asynchronous progress reports",
      "Interactive Figma prototyping in Week 1",
      "Production-ready, highly polished code",
      "Weekly live milestone demonstrations",
    ],
  },
  {
    id: "project",
    name: "Project Build",
    tagline: "End-to-end craft from scratch",
    icon: Award,
    budget: "From $45,000",
    timeline: "8 - 12 weeks average",
    team: "Full-stack squad tailored to target scope",
    description: "Best for brand-new platforms, product launches, or complete design transformations. We discover, map the strategy, design, and engineer.",
    features: [
      "In-depth market research & competitive audit",
      "Bespoke brand & component design system",
      "Custom development (Vite, Next, or TanStack)",
      "Vigorous QA, SEO indexing, and speed tuning",
      "30-day post-launch hypercare & handover",
    ],
  },
  {
    id: "retainer",
    name: "Monthly Retainer",
    tagline: "Continuous growth & optimization",
    icon: Layers,
    budget: "From $8,000 / month",
    timeline: "3 months minimum term",
    team: "Dedicated hours across design & engineering",
    description: "For scaling brands requiring ongoing campaign assets, marketing pages, conversion rate optimization (CRO), and continuous feature additions.",
    features: [
      "Guaranteed monthly creative & technical capacity",
      "Rapid-response SLA for priority tasks",
      "Monthly metrics reviews & growth roadmapping",
      "Structured conversion optimization & AB tests",
      "Ongoing security patches & library upgrades",
    ],
  },
];

export default function PartnershipModels() {
  const [activeTab, setActiveTab] = useState(MODELS[0].id);
  const activeModel = MODELS.find((m) => m.id === activeTab)!;
  const ActiveIcon = activeModel.icon;

  return (
    <section className="relative z-10 px-6 py-28 md:px-12 lg:px-20">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.5em] text-[#ff8a5b]">How we partner</span>
          <h2 className="mt-4 font-serif text-[44px] leading-[1.05] tracking-tight text-white md:text-[72px]">
            Transparent models, built for speed.
          </h2>
          <p className="mt-6 text-[16px] leading-[1.65] text-white/70 max-w-xl">
            We replace bloated agency retainers and junior account management with three transparent, execution-focused engagement structures.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="mt-14 flex flex-wrap gap-2 border-b border-white/10 pb-6">
          {MODELS.map((model) => {
            const Icon = model.icon;
            const isActive = model.id === activeTab;
            return (
              <button
                key={model.id}
                onClick={() => setActiveTab(model.id)}
                className={`relative flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold transition cursor-pointer ${
                  isActive ? "text-[#1a0033]" : "text-white/60 hover:text-white"
                }`}
              >
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-full bg-white"
                  />
                )}
                <Icon className={`relative z-10 h-4 w-4 ${isActive ? "text-[#a855f7]" : ""}`} />
                <span className="relative z-10">{model.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Card */}
        <div className="mt-8">
          
            <div
              key={activeTab}
              className="grid grid-cols-1 gap-12 border-t border-white/10 pt-12 md:grid-cols-[1.2fr_1fr] md:pt-16 lg:gap-20"
            >
              {/* Left Column: Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#a855f7]/10 text-[#c9a4ff]">
                      <ActiveIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl text-white">{activeModel.name}</h3>
                      <p className="text-xs text-white/50 tracking-wider uppercase mt-0.5">{activeModel.tagline}</p>
                    </div>
                  </div>

                  <p className="mt-8 text-base leading-relaxed text-white/80">
                    {activeModel.description}
                  </p>

                  {/* Meta Details List */}
                  <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/10 pt-8 sm:grid-cols-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#ff8a5b] font-semibold">EXPECTED INVESTMENT</div>
                      <div className="mt-2 font-serif text-2xl text-white">{activeModel.budget}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#ff8a5b] font-semibold">TYPICAL TIMELINE</div>
                      <div className="mt-2 font-serif text-2xl text-white">{activeModel.timeline}</div>
                    </div>
                    <div className="sm:col-span-2 border-t border-white/5 pt-4 mt-2">
                      <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">TEAM ALLOCATION</div>
                      <div className="mt-1.5 text-sm text-white/85">{activeModel.team}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <Magnetic>
                    <Link
                      to="/contact"
                      className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#1a0033] transition hover:bg-white/95"
                    >
                      Discuss this model
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c2dd9] text-white transition group-hover:scale-110">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </Magnetic>
                </div>
              </div>

              {/* Right Column: Features Checklist */}
              <div className="border-l border-white/10 pl-6 md:pl-10 self-start">
                <h4 className="font-serif text-xl text-white border-b border-white/10 pb-4">Key Deliverables</h4>
                <ul className="mt-6 space-y-5">
                  {activeModel.features.map((feature, i) => (
                    <li
                      key={feature}
                      className="flex items-start gap-4 text-sm text-white/80"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#c9a4ff]/10 text-[#c9a4ff] mt-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          
        </div>
      </div>
    </section>
  );
}
