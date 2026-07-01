import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import auth from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();   // CREATE APP FIRST

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
  credentials: true
}));

app.use(methodOverride("_method"));
app.use("/public", express.static("public"));

import feedbackRouter from "./routes/feedbackRouter.js";
import jobseekerDashboardRouter from "./routes/jobseekerDashboardRouter.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import jobPostingRouter from "./routes/jobPostingRouter.js";
import interviewRouter from "./routes/interviewRouter.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import codeReviewRouter from "./routes/codeReviewRouter.js";
import adminRoutes from "./routes/adminRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";

// Routes
app.use("/api/auth",      auth);
app.use("/api/user",      userRoutes);
app.use("/api/feedback",  feedbackRouter);
app.use("/api/jobseeker", jobseekerDashboardRouter);
app.use("/api/resume",    resumeRoutes);
app.use("/api/jobPosting",jobPostingRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/application",applicationRoutes);
app.use("/api/code",      codeReviewRouter);
app.use("/api/admin",     adminRoutes);
app.use("/api/recruiter", recruiterRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});