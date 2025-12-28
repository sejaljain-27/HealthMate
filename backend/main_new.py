from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_model import predictor
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for demo
user_data_store = {}

@app.route("/")
def root():
    return {"message": "Backend running successfully"}

@app.route("/predict_completion", methods=["POST"])
def predict_completion():
    try:
        data = request.get_json()
        result = predictor.predict(
            energy=data.get("energy_level", 5),
            skipped_days=data.get("missed_days", 0),
            completion_rate=data.get("goal_progress", 0.5),
            availability=data.get("availability", 1)
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/coach_response", methods=["POST"])
def coach_response():
    try:
        data = request.get_json()
        user_data = data.get("user_data", {})
        energy = user_data.get("energy_level", 5)
        streak = user_data.get("workout_streak", 0)
        missed = user_data.get("missed_days", 0)
        message = data.get("message", "").lower()

        if energy < 4:
            response = "I see your energy is low today. Let's focus on recovery. A short walk or gentle stretching would be perfect."
        elif missed > 2:
            response = "You've had a few missed days, but that's okay! Let's ease back in with something light and build from there."
        elif streak >= 3:
            response = f"Great streak of {streak} days! Keep the momentum going with today's workout."
        else:
            response = "Based on your recent activity, today's plan is adjusted to match your current energy and progress."

        # Incorporate user message if motivational
        if "motivation" in message:
            response += " Remember, every step counts towards your goals!"

        return jsonify({"message": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/feedback", methods=["POST"])
def submit_feedback():
    try:
        data = request.get_json()
        userId = data.get("userId", "default")
        if userId not in user_data_store:
            user_data_store[userId] = {
                "streak": 0,
                "total_completed": 0,
                "energy_sum": 0,
                "energy_count": 0,
                "last_intensity": "Normal"
            }

        user = user_data_store[userId]

        # Update streak
        if data.get("completed", False):
            user["streak"] += 1
            user["total_completed"] += 1
        else:
            user["streak"] = 0

        # Update energy
        energy_map = {"low": 3, "medium": 6, "high": 9}
        energy_val = energy_map.get(data.get("energy", "medium"), 6)
        user["energy_sum"] += energy_val
        user["energy_count"] += 1

        return jsonify({"status": "Feedback recorded"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/status/<userId>", methods=["GET"])
def get_status(userId):
    try:
        if userId not in user_data_store:
            return jsonify({"error": "User not found"}), 404

        user = user_data_store[userId]
        avg_energy = user["energy_sum"] / user["energy_count"] if user["energy_count"] > 0 else 6

        # Predict current intensity
        intensity = predictor.predict(
            energy=avg_energy,
            skipped_days=7 - user["streak"],
            completion_rate=user["total_completed"] / max(1, user["total_completed"] + (7 - user["streak"])),
            availability=2
        )["prediction"]

        return jsonify({
            "userId": userId,
            "current_streak": user["streak"],
            "total_completed": user["total_completed"],
            "average_energy": round(avg_energy, 1),
            "plan_intensity": intensity
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)