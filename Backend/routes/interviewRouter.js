import {  analyzeResume , generateQuestions , submitAnswer , finishInterview } from "../controllers/interview.js";
import express from "express";
import {uploads} from "../middleware/multer.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.post("/resume" , auth , uploads.single("resume") ,analyzeResume);

router.post("/generate-questions" , auth , generateQuestions);

router.post("/submit-answer" , auth , submitAnswer);

router.post("/finish-interview" , auth , finishInterview);

export default router;
