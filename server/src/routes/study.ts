import { Router } from "express";
import { startSession, endSession, getAnalyticsByUserId } from "../controllers/studyController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/session/start", authenticateToken, startSession);
router.post("/session/end", authenticateToken, endSession);
router.get("/analytics/:userId", authenticateToken, getAnalyticsByUserId);

export default router;
