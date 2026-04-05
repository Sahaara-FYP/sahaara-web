import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Loader2, ShieldCheck, Activity } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

type LoginFormInputs = {
  identifier: string;
  password: string;
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", data);
      const { accessToken, user } = response.data;
      login(user, accessToken);
      toast.success("Login Successful");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[1000px] bg-[#020617]/50 border border-white/[0.08] shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)] rounded-[2rem] md:rounded-[3rem] backdrop-blur-3xl flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        {/* Left Side: Brand & Context */}
        <div className="flex-1 bg-gradient-to-br from-indigo-500/10 via-[#020617]/50 to-[#020617] p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.08]">
          <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/30">
              <span className="text-3xl font-bold text-white tracking-tighter">
                S
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Manage Sahaara
              <br />
              <span className="text-indigo-400">with confidence.</span>
            </h1>
            <p className="mt-4 text-white/50 text-[15px] font-medium leading-relaxed max-w-sm">
              The central hub for reviewing requests, matching offers, and
              ensuring safety alerts are handled swiftly.
            </p>
          </div>

          <div className="mt-12 space-y-4 relative z-10 hidden md:block">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck size={20} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Trust & Safety
                </p>
                <p className="text-xs text-white/50 font-medium mt-0.5">
                  All requests are actively monitored
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center">
                <Activity size={20} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Real-time Analytics
                </p>
                <p className="text-xs text-white/50 font-medium mt-0.5">
                  Live overview of platform activity
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-[0.8] bg-[#020617]/50 p-10 lg:p-14 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Admin Login
            </h2>
            <p className="text-white/50 font-medium text-[15px] mt-2">
              Please sign in to your account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-5"
            >
              <FormField
                label="Email or ID"
                id="identifier"
                registration={register("identifier", {
                  required: "Email or ID is required",
                })}
                error={errors.identifier}
                placeholder="admin@sahaara.com"
              />
              <FormField
                label="Password"
                id="password"
                registration={register("password", {
                  required: "Password is required",
                })}
                type="password"
                error={errors.password}
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4"
            >
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl h-14 text-[15px] font-semibold tracking-wide shadow-[0_0_40px_-5px_rgba(99,102,241,0.5)] transition-all border border-indigo-500/50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-3 h-5 w-5" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
