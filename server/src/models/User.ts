import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // managed by Firebase Auth
  preferences: {
    wakeWindowStart: { type: String, default: "06:00" },
    wakeWindowEnd: { type: String, default: "08:00" },
    dailyStudyHours: { type: Number, default: 4 },
  },
  streak: { type: Number, default: 0 },
  totalHours: { type: Number, default: 0 },     // cumulative study hours
  lastLogin: { type: Date, default: Date.now },  // last time user logged in
  badges: { type: [String], default: ["Early Riser"] },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", UserSchema);
