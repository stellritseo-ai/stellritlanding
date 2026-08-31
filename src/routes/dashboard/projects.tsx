import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import {
  Plus,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Trash2,
  Edit,
  X,
  Calendar,
  Layers,
  ArrowUpDown,
  CheckCircle,
  Square,
  FolderKanban,
  DollarSign,
  Phone,
  Globe,
  User,
  CreditCard,
  FileText,
  BadgeDollarSign,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
});

interface Project {
  id: string;
  clientName: string;
  projectName?: string;
  email?: string;
  businessName: string;
  salesDate: string;
  ownerName: string;
  domainName: string;
  phoneNumber: string;
  projectCost: number;
  accountSetup: number;
  firstInstallment: number;
  secondInstallment: number;
  thirdInstallment: number;
  hostingFee: number;
  closeBy: string;
  cardDetails: string;
  projectDetails: string;
  isCompleted: boolean;
  color: string; // Gradient preset for visual styling
  createdAt?: string;
  updatedAt?: string;
}

const COLOR_PRESETS = [
  { name: "Purple / Indigo", value: "from-purple-500 to-indigo-500" },
  { name: "Pink / Rose", value: "from-pink-500 to-rose-500" },
  { name: "Amber / Orange", value: "from-amber-500 to-orange-500" },
  { name: "Emerald / Teal", value: "from-emerald-500 to-teal-500" },
  { name: "Blue / Cyan", value: "from-blue-500 to-cyan-500" },
];

import {
  getProjectsFn,
  createProjectFn,
  updateProjectFn,
  deleteProjectFn,
} from "@/lib/dashboard.functions.server";

function parseDateToTime(dateStr?: string): number {
  if (!dateStr || typeof dateStr !== "string") return 0;
  const trimmed = dateStr.trim();
  if (!trimmed) return 0;

  // 1. Standard ISO / YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}/.test(trimmed)) {
    const parts = trimmed.split(/[-/.]/);
    const y = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    const d = Number(parts[2].slice(0, 2));
    const t = new Date(y, m, d).getTime();
    if (!isNaN(t)) return t;
  }

  // 2. Day-Month-Year (DD-MM-YYYY or DD/MM/YYYY)
  if (/^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}/.test(trimmed)) {
    const parts = trimmed.split(/[-/.]/);
    const d = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    const y = Number(parts[2].slice(0, 4));
    const t = new Date(y, m, d).getTime();
    if (!isNaN(t)) return t;
  }

  const parsed = Date.parse(trimmed);
  if (!isNaN(parsed)) return parsed;

  return 0;
}

function ProjectsPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  // State Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"salesDate" | "dueDate" | "progress" | "name">("salesDate");

  // Premium Toast notifications state
  interface ToastItem {
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Selection & Modal visibility
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Form Field States
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [salesDate, setSalesDate] = useState("");
  const [domainName, setDomainName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [projectCost, setProjectCost] = useState<number>(0);
  const [accountSetup, setAccountSetup] = useState<number>(0);
  const [firstInstallment, setFirstInstallment] = useState<number>(0);
  const [secondInstallment, setSecondInstallment] = useState<number>(0);
  const [thirdInstallment, setThirdInstallment] = useState<number>(0);
  const [hostingFee, setHostingFee] = useState<number>(0);
  const [closeBy, setCloseBy] = useState("");
  const [cardDetails, setCardDetails] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [formColor, setFormColor] = useState("from-purple-500 to-indigo-500");

  // Load from database
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectsFn();
      setProjects(data as any);
    } catch (e: any) {
      setError(e.message || "Failed to load project billing details from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Helper Calculations
  const getCollectedAmount = (proj: Project) => {
    return (
      Number(proj.accountSetup || 0) +
      Number(proj.firstInstallment || 0) +
      Number(proj.secondInstallment || 0) +
      Number(proj.thirdInstallment || 0) +
      Number(proj.hostingFee || 0)
    );
  };

  const getProgress = (proj: Project) => {
    if (proj.isCompleted) return 100;
    if (!proj.projectCost || proj.projectCost <= 0) return 0;
    const collected = getCollectedAmount(proj);
    const percent = (collected / proj.projectCost) * 100;
    const rounded = Math.min(Math.round(percent), 100);

    if (rounded === 100) {
      const allInstallmentsPaid =
        Number(proj.firstInstallment || 0) > 0 &&
        Number(proj.secondInstallment || 0) > 0 &&
        Number(proj.thirdInstallment || 0) > 0;
      if (!allInstallmentsPaid) {
        return 95; // Cap at 95% if installments are still unpaid
      }
    }
    return rounded;
  };

  const getPaymentStatus = (proj: Project) => {
    if (proj.isCompleted) return "Completed";
    const collected = getCollectedAmount(proj);
    if (collected === 0) return "Not Started";

    if (collected >= proj.projectCost) {
      const allInstallmentsPaid =
        Number(proj.firstInstallment || 0) > 0 &&
        Number(proj.secondInstallment || 0) > 0 &&
        Number(proj.thirdInstallment || 0) > 0;
      if (allInstallmentsPaid) {
        return "Fully Paid";
      } else {
        return "Partially Paid";
      }
    }

    const progress = getProgress(proj);
    if (progress < 30) return "In Progress";
    return "Partially Paid";
  };

  // Open Form for Creation
  const openCreateForm = () => {
    setEditingProject(null);
    setClientName("");
    setEmail("");
    setBusinessName("");
    setSalesDate(new Date().toISOString().split("T")[0]);
    setDomainName("");
    setPhoneNumber("");
    setProjectCost(0);
    setAccountSetup(0);
    setFirstInstallment(0);
    setSecondInstallment(0);
    setThirdInstallment(0);
    setHostingFee(0);
    setCloseBy("");
    setCardDetails("");
    setProjectDetails("");
    setFormColor("from-purple-500 to-indigo-500");
    setIsFormOpen(true);
  };

  // Open Form for Editing
  const openEditForm = (proj: Project) => {
    setEditingProject(proj);
    setClientName(proj.clientName);
    setEmail(proj.email || "");
    setBusinessName(proj.businessName || "");
    setSalesDate(proj.salesDate);
    setDomainName(proj.domainName);
    setPhoneNumber(proj.phoneNumber);
    setProjectCost(proj.projectCost);
    setAccountSetup(proj.accountSetup);
    setFirstInstallment(proj.firstInstallment);
    setSecondInstallment(proj.secondInstallment);
    setThirdInstallment(proj.thirdInstallment);
    setHostingFee(proj.hostingFee);
    setCloseBy(proj.closeBy);
    setCardDetails(proj.cardDetails);
    setProjectDetails(proj.projectDetails);
    setFormColor(proj.color);
    setIsFormOpen(true);
  };

  // Submit Handler (Create or Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim()) return;

    setLoading(true);
    try {
      const payload = {
        clientName,
        email,
        businessName,
        salesDate,
        domainName,
        phoneNumber,
        projectCost: Number(projectCost || 0),
        accountSetup: Number(accountSetup || 0),
        firstInstallment: Number(firstInstallment || 0),
        secondInstallment: Number(secondInstallment || 0),
        thirdInstallment: Number(thirdInstallment || 0),
        hostingFee: Number(hostingFee || 0),
        closeBy,
        cardDetails,
        projectDetails,
        color: formColor,
      };

      if (editingProject) {
        const updatedProj = await updateProjectFn({
          data: { id: editingProject.id, update: payload }
        });
        setProjects((prev) => prev.map((p) => (p.id === updatedProj.id ? (updatedProj as any) : p)));
        showToast("Project details updated successfully!", "success");
      } else {
        const newProj = await createProjectFn({
          data: payload
        });
        setProjects((prev) => [newProj as any, ...prev]);
        showToast("New project registered successfully!", "success");
      }
      setIsFormOpen(false);
    } catch (err: any) {
      showToast("Failed to save project: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Project Completed Checkbox directly
  const handleToggleCompleted = async (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    try {
      const updatedProj = await updateProjectFn({
        data: { id: projectId, update: { isCompleted: !proj.isCompleted } }
      });
      setProjects((prev) => prev.map((p) => (p.id === projectId ? (updatedProj as any) : p)));
      showToast(updatedProj.isCompleted ? "Project marked as Completed! (100% Progress)" : "Project marked as Active.", "success");
    } catch (err: any) {
      showToast("Failed to toggle project completion: " + err.message, "error");
    }
  };

  // Delete Project Handler
  const handleDeleteProject = async (projectId: string) => {
    setLoading(true);
    try {
      await deleteProjectFn({
        data: { id: projectId }
      });
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }
      showToast("Project record deleted successfully.", "success");
    } catch (err: any) {
      showToast("Failed to delete project: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Selected Project for Detail Panel
  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || null;
  }, [projects, activeProjectId]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((proj) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          proj.clientName.toLowerCase().includes(query) ||
          (proj.projectName || "").toLowerCase().includes(query) ||
          (proj.email || "").toLowerCase().includes(query) ||
          proj.businessName?.toLowerCase().includes(query) ||
          proj.domainName.toLowerCase().includes(query);

        const status = getPaymentStatus(proj);
        const matchesStatus = statusFilter === "All" || status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "salesDate") {
          const timeA = parseDateToTime(a.salesDate) || parseDateToTime(a.createdAt);
          const timeB = parseDateToTime(b.salesDate) || parseDateToTime(b.createdAt);
          if (timeA !== timeB) {
            return timeB - timeA;
          }
          const createA = parseDateToTime(a.createdAt);
          const createB = parseDateToTime(b.createdAt);
          if (createA !== createB) {
            return createB - createA;
          }
          return (b.id || "").localeCompare(a.id || "");
        }
        if (sortBy === "dueDate") {
          const timeA = parseDateToTime(a.closeBy);
          const timeB = parseDateToTime(b.closeBy);
          if (timeA !== 0 && timeB !== 0 && timeA !== timeB) {
            return timeA - timeB;
          }
          return (a.closeBy || "").localeCompare(b.closeBy || "");
        }
        if (sortBy === "progress") {
          return getProgress(b) - getProgress(a);
        }
        if (sortBy === "name") {
          return a.clientName.localeCompare(b.clientName);
        }
        return 0;
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  // Helper styles for statuses
  const getBadgeStyles = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/15 border-emerald-500/20 text-emerald-400";
      case "Fully Paid":
        return "bg-sky-500/15 border-sky-500/20 text-sky-400";
      case "Partially Paid":
        return "bg-indigo-500/15 border-indigo-500/20 text-indigo-400";
      case "In Progress":
        return "bg-amber-500/15 border-amber-500/20 text-amber-400";
      default:
        return "bg-slate-500/15 border-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-8 relative pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Project Payments Hub</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Manage client project contracts, installment records, and execution progress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-[#a855f7] font-semibold mr-2">
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              Syncing...
            </span>
          )}
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg hover:shadow-[#a855f7]/15 transition text-xs font-bold active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create Project Account
          </button>
        </div>
      </div>

      {/* Filter / Sort bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-white/40" : "text-slate-400"}`} />
          <input
            type="text"
            placeholder="Search by client, project, owner or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-10 pl-10 pr-4 border rounded-xl text-xs font-medium transition duration-300 focus:outline-none focus:ring-1 ${isDark
                ? "bg-white/5 border-white/5 text-white placeholder-white/30 focus:border-[#a855f7]/50 focus:ring-[#a855f7]/50"
                : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/50 focus:ring-[#a855f7]/50"
              }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter dropdown */}
          <div className="relative flex items-center">
            <Filter className={`absolute left-3.5 h-3.5 w-3.5 ${isDark ? "text-white/40" : "text-slate-400"}`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`pl-9 pr-8 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark
                  ? "bg-[#12052c]/90 border-white/5 text-white/80 focus:border-[#a855f7]/40"
                  : "bg-white border-slate-200 text-slate-700 focus:border-[#a855f7]/30"
                }`}
            >
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Fully Paid">Fully Paid</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Sorting dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className={`absolute left-3.5 h-3.5 w-3.5 ${isDark ? "text-white/40" : "text-slate-400"}`} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`pl-9 pr-8 py-2.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark
                  ? "bg-[#12052c]/90 border-white/5 text-white/80 focus:border-[#a855f7]/40"
                  : "bg-white border-slate-200 text-slate-700 focus:border-[#a855f7]/30"
                }`}
            >
              <option value="salesDate">Sales Date (Newest First)</option>
              <option value="dueDate">Close By Date</option>
              <option value="progress">Payment Progress</option>
              <option value="name">Client Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List / Table View */}
      {loading && projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#a855f7]" />
          <span className={`text-xs mt-3 ${isDark ? "text-white/50" : "text-slate-500"}`}>Loading MongoDB billing database records...</span>
        </div>
      ) : error ? (
        <div className={`p-6 border rounded-2xl text-center max-w-md mx-auto ${isDark ? "bg-red-500/10 border-red-500/20 text-red-300" : "bg-red-50 border-red-200 text-red-700"
          }`}>
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <h4 className="font-semibold text-sm">Database Sync Error</h4>
          <p className="text-xs mt-1">{error}</p>
          <button onClick={fetchProjects} className="mt-4 px-4 py-1.5 bg-[#a855f7] text-white text-xs font-bold rounded-lg hover:bg-[#9333ea] transition">
            Retry Connection
          </button>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="space-y-4">
          {/* Table for Desktop/Tablet */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-white/5 shadow-lg">
            <table className={`w-full border-collapse text-left text-xs ${isDark ? "text-white bg-[#12052c]/30" : "text-slate-700 bg-white"
              }`}>
              <thead>
                <tr className={`border-b font-mono font-bold tracking-wider uppercase ${isDark ? "border-white/5 text-white/40 bg-white/[0.01]" : "border-slate-100 text-slate-400 bg-slate-50/50"
                  }`}>
                  <th className="px-6 py-4">Client & Project</th>
                  <th className="px-6 py-4">Sales Date</th>
                  <th className="px-6 py-4">Domain Info</th>
                  <th className="px-6 py-4">Financial Overview</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                {filteredProjects.map((proj) => {
                  const progress = getProgress(proj);
                  const status = getPaymentStatus(proj);
                  const collected = getCollectedAmount(proj);
                  return (
                    <tr
                      key={proj.id}
                      onClick={() => setActiveProjectId(proj.id)}
                      className={`group hover:bg-white/[0.02] transition cursor-pointer ${activeProjectId === proj.id
                          ? isDark ? "bg-[#a855f7]/10" : "bg-[#a855f7]/5"
                          : ""
                        }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-semibold block text-sm group-hover:text-[#a855f7] transition">
                            {proj.clientName}
                          </span>
                          {proj.businessName && (
                            <span className="text-[12px] block opacity-90 font-medium mt-0.5">
                              {proj.businessName}
                            </span>
                          )}
                          {proj.projectName && (
                            <span className="text-[11px] block opacity-75 font-medium mt-0.5">
                              {proj.projectName}
                            </span>
                          )}
                          <span className="text-[10px] block opacity-50 font-medium font-mono mt-0.5">
                            {proj.email || "No Email"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <span className="font-semibold block">{proj.salesDate || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium opacity-80">
                        {proj.domainName ? (
                          <a
                            href={`https://${proj.domainName}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline text-[#a855f7]"
                          >
                            {proj.domainName}
                          </a>
                        ) : (
                          "No Domain"
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono">
                        <div className="font-semibold">
                          ${collected.toLocaleString()} / ${proj.projectCost.toLocaleString()}
                        </div>
                        <span className="text-[10px] opacity-40">Total Budget</span>
                      </td>
                      <td className="px-6 py-4 max-w-[150px]">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-semibold opacity-70">
                            <span>Paid</span>
                            <span>{progress}%</span>
                          </div>
                          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                            <div
                              className={`h-full bg-gradient-to-r ${proj.color} rounded-full`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getBadgeStyles(status)}`}>
                            {status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(proj)}
                            className={`h-7 w-7 rounded-lg flex items-center justify-center border transition ${isDark
                                ? "border-white/5 hover:border-white/10 text-white/50 hover:text-white bg-white/5"
                                : "border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 bg-slate-50"
                              }`}
                            title="Edit Details"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setProjectToDelete(proj)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center border border-red-500/10 bg-red-500/5 hover:bg-red-500/15 text-red-400 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setActiveProjectId(proj.id)}
                            className={`h-7 px-2.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1 transition ${isDark ? "bg-white/5 border-white/5 hover:border-white/10" : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
                              }`}
                          >
                            Details
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards Layout for Mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredProjects.map((proj) => {
              const progress = getProgress(proj);
              const status = getPaymentStatus(proj);
              const collected = getCollectedAmount(proj);
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={`rounded-2xl border p-5 transition relative ${isDark
                      ? "bg-[#12052c]/65 border-white/5 text-white"
                      : "bg-white border-slate-200 shadow-sm text-slate-800"
                    } ${activeProjectId === proj.id ? "border-[#a855f7]/40 ring-1 ring-[#a855f7]/40" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider block opacity-50">{proj.clientName}</span>
                      {proj.businessName && (
                        <h4 className="font-bold text-sm mt-0.5 text-[#a855f7]">{proj.businessName}</h4>
                      )}
                      {proj.projectName && (
                        <h4 className="font-bold text-[13px] mt-0.5">{proj.projectName}</h4>
                      )}
                      <span className="text-[10px] block opacity-50 font-medium font-mono mt-0.5">{proj.email || "No Email"}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getBadgeStyles(status)}`}>
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 py-3 border-y border-white/5 text-[11px]">
                    <div>
                      <span className="opacity-40 block">Cost / Collected</span>
                      <span className="font-mono font-semibold">${proj.projectCost.toLocaleString()} / ${collected.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="opacity-40 block">Sales Date</span>
                      <span className="font-semibold truncate block">{proj.salesDate || "N/A"}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] opacity-60">
                      <span>Payment Progress</span>
                      <span className="font-mono font-semibold">{progress}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                      <div
                        className={`h-full bg-gradient-to-r ${proj.color} rounded-full`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEditForm(proj)}
                      className={`h-8 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${isDark ? "border-white/5 bg-white/5 text-white/70" : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setActiveProjectId(proj.id)}
                      className={`h-8 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r ${proj.color} text-white shadow-md`}
                    >
                      Details
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center text-center p-16 border border-dashed rounded-2xl ${isDark ? "border-white/10 text-white/40" : "border-slate-200 text-slate-400"
          }`}>
          <FolderKanban className="h-10 w-10 mb-3 text-slate-400" />
          <h3 className="font-semibold text-sm">No Client Project Accounts</h3>
          <p className="text-xs mt-1 max-w-xs">
            Try adjusting your search criteria, selecting another filter, or create a brand new billing setup.
          </p>
        </div>
      )}

      {/* Right side Detail Panel/Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProjectId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 24, stiffness: 200 }}
                className={`w-screen max-w-lg border-l flex flex-col backdrop-blur-xl h-screen ${isDark
                    ? "bg-[#12052c]/95 border-white/10 text-white shadow-[0_0_50px_rgba(0,0,0,0.6)]"
                    : "bg-white border-slate-200 text-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.1)]"
                  }`}
              >
                {/* Drawer Header */}
                <div className={`p-6 border-b flex items-center justify-between ${isDark ? "border-white/5" : "border-slate-100"
                  }`}>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest block opacity-50">
                      {selectedProject.clientName}
                    </span>
                    <h3 className="font-serif text-lg font-bold truncate max-w-[280px] mt-0.5 font-mono">
                      {selectedProject.email || selectedProject.projectName || "No Email"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveProjectId(null)}
                    className={`h-9 w-9 rounded-lg flex items-center justify-center border transition ${isDark ? "border-white/5 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-100 text-slate-400"
                      }`}
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Drawer Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                  {/* Status & Checkbox Bar */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${isDark ? "bg-white/[0.02] border-white/5" : "bg-slate-50 border-slate-100"
                    }`}>
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider block opacity-40 mb-1">
                        Current Status
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getBadgeStyles(getPaymentStatus(selectedProject))
                        }`}>
                        {getPaymentStatus(selectedProject)}
                      </span>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                          Project Completed
                        </span>
                        <span className="text-[9px] opacity-40 block">Force 100% progress</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleCompleted(selectedProject.id)}
                        className={`h-6 w-6 rounded-lg border flex items-center justify-center transition ${selectedProject.isCompleted
                            ? "bg-emerald-500 border-emerald-600 text-white"
                            : isDark
                              ? "border-white/20 bg-white/5 group-hover:border-white/40"
                              : "border-slate-300 bg-white group-hover:border-slate-400"
                          }`}
                      >
                        {selectedProject.isCompleted && <CheckCircle className="h-4.5 w-4.5" />}
                      </button>
                    </label>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-45">
                        Visual Progress
                      </span>
                      <span className="text-sm font-mono font-bold text-[#a855f7]">
                        {getProgress(selectedProject)}% Completed
                      </span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgress(selectedProject)}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${selectedProject.color} rounded-full`}
                      />
                    </div>
                  </div>

                  {/* 1. Account Details Grid */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                      General Information
                    </h4>
                    <div className={`grid grid-cols-2 gap-4 p-4 rounded-2xl border text-xs leading-relaxed ${isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50/50 border-slate-100"
                      }`}>
                      <div>
                        <span className="block opacity-40 font-medium">Sales Date</span>
                        <span className="font-semibold flex items-center gap-1.5 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-[#a855f7]" />
                          {selectedProject.salesDate || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="block opacity-40 font-medium">Email Address</span>
                        <span className="font-semibold font-mono block mt-0.5 text-xs text-[#a855f7] truncate" title={selectedProject.email}>
                          {selectedProject.email || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="block opacity-40 font-medium">Close By</span>
                        <span className="font-semibold flex items-center gap-1.5 mt-0.5">
                          <User className="h-3.5 w-3.5 text-[#ff8a5b]" />
                          {selectedProject.closeBy || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="block opacity-40 font-medium">Phone Number</span>
                        <span className="font-semibold flex items-center gap-1.5 mt-0.5">
                          <Phone className="h-3.5 w-3.5 opacity-60" />
                          {selectedProject.phoneNumber || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="block opacity-40 font-medium">Business Name</span>
                        <span className="font-semibold flex items-center gap-1.5 mt-0.5">
                          <Layers className="h-3.5 w-3.5 text-[#a855f7]" />
                          {selectedProject.businessName || selectedProject.clientName || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="block opacity-40 font-medium">Domain Name</span>
                        <span className="font-semibold font-mono block mt-0.5 text-xs text-[#a855f7]">
                          <Globe className="h-3.5 w-3.5 inline-block mr-1.5 opacity-60" />
                          {selectedProject.domainName ? (
                            <a href={`https://${selectedProject.domainName}`} target="_blank" rel="noreferrer" className="hover:underline">
                              {selectedProject.domainName}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Project Details / Scope */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Project Details & Scope
                    </h4>
                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50/50 border-slate-100"
                      }`}>
                      <p className="whitespace-pre-wrap">{selectedProject.projectDetails || "No project description provided."}</p>
                    </div>
                  </div>

                  {/* 3. Payment Installments Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        Financial ledger
                      </h4>
                      <span className="text-[10px] font-mono opacity-50">
                        Collected: ${getCollectedAmount(selectedProject).toLocaleString()}
                      </span>
                    </div>

                    <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50/50 border-slate-100"
                      }`}>
                      {/* Cost Row */}
                      <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                        <span className="font-semibold flex items-center gap-1.5">
                          <BadgeDollarSign className="h-4 w-4 text-emerald-400" />
                          Project Total Cost
                        </span>
                        <span className="font-mono font-bold text-base text-emerald-400">
                          ${selectedProject.projectCost.toLocaleString()}
                        </span>
                      </div>

                      {/* Payment items */}
                      <div className="space-y-2.5 text-xs font-mono px-1">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="opacity-50">Account Setup Fee</span>
                          <span className="font-bold text-sm text-slate-200">${selectedProject.accountSetup.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="opacity-50">1st Installment</span>
                          <span className="font-bold text-sm text-slate-200">${selectedProject.firstInstallment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="opacity-50">2nd Installment</span>
                          <span className="font-bold text-sm text-slate-200">${selectedProject.secondInstallment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="opacity-50">3rd Installment</span>
                          <span className="font-bold text-sm text-slate-200">${selectedProject.thirdInstallment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="opacity-50">Hosting & License Fee</span>
                          <span className="font-bold text-sm text-slate-200">${selectedProject.hostingFee.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="pt-3 border-t border-white/5 text-xs flex flex-col gap-2">
                        <span className="opacity-40 flex items-center gap-1.5 font-semibold">
                          <CreditCard className="h-4 w-4" /> Card Billing Details (Encrypted)
                        </span>
                        <div className={`p-3.5 rounded-xl border font-mono whitespace-pre-wrap ${isDark ? "bg-[#180d32] border-white/5 text-white/95" : "bg-white border-slate-200 text-slate-800 shadow-sm"
                          }`}>
                          {selectedProject.cardDetails || "None"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className={`p-6 border-t flex items-center justify-between ${isDark ? "border-white/5" : "border-slate-100"
                  }`}>
                  <button
                    onClick={() => openEditForm(selectedProject)}
                    className={`inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border text-xs font-bold transition ${isDark
                        ? "border-white/5 bg-white/5 text-white hover:bg-white/10"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                  >
                    <Edit className="h-4 w-4" />
                    Modify Ledger / Info
                  </button>

                  <button
                    onClick={() => setProjectToDelete(selectedProject)}
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Create / Edit Overlay Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Background Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-2xl rounded-2xl border p-6 shadow-2xl z-10 backdrop-blur-xl overflow-y-auto max-h-[90vh] ${isDark
                  ? "bg-[#12052c]/95 border-white/10 text-white shadow-purple-950/20"
                  : "bg-white border-slate-200 text-slate-800"
                }`}
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className={`absolute right-4 top-4 h-8 w-8 rounded-lg flex items-center justify-center border transition ${isDark ? "border-white/5 hover:bg-white/5 text-white/50" : "border-slate-200 hover:bg-slate-100 text-slate-400"
                  }`}
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="flex items-center gap-2.5 mb-6">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${editingProject
                    ? "bg-amber-500/15 border-amber-500/20 text-amber-400"
                    : "bg-purple-500/15 border-purple-500/20 text-purple-400"
                  }`}>
                  <FolderKanban className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold">
                    {editingProject ? "Update Project Ledger" : "New Billing Account Setup"}
                  </h3>
                  <p className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
                    {editingProject ? "Modify contract terms and recorded payments." : "Register client account budget metrics."}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-5">
                {/* 1. Project Basic Fields */}
                <div className="space-y-3">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest opacity-40">
                    Client & Scope Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        Client / Company Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Harmony Care LLC"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        Business Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Harmony Care"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="e.g. client@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70 font-mono">
                        Domain Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. harmonycareportal.com"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +1 (317) 555-0199"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        Card Details File
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter card details, expiration, CVV, billing address..."
                        value={cardDetails}
                        onChange={(e) => setCardDetails(e.target.value)}
                        className={`w-full p-3 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition resize-none ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        Sales Date
                      </label>
                      <input
                        type="date"
                        value={salesDate}
                        onChange={(e) => setSalesDate(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-[#12052c] border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        Close By
                      </label>
                      <input
                        type="text"
                        placeholder="Enter target date or agent name..."
                        value={closeBy}
                        onChange={(e) => setCloseBy(e.target.value)}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-[#12052c] border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Scope Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70 font-semibold">
                    Project Scope / Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter comprehensive description..."
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    className={`w-full p-3 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition resize-none ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                  />
                </div>

                {/* 3. Financial Installments Ledger */}
                <div className="space-y-3">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest opacity-40">
                    Payment Ledger Inputs ($ USD)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1 col-span-2 md:col-span-3 pb-2 border-b border-white/5">
                      <label className="text-[10px] font-bold uppercase tracking-wider block text-emerald-400">
                        Project Total Cost *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400 opacity-80" />
                        <input
                          required
                          type="number"
                          min={0}
                          placeholder="12000"
                          value={projectCost || ""}
                          onChange={(e) => setProjectCost(Number(e.target.value || 0))}
                          className={`w-full h-10 pl-9 pr-4 border rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark
                              ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50"
                              : "bg-slate-50 border-slate-200 text-slate-800"
                            }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        Account Setup Paid
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={accountSetup || ""}
                        onChange={(e) => setAccountSetup(Number(e.target.value || 0))}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        1st Installment Paid
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={firstInstallment || ""}
                        onChange={(e) => setFirstInstallment(Number(e.target.value || 0))}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        2nd Installment Paid
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={secondInstallment || ""}
                        onChange={(e) => setSecondInstallment(Number(e.target.value || 0))}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        3rd Installment Paid
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={thirdInstallment || ""}
                        onChange={(e) => setThirdInstallment(Number(e.target.value || 0))}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70 font-semibold">
                        Hosting & License Paid
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={hostingFee || ""}
                        onChange={(e) => setHostingFee(Number(e.target.value || 0))}
                        className={`w-full h-10 px-3.5 border rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                          }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Color Schemes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                    Visual Accent Palette
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setFormColor(preset.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-extrabold transition ${formColor === preset.value
                            ? "border-[#a855f7] bg-[#a855f7]/10 text-white"
                            : isDark
                              ? "border-white/5 bg-white/5 text-white/50 hover:border-white/10"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                          }`}
                      >
                        <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${preset.value}`} />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className={`px-5 py-2.5 rounded-full text-xs font-semibold border transition ${isDark ? "border-white/5 bg-white/5 text-white/70 hover:bg-white/10" : "border-slate-250 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:opacity-90 active:scale-[0.98] transition shadow-lg"
                  >
                    {editingProject ? "Update Ledger" : "Create Billing File"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Confirm Delete Modal */}
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProjectToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl z-10 backdrop-blur-xl ${isDark
                  ? "bg-[#12052c]/95 border-white/10 text-white shadow-red-950/10"
                  : "bg-white border-slate-200 text-slate-800 shadow-slate-400/20"
                }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4 animate-pulse">
                  <Trash2 className="h-6 w-6" />
                </div>

                <h3 className="font-serif text-base font-bold">Delete Project Record</h3>
                <p className={`text-xs mt-2 leading-relaxed ${isDark ? "text-white/60" : "text-slate-500"}`}>
                  Are you sure you want to delete <span className="font-semibold text-red-400">"{projectToDelete.email || projectToDelete.projectName || "No Email"}"</span> and its payment history permanently? This action is irreversible.
                </p>

                <div className="flex items-center gap-3 w-full mt-6">
                  <button
                    onClick={() => setProjectToDelete(null)}
                    className={`flex-1 py-2.5 rounded-full text-xs font-semibold border transition ${isDark ? "border-white/5 bg-white/5 text-white/70 hover:bg-white/10" : "border-slate-250 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteProject(projectToDelete.id);
                      setProjectToDelete(null);
                    }}
                    className="flex-1 py-2.5 rounded-full text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/10 transition active:scale-[0.98]"
                  >
                    Delete Record
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Toast Notifications Stack */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const isSuccess = t.type === "success";
            const isError = t.type === "error";
            const isWarning = t.type === "warning";
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all text-xs font-semibold ${isSuccess
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 shadow-emerald-950/10"
                    : isError
                      ? "bg-red-500/10 border-red-500/20 text-red-300 shadow-red-950/10"
                      : isWarning
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-300 shadow-amber-950/10"
                        : "bg-white/10 dark:bg-[#12052c]/90 border-white/10 dark:border-white/5 text-slate-200 dark:text-white/80 shadow-slate-950/20"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {isSuccess && <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />}
                  {isError && <AlertTriangle className="h-4.5 w-4.5 text-red-400 animate-bounce" />}
                  {isWarning && <AlertTriangle className="h-4.5 w-4.5 text-amber-400" />}
                  {!isSuccess && !isError && !isWarning && <FolderKanban className="h-4.5 w-4.5 text-purple-400" />}
                  <span className="leading-snug">{t.message}</span>
                </div>
                <button
                  onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                  className="h-5 w-5 flex items-center justify-center rounded-lg opacity-60 hover:opacity-100 hover:bg-white/5 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
