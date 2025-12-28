from pydantic import BaseModel
from typing import Optional, Dict, Any

class UserData(BaseModel):
    energy_level: float  # 1-10
    workout_streak: int
    missed_days: int
    goal_progress: float  # 0-1
    availability: Optional[int] = None  # 1-4 for time slots

class PredictRequest(BaseModel):
    userId: str
    energy_level: float
    workout_streak: int
    missed_days: int
    goal_progress: float
    availability: Optional[int] = 1

class PredictResponse(BaseModel):
    prediction: str  # "Rest", "Light", "Normal", "Intense"
    confidence: float
    risk_level: str  # "Low", "Medium", "High"
    factors: Dict[str, Any]

class CoachRequest(BaseModel):
    userId: str
    message: str
    user_data: UserData

class CoachResponse(BaseModel):
    message: str

class FeedbackRequest(BaseModel):
    userId: str
    completed: bool
    energy: str  # "low", "medium", "high"
    reason: Optional[str] = None

class StatusResponse(BaseModel):
    userId: str
    current_streak: int
    total_completed: int
    average_energy: float
    plan_intensity: str