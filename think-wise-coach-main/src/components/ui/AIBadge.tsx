import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AIBadgeProps {
  text?: string;
  variant?: "default" | "subtle" | "glow";
}

export function AIBadge({ text = "AI Generated", variant = "default" }: AIBadgeProps) {
  const variants = {
    default: "bg-primary/20 text-primary border-primary/30",
    subtle: "bg-white/10 text-white/80 border-white/20",
    glow: "bg-primary text-white border-primary ai-pulse shadow-glow",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      <Sparkles className="w-3 h-3" />
      <span>{text}</span>
    </motion.div>
  );
}
