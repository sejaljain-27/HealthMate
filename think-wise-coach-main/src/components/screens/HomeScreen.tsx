import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Clock, Flame, CheckCircle, Calendar } from "lucide-react";
import { AppLayout, Header } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIBadge } from "@/components/ui/AIBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HomeScreenProps {
  onStartWorkout: () => void;
  onViewPlan: () => void;
}

export function HomeScreen({ onStartWorkout, onViewPlan }: HomeScreenProps) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AppLayout>
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-sm text-muted-foreground">{greeting()}</p>
        <h1 className="text-2xl font-display font-semibold text-foreground">
          Ready to move? 💪
        </h1>
      </motion.div>

      {/* Today's Workout Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <GlassCard className="p-0 overflow-hidden" hover={false}>
          <div className="gradient-primary p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <AIBadge text="Today's Plan" variant="subtle" />
                <h2 className="text-xl font-display font-semibold text-primary-foreground mt-2">
                  Active Recovery
                </h2>
                <p className="text-sm text-primary-foreground/80 mt-1">
                  Light stretching and mobility
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-3xl">🧘</span>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-foreground/80" />
                <span className="text-sm text-primary-foreground">20 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-primary-foreground/80" />
                <span className="text-sm text-primary-foreground">Low Intensity</span>
              </div>
            </div>
            <Button
              onClick={onStartWorkout}
              className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 py-5 rounded-xl font-medium"
            >
              Start Workout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">4</p>
              <p className="text-xs text-muted-foreground">Workouts done</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">1,240</p>
              <p className="text-xs text-muted-foreground">Calories burned</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Week Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-medium text-foreground">This Week</h3>
          <button
            onClick={onViewPlan}
            className="text-sm text-primary font-medium flex items-center gap-1"
          >
            View Plan
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <GlassCard className="p-4" hover={false}>
          <div className="flex justify-between">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
              const isCompleted = index < 2;
              const isToday = index === 2;
              const isPast = index <= 2;
              
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{day}</span>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium",
                      isCompleted && "bg-success text-success-foreground",
                      isToday && "gradient-primary text-primary-foreground",
                      !isCompleted && !isToday && isPast && "bg-muted/50 text-muted-foreground",
                      !isPast && "bg-muted/30 text-muted-foreground/50"
                    )}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-4 gradient-ai border-none" hover={false}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Health Mate's Note</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Great consistency this week! Today's recovery session will help you prepare for tomorrow's lower body workout.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AppLayout>
  );
}
