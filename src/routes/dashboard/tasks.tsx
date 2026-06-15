import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState } from "react";
import { ListTodo, CheckSquare, Square, Plus, AlertCircle, PlayCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/dashboard/tasks")({
  component: TasksPage,
});

interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  assignee: string;
}

function TasksPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "Audit security logs for task-793 gate keys",
      priority: "High",
      status: "In Progress",
      assignee: "Jiten Sony",
    },
    {
      id: "t2",
      title: "Deploy Brotli compression rules on edge gateways",
      priority: "High",
      status: "Pending",
      assignee: "David Chen",
    },
    {
      id: "t3",
      title: "Refresh UX wireframes for client preview portals",
      priority: "Medium",
      status: "Completed",
      assignee: "Sarah Jenkins",
    },
    {
      id: "t4",
      title: "Optimize SVG asset layouts inside case studies",
      priority: "Low",
      status: "Pending",
      assignee: "Alex Rivera",
    },
  ]);

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const statusOrder: Task["status"][] = ["Pending", "In Progress", "Completed"];
          const nextIndex = (statusOrder.indexOf(t.status) + 1) % statusOrder.length;
          return { ...t, status: statusOrder[nextIndex] };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">StellR Tasks</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Delegate operation lists and execute security runs.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className={`rounded-2xl border p-6 space-y-4 transition duration-300 ${
        isDark
          ? "bg-[#12052c]/65 border-white/5 shadow-2xl text-white"
          : "bg-white border-slate-200/60 shadow-sm text-slate-800"
      }`}>
        <AnimatePresence initial={false}>
          {tasks.map((task) => {
            const isCompleted = task.status === "Completed";
            const isInProgress = task.status === "In Progress";
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition group ${
                  isDark
                    ? "bg-white/[0.02] border-white/5 hover:bg-white/5 text-white"
                    : "bg-slate-50 border-slate-100 hover:bg-slate-100/70 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`h-5 w-5 shrink-0 hover:scale-105 transition ${
                      isDark ? "text-white/60 hover:text-white" : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : isInProgress ? (
                      <PlayCircle className="h-5 w-5 text-[#a855f7] animate-pulse" />
                    ) : (
                      <Square className={`h-5 w-5 ${isDark ? "text-white/20" : "text-slate-350"}`} />
                    )}
                  </button>
                  <span
                    className={`text-sm font-medium transition duration-300 ${
                      isCompleted
                        ? "line-through text-slate-400"
                        : isDark
                        ? "text-white/85"
                        : "text-slate-700"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Priority */}
                  <span
                    className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider border ${
                      task.priority === "High"
                        ? "bg-red-500/15 border-red-500/20 text-red-400"
                        : task.priority === "Medium"
                        ? "bg-amber-500/15 border-amber-500/20 text-amber-400"
                        : "bg-blue-500/15 border-blue-500/20 text-blue-400"
                    }`}
                  >
                    {task.priority}
                  </span>

                  {/* Assignee */}
                  <span className={`text-[10px] font-mono hidden sm:inline-block ${
                    isDark ? "text-white/40" : "text-slate-400"
                  }`}>
                    {task.assignee}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
