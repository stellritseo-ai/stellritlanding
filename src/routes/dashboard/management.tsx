import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState } from "react";
import { Globe, Plus, Link2, Monitor, Compass, ArrowUpRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/management")({
  component: WebsiteManagementPage,
});

interface SitePage {
  path: string;
  title: string;
  status: "Published" | "Draft";
  speedScore: number;
}

function WebsiteManagementPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  const [pages] = useState<SitePage[]>([
    { path: "/", title: "Homepage — StellR IT", status: "Published", speedScore: 98 },
    { path: "/about", title: "About Us — StellR IT", status: "Published", speedScore: 96 },
    { path: "/services", title: "Services — StellR IT", status: "Published", speedScore: 94 },
    { path: "/contact", title: "Contact — StellR IT", status: "Published", speedScore: 97 },
    { path: "/insights", title: "Insights — StellR IT", status: "Draft", speedScore: 0 },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Website Management</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Configure sitemaps, active routes, SEO optimization, and page speed index score records.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Add Page Route
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-2xl border p-6 transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5" : "bg-white border-slate-200/60 shadow-sm"
          }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Production URL
            </span>
            <Link2 className="h-4 w-4 text-[#a855f7]" />
          </div>
          <span className="text-xl font-bold tracking-tight">stellr.space</span>
          <span className="text-[10px] text-emerald-400 block mt-2 font-semibold">
            Status: DNS Propagated
          </span>
        </div>

        <div className={`rounded-2xl border p-6 transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5" : "bg-white border-slate-200/60 shadow-sm"
          }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Average SEO Rank
            </span>
            <Compass className="h-4 w-4 text-[#ff8a5b]" />
          </div>
          <span className="text-xl font-bold tracking-tight">#4 Sector Avg</span>
          <span className="text-[10px] text-[#ff8a5b] block mt-2 font-semibold">
            Keywords Tracked: 42
          </span>
        </div>

        <div className={`rounded-2xl border p-6 transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5" : "bg-white border-slate-200/60 shadow-sm"
          }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Core Web Vitals
            </span>
            <Monitor className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">96 / 100</span>
          <span className="text-[10px] text-emerald-400 block mt-2 font-semibold">
            Performance: Excellent
          </span>
        </div>
      </div>

      {/* Pages Table */}
      <div className={`rounded-2xl border p-6 transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 shadow-2xl" : "bg-white border-slate-200/60 shadow-sm"
        }`}>
        <div className="mb-6">
          <h3 className="text-base font-semibold">Site Page Directory</h3>
          <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-slate-400"}`}>
            Configure live directories, canonical metadata paths, and mobile speed states.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b uppercase font-semibold tracking-wider text-[10px] ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"
                }`}>
                <th className="pb-3 pr-4">Route Path</th>
                <th className="pb-3 px-4">Meta Title</th>
                <th className="pb-3 px-4">Indexing</th>
                <th className="pb-3 px-4 text-center">Mobile Speed</th>
                <th className="pb-3 pl-4 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-white/[0.04]" : "divide-slate-100"}`}>
              {pages.map((p) => (
                <tr key={p.path} className="hover:bg-black/[0.01] transition group">
                  <td className="py-4 pr-4 font-mono font-semibold text-[#a855f7]">
                    {p.path}
                  </td>
                  <td className="py-4 px-4 font-medium">
                    {p.title}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${p.status === "Published"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {p.speedScore > 0 ? (
                      <span className={`font-semibold ${p.speedScore >= 95 ? "text-emerald-500" : "text-amber-500"}`}>
                        {p.speedScore}
                      </span>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <button className={`h-8 w-8 inline-flex items-center justify-center rounded-lg transition ${isDark ? "hover:bg-white/10 text-white/50 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                      }`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
