import {
    getAllApplications ,
    getAllFeedbacks ,
    getAllUser ,
    deleteJob ,
    deleteUser ,
    allJobs ,
    userRoles  ,
    adminDashboard,
    getResetRequests,
    approveResetRequest,
    rejectResetRequest
} from "../controllers/admin_Controller.js"
import auth from "../middelwares/auth.js"
import role from "../middelwares/roleMiddleware.js"
import express from "express" ;

const router = express.Router();

router.get("/dashboard" ,auth , role ("admin")  ,adminDashboard )

router.get("/feedback" ,auth , role ("admin")  ,getAllFeedbacks )

router.get("/applications" ,auth , role ("admin")  ,getAllApplications )

router.get("/users" ,auth , role ("admin")  ,getAllUser )

router.get("/jobs" ,auth , role ("admin")  ,allJobs )

router.patch("/user-role/:user_id" ,auth , role ("admin")  , userRoles )

router.delete("/job/:job_id" ,auth , role ("admin")  ,deleteJob )

router.delete("/user/:user_id" ,auth , role ("admin")  ,deleteUser )

// Reset Request Management
router.get("/reset-requests", auth, role("admin"), getResetRequests);
router.patch("/approve-reset/:id", auth, role("admin"), approveResetRequest);
router.patch("/reject-reset/:id", auth, role("admin"), rejectResetRequest);

export default router;
