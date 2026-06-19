import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { Settings, Save, Lock, Bell, Eye } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">System Settings</h1>
        <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
          Adjust portal credentials, notification rules, and visual preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details */}
        <div className={`lg:col-span-2 rounded-2xl border p-6 shadow-2xl space-y-6 transition duration-300 ${
          isDark
            ? "bg-[#12052c]/65 border-white/5 text-white"
            : "bg-white border-slate-200/60 shadow-sm text-slate-800"
        }`}>
          <h3 className={`text-base font-semibold flex items-center gap-2 border-b pb-3 ${
            isDark ? "border-white/5" : "border-slate-100"
          }`}>
            <Lock className="h-4.5 w-4.5 text-[#a855f7]" />
            Operator Credentials
          </h3>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>First Name</label>
                <input
                  type="text"
                  defaultValue="Jiten"
                  className={`w-full h-10 px-3.5 rounded-xl border text-sm transition duration-300 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50 ${
                    isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Last Name</label>
                <input
                  type="text"
                  defaultValue="Sony"
                  className={`w-full h-10 px-3.5 rounded-xl border text-sm transition duration-300 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50 ${
                    isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-500"}`}>Email Address</label>
              <input
                type="email"
                defaultValue="jiten@stellrit.com"
                className={`w-full h-10 px-3.5 rounded-xl border text-sm transition duration-300 focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/50 ${
                  isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              Save Preferences
            </button>
          </form>
        </div>

        {/* Configurations list */}
        <div className={`rounded-2xl border p-6 shadow-2xl space-y-6 flex flex-col justify-between transition duration-300 ${
          isDark
            ? "bg-[#12052c]/65 border-white/5 text-white"
            : "bg-white border-slate-200/60 shadow-sm text-slate-800"
        }`}>
          <div>
            <h3 className={`text-base font-semibold flex items-center gap-2 border-b pb-3 ${
              isDark ? "border-white/5" : "border-slate-100"
            }`}>
              <Bell className="h-4.5 w-4.5 text-[#ff8a5b]" />
              Notifications
            </h3>

            <div className={`space-y-4 mt-4 text-xs ${isDark ? "text-white/70" : "text-slate-600"}`}>
              <div className="flex items-center justify-between">
                <span>Deployment Status Emails</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className={`rounded h-4 w-4 accent-[#a855f7] ${
                    isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Weekly Analytics Digest</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className={`rounded h-4 w-4 accent-[#a855f7] ${
                    isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Security Gate Warnings</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className={`rounded h-4 w-4 accent-[#a855f7] ${
                    isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
