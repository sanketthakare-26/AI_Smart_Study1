import { Response } from "express";
import mongoose from "mongoose";
import { Alarm } from "../models/Alarm.js";
import { AlarmLog } from "../models/AlarmLog.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

// Get alarms for a user
export const getAlarmsByUserId = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (req.user?.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const dbAlarms = await Alarm.find({ userId });

    const alarms = dbAlarms.map((a) => ({
      id: a._id.toString(),
      label: a.label,
      time: a.time,
      days: a.days,
      enabled: a.enabled,
      adaptive: a.adaptive,
      snoozeRisk: a.snoozeRisk,
      wakeWindow: a.wakeWindow,
      dismissMode: a.dismissMode,
      buffers: a.buffers,
    }));

    return res.status(200).json(alarms);
  } catch (error) {
    console.error("Fetch alarms error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Set (create or update) alarm
export const setAlarm = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id, label, time, days, enabled, adaptive, snoozeRisk, wakeWindow, dismissMode, buffers } = req.body;

    const calculatedSnoozeRisk = snoozeRisk ?? Math.round(20 + Math.random() * 50);
    const calculatedWakeWindow = wakeWindow ?? (adaptive ? "±15 min adaptive" : "—");

    let alarm;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      alarm = await Alarm.findOneAndUpdate(
        { _id: id, userId },
        {
          label,
          time,
          days: days || [],
          enabled: enabled !== undefined ? enabled : true,
          adaptive: adaptive !== undefined ? adaptive : false,
          snoozeRisk: calculatedSnoozeRisk,
          wakeWindow: calculatedWakeWindow,
          dismissMode,
          buffers: buffers || [],
        },
        { new: true }
      );
    }

    if (!alarm) {
      alarm = await new Alarm({
        userId,
        label: label || "New Alarm",
        time: time || "06:30",
        days: days || ["Mon", "Tue", "Wed", "Thu", "Fri"],
        enabled: enabled !== undefined ? enabled : true,
        adaptive: adaptive !== undefined ? adaptive : false,
        snoozeRisk: calculatedSnoozeRisk,
        wakeWindow: calculatedWakeWindow,
        dismissMode: dismissMode || "Standard",
        buffers: buffers || [],
      }).save();
    }

    // Trigger realtime alarm sync (via socket.io, attached to app)
    const io = req.app.get("io");
    if (io) {
      io.to(userId).emit("alarm-sync", {
        action: id ? "update" : "create",
        alarmId: alarm._id.toString(),
      });
    }

    return res.status(200).json({
      ok: true,
      alarmId: alarm._id.toString(),
      alarm: {
        id: alarm._id.toString(),
        label: alarm.label,
        time: alarm.time,
        days: alarm.days,
        enabled: alarm.enabled,
        adaptive: alarm.adaptive,
        snoozeRisk: alarm.snoozeRisk,
        wakeWindow: alarm.wakeWindow,
        dismissMode: alarm.dismissMode,
        buffers: alarm.buffers,
      },
    });
  } catch (error) {
    console.error("Set alarm error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Log alarm wake event
export const logWake = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { alarmId, latencySec, snoozes } = req.body;
    if (!alarmId || latencySec === undefined || snoozes === undefined) {
      return res.status(400).json({ error: "Missing log details" });
    }

    let alarmTime = "06:30";
    let dismissMethod = "Standard";
    if (mongoose.Types.ObjectId.isValid(alarmId)) {
      const alarm = await Alarm.findById(alarmId);
      if (alarm) {
        alarmTime = alarm.time;
        dismissMethod = alarm.dismissMode;
      }
    }

    const [h, m] = alarmTime.split(":").map(Number);
    const totalMinutes = h * 60 + m + Math.round(latencySec / 60);
    const actualH = Math.floor(totalMinutes / 60) % 24;
    const actualM = totalMinutes % 60;
    const actualWakeTime = `${String(actualH).padStart(2, "0")}:${String(actualM).padStart(2, "0")}`;

    const log = await new AlarmLog({
      userId,
      alarmSetTime: alarmTime,
      actualWakeTime,
      snoozeCount: snoozes,
      sleepDurationPrevNight: 7.5,
      dismissMethod,
    }).save();

    return res.status(201).json({ ok: true, logId: log._id.toString() });
  } catch (error) {
    console.error("Log wake error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
