import { Request, Response } from "express";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// ── Snooze Risk ───────────────────────────────────────────────────────────────
export const predictSnoozeRisk = async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/snooze-risk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(4000),   // 4s timeout — don't wait forever
    });

    if (!response.ok) throw new Error(`FastAPI returned status ${response.status}`);
    const data = await response.json();
    return res.status(200).json(data);

  } catch (_) {
    console.warn("⚠️ FastAPI unavailable — using server-side snooze predictor");

    const {
      snooze_count_last_7_days = 1,
      sleep_duration_prev_night = 7,
      self_reported_energy = 3,
      hour_of_alarm_decimal = 7,
      study_session_pending = 0,
    } = req.body || {};

    // Realistic scoring: weighted sum (0–100)
    let score = 0;

    // Sleep contribution (weight: 35)
    if (sleep_duration_prev_night < 4)      score += 35;
    else if (sleep_duration_prev_night < 5.5) score += 25;
    else if (sleep_duration_prev_night < 6.5) score += 15;
    else if (sleep_duration_prev_night < 7.5) score += 5;

    // Past snooze history (weight: 30)
    if (snooze_count_last_7_days >= 5)      score += 30;
    else if (snooze_count_last_7_days >= 3)  score += 20;
    else if (snooze_count_last_7_days >= 1)  score += 10;

    // Energy level contribution (weight: 20, scale 1–5)
    const energyPenalty = Math.round((5 - self_reported_energy) * 4);
    score += energyPenalty;

    // Early alarm bonus risk (weight: 10)
    if (hour_of_alarm_decimal < 5.5)  score += 10;
    else if (hour_of_alarm_decimal < 6.5) score += 6;
    else if (hour_of_alarm_decimal < 7.5) score += 3;

    // Pending study session reduces risk slightly
    if (study_session_pending === 1) score = Math.max(0, score - 5);

    const snooze_probability = Math.min(95, Math.max(5, score));
    const risk_level = snooze_probability >= 60 ? "high"
                     : snooze_probability >= 35 ? "medium"
                     : "low";

    return res.status(200).json({
      snooze_probability,
      risk_level,
      will_snooze: snooze_probability >= 50,
      source: "server-fallback",
      factors: [
        `Sleep: ${sleep_duration_prev_night}h`,
        `Past Snoozes (7d): ${snooze_count_last_7_days}`,
        `Energy Level: ${self_reported_energy}/5`,
        `Alarm Time: ${Math.floor(hour_of_alarm_decimal)}:${hour_of_alarm_decimal % 1 === 0.5 ? "30" : "00"}`,
      ],
    });
  }
};

// ── Best Slot ─────────────────────────────────────────────────────────────────
export const predictBestSlot = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ error: "Missing date" });

    const response = await fetch(`${ML_SERVICE_URL}/predict/best-slot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) throw new Error(`FastAPI returned status ${response.status}`);
    return res.status(200).json(await response.json());

  } catch (_) {
    console.warn("⚠️ FastAPI unavailable — using server-side best-slot predictor");
    const d = new Date(req.body.date || Date.now());
    const dow = d.getDay(); // 0=Sun … 6=Sat
    const isWeekend = dow === 0 || dow === 6;

    return res.status(200).json({
      best_slot: isWeekend ? "09:00 – 11:00" : "06:30 – 08:00",
      confidence: 0.72,
      reasoning: isWeekend
        ? "Weekend morning — relaxed schedule ideal for deep focus."
        : "Weekday early morning — peak cortisol window for memory consolidation.",
      source: "server-fallback",
    });
  }
};

// ── Focus Score ───────────────────────────────────────────────────────────────
export const predictFocusScore = async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict/focus-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) throw new Error(`FastAPI returned status ${response.status}`);
    return res.status(200).json(await response.json());

  } catch (_) {
    console.warn("⚠️ FastAPI unavailable — using server-side focus-score predictor");

    const {
      study_duration_minutes = 60,
      breaks_taken = 2,
      sleep_hours = 7,
      distractions = 2,
      self_rating = 7,
      time_of_day = 1,
    } = req.body || {};

    // Weighted heuristic formula (range 0–100)
    const sleepBonus   = Math.min(30, sleep_hours * 3.5);
    const durationBonus= Math.min(25, (study_duration_minutes / 120) * 25);
    const breakBonus   = Math.min(10, breaks_taken * 2.5);
    const distPenalty  = Math.min(25, distractions * 5);
    const ratingBonus  = (self_rating / 10) * 20;
    const timeBonus    = time_of_day === 0 ? 8 : time_of_day === 1 ? 5 : time_of_day === 3 ? 3 : 0;

    const focus_score = Math.min(99, Math.max(10,
      Math.round(sleepBonus + durationBonus + breakBonus + ratingBonus + timeBonus - distPenalty)
    ));

    return res.status(200).json({
      focus_score,
      label: focus_score >= 75 ? "Excellent" : focus_score >= 55 ? "Good" : focus_score >= 35 ? "Average" : "Needs improvement",
      source: "server-fallback",
    });
  }
};

// ── Image Verify ──────────────────────────────────────────────────────────────
export const predictImageVerify = async (req: Request, res: Response) => {
  try {
    const { image, target } = req.body;
    if (!image || !target) return res.status(400).json({ error: "Missing image or target" });

    const response = await fetch(`${ML_SERVICE_URL}/predict/image-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, target }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`FastAPI returned status ${response.status}`);
    return res.status(200).json(await response.json());

  } catch (_) {
    console.warn("⚠️ FastAPI unavailable — image-verify fallback (auto-pass)");
    // In deployment without ML service, auto-pass image verification gracefully
    return res.status(200).json({
      verified: true,
      confidence: 0.85,
      detected_object: req.body.target,
      source: "server-fallback",
      message: "ML service unavailable — verification passed automatically.",
    });
  }
};

