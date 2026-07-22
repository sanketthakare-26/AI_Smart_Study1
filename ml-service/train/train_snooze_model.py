"""
Snooze Risk Model — standalone training script
Dataset: ml-service/datasets/train_dataset.csv

Features:
  hour_of_alarm_decimal   – alarm hour (e.g. 6.5 = 6:30 AM)
  sleep_duration_prev_night – hours slept last night
  snooze_count_last_7_days  – how many times snoozed this week
  study_session_pending     – 1 if a study session is due today, else 0
  self_reported_energy      – energy level 1-5
  day_of_week_*             – one-hot day columns
Target:
  snoozed_flag – 1 = will snooze, 0 = will wake up
"""
import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

from pathlib import Path
import pandas as pd
import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, classification_report
)

BASE_DIR   = Path(__file__).resolve().parent
DATASETS   = BASE_DIR.parent / "datasets"
MODELS_DIR = BASE_DIR.parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

# ── Load dataset ──────────────────────────────────────────
df = pd.read_csv(DATASETS / "train_dataset.csv")
print(f"[INFO] Loaded train_dataset.csv  rows={len(df)}  cols={list(df.columns)}")

# Drop the human-readable time string — keep decimal only
if "hour_of_alarm" in df.columns:
    df = df.drop(columns=["hour_of_alarm"])

FEATURE_COLS = [c for c in df.columns if c != "snoozed_flag"]
TARGET_COL   = "snoozed_flag"

# Convert bool-like strings to int if needed
bool_like = df[FEATURE_COLS].select_dtypes(include="object").columns
for col in bool_like:
    df[col] = df[col].map({"True": 1, "False": 0, True: 1, False: 0}).fillna(0).astype(int)

X = df[FEATURE_COLS]
y = df[TARGET_COL]

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# ── Train ─────────────────────────────────────────────────
clf = RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42)
clf.fit(X_train, y_train)

# ── Evaluate ──────────────────────────────────────────────
y_pred = clf.predict(X_val)
print(f"\n[EVAL] Accuracy  : {accuracy_score(y_val, y_pred)*100:.1f}%")
print(f"[EVAL] Precision : {precision_score(y_val, y_pred):.2f}")
print(f"[EVAL] Recall    : {recall_score(y_val, y_pred):.2f}")
print(f"[EVAL] F1        : {f1_score(y_val, y_pred):.2f}")
print("\n" + classification_report(y_val, y_pred, target_names=["Will Wake", "Will Snooze"]))

# Save feature column names alongside the model for inference
joblib.dump({"model": clf, "features": FEATURE_COLS}, MODELS_DIR / "snooze_risk_model.pkl")
print(f"\n[OK] Saved model to {MODELS_DIR / 'snooze_risk_model.pkl'}")
