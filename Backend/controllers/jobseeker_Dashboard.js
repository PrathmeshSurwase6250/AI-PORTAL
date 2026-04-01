import resume_Model from "../models/resume_Models.js";
import applicationModel from "../models/application_Model.js";
import interviewModel from "../models/interview_Model.js";


const jobseeker_Dashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        const resumeCount = await resume_Model.countDocuments({ user: userId });
        const applicationCount = await applicationModel.countDocuments({ user: userId });
        const interviewCount = await interviewModel.countDocuments({ user: userId });

        res.status(200).json({
            resumeCount,
            applicationCount,
            interviewCount
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const resumeShow = async (req, res) => {
    try {
        const userId = req.user._id;
        const resumes = await resume_Model.find({ user: userId });
        res.status(200).json(resumes);
    } catch (error) {
        console.error("Error fetching resumes:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const interviewShow = async (req, res) => {
    try {
        const userId = req.user._id;
        const interviews = await interviewModel.find({ user: userId });
        res.status(200).json(interviews);
    } catch (error) {
        console.error("Error fetching interviews:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const interviewPerformances = async (req, res) => {
    try {
        const userId = req.user._id;
        const interviews = await interviewModel.find({ user: userId }).populate('performance');
        res.status(200).json(interviews);
    } catch (error) {
        console.error("Error fetching interview performances:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export { jobseeker_Dashboard, resumeShow, interviewShow, interviewPerformances };
