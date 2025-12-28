import { motion } from "framer-motion";
import { ArrowRight, Clock, Flame, Dumbbell, Sparkles, ChevronRight } from "lucide-react";
import { AppLayout, Header } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIBadge } from "@/components/ui/AIBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlanChange {
  day: string;
  original: { type: string; duration: string; intensity: string };
  adapted: { type: string; duration: string; intensity: string };
  reason: string;
}

const planChanges: PlanChange[] = [
  {
    day: "Thursday",
    original: { type: "Lower Body", duration: "40 min", intensity: "Medium" },
    adapted: { type: "Lower Body", duration: "30 min", intensity: "Light-Medium" },
    reason: "Reduced duration to ease back in",
  },
  {
    day: "Friday",
    original: { type: "Core & Flexibility", duration: "30 min", intensity: "Low" },
    adapted: { type: "Yoga & Recovery", duration: "25 min", intensity: "Low" },
    reason: "Added variety with yoga session",
  },
  {
    day: "Saturday",
    original: { type: "Endurance Run", duration: "45 min", intensity: "Medium" },
    adapted: { type: "Walk + Light Jog", duration: "35 min", intensity: "Low-Medium" },
    reason: "Gentler cardio to rebuild stamina",
  },
];

interface PlanAdaptationScreenProps {
  onAccept: () => void;
  reason?: string;
}

export function PlanAdaptationScreen({ onAccept, reason = "energy" }: PlanAdaptationScreenProps) {
  return (
    <AppLayout>
      <Header
        title="Plan Adapted"
        subtitle="Based on your feedback"
        action={<AIBadge text="AI Adjusted" variant="glow" />}
      />

      {/* Explanation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <GlassCard className="p-5 gradient-ai border-none" hover={false}>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Here's how I've adjusted your plan</h3>
              <p className="text-sm text-muted-foreground">
                I've made changes to help you get back on track without overwhelming you. Small adjustments lead to lasting progress.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Before vs After Comparison */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-medium text-muted-foreground">Original</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-primary">Adapted</span>
        </div>

        {planChanges.map((change, index) => (
          <motion.div
            key={change.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <GlassCard className="p-0 overflow-hidden" hover={false}>
              {/* Day Header */}
              <div className="px-4 py-2 bg-muted/50 border-b border-border">
                <span className="text-sm font-medium text-foreground">{change.day}</span>
              </div>

              {/* Comparison Grid */}
              <div className="grid grid-cols-2 divide-x divide-border">
                {/* Original */}
                <div className="p-4 opacity-60">
                  <p className="font-medium text-foreground text-sm mb-2 line-through">
                    {change.original.type}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {change.original.duration}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {change.original.intensity}
                    </span>
                  </div>
                </div>

                {/* Adapted */}
                <div className="p-4 bg-accent/30">
                  <p className="font-medium text-foreground text-sm mb-2">
                    {change.adapted.type}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {change.adapted.duration}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">
                      {change.adapted.intensity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="px-4 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  {change.reason}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 grid grid-cols-3 gap-3"
      >
        <div className="glass-card p-4 text-center">
          <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-lg font-semibold text-foreground">-30min</p>
          <p className="text-xs text-muted-foreground">Weekly total</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Flame className="w-5 h-5 text-warning mx-auto mb-2" />
          <p className="text-lg font-semibold text-foreground">Lower</p>
          <p className="text-xs text-muted-foreground">Intensity</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Dumbbell className="w-5 h-5 text-secondary mx-auto mb-2" />
          <p className="text-lg font-semibold text-foreground">+Variety</p>
          <p className="text-xs text-muted-foreground">Exercises</p>
        </div>
      </motion.div>

      {/* Accept Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Button
          onClick={onAccept}
          className="w-full gradient-primary text-primary-foreground py-6 rounded-2xl text-base font-medium"
        >
          Accept New Plan
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          You can always adjust this later
        </p>
      </motion.div>
    </AppLayout>
  );
}
