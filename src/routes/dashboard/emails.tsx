import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Mail,
  Search,
  Trash2,
  Calendar,
  Loader2,
  AlertCircle,
  Inbox,
  User,
  RefreshCw,
  Building2,
  DollarSign,
  Layers,
  ChevronRight,
  MessageSquare,
  X,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getWebsiteEmailsFn, deleteWebsiteEmailFn } from "@/lib/dashboard.functions.server";
import { ConfirmModal } from "@/components/ConfirmModal";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/emails")({
  component: WebsiteEmailsPage,
});

interface WebsiteEmail {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  type: "contact" | "newsletter";
  submittedAt: string;
}

function WebsiteEmailsPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  const [emails, setEmails] = useState<WebsiteEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "contact" | "newsletter">("all");
  
  // Selected email to view full details in a modal
  const [selectedEmail, setSelectedEmail] = useState<WebsiteEmail | null>(null);
  
  // Deletion confirm modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch emails
  const fetchEmails = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const data = await getWebsiteEmailsFn();
      setEmails(data as WebsiteEmail[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load website emails");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Real-time listener for inbound website emails/leads
  useEffect(() => {
    let activeSocket: any = null;

    import("socket.io-client").then(({ io }) => {
      const RELAY_URL = import.meta.env.VITE_RELAY_URL ?? "http://localhost:3001";
      const socket = io(RELAY_URL);
      activeSocket = socket;

      socket.on("connect", () => {
        // Join admin notification room
        socket.emit("join-admin");
      });

      socket.on("receive-new-email", (data: { email: WebsiteEmail }) => {
        if (data && data.email) {
          setEmails((prev) => {
            // Avoid duplicates
            if (prev.some((e) => e.id === data.email.id)) return prev;
            return [data.email, ...prev];
          });
        }
      });
    });

    return () => {
      if (activeSocket) {
        activeSocket.disconnect();
      }
    };
  }, []);

  // Handle Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteWebsiteEmailFn({ data: { id: deleteId } });
      setEmails((prev) => prev.filter((e) => e.id !== deleteId));
      toast.success("Entry deleted successfully");
      if (selectedEmail?.id === deleteId) {
        setSelectedEmail(null);
      }
    } catch (err) {
      toast.error("Failed to delete entry");
    } finally {
      setDeleteId(null);
      setDeleting(false);
    }
  };

  // Filtered emails list
  const filteredEmails = useMemo(() => {
    return emails.filter((item) => {
      // Tab filter
      if (activeTab !== "all" && item.type !== activeTab) return false;
      
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query) ?? false;
        const matchesEmail = item.email.toLowerCase().includes(query);
        const matchesCompany = item.company?.toLowerCase().includes(query) ?? false;
        const matchesMsg = item.message?.toLowerCase().includes(query) ?? false;
        const matchesService = item.service?.toLowerCase().includes(query) ?? false;
        const matchesPhone = item.phone?.toLowerCase().includes(query) ?? false;
        
        return matchesName || matchesEmail || matchesCompany || matchesMsg || matchesService || matchesPhone;
      }
      
      return true;
    });
  }, [emails, activeTab, searchQuery]);

  // Counts for summary metrics
  const stats = useMemo(() => {
    const total = emails.length;
    const contact = emails.filter((e) => e.type === "contact").length;
    const newsletter = emails.filter((e) => e.type === "newsletter").length;
    return { total, contact, newsletter };
  }, [emails]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Website Emails & Leads</h1>
          <p className={`mt-1 text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Track and manage incoming newsletter signups and contact inquiries from the main site.
          </p>
        </div>
        <button
          onClick={() => fetchEmails(true)}
          className={`self-start inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
            isDark
              ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
          }`}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Leads", value: stats.total, icon: Inbox, color: "from-blue-500 to-indigo-600" },
          { label: "Contact Inquiries", value: stats.contact, icon: MessageSquare, color: "from-purple-500 to-pink-500" },
          { label: "Newsletter Signups", value: stats.newsletter, icon: Mail, color: "from-amber-500 to-orange-500" },
        ].map((stat, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-5 relative overflow-hidden ${
              isDark ? "border-white/5 bg-[#12052c]/40" : "border-slate-200/60 bg-white shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/40" : "text-slate-400"}`}>
                {stat.label}
              </span>
              <div className={`rounded-xl p-2 bg-gradient-to-br ${stat.color} text-white`}>
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div
        className={`rounded-2xl border p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${
          isDark ? "border-white/5 bg-[#12052c]/30" : "border-slate-200/60 bg-white shadow-sm"
        }`}
      >
        {/* Tabs */}
        <div className={`flex rounded-lg p-0.5 text-xs font-semibold ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
          {[
            { id: "all", label: "All Leads" },
            { id: "contact", label: "Contact Form" },
            { id: "newsletter", label: "Newsletter" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-md px-4 py-1.5 transition ${
                activeTab === tab.id
                  ? isDark
                    ? "bg-[#a855f7]/25 text-[#c9a4ff]"
                    : "bg-white text-[#a855f7] shadow"
                  : isDark
                  ? "text-white/40 hover:text-white/70"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-white/30" : "text-slate-400"}`} />
          <input
            type="text"
            placeholder="Search leads…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl border py-2 pl-9 pr-4 text-xs transition focus:outline-none ${
              isDark
                ? "border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-[#a855f7]/40"
                : "border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/40"
            }`}
          />
        </div>
      </div>

      {/* Main Content Layout */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#a855f7]" />
        </div>
      ) : error ? (
        <div className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-12 text-center ${
          isDark ? "border-white/5 bg-[#12052c]/40" : "border-slate-200/60 bg-white shadow-sm"
        }`}>
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-sm font-medium text-red-400">{error}</p>
          <button onClick={() => fetchEmails(true)} className="text-xs text-[#a855f7] underline">
            Try again
          </button>
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className={`flex flex-col items-center justify-center gap-4 rounded-2xl border py-16 px-6 text-center ${
          isDark ? "border-white/5 bg-[#12052c]/40" : "border-slate-200/60 bg-white shadow-sm"
        }`}>
          <div className={`rounded-2xl p-4 ${isDark ? "bg-white/5 text-white/30" : "bg-slate-50 text-slate-400"}`}>
            <Inbox className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-sm font-bold">No leads found</h3>
            <p className={`mt-1 text-xs max-w-sm ${isDark ? "text-white/40" : "text-slate-400"}`}>
              {searchQuery ? "Try checking your spelling or adjusting filters to find what you need." : "Inquiries filled out on the public website pages will appear here in real time."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* List panel */}
          <div className="lg:col-span-2 space-y-3">
            {filteredEmails.map((item) => {
              const isContact = item.type === "contact";
              return (
                <div
                  key={item.id}
                  onClick={() => isContact && setSelectedEmail(item)}
                  className={`group rounded-2xl border p-5 flex items-start gap-4 transition relative overflow-hidden ${
                    isContact ? "cursor-pointer" : ""
                  } ${
                    isDark
                      ? selectedEmail?.id === item.id
                        ? "border-[#a855f7]/30 bg-[#a855f7]/10"
                        : "border-white/5 bg-[#12052c]/40 hover:bg-white/[0.02]"
                      : selectedEmail?.id === item.id
                      ? "border-[#a855f7]/30 bg-[#a855f7]/5"
                      : "border-slate-200/60 bg-white hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  {/* Left Column: Icon depending on type */}
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-xs font-bold ${
                      isContact
                        ? isDark
                          ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                          : "bg-purple-50 border-purple-100 text-purple-600"
                        : isDark
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        : "bg-amber-50 border-amber-100 text-amber-600"
                    }`}
                  >
                    {isContact ? <MessageSquare className="h-4.5 w-4.5" /> : <Mail className="h-4.5 w-4.5" />}
                  </div>

                  {/* Middle Column: details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="block truncate text-xs font-bold">
                        {isContact ? item.name : "Newsletter Signup"}
                      </span>
                      <span className={`shrink-0 text-[10px] ${isDark ? "text-white/35" : "text-slate-400"}`}>
                        {formatDate(item.submittedAt)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                      <span className={`block truncate text-xs ${isDark ? "text-white/60" : "text-slate-600"}`}>
                        {item.email}
                      </span>
                      {isContact && item.company && (
                        <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-medium ${isDark ? "text-white/40" : "text-slate-400"}`}>
                          <Building2 className="h-3 w-3" />
                          {item.company}
                        </span>
                      )}
                    </div>

                    {isContact && item.message && (
                      <p className={`line-clamp-2 text-[11px] mt-2 leading-relaxed ${isDark ? "text-white/40" : "text-slate-500"}`}>
                        {item.message}
                      </p>
                    )}

                    {isContact && (
                      <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-dashed border-white/5">
                        {item.service && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                            isDark ? "bg-[#12052c] border-white/10 text-white/60" : "bg-slate-50 border-slate-200 text-slate-500"
                          }`}>
                            {item.service}
                          </span>
                        )}
                        {item.budget && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                            isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                          }`}>
                            Budget: {item.budget}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex shrink-0 items-center justify-end self-center pl-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(item.id);
                      }}
                      className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-red-500/15 text-white/30 hover:text-red-400 transition"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {isContact && (
                      <ChevronRight className={`h-4 w-4 text-white/20 transition-transform group-hover:translate-x-0.5 ${
                        selectedEmail?.id === item.id ? "rotate-90 text-[#a855f7]/55" : ""
                      }`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details Sidebar Panel (Contact Leads Only) */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              {selectedEmail ? (
                <motion.div
                  key={selectedEmail.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`rounded-2xl border p-6 space-y-6 sticky top-28 ${
                    isDark ? "border-white/5 bg-[#12052c]/50" : "border-slate-200 bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-purple-500/10 p-2 text-purple-400">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider">Inquiry Details</h4>
                        <span className={`text-[10px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                          Received {formatDate(selectedEmail.submittedAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className={`rounded-lg p-1.5 transition ${
                        isDark ? "hover:bg-white/10 text-white/50" : "hover:bg-slate-100 text-slate-400"
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <span className={`block font-semibold mb-1 uppercase tracking-wider text-[10px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                        Name
                      </span>
                      <div className="flex items-center gap-2 font-medium">
                        <User className="h-3.5 w-3.5 text-white/40" />
                        <span>{selectedEmail.name}</span>
                      </div>
                    </div>

                    <div>
                      <span className={`block font-semibold mb-1 uppercase tracking-wider text-[10px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                        Email
                      </span>
                      <div className="flex items-center gap-2 font-medium">
                        <Mail className="h-3.5 w-3.5 text-white/40" />
                        <a href={`mailto:${selectedEmail.email}`} className="text-[#a855f7] hover:underline">
                          {selectedEmail.email}
                        </a>
                      </div>
                    </div>

                    {selectedEmail.phone && (
                      <div>
                        <span className={`block font-semibold mb-1 uppercase tracking-wider text-[10px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                          Phone
                        </span>
                        <div className="flex items-center gap-2 font-medium">
                          <Phone className="h-3.5 w-3.5 text-white/40" />
                          <a href={`tel:${selectedEmail.phone}`} className="text-[#a855f7] hover:underline">
                            {selectedEmail.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {selectedEmail.company && (
                      <div>
                        <span className={`block font-semibold mb-1 uppercase tracking-wider text-[10px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                          Company
                        </span>
                        <div className="flex items-center gap-2 font-medium">
                          <Building2 className="h-3.5 w-3.5 text-white/40" />
                          <span>{selectedEmail.company}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 border-t border-b border-dashed border-white/5 py-4">
                      <div>
                        <span className={`block font-semibold mb-1.5 uppercase tracking-wider text-[10px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                          Service
                        </span>
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          isDark ? "bg-[#12052c] border border-white/10" : "bg-slate-50 border border-slate-200 text-slate-600"
                        }`}>
                          {selectedEmail.service || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className={`block font-semibold mb-1.5 uppercase tracking-wider text-[10px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                          Budget Range
                        </span>
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {selectedEmail.budget || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className={`block font-semibold mb-2 uppercase tracking-wider text-[10px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                        Project Message
                      </span>
                      <div className={`p-4 rounded-xl leading-relaxed text-xs border ${
                        isDark ? "bg-white/[0.02] border-white/5 text-white/90" : "bg-slate-50 border-slate-100 text-slate-700"
                      }`}>
                        {selectedEmail.message}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className={`rounded-2xl border p-12 text-center text-xs flex flex-col items-center gap-3 sticky top-28 ${
                  isDark ? "border-white/5 bg-[#12052c]/10 text-white/30" : "border-slate-200 bg-slate-50/50 text-slate-400"
                }`}>
                  <MessageSquare className="h-8 w-8 text-white/20" />
                  <p>Select a contact form lead to view the complete details and inquiry message.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Lead Entry"
        message="Are you sure you want to permanently delete this lead entry? This action cannot be undone."
        confirmText={deleting ? "Deleting..." : "Delete Lead"}
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
