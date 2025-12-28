import json
import os

class WorkoutPredictor:
    def __init__(self):
        self.intensity_map = {0: "Rest", 1: "Light", 2: "Normal", 3: "Intense"}
        # Pre-trained "model" - simple rules
        pass

    def predict(self, energy: float, skipped_days: int, completion_rate: float, availability: int):
        # Simple rule-based prediction
        score = 0

        # Energy factor
        if energy >= 7:
            score += 3
        elif energy >= 5:
            score += 2
        elif energy >= 3:
            score += 1

        # Skipped days penalty
        score -= min(skipped_days, 3)

        # Completion rate bonus
        score += int(completion_rate * 2)

        # Availability bonus
        score += min(availability - 1, 2)

        # Clamp score
        score = max(0, min(3, score))

        prediction = self.intensity_map[score]

        # Mock confidence based on score
        confidence = 0.6 + (score * 0.1)
        confidence = min(0.95, confidence)

        risk_level = "Low" if score >= 2 else "Medium" if score >= 1 else "High"

        factors = {
            "energy_level": energy,
            "skipped_days": skipped_days,
            "completion_rate": completion_rate,
            "availability": availability,
            "calculated_score": score
        }

        return {
            "prediction": prediction,
            "confidence": round(confidence, 2),
            "risk_level": risk_level,
            "factors": factors
        }

# Global predictor instance
predictor = WorkoutPredictor()