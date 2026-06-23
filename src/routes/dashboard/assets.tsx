import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { 
  Image as ImageIcon, 
  Film, 
  Plus, 
  Eye, 
  Download, 
  Search, 
  FileText, 
  Copy, 
  Check, 
  Trash2, 
  Calendar, 
  HardDrive, 
  Share2, 
  EyeOff, 
  Loader2, 
  Folder, 
  ArrowUpDown, 
  Clock, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/dashboard/assets")({
  component: AssetsPage,
});

import {
  getAssetRequestsFn,
  createAssetRequestFn,
  deleteAssetRequestFn,
  getUploadedAssetsFn,
  deleteUploadedAssetFn,
  deleteFolderFn,
  getProjectsFn,
} from "@/lib/dashboard.functions.server";

interface UploadedAsset {
  id: string;
  requestId?: string;
  businessName: string;
  clientName?: string;
  email?: string;
  phone?: string;
  originalFilename: string;
  fileType: "image" | "video" | "document";
  mimeType?: string;
  fileSize: number;
  cloudinaryUrl: string;
  notes?: string;
  createdAt: string;
}

interface AssetRequest {
  id: string;
  token: string;
  businessName: string;
  clientName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  maxUploadSize: number;
  allowedFileTypes: string[];
  expirationDate?: string;
  status: "Waiting for Upload" | "Completed" | "Expired";
  createdAt: string;
}

interface Project {
  _id?: string;
  id?: string;
  projectName: string;
  businessName: string;
}

const triggerDownload = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Response not ok");
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(objectUrl);
  } catch (err) {
    console.warn("Direct blob download failed, falling back to fl_attachment flag:", err);
    let downloadUrl = url;
    if (downloadUrl.includes("res.cloudinary.com") && downloadUrl.includes("/upload/")) {
      downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
    }
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

const handleDownloadAll = async (assets: UploadedAsset[]) => {
  for (const asset of assets) {
    await triggerDownload(asset.cloudinaryUrl, asset.originalFilename);
    // 200ms delay to prevent browser throttling consecutive downloads
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
};

function formatSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function AssetsPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  // Data State
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [requests, setRequests] = useState<AssetRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & UI State
  const [activeTab, setActiveTab] = useState<"folders" | "requests">("folders");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  
  // Confirmation state
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ type: "folder" | "asset" | "request"; idOrName: string; extraLabel?: string } | null>(null);
  
  // Lightbox index/asset
  const [lightboxAsset, setLightboxAsset] = useState<UploadedAsset | null>(null);

  // New Request Form Fields
  const [newReqBusiness, setNewReqBusiness] = useState("");
  const [newReqClient, setNewReqClient] = useState("");
  const [newReqEmail, setNewReqEmail] = useState("");
  const [newReqPhone, setNewReqPhone] = useState("");
  const [newReqNotes, setNewReqNotes] = useState("");
  const [newReqProjectId, setNewReqProjectId] = useState("");
  const [newReqMaxSize, setNewReqMaxSize] = useState("100"); // in MB
  const [newReqAllowed, setNewReqAllowed] = useState<string[]>(["images", "videos", "documents"]);
  const [newReqExpiration, setNewReqExpiration] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assetsData, requestsData, projectsData] = await Promise.all([
        getUploadedAssetsFn(),
        getAssetRequestsFn(),
        getProjectsFn().catch(() => []),
      ]);
      setAssets(assetsData as any);
      setRequests(requestsData as any);
      setProjects(projectsData as any);
    } catch (err) {
      console.error("Error fetching assets metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/upload/${token}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqClient) return;

    setIsCreatingLink(true);
    try {
      await createAssetRequestFn({
        data: {
          businessName: newReqClient,
          clientName: newReqClient,
          maxUploadSize: Number(newReqMaxSize) * 1024 * 1024,
          allowedFileTypes: newReqAllowed,
        }
      });

      // Clear fields & refresh
      setNewReqBusiness("");
      setNewReqClient("");
      setNewReqEmail("");
      setNewReqPhone("");
      setNewReqNotes("");
      setNewReqProjectId("");
      setNewReqMaxSize("100");
      setNewReqAllowed(["images", "videos", "documents"]);
      setNewReqExpiration("");
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      console.error("Failed to create request link:", err);
      alert("Error generating upload link.");
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmTarget) return;

    try {
      if (deleteConfirmTarget.type === "folder") {
        await deleteFolderFn({
          data: { folderName: deleteConfirmTarget.idOrName }
        });
      } else if (deleteConfirmTarget.type === "request") {
        await deleteAssetRequestFn({
          data: { id: deleteConfirmTarget.idOrName }
        });
      } else {
        await deleteUploadedAssetFn({
          data: { id: deleteConfirmTarget.idOrName }
        });
      }
      fetchData();
    } catch (err) {
      console.error("Failed to delete item:", err);
    } finally {
      setDeleteConfirmTarget(null);
    }
  };

  // Toggle Folder
  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  // Group assets by business name
  const groupedFolders = assets.reduce<Record<string, { assets: UploadedAsset[]; totalSize: number; clientName?: string }>>((acc, asset) => {
    if (!acc[asset.businessName]) {
      acc[asset.businessName] = { assets: [], totalSize: 0, clientName: asset.clientName };
    }
    acc[asset.businessName].assets.push(asset);
    acc[asset.businessName].totalSize += asset.fileSize;
    if (asset.clientName && !acc[asset.businessName].clientName) {
      acc[asset.businessName].clientName = asset.clientName;
    }
    return acc;
  }, {});

  // Calculate high-level telemetry stats
  const totalAssetsCount = assets.length;
  const totalStorageSize = assets.reduce((sum, a) => sum + a.fileSize, 0);
  const activeRequestsCount = requests.filter(r => r.status === "Waiting for Upload" && (!r.expirationDate || new Date(r.expirationDate) > new Date())).length;
  const dailyUploadsCount = assets.filter(a => {
    const uploadTime = new Date(a.createdAt).getTime();
    const limit = Date.now() - 24 * 60 * 60 * 1000;
    return uploadTime > limit;
  }).length;

  // Filtered lists
  const filteredFoldersKeys = Object.keys(groupedFolders).filter(business => {
    const cleanBusiness = business.toLowerCase();
    const query = searchQuery.toLowerCase();
    const client = (groupedFolders[business].clientName || "").toLowerCase();
    return cleanBusiness.includes(query) || client.includes(query);
  });

  const filteredRequests = requests.filter(req => {
    const query = searchQuery.toLowerCase();
    const business = req.businessName.toLowerCase();
    const client = (req.clientName || "").toLowerCase();
    return business.includes(query) || client.includes(query) || req.token.includes(query);
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Client Asset Vault
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Securely request, download, and catalog images, looping videos, design vectors, and documentation files.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition text-xs font-bold active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create Request Link
          </button>
        </div>
      </div>

      {/* Telemetry Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Assets",
            value: totalAssetsCount,
            desc: "Cached files in vault",
            icon: Folder,
            color: "from-purple-500/10 to-indigo-500/10 text-indigo-400 border-indigo-500/20"
          },
          {
            label: "Storage Used",
            value: formatSize(totalStorageSize),
            desc: "Vault footprint size",
            icon: HardDrive,
            color: "from-pink-500/10 to-rose-500/10 text-pink-400 border-pink-500/20"
          },
          {
            label: "Active Requests",
            value: activeRequestsCount,
            desc: "Open upload portals",
            icon: Share2,
            color: "from-amber-500/10 to-orange-500/10 text-amber-400 border-amber-500/20"
          },
          {
            label: "24h Uploads",
            value: dailyUploadsCount,
            desc: "New uploads today",
            icon: Clock,
            color: "from-emerald-500/10 to-teal-500/10 text-emerald-400 border-emerald-500/20"
          }
        ].map((stat, i) => (
          <div 
            key={i} 
            className={`p-5 rounded-2xl border bg-gradient-to-br ${stat.color} flex flex-col justify-between ${
              isDark ? "bg-[#12052c]/20 border-white/5" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-white/40" : "text-slate-400"}`}>
                {stat.label}
              </span>
              <stat.icon className="h-5 w-5 opacity-70" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-white">{stat.value}</span>
              <p className={`text-[10px] mt-1 ${isDark ? "text-white/35" : "text-slate-400"}`}>{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs and Filtering Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 self-start">
          <button
            onClick={() => setActiveTab("folders")}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "folders"
                ? "bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white"
                : `${isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"}`
            }`}
          >
            Asset Folders
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white"
                : `${isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-900"}`
            }`}
          >
            Upload Request Links
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder={activeTab === "folders" ? "Search businesses or clients..." : "Search request links..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12052c]/40 border border-white/5 pl-10 pr-4 py-2.5 rounded-full text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#a855f7]/55 transition"
          />
        </div>
      </div>

      {/* Primary Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 text-[#a855f7] animate-spin" />
          <span className="text-xs text-white/40">Querying asset repository...</span>
        </div>
      ) : activeTab === "folders" ? (
        /* ASSET FOLDERS ACCORDION LIST */
        <div className="space-y-4">
          {filteredFoldersKeys.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${isDark ? "bg-[#12052c]/10 border-white/5" : "bg-slate-50 border-slate-200"}`}>
              <Folder className="h-10 w-10 mx-auto text-white/20 mb-3" />
              <span className={`block text-sm font-semibold ${isDark ? "text-white/50" : "text-slate-500"}`}>No folder directories found</span>
              <p className="text-xs text-white/30 mt-1">Upload files through client portals to populate storage folders.</p>
            </div>
          ) : (
            filteredFoldersKeys.map((businessKey) => {
              const folder = groupedFolders[businessKey];
              const isExpanded = expandedFolders[businessKey];
              const imageAssets = folder.assets.filter(a => a.fileType === "image");
              const videoAssets = folder.assets.filter(a => a.fileType === "video");
              const docAssets = folder.assets.filter(a => a.fileType === "document");

              return (
                <div 
                  key={businessKey}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded 
                      ? "bg-[#150734]/70 border-[#a855f7]/30 shadow-[0_4px_30px_rgba(168,85,247,0.05)]" 
                      : "bg-[#12052c]/50 border-white/5 hover:border-white/10"
                  }`}
                >
                  {/* Folder Header */}
                  <div 
                    onClick={() => toggleFolder(businessKey)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#a855f7]/15 to-[#ff8a5b]/15 border border-[#a855f7]/20 flex items-center justify-center text-[#ff8a5b]">
                        <Folder className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-wide">{businessKey}</h3>
                        <p className="text-[10px] text-white/40 mt-0.5 flex items-center gap-2">
                          {folder.clientName && <span>Client: {folder.clientName}</span>}
                          {folder.clientName && <span className="h-1 w-1 bg-white/25 rounded-full" />}
                          <span>{folder.assets.length} file{folder.assets.length !== 1 && "s"}</span>
                          <span className="h-1 w-1 bg-white/25 rounded-full" />
                          <span>{formatSize(folder.totalSize)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleDownloadAll(folder.assets)}
                        className="h-8 px-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-1.5 text-[10px] font-bold text-white transition active:scale-95"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download All files
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmTarget({ type: "folder", idOrName: businessKey })}
                        className="h-8 w-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center text-rose-400 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => toggleFolder(businessKey)}
                        className={`h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition`}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Folder Contents */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/5 bg-[#0e0326]/60 overflow-hidden"
                      >
                        <div className="p-6 space-y-8">
                          
                          {/* Image Gallery */}
                          {imageAssets.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-[#ff8a5b]/80 uppercase tracking-wider flex items-center gap-1.5">
                                <ImageIcon className="h-4 w-4" />
                                Images ({imageAssets.length})
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {imageAssets.map((asset) => (
                                  <div 
                                    key={asset.id}
                                    className="group relative rounded-xl border border-white/5 overflow-hidden bg-black/35 aspect-square flex flex-col justify-between"
                                  >
                                    <img 
                                      src={asset.cloudinaryUrl} 
                                      alt={asset.originalFilename} 
                                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    {/* Glass Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                      <button 
                                        onClick={() => setLightboxAsset(asset)}
                                        className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-90"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </button>
                                      <button 
                                        onClick={() => triggerDownload(asset.cloudinaryUrl, asset.originalFilename)}
                                        className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-90"
                                      >
                                        <Download className="h-4 w-4" />
                                      </button>
                                      <button 
                                        onClick={() => setDeleteConfirmTarget({ type: "asset", idOrName: asset.id, extraLabel: asset.originalFilename })}
                                        className="h-8 w-8 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 flex items-center justify-center text-rose-400 transition active:scale-90"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                      <span className="block text-[9px] text-white/80 truncate">{asset.originalFilename}</span>
                                      <span className="text-[8px] text-white/40">{formatSize(asset.fileSize)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Video Section */}
                          {videoAssets.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-[#ff8a5b]/80 uppercase tracking-wider flex items-center gap-1.5">
                                <Film className="h-4 w-4" />
                                Videos ({videoAssets.length})
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {videoAssets.map((asset) => (
                                  <div 
                                    key={asset.id}
                                    className="group rounded-xl border border-white/5 overflow-hidden bg-black/25 flex flex-col justify-between hover:border-[#a855f7]/30 transition"
                                  >
                                    <div className="aspect-video bg-black flex items-center justify-center relative">
                                      <video 
                                        src={asset.cloudinaryUrl} 
                                        controls 
                                        className="w-full h-full object-cover" 
                                        preload="metadata"
                                      />
                                    </div>
                                    <div className="p-3 flex items-center justify-between border-t border-white/5">
                                      <div className="min-w-0 pr-2">
                                        <span className="block text-xs text-white/95 font-semibold truncate">{asset.originalFilename}</span>
                                        <span className="text-[9px] text-white/35 font-mono">{formatSize(asset.fileSize)}</span>
                                      </div>
                                      <div className="flex gap-1">
                                        <button 
                                          onClick={() => triggerDownload(asset.cloudinaryUrl, asset.originalFilename)}
                                          className="h-7 w-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 transition"
                                        >
                                          <Download className="h-3.5 w-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => setDeleteConfirmTarget({ type: "asset", idOrName: asset.id, extraLabel: asset.originalFilename })}
                                          className="h-7 w-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 flex items-center justify-center text-rose-400 transition"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Documents Section */}
                          {docAssets.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-[#ff8a5b]/80 uppercase tracking-wider flex items-center gap-1.5">
                                <FileText className="h-4 w-4" />
                                Documents ({docAssets.length})
                              </h4>
                              <div className="border border-white/5 rounded-xl overflow-x-auto bg-black/10">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="border-b border-white/5 bg-white/5 text-white/40 uppercase text-[9px] tracking-widest">
                                      <th className="p-3.5 font-bold">Filename</th>
                                      <th className="p-3.5 font-bold">Size</th>
                                      <th className="p-3.5 font-bold">Uploaded On</th>
                                      <th className="p-3.5 font-bold text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {docAssets.map((asset) => (
                                      <tr key={asset.id} className="border-b border-white/5 hover:bg-white/5 text-white/80 transition">
                                        <td className="p-3.5 flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-[#ff8a5b]" />
                                          <span className="font-semibold truncate max-w-sm">{asset.originalFilename}</span>
                                        </td>
                                        <td className="p-3.5 font-mono text-white/50">{formatSize(asset.fileSize)}</td>
                                        <td className="p-3.5 text-white/40">{new Date(asset.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3.5 text-right flex justify-end gap-1.5">
                                          <button 
                                            onClick={() => triggerDownload(asset.cloudinaryUrl, asset.originalFilename)}
                                            className="h-7 w-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 transition"
                                          >
                                            <Download className="h-3.5 w-3.5" />
                                          </button>
                                          <button 
                                            onClick={() => setDeleteConfirmTarget({ type: "asset", idOrName: asset.id, extraLabel: asset.originalFilename })}
                                            className="h-7 w-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 flex items-center justify-center text-rose-400 transition"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ACTIVE REQUEST LINKS VIEW */
        <div className="border border-white/5 rounded-2xl overflow-x-auto bg-[#12052c]/10">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#12052c]/50 text-white/40 uppercase text-[9px] tracking-widest">
                <th className="p-4 font-bold">Business / Client</th>
                <th className="p-4 font-bold">Token Link</th>
                <th className="p-4 font-bold">Max Size</th>
                <th className="p-4 font-bold">Types Allowed</th>
                <th className="p-4 font-bold">Expiration Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-white/30">
                    <Share2 className="h-10 w-10 mx-auto opacity-30 mb-3" />
                    No active upload requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const uploadUrl = `${window.location.origin}/upload/${req.token}`;
                  const isExpired = req.expirationDate && new Date(req.expirationDate) < new Date();
                  
                  return (
                    <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 text-white/80 transition">
                      <td className="p-4">
                        <span className="block font-bold text-white">{req.businessName}</span>
                        <span className="block text-[10px] text-white/40 mt-0.5">{req.clientName || "Unknown Client"}</span>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-[#ff8a5b]/80">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate max-w-[150px]">{req.token}</span>
                          <button 
                            onClick={() => handleCopyLink(req.token)}
                            className="h-6 w-6 rounded hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition"
                          >
                            {copiedToken === req.token ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-white/60">{formatSize(req.maxUploadSize)}</td>
                      <td className="p-4 font-mono text-[10px] text-white/50">
                        {req.allowedFileTypes.join(", ")}
                      </td>
                      <td className="p-4 text-white/50 flex items-center gap-1.5 mt-2.5">
                        <Calendar className="h-3.5 w-3.5 opacity-60" />
                        {req.expirationDate ? new Date(req.expirationDate).toLocaleDateString() : "Never"}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold ${
                          isExpired || req.status === "Expired"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : req.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                        }`}>
                          {isExpired ? "Expired" : req.status}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-1.5">
                        <a 
                          href={uploadUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="h-7 w-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 transition"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button 
                          onClick={() => setDeleteConfirmTarget({ type: "request", idOrName: req.id, extraLabel: `Upload Request for ${req.businessName}` })}
                          className="h-7 w-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center text-rose-400 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE UPLOAD PORTAL LINK MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#11042b] border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-[#a855f7]/10 to-[#ff8a5b]/10 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-white">Generate Client Portal Link</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-white/40 hover:text-white transition"
                >
                  <EyeOff className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Client Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newReqClient}
                    onChange={(e) => setNewReqClient(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#a855f7]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Max Upload Footprint</label>
                  <select 
                    value={newReqMaxSize} 
                    onChange={(e) => setNewReqMaxSize(e.target.value)}
                    className="w-full bg-[#1b0a3c] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a855f7]"
                  >
                    <option value="10">10 MB</option>
                    <option value="50">50 MB</option>
                    <option value="100">100 MB</option>
                    <option value="500">500 MB</option>
                    <option value="1024">1 GB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">Allowed Asset Categories</label>
                  <div className="flex gap-4">
                    {["images", "videos", "documents"].map((type) => (
                      <label key={type} className="inline-flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={newReqAllowed.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewReqAllowed([...newReqAllowed, type]);
                            } else {
                              setNewReqAllowed(newReqAllowed.filter(t => t !== type));
                            }
                          }}
                          className="rounded border-white/10 bg-white/5 text-[#a855f7] focus:ring-0 focus:ring-offset-0"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-full border border-white/5 text-xs text-white/70 hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isCreatingLink || !newReqClient}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:opacity-90 transition text-xs font-bold flex items-center gap-1.5"
                  >
                    {isCreatingLink && <Loader2 className="h-3 w-3 animate-spin" />}
                    Create Link
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE DIALOG */}
      <AnimatePresence>
        {deleteConfirmTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#11042b] border border-white/10 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="h-6 w-6 shrink-0" />
                <h3 className="text-base font-bold text-white">Irreversible Action Warning</h3>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Are you sure you want to delete {
                  deleteConfirmTarget.type === "folder" 
                    ? "the entire directory folder" 
                    : deleteConfirmTarget.type === "request"
                    ? "the upload request link"
                    : "the asset"
                }{" "}
                <span className="text-white font-bold font-mono">
                  "{deleteConfirmTarget.extraLabel || deleteConfirmTarget.idOrName}"
                </span>
                ? {
                  deleteConfirmTarget.type === "request"
                    ? "This will permanently revoke the upload link so clients can no longer upload files to it."
                    : "This deletes all files from disk and removes database history metadata."
                }
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setDeleteConfirmTarget(null)}
                  className="px-4 py-2 rounded-full border border-white/5 text-xs text-white/70 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition text-xs font-bold"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxAsset && (
          <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setLightboxAsset(null)}
          >
            <div className="absolute top-4 right-4 flex items-center gap-3" onClick={e => e.stopPropagation()}>
              <a 
                href={lightboxAsset.cloudinaryUrl} 
                download={lightboxAsset.originalFilename}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center gap-1.5 text-xs font-bold text-white transition"
              >
                <Download className="h-4 w-4" />
                Download Original
              </a>
              <button 
                onClick={() => setLightboxAsset(null)}
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <EyeOff className="h-5 w-5" />
              </button>
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl max-h-[75vh] w-full flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={lightboxAsset.cloudinaryUrl} 
                alt={lightboxAsset.originalFilename} 
                className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/10 shadow-2xl"
              />
            </motion.div>

            <div className="mt-6 text-center" onClick={e => e.stopPropagation()}>
              <h4 className="text-sm font-bold text-white">{lightboxAsset.originalFilename}</h4>
              <p className="text-xs text-white/40 mt-1">
                Folder: {lightboxAsset.businessName} &bull; Uploaded {new Date(lightboxAsset.createdAt).toLocaleDateString()}
              </p>
              {lightboxAsset.notes && (
                <p className="text-xs text-white/50 italic mt-2 max-w-md mx-auto">Instructions: "{lightboxAsset.notes}"</p>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
