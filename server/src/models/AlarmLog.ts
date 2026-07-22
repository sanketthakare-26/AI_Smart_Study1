import mongoose from "mongoose";

const AlarmLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  alarmSetTime: { type: String, required: true },
  actualWakeTime: { type: String, required: true },
  snoozeCount: { type: Number, required: true },
  sleepDurationPrevNight: { type: Number },
  dismissMethod: { type: String, default: "Standard" },
  date: { type: Date, default: Date.now },
});

export const AlarmLog = mongoose.model("AlarmLog", AlarmLogSchema);
