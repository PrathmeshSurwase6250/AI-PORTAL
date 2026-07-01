import { userlogin, signUp, logout, googleAuth, adminLogin, forgotPassword, resetPassword, requestPasswordReset, checkRequestStatus, resetPasswordManual, changePassword } from "../controllers/auth_Controller.js";
import express from "express";
import authMiddleware from "../middelwares/auth.js";

const router = express.Router();

router.post("/login",            userlogin);
router.post("/sign",             signUp);
router.post("/google",           googleAuth);
router.post("/admin-login",      adminLogin);
router.post("/forgot-password",  forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Manual Admin-Approved Flow
router.post("/request-reset", requestPasswordReset);
router.post("/check-reset-status", checkRequestStatus);
router.post("/reset-password-manual", resetPasswordManual);
router.put("/change-password",   authMiddleware, changePassword);
router.get("/logout",            logout);

export default router;