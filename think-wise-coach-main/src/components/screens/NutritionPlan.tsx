import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Utensils,
  Apple,
  Coffee,
  ChefHat,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

interface NutritionPlanProps {
  dietPreference: "veg" | "non-veg";
  onBackToPreferences: () => void;
}

interface Meal {
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string;
}

interface DayPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

export function NutritionPlan({
  dietPreference,
  onBackToPreferences,
}: NutritionPlanProps) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
  };

  const handleMealClick = (mealType: string) => {
    setExpandedMeal(expandedMeal === mealType ? null : mealType);
  };

  const generateMealPlan = (): DayPlan[] => {
    const baseMeals = {
      vegetarian: {
        breakfast: [
          {
            name: "Oatmeal with Berries",
            time: "8:00 AM",
            calories: 320,
            protein: 12,
            carbs: 55,
            fat: 8,
            ingredients: [
              "1/2 cup rolled oats",
              "1 cup almond milk",
              "1/2 cup mixed berries",
              "1 tbsp chia seeds",
              "1 tsp honey",
            ],
            instructions:
              "Cook oats with almond milk for 5 minutes. Top with berries, chia seeds, and honey.",
          },
        ],
        lunch: [
          {
            name: "Quinoa Buddha Bowl",
            time: "1:00 PM",
            calories: 450,
            protein: 18,
            carbs: 65,
            fat: 15,
            ingredients: [
              "1/2 cup quinoa",
              "Mixed greens",
              "Chickpeas",
              "Avocado",
              "Tahini",
            ],
            instructions:
              "Combine all ingredients in a bowl and drizzle with tahini.",
          },
        ],
        dinner: [
          {
            name: "Tofu Stir Fry",
            time: "7:00 PM",
            calories: 420,
            protein: 25,
            carbs: 45,
            fat: 18,
            ingredients: ["Tofu", "Broccoli", "Bell pepper", "Soy sauce"],
            instructions: "Stir fry tofu and veggies until golden.",
          },
        ],
      },
      "non-vegetarian": {
        breakfast: [
          {
            name: "Eggs & Toast",
            time: "8:00 AM",
            calories: 380,
            protein: 22,
            carbs: 35,
            fat: 18,
            ingredients: ["Eggs", "Whole grain bread"],
            instructions: "Scramble eggs and serve with toast.",
          },
        ],
        lunch: [
          {
            name: "Grilled Chicken Salad",
            time: "1:00 PM",
            calories: 420,
            protein: 35,
            carbs: 25,
            fat: 18,
            ingredients: ["Chicken breast", "Mixed greens"],
            instructions: "Grill chicken and serve over salad.",
          },
        ],
        dinner: [
          {
            name: "Grilled Salmon",
            time: "7:00 PM",
            calories: 450,
            protein: 40,
            carbs: 20,
            fat: 25,
            ingredients: ["Salmon", "Broccoli", "Quinoa"],
            instructions: "Grill salmon and serve with sides.",
          },
        ],
      },
    };

    const meals =
      baseMeals[dietPreference === "veg" ? "vegetarian" : "non-vegetarian"];

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return days.map((day, index) => ({
      day,
      breakfast: meals.breakfast[index % meals.breakfast.length],
      lunch: meals.lunch[index % meals.lunch.length],
      dinner: meals.dinner[index % meals.dinner.length],
      snacks: [
        {
          name: "Greek Yogurt",
          time: "10:00 AM",
          calories: 150,
          protein: 15,
          carbs: 12,
          fat: 5,
          ingredients: ["Greek yogurt"],
          instructions: "Enjoy fresh.",
        },
      ],
    }));
  };

  const weeklyPlan = generateMealPlan();
  const currentDayPlan = weeklyPlan.find(
    (plan) => plan.day === selectedDay
  );

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button variant="ghost" onClick={onBackToPreferences}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Preferences
        </Button>

        {currentDayPlan && (
          <div className="space-y-6 mt-6">
            <GlassCard onClick={() => handleMealClick("breakfast")}>
              <h3 className="text-xl font-semibold">
                Breakfast — {currentDayPlan.breakfast.name}
              </h3>
              {expandedMeal === "breakfast" && (
                <p className="mt-2 text-muted-foreground">
                  {currentDayPlan.breakfast.instructions}
                </p>
              )}
            </GlassCard>

            <GlassCard onClick={() => handleMealClick("lunch")}>
              <h3 className="text-xl font-semibold">
                Lunch — {currentDayPlan.lunch.name}
              </h3>
              {expandedMeal === "lunch" && (
                <p className="mt-2 text-muted-foreground">
                  {currentDayPlan.lunch.instructions}
                </p>
              )}
            </GlassCard>

            <GlassCard onClick={() => handleMealClick("dinner")}>
              <h3 className="text-xl font-semibold">
                Dinner — {currentDayPlan.dinner.name}
              </h3>
              {expandedMeal === "dinner" && (
                <p className="mt-2 text-muted-foreground">
                  {currentDayPlan.dinner.instructions}
                </p>
              )}
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
