from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import json
import os
from ml_model import predictor

app = FastAPI()
import json
import os

USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)


# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Persistent Storage ----------------
DATA_FILE = "users.json"

def load_users():
    if not os.path.exists(DATA_FILE):
        return {"users": {}}
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_users(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

user_data_store: Dict[str, dict] = load_users()

# ---------------- Schemas ----------------
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class PredictCompletionRequest(BaseModel):
    energy_level: int = 5
    missed_days: int = 0
    goal_progress: float = 0.5
    availability: int = 1

class CoachRequest(BaseModel):
    user_data: dict
    message: str = ""

class FeedbackRequest(BaseModel):
    userId: str
    completed: bool
    energy: str = "medium"

# ---------------- Root ----------------
@app.get("/")
def root():
    return {"message": "Backend running successfully"}

# ---------------- SIGNUP ----------------
@app.post("/signup")
def signup(data: SignupRequest):
    users = user_data_store["users"]

    if data.email in users:
        raise HTTPException(status_code=400, detail="User already exists")

    users[data.email] = {
        "name": data.name,
        "email": data.email,
        "password": data.password
    }

    save_users(user_data_store)

    return {
        "message": "Signup successful",
        "user": {
            "name": data.name,
            "email": data.email
        }
    }

# ---------------- LOGIN ----------------
@app.post("/login")
def login(data: LoginRequest):
    users = user_data_store["users"]
    user = users.get(data.email)

    if not user or user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    }

# ---------------- ML Prediction ----------------
@app.post("/predict_completion")
def predict_completion(data: PredictCompletionRequest):
    try:
        return predictor.predict(
            energy=data.energy_level,
            skipped_days=data.missed_days,
            completion_rate=data.goal_progress,
            availability=data.availability,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- Coach Response ----------------
@app.post("/coach_response")
def coach_response(data: CoachRequest):
    try:
        energy = data.user_data.get("energy_level", 5)
        streak = data.user_data.get("workout_streak", 0)
        missed = data.user_data.get("missed_days", 0)

        if energy < 4:
            response = "Low energy today. Focus on recovery."
        elif missed > 2:
            response = "Ease back into your routine."
        elif streak >= 3:
            response = f"Great {streak}-day streak! Keep going."
        else:
            response = "Your plan is adjusted for today."

        return {"message": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------- Feedback ----------------
@app.post("/feedback")
def submit_feedback(data: FeedbackRequest):
    userId = data.userId

    if userId not in user_data_store:
        user_data_store[userId] = {
            "streak": 0,
            "completed": 0
        }

    user = user_data_store[userId]

    if data.completed:
        user["streak"] += 1
        user["completed"] += 1
    else:
        user["streak"] = 0

    save_users(user_data_store)
    return {"status": "Feedback saved"}
