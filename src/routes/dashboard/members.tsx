import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState, useMemo, useEffect, useCallback } from "react";
import { UserPlus, Shield, Mail, Check, X, Search, MoreVertical, Eye, EyeOff, Key, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getOperatorsFn,
  createOperatorFn,
  updateOperatorStatusFn,
  deleteOperatorFn
} from "@/lib/dashboard.functions.server";
import { ConfirmModal } from "@/components/ConfirmModal";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/members")({
  component: MembersPage,
});

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Supervisor" | "Manager" | "Developer" | "Viewer";
  status: "Active" | "Inactive";
  joinedDate: string;
  username?: string;
  password?: string;
}

function MembersPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  // Operator Data State
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User Role State of logged-in user
  const [currentUserRole, setCurrentUserRole] = useState<string>("Viewer");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("stellr_admin_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.role) {
            setCurrentUserRole(parsed.role);
          }
        } catch { }
      }
    }
  }, []);

  // Form State
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Member["role"]>("Developer");
  const [formPasswordVisible, setFormPasswordVisible] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // Deletion confirm modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("All");

  const fetchMembers = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const data = await getOperatorsFn();
      setMembers(data as Member[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load directory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole !== "Super Admin") {
      toast.error("Access Denied: Only Super Admins can register new members.");
      return;
    }
    if (!name.trim() || !email.trim() || !username.trim() || !password.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      const response = await createOperatorFn({
        data: {
          name: name.trim(),
          email: email.trim(),
          username: username.toLowerCase().trim(),
          password: password.trim(),
          role,
          status: "Active",
          joinedDate: new Date().toISOString().split("T")[0],
        }
      });

      setMembers((prev) => [response as Member, ...prev]);
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("Developer");
      setAddFormOpen(false);
      setFormPasswordVisible(false);
      toast.success("Member registered successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add member");
    }
  };

  const toggleMemberStatus = async (id: string) => {
    if (currentUserRole !== "Super Admin") {
      toast.error("Access Denied: Only Super Admins can toggle status.");
      return;
    }
    const member = members.find((m) => m.id === id);
    if (!member) return;
    const nextStatus = member.status === "Active" ? "Inactive" : "Active";

    // Optimistic UI update
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
    );

    try {
      await updateOperatorStatusFn({ data: { id, status: nextStatus } });
      toast.success(`Member status updated to ${nextStatus}`);
    } catch (err) {
      // Revert
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: member.status } : m))
      );
      toast.error("Failed to update status");
    }
  };

  const deleteMember = async () => {
    if (currentUserRole !== "Super Admin") {
      toast.error("Access Denied: Only Super Admins can revoke credentials.");
      return;
    }
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      await deleteOperatorFn({ data: { id: confirmDeleteId } });
      setMembers((prev) => prev.filter((m) => m.id !== confirmDeleteId));
      toast.success("Membership revoked successfully!");
    } catch (err) {
      toast.error("Failed to revoke membership");
    } finally {
      setConfirmDeleteId(null);
      setDeleting(false);
    }
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.username && m.username.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRole = selectedRoleFilter === "All" || m.role === selectedRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, selectedRoleFilter]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#a855f7]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm text-red-400">{error}</p>
        <button onClick={() => fetchMembers(true)} className="text-xs text-[#a855f7] underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6 ${isDark ? "border-white/5" : "border-slate-200/60"
        }`}>
        <div>
          <h1 className={`font-serif text-3xl font-bold tracking-tight md:text-4xl ${isDark ? "text-white" : "text-slate-800"}`}>
            Add Member & Directory
          </h1>
          <p className={`text-sm mt-1 max-w-xl leading-relaxed ${isDark ? "text-white/45" : "text-slate-500"}`}>
            Manage organizational seats, assign client scope operations, and configure credentials.
          </p>
        </div>

        {currentUserRole === "Super Admin" && (
          <button
            onClick={() => setAddFormOpen(!addFormOpen)}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition duration-300 text-xs font-bold tracking-wide active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" />
            Add Member
          </button>
        )}
      </div>

      {/* Add Member Form Expandable Panel */}
      <AnimatePresence>
        {addFormOpen && currentUserRole === "Super Admin" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className={`rounded-2xl border p-6 mb-8 transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 shadow-2xl text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
              }`}>
              <h3 className={`text-base font-semibold flex items-center gap-2 border-b pb-3 mb-5 ${isDark ? "border-white/5" : "border-slate-100"
                }`}>
                <UserPlus className="h-4.5 w-4.5 text-[#a855f7]" />
                New Member Registration
              </h3>

              <form onSubmit={handleAddMember} className="space-y-6">
                {/* Row 1: Identity & Credentials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Neeson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full h-10 px-3.5 rounded-xl border text-sm transition duration-300 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/20" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                        }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. member@stellrit.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full h-10 px-3.5 rounded-xl border text-sm transition duration-300 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/20" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                        }`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Username</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. liam_neeson"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full h-10 px-3.5 rounded-xl border text-sm transition duration-300 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/20" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                        }`}
                    />
                  </div>
                </div>

                {/* Row 2: Password, Role & Confirm */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Password</label>
                    <div className="relative">
                      <input
                        type={formPasswordVisible ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full h-10 pl-3.5 pr-10 rounded-xl border text-sm transition duration-300 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50 ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/20" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setFormPasswordVisible(!formPasswordVisible)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition ${isDark ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        {formPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Access Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as Member["role"])}
                      className={`w-full h-10 px-3 rounded-xl border text-sm transition duration-300 focus:outline-none focus:border-[#a855f7]/50 ${isDark ? "bg-[#12052c] border-white/10 text-white" : "bg-white border-slate-200 text-slate-700"
                        }`}
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Manager">Manager</option>
                      <option value="Developer">Developer</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="h-10 inline-flex items-center justify-center gap-1.5 px-5 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98] w-full"
                  >
                    <Check className="h-4 w-4" />
                    Confirm Add Member
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Directory Table Grid */}
      <div className={`rounded-2xl border p-6 shadow-2xl flex flex-col transition duration-300 ${isDark ? "bg-[#12052c]/65 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "bg-white border-slate-200/60 shadow-sm"
        }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>Active Members</h3>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/45" : "text-slate-450"}`}>
              Directory of accounts, roles, and credentials.
            </p>
          </div>

          {/* Quick Filter */}
          <div className="flex gap-2.5 items-center">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isDark ? "text-white/30" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Filter members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`h-8 pl-8 pr-3.5 w-44 rounded-lg border text-[11px] transition duration-300 ${isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-[#a855f7]/40"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/40"
                  }`}
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className={`h-8 px-2 rounded-lg border text-[11px] transition duration-300 ${isDark ? "bg-[#12052c] border-white/10 text-white/70" : "bg-white border-slate-200 text-slate-655"
                }`}
            >
              <option value="All">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b uppercase font-semibold tracking-widest text-[10px] ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"
                  }`}>
                  <th className="pb-3 pr-4">Identity Details</th>
                  <th className="pb-3 px-4">Access Role</th>
                  <th className="pb-3 px-4">Joined Date</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-white/[0.04]" : "divide-slate-100"}`}>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-black/[0.01] transition-colors group"
                    >
                      {/* Name / Email / Username */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#a855f7] to-[#ff8a5b] flex items-center justify-center font-bold text-xs text-white shadow-inner">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className={`font-semibold transition duration-300 group-hover:text-[#a855f7] ${isDark ? "text-white" : "text-slate-800"}`}>
                              {member.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span className={`text-[10px] font-semibold ${isDark ? "text-[#a855f7]/80" : "text-[#a855f7]"}`}>
                                @{member.username || member.name.toLowerCase().replace(" ", "_")}
                              </span>
                              <span className={`text-[10px] font-mono ${isDark ? "text-white/10" : "text-slate-350"}`}>|</span>
                              <span className={`text-[10px] font-mono ${isDark ? "text-white/40" : "text-slate-450"}`}>
                                {member.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role tag */}
                      <td className="py-4 px-4 font-medium">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/80">
                          <Shield className="h-3 w-3 text-[#a855f7]" />
                          {member.role}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className={`py-4 px-4 font-mono text-[10px] ${isDark ? "text-white/50" : "text-slate-450"}`}>
                        {member.joinedDate}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleMemberStatus(member.id)}
                          disabled={currentUserRole !== "Super Admin"}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition duration-300 ${currentUserRole !== "Super Admin" ? "cursor-not-allowed" : ""
                            } ${member.status === "Active"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]"
                              : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${member.status === "Active"
                                ? "bg-emerald-400 animate-pulse"
                                : "bg-white/30"
                              }`}
                          />
                          {member.status}
                        </button>
                      </td>

                      {/* Actions & Credentials Reveal */}
                      <td className="py-4 pl-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {member.password && currentUserRole === "Super Admin" && (
                            <div className="relative">
                              <button
                                onClick={() => {
                                  setShowPasswordMap((prev) => ({
                                    ...prev,
                                    [member.id]: !prev[member.id],
                                  }));
                                }}
                                className={`h-8 w-8 inline-flex items-center justify-center rounded-lg border transition ${showPasswordMap[member.id]
                                    ? "bg-[#a855f7]/15 border-[#a855f7]/30 text-[#a855f7]"
                                    : isDark
                                      ? "bg-white/5 border-white/5 text-white/40 hover:text-white"
                                      : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-700"
                                  }`}
                                title="View Credentials"
                              >
                                <Key className="h-4 w-4" />
                              </button>

                              <AnimatePresence>
                                {showPasswordMap[member.id] && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    className={`absolute right-0 bottom-10 z-10 w-52 p-3.5 rounded-xl border shadow-2xl text-left space-y-1.5 ${isDark ? "bg-[#12052c] border-white/10 text-white shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-white border-slate-200 text-slate-800"
                                      }`}
                                  >
                                    <div className="text-[9px] uppercase tracking-widest text-[#a855f7] font-bold">
                                      Member Credentials
                                    </div>
                                    <div className={`text-[10px] font-semibold truncate ${isDark ? "text-white/90" : "text-slate-800"}`}>
                                      User: @{member.username}
                                    </div>
                                    <div className={`text-[10px] font-mono p-1 rounded select-text truncate ${isDark ? "bg-white/5 text-slate-300" : "bg-slate-50 text-slate-700 border border-slate-150"
                                      }`}>
                                      Pass: {member.password}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}

                          {currentUserRole === "Super Admin" && (
                            <button
                              onClick={() => setConfirmDeleteId(member.id)}
                              className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-red-500/15 text-white/40 hover:text-red-400 transition"
                              title="Revoke Membership"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}

                          <button className={`h-8 w-8 inline-flex items-center justify-center rounded-lg transition ${isDark ? "hover:bg-white/10 text-white/40 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
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
                      <span>No members match your filter criteria.</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        title="Revoke Membership"
        message="Are you sure you want to revoke membership and credentials for this operator? They will immediately lose access to the administration dashboard."
        confirmText={deleting ? "Revoking..." : "Revoke Access"}
        cancelText="Cancel"
        type="danger"
        onConfirm={deleteMember}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
