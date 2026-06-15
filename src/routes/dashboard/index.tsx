import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  Activity,
  Users,
  Clock,
  Sparkles,
  RefreshCw,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

const TRAFFIC_DATA = [
  { day: "Mon", traffic: 2400, conversions: 120 },
  { day: "Tue", traffic: 3100, conversions: 180 },
  { day: "Wed", traffic: 2800, conversions: 160 },
  { day: "Thu", traffic: 4500, conversions: 310 },
  { day: "Fri", traffic: 3900, conversions: 240 },
  { day: "Sat", traffic: 5100, conversions: 380 },
  { day: "Sun", traffic: 6200, conversions: 490 },
];

function DashboardIndex() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const metrics = [
    {
      title: "Core Optimization",
      value: "98.4%",
      change: "+1.2% speed index",
      color: "from-emerald-400 to-teal-500",
      icon: Sparkles,
    },
    {
      title: "Active Users",
      value: "14.2k",
      change: "+12% vs last week",
      color: "from-[#a855f7] to-[#cc7aff]",
      icon: Users,
    },
    {
      title: "Avg Server Latency",
      value: "89ms",
      change: "Stable edge routing",
      color: "from-[#ff8a5b] to-amber-500",
      icon: Clock,
    },
    {
      title: "Form Conversions",
      value: "3.24%",
      change: "+0.45% conversion score",
      color: "from-blue-400 to-indigo-500",
      icon: TrendingUp,
    },
  ];

  const activities = [
    {
      time: "24m ago",
      module: "Security",
      desc: "Completed global port scan; all edge gates secure.",
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      time: "2h ago",
      module: "Vite Bundler",
      desc: "Hot module reload finalized for production server.",
      icon: Terminal,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      time: "5h ago",
      module: "Analytics",
      desc: "Conversion spikes detected from North America region.",
      icon: TrendingUp,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      time: "1d ago",
      module: "System Core",
      desc: "Allocated memory pool optimization successfully applied.",
      icon: Cpu,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Analytics Hub
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-550"}`}>
            Realtime performance metrics, user actions, and system diagnostics.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerRefresh}
            disabled={refreshing}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-semibold tracking-wide transition duration-300 ${
              isDark
                ? "border-white/10 bg-white/5 hover:bg-white/10 text-white"
                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            }`}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Stats"}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-2xl border p-6 transition duration-300 group ${
              isDark ? "bg-[#12052c]/60 border-white/5" : "bg-white border-slate-200/60 shadow-sm"
            }`}
          >
            {/* Ambient Card Glow */}
            {isDark && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
            )}

            <div className="flex justify-between items-start">
              <div>
                <span className={`text-xs font-medium tracking-wide ${isDark ? "text-white/50" : "text-slate-400"}`}>
                  {metric.title}
                </span>
                <span className={`block text-2xl font-bold mt-2 ${
                  isDark ? "bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent" : "text-slate-800"
                }`}>
                  {metric.value}
                </span>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} text-white shadow-lg shadow-black/20`}
              >
                <metric.icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/40">
              <span className="font-semibold text-emerald-400">
                {metric.change.split(" ")[0]}
              </span>
              <span className={isDark ? "text-white/40" : "text-slate-400"}>
                {metric.change.split(" ").slice(1).join(" ")}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Container */}
        <div className={`lg:col-span-2 rounded-2xl border p-6 flex flex-col justify-between transition duration-300 ${
          isDark ? "bg-[#12052c]/65 border-white/5 shadow-2xl" : "bg-white border-slate-200/60 shadow-sm"
        }`}>
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold">Traffic & Conversions</h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                  Visual traffic spikes paired with conversion submissions.
                </p>
              </div>
              <div className={`flex gap-4 text-xs font-semibold ${isDark ? "text-white/50" : "text-slate-500"}`}>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#a855f7]" />
                  Traffic
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff8a5b]" />
                  Conversions
                </span>
              </div>
            </div>

            {/* Recharts chart with SSR Guard */}
            <div className="h-80 w-full min-h-[320px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={TRAFFIC_DATA}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorTraffic"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#a855f7"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#a855f7"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorConversions"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ff8a5b"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ff8a5b"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                      tickLine={false}
                      style={{ fontSize: 11, fontWeight: 500 }}
                    />
                    <YAxis
                      stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                      tickLine={false}
                      style={{ fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: isDark ? "#12052c" : "#fff",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "12px",
                        fontSize: "11px",
                        color: isDark ? "#fff" : "#1e152e",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="traffic"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTraffic)"
                    />
                    <Area
                      type="monotone"
                      dataKey="conversions"
                      stroke="#ff8a5b"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorConversions)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className={`h-full w-full flex items-center justify-center text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
                  Loading metrics chart...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Feed Container */}
        <div className={`rounded-2xl border p-6 flex flex-col transition duration-300 ${
          isDark ? "bg-[#12052c]/60 border-white/5 shadow-2xl" : "bg-white border-slate-200/60 shadow-sm"
        }`}>
          <div className="mb-6">
            <h3 className="text-base font-semibold">Recent Operations</h3>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Live audit timeline log entries from StellR core.
            </p>
          </div>

          <div className="flex-1 space-y-5">
            {activities.map((act) => (
              <div key={act.time} className="flex gap-4 items-start text-xs">
                <div
                  className={`h-8 w-8 shrink-0 rounded-lg border flex items-center justify-center ${act.color}`}
                >
                  <act.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>
                      {act.module}
                    </span>
                    <span className={`text-[10px] font-medium ${isDark ? "text-white/40" : "text-slate-400"}`}>
                      {act.time}
                    </span>
                  </div>
                  <p className={`${isDark ? "text-white/60" : "text-slate-500"} leading-relaxed`}>{act.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className={`w-full mt-6 py-2.5 rounded-xl border text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition ${
            isDark
              ? "border-white/10 hover:border-white/20 hover:bg-white/5"
              : "border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700"
          }`}>
            View Live Stream
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
