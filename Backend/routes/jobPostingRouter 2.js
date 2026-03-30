import {
    createJobPost,
    updatedJobPost,
    deletedJobPost,
    showAllPost
} from "../controllers/jobPosting_controlller.js";

import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import role from "../middleware/role.js";

const router = express.Router(); 

router.post("/create-job-post", authMiddleware, role("recruiter"), createJobPost);

router.put("/update-job-post/:post_id", authMiddleware, role("recruiter"), updatedJobPost);

router.delete("/delete-job-post/:post_id", authMiddleware, role("recruiter"), deletedJobPost);

router.get("/show-all-posts", showAllPost);

export default router;