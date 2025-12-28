import { SmokeyBackground, LoginForm } from "@/components/ui/login-form";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { loginUser } from "@/api/healthmateapi";

interface AuthScreenProps {
  onLogin: (userData: { email: string; name?: string }) => void;
  onSignUp: () => void;
}

export function AuthScreen({ onLogin, onSignUp }: AuthScreenProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ✅ BACKEND-CONNECTED LOGIN HANDLER
  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      console.log("Login success:", response);

      // ✅ pass BACKEND user to app
      onLogin(response.user);
    } catch (err: any) {
      alert(err?.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <SmokeyBackground
        color={isDark ? "#0EA5E9" : "#3B82F6"}
        backdropBlurAmount="md"
      />

      {/* App branding */}
      <motion.div
        className="absolute top-8 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          className={`text-2xl font-bold font-heading tracking-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          HealthMate
        </motion.h1>
        <motion.p
          className={`text-sm text-center ${
            isDark ? "text-white/60" : "text-gray-600"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Your Health Mate
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {/* ✅ CONNECTED TO BACKEND */}
        <LoginForm onLogin={handleLogin} onSignUp={onSignUp} />
      </motion.div>
    </div>
  );
}
