# HealthMate – Adaptive Agentic Fitness Coach

## Problem Definition
Most fitness applications assume perfect consistency from users. In reality, people miss workouts, feel low energy, and struggle with motivation. Existing systems penalize failure instead of adapting to it, leading to burnout and abandonment.

HealthMate addresses this gap by introducing an agentic fitness system that adapts intelligently to user behavior rather than enforcing rigid plans.

---

## Target Users
- Students with irregular schedules
- Working professionals
- Beginners struggling with fitness consistency
- Users prone to burnout or drop-off

---

## Why an Agentic System?
Fitness adherence is a dynamic human behavior problem. Static rule-based systems fail to respond to uncertainty, fatigue, and inconsistency.

HealthMate uses an agentic approach where autonomous agents:
- Observe user behavior
- Maintain state over time
- Make decisions independently
- Explain their reasoning

This enables human-centric adaptation rather than rigid enforcement.

---

## Agent Roles & Responsibilities

### 1. User State Tracking Agent
- Tracks energy levels
- Maintains workout streaks
- Records missed days

### 2. Decision & Planning Agent
- Uses ML prediction to estimate workout completion
- Adjusts intensity automatically
- Activates recovery modes when needed

### 3. Explainability Agent
- Explains why decisions were made
- Provides motivational feedback
- Builds transparency and trust

---

## System Architecture

Frontend (React)
- Login / Signup
- Daily Check-in UI
- Explainable feedback display

Backend (FastAPI)
- User authentication
- State storage (in-memory)
- Decision orchestration

ML Component
- Predicts workout completion probability
- Influences agent decisions

---

## Workflow

1. User logs in
2. User performs daily check-in
3. Backend updates user state
4. ML model predicts completion likelihood
5. Decision agent adjusts plan
6. Explainability agent returns feedback
7. Cycle repeats daily

---

## Unique Features

- Failure-Aware Planning
- Autonomous Intensity Adjustment
- Explainable AI Feedback
- Human-centric fitness design
- Adaptive behavior modeling

---

## Setup Instructions

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
###frontend
npm run dev
##flowchart
User Login / Signup
        ↓
Daily Check-in (Energy, Completion)
        ↓
User State Update (Backend Memory)
        ↓
ML Predictor (Completion Probability)
        ↓
Decision Agent
  ├─ Reduce Intensity
  ├─ Maintain Plan
  └─ Recovery Mode
        ↓
Explainable Feedback to User
        ↓
Next Day Loop
