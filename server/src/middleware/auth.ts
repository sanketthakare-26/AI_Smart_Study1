import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    mongoId: string;
  };
}

let googleCerts: Record<string, string> = {};

// Fetch Google's public certificates for Firebase ID Token validation
async function fetchGoogleCerts() {
  try {
    const res = await fetch(
      "https://www.googleapis.com/robot/v1/metadata/x509/securetoken-system@system.gserviceaccount.com"
    );
    googleCerts = (await res.json()) as Record<string, string>;
  } catch (err) {
    console.error("❌ Failed to fetch Google public certs for Firebase Auth:", err);
  }
}

// Initial fetch (non-blocking)
fetchGoogleCerts();
setInterval(fetchGoogleCerts, 3600 * 1000);

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  // ── Strategy 1: Simulated token (no FIREBASE_API_KEY configured) ──
  if (token.startsWith("simulated-firebase-token-")) {
    const firebaseUid = token.replace("simulated-firebase-token-", "");
    try {
      let userRecord = await User.findOne({ firebaseUid });
      if (userRecord) {
        req.user = {
          id: firebaseUid,
          email: userRecord.email,
          mongoId: userRecord._id.toString(),
        };
        next();
        return;
      }
    } catch (err) {
      console.error("❌ Simulated token DB lookup failed:", err);
    }
    res.status(403).json({ error: "Simulated token user not found" });
    return;
  }

  // ── Strategy 2: Custom JWT signed with JWT_SECRET (HS256) ──
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        id?: string;
        sub?: string;
        email?: string;
        uid?: string;
      };
      const uid = decoded.id || decoded.sub || decoded.uid || "";
      const email = decoded.email || "";
      if (uid) {
        let userRecord = await User.findOne({ firebaseUid: uid });
        if (!userRecord) {
          // Auto-create user if missing
          userRecord = await new User({
            firebaseUid: uid,
            name: email.split("@")[0],
            email,
            streak: 0,
            badges: [],
          }).save();
        }
        req.user = {
          id: uid,
          email,
          mongoId: userRecord._id.toString(),
        };
        next();
        return;
      }
    } catch {
      // Not a valid HS256 JWT — fall through to Firebase validation
    }
  }

  // ── Strategy 3: Real Firebase ID Token (RS256) ──
  try {
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
      res.status(403).json({ error: "Invalid token structure" });
      return;
    }

    const kid = decodedHeader.header.kid as string;
    let cert = googleCerts[kid];
    if (!cert) {
      try {
        await fetchGoogleCerts();
        cert = googleCerts[kid];
      } catch (certErr) {
        console.error("❌ Failed to refresh Google certs:", certErr);
      }
    }

    if (!cert) {
      res.status(403).json({ error: "Invalid token signature key" });
      return;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || "ai-study-alarm";
    const decoded = jwt.verify(token, cert, {
      algorithms: ["RS256"],
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
    }) as { sub: string; email: string; name?: string };

    let userRecord = await User.findOne({ firebaseUid: decoded.sub });
    if (!userRecord) {
      userRecord = await new User({
        firebaseUid: decoded.sub,
        name: decoded.name || decoded.email.split("@")[0],
        email: decoded.email,
        streak: 17,
        badges: ["Early Riser", "Deep Diver", "Streak Master"],
      }).save();
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      mongoId: userRecord._id.toString(),
    };
    next();
  } catch (err) {
    console.error("❌ Auth token validation failed:", err);
    if (!res.headersSent) {
      res.status(403).json({ error: "Invalid or expired token" });
    }
  }
};
