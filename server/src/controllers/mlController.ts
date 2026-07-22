import { Request, Response } from "express";

const ML_SERVICE_URL = "http://localhost:8000";

export const predictSnoozeRisk = async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/snooze-risk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`FastAPI returned status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.warn("⚠️ FastAPI backend unavailable, using server fallback ML snooze predictor");
    const { snooze_count_last_7_days = 1, sleep_duration_prev_night = 7.5, self_reported_energy = 4, hour_of_alarm_decimal = 7 } = req.body || {};
    
    const isHighRiskCondition = (sleep_duration_prev_night < 3 && self_reported_energy <= 2) || (sleep_duration_prev_night < 4 && snooze_count_last_7_days >= 3);

    let snooze_probability = 20;
    let risk_level = "low";

    if (isHighRiskCondition) {
      snooze_probability = 88;
      risk_level = "high";
    } else if (sleep_duration_prev_night < 5 || self_reported_energy <= 2 || snooze_count_last_7_days >= 2) {
      snooze_probability = 45;
      risk_level = "medium";
    } else {
      snooze_probability = 20;
      risk_level = "low";
    }

    return res.status(200).json({
      snooze_probability,
      risk_level,
      will_snooze: snooze_probability >= 50,
      factors: [
        `Sleep: ${sleep_duration_prev_night}h`,
        `Past Snoozes: ${snooze_count_last_7_days}`,
        `Energy Level: ${self_reported_energy}/5`
      ]
    });
  }
};

export const predictBestSlot = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ error: "Missing date" });
    }

    const response = await fetch(`${ML_SERVICE_URL}/predict/best-slot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI returned status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Best slot prediction failed:", error);
    return res.status(500).json({ error: "ML prediction service unavailable" });
  }
};

export const predictFocusScore = async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/focus-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`FastAPI returned status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Focus score prediction failed:", error);
    return res.status(500).json({ error: "ML prediction service unavailable" });
  }
};

export const predictImageVerify = async (req: Request, res: Response) => {
  try {
    const { image, target } = req.body;
    if (!image || !target) {
      return res.status(400).json({ error: "Missing image or target" });
    }

    const response = await fetch(`${ML_SERVICE_URL}/predict/image-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, target }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI returned status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Image verification failed:", error);
    return res.status(500).json({ error: "ML prediction service unavailable" });
  }
};
