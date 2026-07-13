import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Lock,
  User as UserIcon,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  Ban,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/logo.png";
import { loginAdminFn } from "@/lib/chat.functions.server";


export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    return {
      redirect: search.redirect ? String(search.redirect) : undefined,
    };
  },
});

const API_URL = import.meta.env.VITE_CHAT_API_URL ?? "http://localhost:3001";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 60 * 1000; // 1 hour
const STORAGE_KEY = "stellr_login_attempts";

interface AttemptRecord {
  count: number;
  lockedUntil: number | null; // timestamp ms
}

function getAttemptRecord(): AttemptRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, lockedUntil: null };
    const parsed = JSON.parse(raw) as AttemptRecord;
    // If lockout expired, auto-reset
    if (parsed.lockedUntil && Date.now() >= parsed.lockedUntil) {
      localStorage.removeItem(STORAGE_KEY);
      return { count: 0, lockedUntil: null };
    }
    return parsed;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function saveAttemptRecord(record: AttemptRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

function clearAttemptRecord() {
  localStorage.removeItem(STORAGE_KEY);
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  return `${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectUrl } = useSearch({ from: "/login" });

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Rate-limiting states
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [countdown, setCountdown] = useState<string>("");
  const [lockedUntilMs, setLockedUntilMs] = useState<number | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const record = getAttemptRecord();
    setAttemptCount(record.count);
    if (record.lockedUntil && Date.now() < record.lockedUntil) {
      setIsLockedOut(true);
      setLockedUntilMs(record.lockedUntil);
    }
  }, []);

  // Live countdown ticker
  useEffect(() => {
    if (!isLockedOut || !lockedUntilMs) return;
    const tick = () => {
      const remaining = lockedUntilMs - Date.now();
      if (remaining <= 0) {
        setIsLockedOut(false);
        setLockedUntilMs(null);
        setAttemptCount(0);
        setError(null);
        clearAttemptRecord();
        setCountdown("");
      } else {
        setCountdown(formatCountdown(remaining));
      }
    };
    tick(); // immediate render
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isLockedOut, lockedUntilMs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    if (isLockedOut) return;

    setLoading(true);
    setError(null);

    try {
      const data = await loginAdminFn({ data: { username, password } });

      // Success — clear rate limit record
      clearAttemptRecord();
      setAttemptCount(0);

      // Save token & user metadata
      localStorage.setItem("stellr_admin_token", data.token);
      localStorage.setItem("stellr_admin_user", JSON.stringify({ name: data.name, role: data.role, username }));

      // Direct redirection
      navigate({ to: redirectUrl || "/dashboard" });
    } catch (err: any) {
      console.error("Login error:", err);

      // Increment attempt count
      const newCount = attemptCount + 1;
      setAttemptCount(newCount);

      if (newCount >= MAX_ATTEMPTS) {
        // Lock out for 1 hour
        const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
        saveAttemptRecord({ count: newCount, lockedUntil });
        setIsLockedOut(true);
        setLockedUntilMs(lockedUntil);
        setError(null); // lockout UI takes over
      } else {
        saveAttemptRecord({ count: newCount, lockedUntil: null });
        const remaining = MAX_ATTEMPTS - newCount;
        setError(
          `Invalid credentials. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining before a 1-hour lockout.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const attemptsRemaining = MAX_ATTEMPTS - attemptCount;

  return (
    <div className="relative min-h-screen bg-[#0b011c] text-white flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full blur-[120px] opacity-25"
          style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full blur-[140px] opacity-20"
          style={{ background: "radial-gradient(circle, #ff8a5b 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
        className="w-full max-w-md relative z-10 space-y-8"
      >
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center"
          >
            <img
              src={logoImg}
              alt="StellR IT Logo"
              className="h-14 w-auto object-contain brightness-0 invert"
            />
          </motion.div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#a855f7] flex items-center justify-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Administrative Vault
            </span>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              Access Gate Control
            </h2>
          </div>
        </div>

        {/* Login Form Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-[#12052c]/55 border border-white/5 p-8 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6"
        >
          <AnimatePresence mode="wait">
            {/* ── LOCKED OUT STATE ── */}
            {isLockedOut ? (
              <motion.div
                key="lockout"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center text-center gap-5 py-4"
              >
                <div className="h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center">
                  <Ban className="h-7 w-7 text-rose-400" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-rose-400 uppercase tracking-widest">
                    Access Suspended
                  </p>
                  <p className="text-xs text-white/50 max-w-[260px] leading-relaxed">
                    Too many failed attempts. Access is temporarily disabled for security purposes.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                  <Clock className="h-4 w-4 text-[#a855f7] shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                      Lockout expires in
                    </p>
                    <p className="text-lg font-black tracking-tight text-white tabular-nums">
                      {countdown}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-white/30 max-w-[260px] leading-relaxed">
                  After the lockout period, you may try again. Contact your administrator if you need immediate access.
                </p>
              </motion.div>
            ) : (
              /* ── NORMAL FORM STATE ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Error message with attempt counter */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/5 text-rose-400 text-xs font-semibold flex items-start gap-2.5"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Attempt indicator dots — shown after first failure */}
                {attemptCount > 0 && !isLockedOut && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between text-[10px] text-white/40 font-semibold uppercase tracking-widest"
                  >
                    <span>Attempts</span>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-2 w-2 rounded-full transition-all ${i < attemptCount
                              ? "bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                              : "bg-white/15"
                            }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">
                      Username
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        required
                        placeholder="Enter administrator username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        autoComplete="username"
                        className="w-full h-11 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#a855f7]/60 focus:ring-1 focus:ring-[#a855f7]/40 transition duration-300 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">
                      Security Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter security access key"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        autoComplete="current-password"
                        className="w-full h-11 pl-11 pr-11 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#a855f7]/60 focus:ring-1 focus:ring-[#a855f7]/40 transition duration-300 disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !username || !password}
                    className="w-full h-11 mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white hover:opacity-90 active:scale-[0.98] transition font-bold text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(168,85,247,0.15)] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                  >
                    {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Authorize Workspace
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer legal disclaimer */}
        <p className="text-center text-[10px] text-white/30 leading-normal max-w-xs mx-auto">
          Authorized personnel access only. Actions performed on this control workspace are tracked and encrypted.
        </p>
      </motion.div>
    </div>
  );
}

