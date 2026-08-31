import { createFileRoute } from "@tanstack/react-router";
import { 
  Download, 
  Copy, 
  Check, 
  Lock, 
  AlertCircle, 
  Maximize2, 
  Minimize2, 
  Eye, 
  HardDrive, 
  Calendar,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import logoImg from "@/assets/logo.png";
import { getSharedAssetByTokenFn } from "@/lib/dashboard.functions.server";

export const Route = createFileRoute("/share/$token")({
  loader: async ({ params }) => {
    try {
      const asset = await getSharedAssetByTokenFn({ data: { token: params.token } });
      if (!asset) {
        return { asset: null, error: "The requested shared image link is invalid, expired, or was removed." };
      }
      return { asset, error: null };
    } catch (err: any) {
      return { asset: null, error: err.message || "Failed to load shared image." };
    }
  },
  head: ({ loaderData }) => {
    const filename = loaderData?.asset?.originalFilename || "Shared Image";
    const title = `${filename} — Shared Asset | StellR IT`;
    const description = "View and download this high-resolution shared image securely hosted on StellR IT.";
    const imageUrl = loaderData?.asset?.cloudinaryUrl;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: SharedImageViewerPage,
});

function formatSize(bytes: number) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
    console.warn("Direct blob download fallback triggered:", err);
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

function SharedImageViewerPage() {
  const loaderData = Route.useLoaderData() as {
    asset: {
      shareToken: string;
      originalFilename: string;
      fileType: string;
      mimeType: string;
      fileSize: number;
      cloudinaryUrl: string;
      businessName: string;
      notes?: string;
      createdAt: string;
    } | null;
    error: string | null;
  };

  const asset = loaderData.asset;
  const error = loaderData.error;

  const imgRef = useRef<HTMLImageElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [asset?.cloudinaryUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleDownload = async () => {
    if (!asset) return;
    setIsDownloading(true);
    try {
      await triggerDownload(asset.cloudinaryUrl, asset.originalFilename);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070119] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-[#a855f7] selection:text-white relative overflow-x-hidden font-sans">
      {/* Background ambient lighting effects */}
      <div className="fixed top-[-15%] left-[-15%] w-[50%] h-[50%] rounded-full bg-[#a855f7]/15 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-15%] w-[50%] h-[50%] rounded-full bg-[#ff8a5b]/12 blur-[140px] pointer-events-none" />
      <div className="fixed top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] rounded-full bg-[#6366f1]/08 blur-[180px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img 
            src={logoImg} 
            alt="StellR IT" 
            className="h-9 sm:h-10 w-auto object-contain" 
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <div className="hidden sm:block h-4 w-px bg-white/10" />
          <span className="hidden sm:inline-block text-xs font-semibold tracking-wider text-white/50 uppercase">
            Asset Portal
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/70">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span className="hidden xs:inline">Secure Link</span>
          </div>

          {asset && (
            <button
              onClick={handleCopyLink}
              className="h-9 px-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-1.5 text-xs font-bold text-white transition active:scale-95"
              title="Copy shareable link"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-[11px]">Copy Link</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-6xl mx-auto my-6 sm:my-8 flex-1 flex flex-col justify-center">
        {error || !asset ? (
          /* Error State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#11042b]/80 border border-white/10 rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xl backdrop-blur-xl space-y-6"
          >
            <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                Asset Unavailable
              </h1>
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
                {error || "The shared image link you're attempting to access does not exist or has expired."}
              </p>
            </div>
            <div className="pt-2">
              <a
                href="https://stellrit.com"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white text-xs font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition active:scale-95"
              >
                Visit StellR IT
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        ) : (
          /* Success: Shared Image Display */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Image Card Container */}
            <div className="relative bg-[#11042b]/70 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl group">
              {/* Image Preview Canvas */}
              <div className="relative min-h-[320px] sm:min-h-[440px] max-h-[75vh] w-full flex items-center justify-center bg-black/40 p-4 sm:p-8 select-none overflow-hidden">
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none z-0">
                    <div className="h-9 w-9 rounded-full border-2 border-[#a855f7] border-t-transparent animate-spin" />
                    <span className="text-[10px] text-white/40">Loading image...</span>
                  </div>
                )}

                {imageError ? (
                  <div className="text-center py-12 space-y-3 z-10">
                    <AlertCircle className="h-8 w-8 text-rose-400 mx-auto opacity-80" />
                    <p className="text-xs text-white/50">Unable to preview image directly.</p>
                    <a
                      href={asset.cloudinaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold text-white hover:bg-white/20 transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Asset Link
                    </a>
                  </div>
                ) : (
                  <img
                    ref={imgRef}
                    src={asset.cloudinaryUrl}
                    alt={asset.originalFilename}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                      setImageError(true);
                      setImageLoaded(true);
                    }}
                    className={`relative z-10 max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300 ${
                      imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-98"
                    }`}
                  />
                )}

                {/* Floating Fullscreen Trigger */}
                {imageLoaded && !imageError && (
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-4 right-4 z-20 h-9 w-9 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md transition active:scale-90"
                    title="Expand to Fullscreen View"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Asset Details & Action Bar */}
              <div className="p-5 sm:p-7 border-t border-white/5 bg-[#0e0326]/90 flex flex-col md:flex-row md:items-center justify-between gap-5">
                {/* Left: Metadata */}
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ff8a5b]/15 border border-[#ff8a5b]/25 text-[10px] font-bold text-[#ff8a5b] uppercase tracking-wider">
                      Shared Image
                    </span>
                    <span className="text-xs text-white/40">&bull;</span>
                    <span className="text-xs text-white/60 font-medium truncate">
                      {asset.businessName}
                    </span>
                  </div>

                  <h1 className="text-lg sm:text-xl font-bold text-white truncate tracking-tight">
                    {asset.originalFilename}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/45">
                    <div className="flex items-center gap-1.5 font-mono">
                      <HardDrive className="h-3.5 w-3.5 text-[#a855f7]" />
                      <span>{formatSize(asset.fileSize)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#ff8a5b]" />
                      <span>{new Date(asset.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {asset.notes && (
                    <div className="mt-3 p-3 rounded-xl border border-white/5 bg-white/5 text-xs text-white/70 italic max-w-xl">
                      "{asset.notes}"
                    </div>
                  )}
                </div>

                {/* Right: Primary Action Buttons */}
                <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="h-11 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-xs font-bold text-white transition active:scale-95"
                  >
                    <Eye className="h-4 w-4 text-white/70" />
                    <span>Zoom & View</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="h-11 px-6 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] transition text-xs font-bold flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>{isDownloading ? "Downloading..." : "Download Image"}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && asset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Top Lightbox Bar */}
            <div 
              className="absolute top-4 inset-x-4 max-w-6xl mx-auto flex items-center justify-between z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-left min-w-0 pr-4">
                <span className="block text-sm font-bold text-white truncate">{asset.originalFilename}</span>
                <span className="text-[10px] text-white/40 font-mono">{formatSize(asset.fileSize)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="h-9 px-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white transition active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition active:scale-90"
                  title="Close (Esc)"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* High-Res View */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="max-w-6xl max-h-[85vh] w-full flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={asset.cloudinaryUrl}
                alt={asset.originalFilename}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/30">
        <span>&copy; {new Date().getFullYear()} StellR IT. All Rights Reserved.</span>
        <span>Secure Cloudinary Digital Asset Infrastructure</span>
      </footer>
    </div>
  );
}
