import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Shield,
  Activity,
  Cpu,
  Database,
  Settings,
  MoreVertical,
  Plus,
  Search,
  Check,
  X,
  Server,
  AlertCircle,
  ShieldAlert,
  HardDrive
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getOperatorsFn,
  createOperatorFn,
  updateOperatorStatusFn,
  deleteOperatorFn,
  getSiteConfigFn,
  updateSiteConfigFn,
  getDiagnosticsFn,
} from "@/lib/dashboard.functions.server";

export const Route = createFileRoute("/dashboard/admin")({
  component: DashboardAdmin,
});

interface User {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Developer" | "Analyst";
  status: "Active" | "Inactive";
  joinedDate: string;
}

interface Flag {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
  category: "Security" | "Performance" | "Beta Features";
}



function formatSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Custom Premium Toggle Switch Component
function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      type="button"
      className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-[#a855f7]/40 ${
        checked ? "bg-gradient-to-r from-[#a855f7] to-[#ff8a5b]" : "bg-white/10"
      }`}
    >
      <motion.div
        layout
        className="h-5 w-5 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function CpuDiagnosticsCard({ isDark, cpuUsage }: { isDark: boolean; cpuUsage: number }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 shadow-2xl transition duration-300 group ${
      isDark ? "bg-gradient-to-b from-[#12052c]/90 to-[#0e0220]/95 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "bg-white border-slate-200/60 shadow-sm"
    }`}>
      {isDark && <div className="absolute inset-0 bg-[#a855f7]/5 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>
            CPU Compute Pools
          </span>
          <h4 className={`text-sm font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>Edge Clusters</h4>
        </div>
        <div className="h-9 w-9 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center">
          <Cpu className="h-4.5 w-4.5 text-[#a855f7]" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-bold font-mono tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
          {cpuUsage}%
        </span>
        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
          <Activity className="h-3 w-3 animate-pulse" />
          Live
        </span>
      </div>

      {/* Micro CPU visual grid block indicators */}
      <div className="grid grid-cols-10 gap-1.5 mt-6">
        {Array.from({ length: 20 }).map((_, idx) => {
          const isActive = (idx + 1) / 20 <= cpuUsage / 100;
          return (
            <div
              key={idx}
              className={`h-4.5 rounded-sm transition-all duration-500 ${
                isActive
                  ? "bg-gradient-to-t from-[#a855f7] to-[#cc7aff] shadow-[0_0_8px_rgba(168,85,247,0.35)]"
                  : (isDark ? "bg-white/5 border border-white/[0.02]" : "bg-slate-100 border-slate-200/40")
              }`}
            />
          );
        })}
      </div>

      <div className={`mt-5 flex items-center justify-between text-[10px] border-t pt-4 ${
        isDark ? "text-white/40 border-white/5" : "text-slate-400 border-slate-100"
      }`}>
        <span>4 Compute Threads</span>
        <span>Cluster Cap: 85%</span>
      </div>
    </div>
  );
}

function DashboardAdmin() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  // Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"Super Admin" | "Developer" | "Analyst">("Developer");

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("All");

  // Dynamic Operators State
  const [users, setUsers] = useState<User[]>([]);

  // Diagnostics State
  const [diagnostics, setDiagnostics] = useState<{
    cpuUsage: number;
    heapUsed: number;
    heapTotal: number;
    uptime: number;
    databaseStatus: string;
    totalAssets: number;
    totalSize: number;
  }>({
    cpuUsage: 14.8,
    heapUsed: 428 * 1024 * 1024,
    heapTotal: 1024 * 1024 * 1024,
    uptime: 120,
    databaseStatus: "Connecting...",
    totalAssets: 0,
    totalSize: 0
  });

  // Feature Flags State
  const [flags, setFlags] = useState<Flag[]>([
    {
      id: "f1",
      name: "Global Maintenance Mode",
      desc: "Redirects all incoming visitor traffic to an optimized placeholder screen.",
      enabled: false,
      category: "Security",
    },
    {
      id: "f2",
      name: "AI Helpdesk Autoplay",
      desc: "Triggers helpdesk widget initialization 5s post-interaction.",
      enabled: true,
      category: "Beta Features",
    },
    {
      id: "f3",
      name: "Edge Cache Compression",
      desc: "Compresses static asset trees at CDN edges using Brotli encoding.",
      enabled: true,
      category: "Performance",
    },
    {
      id: "f4",
      name: "Dynamic Case Studies",
      desc: "Exposes work-in-progress case logs directly inside website routes.",
      enabled: false,
      category: "Beta Features",
    },
  ]);

  const fetchOperators = async () => {
    try {
      const data = await getOperatorsFn();
      setUsers(data as any);
    } catch (err) {
      console.error("Failed to fetch operators:", err);
    }
  };

  const fetchDiagnostics = async () => {
    try {
      const data = await getDiagnosticsFn();
      setDiagnostics(data);
    } catch (err) {
      console.error("Failed to fetch diagnostics:", err);
    }
  };

  const loadConfig = async () => {
    try {
      const configData = await getSiteConfigFn();
      if (configData) {
        setFlags([
          {
            id: "f1",
            name: "Global Maintenance Mode",
            desc: "Redirects all incoming visitor traffic to an optimized placeholder screen.",
            enabled: configData.maintenanceMode,
            category: "Security",
          },
          {
            id: "f2",
            name: "AI Helpdesk Autoplay",
            desc: "Triggers helpdesk widget initialization 5s post-interaction.",
            enabled: configData.aiHelpdeskAutoplay,
            category: "Beta Features",
          },
          {
            id: "f3",
            name: "Edge Cache Compression",
            desc: "Compresses static asset trees at CDN edges using Brotli encoding.",
            enabled: configData.edgeCacheCompression,
            category: "Performance",
          },
          {
            id: "f4",
            name: "Dynamic Case Studies",
            desc: "Exposes work-in-progress case logs directly inside website routes.",
            enabled: configData.dynamicCaseStudies,
            category: "Beta Features",
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to load global configurations:", err);
    }
  };

  useEffect(() => {
    fetchOperators();
    loadConfig();
    fetchDiagnostics();

    const interval = setInterval(fetchDiagnostics, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleFlag = async (id: string) => {
    const flag = flags.find(f => f.id === id);
    if (!flag) return;
    const nextVal = !flag.enabled;
    
    // Optimistic UI update
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: nextVal } : f))
    );

    try {
      const payload: any = {};
      if (id === "f1") payload.maintenanceMode = nextVal;
      if (id === "f2") payload.aiHelpdeskAutoplay = nextVal;
      if (id === "f3") payload.edgeCacheCompression = nextVal;
      if (id === "f4") payload.dynamicCaseStudies = nextVal;

      await updateSiteConfigFn({ data: payload });
    } catch (err) {
      console.error("Failed to toggle feature flag:", err);
      // Revert optimistic update
      setFlags((prev) =>
        prev.map((f) => (f.id === id ? { ...f, enabled: !nextVal } : f))
      );
    }
  };

  const toggleUserStatus = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );

    try {
      await updateOperatorStatusFn({ data: { id, status: nextStatus } });
    } catch (err) {
      console.error("Failed to toggle operator status:", err);
      // Revert optimistic update
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: user.status } : u))
      );
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm(`Are you sure you want to revoke permissions for this operator?`)) return;
    
    // Optimistic UI update
    setUsers((prev) => prev.filter((u) => u.id !== id));

    try {
      await deleteOperatorFn({ data: { id } });
    } catch (err) {
      console.error("Failed to revoke operator permissions:", err);
      fetchOperators();
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    try {
      const response = await createOperatorFn({
        data: {
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
          status: "Active",
          joinedDate: new Date().toISOString().split("T")[0],
        }
      });

      setUsers((prev) => [...prev, response as any]);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserRole("Developer");
      setAddModalOpen(false);
    } catch (err) {
      console.error("Failed to provision operator:", err);
      alert("Failed to provision new operator access role.");
    }
  };

  // Filtered Users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole =
        selectedRoleFilter === "All" || u.role === selectedRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRoleFilter]);

  return (
    <div className="space-y-8 select-none">
      {/* Background radial highlight */}
      {isDark && (
        <div className="pointer-events-none absolute top-0 right-1/4 h-[350px] w-[350px] rounded-full bg-[#ff8a5b]/5 blur-[80px] -z-10" />
      )}

      {/* Page Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6 ${
        isDark ? "border-white/5" : "border-slate-200/60"
      }`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#a855f7] tracking-wider uppercase mb-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            Core Security Center
          </div>
          <h1 className={`font-serif text-3xl font-bold tracking-tight md:text-4xl ${isDark ? "text-white" : "text-slate-800"}`}>
            System Administration
          </h1>
          <p className={`text-sm mt-1 max-w-xl leading-relaxed ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Manage system deployment gates, toggles, memory partitions, and security access key permissions.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition duration-300 text-xs font-bold tracking-wide active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Provision Access
        </button>
      </div>

      {/* High-Fidelity Diagnostics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: CPU Load */}
        <CpuDiagnosticsCard isDark={isDark} cpuUsage={diagnostics.cpuUsage} />

        {/* Card 2: Memory Heap */}
        <div className={`relative overflow-hidden rounded-2xl border p-6 shadow-2xl transition duration-300 group ${
          isDark ? "bg-gradient-to-b from-[#12052c]/90 to-[#0e0220]/95 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "bg-white border-slate-200/60 shadow-sm"
        }`}>
          {isDark && <div className="absolute inset-0 bg-[#ff8a5b]/5 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />}
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Heap Partitions
              </span>
              <h4 className={`text-sm font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>Memory Array</h4>
            </div>
            <div className="h-9 w-9 rounded-xl bg-[#ff8a5b]/10 border border-[#ff8a5b]/20 flex items-center justify-center">
              <Database className="h-4.5 w-4.5 text-[#ff8a5b]" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold font-mono tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
              {Math.round(diagnostics.heapUsed / (1024 * 1024))}MB
            </span>
            <span className={`text-[10px] font-semibold ${isDark ? "text-white/40" : "text-slate-450"}`}>
              Of {Math.round(diagnostics.heapTotal / (1024 * 1024))}MB Pool
            </span>
          </div>

          {/* Segmented memory status blocks */}
          <div className="flex gap-1.5 mt-6">
            {Array.from({ length: 16 }).map((_, idx) => {
              const activeSegments = Math.round((diagnostics.heapUsed / diagnostics.heapTotal) * 16);
              const lit = idx < activeSegments;
              return (
                <div
                  key={idx}
                  className={`h-4.5 flex-1 rounded-sm transition duration-300 ${
                    lit
                      ? "bg-gradient-to-t from-[#ff8a5b] to-amber-400 shadow-[0_0_8px_rgba(255,138,91,0.35)]"
                      : (isDark ? "bg-white/5 border border-white/[0.02]" : "bg-slate-100 border-slate-200/40")
                  }`}
                />
              );
            })}
          </div>

          <div className={`mt-5 flex items-center justify-between text-[10px] border-t pt-4 ${
            isDark ? "text-white/40 border-white/5" : "text-slate-400 border-slate-100"
          }`}>
            <span>Partition Code V8</span>
            <span>Allocated: {Math.round((diagnostics.heapUsed / diagnostics.heapTotal) * 100)}%</span>
          </div>
        </div>

        {/* Card 3: Asset Storage Footprint */}
        <div className={`relative overflow-hidden rounded-2xl border p-6 shadow-2xl transition duration-300 group ${
          isDark ? "bg-gradient-to-b from-[#12052c]/90 to-[#0e0220]/95 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "bg-white border-slate-200/60 shadow-sm"
        }`}>
          {isDark && <div className="absolute inset-0 bg-emerald-400/5 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />}
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? "text-white/40" : "text-slate-400"}`}>
                Asset Vault Storage
              </span>
              <h4 className={`text-sm font-semibold ${isDark ? "text-white/80" : "text-slate-700"}`}>Vault Footprint</h4>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <HardDrive className="h-4.5 w-4.5 text-emerald-400" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold font-mono tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
              {formatSize(diagnostics.totalSize)}
            </span>
            <span className="text-[10px] font-semibold text-emerald-400">
              {diagnostics.totalAssets} File{diagnostics.totalAssets !== 1 ? 's' : ''}
            </span>
          </div>

          {/* SVG Wave */}
          <div className={`h-4.5 mt-6 relative overflow-hidden border rounded-sm ${isDark ? "bg-white/5 border-white/[0.02]" : "bg-slate-50 border-slate-150"}`}>
            <svg
              className="absolute inset-x-0 bottom-0 w-full h-8 text-emerald-400/30"
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0 10 Q25 5, 50 10 T100 10 L100 20 L0 20 Z"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                fill="currentColor"
              />
              <motion.path
                d="M0 12 Q25 7, 50 12 T100 12 L100 20 L0 20 Z"
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                fill="rgba(52, 211, 153, 0.4)"
              />
            </svg>
          </div>

          <div className={`mt-5 flex items-center justify-between text-[10px] border-t pt-4 ${
            isDark ? "text-white/40 border-white/5" : "text-slate-400 border-slate-100"
          }`}>
            <span>Database Status: {diagnostics.databaseStatus}</span>
            <span>Uptime: {Math.floor(diagnostics.uptime / 3600)}h {Math.floor((diagnostics.uptime % 3600) / 60)}m</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Toggles & Operators List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Span 2: Operators Access Control List */}
        <div className={`lg:col-span-2 rounded-2xl border p-6 shadow-2xl flex flex-col transition duration-300 ${
          isDark ? "bg-gradient-to-b from-[#12052c]/90 to-[#0e0220]/95 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "bg-white border-slate-200/60 shadow-sm"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className={`text-lg font-serif font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Access Credentials</h3>
              <p className={`text-xs mt-0.5 ${isDark ? "text-white/45" : "text-slate-450"}`}>
                Authorized developer profiles with active administrative tokens.
              </p>
            </div>

            {/* Quick Filter Bar */}
            <div className="flex gap-2.5 items-center">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`h-8 pl-8 pr-3.5 w-44 rounded-lg border text-[11px] transition duration-300 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#a855f7]/40"
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/40"
                  }`}
                />
              </div>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className={`h-8 px-2 rounded-lg border text-[11px] transition duration-300 ${
                  isDark ? "bg-[#12052c] border-white/10 text-white/70" : "bg-white border-slate-200 text-slate-655"
                }`}
              >
                <option value="All">All Roles</option>
                <option value="Super Admin">Super Admins</option>
                <option value="Developer">Developers</option>
                <option value="Analyst">Analysts</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b uppercase font-semibold tracking-widest text-[10px] ${
                    isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"
                  }`}>
                    <th className="pb-3 pr-4">Identity Details</th>
                    <th className="pb-3 px-4">Portal Authorization</th>
                    <th className="pb-3 px-4">Joined Date</th>
                    <th className="pb-3 px-4">Node Link Status</th>
                    <th className="pb-3 pl-4 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/[0.04]" : "divide-slate-100"}`}>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-black/[0.01] transition-colors group"
                      >
                        {/* Name / Email */}
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#a855f7] to-[#ff8a5b] flex items-center justify-center font-bold text-xs text-white shadow-inner">
                              {user.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <div className={`font-semibold transition duration-300 group-hover:text-[#a855f7] ${isDark ? "text-white" : "text-slate-800"}`}>
                                {user.name}
                              </div>
                              <div className={`text-[10px] mt-0.5 font-mono ${isDark ? "text-white/40" : "text-slate-400"}`}>
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role tag */}
                        <td className="py-4 px-4 font-medium">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/80">
                            <Shield className="h-3 w-3 text-[#a855f7]" />
                            {user.role}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className={`py-4 px-4 font-mono text-[10px] ${isDark ? "text-white/50" : "text-slate-450"}`}>
                          {user.joinedDate}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition duration-300 ${
                              user.status === "Active"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]"
                                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.status === "Active"
                                  ? "bg-emerald-400 animate-pulse"
                                  : "bg-white/30"
                              }`}
                            />
                            {user.status}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 pl-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-red-500/15 text-white/40 hover:text-red-400 transition"
                              title="Revoke Permissions"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <button className={`h-8 w-8 inline-flex items-center justify-center rounded-lg transition ${
                              isDark ? "hover:bg-white/10 text-white/40 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                            }`}>
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/30">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="h-5 w-5 text-white/20" />
                          <span>No administrative operators match your filter criteria.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Feature Flag Controls - Right Column */}
        <div className={`rounded-2xl border p-6 shadow-2xl flex flex-col justify-between transition duration-300 ${
          isDark ? "bg-gradient-to-b from-[#12052c]/90 to-[#0e0220]/95 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "bg-white border-slate-200/60 shadow-sm"
        }`}>
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-serif font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Feature Overrides</h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-white/45" : "text-slate-450"}`}>
                  Dynamically lock and toggle global site states.
                </p>
              </div>
              <Settings className="h-4.5 w-4.5 text-white/30" />
            </div>

            <div className="space-y-4">
              {flags.map((flag) => (
                <div
                  key={flag.id}
                  className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all duration-300 group ${
                    isDark ? "bg-white/[0.03] border-white/5 hover:border-white/10" : "bg-slate-50 border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`block text-xs font-semibold transition duration-300 group-hover:text-[#a855f7] ${isDark ? "text-white" : "text-slate-800"}`}>
                        {flag.name}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold uppercase tracking-wider text-white/50">
                        {flag.category}
                      </span>
                    </div>
                    <span className={`block text-[10px] leading-relaxed ${isDark ? "text-white/40" : "text-slate-450"}`}>
                      {flag.desc}
                    </span>
                  </div>
                  <Switch
                    checked={flag.enabled}
                    onChange={() => toggleFlag(flag.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={`mt-8 p-4 rounded-xl border flex gap-3.5 items-start ${
            isDark ? "border-[#a855f7]/20 bg-[#a855f7]/5" : "border-[#a855f7]/15 bg-[#a855f7]/5 text-slate-700"
          }`}>
            <Shield className="h-5 w-5 text-[#a855f7] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className={`block text-xs font-bold ${isDark ? "text-white" : "text-slate-800"}`}>Access Safe Guard</span>
              <p className={`text-[10px] leading-normal ${isDark ? "text-white/50" : "text-slate-500"}`}>
                Toggling states will immediately invalidate edge cache stores and broadcast changes globally within 500ms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Sidebar Modal (Add Access Role) */}
      <AnimatePresence>
        {addModalOpen && (
          <>
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddModalOpen(false)}
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            />

            {/* Modal panel container */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.4 }}
                className={`w-full max-w-md overflow-hidden rounded-2xl border p-6 shadow-2xl relative ${
                  isDark ? "bg-[#12052c] border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                {/* Header */}
                <div className={`flex items-center justify-between border-b pb-4 mb-6 ${isDark ? "border-white/5" : "border-slate-100"}`}>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#a855f7]" />
                    <h3 className="font-serif text-lg font-bold">Provision Access Role</h3>
                  </div>
                  <button
                    onClick={() => setAddModalOpen(false)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAddUser} className="space-y-5">
                  <div className="space-y-2">
                    <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>
                      Full Operator Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Hassel"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className={`w-full h-10 px-3.5 rounded-xl border text-sm transition duration-300 ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#a855f7]/50"
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/50"
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. operator@stellrit.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className={`w-full h-10 px-3.5 rounded-xl border text-sm transition duration-300 ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#a855f7]/50"
                          : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/50"
                      }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>
                      Access Scope Role
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) =>
                        setNewUserRole(
                          e.target.value as "Super Admin" | "Developer" | "Analyst"
                        )
                      }
                      className={`w-full h-10 px-3 rounded-xl border text-sm transition duration-300 ${
                        isDark ? "bg-[#12052c] border-white/10 text-white" : "bg-white border-slate-200 text-slate-655"
                      }`}
                    >
                      <option value="Developer">Developer (Write & Deploy)</option>
                      <option value="Super Admin">Super Admin (All Modules)</option>
                      <option value="Analyst">Analyst (Read Only)</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className={`flex items-center justify-end gap-3 border-t pt-5 mt-6 ${isDark ? "border-white/5" : "border-slate-100"}`}>
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(false)}
                      className="px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-xs font-semibold tracking-wide transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg hover:shadow-[#a855f7]/20 text-xs font-bold tracking-wide active:scale-[0.98] transition"
                    >
                      <Check className="h-4 w-4" />
                      Provision Role
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
