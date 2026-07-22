import mongoose from "mongoose";

const StudySessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  subject: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  durationMinutes: { type: Number },
  focusScoreSelfRated: { type: Number },
  breaksTaken: { type: Number, default: 0 },
  focusScoreComputed: { type: Number },
  date: { type: Date, default: Date.now },
});

export const StudySession = mongoose.model("StudySession", StudySessionSchema);
