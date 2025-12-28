import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  hover = true,
  delay = 0,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={
        hover
          ? { y: -2, boxShadow: "0 12px 40px -8px rgba(0, 0, 0, 0.15)" }
          : undefined
      }
      className={cn(
        "glass-card p-6 transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
