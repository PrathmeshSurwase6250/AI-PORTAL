import User from "../models/auth_Model.js";
import jobModel from "../models/job_Listing_Model.js";
import ApplicationModel from "../models/application_Model.js";
import feedbackModel from "../models/feedback_Model.js";

export const adminDashboard = async (req, res) => {
    try {
        const totalUser        = await User.countDocuments();
        const totalJobs        = await jobModel.countDocuments();
        const totalApplication = await ApplicationModel.countDocuments();
        const totalFeedback    = await feedbackModel.countDocuments();
        res.status(200).json({ totalUser, totalJobs, totalFeedback, totalApplication });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        await User.findByIdAndDelete(user_id);
        res.status(200).json({ message: "User Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const userRoles = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { role }    = req.body;
        const allowedRoles = ["admin", "recruiter", "jobseeker"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid Role" });
        }
        const updatedUser = await User.findByIdAndUpdate(user_id, { role }, { new: true });
        res.status(200).json({ message: "Role Updated", updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const allJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find({}).populate("user");
        res.status(200).json({ jobs });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { job_id } = req.params;
        await jobModel.findByIdAndDelete(job_id);
        res.status(200).json({ message: "Job Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getAllApplications = async (req, res) => {
    try {
        const applications = await ApplicationModel
            .find({})
            .populate("user")
            .populate("job");
        res.status(200).json({ applications });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await feedbackModel.find({}).populate("user");
        res.status(200).json({ feedbacks });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};