import pandas as pd
import joblib
from pathlib import Path

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

BASE_DIR = Path(__file__).resolve().parent

def evaluate(name, actual, predicted):
    print()
    print(name)
    print("-"*40)
    print("MAE :", mean_absolute_error(actual, predicted))
    print("MSE :", mean_squared_error(actual, predicted))
    print("RMSE :", mean_squared_error(actual, predicted)**0.5)
    print("R2 :", r2_score(actual, predicted))

# ==========================
# Load Test Dataset
# ==========================
test_data = pd.read_csv(BASE_DIR / "../datasets/test data.csv")

# Features (drop target and string columns)
X_test = test_data.drop(["snoozed_flag", "hour_of_alarm", "snooze_risk"], axis=1, errors="ignore")

# Target
y_test = test_data["snoozed_flag"]

# ==========================
# Load Trained Model
# ==========================
try:
    model_bundle = joblib.load(BASE_DIR / "../models/snooze_risk_model.pkl")
    if isinstance(model_bundle, dict):
        model = model_bundle["model"]
        features = model_bundle["features"]
    else:
        model = model_bundle
        features = None
except Exception as e:
    print("Could not load snooze model in evaluation:", e)
    model = None
    features = None

# ==========================
# Make Predictions & Evaluate if model exists
# ==========================
if model:
    try:
        # Align features if the training feature names are available
        if features:
            if "day_of_week" in X_test.columns:
                X_test = pd.get_dummies(X_test, columns=["day_of_week"])
            for col in features:
                if col not in X_test.columns:
                    X_test[col] = 0
            X_test = X_test[features]

        y_pred = model.predict(X_test)
        print("\n========== MODEL EVALUATION ==========\n")
        print("Accuracy :", round(accuracy_score(y_test, y_pred) * 100, 2), "%")
        print("Precision:", round(precision_score(y_test, y_pred), 2))
        print("Recall   :", round(recall_score(y_test, y_pred), 2))
        print("F1 Score :", round(f1_score(y_test, y_pred), 2))
        print("\nConfusion Matrix")
        print(confusion_matrix(y_test, y_pred))
        print("\nClassification Report")
        print(classification_report(y_test, y_pred))
    except Exception as e:
        print("Evaluation prediction failed:", e)
