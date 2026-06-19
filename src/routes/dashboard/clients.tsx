import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState, useEffect, useMemo } from "react";
import {
  Users2,
  ShieldCheck,
  Mail,
  MapPin,
  Plus,
  Briefcase,
  Phone,
  Calendar,
  DollarSign,
  ChevronRight,
  X,
  Search,
  Building,
  ArrowRight,
  TrendingUp,
  Award,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/dashboard/clients")({
  component: ClientsPage,
});

interface Project {
  id: string;
  clientName: string;
  projectName: string;
  businessName: string;
  salesDate: string;
  ownerName: string;
  domainName: string;
  phoneNumber: string;
  projectCost: number;
  isCompleted: boolean;
  color: string;
  createdAt: string;
}

interface Client {
  id: string;
  company: string;
  sector: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  location: string;
  status: "Active" | "Completed" | "Onboarding";
  salesDate: string;
  monthYear: string;
  totalValue: number;
  projects: {
    id: string;
    projectName: string;
    projectCost: number;
    ownerName: string;
    domainName: string;
    isCompleted: boolean;
    color: string;
    salesDate: string;
  }[];
}

const API_URL = import.meta.env.VITE_CHAT_API_URL ?? "http://localhost:3001";
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? "stellr-admin-dev-2024";

async function adminFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": ADMIN_TOKEN,
    },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

// Fallback seed projects if DB has none
const SEED_PROJECTS: Project[] = [
  {
    id: "p1",
    clientName: "Jiten Sony",
    projectName: "Harmony Care Slicing",
    businessName: "Harmony Residential Care",
    salesDate: "2026-06-15",
    ownerName: "Sarah Jenkins",
    domainName: "harmonycare.org",
    phoneNumber: "1-800-555-0199",
    projectCost: 15000,
    isCompleted: false,
    color: "from-purple-500 to-indigo-500",
    createdAt: new Date().toISOString()
  },
  {
    id: "p2",
    clientName: "David Chen",
    projectName: "TechNova Mobile App",
    businessName: "TechNova Systems",
    salesDate: "2026-06-10",
    ownerName: "Jiten Sony",
    domainName: "technova.io",
    phoneNumber: "1-800-555-0144",
    projectCost: 24000,
    isCompleted: false,
    color: "from-pink-500 to-rose-500",
    createdAt: new Date().toISOString()
  },
  {
    id: "p3",
    clientName: "Sarah Jenkins",
    projectName: "Nexus Brands Portal",
    businessName: "Nexus Group",
    salesDate: "2026-05-18",
    ownerName: "Sarah Jenkins",
    domainName: "nexusbrands.com",
    phoneNumber: "1-800-555-0188",
    projectCost: 12500,
    isCompleted: true,
    color: "from-emerald-500 to-teal-500",
    createdAt: new Date().toISOString()
  },
  {
    id: "p4",
    clientName: "Alex Rivera",
    projectName: "Rivera Real Estate Design",
    businessName: "Rivera Designs",
    salesDate: "2026-04-05",
    ownerName: "Alex Rivera",
    domainName: "riveradesign.co",
    phoneNumber: "1-800-555-0122",
    projectCost: 8000,
    isCompleted: false,
    color: "from-cyan-500 to-blue-500",
    createdAt: new Date().toISOString()
  }
];

function ClientsPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  // State Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Load projects database & group into client entities
  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Project[]>("/api/admin/projects");
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(SEED_PROJECTS);
      }
    } catch (e: any) {
      console.warn("Failed to load projects from DB, falling back to seeds:", e);
      setProjects(SEED_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Map company names to client groups
  const clients: Client[] = useMemo(() => {
    const clientsMap: Record<string, Client> = {};

    projects.forEach((proj) => {
      const companyKey = (proj.businessName || proj.clientName).trim();
      const projectSalesDate = proj.salesDate || new Date(proj.createdAt || Date.now()).toISOString().split("T")[0];
      
      const getMonthYearStr = (dateStr: string) => {
        const parts = dateStr.split("-");
        if (parts.length < 2) return "Unknown Month";
        const year = parts[0];
        const monthNum = parseInt(parts[1], 10);
        const date = new Date(Number(year), monthNum - 1, 1);
        if (isNaN(date.getTime())) return "Unknown Month";
        return date.toLocaleString("default", { month: "long", year: "numeric" });
      };

      const monthYear = getMonthYearStr(projectSalesDate);

      // Guess sector based on company name
      const guessSector = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes("care") || lower.includes("health") || lower.includes("med")) return "Healthcare";
        if (lower.includes("tech") || lower.includes("sys") || lower.includes("soft")) return "Technology";
        if (lower.includes("design") || lower.includes("real") || lower.includes("prop")) return "Real Estate";
        if (lower.includes("brand") || lower.includes("commerce") || lower.includes("shop")) return "E-Commerce";
        return "Corporate Services";
      };

      if (!clientsMap[companyKey]) {
        clientsMap[companyKey] = {
          id: `c-${companyKey.replace(/\s+/g, "-").toLowerCase()}`,
          company: companyKey,
          sector: guessSector(companyKey),
          contactName: proj.clientName,
          phoneNumber: proj.phoneNumber || "N/A",
          email: `${proj.clientName.toLowerCase().replace(/\s+/g, "")}@stellr-client.io`,
          location: "Onboarding Portal",
          status: proj.isCompleted ? "Completed" : "Active",
          salesDate: projectSalesDate,
          monthYear,
          totalValue: 0,
          projects: []
        };
      }

      const clientEntry = clientsMap[companyKey];
      clientEntry.totalValue += Number(proj.projectCost || 0);

      // Update client status: if any project is active, client is Active. If all completed, Completed.
      if (!proj.isCompleted) {
        clientEntry.status = "Active";
      }

      clientEntry.projects.push({
        id: proj.id,
        projectName: proj.projectName,
        projectCost: proj.projectCost,
        ownerName: proj.ownerName,
        domainName: proj.domainName,
        isCompleted: proj.isCompleted,
        color: proj.color,
        salesDate: projectSalesDate
      });
    });

    return Object.values(clientsMap).sort((a, b) => b.salesDate.localeCompare(a.salesDate));
  }, [projects]);

  // Aggregate Months List
  const onboardingMonths = useMemo(() => {
    const months = new Set(clients.map((c) => c.monthYear));
    return Array.from(months).sort((a, b) => {
      // Sort months chronologically descending
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
  }, [clients]);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sector.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMonth = selectedMonth === "All" || c.monthYear === selectedMonth;
      return matchesSearch && matchesMonth;
    });
  }, [clients, searchQuery, selectedMonth]);

  // Selected client details for slide drawer
  const selectedClient = useMemo(() => {
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  // Summary Metrics Widgets
  const metrics = useMemo(() => {
    const totalClientsCount = clients.length;
    const activeClientsCount = clients.filter((c) => c.status === "Active").length;
    const totalContractValue = clients.reduce((acc, c) => acc + c.totalValue, 0);
    const onboardingClientsCount = clients.filter((c) => {
      // onboarded in the current month (or June 2026 for demo purpose)
      return c.monthYear === "June 2026";
    }).length;

    return {
      total: totalClientsCount,
      active: activeClientsCount,
      revenue: totalContractValue,
      onboarding: onboardingClientsCount
    };
  }, [clients]);

  // Group filtered clients by month for rendering sections
  const groupedClients = useMemo(() => {
    const groups: Record<string, Client[]> = {};
    filteredClients.forEach((c) => {
      if (!groups[c.monthYear]) {
        groups[c.monthYear] = [];
      }
      groups[c.monthYear].push(c);
    });
    return groups;
  }, [filteredClients]);

  return (
    <div className="space-y-8 select-none">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Client Directory</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Manage corporate client accounts, billing contracts, and onboarding timelines.
          </p>
        </div>
        <div>
          <button 
            onClick={() => loadProjects()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Refresh Records
          </button>
        </div>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Client Scope", val: metrics.total, icon: Users2, color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
          { label: "Active Pipelines", val: metrics.active, icon: ShieldCheck, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { label: "June Onboarding", val: metrics.onboarding, icon: Calendar, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
          { label: "Contract value", val: `$${metrics.revenue.toLocaleString()}`, icon: DollarSign, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" }
        ].map((w, idx) => (
          <div
            key={idx}
            className={`p-5.5 rounded-2xl border flex flex-col items-start gap-1 transition ${
              isDark ? "bg-[#12052c]/40" : "bg-white shadow-sm"
            } ${w.color}`}
          >
            <div className="flex items-center justify-between w-full opacity-60">
              <span className="text-[10px] font-bold uppercase tracking-wider">{w.label}</span>
              <w.icon className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold font-mono mt-1">{w.val}</span>
          </div>
        ))}
      </div>

      {/* Filters & Month Selector Tabs */}
      <div className={`p-4.5 rounded-2xl border flex flex-col gap-4 transition ${
        isDark ? "bg-[#12052c]/65 border-white/5" : "bg-white border-slate-200"
      }`}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-white/40" : "text-slate-400"}`} />
            <input
              type="text"
              placeholder="Search clients by name or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full h-10 pl-10 pr-4 border rounded-xl text-xs font-semibold transition focus:outline-none focus:ring-1 ${
                isDark
                  ? "bg-white/5 border-white/5 text-white placeholder-white/30 focus:border-[#a855f7]/50"
                  : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/50"
              }`}
            />
          </div>

          {/* Month selector timeline tabs */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
            <button
              onClick={() => setSelectedMonth("All")}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedMonth === "All"
                  ? "bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white shadow-md shadow-[#a855f7]/10"
                  : isDark ? "bg-white/5 border border-white/5 text-white/60 hover:text-white" : "bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800"
              }`}
            >
              All Months
            </button>
            {onboardingMonths.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedMonth === month
                    ? "bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white shadow-md shadow-[#a855f7]/10"
                    : isDark ? "bg-white/5 border border-white/5 text-white/60 hover:text-white" : "bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800"
                }`}
              >
                {month}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main clients timeline */}
      <div className="space-y-10 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#a855f7] font-semibold text-xs animate-pulse">
            <Users2 className="h-8 w-8 animate-spin" />
            Loading Dynamic Directories...
          </div>
        ) : filteredClients.length > 0 ? (
          // Display Grouped Month-by-Month sections
          Object.keys(groupedClients).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map((monthKey) => {
            const list = groupedClients[monthKey] || [];
            return (
              <div key={monthKey} className="space-y-5">
                
                {/* Month header sticky banner */}
                <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                  <Calendar className="h-4.5 w-4.5 text-[#ff8a5b]" />
                  <h2 className="font-serif text-lg font-bold tracking-tight">{monthKey}</h2>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    isDark ? "bg-white/5 text-white/50" : "bg-slate-200/50 text-slate-500"
                  }`}>
                    {list.length} {list.length === 1 ? "Client" : "Clients"} Onboarded
                  </span>
                </div>

                {/* Clients Card grid (3 columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((client, i) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`rounded-2xl border p-6 transition-all duration-300 group hover:shadow-2xl cursor-pointer flex flex-col justify-between min-h-[280px] relative overflow-hidden ${
                        isDark
                          ? "bg-gradient-to-br from-[#1c0d3a]/65 to-[#0b031b]/80 border-white/5 text-white hover:border-[#a855f7]/30 hover:shadow-[#a855f7]/10"
                          : "bg-white border-slate-200/60 hover:border-slate-350 shadow-sm text-slate-800 hover:shadow-slate-400/20"
                      } ${selectedClientId === client.id ? "border-[#a855f7]/40 ring-1 ring-[#a855f7]/40" : ""}`}
                    >
                      {/* Ambient background glow inside card on hover */}
                      <div className="absolute top-0 right-0 h-28 w-28 bg-[#a855f7]/5 blur-2xl rounded-full transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none" />

                      <div className="space-y-5">
                        {/* Avatar, name and sector header */}
                        <div className="flex items-start gap-4">
                          <div className="h-11 w-11 rounded-full shrink-0 flex items-center justify-center font-bold text-xs bg-gradient-to-tr from-[#a855f7] to-[#ff8a5b] text-white shadow-inner select-none">
                            {client.company.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "C"}
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-[#a855f7] font-semibold uppercase tracking-wider block truncate">
                                {client.sector}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full border text-[8px] font-extrabold uppercase tracking-wider shrink-0 ${
                                client.status === "Active"
                                  ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400"
                                  : isDark
                                  ? "bg-white/5 border-white/10 text-white/40"
                                  : "bg-slate-100 border-slate-200 text-slate-500"
                              }`}>
                                {client.status}
                              </span>
                            </div>
                            <h3 className="text-sm md:text-base font-extrabold tracking-tight truncate leading-snug group-hover:text-[#ff8a5b] transition duration-300">
                              {client.company}
                            </h3>
                          </div>
                        </div>

                        {/* Details with side indicator bar */}
                        <div className={`pl-3 border-l-2 space-y-2.5 text-xs md:text-[13px] ${
                          isDark ? "border-white/5 text-white/70" : "border-slate-100 text-slate-600"
                        }`}>
                          <div className="flex items-center gap-2">
                            <Users2 className={`h-3.5 w-3.5 shrink-0 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                            <span className="truncate font-medium">Contact: {client.contactName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className={`h-3.5 w-3.5 shrink-0 ${isDark ? "text-white/30" : "text-slate-400"}`} />
                            <span className="font-mono text-[11px] font-medium">{client.phoneNumber}</span>
                          </div>
                        </div>

                        {/* Projects representation pills */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider opacity-40">Active Project Scope</span>
                          <div className="flex flex-wrap gap-1.5">
                            {client.projects.slice(0, 3).map((proj) => (
                              <div
                                key={proj.id}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition ${
                                  isDark ? "bg-white/5 border-white/5 text-white/70" : "bg-slate-50 border-slate-150 text-slate-700"
                                }`}
                                title={proj.projectName}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  proj.isCompleted 
                                    ? "bg-emerald-400" 
                                    : "bg-amber-400 animate-pulse"
                                }`} />
                                <span className="truncate max-w-[100px]">{proj.projectName}</span>
                              </div>
                            ))}
                            {client.projects.length > 3 && (
                              <div className={`inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-bold ${
                                isDark ? "bg-white/5 text-white/40" : "bg-slate-100 text-slate-500"
                              }`}>
                                +{client.projects.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Footer: valuation capsule */}
                      <div className="flex items-center justify-between border-t border-[#a855f7]/10 pt-4 mt-5">
                        <span className="text-[10px] opacity-40 uppercase font-bold tracking-wider">Contract Volume</span>
                        <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#a855f7]/10 to-[#ff8a5b]/10 border border-[#a855f7]/10">
                          <span className="text-xs md:text-sm font-bold font-mono text-[#ff8a5b]">${client.totalValue.toLocaleString()}</span>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>

              </div>
            );
          })
        ) : (
          <div className={`flex flex-col items-center justify-center text-center p-16 border border-dashed rounded-2xl ${
            isDark ? "border-white/10 text-white/40" : "border-slate-200 text-slate-400"
          }`}>
            <Users2 className="h-10 w-10 mb-3 text-slate-400" />
            <h3 className="font-semibold text-sm">No Client Directory Match</h3>
            <p className="text-xs mt-1 max-w-xs">
              No clients found matching the selected onboarding month or search queries.
            </p>
          </div>
        )}
      </div>

      {/* Client profile details drawer */}
      <AnimatePresence>
        {selectedClient && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClientId(null)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Slider Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg overflow-y-auto p-6 flex flex-col gap-6 shadow-2xl border-l select-text ${
                isDark ? "bg-[#0c0420] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4.5 shrink-0">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#a855f7] block">
                    Client Profiles & Billing
                  </span>
                  <h2 className="font-serif text-xl font-bold mt-1">
                    {selectedClient.company}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedClientId(null)}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center border transition ${
                    isDark ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Profile Body */}
              <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                
                {/* 1. Account Details Cards */}
                <div className={`p-5 rounded-2xl border space-y-4 text-xs ${
                  isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
                }`}>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider opacity-40">Client Info Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block opacity-40">Primary Contact</span>
                      <span className="font-semibold block mt-0.5">{selectedClient.contactName}</span>
                    </div>
                    <div>
                      <span className="block opacity-40">Sector Industry</span>
                      <span className="font-semibold block mt-0.5 text-[#a855f7]">{selectedClient.sector}</span>
                    </div>
                    <div>
                      <span className="block opacity-40">Phone Contact</span>
                      <span className="font-semibold font-mono block mt-0.5">{selectedClient.phoneNumber}</span>
                    </div>
                    <div>
                      <span className="block opacity-40">Sales Onboarded</span>
                      <span className="font-semibold font-mono block mt-0.5">{selectedClient.salesDate}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block opacity-40">Client Account Email</span>
                      <span className="font-semibold font-mono block mt-0.5">{selectedClient.email}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Billing Status overview */}
                <div className={`p-5 rounded-2xl border space-y-4 text-xs ${
                  isDark ? "bg-white/[0.01] border-white/5" : "bg-slate-50 border-slate-150"
                }`}>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider opacity-40">Financial overview</h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block opacity-40">Total Contract Value</span>
                      <span className="text-xl font-bold font-mono text-[#ff8a5b] mt-0.5">
                        ${selectedClient.totalValue.toLocaleString()}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                      selectedClient.status === "Active"
                        ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400"
                        : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}>
                      {selectedClient.status}
                    </span>
                  </div>
                </div>

                {/* 3. Projects billing history */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider opacity-40 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" /> Active Contract Billing Projects
                  </h4>

                  <div className="space-y-3">
                    {selectedClient.projects.map((proj) => (
                      <div
                        key={proj.id}
                        className={`p-4 rounded-xl border flex flex-col gap-3.5 ${
                          isDark ? "bg-[#160c2d]/70 border-white/5" : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h5 className="font-bold text-xs leading-normal">{proj.projectName}</h5>
                            <span className="text-[9px] opacity-40 font-mono mt-0.5 block">Onboard: {proj.salesDate}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider border ${
                            proj.isCompleted 
                              ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" 
                              : "bg-amber-500/15 border-amber-500/20 text-amber-400"
                          }`}>
                            {proj.isCompleted ? "Completed" : "In Progress"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-2.5">
                          <div className="opacity-50">
                            <span>Owner: {proj.ownerName}</span>
                            {proj.domainName && <span className="block font-mono text-[#a855f7]">{proj.domainName}</span>}
                          </div>
                          <span className="font-bold font-mono text-[#ff8a5b]">${proj.projectCost.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
