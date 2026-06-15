import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { FolderKanban, Plus, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
});

const PROJECTS = [
  {
    id: "p1",
    name: "Harmony Care Portal",
    client: "Harmony Care LLC",
    status: "Development",
    progress: 68,
    dueDate: "2026-07-15",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "p2",
    name: "Nexus SaaS Dashboard",
    client: "Nexus Group",
    status: "Design & UX",
    progress: 92,
    dueDate: "2026-06-30",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "p3",
    name: "TechNova Mobile App",
    client: "TechNova Corp",
    status: "QA & Testing",
    progress: 45,
    dueDate: "2026-08-10",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "p4",
    name: "StellR Web Redesign",
    client: "Internal Product",
    status: "Planning",
    progress: 15,
    dueDate: "2026-09-01",
    color: "from-emerald-500 to-teal-500",
  },
];

function ProjectsPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Project Management</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Track design sprints, deployment pipelines, and active deliverables.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Create Project
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((proj, i) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`rounded-2xl border p-6 transition group relative ${
              isDark
                ? "bg-[#12052c]/65 border-white/5 hover:border-white/10 text-white"
                : "bg-white border-slate-200/60 hover:border-slate-300 shadow-sm text-slate-800"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className={`text-[10px] font-mono tracking-widest uppercase block ${
                  isDark ? "text-white/40" : "text-slate-400"
                }`}>
                  {proj.client}
                </span>
                <h3 className="text-base font-semibold group-hover:text-[#a855f7] transition duration-300">
                  {proj.name}
                </h3>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                isDark
                  ? "bg-white/5 border-white/10 text-white/60"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              }`}>
                {proj.status}
              </span>
            </div>

            {/* Progress */}
            <div className="mt-6 space-y-2">
              <div className={`flex items-center justify-between text-xs ${
                isDark ? "text-white/50" : "text-slate-500"
              }`}>
                <span>Progress</span>
                <span className="font-mono font-semibold">{proj.progress}%</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                isDark ? "bg-white/5" : "bg-slate-100"
              }`}>
                <div
                  className={`h-full bg-gradient-to-r ${proj.color} rounded-full`}
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs ${
              isDark ? "border-white/5 text-white/45" : "border-slate-100 text-slate-450"
            }`}>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#ff8a5b]" />
                Due: {proj.dueDate}
              </span>
              <button className={`inline-flex items-center gap-1 transition group/btn ${
                isDark ? "hover:text-white text-white/60" : "hover:text-slate-900 text-slate-650"
              }`}>
                Workspace
                <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
