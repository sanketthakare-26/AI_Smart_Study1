from pathlib import Path
import joblib
import pandas as pd

# Current folder (train/)
BASE_DIR = Path(__file__).resolve().parent

# Model path
MODEL_PATH = BASE_DIR.parent / "models" / "focus_score_model.pkl"

# Load model
model = joblib.load(MODEL_PATH)

# Sample input (replace with your own values)
new_student = pd.DataFrame({
    "study_duration_minutes": [90],
    "breaks_taken": [1],
    "subject_type": [1],   # Use encoded values
    "Time_of_Day": [2],    # Use encoded values
    "self_rating": [4],
    "sleep_hours": [8],
    "distractions": [1]
})

prediction = model.predict(new_student)

print(f"Predicted Focus Score: {prediction[0]:.2f}")