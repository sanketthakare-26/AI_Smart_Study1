import { Response } from "express";
import mongoose from "mongoose";
import { StudySession } from "../models/StudySession.js";
import { User } from "../models/User.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const SUBJECT_MAP: Record<string, string> = {
  s1: "Data Structures",
  s2: "Machine Learning",
  s3: "Operating Systems",
  s4: "Discrete Math",
};

// Start study session
export const startSession = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { subjectId } = req.body;
    if (!subjectId) {
      return res.status(400).json({ error: "Missing subjectId" });
    }

    const subjectName = SUBJECT_MAP[subjectId] || subjectId;

    const session = await new StudySession({
      userId,
      subject: subjectName,
      startTime: new Date(),
    }).save();

    return res.status(200).json({ ok: true, sessionId: session._id.toString() });
  } catch (error) {
    console.error("Start session error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// End study session
export const endSession = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { sessionId, focusScore } = req.body;
    if (!sessionId || focusScore === undefined) {
      return res.status(400).json({ error: "Missing sessionId or focusScore" });
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid sessionId format" });
    }

    const session = await StudySession.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const endTime = new Date();
    const durationMs = endTime.getTime() - session.startTime.getTime();
    const durationMinutes = Math.round(durationMs / 60000);

    await StudySession.findByIdAndUpdate(sessionId, {
      endTime,
      durationMinutes,
      focusScoreSelfRated: focusScore,
      focusScoreComputed: Math.round(focusScore * 0.95),
      breaksTaken: Math.max(0, Math.floor(durationMinutes / 30)),
    });

    const completedSessions = await StudySession.find({
      userId,
      endTime: { $ne: null },
    });

    if (completedSessions.length > 0) {
      const avgFocus = Math.round(
        completedSessions.reduce((acc, s) => acc + (s.focusScoreSelfRated || 0), 0) / completedSessions.length
      );

      await User.findOneAndUpdate(
        { firebaseUid: userId },
        { focusScore: avgFocus }
      );
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("End session error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get study analytics
export const getAnalyticsByUserId = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (req.user?.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      ok: true,
      userId: user.firebaseUid,
      analytics: {
        streakDays: user.streak,
        focusScore: 84,
        sleepScore: 76,
        plan: "Pro Student",
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
