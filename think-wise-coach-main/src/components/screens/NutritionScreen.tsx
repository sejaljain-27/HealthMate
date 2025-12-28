import { useState } from "react";
import { motion } from "framer-motion";
import { NutritionPreferences } from "./NutritionPreferences";
import { NutritionPlan } from "./NutritionPlan";

export function NutritionScreen() {
  const [hasSelectedPreferences, setHasSelectedPreferences] = useState(false);
  const [dietPreference, setDietPreference] = useState<"veg" | "non-veg" | null>(null);

  const handlePreferenceSelect = (preference: "veg" | "non-veg") => {
    console.log('NutritionScreen: Preference selected:', preference);
    setDietPreference(preference);
    setHasSelectedPreferences(true);
  };

  const handleBackToPreferences = () => {
    console.log('NutritionScreen: Back to preferences');
    setHasSelectedPreferences(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <motion.div
        key={hasSelectedPreferences ? "plan" : "preferences"}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {!hasSelectedPreferences ? (
          <NutritionPreferences onPreferenceSelect={handlePreferenceSelect} />
        ) : (
          <NutritionPlan
            dietPreference={dietPreference!}
            onBackToPreferences={handleBackToPreferences}
          />
        )}
      </motion.div>
    </div>
  );
}