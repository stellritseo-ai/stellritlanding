import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  Home,
  Menu,
  X,
  Bell,
  Search,
  Activity,
  LogOut,
  Briefcase,
  ListTodo,
  FileImage,
  Users2,
  Settings,
  MessageSquare,
  Globe,
  Sun,
  Moon,
  UserPlus,
  RotateCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/logo.png";
import { DashboardThemeContext } from "../hooks/useDashboardTheme";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("stellr_admin_token");
    if (!token && location.pathname !== "/login") {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("stellr_admin_token");
      localStorage.removeItem("stellr_admin_user");
      navigate({ to: "/login" });
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("dashboard-theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "dark";
  });

  useEffect(() => {
    localStorage.setItem("dashboard-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "New Member Added",
      message: "Liam Neeson was registered as a Viewer role.",
      time: "10m ago",
      read: false,
      type: "member",
    },
    {
      id: "n2",
      title: "Security Gate Audited",
      message: "CPU Compute stable. 4 Edge gateway ports active.",
      time: "24m ago",
      read: false,
      type: "security",
    },
    {
      id: "n3",
      title: "Brotli Compressions Live",
      message: "Dynamic assets caching Brotli compressed at edges.",
      time: "2h ago",
      read: true,
      type: "system",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const menuItems = [
    {
      to: "/dashboard",
      label: "Analytics Hub",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: "/dashboard/projects",
      label: "Project Management",
      icon: Briefcase,
    },
    {
      to: "/dashboard/tasks",
      label: "StellR Task",
      icon: ListTodo,
    },
    {
      to: "/dashboard/management",
      label: "Website Management",
      icon: Globe,
    },
    {
      to: "/dashboard/assets",
      label: "Client Image & Video",
      icon: FileImage,
    },
    {
      to: "/dashboard/clients",
      label: "Client List",
      icon: Users2,
    },
    {
      to: "/dashboard/members",
      label: "Add Member",
      icon: UserPlus,
    },
    {
      to: "/dashboard/chat",
      label: "Live Chat",
      icon: MessageSquare,
    },
    {
      to: "/dashboard/admin",
      label: "Administration",
      icon: ShieldAlert,
    },
    {
      to: "/dashboard/settings",
      label: "Setting",
      icon: Settings,
    },
  ];

  const isDark = theme === "dark";

  return (
    <div
      className={`relative min-h-screen font-sans overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#0d0220] text-white" : "bg-[#FAF8F5] text-slate-800"
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Blob 1 */}
        <div
          className={`absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full blur-[120px] transition duration-500 ${
            isDark ? "opacity-25" : "opacity-10"
          }`}
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          }}
        />
        {/* Blob 2 */}
        <div
          className={`absolute -bottom-[20%] -right-[10%] h-[700px] w-[700px] rounded-full blur-[150px] transition duration-500 ${
            isDark ? "opacity-20" : "opacity-8"
          }`}
          style={{
            background: "radial-gradient(circle, #ff8a5b 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Container */}
      <div className="flex min-h-screen">
        {/* Sidebar - Desktop (Fixed layout for bulletproof sticky behavior) */}
        <aside
          className={`hidden lg:flex w-72 flex-col border-r backdrop-blur-md p-6 fixed left-0 top-0 bottom-0 h-screen overflow-y-auto z-30 transition duration-300 ${
            isDark
              ? "bg-[#12052c]/85 border-white/5"
              : "bg-white border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
          }`}
        >
          {/* Header/Logo (Bigger, adapts filter to theme) */}
          <div className="flex items-center px-2 py-4 mb-8">
            <img
              src={logoImg}
              alt="StellR IT Logo"
              className="h-11 md:h-12 w-auto object-contain transition duration-300"
              style={{
                filter: isDark ? "brightness(0) invert(1)" : "none",
              }}
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <div
              className={`text-[11px] font-bold uppercase tracking-[0.2em] px-3 mb-3 transition ${
                isDark ? "text-white/30" : "text-slate-400"
              }`}
            >
              Core Modules
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-300 group text-[13px] font-medium ${
                  isDark
                    ? "text-white/70 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                activeProps={{
                  className: isDark
                    ? "bg-[#a855f7]/15 border border-[#a855f7]/30 text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.15)] text-[13px]"
                    : "bg-[#a855f7]/10 border border-[#a855f7]/20 text-[#a855f7] font-semibold text-[13px]",
                }}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0 group-hover:scale-110 transition duration-300" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer / User Profile */}
          <div className={`pt-6 border-t mt-auto ${isDark ? "border-white/5" : "border-slate-100"}`}>
            <div
              className={`flex items-center gap-3 p-2 rounded-xl border transition duration-300 ${
                isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-sm text-white">
                JS
              </div>
              <div className="flex-1 min-w-0">
                <span className={`block text-sm font-semibold truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                  Jiten Sony
                </span>
                <span className={`block text-xs truncate flex items-center gap-1.5 ${isDark ? "text-white/50" : "text-slate-400"}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Operator
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                  isDark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Spacer for desktop fixed sidebar alignment */}
        <div className="hidden lg:block w-72 shrink-0" />

        {/* Outer Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header
            className={`h-20 shrink-0 border-b backdrop-blur-md px-6 md:px-10 flex items-center justify-between z-40 transition duration-300 ${
              isDark ? "bg-[#0d0220]/60 border-white/5" : "bg-[#FAF8F5]/80 border-slate-200/60"
            }`}
          >
            {/* Search/Left block */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden h-10 w-10 flex items-center justify-center rounded-xl border transition ${
                  isDark
                    ? "bg-white/5 text-white border-white/10 hover:bg-white/10"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="relative hidden md:block w-72">
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-white/40" : "text-slate-400"}`} />
                <input
                  type="text"
                  placeholder="Universal command search..."
                  className={`w-full h-10 pl-10 pr-4 border rounded-full text-xs font-medium transition duration-300 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50"
                      : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50"
                  }`}
                />
              </div>
            </div>

            {/* Quick Actions / Right block */}
            <div className="flex items-center gap-3">
              {/* Back to Website Button */}
              <Link
                to="/"
                className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border transition duration-300 text-xs font-semibold ${
                  isDark
                    ? "border-white/10 bg-white/5 hover:bg-white/10 text-white"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                Main Website
              </Link>

              {/* Status Indicator */}
              <div
                className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-semibold tracking-wide uppercase transition duration-300 ${
                  isDark
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                }`}
              >
                <Activity className="h-3 w-3 animate-pulse" />
                System Online
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => window.location.reload()}
                type="button"
                className={`h-10 w-10 flex items-center justify-center rounded-full border transition duration-300 ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
                title="Refresh Dashboard"
              >
                <RotateCw className="h-4.5 w-4.5 hover:rotate-180 transition-transform duration-500" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                type="button"
                className={`h-10 w-10 flex items-center justify-center rounded-full border transition duration-300 ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`h-10 w-10 flex items-center justify-center rounded-full border transition duration-300 relative ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                  title="Notifications"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      {/* Invisible backdrop to dismiss on click outside */}
                      <div
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setNotificationsOpen(false)}
                      />

                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className={`absolute right-0 mt-3.5 w-80 rounded-2xl border p-4 shadow-2xl z-50 backdrop-blur-xl ${
                          isDark
                            ? "bg-[#12052c]/95 border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                            : "bg-white border-slate-200/80 text-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.1)]"
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            System Alerts ({unreadCount})
                          </span>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllRead}
                              className="text-[10px] font-semibold text-[#a855f7] hover:underline"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>

                        {/* List */}
                        <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                          {notifications.length > 0 ? (
                            notifications.map((n) => {
                              return (
                                <div
                                  key={n.id}
                                  onClick={() => toggleRead(n.id)}
                                  className={`p-3 rounded-xl border transition duration-300 flex items-start gap-3 cursor-pointer group relative ${
                                    n.read
                                      ? isDark
                                        ? "bg-white/[0.01] border-white/5 opacity-60 hover:opacity-100"
                                        : "bg-slate-50/50 border-slate-100 opacity-70 hover:opacity-100"
                                      : isDark
                                      ? "bg-[#a855f7]/5 border-[#a855f7]/15 hover:border-[#a855f7]/25"
                                      : "bg-[#a855f7]/5 border-[#a855f7]/10 hover:border-[#a855f7]/20"
                                  }`}
                                >
                                  {/* Unread circle indicator */}
                                  {!n.read && (
                                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#a855f7]" />
                                  )}

                                  {/* Icon badge */}
                                  <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 ${
                                    n.type === "member"
                                      ? "bg-[#a855f7]/10 border-[#a855f7]/20 text-[#a855f7]"
                                      : n.type === "security"
                                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                      : "bg-[#ff8a5b]/10 border-[#ff8a5b]/20 text-[#ff8a5b]"
                                  }`}>
                                    {n.type === "member" ? (
                                      <UserPlus className="h-4 w-4" />
                                    ) : n.type === "security" ? (
                                      <ShieldAlert className="h-4 w-4" />
                                    ) : (
                                      <Activity className="h-4 w-4" />
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                      <span className="font-semibold text-xs truncate">
                                        {n.title}
                                      </span>
                                    </div>
                                    <p className={`text-[10px] leading-relaxed ${isDark ? "text-white/50" : "text-slate-500"}`}>
                                      {n.message}
                                    </p>
                                    <span className={`block text-[9px] font-mono mt-1 ${isDark ? "text-white/30" : "text-slate-400"}`}>
                                      {n.time}
                                    </span>
                                  </div>

                                  {/* Clear button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      clearNotification(n.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded hover:bg-red-500/15 text-white/40 hover:text-red-400 transition"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              );
                            })
                          ) : (
                            <div className="py-6 text-center text-xs opacity-40">
                              No active notifications.
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Main Outlet (renders subpages, passes down theme context value) */}
          <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
            <DashboardThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
              <Outlet />
            </DashboardThemeContext.Provider>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-out Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed inset-y-0 left-0 z-50 w-72 border-r p-6 flex flex-col lg:hidden transition duration-300 ${
                isDark ? "bg-[#12052c] border-white/10" : "bg-white border-slate-200"
              }`}
            >
              {/* Close Button & Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <img
                    src={logoImg}
                    alt="StellR IT Logo"
                    className="h-10 w-auto object-contain"
                    style={{
                      filter: isDark ? "brightness(0) invert(1)" : "none",
                    }}
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg border transition ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white/50 hover:bg-[#a855f7]/20"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 space-y-2">
                <div
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 mb-2 ${
                    isDark ? "text-white/30" : "text-slate-400"
                  }`}
                >
                  Core Modules
                </div>
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.exact }}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-[13px] ${
                      isDark
                        ? "text-white/70 hover:text-white hover:bg-white/5"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                    activeProps={{
                      className: isDark
                        ? "bg-[#a855f7]/15 border border-[#a855f7]/30 text-white font-semibold text-[13px]"
                        : "bg-[#a855f7]/10 border border-[#a855f7]/20 text-[#a855f7] font-semibold text-[13px]",
                    }}
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Sidebar Footer */}
              <div className={`pt-6 border-t mt-auto space-y-3 ${isDark ? "border-white/5" : "border-slate-100"}`}>
                <Link
                  to="/"
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-full border text-xs font-semibold transition ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <Home className="h-3.5 w-3.5" />
                  Back to Website
                </Link>

                 <div
                  className={`flex items-center gap-3 p-2 rounded-xl border transition ${
                    isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                    JS
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`block text-xs font-semibold truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                      Jiten Sony
                    </span>
                    <span className={`block text-[10px] truncate flex items-center gap-1 ${isDark ? "text-white/50" : "text-slate-400"}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Operator
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      isDark ? "text-white/60 hover:text-white hover:bg-white/10" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                    title="Log Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
