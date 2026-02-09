import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogIn, Users, Shield, Lock, Phone, ChevronRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [role, setRole] = useState<"admin" | "owner" | null>(null);
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    if (adminId === "admin" && adminPassword === "admin") {
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("flatNumber", "");
      navigate("/admin");
    } else {
      setError("Invalid Admin ID or Password");
    }
  };

  const handleOwnerLogin = () => {
    // Mock authentication logic
    // In a real app, this would be an API call
    const mockUsers: Record<string, { flat: string; pass: string }> = {
      "9719555369": { flat: "100", pass: "552255" },
      "9650654026": { flat: "101", pass: "552255" },
      "9910057679": { flat: "102", pass: "552255" },
      "9312890998": { flat: "103", pass: "552255" },
      "9810415054": { flat: "201", pass: "552255" },
      "9911300816": { flat: "202", pass: "552255" },
      "9911220555": { flat: "203", pass: "552255" },
      "9999971362": { flat: "301", pass: "552255" },
      "9999606636": { flat: "302", pass: "552255" },
      "9911828077": { flat: "303", pass: "552255" },
      "552255": { flat: "101", pass: "552255" }
    };

    if (mockUsers[ownerPhone] && mockUsers[ownerPhone].pass === ownerPassword) {
      localStorage.setItem("userRole", "owner");
      localStorage.setItem("flatNumber", mockUsers[ownerPhone].flat);
      navigate("/owner");
    } else {
      // specific demo bypass for ease of testing
      if (ownerPhone && ownerPassword) {
        // for demo, if not in mock list, assign a random flat if creds are non-empty
        localStorage.setItem("userRole", "owner");
        localStorage.setItem("flatNumber", "101"); // Default to 101 for demo
        navigate("/owner");
      } else {
        setError("Please enter valid Mobile Number and Password");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center gap-3 mb-6"
          >
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 shadow-xl shadow-blue-500/20">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            Bajrangi <span className="text-blue-600">Apartment</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium tracking-tight">
            Premium Building Management System
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Role Selection */}
          {!role ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                Identify Your Role
              </p>

              {/* Admin Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setRole("admin"); setError(""); }}
                className="w-full rounded-3xl bg-white dark:bg-slate-800 p-1 shadow-sm hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-700 group overflow-hidden"
              >
                <div className="flex items-center gap-4 p-5">
                  <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/30 p-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Admin Console
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Control building operations & finances
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Owner Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setRole("owner"); setError(""); }}
                className="w-full rounded-3xl bg-white dark:bg-slate-800 p-1 shadow-sm hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-700 group"
              >
                <div className="flex items-center gap-4 p-5">
                  <div className="rounded-2xl bg-green-50 dark:bg-green-900/30 p-4 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Resident Portal
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Manage your unit & view dues
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/20 dark:border-slate-700"
            >
              <div className="mb-8 flex items-center gap-4">
                <button
                  onClick={() => setRole(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-slate-500" />
                </button>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight capitalize">
                  {role} Login
                </h2>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-bold dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/20"
                >
                  {error}
                </motion.div>
              )}

              <form className="space-y-5">
                {role === "admin" ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Admin ID
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="text"
                          value={adminId}
                          onChange={(e) => setAdminId(e.target.value)}
                          placeholder="admin"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Security Key
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Registered Mobile
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="tel"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-green-500 transition-all outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Personal Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="password"
                          value={ownerPassword}
                          onChange={(e) => setOwnerPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-green-500 transition-all outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={role === "admin" ? handleAdminLogin : handleOwnerLogin}
                  className={`w-full mt-4 rounded-2xl ${role === 'admin' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-green-600 shadow-green-500/20'} px-6 py-4 text-sm font-black text-white shadow-xl transition-all hover:brightness-110 flex items-center justify-center gap-2 uppercase tracking-widest`}
                >
                  <LogIn className="h-4 w-4" />
                  Authenticate
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[10px] font-bold text-slate-400 mt-10 uppercase tracking-[0.3em]"
        >
          Bajrangi Group © 2026 • Secure Infrastructure
        </motion.p>
      </motion.div>
    </div>
  );
}
