import auth from "../middelwares/auth.js"
import express from "express" ;
import { applyJob,
    myApplications,
    jobApplications,
    updateApplicationStatus } from "../controllers/applyJob_Controller.js";


const router = express.Router();

router.post("/apply", auth, applyJob);
router.get("/my-applications", auth, myApplications);
router.get("/job-applications/:job_id", auth, jobApplications);
router.patch("/update-status/:application_id", auth, updateApplicationStatus);

export default router;


