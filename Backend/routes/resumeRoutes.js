import auth from "../middelwares/auth.js"
import role from "../middelwares/roleMiddleware.js"
import express from "express";
import resumeController from "../controllers/resume_Controller.js";
const { createResume, deleteResume, showAllResume, showSingleResume, updateResume, getAiSuggestions, getRealtimeSuggestions, generateFieldContent } = resumeController;

const router = express.Router();

router.post("/create", auth, role("jobseeker"), createResume);
router.delete("/resume/:resume_id", auth, deleteResume);
router.get("/showResumes", auth, showAllResume);
router.get("/resume/:resume_id", auth, showSingleResume);
router.patch("/resume/:resume_id", auth, updateResume);
router.post("/ai-suggest/:resume_id", auth, getAiSuggestions);
router.post("/ai-realtime", auth, getRealtimeSuggestions);
router.post("/ai-generate", auth, generateFieldContent);

export default router;