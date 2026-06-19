import { createFileRoute } from "@tanstack/react-router";
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lock,
  ChevronRight,
  RefreshCw,
  Clock,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/upload/$token")({
  component: ClientUploadPortal,
});

import {
  getAssetRequestByTokenFn,
  generateCloudinarySignatureFn,
  registerUploadedAssetFn
} from "@/lib/dashboard.functions.server";

interface RequestMetadata {
  businessName: string;
  clientName?: string;
  notes?: string;
  maxUploadSize: number;
  allowedFileTypes: string[];
  status: string;
  expirationDate?: string;
  expired?: boolean;
}

interface SelectedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: "image" | "video" | "document";
  previewUrl?: string;
}

function formatSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatSpeed(bytesPerSec: number) {
  if (bytesPerSec === 0) return "0 B/s";
  const k = 1024;
  const sizes = ["B/s", "KB/s", "MB/s", "GB/s"];
  const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
  return parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatTime(seconds: number) {
  if (seconds <= 0 || !isFinite(seconds)) return "calculating...";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

function ClientUploadPortal() {
  const { token } = Route.useParams();

  // Portal status & data
  const [metadata, setMetadata] = useState<RequestMetadata | null>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [portalError, setPortalError] = useState<string | null>(null);

  // Form inputs
  const [businessName, setBusinessName] = useState("");
  const [notes, setNotes] = useState("");

  // File selection
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CAPTCHA State
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [expectedCaptchaAnswer, setExpectedCaptchaAnswer] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  // Upload Progress & Statistics
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Upload Receipt
  const [uploadReceipt, setUploadReceipt] = useState<{
    receiptId: string;
    timestamp: string;
    filesCount: number;
    totalSize: number;
  } | null>(null);

  // Fetch Request settings & Captcha
  const fetchPortalInfo = async () => {
    setLoadingMetadata(true);
    setPortalError(null);
    try {
      const data = await getAssetRequestByTokenFn({ data: { token } });
      if (!data) {
        throw new Error("Invalid or expired upload request token link.");
      }
      if (data.status === "Completed") {
        throw new Error("This secure upload portal has already been completed.");
      }
      setMetadata(data as any);
      if (data.businessName) setBusinessName(data.businessName);
    } catch (err: any) {
      setPortalError(err.message || "Failed to parse metadata.");
    } finally {
      setLoadingMetadata(false);
    }
  };

  const fetchCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`What is ${num1} + ${num2}?`);
    setExpectedCaptchaAnswer(num1 + num2);
    setCaptchaAnswer("");
    setCaptchaError(false);
  };

  useEffect(() => {
    fetchPortalInfo();
    fetchCaptcha();
  }, [token]);

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = (filesList: FileList) => {
    if (!metadata) return;

    const allowedFileTypes = metadata.allowedFileTypes || ["images", "videos", "documents"];
    const maxLimit = metadata.maxUploadSize || 104857600;

    const newFiles: SelectedFile[] = [];

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      
      // Limit check
      if (file.size > maxLimit) {
        alert(`File ${file.name} is larger than maximum size limit: ${formatSize(maxLimit)}`);
        continue;
      }

      // Check allowed format categories
      const mime = file.type || "";
      let detectedType: "image" | "video" | "document" = "document";
      if (mime.startsWith("image/")) detectedType = "image";
      else if (mime.startsWith("video/")) detectedType = "video";

      const categoryMap = {
        image: "images",
        video: "videos",
        document: "documents"
      };

      if (!allowedFileTypes.includes(categoryMap[detectedType])) {
        alert(`File format category for ${file.name} is not allowed for this upload request.`);
        continue;
      }

      const id = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
      const previewUrl = detectedType === "image" ? URL.createObjectURL(file) : undefined;

      newFiles.push({
        id,
        file,
        name: file.name,
        size: file.size,
        type: detectedType,
        previewUrl
      });
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const target = prev.find(f => f.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const triggerSelectFiles = () => {
    fileInputRef.current?.click();
  };

  // Submit and Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || !captchaAnswer) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadSpeed(0);
    setTimeRemaining(0);
    setUploadError(null);

    // Verify Captcha local answer
    if (parseInt(captchaAnswer.trim(), 10) !== expectedCaptchaAnswer) {
      setCaptchaError(true);
      setUploadError("Incorrect CAPTCHA puzzle answer. Please try again.");
      setUploading(false);
      fetchCaptcha();
      return;
    }

    const startTime = Date.now();
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const sigData = await generateCloudinarySignatureFn({ data: { timestamp } });

      let totalBytesUploaded = 0;
      const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);

      for (let idx = 0; idx < selectedFiles.length; idx++) {
        const sf = selectedFiles[idx];
        
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`);
          
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const fileUploaded = event.loaded;
              const totalUploaded = totalBytesUploaded + fileUploaded;
              const percent = Math.round((totalUploaded / totalSize) * 100);
              setUploadProgress(percent);

              const timePassed = (Date.now() - startTime) / 1000;
              const speed = totalUploaded / timePassed;
              setUploadSpeed(speed);

              const remainingBytes = totalSize - totalUploaded;
              setTimeRemaining(speed > 0 ? remainingBytes / speed : 0);
            }
          };

          xhr.onload = async () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const result = JSON.parse(xhr.responseText);
                totalBytesUploaded += sf.size;

                // Register in DB
                await registerUploadedAssetFn({
                  data: {
                    requestId: (metadata as any).id,
                    businessName: businessName,
                    clientName: metadata?.clientName || businessName,
                    email: metadata?.email || "",
                    phone: metadata?.phone || "",
                    originalFilename: sf.name,
                    fileType: sf.type,
                    mimeType: sf.file.type,
                    fileSize: sf.size,
                    cloudinaryUrl: result.secure_url,
                    notes: notes
                  }
                });
                resolve();
              } catch (e: any) {
                reject(new Error("Failed to register asset metadata in database."));
              }
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText || xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during file upload."));

          const clFormData = new FormData();
          clFormData.append("file", sf.file);
          clFormData.append("api_key", sigData.apiKey);
          clFormData.append("timestamp", timestamp.toString());
          clFormData.append("signature", sigData.signature);
          clFormData.append("folder", sigData.folder);
          xhr.send(clFormData);
        });
      }

      setUploadReceipt({
        receiptId: `RCPT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        filesCount: selectedFiles.length,
        totalSize
      });
      // Clean previews
      selectedFiles.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
      setSelectedFiles([]);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload one or more files directly to Cloudinary.");
      fetchCaptcha();
    } finally {
      setUploading(false);
    }
  };

  const resetPortal = () => {
    setUploadReceipt(null);
    setUploadError(null);
    setNotes("");
    setCaptchaAnswer("");
    fetchCaptcha();
  };

  return (
    <div className="min-h-screen bg-[#070119] text-white flex flex-col items-center justify-center p-4 selection:bg-[#a855f7] selection:text-white relative overflow-hidden font-sans">
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#a855f7]/10 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#ff8a5b]/10 blur-[150px]" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#11042b]/65 border border-white/5 p-6 sm:p-8 rounded-3xl backdrop-blur-md shadow-2xl relative"
      >
        
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
          <div className="flex items-center gap-2">
            <img 
              src={logoImg} 
              alt="StellR IT Logo" 
              className="h-10 w-auto object-contain" 
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/50">
            <Lock className="h-3 w-3" />
            End-to-End Secure Channel
          </div>
        </div>

        {loadingMetadata ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 text-[#a855f7] animate-spin" />
            <span className="text-xs text-white/40">Loading secure portal handshake...</span>
          </div>
        ) : portalError ? (
          /* PORTAL METADATA ERROR / EXPIRED LINK */
          <div className="text-center py-12 space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-serif">{portalError}</h2>
              <p className="text-xs text-white/40 mt-1 max-w-sm mx-auto">
                This link has either expired or was revoked by the admin. Please request a new upload link from your Stellar account owner.
              </p>
            </div>
          </div>
        ) : uploadReceipt ? (
          /* UPLOAD RECEIPT / SUCCESS SCREEN */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-6"
          >
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-white">Files Received Successfully</h2>
              <p className="text-xs text-white/45">Your uploads have been safely registered under {metadata?.businessName}.</p>
            </div>

            {/* Receipt Details Box */}
            <div className="bg-black/25 border border-white/5 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3 font-mono text-[10px]">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Confirmation ID:</span>
                <span className="text-white font-bold text-[#ff8a5b]">{uploadReceipt.receiptId}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Timestamp:</span>
                <span className="text-white/80">{new Date(uploadReceipt.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">Total Files:</span>
                <span className="text-white/80">{uploadReceipt.filesCount} file(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Total Size:</span>
                <span className="text-white/80">{formatSize(uploadReceipt.totalSize)}</span>
              </div>
            </div>

            <button 
              onClick={resetPortal}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-white transition active:scale-95"
            >
              Upload More Files
            </button>
          </motion.div>
        ) : (
          /* PRIMARY UPLOAD FORM */
          <form onSubmit={handleUploadSubmit} className="space-y-6">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#ff8a5b] uppercase">Portal for</span>
              <h2 className="text-2xl font-serif font-bold text-white mt-0.5">{metadata?.businessName}</h2>
              {metadata?.notes && (
                <div className="mt-3 p-3.5 rounded-xl border border-white/5 bg-white/5 text-xs text-white/60 italic leading-relaxed">
                  " {metadata.notes} "
                </div>
              )}
            </div>

            {/* Client detail fields */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Business Name *</label>
              <input 
                type="text" 
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#a855f7]"
              />
            </div>

            {/* Drag & Drop File dropzone */}
            <div className="space-y-2">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40">Select Assets to Upload</label>
              
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerSelectFiles}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition select-none ${
                  dragActive 
                    ? "bg-[#a855f7]/10 border-[#a855f7]" 
                    : "bg-[#12052c]/30 border-white/10 hover:border-white/20"
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/60">
                  <Upload className="h-5 w-5" />
                </div>
                
                <div className="text-center">
                  <p className="text-xs font-semibold text-white">Drag & drop files here, or <span className="text-[#a855f7] hover:underline">browse files</span></p>
                  <p className="text-[10px] text-white/30 mt-1">
                    Allowed formats: {metadata?.allowedFileTypes.join(", ")} &bull; Max file footprint: {metadata ? formatSize(metadata.maxUploadSize) : "100 MB"}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected files preview panel */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {selectedFiles.map((sf) => (
                  <div key={sf.id} className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      {sf.type === "image" && sf.previewUrl ? (
                        <img src={sf.previewUrl} alt={sf.name} className="h-9 w-9 rounded-lg object-cover border border-white/10" />
                      ) : sf.type === "video" ? (
                        <div className="h-9 w-9 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Film className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="h-9 w-9 rounded-lg bg-[#ff8a5b]/15 border border-[#ff8a5b]/20 flex items-center justify-center text-[#ff8a5b]">
                          <FileText className="h-4 w-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="block text-xs text-white/90 font-semibold truncate max-w-xs sm:max-w-md">{sf.name}</span>
                        <span className="text-[9px] text-white/40 font-mono">{formatSize(sf.size)}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFile(sf.id)}
                      className="h-7 w-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Special Upload Notes field */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-white/40 mb-1">Add Upload Notes / Instructions</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes or context about these files..."
                rows={2}
                className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#a855f7] resize-none"
              />
            </div>

            {/* Robot verification CAPTCHA widget */}
            {selectedFiles.length > 0 && (
              <div className="p-4 rounded-2xl border border-white/5 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#ff8a5b]/10 border border-[#ff8a5b]/20 flex items-center justify-center text-[#ff8a5b] shrink-0">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold text-white/40 uppercase tracking-wider">Robot Verification</span>
                    <span className="block text-xs font-bold text-white font-mono mt-0.5">{captchaQuestion || "calculating math puzzle..."}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Answer"
                    className={`w-20 bg-black/40 border rounded-lg px-2.5 py-1.5 text-xs text-center text-white focus:outline-none ${
                      captchaError ? "border-rose-500 focus:border-rose-500" : "border-white/10 focus:border-[#a855f7]"
                    }`}
                  />
                  <button 
                    type="button"
                    onClick={fetchCaptcha}
                    className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition active:rotate-45"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Uploading Progress Telemetry Modal overlay */}
            <AnimatePresence>
              {uploading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-[#12052c] border border-white/10 w-full max-w-md rounded-2xl p-6 space-y-6 text-center shadow-2xl"
                  >
                    <div className="space-y-1">
                      <h3 className="text-base font-serif font-bold text-white flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 text-[#a855f7] animate-spin" />
                        Uploading Assets
                      </h3>
                      <p className="text-[10px] text-white/40">Securely routing file data streams to vault</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between font-mono text-[9px] text-white/55">
                        <span>Progress: {uploadProgress}%</span>
                        <span>Speed: {formatSpeed(uploadSpeed)}</span>
                      </div>
                    </div>

                    {/* Telemetry info */}
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-left">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#ff8a5b] opacity-75" />
                        <div>
                          <span className="block text-[8px] text-white/40 uppercase">Time Remaining</span>
                          <span className="block text-xs font-semibold text-white font-mono">{formatTime(timeRemaining)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-[#a855f7] opacity-75" />
                        <div>
                          <span className="block text-[8px] text-white/40 uppercase">Files Uploaded</span>
                          <span className="block text-xs font-semibold text-white">{selectedFiles.length} file(s)</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Error notifications */}
            {uploadError && (
              <div className="p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end pt-4 border-t border-white/5">
              <button 
                type="submit"
                disabled={selectedFiles.length === 0 || !captchaAnswer || uploading}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] transition text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Send Secure Files
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </form>
        )}

      </motion.div>
      <span className="text-[10px] text-white/20 mt-6">&copy; {new Date().getFullYear()} StellrIT. All Rights Reserved.</span>
    </div>
  );
}
