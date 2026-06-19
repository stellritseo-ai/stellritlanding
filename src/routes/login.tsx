import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Shield, 
  Lock, 
  User as UserIcon, 
  Loader2, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";
import { loginAdminFn } from "@/lib/chat.functions";


export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    return {
      redirect: search.redirect ? String(search.redirect) : undefined,
    };
  },
});

const API_URL = import.meta.env.VITE_CHAT_API_URL ?? "http://localhost:3001";

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectUrl } = useSearch({ from: "/login" });

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await loginAdminFn({ data: { username, password } });

      // Save token & user metadata
      localStorage.setItem("stellr_admin_token", data.token);
      localStorage.setItem("stellr_admin_user", JSON.stringify({ name: data.name, role: data.role, username }));

      // Direct redirection
      navigate({ to: redirectUrl || "/dashboard" });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl border border-rose-500/25 bg-rose-500/5 text-rose-400 text-xs font-semibold flex items-start gap-2.5"
            >
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-white/30" />
                <input
                  type="text"
                  required
                  placeholder="Enter administrator username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full h-11 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#a855f7]/60 focus:ring-1 focus:ring-[#a855f7]/40 transition duration-300 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest pl-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter security access key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
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

        {/* Footer legal disclaimer */}
        <p className="text-center text-[10px] text-white/30 leading-normal max-w-xs mx-auto">
          Authorized personnel access only. Actions performed on this control workspace are tracked and encrypted.
        </p>
      </motion.div>
    </div>
  );
}
