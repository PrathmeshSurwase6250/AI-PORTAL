import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";

// Routes
import auth from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import feedbackRouter from "./routes/feedbackRouter.js";
import jobseekerDashboardRouter from "./routes/jobseekerDashboardRouter.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import jobPostingRouter from "./routes/jobPostingRouter.js";
import interviewRouter from "./routes/interviewRouter.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import codeReviewRouter from "./routes/codeReviewRouter.js";
import adminRoutes from "./routes/adminRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";

// Config
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

// CORS — allow configured origins
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use("/public", express.static("public"));

// Mount Routes
app.use("/api/auth",       auth);
app.use("/api/user",       userRoutes);
app.use("/api/feedback",   feedbackRouter);
app.use("/api/jobseeker",  jobseekerDashboardRouter);
app.use("/api/resume",     resumeRoutes);
app.use("/api/jobPosting", jobPostingRouter);
app.use("/api/interview",  interviewRouter);
app.use("/api/application",applicationRoutes);
app.use("/api/code",       codeReviewRouter);
app.use("/api/admin",      adminRoutes);
app.use("/api/recruiter",  recruiterRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "AI Portal API Running", env: process.env.NODE_ENV || "development" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});
