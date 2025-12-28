import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Beef, Apple, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

interface NutritionPreferencesProps {
  onPreferenceSelect: (preference: "veg" | "non-veg") => void;
}

export function NutritionPreferences({ onPreferenceSelect }: NutritionPreferencesProps) {
  const [selectedPreference, setSelectedPreference] = useState<"veg" | "non-veg" | null>(null);

  const preferences = [
    {
      id: "veg" as const,
      label: "Vegetarian",
      icon: Leaf,
      description: "Plant-based meals with vegetables, fruits, grains, and dairy",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "non-veg" as const,
      label: "Non-Vegetarian",
      icon: Beef,
      description: "Includes meat, fish, eggs, and all vegetarian options",
      color: "from-orange-500 to-red-600"
    }
  ];

  const handlePreferenceClick = (preference: "veg" | "non-veg") => {
    console.log('Preference clicked:', preference);
    setSelectedPreference(preference);
  };

  const handleContinue = () => {
    console.log('Continue clicked, selectedPreference:', selectedPreference);
    if (selectedPreference) {
      console.log('Calling onPreferenceSelect with:', selectedPreference);
      onPreferenceSelect(selectedPreference);
    } else {
      console.log('No preference selected');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <Apple className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Choose Your Diet
          </h1>
          <p className="text-muted-foreground">
            Select your preferred dietary style to get personalized meal plans
          </p>
        </motion.div>

        <div className="space-y-4 mb-8">
          {preferences.map((pref, index) => {
            const Icon = pref.icon;
            const isSelected = selectedPreference === pref.id;

            return (
                <GlassCard
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => {
                    console.log('GlassCard clicked for:', pref.id);
                    handlePreferenceClick(pref.id);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${pref.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {pref.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {pref.description}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  </div>
                </GlassCard>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            onClick={() => {
              console.log('Create Nutrition Plan button clicked');
              handleContinue();
            }}
            disabled={!selectedPreference}
            className="w-full py-6 text-lg font-medium"
            size="lg"
          >
            Create Nutrition Plan
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}