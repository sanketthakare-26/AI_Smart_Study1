import os
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

def train_snooze_risk_model():
    print("Training Snooze Risk Model...")
    
    np.random.seed(42)
    n_samples = 500
    
    sleep_duration = np.random.uniform(4, 9, n_samples)
    alarm_hour = np.random.uniform(5, 9, n_samples)
    day_of_week = np.random.randint(0, 7, n_samples)
    
    logit = 5.0 - 0.8 * sleep_duration - 0.3 * alarm_hour + 0.1 * day_of_week
    prob = 1 / (1 + np.exp(-logit))
    snooze = (np.random.uniform(0, 1, n_samples) < prob).astype(int)
    
    df = pd.DataFrame({
        "sleep_duration": sleep_duration,
        "alarm_hour": alarm_hour,
        "day_of_week": day_of_week,
        "snooze": snooze
    })
    
    X = df[["sleep_duration", "alarm_hour", "day_of_week"]]
    y = df["snooze"]
    
    model = LogisticRegression()
    model.fit(X, y)
    
    # Save relative to the execution root (ml-service/)
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/snooze_risk_model.pkl")
    print("Snooze Risk Model saved to models/snooze_risk_model.pkl")

if __name__ == "__main__":
    train_snooze_risk_model()
