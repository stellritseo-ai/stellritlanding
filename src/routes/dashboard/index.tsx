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
  Briefcase,
  ListTodo,
  FileImage,
  Mail,
  MessageSquare,
  DollarSign,
  Globe,
  Percent,
  Loader2
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
import { getDashboardStatsFn } from "@/lib/dashboard.functions.server";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Dynamic dashboard states
  const [stats, setStats] = useState<{
    metrics: {
      collection: { value: string; growth: string };
      sales: { value: string; growth: string };
      websites: { value: string; growth: string };
      conversion: { value: string; growth: string };
    };
    chartData: Array<{ day: string; traffic: number; conversions: number }>;
    activities: Array<{ id: string; time: string; action: string; details: string; performedBy: string }>;
  } | null>(null);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStatsFn();
      setStats(data as any);
    } catch (err) {
      console.error("Failed to fetch dashboard statistics:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const triggerRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  if (!stats) {
    return (
      <div className="flex h-[80vh] items-center justify-center select-none">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#a855f7] mx-auto" />
          <p className="text-sm opacity-50 font-semibold">Syncing live analytics hub metrics...</p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: "Monthly Collection",
      value: stats.metrics.collection.value,
      change: `${stats.metrics.collection.growth} vs last month`,
      color: "from-emerald-400 to-teal-500",
      icon: DollarSign,
    },
    {
      title: "Monthly Project Sale",
      value: stats.metrics.sales.value,
      change: `${stats.metrics.sales.growth} vs last month`,
      color: "from-[#a855f7] to-[#cc7aff]",
      icon: Briefcase,
    },
    {
      title: "Active Website",
      value: stats.metrics.websites.value,
      change: `${stats.metrics.websites.growth} vs last month`,
      color: "from-[#ff8a5b] to-amber-500",
      icon: Globe,
    },
    {
      title: "Project Conversion Rate",
      value: stats.metrics.conversion.value,
      change: `${stats.metrics.conversion.growth} vs last month`,
      color: "from-blue-400 to-indigo-500",
      icon: Percent,
    },
  ];

  const activities = stats.activities.map((act) => {
    const actLower = act.action.toLowerCase();
    let IconComponent = Activity;
    let colorClasses = "text-blue-400 bg-blue-500/10 border-blue-500/20";
    let moduleName = "System";

    if (actLower.includes("project") || actLower.includes("sale") || actLower.includes("credentials") || actLower.includes("member") || actLower.includes("revoked") || actLower.includes("status")) {
      IconComponent = Briefcase;
      colorClasses = "text-purple-400 bg-purple-500/10 border-purple-500/20";
      moduleName = "Sales & Seats";
    } else if (actLower.includes("task")) {
      IconComponent = ListTodo;
      colorClasses = "text-[#ff8a5b] bg-[#ff8a5b]/10 border-[#ff8a5b]/20";
      moduleName = "Tasks";
    } else if (actLower.includes("upload") || actLower.includes("asset")) {
      IconComponent = FileImage;
      colorClasses = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      moduleName = "Assets";
    } else if (actLower.includes("email") || actLower.includes("inquiry") || actLower.includes("lead")) {
      IconComponent = Mail;
      colorClasses = "text-amber-400 bg-amber-500/10 border-amber-500/20";
      moduleName = "Inbound Leads";
    } else if (actLower.includes("chat") || actLower.includes("message")) {
      IconComponent = MessageSquare;
      colorClasses = "text-pink-400 bg-pink-500/10 border-pink-500/20";
      moduleName = "Live Chat";
    }

    return {
      id: act.id,
      time: act.time,
      module: moduleName,
      desc: act.details || act.action,
      icon: IconComponent,
      color: colorClasses,
    };
  });

  return (
    <div className="space-y-8 select-none">
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
                <span className={`text-xs font-medium tracking-wide ${isDark ? "text-white/50" : "text-slate-450"}`}>
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

            <div className="mt-4 flex items-center gap-1.5 text-[11px]">
              <span className={`font-semibold ${metric.change.startsWith("-") ? "text-rose-400" : "text-emerald-400"}`}>
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
                <h3 className="text-base font-semibold">Collection & Sales</h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-slate-400"}`}>
                  Visual collection flow paired with new project sales value.
                </p>
              </div>
              <div className={`flex gap-4 text-xs font-semibold ${isDark ? "text-white/50" : "text-slate-500"}`}>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#a855f7]" />
                  Monthly Collection
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff8a5b]" />
                  Monthly Sales
                </span>
              </div>
            </div>

            {/* Recharts chart with SSR Guard */}
            <div className="h-80 w-full min-h-[320px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stats.chartData}
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
                      formatter={(val: number) => [`$${val.toLocaleString()}`]}
                      contentStyle={{
                        background: isDark ? "#12052c" : "#fff",
                        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "12px",
                        fontSize: "11px",
                        color: isDark ? "#fff" : "#1e152e",
                      }}
                    />
                    <Area
                      name="Monthly Collection"
                      type="monotone"
                      dataKey="traffic"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTraffic)"
                    />
                    <Area
                      name="Monthly Sales"
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
              Live operations stream logs from StellR database.
            </p>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto max-h-[340px] pr-1">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="flex gap-4 items-start text-xs">
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
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-xs opacity-40 py-10">
                No recent activities found in logs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

