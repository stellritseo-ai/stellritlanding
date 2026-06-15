import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { Image, Film, Plus, Eye, Download, Search } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/assets")({
  component: AssetsPage,
});

const ASSETS = [
  {
    id: "a1",
    name: "Sizzle_Reel_V5.mp4",
    type: "Video",
    size: "42.8 MB",
    dimensions: "1920x1080",
    icon: Film,
    color: "from-purple-500/20 to-indigo-500/20 text-[#a855f7]",
  },
  {
    id: "a2",
    name: "Harmony_Brand_Guide.pdf",
    type: "Document",
    size: "8.4 MB",
    dimensions: "A4 Format",
    icon: Image,
    color: "from-pink-500/20 to-rose-500/20 text-pink-400",
  },
  {
    id: "a3",
    name: "Hero_Section_Concept_3.jpg",
    type: "Image",
    size: "2.1 MB",
    dimensions: "3840x2160",
    icon: Image,
    color: "from-amber-500/20 to-orange-500/20 text-[#ff8a5b]",
  },
  {
    id: "a4",
    name: "Client_Testimonial_Subtitles.srt",
    type: "Subtitles",
    size: "140 KB",
    dimensions: "Timed Text",
    icon: Film,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
  },
];

function AssetsPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Client Image & Video</h1>
          <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Browse branding files, design proofs, and loop sizzle videos.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-lg transition text-xs font-bold active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Upload Asset
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ASSETS.map((asset, i) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className={`rounded-2xl border p-5 transition group flex flex-col justify-between ${
              isDark
                ? "bg-[#12052c]/65 border-white/5 hover:border-white/10"
                : "bg-white border-slate-200/60 hover:border-slate-350 shadow-sm"
            }`}
          >
            {/* Thumbnail Box */}
            <div className={`aspect-video rounded-xl bg-gradient-to-br ${asset.color} border flex items-center justify-center relative overflow-hidden ${
              isDark ? "border-white/5" : "border-slate-200"
            }`}>
              <asset.icon className="h-10 w-10 opacity-75 group-hover:scale-110 transition duration-300" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                <button className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="mt-4 space-y-1">
              <span className={`block text-xs font-semibold truncate ${
                isDark ? "text-white/90" : "text-slate-700"
              }`}>
                {asset.name}
              </span>
              <div className={`flex items-center justify-between text-[10px] font-mono ${
                isDark ? "text-white/40" : "text-slate-400"
              }`}>
                <span>{asset.dimensions}</span>
                <span>{asset.size}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
