import express from "express";
import { getCurrentUser } from "../controllers/userController.js";
import authMiddleware from "../middelwares/auth.js";

const router = express.Router();

router.get("/current-user", authMiddleware, getCurrentUser);

export default router;