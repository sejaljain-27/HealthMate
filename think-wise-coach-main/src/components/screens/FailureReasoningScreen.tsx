import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Clock, Battery, Frown, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { AppLayout, Header } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIBadge } from "@/components/ui/AIBadge";
import { AIThinkingIndicator } from "@/components/ui/AIThinkingIndicator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const failureReasons = [
  { id: "time", label: "Time constraint", icon: Clock, description: "Too busy to fit it in" },
  { id: "energy", label: "Low energy", icon: Battery, description: "Feeling tired or drained" },
  { id: "boredom", label: "Boredom", icon: Frown, description: "Not feeling motivated" },
  { id: "other", label: "Something else", icon: HelpCircle, description: "Tell me more" },
];

interface FailureReasoningScreenProps {
  onContinue: (reason: string) => void;
}

export function FailureReasoningScreen({ onContinue }: FailureReasoningScreenProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 1500);
  };

  const getAnalysisMessage = () => {
    switch (selectedReason) {
      case "time":
        return "Based on your schedule pattern, I notice you often have less time mid-week. I'll suggest shorter, more efficient workouts for busy days.";
      case "energy":
        return "Your recent activity and check-ins show energy levels tend to dip after consecutive workout days. I'll add more recovery time.";
      case "boredom":
        return "Variety is key to staying motivated. I'll mix up your routine with new exercises and different workout styles.";
      default:
        return "I'll take this into account and adjust your plan to better fit your needs.";
    }
  };

  return (
    <AppLayout>
      <Header
        title="Missed Today"
        subtitle="Let's understand what happened"
      />

      {/* Neutral Acknowledgment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <GlassCard className="p-6 text-center gradient-ai border-none" hover={false}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
            <span className="text-2xl">🌿</span>
          </div>
          <h2 className="text-lg font-display font-medium text-foreground mb-2">
            It's okay to miss a day
          </h2>
          <p className="text-sm text-muted-foreground">
            Understanding why helps me create a better plan for you
          </p>
        </GlassCard>
      </motion.div>

      {/* AI Reasoning Card */}
      {!selectedReason && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlassCard className="p-5" hover={false}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground">AI Analysis</h3>
                  <AIBadge variant="subtle" text="Reasoning" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your recent activity and energy levels, today's miss was likely due to one of these factors:
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Reason Selection */}
      {!showAnalysis && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <p className="text-sm font-medium text-muted-foreground px-1 mb-3">
            What best describes today?
          </p>
          {failureReasons.map((reason, index) => {
            const Icon = reason.icon;
            const isSelected = selectedReason === reason.id;
            
            return (
              <motion.button
                key={reason.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                onClick={() => handleReasonSelect(reason.id)}
                className={cn(
                  "w-full glass-card p-4 flex items-center gap-4 text-left transition-all",
                  isSelected ? "border-primary/50 bg-accent" : "hover:border-primary/30"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  isSelected ? "gradient-primary" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isSelected ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{reason.label}</p>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <span className="text-primary-foreground text-xs">✓</span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {/* Analyzing State */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-8"
        >
          <AIThinkingIndicator message="Analyzing your pattern..." />
        </motion.div>
      )}

      {/* Analysis Result */}
      {showAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <GlassCard className="p-5" hover={false}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 ai-pulse">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-foreground">My Understanding</h3>
                  <AIBadge variant="glow" text="Learned" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {getAnalysisMessage()}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Selected Reason Chip */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm text-muted-foreground">Identified factor:</span>
            <span className="chip chip-active">
              {failureReasons.find(r => r.id === selectedReason)?.label}
            </span>
          </div>

          <Button
            onClick={() => onContinue(selectedReason!)}
            className="w-full gradient-primary text-primary-foreground py-6 rounded-2xl text-base font-medium"
          >
            See Adjusted Plan
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      )}
    </AppLayout>
  );
}
