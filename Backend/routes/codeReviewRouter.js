import express from "express";
import auth from "../middelwares/auth.js";
import { reviewCode } from "../controllers/codeReview_Controller.js";

const router = express.Router();

router.post("/review", auth, reviewCode);

export default router;
