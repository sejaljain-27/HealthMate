import { motion } from "framer-motion";
import { TrendingUp, Flame, Calendar, Activity, ArrowUp, Minus } from "lucide-react";
import { AppLayout, Header } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface WeekDay {
  day: string;
  completed: boolean;
  intensity?: "low" | "medium" | "high";
}

const weekData: WeekDay[] = [
  { day: "M", completed: true, intensity: "medium" },
  { day: "T", completed: true, intensity: "high" },
  { day: "W", completed: false },
  { day: "T", completed: true, intensity: "medium" },
  { day: "F", completed: true, intensity: "low" },
  { day: "S", completed: false },
  { day: "S", completed: false },
];

const stats = [
  { label: "Workouts Done", value: "4", subtext: "of 6 planned", trend: "neutral", icon: Calendar },
  { label: "Calories Burned", value: "1,240", subtext: "est. this week", trend: "up", icon: Flame },
  { label: "Consistency", value: "67%", subtext: "+5% from last week", trend: "up", icon: Activity },
];

export function ProgressScreen() {
  return (
    <AppLayout>
      <Header
        title="Your Progress"
        subtitle="Week of Dec 23 - Dec 29"
      />

      {/* Week Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">This Week</h3>
          <div className="flex justify-between">
            {weekData.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs text-muted-foreground">{day.day}</span>
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    day.completed && "bg-success/10",
                    !day.completed && index <= 2 && "bg-muted",
                    !day.completed && index > 2 && "bg-muted/50 border border-dashed border-border"
                  )}
                >
                  {day.completed ? (
                    <span className="text-success text-lg">✓</span>
                  ) : index <= 2 ? (
                    <Minus className="w-4 h-4 text-muted-foreground/50" />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <GlassCard className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-display font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    stat.trend === "up" && "text-success",
                    stat.trend === "neutral" && "text-muted-foreground"
                  )}>
                    {stat.trend === "up" && <ArrowUp className="w-4 h-4" />}
                    <span className="text-xs">{stat.subtext}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Missed Days - No Guilt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-5 gradient-ai border-none" hover={false}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center text-lg">
              🌱
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">2 rest days this week</h3>
              <p className="text-sm text-muted-foreground">
                Including one missed workout that was intelligently rescheduled. Recovery is progress too.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Trend Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <GlassCard className="p-5" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Monthly Trend</h3>
            <div className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span>Improving</span>
            </div>
          </div>
          <div className="h-32 flex items-end justify-between gap-2">
            {[40, 55, 45, 70, 65, 80, 75, 85].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                className={cn(
                  "flex-1 rounded-t-lg",
                  index === 7 ? "gradient-primary" : "bg-primary/20"
                )}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">Week 1</span>
            <span className="text-xs text-muted-foreground">Week 8</span>
          </div>
        </GlassCard>
      </motion.div>
    </AppLayout>
  );
}
