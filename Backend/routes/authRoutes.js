import { userlogin, signUp, logout, googleAuth, adminLogin } from "../controllers/auth_Controller.js";
import express from "express";

const router = express.Router();

router.post("/login",        userlogin);
router.post("/sign",         signUp);
router.post("/google",       googleAuth);
router.post("/admin-login",  adminLogin);
router.get("/logout",        logout);

export default router;