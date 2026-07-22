"""
FastAPI ML Service — Smart Study Alarm
Endpoints:
  GET  /                        – health check
  POST /predict/focus-score     – focus score regression
  POST /predict/snooze-risk     – snooze probability (0-100) + risk level
  POST /predict/image-verify    – object recognition for wake challenge
"""
from pathlib import Path
import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.image_predictor import predict_image

app = FastAPI(
    title="Smart Study Alarm ML API",
    description="Snooze Risk · Focus Score · Image Verification",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR   = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"

# ── Load models ───────────────────────────────────────────
focus_model = joblib.load(MODELS_DIR / "focus_score_model.pkl")

snooze_bundle  = joblib.load(MODELS_DIR / "snooze_risk_model.pkl")
snooze_model   = snooze_bundle["model"]
snooze_features = snooze_bundle["features"]

# ── Request schemas ───────────────────────────────────────
class FocusScoreRequest(BaseModel):
    study_duration_minutes: int
    breaks_taken: int
    subject_type: int
    time_of_day: int
    self_rating: int
    sleep_hours: float
    distractions: int


class SnoozeRiskRequest(BaseModel):
    hour_of_alarm_decimal: float       # e.g. 6.5 for 6:30 AM
    sleep_duration_prev_night: float   # hours slept last night
    snooze_count_last_7_days: int      # times snoozed in past 7 days
    study_session_pending: int         # 1 = yes, 0 = no
    self_reported_energy: int          # 1 (exhausted) – 5 (energetic)
    day_of_week: str                   # "Monday", "Tuesday", ...


class ImageVerifyRequest(BaseModel):
    image: str   # base64 data URL
    target: str  # expected object: "book", "cup", "pen", "plant", "shoes"


# ── Helpers ───────────────────────────────────────────────
def _build_snooze_row(data: SnoozeRiskRequest) -> pd.DataFrame:
    """Convert request to a one-hot encoded dataframe matching training features."""
    day_cols = {
        "day_of_week_Monday": 0, "day_of_week_Saturday": 0,
        "day_of_week_Sunday": 0, "day_of_week_Thursday": 0,
        "day_of_week_Tuesday": 0, "day_of_week_Wednesday": 0,
    }
    col_key = f"day_of_week_{data.day_of_week}"
    if col_key in day_cols:
        day_cols[col_key] = 1

    row = {
        "hour_of_alarm_decimal":    data.hour_of_alarm_decimal,
        "sleep_duration_prev_night": data.sleep_duration_prev_night,
        "snooze_count_last_7_days": data.snooze_count_last_7_days,
        "study_session_pending":    data.study_session_pending,
        "self_reported_energy":     data.self_reported_energy,
        **day_cols,
    }
    df = pd.DataFrame([row])
    # Ensure column order matches training
    for col in snooze_features:
        if col not in df.columns:
            df[col] = 0
    return df[snooze_features]


# ── Routes ────────────────────────────────────────────────
@app.get("/")
def home():
    return {"message": "Smart Study Alarm ML API v2 Running"}


@app.post("/predict/focus-score")
def predict_focus(data: FocusScoreRequest):
    import traceback
    try:
        df = pd.DataFrame([{
            "study_duration_minutes": data.study_duration_minutes,
            "breaks_taken":           data.breaks_taken,
            "subject_type":           data.subject_type,
            "time_of_day":            data.time_of_day,
            "self_rating":            data.self_rating,
            "sleep_hours":            data.sleep_hours,
            "distractions":           data.distractions,
        }])
        raw = float(focus_model.predict(df)[0])
        clamped = max(0.0, min(100.0, raw))
        return {"focus_score": round(clamped, 1)}
    except Exception as e:
        print("=== FOCUS SCORE ERROR ===")
        traceback.print_exc()
        raise


@app.post("/predict/snooze-risk")
def predict_snooze(data: SnoozeRiskRequest):
    """
    Returns:
      snooze_probability – 0 to 100 (how likely the user will snooze)
      risk_level         – "low" | "medium" | "high"
      will_snooze        – true / false (predicted label)
      message            – motivational message for the alarm screen
    """
    df = _build_snooze_row(data)
    proba       = float(snooze_model.predict_proba(df)[0][1])  # P(snooze)
    will_snooze = bool(snooze_model.predict(df)[0] == 1)

    if proba >= 0.65:
        risk_level = "high"
        message    = "⚠️ High snooze risk detected! A challenge is required to dismiss."
    elif proba >= 0.40:
        risk_level = "medium"
        message    = "🟡 Moderate snooze risk. Stay committed to your study session!"
    else:
        risk_level = "low"
        message    = "✅ Low snooze risk. You're ready to go!"

    return {
        "snooze_probability": round(proba * 100, 1),
        "risk_level":         risk_level,
        "will_snooze":        will_snooze,
        "message":            message,
    }


@app.post("/predict/image-verify")
def image_verify(data: ImageVerifyRequest):
    result = predict_image(data.image, data.target)
    return result