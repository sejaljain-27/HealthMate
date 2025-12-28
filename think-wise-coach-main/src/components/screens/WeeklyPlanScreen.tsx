import { motion } from "framer-motion";
import { Calendar, Flame, Clock, Dumbbell, Heart, Footprints, Moon } from "lucide-react";
import { AppLayout, Header } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIBadge } from "@/components/ui/AIBadge";
import { cn } from "@/lib/utils";

interface WorkoutDay {
  day: string;
  shortDay: string;
  type: string;
  duration: string;
  intensity: "low" | "medium" | "high";
  isRest: boolean;
  icon: React.ElementType;
  completed?: boolean;
}

const weekPlan: WorkoutDay[] = [
  { day: "Monday", shortDay: "Mon", type: "Upper Body", duration: "35 min", intensity: "medium", isRest: false, icon: Dumbbell, completed: true },
  { day: "Tuesday", shortDay: "Tue", type: "Cardio HIIT", duration: "25 min", intensity: "high", isRest: false, icon: Flame, completed: true },
  { day: "Wednesday", shortDay: "Wed", type: "Active Recovery", duration: "20 min", intensity: "low", isRest: false, icon: Heart },
  { day: "Thursday", shortDay: "Thu", type: "Lower Body", duration: "40 min", intensity: "medium", isRest: false, icon: Footprints },
  { day: "Friday", shortDay: "Fri", type: "Core & Flexibility", duration: "30 min", intensity: "low", isRest: false, icon: Heart },
  { day: "Saturday", shortDay: "Sat", type: "Endurance Run", duration: "45 min", intensity: "medium", isRest: false, icon: Footprints },
  { day: "Sunday", shortDay: "Sun", type: "Rest Day", duration: "—", intensity: "low", isRest: true, icon: Moon },
];

const intensityColors = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

const intensityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function WeeklyPlanScreen() {
  const today = "Wednesday";

  return (
    <AppLayout>
      <Header
        title="Your Week"
        subtitle="Personalized for your goals"
        action={<AIBadge text="AI Generated" />}
      />

      {/* Week Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between mb-6 px-2"
      >
        {weekPlan.map((day, index) => (
          <div
            key={day.shortDay}
            className={cn(
              "flex flex-col items-center gap-1",
              day.day === today && "relative"
            )}
          >
            <span className="text-xs text-muted-foreground">{day.shortDay}</span>
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                day.completed && "bg-success text-success-foreground",
                day.day === today && !day.completed && "gradient-primary text-primary-foreground",
                !day.completed && day.day !== today && "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            {day.day === today && (
              <motion.div
                layoutId="today"
                className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* Today's Workout Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <GlassCard className="p-0 overflow-hidden">
          <div className="gradient-primary p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-primary-foreground/80 mb-1">Today</p>
                <h2 className="text-xl font-display font-semibold text-primary-foreground">
                  Active Recovery
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-foreground/80" />
                <span className="text-sm text-primary-foreground">20 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-primary-foreground/80" />
                <span className="text-sm text-primary-foreground">Low Intensity</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-card">
            <p className="text-sm text-muted-foreground">
              Light stretching and mobility work to help your muscles recover and prepare for tomorrow's lower body session.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Weekly Schedule */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground px-1">This Week</h3>
        {weekPlan.map((day, index) => {
          const Icon = day.icon;
          const isToday = day.day === today;
          
          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <GlassCard
                className={cn(
                  "p-4 flex items-center gap-4",
                  isToday && "border-primary/30 bg-accent/50",
                  day.isRest && "bg-muted/30"
                )}
                hover={!day.isRest}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    day.completed && "bg-success/10",
                    isToday && !day.completed && "gradient-primary",
                    !day.completed && !isToday && "bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      day.completed && "text-success",
                      isToday && !day.completed && "text-primary-foreground",
                      !day.completed && !isToday && "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">{day.type}</p>
                    {isToday && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{day.day}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{day.duration}</p>
                  {!day.isRest && (
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", intensityColors[day.intensity])}>
                      {intensityLabels[day.intensity]}
                    </span>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Rest Day Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <GlassCard className="p-4 gradient-ai border-none" hover={false}>
          <div className="flex gap-3">
            <Moon className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Rest is part of progress</p>
              <p className="text-xs text-muted-foreground mt-1">
                Sunday is scheduled for full recovery. Your body grows stronger during rest.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AppLayout>
  );
}
