import { Request, Response } from "express";
import { User } from "../models/User.js";

const getFirebaseApiKey = () => {
  const key = process.env.FIREBASE_API_KEY;
  if (!key) {
    console.warn("⚠️ FIREBASE_API_KEY is not defined in server/.env. Using default simulated auth mode.");
  }
  return key;
};

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing name, email, or password" });
    }

    const apiKey = getFirebaseApiKey();
    if (apiKey) {
      // Create user in Firebase Auth using Google's Identity Toolkit REST API
      const firebaseRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );

      const firebaseData = await firebaseRes.json();
      if (!firebaseRes.ok) {
        return res.status(firebaseRes.status).json({
          error: firebaseData.error?.message || "Firebase registration failed",
        });
      }

      const firebaseUid = firebaseData.localId;
      const idToken = firebaseData.idToken;

      // Save user profile in MongoDB linked to Firebase UID
      const user = await new User({
        firebaseUid,
        name,
        email,
        streak: 17,
        badges: ["Early Riser", "Deep Diver", "Streak Master"],
      }).save();

      const userPayload = {
        id: firebaseUid,
        name: user.name,
        email: user.email,
        avatarInitials: user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        streakDays: user.streak,
        focusScore: 84,
        sleepScore: 76,
        plan: "Pro Student",
      };

      return res.status(201).json({
        ok: true,
        token: idToken,
        userId: firebaseUid,
        user: userPayload,
      });
    } else {
      // Simulation mode if API key is not configured
      const mockUid = `fb_${Date.now()}`;
      const mockToken = "simulated-firebase-token-" + mockUid;

      const user = await new User({
        firebaseUid: mockUid,
        name,
        email,
        streak: 17,
        badges: ["Early Riser", "Deep Diver", "Streak Master"],
      }).save();

      const userPayload = {
        id: mockUid,
        name: user.name,
        email: user.email,
        avatarInitials: user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        streakDays: user.streak,
        focusScore: 84,
        sleepScore: 76,
        plan: "Pro Student",
      };

      return res.status(201).json({
        ok: true,
        token: mockToken,
        userId: mockUid,
        user: userPayload,
      });
    }
  } catch (error) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const apiKey = getFirebaseApiKey();
    if (apiKey) {
      // Authenticate with Firebase Auth REST API
      const firebaseRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );

      const firebaseData = await firebaseRes.json();
      if (!firebaseRes.ok) {
        return res.status(firebaseRes.status).json({
          error: firebaseData.error?.message || "Firebase login failed",
        });
      }

      const firebaseUid = firebaseData.localId;
      const idToken = firebaseData.idToken;

      // Fetch or sync user profile in MongoDB
      let user = await User.findOne({ firebaseUid });
      if (!user) {
        user = await new User({
          firebaseUid,
          name: firebaseData.displayName || email.split("@")[0],
          email,
          streak: 0,
          totalHours: 0,
          badges: ["Early Riser"],
        }).save();
      } else {
        // Update last login time
        user.lastLogin = new Date();
        await user.save();
      }

      const userPayload = {
        id: firebaseUid,
        name: user.name,
        email: user.email,
        avatarInitials: user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        streakDays: user.streak,
        focusScore: 84,
        sleepScore: 76,
        plan: "Pro Student",
      };

      return res.status(200).json({
        ok: true,
        token: idToken,
        userId: firebaseUid,
        user: userPayload,
      });
    } else {
      // Simulation mode
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials (User not found in simulation mode)" });
      }

      const userPayload = {
        id: user.firebaseUid,
        name: user.name,
        email: user.email,
        avatarInitials: user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        streakDays: user.streak,
        focusScore: 84,
        sleepScore: 76,
        plan: "Pro Student",
      };

      return res.status(200).json({
        ok: true,
        token: "simulated-firebase-token-" + user.firebaseUid,
        userId: user.firebaseUid,
        user: userPayload,
      });
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all registered users for global leaderboard
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find(
      {},
      "firebaseUid name email streak totalHours lastLogin createdAt"
    )
      .sort({ totalHours: -1, streak: -1 })
      .lean();
    return res.status(200).json({ ok: true, users });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};
