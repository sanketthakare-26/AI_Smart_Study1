import mongoose from "mongoose";

const AlarmSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  label: { type: String, required: true },
  time: { type: String, required: true },
  days: { type: [String], default: [] },
  enabled: { type: Boolean, default: true },
  adaptive: { type: Boolean, default: false },
  snoozeRisk: { type: Number, default: 0 },
  wakeWindow: { type: String, default: "—" },
  dismissMode: { type: String, default: "Standard" },
  buffers: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const Alarm = mongoose.model("Alarm", AlarmSchema);
