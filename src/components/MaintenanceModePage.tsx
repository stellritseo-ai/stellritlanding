import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, RefreshCw, MessageCircle, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";

interface MaintenanceModePageProps {
  onRefresh: () => void;
}

export default function MaintenanceModePage({ onRefresh }: MaintenanceModePageProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const handleOpenChat = () => {
    const launcher = document.getElementById("chat-widget-launcher");
    if (launcher) {
      launcher.click();
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070213] text-white flex flex-col justify-between">
      <ScrollBackground />

      {/* Ambient Radial Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(168,85,247,0.3), rgba(255,138,91,0.1) 60%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[620px] w-[620px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(201,164,255,0.2), transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-6 md:px-12 lg:px-20 flex justify-between items-center max-w-[1440px] mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="font-serif text-2xl font-bold tracking-tight text-white">
            StellR<span className="text-[#ff8a5b]">.</span>
          </span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          System Maintenance
        </div>
      </header>

      {/* Hero content */}
      <section className="relative z-10 px-6 py-12 md:px-12 lg:px-20 flex-grow flex items-center">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.25em] text-white/60 backdrop-blur-sm">
              <Wrench className="h-3.5 w-3.5 text-[#ff8a5b]" />
              Status: Undergoing Upgrades
            </div>

            <h1 className="mt-8 font-serif text-[48px] font-normal leading-[1.05] tracking-tight text-white sm:text-[68px] md:text-[80px]">
              Evolving our
              <span className="block italic text-[#ff8a5b] font-light mt-1">digital space.</span>
            </h1>

            <p className="mt-8 max-w-xl text-[16px] leading-[1.6] text-white/70">
              We are currently upgrading our platforms to introduce enhanced speeds, security parameters, and new collaborative digital features. Our development team is fully active, and we'll be online shortly.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#070213] transition hover:scale-[1.02] hover:bg-slate-100 disabled:opacity-70 active:scale-[0.98]"
              >
                <RefreshCw className={`h-4 w-4 transition-transform duration-700 ${isRefreshing ? "animate-spin" : "group-hover:rotate-45"}`} />
                Check Status
              </button>
              <button
                onClick={handleOpenChat}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/[0.06] active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                Live Chat Support
              </button>
            </div>
          </motion.div>

          {/* Premium Glass Dashboard Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-[#ff8a5b]/10 to-transparent rounded-full filter blur-xl opacity-50" />
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-gradient-to-tr from-[#a855f7]/10 to-transparent rounded-full filter blur-xl opacity-50" />

            <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2 text-white/90">
              System Control Diagnostics
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <Clock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Maintenance Window</h4>
                  <p className="text-sm mt-1 text-white/90">Active (Scheduled updates in progress)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">IT Services Status</h4>
                  <p className="text-sm mt-1 text-white/90">StellR backend APIs & DNS records online</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <MessageCircle className="h-5 w-5 text-[#ff8a5b] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Customer Support</h4>
                  <p className="text-sm mt-1 text-white/90">Live operators online & responding</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
              <span>Host ID: Stellrit.com</span>
              <span className="font-mono">v3.4.1</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-6 md:px-12 lg:px-20 border-t border-white/5 max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
        <div>
          &copy; {new Date().getFullYear()} StellR IT LLC. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="mailto:info@stellrit.com" className="hover:text-white transition">info@stellrit.com</a>
          <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
        </div>
      </footer>

      {/* Include the Chat Widget so they can chat */}
      <ChatWidget />
    </main>
  );
}
