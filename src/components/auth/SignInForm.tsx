import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, clearAuthError } from "../../store/authSlice";
import { showAlert } from "../../store/alertSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ShoppingBag, TrendingUp, Users } from "lucide-react";

export default function SignInForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isLoading = status === "loading";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        login({ email: email.trim(), password, rememberMe: false }),
      ).unwrap();

      setIsRedirecting(true);
      dispatch(
        showAlert({
          title: "Login Successful",
          message: "Welcome back!",
          type: "success",
        }),
      );

      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setIsRedirecting(false);
      dispatch(
        showAlert({
          title: "Login Failed",
          message: err?.message || "Invalid credentials",
          type: "error",
        }),
      );
    }
  };

  return (
    /* 1. Use h-screen + overflow-hidden to block scrolling entirely */
    <div className="h-screen w-full flex items-center justify-center  p-5 md:p-6 overflow-hidden">
      
      {/* 2. Main Box: max-h-[90vh] keeps it inside the screen on small laptops */}
      <div className="w-full max-w-[1100px] h-full max-h-[720px] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Column: Form Section */}
        <div className="w-full md:w-[45%] p-6 lg:p-12 flex flex-col justify-center relative z-10 order-2 md:order-1 h-full">
          <div className="max-w-md mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-4"
            >
              <ShoppingBag size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-indigo-900 dark:text-indigo-100 font-bold text-[10px] tracking-widest uppercase">
                Nova Mart Admin
              </span>
            </motion.div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mb-6 leading-relaxed">
              Access your control panel to manage products and orders.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@novamart.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) dispatch(clearAuthError());
                  }}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) dispatch(clearAuthError());
                    }}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm pr-12 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Centered Button for all screens, no fixed margins */}
              <div className="flex justify-center md:justify-start pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isRedirecting}
                  className="w-full max-w-[240px] bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-2.5 rounded-lg shadow-md hover:shadow-indigo-500/5 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
                  ) : isRedirecting ? (
                    "Connecting..."
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Visuals (Hidden on small screens to prevent scroll) */}
        <div className="hidden md:block w-full md:w-[55%] relative p-4 lg:p-6 order-1 md:order-2 h-full">
          <div className="w-full h-full rounded-[24px] md:rounded-[32px] overflow-hidden relative group">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
              alt="Management"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent" />

            <AnimatePresence>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute top-6 left-6 p-4 bg-[#fcd34d] rounded-2xl shadow-xl w-40 lg:w-48"
              >Update the entire admin panel dashboard with a clean and simple modern font family for a professional and minimal UI appearance.
                <TrendingUp size={16} className="text-gray-900 mb-2" />
                <h4 className="text-[10px] font-black text-gray-900 uppercase">monthly earnings</h4>
                <p className="text-xl font-black text-gray-900">&#8377; 12,840</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-52 lg:w-60"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users size={12} className="text-white/70" />
                  <span className="text-[9px] text-white/70 font-bold uppercase tracking-widest">
                    Live Traffic
                  </span>
                </div>
                <div className="flex items-end gap-1 h-8">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-t-sm ${i === 3 ? "bg-[#fcd34d]" : "bg-white/40"}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}