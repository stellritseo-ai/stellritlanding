import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { Users2, ShieldCheck, Mail, MapPin, Plus } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/clients")({
  component: ClientsPage,
});

const CLIENTS = [
  {
    id: "c1",
    company: "Harmony Residential Care",
    sector: "Healthcare",
    contact: "Jiten Sony",
    location: "Lafayette, IN",
    status: "Active",
    projectsCount: 1,
  },
  {
    id: "c2",
    company: "TechNova Systems",
    sector: "Technology",
    contact: "David Chen",
    location: "San Jose, CA",
    status: "Active",
    projectsCount: 2,
  },
  {
    id: "c3",
    company: "Nexus Brands",
    sector: "E-Commerce",
    contact: "Sarah Jenkins",
    location: "Austin, TX",
    status: "Active",
    projectsCount: 1,
  },
  {
    id: "c4",
    company: "Rivera Designs",
    sector: "Real Estate",
    contact: "Alex Rivera",
    location: "Miami, FL",
    status: "Onboarding",
    projectsCount: 0,
  },
];

function ClientsPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Client List</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Overview of corporate accounts, contacts, and active contract scopes.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CLIENTS.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`rounded-2xl border p-6 transition group ${
              isDark
                ? "bg-[#12052c]/65 border-white/5 hover:border-white/10 text-white"
                : "bg-white border-slate-200/60 hover:border-slate-350 shadow-sm text-slate-800"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-[#a855f7] font-semibold uppercase tracking-wider block mb-1">
                  {client.sector}
                </span>
                <h3 className="text-base font-semibold group-hover:text-[#ff8a5b] transition duration-300">
                  {client.company}
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                client.status === "Active"
                  ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400"
                  : isDark
                  ? "bg-white/5 border-white/10 text-white/40"
                  : "bg-slate-100 border-slate-200 text-slate-500"
              }`}>
                {client.status}
              </span>
            </div>

            <div className={`mt-6 space-y-3 text-xs border-t pt-4 ${
              isDark ? "text-white/60 border-white/5" : "text-slate-550 border-slate-100"
            }`}>
              <div className="flex items-center gap-2">
                <Users2 className={`h-4 w-4 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                <span>Primary Contact: {client.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className={`h-4 w-4 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                <span>Location: {client.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className={`h-4 w-4 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                <span>Active Projects: {client.projectsCount}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
