import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Heart, Zap, Moon, Sun } from "lucide-react";
import { AppLayout, Header } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { AIThinkingIndicator } from "@/components/ui/AIThinkingIndicator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  type: "ai" | "user";
  content: string;
}

const suggestions = [
  { icon: Heart, text: "I need motivation today", color: "text-destructive" },
  { icon: Zap, text: "Quick workout ideas", color: "text-warning" },
  { icon: Moon, text: "Recovery tips", color: "text-primary" },
  { icon: Sun, text: "Morning routine", color: "text-secondary" },
];

const contextualMessages = [
  {
    condition: "energy-low",
    message: "I noticed your energy has been lower lately. Today looks heavy — a short walk is enough. Sometimes the best workout is the one that keeps you moving without draining you.",
  },
  {
    condition: "streak",
    message: "You've completed 3 workouts in a row! Your consistency is building real momentum. Keep it up, but remember: rest days are earned celebrations, not failures.",
  },
  {
    condition: "missed",
    message: "Yesterday didn't go as planned, and that's perfectly okay. I've already adjusted today's workout to be lighter. Recovery is part of progress.",
  },
];

export function CoachScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: "Hey! 👋 I noticed your energy has been lower lately. Today looks heavy — a short walk is enough. Sometimes the best workout is the one that keeps you moving.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, type: "user", content: messageText },
    ]);
    setInputValue("");
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const responses = [
        "That's a great question! Based on your goals and current fitness level, I'd recommend focusing on consistency over intensity. Even 15 minutes of movement daily compounds into significant progress.",
        "I understand how you feel. Remember, every champion was once a contender who refused to give up. Your next workout doesn't need to be perfect — it just needs to happen.",
        "Recovery is when your body actually gets stronger. I've noticed you've been pushing hard. Let's make today about light movement and stretching.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, type: "ai", content: randomResponse },
      ]);
    }, 1500);
  };

  return (
    <AppLayout>
      <Header
        title="Your Health Mate"
        subtitle="Always here to help"
        action={
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center ai-pulse">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
        }
      />

      {/* Messages */}
      <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.type === "ai" ? (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <GlassCard className="p-4" hover={false}>
                    <p className="text-sm text-foreground leading-relaxed">{message.content}</p>
                  </GlassCard>
                </div>
              ) : (
                <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%]">
                  <p className="text-sm">{message.content}</p>
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
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <AIThinkingIndicator message="Thinking..." />
          </motion.div>
        )}
      </div>

      {/* Quick Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <p className="text-xs text-muted-foreground mb-3 px-1">Quick actions</p>
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <button
                key={index}
                onClick={() => handleSend(suggestion.text)}
                className="glass-card p-3 flex items-center gap-2 text-left hover:border-primary/30 transition-colors"
              >
                <Icon className={cn("w-4 h-4", suggestion.color)} />
                <span className="text-sm text-foreground">{suggestion.text}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-2"
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask your Health Mate anything..."
          className="flex-1 bg-card border-border rounded-xl"
        />
        <Button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isThinking}
          className="gradient-primary text-primary-foreground rounded-xl px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Contextual Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <GlassCard className="p-4 gradient-ai border-none" hover={false}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Today's Insight</p>
              <p className="text-xs text-muted-foreground">
                Based on your check-ins, you perform best with morning workouts. Consider shifting tomorrow's session earlier for better energy.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AppLayout>
  );
}
