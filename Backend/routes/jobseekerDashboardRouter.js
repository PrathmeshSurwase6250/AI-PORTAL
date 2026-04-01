import  {jobseeker_Dashboard, resumeShow, interviewShow , interviewPerformances } from "../controllers/jobseeker_Dashboard.js";
import express from "express";
import authMiddleware from "../middelwares/auth.js";
import role from "../middelwares/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, role("jobseeker"), jobseeker_Dashboard);
router.get("/resumes", authMiddleware, role("jobseeker"), resumeShow);
router.get("/interviews", authMiddleware, role("jobseeker"), interviewShow);
router.get("/interview-performances", authMiddleware, role("jobseeker"), interviewPerformances);

export default router;