import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Sparkles,
} from "lucide-react";

import { AppLayout, Header } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { predictCompletion } from "@/api/healthmateapi";

interface DailyCheckInScreenProps {
  onComplete: (completed: boolean, energy: string) => void;
}

export function DailyCheckInScreen({ onComplete }: DailyCheckInScreenProps) {
  const [step, setStep] = useState<"workout" | "energy" | "done">("workout");
  const [workoutCompleted, setWorkoutCompleted] = useState<boolean | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleWorkoutResponse = (completed: boolean) => {
    setWorkoutCompleted(completed);
    setStep("energy");
  };

  const handleEnergyResponse = async (energy: "low" | "medium" | "high") => {
    setLoading(true);

    const energyMap = {
      low: 3,
      medium: 6,
      high: 9,
    };

    try {
      const response = await predictCompletion({
        energy_level: energyMap[energy],
        skipped_days: workoutCompleted ? 0 : 1,
        completion_rate: workoutCompleted ? 0.7 : 0.3,
        availability: 1,
      });

      console.log("Backend response:", response);
      setResult(response);
      setStep("done");

      setTimeout(() => {
        onComplete(workoutCompleted!, energy);
      }, 1200);
    } catch (err) {
      console.error("API ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const energyOptions = [
    { value: "low", label: "Low", icon: BatteryLow, color: "text-destructive" },
    {
      value: "medium",
      label: "Medium",
      icon: BatteryMedium,
      color: "text-warning",
    },
    {
      value: "high",
      label: "High",
      icon: BatteryFull,
      color: "text-success",
    },
  ];

  return (
    <AppLayout>
      <Header
        title="Daily Check-In"
        subtitle="Quick update for your Health Mate"
      />

      <AnimatePresence mode="wait">
        {/* STEP 1 */}
        {step === "workout" && (
          <motion.div
            key="workout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <GlassCard className="p-6 text-center">
              <h2 className="text-xl font-semibold">
                Did you complete today's workout?
              </h2>
            </GlassCard>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleWorkoutResponse(true)}
                className="glass-card p-6 flex flex-col items-center gap-3 cursor-pointer"
              >
                <Check className="text-success w-6 h-6" />
                Yes
              </button>

              <button
                onClick={() => handleWorkoutResponse(false)}
                className="glass-card p-6 flex flex-col items-center gap-3 cursor-pointer"
              >
                <X className="text-muted-foreground w-6 h-6" />
                Not today
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === "energy" && (
          <motion.div
            key="energy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <GlassCard className="p-6 text-center">
              <h2 className="text-xl font-semibold">
                How's your energy today?
              </h2>
            </GlassCard>

            <div className="grid grid-cols-3 gap-4">
              {energyOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      handleEnergyResponse(
                        opt.value as "low" | "medium" | "high"
                      )
                    }
                    className="glass-card p-5 flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Icon className={cn("w-7 h-7", opt.color)} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-4"
          >
            <div className="flex justify-center">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold">
              Check-in Complete
            </h2>

            {loading && <p>Analyzing your data...</p>}

            {result && (
              <GlassCard className="p-4 mt-4">
                <p className="font-medium">
                  Plan: <span className="text-primary">{result.prediction}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Risk Level: {result.risk_level}
                </p>
                <p className="text-sm text-muted-foreground">
                  Confidence: {result.confidence}
                </p>
              </GlassCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
