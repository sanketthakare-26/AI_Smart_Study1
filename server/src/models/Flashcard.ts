import mongoose from "mongoose";

const FlashcardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  nextReviewDate: { type: Date, required: true },
  reviewInterval: { type: Number, default: 1 }, // in days
  createdAt: { type: Date, default: Date.now },
});

export const Flashcard = mongoose.model("Flashcard", FlashcardSchema);
