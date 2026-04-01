import {  analyzeResume , generateQuestions , submitAnswer , finishInterview  ,  getMyInterviews , getReport} from "../controllers/interview.js";
import express from "express";
import {uploads} from "../middelwares/multer.js";
import auth from "../middelwares/auth.js";


const router = express.Router();

router.post("/resume" , auth , uploads.single("resume") ,analyzeResume);

router.post("/generate-questions" , auth , generateQuestions);

router.post("/submit-answer" , auth , submitAnswer);

router.post("/finish-interview" , auth , finishInterview);

router.get("/my-interviews" , auth , getMyInterviews);

router.get("/report/:interviewId" , auth , getReport);


export default router;
