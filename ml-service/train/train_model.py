from pathlib import Path
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from evaluate_model import evaluate

BASE_DIR = Path(__file__).resolve().parent

# ==========================
# 1. Focus Score Model
# ==========================
df = pd.read_csv(BASE_DIR / "../datasets/focus_score_preprocessed.csv")
print("Focus Score dataset head:")
print(df.head())

X = df.drop("focus_score", axis=1)
y = df["focus_score"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

linear_model = LinearRegression()
decision_tree = DecisionTreeRegressor(random_state=42)
random_forest = RandomForestRegressor(n_estimators=100, random_state=42)

linear_model.fit(X_train, y_train)
decision_tree.fit(X_train, y_train)
random_forest.fit(X_train, y_train)

linear_prediction = linear_model.predict(X_test)
decision_prediction = decision_tree.predict(X_test)
forest_prediction = random_forest.predict(X_test)

evaluate("Linear Regression", y_test, linear_prediction)
evaluate("Decision Tree", y_test, decision_prediction)
evaluate("Random Forest", y_test, forest_prediction)

joblib.dump(random_forest, BASE_DIR / "../models/focus_score_model.pkl")
print("Focus Score model saved successfully!")

# ==========================
# 2. Snooze Risk Model
# ==========================
# Load Training Dataset
train_data = pd.read_csv(BASE_DIR / "../datasets/train data.csv")

# Features (drop non-numeric columns and target)
X_train_snooze = train_data.drop(["snoozed_flag", "hour_of_alarm"], axis=1, errors="ignore")

# Target
y_train_snooze = train_data["snoozed_flag"]

# Train Random Forest Classifier
snooze_model = RandomForestClassifier(n_estimators=150, max_depth=8, random_state=42)
snooze_model.fit(X_train_snooze, y_train_snooze)
print("Snooze Model trained successfully!")

# Save Model Bundle (including feature names)
features = list(X_train_snooze.columns)
joblib.dump({"model": snooze_model, "features": features}, BASE_DIR / "../models/snooze_risk_model.pkl")
print("Snooze Model bundle saved as snooze_risk_model.pkl")
