import { analyzeResume, generateQuestions, submitAnswer, finishInterview, getMyInterviews, getReport, getFullInterview, getCandidateInterviews } from "../controllers/interview.js";
import express from "express";
import {uploads} from "../middelwares/multer.js";
import auth from "../middelwares/auth.js";


const router = express.Router();

router.post("/resume" , auth , uploads.single("resume") ,analyzeResume);

router.post("/generate-questions" , auth , generateQuestions);

router.post("/submit-answer" , auth , submitAnswer);

router.post("/finish-interview" , auth , finishInterview);

router.get("/my-interviews", auth, getMyInterviews);
router.get("/report/:interviewId", auth, getReport);
router.get("/full/:interviewId", auth, getFullInterview);
// Recruiter-facing: view any candidate's full interview history by their userId
router.get("/candidate/:candidateId", auth, getCandidateInterviews);

export default router;
