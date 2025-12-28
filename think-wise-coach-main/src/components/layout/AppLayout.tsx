import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className={cn("min-h-screen gradient-calm", className)}>
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {children}
      </div>
    </div>
  );
}

interface HeaderProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between mb-6"
    >
      <div>
        {title && (
          <h1 className="text-2xl font-display font-semibold text-foreground">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action}
    </motion.header>
  );
}
