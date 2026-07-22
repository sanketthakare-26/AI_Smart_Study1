import { Router } from "express";
import { getAlarmsByUserId, setAlarm, logWake } from "../controllers/alarmController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.get("/:userId", authenticateToken, getAlarmsByUserId);
router.post("/set", authenticateToken, setAlarm);
router.post("/log-wake", authenticateToken, logWake);

export default router;
