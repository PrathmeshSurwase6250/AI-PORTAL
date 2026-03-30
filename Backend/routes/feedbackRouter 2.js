import {feedbackReciver} from "../controllers/feedback_Controller.js";
import express from "express";

const router = express.Router();

router.post("/feedback", feedbackReciver);

export default router;