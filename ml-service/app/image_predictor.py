"""
Image Verification Predictor — FastAPI endpoint
POST /predict/image-verify  { image: base64_string }
Returns { predicted: str, confidence: float, correct: bool, target: str }
"""
import os
import io
import base64
import pickle
import numpy as np
import cv2
from pathlib import Path

BASE_DIR   = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

_clf    = None
_scaler = None
_le     = None

def _load_models():
    global _clf, _scaler, _le
    if _clf is None:
        with open(MODELS_DIR / "image_classifier.pkl", "rb") as f:
            _clf = pickle.load(f)
        with open(MODELS_DIR / "image_scaler.pkl", "rb") as f:
            _scaler = pickle.load(f)
        with open(MODELS_DIR / "image_labels.pkl", "rb") as f:
            _le = pickle.load(f)

IMG_SIZE = (64, 64)

def extract_features(img_bgr):
    """Extract same features used during training."""
    img = cv2.resize(img_bgr, IMG_SIZE)
    flat = img.flatten().astype(np.float32) / 255.0

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gx   = cv2.Sobel(gray, cv2.CV_32F, 1, 0)
    gy   = cv2.Sobel(gray, cv2.CV_32F, 0, 1)
    mag, ang = cv2.cartToPolar(gx, gy)
    hist, _  = np.histogram(ang.flatten(), bins=9, range=(0, 2 * np.pi),
                            weights=mag.flatten())
    hist = hist.astype(np.float32)
    hist /= (hist.sum() + 1e-7)

    hsv    = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    ch, _  = np.histogram(hsv[:, :, 0].flatten(), bins=8, range=(0, 180))
    cs, _  = np.histogram(hsv[:, :, 1].flatten(), bins=8, range=(0, 256))
    cv_, _ = np.histogram(hsv[:, :, 2].flatten(), bins=8, range=(0, 256))
    color_hist = np.concatenate([ch, cs, cv_]).astype(np.float32)
    color_hist /= (color_hist.sum() + 1e-7)

    return np.concatenate([flat, hist, color_hist])


def predict_image(image_b64: str, target_class: str) -> dict:
    """
    Decode a base64 image, run ML classifier, compare to target.
    Returns dict with prediction result.
    """
    _load_models()

    # Decode base64 -> numpy BGR image
    if "," in image_b64:
        image_b64 = image_b64.split(",", 1)[1]
    img_bytes = base64.b64decode(image_b64)
    np_arr    = np.frombuffer(img_bytes, np.uint8)
    img_bgr   = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img_bgr is None:
        return {"error": "Could not decode image"}

    feat = extract_features(img_bgr).reshape(1, -1)
    feat_s = _scaler.transform(feat)

    proba      = _clf.predict_proba(feat_s)[0]

    # Top-1 predicted class
    class_idx  = int(np.argmax(proba))
    predicted  = str(_le.inverse_transform([class_idx])[0])
    confidence = float(proba[class_idx])

    # All class probabilities for debugging feedback
    classes_list = [c.lower() for c in _le.classes_]
    target_lower = target_class.lower()
    target_proba = 0.0
    if target_lower in classes_list:
        target_proba = float(proba[classes_list.index(target_lower)])

    # Alarm stops ONLY when:
    #  1. The ML model's top-1 prediction IS exactly the target object
    #  2. AND confidence >= 15%
    is_correct = (predicted.lower() == target_lower) and (confidence >= 0.15)

    return {
        "predicted":      predicted,
        "confidence":     round(confidence * 100, 1),
        "target":         target_class,
        "target_conf":    round(target_proba * 100, 1),   # how confident model is about target
        "correct":        is_correct
    }
