import Application from "../models/application_Model.js"
import JobModel from "../models/job_Listing_Model.js"

const recruiterDashboard = async (req , res)=>{
    try{

    const user_id = req.user_id ;

    const totalJobs = await JobModel.countDocuments({user : user_id});

    const job = await JobModel.find({user : user_id}) ;

    const jobIds = job.map(job => job.id) ;

    const totalApplication = await Application.countDocuments({
        job : {$in : jobIds}
    })

    res.status(200).json({
            totalJobs,
            totalApplication
    });
    }catch (err) {
        res.status(500).json({
            message: "Server Error"
    });
}
}


const recruiterJobs = async (req , res)=>{
    try{

        const user_id = req.user_id ;

        const jobs = await JobModel.find({user : user_id}) ;

        res.status(200).json({
            jobs
        });

    }catch (err) {
        res.status(500).json({
            message: "Server Error"
    });
}
}


const recruiterApplicants  = async(req , res)=>{
    try{
        const {job_id} = req.params ;

        const user_id = req.user_id;

        const job = await JobModel.findOne({  _id : job_id  , user : user_id} ) ;

        if (!job) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        const applicants = await Application.find({job :job_id}).populate("user").populate("resume"); 

        res.status(200).json({
            applicants
        });



    }catch (err) {
        res.status(500).json({
            message: "Server Error"
    });
}
}


const  updateApplicantStatus = async(req , res)=>{
    try {

        const {application_id} = req.params ;

        const {status} = req.body ;

        const allowedStatus = ["shortlisted", "rejected"] ;

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const updatedStatus = await Application.findOneAndUpdate( application_id ,{status} , {new: true })

        res.status(200).json({
            message: "Application Updated",
            updated
        });
    }catch(err) {
        res.status(500).json({
            message: "Server Error"
    });
}
}

export default {
    recruiterApplicants ,
    recruiterDashboard ,
    recruiterJobs ,
    updateApplicantStatus
}