import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTheme } from "next-themes";

interface SignupScreenProps {
  onSignup: (userData: { name: string; email: string; phone: string; password: string }) => void;
  onBack: () => void;
}

export function SignupScreen({ onSignup, onBack }: SignupScreenProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onSignup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <motion.div 
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className={`p-8 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/90 border-gray-200'}`}>
          <motion.div 
            className="text-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className={`text-3xl font-bold mb-2 font-heading ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create Account
            </h1>
            <p className={isDark ? 'text-white/70' : 'text-gray-600'}>
              Join HealthMate and start your fitness journey
            </p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Name Input */}
            <motion.div 
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`w-full rounded-xl px-12 py-4 placeholder-transparent focus:outline-none transition-all peer ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white focus:border-white/40' 
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Full Name"
                required
              />
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
              <label
                className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                  focusedField === 'name' || formData.name
                    ? "top-1 text-xs"
                    : "top-1/2 -translate-y-1/2"
                } ${isDark ? 'text-white/70' : 'text-gray-500'}`}
              >
                Full Name
              </label>
            </motion.div>

            {/* Email Input */}
            <motion.div 
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full rounded-xl px-12 py-4 placeholder-transparent focus:outline-none transition-all peer ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white focus:border-white/40' 
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Email Address"
                required
              />
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
              <label
                className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                  focusedField === 'email' || formData.email
                    ? "top-1 text-xs"
                    : "top-1/2 -translate-y-1/2"
                } ${isDark ? 'text-white/70' : 'text-gray-500'}`}
              >
                Email Address
              </label>
            </motion.div>

            {/* Phone Input */}
            <motion.div 
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                className={`w-full rounded-xl px-12 py-4 placeholder-transparent focus:outline-none transition-all peer ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white focus:border-white/40' 
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Phone Number"
                required
              />
              <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
              <label
                className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                  focusedField === 'phone' || formData.phone
                    ? "top-1 text-xs"
                    : "top-1/2 -translate-y-1/2"
                } ${isDark ? 'text-white/70' : 'text-gray-500'}`}
              >
                Phone Number
              </label>
            </motion.div>

            {/* Password Input */}
            <motion.div 
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`w-full rounded-xl px-12 py-4 placeholder-transparent focus:outline-none transition-all peer ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white focus:border-white/40' 
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Password"
                required
              />
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
              <label
                className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                  focusedField === 'password' || formData.password
                    ? "top-1 text-xs"
                    : "top-1/2 -translate-y-1/2"
                } ${isDark ? 'text-white/70' : 'text-gray-500'}`}
              >
                Password
              </label>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div 
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                className={`w-full rounded-xl px-12 py-4 placeholder-transparent focus:outline-none transition-all peer ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white focus:border-white/40' 
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                placeholder="Confirm Password"
                required
              />
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
              <label
                className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                  focusedField === 'confirmPassword' || formData.confirmPassword
                    ? "top-1 text-xs"
                    : "top-1/2 -translate-y-1/2"
                } ${isDark ? 'text-white/70' : 'text-gray-500'}`}
              >
                Confirm Password
              </label>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity group"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.form>

          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <button 
              onClick={onBack} 
              className={`flex items-center justify-center gap-2 mx-auto ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
}