import {
    recruiterApplicants ,
    recruiterDashboard ,
    recruiterJobs ,
    updateApplicantStatus
} from "../controllers/recrutier_Dashboard.js" 


import auth from "../middelwares/auth.js"
import role from "../middelwares/roleMiddleware.js"
import express from "express" ;

const router = express.Router();

router.get("/dashboard" , auth , role("recruiter") , recruiterDashboard) ;

router.get("/jobs" , auth , role("recruiter") , recruiterJobs) ;

router.patch("/application/:application_id" , auth , role("recruiter") , updateApplicantStatus) ;

router.get("/applicants/:job_id" ,auth , role("recruiter") , recruiterApplicants );