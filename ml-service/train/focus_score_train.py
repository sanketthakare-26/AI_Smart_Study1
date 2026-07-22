import os
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

def train_focus_score_model():
    print("Training Focus Score Regression Model...")
    
    np.random.seed(42)
    n_samples = 400
    
    sleep_hours = np.random.uniform(4, 10, n_samples)
    sessions_today = np.random.randint(0, 8, n_samples)
    
    sleep_deviation = np.abs(sleep_hours - 7.8)
    base_score = 92 - 7.5 * sleep_deviation - 2.5 * sessions_today
    
    noise = np.random.normal(0, 4, n_samples)
    focus_score = np.clip(base_score + noise, 20, 100)
    
    df = pd.DataFrame({
        "sleep_hours": sleep_hours,
        "sessions_today": sessions_today,
        "focus_score": focus_score
    })
    
    X = df[["sleep_hours", "sessions_today"]]
    y = df["focus_score"]
    
    model = LinearRegression()
    model.fit(X, y)
    
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/focus_score_model.pkl")
    print("Focus Score Regression Model saved to models/focus_score_model.pkl")

if __name__ == "__main__":
    train_focus_score_model()
