import feedbackReciver from "../controllers/feedback_Controller.js";
import express from "express";

import authMiddleware from "../middelwares/auth.js";

const router = express.Router();

router.post("/feedback", authMiddleware, feedbackReciver);

export default router;