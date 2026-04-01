import jobPostingController from "../controllers/jobPosting_controlller.js";
const { createJobPost, updatedJobPost, deletedJobPost, showAllPost } = jobPostingController;

import express from "express";

import authMiddleware from "../middelwares/auth.js";

import role from "../middelwares/roleMiddleware.js";

const router = express.Router(); 

router.post("/create-job-post", authMiddleware, role("recruiter"), createJobPost);

router.put("/update-job-post/:post_id", authMiddleware, role("recruiter"), updatedJobPost);

router.delete("/delete-job-post/:post_id", authMiddleware, role("recruiter"), deletedJobPost);

router.get("/show-all-posts", showAllPost);

export default router;