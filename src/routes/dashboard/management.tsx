import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState, useEffect } from "react";
import { 
  Globe, 
  Plus, 
  Link2, 
  Monitor, 
  Compass, 
  ArrowUpRight, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Settings, 
  ArrowRight,
  TrendingUp,
  Wrench
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/dashboard/management")({
  component: WebsiteManagementPage,
});

interface SitePage {
  id: string;
  path: string;
  title: string;
  status: "Published" | "Draft";
  speedScore: number;
}

interface SiteConfig {
  id: string;
  productionUrl: string;
  avgSeoRank: string;
  keywordsTracked: number;
  coreWebVitals: number;
  maintenanceMode: boolean;
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

function WebsiteManagementPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  // State Management
  const [pages, setPages] = useState<SitePage[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<SitePage | null>(null);
  const [pageToDelete, setPageToDelete] = useState<SitePage | null>(null);
  
  // Page Form Fields
  const [formPath, setFormPath] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft">("Draft");
  const [formSpeed, setFormSpeed] = useState<number>(90);

  // Global Config Editor state
  const [isConfigEditing, setIsConfigEditing] = useState(false);
  const [configUrl, setConfigUrl] = useState("");
  const [configSeo, setConfigSeo] = useState("");
  const [configKeywords, setConfigKeywords] = useState<number>(0);
  const [configVitals, setConfigVitals] = useState<number>(90);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  // Toast notifications state
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
    }, 4000);
  };

  // Load pages and configs
  const loadData = async () => {
    setLoading(true);
    try {
      const pagesData = await adminFetch<SitePage[]>("/api/admin/site-pages");
      setPages(pagesData);
      
      const configData = await adminFetch<SiteConfig>("/api/admin/site-config");
      setConfig(configData);
      
      // Sync config editor fields
      if (configData) {
        setConfigUrl(configData.productionUrl);
        setConfigSeo(configData.avgSeoRank);
        setConfigKeywords(configData.keywordsTracked);
        setConfigVitals(configData.coreWebVitals);
        setMaintenanceMode(configData.maintenanceMode ?? false);
      }
    } catch (err: any) {
      showToast("Failed to fetch site configurations: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Global Configurations
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await adminFetch<SiteConfig>("/api/admin/site-config", {
        method: "PUT",
        body: JSON.stringify({
          productionUrl: configUrl,
          avgSeoRank: configSeo,
          keywordsTracked: Number(configKeywords),
          coreWebVitals: Number(configVitals),
          maintenanceMode: maintenanceMode
        })
      });
      setConfig(updated);
      setMaintenanceMode(updated.maintenanceMode ?? false);
      setIsConfigEditing(false);
      showToast("Global website configuration updated!", "success");
    } catch (err: any) {
      showToast("Failed to save config: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMaintenance = async () => {
    const nextVal = !maintenanceMode;
    setMaintenanceMode(nextVal);
    try {
      const updated = await adminFetch<SiteConfig>("/api/admin/site-config", {
        method: "PUT",
        body: JSON.stringify({
          maintenanceMode: nextVal
        })
      });
      setConfig(updated);
      setMaintenanceMode(updated.maintenanceMode ?? false);
      showToast(
        nextVal 
          ? "Website is now in Maintenance Mode!" 
          : "Website is now live and out of Maintenance Mode!", 
        nextVal ? "warning" : "success"
      );
    } catch (err: any) {
      setMaintenanceMode(!nextVal);
      showToast("Failed to update maintenance mode: " + err.message, "error");
    }
  };

  // Open Page form
  const openCreateForm = () => {
    setEditingPage(null);
    setFormPath("");
    setFormTitle("");
    setFormStatus("Draft");
    setFormSpeed(90);
    setIsFormOpen(true);
  };

  const openEditForm = (p: SitePage) => {
    setEditingPage(p);
    setFormPath(p.path);
    setFormTitle(p.title);
    setFormStatus(p.status);
    setFormSpeed(p.speedScore);
    setIsFormOpen(true);
  };

  // Add / Edit Page Route submit handler
  const handleSubmitPageForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPath.trim() || !formTitle.trim()) return;

    setLoading(true);
    try {
      const payload = {
        path: formPath.trim(),
        title: formTitle.trim(),
        status: formStatus,
        speedScore: Number(formSpeed || 0)
      };

      if (editingPage) {
        const updated = await adminFetch<SitePage>(`/api/admin/site-pages/${editingPage.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast("Page route details updated successfully!", "success");
      } else {
        const created = await adminFetch<SitePage>("/api/admin/site-pages", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setPages((prev) => [...prev, created]);
        showToast("New page route added successfully!", "success");
      }
      setIsFormOpen(false);
    } catch (err: any) {
      showToast("Failed to save route page: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Page Route handler
  const handleDeletePage = async (pageId: string) => {
    setLoading(true);
    try {
      await adminFetch(`/api/admin/site-pages/${pageId}`, {
        method: "DELETE"
      });
      setPages((prev) => prev.filter((p) => p.id !== pageId));
      showToast("Page route removed successfully.", "success");
    } catch (err: any) {
      showToast("Failed to delete page: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 relative pb-20 select-none">
      
      {/* Toast Notifications */}
      <div className="fixed top-5 right-5 z-55 space-y-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl border shadow-xl flex items-center gap-3 pointer-events-auto ${
                t.type === "success"
                  ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-400"
                  : t.type === "error"
                  ? "bg-rose-950/90 border-rose-500/30 text-rose-400"
                  : t.type === "warning"
                  ? "bg-amber-950/90 border-amber-500/30 text-amber-400"
                  : "bg-slate-900/90 border-slate-700/50 text-slate-300"
              }`}
            >
              {t.type === "error" || t.type === "warning" ? (
                <AlertCircle className="h-5 w-5 shrink-0" />
              ) : (
                <CheckCircle className="h-5 w-5 shrink-0" />
              )}
              <span className="text-xs font-semibold">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Website Management</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Configure sitemaps, active routes, SEO optimization, and page speed index score records.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsConfigEditing(true)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition active:scale-[0.98] ${
              isDark ? "border-white/5 bg-white/5 text-white hover:bg-white/10" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Settings className="h-4 w-4" />
            Website Config
          </button>
          <button 
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Page Route
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Production URL */}
        <div className={`rounded-2xl border p-6 transition duration-300 ${
          isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Production URL
            </span>
            <Link2 className="h-4 w-4 text-[#a855f7]" />
          </div>
          <span className="text-xl font-bold tracking-tight">{config?.productionUrl || "stellrit.com"}</span>
          <span className="text-[10px] text-emerald-400 block mt-2 font-semibold">
            Status: DNS Propagated
          </span>
        </div>

        {/* Average SEO Rank */}
        <div className={`rounded-2xl border p-6 transition duration-300 ${
          isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Average SEO Rank
            </span>
            <Compass className="h-4 w-4 text-[#ff8a5b]" />
          </div>
          <span className="text-xl font-bold tracking-tight">{config?.avgSeoRank || "#4 Sector Avg"}</span>
          <span className="text-[10px] text-[#ff8a5b] block mt-2 font-semibold">
            Keywords Tracked: {config?.keywordsTracked || 42}
          </span>
        </div>

        {/* Core Web Vitals */}
        <div className={`rounded-2xl border p-6 transition duration-300 ${
          isDark ? "bg-[#12052c]/65 border-white/5 text-white" : "bg-white border-slate-200/60 shadow-sm text-slate-800"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Core Web Vitals
            </span>
            <Monitor className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">{config?.coreWebVitals || 96} / 100</span>
          <span className="text-[10px] text-emerald-400 block mt-2 font-semibold">
            Performance: Excellent
          </span>
        </div>

        {/* Maintenance Mode Card */}
        <div className={`rounded-2xl border p-6 transition duration-300 relative overflow-hidden ${
          isDark 
            ? "bg-[#12052c]/65 border-white/5 text-white" 
            : "bg-white border-slate-200/60 shadow-sm text-slate-800"
        }`}>
          {maintenanceMode && (
            <div className="absolute inset-0 bg-amber-500/5 pointer-events-none animate-pulse" />
          )}

          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Maintenance Mode
            </span>
            <Wrench className={`h-4 w-4 ${maintenanceMode ? "text-amber-500 animate-spin" : "text-amber-500/50"}`} style={{ animationDuration: '3s' }} />
          </div>

          <div className="flex items-center justify-between gap-4 mt-2">
            <div>
              <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${maintenanceMode ? "text-amber-500" : ""}`}>
                {maintenanceMode ? "Active" : "Inactive"}
              </span>
              <span className={`text-[10px] block mt-1 font-semibold transition-colors duration-300 ${
                maintenanceMode ? "text-amber-400/80" : isDark ? "text-white/40" : "text-slate-400"
              }`}>
                {maintenanceMode ? "Landing page locked" : "Website is fully live"}
              </span>
            </div>
            
            <button
              onClick={handleToggleMaintenance}
              disabled={loading}
              type="button"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                maintenanceMode ? "bg-amber-500" : "bg-slate-700/40"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-250 ease-in-out ${
                  maintenanceMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Pages Table Directory */}
      <div className={`rounded-2xl border p-6 transition duration-300 ${
        isDark ? "bg-[#12052c]/65 border-white/5 shadow-2xl" : "bg-white border-slate-200/60 shadow-sm"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-semibold">Site Page Directory</h3>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Configure live directories, canonical metadata paths, and mobile speed states.
            </p>
          </div>
          {loading && (
            <span className="text-xs font-semibold text-[#a855f7] flex items-center gap-1.5 animate-pulse">
              <Plus className="h-4 w-4 animate-spin" /> Syncing settings...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          {pages.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b uppercase font-semibold tracking-wider text-[10px] ${
                  isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"
                }`}>
                  <th className="pb-3 pr-4">Route Path</th>
                  <th className="pb-3 px-4">Meta Title</th>
                  <th className="pb-3 px-4">Indexing</th>
                  <th className="pb-3 px-4 text-center">Mobile Speed</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-white/[0.04]" : "divide-slate-100"}`}>
                {pages.map((p) => (
                  <tr key={p.id || p.path} className="hover:bg-black/[0.01] transition group">
                    <td className="py-4 pr-4 font-mono font-semibold text-[#a855f7]">
                      {p.path}
                    </td>
                    <td className="py-4 px-4 font-medium">
                      {p.title}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                        p.status === "Published"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono">
                      {p.speedScore > 0 ? (
                        <span className={`font-semibold ${p.speedScore >= 95 ? "text-emerald-500" : "text-amber-500"}`}>
                          {p.speedScore}
                        </span>
                      ) : (
                        <span className="opacity-30">—</span>
                      )}
                    </td>
                    <td className="py-4 pl-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditForm(p)}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center border transition ${
                            isDark ? "border-white/5 hover:border-white/10 text-white/50 hover:text-white bg-white/5" : "border-slate-200 hover:border-slate-350 text-slate-550 hover:text-slate-800 bg-slate-50"
                          }`}
                          title="Edit Route Page"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => setPageToDelete(p)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center border border-red-500/10 bg-red-500/5 hover:bg-red-500/15 text-red-400 transition"
                          title="Delete Route Page"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 opacity-30 text-xs italic">
              No page routes added yet. Click "Add Page Route" to configure.
            </div>
          )}
        </div>
      </div>

      {/* Page Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />

            {/* Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-55 w-full max-w-md rounded-3xl border shadow-2xl p-6.5 select-text ${
                isDark ? "bg-[#0d0524] border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold">
                    {editingPage ? "Edit Page Route Configuration" : "Add Website Route Directory"}
                  </h3>
                  <p className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
                    Configure indexing directories, meta paths, and speeds.
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center border transition ${
                    isDark ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitPageForm} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Route Path *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. /portfolio"
                    value={formPath}
                    onChange={(e) => setFormPath(e.target.value)}
                    className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                      isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Meta Title *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Portfolio — StellR IT"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                      isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                        isDark ? "bg-[#12052c] border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Mobile Speed (1-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formSpeed}
                      onChange={(e) => setFormSpeed(Number(e.target.value))}
                      className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                        isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/5 pt-5 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className={`h-10 px-5.5 rounded-xl border text-xs font-bold transition ${
                      isDark ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6.5 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]"
                  >
                    Save Route Page
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Website Config Modal */}
      <AnimatePresence>
        {isConfigEditing && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfigEditing(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />

            {/* Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-55 w-full max-w-md rounded-3xl border shadow-2xl p-6.5 select-text ${
                isDark ? "bg-[#0d0524] border-white/10 text-white" : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold">Edit Global Settings</h3>
                  <p className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
                    Configure global domain, SEO Keywords, and Speed metrics.
                  </p>
                </div>
                <button
                  onClick={() => setIsConfigEditing(false)}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center border transition ${
                    isDark ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Production URL</label>
                  <input
                    required
                    type="text"
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                      isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Average SEO Rank</label>
                  <input
                    required
                    type="text"
                    value={configSeo}
                    onChange={(e) => setConfigSeo(e.target.value)}
                    className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                      isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Keywords Tracked</label>
                    <input
                      required
                      type="number"
                      value={configKeywords}
                      onChange={(e) => setConfigKeywords(Number(e.target.value))}
                      className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                        isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Core Web Vitals</label>
                    <input
                      required
                      type="number"
                      min={0}
                      max={100}
                      value={configVitals}
                      onChange={(e) => setConfigVitals(Number(e.target.value))}
                      className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#a855f7]/30 transition ${
                        isDark ? "bg-white/5 border-white/10 text-white focus:border-[#a855f7]/50" : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-white/5 pt-5 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsConfigEditing(false)}
                    className={`h-10 px-5.5 rounded-xl border text-xs font-bold transition ${
                      isDark ? "border-white/5 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6.5 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]"
                  >
                    Save Config
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Confirm Delete Modal */}
      <AnimatePresence>
        {pageToDelete && (
          <div className="fixed inset-0 z-55 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPageToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl z-55 backdrop-blur-xl ${
                isDark
                  ? "bg-[#0d0524]/95 border-white/10 text-white shadow-red-950/10"
                  : "bg-white border-slate-200 text-slate-800 shadow-slate-400/20"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4 animate-pulse">
                  <Trash2 className="h-6 w-6" />
                </div>
                
                <h3 className="font-serif text-base font-bold">Remove Page Route</h3>
                <p className={`text-xs mt-2 leading-relaxed ${isDark ? "text-white/60" : "text-slate-550"}`}>
                  Are you sure you want to permanently delete the route path <span className="font-semibold text-red-400">"{pageToDelete.path}"</span>? This action is irreversible.
                </p>

                <div className="flex items-center gap-3 w-full mt-6">
                  <button
                    onClick={() => setPageToDelete(null)}
                    className={`flex-1 py-2.5 rounded-full text-xs font-semibold border transition ${
                      isDark ? "border-white/5 bg-white/5 text-white/70 hover:bg-white/10" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDeletePage(pageToDelete.id);
                      setPageToDelete(null);
                    }}
                    className="flex-1 py-2.5 rounded-full text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/10 transition active:scale-[0.98]"
                  >
                    Delete Route
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
