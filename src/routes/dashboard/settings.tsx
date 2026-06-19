import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Settings,
  Save,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Shield,
  Database,
  Activity,
  RotateCw,
  Key,
  Trash2,
  Check,
  X,
  Loader2,
  HardDrive,
  Cpu,
  User,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getOperatorsFn,
  deleteOperatorFn,
  updateOperatorCredentialsFn,
  getActivityLogsFn,
  getDatabaseDetailsFn,
  getDiagnosticsFn
} from "@/lib/dashboard.functions.server";
import { ConfirmModal } from "@/components/ConfirmModal";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

interface Operator {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Supervisor" | "Manager" | "Developer" | "Viewer";
  status: "Active" | "Inactive";
  joinedDate: string;
  username?: string;
  password?: string;
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

function SettingsPage() {
  const { theme, toggleTheme } = useDashboardTheme();
  const isDark = theme === "dark";

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"general" | "security" | "activity" | "database">("general");

  // Logged-in Operator Info
  const [currentUser, setCurrentUser] = useState<{ name: string; username: string; role: string } | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("stellr_admin_user");
      if (saved) {
        try {
          setCurrentUser(JSON.parse(saved));
        } catch { }
      }
    }
  }, []);

  // ── Tab 1: Visuals & Notification Settings ─────────────────────────────────
  const [visualTheme, setVisualTheme] = useState<string>(theme);
  const [notifications, setNotifications] = useState({
    deployments: true,
    analytics: true,
    warnings: true
  });

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (visualTheme !== theme) {
      toggleTheme();
    }
    toast.success("Preferences saved successfully!");
  };

  // ── Tab 2: Security & Operator Directory ──────────────────────────────────
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loadingOps, setLoadingOps] = useState(false);
  const [editingOp, setEditingOp] = useState<Operator | null>(null);

  // Inline edit credentials form state
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState<Operator["role"]>("Developer");
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Deletion modal state
  const [deletingOpId, setDeletingOpId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOperators = useCallback(async () => {
    setLoadingOps(true);
    try {
      const data = await getOperatorsFn();
      setOperators(data as Operator[]);
    } catch (err) {
      console.error("Failed to fetch operators:", err);
    } finally {
      setLoadingOps(false);
    }
  }, []);

  const handleEditClick = (op: Operator) => {
    setEditingOp(op);
    setEditName(op.name);
    setEditUsername(op.username || "");
    setEditPassword(op.password || "");
    setEditRole(op.role);
    setShowEditPassword(false);
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOp) return;
    if (!editName.trim() || !editUsername.trim()) {
      toast.error("Name and Username are required.");
      return;
    }

    try {
      const response = await updateOperatorCredentialsFn({
        data: {
          id: editingOp.id,
          name: editName.trim(),
          username: editUsername.toLowerCase().trim(),
          password: editPassword.trim(),
          role: editRole,
          performedBy: currentUser?.name || "System Admin"
        }
      });

      setOperators((prev) =>
        prev.map((o) => (o.id === editingOp.id ? (response as Operator) : o))
      );
      setEditingOp(null);
      toast.success("Operator credentials updated successfully!");
      fetchActivityLogs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update operator details.");
    }
  };

  const handleDeleteOperator = async () => {
    if (!deletingOpId) return;
    setDeleting(true);
    try {
      await deleteOperatorFn({ data: { id: deletingOpId } });
      setOperators((prev) => prev.filter((o) => o.id !== deletingOpId));
      toast.success("Operator access revoked successfully!");
      fetchActivityLogs();
    } catch (err) {
      toast.error("Failed to revoke operator access.");
    } finally {
      setDeletingOpId(null);
      setDeleting(false);
    }
  };

  // ── Tab 3: System Activities Logs ──────────────────────────────────────────
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logSearchQuery, setLogSearchQuery] = useState("");

  const fetchActivityLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const data = await getActivityLogsFn();
      setLogs(data as ActivityLog[]);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = logSearchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q)) ||
        log.performedBy.toLowerCase().includes(q)
      );
    });
  }, [logs, logSearchQuery]);

  // ── Tab 4: Database Connect & Diagnostics ──────────────────────────────────
  const [dbDetails, setDbDetails] = useState<{
    readyState: number;
    host: string;
    port: string;
    databaseName: string;
    counts: { operators: number; tasks: number; projects: number; emails: number; logs: number };
  } | null>(null);

  const [diagnostics, setDiagnostics] = useState<{
    cpuUsage: number;
    heapUsed: number;
    heapTotal: number;
    uptime: number;
  } | null>(null);

  const [loadingDb, setLoadingDb] = useState(false);

  const fetchDatabaseAndDiagnostics = useCallback(async () => {
    setLoadingDb(true);
    try {
      const dbData = await getDatabaseDetailsFn();
      const diagData = await getDiagnosticsFn();
      setDbDetails(dbData);
      setDiagnostics({
        cpuUsage: diagData.cpuUsage,
        heapUsed: diagData.heapUsed,
        heapTotal: diagData.heapTotal,
        uptime: diagData.uptime
      });
    } catch (err) {
      console.error("Failed to fetch system details:", err);
    } finally {
      setLoadingDb(false);
    }
  }, []);

  // Fetch initial data based on active tabs
  useEffect(() => {
    if (activeTab === "security") {
      fetchOperators();
    } else if (activeTab === "activity") {
      fetchActivityLogs();
    } else if (activeTab === "database") {
      fetchDatabaseAndDiagnostics();
    }
  }, [activeTab, fetchOperators, fetchActivityLogs, fetchDatabaseAndDiagnostics]);

  // Render tabs headings
  const tabs = [
    { id: "general", label: "Preferences", icon: Settings },
    { id: "security", label: "Security & Credentials", icon: Lock },
    { id: "activity", label: "Activity History", icon: Activity },
    { id: "database", label: "Database Vault", icon: Database }
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className={`flex items-center justify-between border-b pb-6 ${isDark ? "border-white/5" : "border-slate-200/60"
        }`}>
        <div>
          <h1 className={`font-serif text-3xl font-bold tracking-tight md:text-4xl ${isDark ? "text-white" : "text-slate-800"}`}>
            System Controls
          </h1>
          <p className={`text-sm mt-1 max-w-xl leading-relaxed ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Configure organizational settings, audit credential authorization, track activity nodes, and watch database metrics.
          </p>
        </div>
      </div>

      {/* Tabs Switcher Layout */}
      <div className="flex border-b border-white/5 gap-2 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-xs transition duration-300 ${isActive
                  ? "border-[#a855f7] text-[#a855f7]"
                  : `border-transparent ${isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-700"
                  }`
                }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-8">
        {/* Tab 1: General Preferences */}
        {activeTab === "general" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Visual Prefs */}
            <div className={`lg:col-span-2 rounded-2xl border p-6 shadow-2xl space-y-6 transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
              }`}>
              <h3 className={`text-base font-semibold flex items-center gap-2 border-b pb-3 ${isDark ? "border-white/5" : "border-slate-100"
                }`}>
                <Settings className="h-4.5 w-4.5 text-[#a855f7]" />
                Visual & Dashboard Preferences
              </h3>

              <form onSubmit={handleSavePreferences} className="space-y-6">
                <div className="space-y-2">
                  <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>
                    Dashboard Visual Theme
                  </label>
                  <select
                    value={visualTheme}
                    onChange={(e) => setVisualTheme(e.target.value)}
                    className={`w-full h-10 px-3 rounded-xl border text-sm transition duration-300 focus:outline-none focus:border-[#a855f7]/50 ${isDark ? "bg-[#12052c] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700"
                      }`}
                  >
                    <option value="dark">Vibrant Cyber Dark</option>
                    <option value="light">Clean Paper Light</option>
                  </select>
                </div>

                <div className="space-y-3.5">
                  <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>
                    System Email Notifications
                  </label>
                  <div className={`space-y-3 text-xs ${isDark ? "text-white/70" : "text-slate-655"}`}>
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="space-y-0.5">
                        <span className="block font-semibold">Deployment Status Logs</span>
                        <span className="block opacity-40 text-[10px]">Email digests on production pipeline audits.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.deployments}
                        onChange={(e) => setNotifications((p) => ({ ...p, deployments: e.target.checked }))}
                        className="rounded h-4 w-4 accent-[#a855f7]"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="space-y-0.5">
                        <span className="block font-semibold">Weekly Analytics digest</span>
                        <span className="block opacity-40 text-[10px]">Summed operations footprints metrics delivered.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.analytics}
                        onChange={(e) => setNotifications((p) => ({ ...p, analytics: e.target.checked }))}
                        className="rounded h-4 w-4 accent-[#a855f7]"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="space-y-0.5">
                        <span className="block font-semibold">Security Gate Alerts</span>
                        <span className="block opacity-40 text-[10px]">High priority notification on core system warnings.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.warnings}
                        onChange={(e) => setNotifications((p) => ({ ...p, warnings: e.target.checked }))}
                        className="rounded h-4 w-4 accent-[#a855f7]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]"
                >
                  <Save className="h-4 w-4" />
                  Save Visual Preferences
                </button>
              </form>
            </div>

            {/* Profile Info */}
            <div className={`rounded-2xl border p-6 shadow-2xl space-y-6 flex flex-col justify-between transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
              }`}>
              <div className="space-y-4">
                <h3 className={`text-base font-semibold flex items-center gap-2 border-b pb-3 ${isDark ? "border-white/5" : "border-slate-100"
                  }`}>
                  <User className="h-4.5 w-4.5 text-[#ff8a5b]" />
                  Active Operator
                </h3>
                {currentUser ? (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#a855f7] to-[#ff8a5b] flex items-center justify-center font-bold text-xs text-white">
                        {currentUser.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <span className="block font-semibold">{currentUser.name}</span>
                        <span className="block opacity-40">@{currentUser.username}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="opacity-40">Assigned Scope Role</span>
                        <span className="font-semibold text-[#a855f7]">{currentUser.role}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="opacity-40">Network Link</span>
                        <span className="font-semibold text-emerald-400">Authenticated</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs opacity-40 py-4 text-center">Loading session metadata...</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Security & Operator Credentials Management */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Table or editor wrapper */}
            <div className={`rounded-2xl border p-6 shadow-2xl transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
              }`}>
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div>
                  <h3 className="text-base font-semibold">Seat Directory & Key Permissions</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-white/45" : "text-slate-450"}`}>
                    Edit usernames, passwords, or revoke seat authorizations.
                  </p>
                </div>
                {loadingOps && <Loader2 className="h-4 w-4 animate-spin text-[#a855f7]" />}
              </div>

              {currentUser?.role === "Supervisor" && (
                <div className="p-3.5 mb-6 rounded-xl border border-rose-500/25 bg-rose-500/5 text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span>Supervisor accounts are restricted from modifying credentials or deleting operators.</span>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b uppercase font-semibold tracking-widest text-[10px] ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"
                      }`}>
                      <th className="pb-3 pr-4">Identity Details</th>
                      <th className="pb-3 px-4">Username</th>
                      <th className="pb-3 px-4">Role / Scope</th>
                      <th className="pb-3 px-4">Password Hash</th>
                      <th className="pb-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-white/[0.04]" : "divide-slate-100"}`}>
                    {operators.map((op) => {
                      const isSelf = op.username === currentUser?.username;
                      const canModify = currentUser?.role === "Super Admin" || (isSelf && currentUser?.role !== "Supervisor");

                      return (
                        <tr key={op.id} className="hover:bg-white/[0.01] transition-colors group">
                          {/* Name / Email */}
                          <td className="py-4 pr-4">
                            <div>
                              <div className="font-semibold">{op.name}</div>
                              <div className={`text-[10px] mt-0.5 ${isDark ? "text-white/40" : "text-slate-450"}`}>
                                {op.email}
                              </div>
                            </div>
                          </td>

                          {/* Username */}
                          <td className="py-4 px-4 font-mono text-[10px] text-[#a855f7] font-semibold">
                            @{op.username || op.name.toLowerCase().replace(" ", "_")}
                          </td>

                          {/* Role tag */}
                          <td className="py-4 px-4 font-medium">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/80">
                              <Shield className="h-3 w-3 text-[#a855f7]" />
                              {op.role}
                            </span>
                          </td>

                          {/* Password hash / hide */}
                          <td className="py-4 px-4 font-mono text-[10px] relative">
                            {canModify ? (
                              <div className="flex items-center gap-1.5">
                                <span>{showPasswordMap[op.id] ? op.password : "••••••••"}</span>
                                <button
                                  onClick={() => setShowPasswordMap((prev) => ({ ...prev, [op.id]: !prev[op.id] }))}
                                  className="text-white/35 hover:text-white transition"
                                >
                                  {showPasswordMap[op.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            ) : (
                              <span className="opacity-30">Encrypted</span>
                            )}
                          </td>

                          {/* Action triggers */}
                          <td className="py-4 pl-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {canModify ? (
                                <>
                                  <button
                                    onClick={() => handleEditClick(op)}
                                    className={`h-7 px-3 inline-flex items-center justify-center rounded-lg border transition text-[10px] font-bold ${isDark
                                        ? "bg-white/5 border-white/5 text-white/70 hover:text-white hover:bg-[#a855f7]/25"
                                        : "bg-slate-50 border-slate-200 text-slate-660 hover:text-[#a855f7] hover:bg-slate-100"
                                      }`}
                                  >
                                    <Key className="h-3 w-3 mr-1 text-[#a855f7]" />
                                    Edit
                                  </button>
                                  {currentUser?.role === "Super Admin" && !isSelf && (
                                    <button
                                      onClick={() => setDeletingOpId(op.id)}
                                      className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-red-500/15 hover:bg-red-500/15 text-white/40 hover:text-red-400 transition"
                                      title="Revoke Seat Access"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <span className="opacity-25 text-[10px] font-semibold">Locked</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inline drawer dialog overlay for editing operator details */}
            <AnimatePresence>
              {editingOp && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setEditingOp(null)}
                    className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
                  />
                  <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className={`w-full max-w-md overflow-hidden rounded-2xl border p-6 shadow-2xl relative ${isDark ? "bg-[#12052c] border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]" : "bg-white border-slate-200 text-slate-800"
                        }`}
                    >
                      <div className={`flex items-center justify-between border-b pb-4 mb-6 ${isDark ? "border-white/5" : "border-slate-100"}`}>
                        <div className="flex items-center gap-2">
                          <Lock className="h-5 w-5 text-[#a855f7]" />
                          <h3 className="font-serif text-lg font-bold">Edit Credentials</h3>
                        </div>
                        <button
                          onClick={() => setEditingOp(null)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                        >
                          <X className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      <form onSubmit={handleUpdateCredentials} className="space-y-5 text-left">
                        <div className="space-y-2">
                          <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Full Name</label>
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className={`w-full h-10 px-3.5 rounded-xl border text-sm focus:outline-none focus:border-[#a855f7]/50 ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                              }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Username</label>
                          <input
                            type="text"
                            required
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            className={`w-full h-10 px-3.5 rounded-xl border text-sm focus:outline-none focus:border-[#a855f7]/50 ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                              }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Security Password</label>
                          <div className="relative">
                            <input
                              type={showEditPassword ? "text" : "password"}
                              required
                              value={editPassword}
                              onChange={(e) => setEditPassword(e.target.value)}
                              className={`w-full h-10 pl-3.5 pr-10 rounded-xl border text-sm focus:outline-none focus:border-[#a855f7]/50 ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                                }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowEditPassword(!showEditPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
                            >
                              {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {currentUser?.role === "Super Admin" ? (
                          <div className="space-y-2">
                            <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Scope Access Role</label>
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value as Operator["role"])}
                              className={`w-full h-10 px-3 rounded-xl border text-sm focus:outline-none focus:border-[#a855f7]/50 ${isDark ? "bg-[#12052c] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700"
                                }`}
                            >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Supervisor">Supervisor</option>
                              <option value="Manager">Manager</option>
                              <option value="Developer">Developer</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Scope Access Role</span>
                            <span className="block p-3.5 bg-white/5 border border-white/5 rounded-xl font-semibold text-xs text-[#a855f7]">
                              {editRole} (Role changes locked for non-admins)
                            </span>
                          </div>
                        )}

                        <div className={`flex items-center justify-end gap-3 border-t pt-5 mt-6 ${isDark ? "border-white/5" : "border-slate-100"}`}>
                          <button
                            type="button"
                            onClick={() => setEditingOp(null)}
                            className="px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-xs font-semibold transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg text-xs font-bold active:scale-[0.98] transition"
                          >
                            <Check className="h-4 w-4" />
                            Apply Changes
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>

            {/* Confirm Revoke modal */}
            <ConfirmModal
              isOpen={deletingOpId !== null}
              title="Revoke Operator Access"
              message="Are you sure you want to delete this user? They will immediately lose access to the administrative workspace dashboard."
              confirmText={deleting ? "Revoking..." : "Revoke Access"}
              cancelText="Cancel"
              type="danger"
              onConfirm={handleDeleteOperator}
              onCancel={() => setDeletingOpId(null)}
            />
          </motion.div>
        )}

        {/* Tab 3: System Activities Logs Timeline */}
        {activeTab === "activity" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-6 shadow-2xl transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
              }`}
          >
            {/* Header / Search filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-6">
              <div>
                <h3 className="text-base font-semibold">Security Audit Trails</h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-white/45" : "text-slate-450"}`}>
                  Audit timeline of significant configurations, logins, and data shift events.
                </p>
              </div>

              <div className="flex gap-2.5 items-center">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    className={`h-8 pl-8 pr-3.5 w-48 rounded-lg border text-[11px] transition duration-300 ${isDark
                        ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#a855f7]/40"
                        : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/40"
                      }`}
                  />
                </div>
                <button
                  onClick={fetchActivityLogs}
                  disabled={loadingLogs}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg border transition ${isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                    }`}
                  title="Reload Logs"
                >
                  <RotateCw className={`h-3.5 w-3.5 ${loadingLogs ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Logs timeline feed */}
            {loadingLogs ? (
              <div className="flex h-44 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-[#a855f7]" />
              </div>
            ) : filteredLogs.length > 0 ? (
              <div className="relative border-l border-white/5 pl-6 ml-3 space-y-6 text-xs text-left">
                {filteredLogs.map((log) => {
                  return (
                    <div key={log.id} className="relative">
                      {/* Circle node pointer indicator */}
                      <span className="absolute -left-9.5 top-0.5 h-6 w-6 rounded-full bg-[#12052c] border border-[#a855f7] flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-[#a855f7] animate-pulse" />
                      </span>

                      <div className="space-y-1">
                        <div className="flex items-baseline justify-between gap-4 flex-wrap">
                          <span className="font-bold text-[#ff8a5b] text-[13px]">{log.action}</span>
                          <span className={`font-mono text-[9px] ${isDark ? "text-white/35" : "text-slate-400"}`}>
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className={`leading-relaxed text-[11px] ${isDark ? "text-white/60" : "text-slate-655"}`}>
                          {log.details}
                        </p>
                        <span className={`block text-[9px] font-semibold ${isDark ? "text-white/40" : "text-slate-400"}`}>
                          By: <span className="text-[#a855f7]">@{log.performedBy}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-white/35 text-xs">
                No activity logs match your search.
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 4: Database Vault & Server Diagnostics */}
        {activeTab === "database" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Top Cards: DB details + CPU Diagnostics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Database Status Card */}
              <div className={`rounded-2xl border p-6 shadow-2xl relative overflow-hidden transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
                }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-bold uppercase tracking-widest opacity-40">Core Cluster</span>
                    <span className="block font-semibold">MongoDB Connection</span>
                  </div>
                  <HardDrive className="h-8 w-8 text-[#a855f7] opacity-60" />
                </div>

                {dbDetails ? (
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-mono tracking-tight text-white">
                        {dbDetails.readyState === 1 ? "Online" : "Offline"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Connected
                      </span>
                    </div>

                    <div className="space-y-1.5 font-mono text-[10px] opacity-75">
                      <div className="flex justify-between">
                        <span>Host:</span>
                        <span className="truncate max-w-40">{dbDetails.host}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Port:</span>
                        <span>{dbDetails.port}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>DB Name:</span>
                        <span>{dbDetails.databaseName}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs opacity-40">Loading connection specs...</div>
                )}
              </div>

              {/* Server Engine Heap */}
              <div className={`rounded-2xl border p-6 shadow-2xl relative overflow-hidden transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
                }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-bold uppercase tracking-widest opacity-40">Heap Array</span>
                    <span className="block font-semibold">Memory Utilization</span>
                  </div>
                  <Cpu className="h-8 w-8 text-[#ff8a5b] opacity-60" />
                </div>

                {diagnostics ? (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-mono tracking-tight text-white">
                        {Math.round(diagnostics.heapUsed / (1024 * 1024))}MB
                      </span>
                      <span className="text-[9px] opacity-40">
                        Of {Math.round(diagnostics.heapTotal / (1024 * 1024))}MB Pool
                      </span>
                    </div>

                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        className="bg-gradient-to-r from-[#ff8a5b] to-[#a855f7] h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(diagnostics.heapUsed / diagnostics.heapTotal) * 100}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] opacity-50 font-mono">
                      <span>V8 engine active</span>
                      <span>{Math.round((diagnostics.heapUsed / diagnostics.heapTotal) * 100)}% Alloc</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs opacity-40">Loading CPU loads...</div>
                )}
              </div>

              {/* Uptime metrics */}
              <div className={`rounded-2xl border p-6 shadow-2xl relative overflow-hidden transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
                }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-bold uppercase tracking-widest opacity-40">Runtime Clock</span>
                    <span className="block font-semibold">Compute Uptime</span>
                  </div>
                  <Activity className="h-8 w-8 text-emerald-400 opacity-60" />
                </div>

                {diagnostics ? (
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold font-mono tracking-tight text-white">
                        {Math.floor(diagnostics.uptime / 3600)}h {Math.floor((diagnostics.uptime % 3600) / 60)}m
                      </span>
                    </div>

                    <div className="space-y-1.5 font-mono text-[10px] opacity-75">
                      <div className="flex justify-between">
                        <span>CPU Active Load:</span>
                        <span className="text-emerald-400 font-semibold">{diagnostics.cpuUsage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compute Status:</span>
                        <span className="text-emerald-400 font-semibold">Optimized</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs opacity-40">Loading system clocks...</div>
                )}
              </div>
            </div>

            {/* Collection counters detail list */}
            <div className={`rounded-2xl border p-6 shadow-2xl transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
              }`}>
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div>
                  <h3 className="text-base font-semibold">Active Database Indexes</h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-white/45" : "text-slate-450"}`}>
                    Inspect count aggregates on active MongoDB collection structures.
                  </p>
                </div>

                <button
                  onClick={fetchDatabaseAndDiagnostics}
                  disabled={loadingDb}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg border transition ${isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                    }`}
                  title="Force Refresh Connection"
                >
                  <RotateCw className={`h-3.5 w-3.5 ${loadingDb ? "animate-spin" : ""}`} />
                </button>
              </div>

              {dbDetails ? (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-center text-xs">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                    <span className="block opacity-40 text-[10px] uppercase font-bold tracking-wider">Operators</span>
                    <span className="block text-2xl font-bold text-[#a855f7]">{dbDetails.counts.operators}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                    <span className="block opacity-40 text-[10px] uppercase font-bold tracking-wider">Tasks</span>
                    <span className="block text-2xl font-bold text-[#ff8a5b]">{dbDetails.counts.tasks}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                    <span className="block opacity-40 text-[10px] uppercase font-bold tracking-wider">Projects</span>
                    <span className="block text-2xl font-bold text-emerald-400">{dbDetails.counts.projects}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                    <span className="block opacity-40 text-[10px] uppercase font-bold tracking-wider">Lead Emails</span>
                    <span className="block text-2xl font-bold text-indigo-450">{dbDetails.counts.emails}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1 col-span-2 sm:col-span-1">
                    <span className="block opacity-40 text-[10px] uppercase font-bold tracking-wider">Activity Logs</span>
                    <span className="block text-2xl font-bold text-amber-500">{dbDetails.counts.logs}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs opacity-40">Loading collection aggregates...</div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
