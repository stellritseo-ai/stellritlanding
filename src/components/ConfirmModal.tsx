import { useDashboardTheme } from "@/hooks/useDashboardTheme";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, LogOut, CheckCircle, Info } from "lucide-react";
import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info" | "success";
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "danger",
}: ConfirmModalProps) {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-emerald-500" />;
      case "info":
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getThemeStyles = () => {
    if (isDark) {
      return {
        backdrop: "bg-[#0b041a]/80 backdrop-blur-md",
        card: "bg-[#13072e]/95 border-white/10 shadow-[0_0_50px_-12px_rgba(168,85,247,0.25)]",
        title: "text-white",
        message: "text-white/60",
        cancelBtn: "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
        confirmBtn: {
          danger: "bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white",
          warning: "bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white",
          success: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white",
          info: "bg-gradient-to-r from-[#a855f7] to-[#6a18c8] hover:opacity-90 text-white",
        }[type],
        iconBg: {
          danger: "bg-red-500/10 border-red-500/20",
          warning: "bg-amber-500/10 border-amber-500/20",
          success: "bg-emerald-500/10 border-emerald-500/20",
          info: "bg-blue-500/10 border-blue-500/20",
        }[type],
      };
    } else {
      return {
        backdrop: "bg-slate-900/40 backdrop-blur-md",
        card: "bg-white border-slate-200/80 shadow-2xl shadow-slate-900/10",
        title: "text-slate-800",
        message: "text-slate-500",
        cancelBtn: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
        confirmBtn: {
          danger: "bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white",
          warning: "bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white",
          success: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white",
          info: "bg-gradient-to-r from-[#a855f7] to-[#6a18c8] hover:opacity-90 text-white",
        }[type],
        iconBg: {
          danger: "bg-red-50 border-red-100",
          warning: "bg-amber-50 border-amber-100",
          success: "bg-emerald-50 border-emerald-100",
          info: "bg-blue-50 border-blue-100",
        }[type],
      };
    }
  };

  const styles = getThemeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className={`fixed inset-0 transition-opacity ${styles.backdrop}`}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-6 ${styles.card}`}
          >
            {/* Header Content */}
            <div className="flex items-start gap-4">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${styles.iconBg}`}>
                {getIcon()}
              </div>
              <div className="space-y-1">
                <h3 className={`text-base font-semibold leading-6 ${styles.title}`}>
                  {title}
                </h3>
                <p className={`text-xs leading-relaxed ${styles.message}`}>
                  {message}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className={`w-full rounded-xl border px-4 py-2.5 text-xs font-semibold tracking-wide transition sm:w-auto ${styles.cancelBtn}`}
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`w-full rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide shadow-md transition sm:w-auto ${styles.confirmBtn}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
