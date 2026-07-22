import mongoose from "mongoose";

const StudyPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  examDate: { type: Date },
  syllabusTopics: { type: [String], default: [] },
  generatedPlan: [
    {
      day: { type: String },
      topic: { type: String },
      hours: { type: Number },
    },
  ],
  generatedBy: { type: String, default: "gemini" },
  createdAt: { type: Date, default: Date.now },
});

export const StudyPlan = mongoose.model("StudyPlan", StudyPlanSchema);
