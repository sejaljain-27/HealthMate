import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface AIThinkingIndicatorProps {
  message?: string;
}

export function AIThinkingIndicator({ message = "Thinking..." }: AIThinkingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
    >
      <div className="relative">
        <Brain className="w-5 h-5 text-primary animate-pulse-soft" />
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <span className="text-sm text-muted-foreground">{message}</span>
      <div className="typing-indicator flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
      </div>
    </motion.div>
  );
}
