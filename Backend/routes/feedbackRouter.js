import feedbackReciver from "../controllers/feedback_Controller.js";
import express from "express";
import authMiddleware from "../middelwares/auth.js";

const router = express.Router();

// FIXED: was "/feedback" causing path doubling -> /api/feedback/feedback
// Now "/" so full path is correctly POST /api/feedback
router.post("/", authMiddleware, feedbackReciver);

export default router;
