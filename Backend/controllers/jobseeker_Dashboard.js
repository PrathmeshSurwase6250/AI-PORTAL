import resume_Model from "../models/resume_Models.js";
import applicationModel from "../models/application_Model.js";
import interviewModel from "../models/interview_Model.js";


const jobseeker_Dashboard = async (req, res) => {
    try {
        const userId = req.user?._id || req.user_id;
        const resumeCount      = await resume_Model.countDocuments({ user: userId });
        const applicationCount = await applicationModel.countDocuments({ user: userId });
        const interviewCount   = await interviewModel.countDocuments({ user: userId });
        res.status(200).json({ resumeCount, applicationCount, interviewCount });
    } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const resumeShow = async (req, res) => {
    try {
        const userId = req.user?._id || req.user_id;
        const resumes = await resume_Model.find({ user: userId });
        res.status(200).json(resumes);
    } catch (error) {
        console.error('Error fetching resumes:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

const interviewShow = async (req, res) => {
    try {
        const userId = req.user?._id || req.user_id;
        const interviews = await interviewModel.find({ user: userId });
        res.status(200).json(interviews);
    } catch (error) {
        console.error('Error fetching interviews:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

const interviewPerformances = async (req, res) => {
    try {
        // auth middleware sets req.user_id (from token) or req.user._id (from populate)
        const userId = req.user?._id || req.user_id;
        const interviews = await interviewModel
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .select('role mode experience finalScore status createdAt questions');

        const formatted = interviews.map(iv => ({
            _id:        iv._id,
            role:       iv.role,
            mode:       iv.mode,
            experience: iv.experience,
            finalScore: iv.finalScore || 0,
            status:     iv.status,
            createdAt:  iv.createdAt,
            questionCount: iv.questions?.length || 0,
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error('Error fetching interview performances:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export { jobseeker_Dashboard, resumeShow, interviewShow, interviewPerformances };
