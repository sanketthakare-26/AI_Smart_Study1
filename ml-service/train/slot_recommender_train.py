import os
import joblib
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

def train_slot_recommender_model():
    print("Training Study Slot Recommender Model...")
    
    np.random.seed(42)
    n_samples = 600
    
    hour_of_day = np.random.uniform(5, 23, n_samples)
    day_of_week = np.random.randint(0, 7, n_samples)
    
    is_morning_peak = (hour_of_day >= 6) & (hour_of_day <= 8.5)
    is_afternoon_peak = (hour_of_day >= 15) & (hour_of_day <= 17.5)
    
    prob = 0.2 + 0.65 * is_morning_peak.astype(float) + 0.5 * is_afternoon_peak.astype(float)
    is_weekend = day_of_week >= 5
    prob[is_weekend] = prob[is_weekend] * 0.9
    
    is_peak_focus = (np.random.uniform(0, 1, n_samples) < prob).astype(int)
    
    df = pd.DataFrame({
        "hour_of_day": hour_of_day,
        "day_of_week": day_of_week,
        "is_peak_focus": is_peak_focus
    })
    
    X = df[["hour_of_day", "day_of_week"]]
    y = df["is_peak_focus"]
    
    model = DecisionTreeClassifier(max_depth=4)
    model.fit(X, y)
    
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/slot_recommender_model.pkl")
    print("Study Slot Recommender Model saved to models/slot_recommender_model.pkl")

if __name__ == "__main__":
    train_slot_recommender_model()
