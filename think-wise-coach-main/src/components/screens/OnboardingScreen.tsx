import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowRight, User, Target, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIThinkingIndicator } from "@/components/ui/AIThinkingIndicator";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: number;
  type: "ai" | "user";
  content: string;
  options?: { label: string; value: string }[];
}

const goals = [
  { label: "Weight Loss", value: "weight-loss", icon: "🎯" },
  { label: "Build Fitness", value: "fitness", icon: "💪" },
  { label: "Improve Stamina", value: "stamina", icon: "🏃" },
];

const timeOptions = [
  { label: "15-30 min", value: "15-30" },
  { label: "30-45 min", value: "30-45" },
  { label: "45-60 min", value: "45-60" },
  { label: "60+ min", value: "60+" },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [userData, setUserData] = useState({
    age: "",
    height: "",
    weight: "",
    goal: "",
    time: "",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "ai",
      content: "Hey there! 👋 I'm your Health Mate. I'm here to build a personalized plan that fits your life — and adapt when things don't go perfectly.",
    },
  ]);

  const addAIMessage = (content: string, options?: ChatMessage["options"]) => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, type: "ai", content, options },
      ]);
    }, 1200);
  };

  const handleUserResponse = (value: string, displayText?: string) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, type: "user", content: displayText || value },
    ]);

    if (step === 0) {
      setStep(1);
      addAIMessage("Great to meet you! Let's start with some basics. What's your age, height (cm), and weight (kg)?");
    } else if (step === 1) {
      const [age, height, weight] = value.split(",").map((s) => s.trim());
      setUserData((prev) => ({ ...prev, age, height, weight }));
      setStep(2);
      addAIMessage("Perfect! Now, what's your main fitness goal?");
    } else if (step === 2) {
      setUserData((prev) => ({ ...prev, goal: value }));
      setStep(3);
      addAIMessage("Awesome choice! How much time can you dedicate to workouts each day?");
    } else if (step === 3) {
      setUserData((prev) => ({ ...prev, time: value }));
      setStep(4);
      addAIMessage("Perfect! I'm now creating your personalized fitness plan. This will adapt based on your progress and energy levels.");
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const [basicInfo, setBasicInfo] = useState({ age: "", height: "", weight: "" });

  return (
    <div className="min-h-screen gradient-calm px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Your Health Mate
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Let's get to know you
          </p>
        </motion.div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "flex",
                  message.type === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.type === "ai" && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <GlassCard className="p-4" hover={false}>
                      <p className="text-sm text-foreground">{message.content}</p>
                    </GlassCard>
                  </div>
                )}
                {message.type === "user" && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm">
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <AIThinkingIndicator message="Analyzing..." />
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Button
                onClick={() => handleUserResponse("Let's get started!", "Let's get started!")}
                className="w-full gradient-primary text-primary-foreground py-6 rounded-2xl text-base font-medium"
              >
                Let's Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 1 && !isThinking && (
            <motion.div
              key="basics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <GlassCard className="p-4" hover={false}>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={basicInfo.age}
                      onChange={(e) => setBasicInfo((prev) => ({ ...prev, age: e.target.value }))}
                      className="text-center"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Height (cm)</label>
                    <Input
                      type="number"
                      placeholder="175"
                      value={basicInfo.height}
                      onChange={(e) => setBasicInfo((prev) => ({ ...prev, height: e.target.value }))}
                      className="text-center"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Weight (kg)</label>
                    <Input
                      type="number"
                      placeholder="70"
                      value={basicInfo.weight}
                      onChange={(e) => setBasicInfo((prev) => ({ ...prev, weight: e.target.value }))}
                      className="text-center"
                    />
                  </div>
                </div>
              </GlassCard>
              <Button
                onClick={() =>
                  handleUserResponse(
                    `${basicInfo.age}, ${basicInfo.height}, ${basicInfo.weight}`,
                    `Age: ${basicInfo.age}, Height: ${basicInfo.height}cm, Weight: ${basicInfo.weight}kg`
                  )
                }
                disabled={!basicInfo.age || !basicInfo.height || !basicInfo.weight}
                className="w-full gradient-primary text-primary-foreground py-5 rounded-xl"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 2 && !isThinking && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-3"
            >
              {goals.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => handleUserResponse(goal.value, goal.label)}
                  className="glass-card p-4 flex items-center gap-4 text-left hover:border-primary/50 transition-colors"
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{goal.label}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </button>
              ))}
            </motion.div>
          )}

          {step === 3 && !isThinking && (
            <motion.div
              key="time"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-3"
            >
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleUserResponse(option.value, option.label)}
                  className="glass-card p-4 flex items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                >
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">{option.label}</span>
                </button>
              ))}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary ai-pulse mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                Creating Your Plan
              </h3>
              <p className="text-sm text-muted-foreground">
                This will only take a moment...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
