import { Router } from "express";
import { predictSnoozeRisk, predictBestSlot, predictFocusScore, predictImageVerify } from "../controllers/mlController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/predict/snooze-risk", predictSnoozeRisk);
router.post("/predict/best-slot", authenticateToken, predictBestSlot);
router.post("/predict/focus-score", authenticateToken, predictFocusScore);
router.post("/predict/image-verify", predictImageVerify);

export default router;
