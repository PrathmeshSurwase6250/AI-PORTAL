import jobModel from "../models/job_Listing_Model.js";
import mongoose from "mongoose";

// CREATE JOB POST
const createJobPost = async (req, res) => {
    try {
        const user_id = req.user_id;

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Enter The Details!"
            });
        }

        const createPost = await jobModel.create({
            user: user_id,
            ...req.body
        });

        res.status(201).json({
            message: "Successfully Created!",
            createPost
        });

    } catch (err) {
        console.log("createJobPost Error:", err);
        res.status(500).json({
            message: "Server Side Error!",
            error: err.message
        });
    }
};

// UPDATE JOB POST
const updatedJobPost = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { post_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(post_id)) {
            return res.status(400).json({
                message: "Invalid request!"
            });
        }

        const updatedPost = await jobModel.findOneAndUpdate(
            { _id: post_id, user: user_id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                message: "Post Not Updated!"
            });
        }

        res.status(200).json({
            message: "Successfully Updated Post!",
            updatedPost
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error!"
        });
    }
};

// DELETE JOB POST
const deletedJobPost = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { post_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(post_id)) {
            return res.status(400).json({
                message: "Invalid request!"
            });
        }

        const deletedPost = await jobModel.findOneAndDelete({
            _id: post_id,
            user: user_id
        });

        if (!deletedPost) {
            return res.status(404).json({
                message: "Job Post Not Deleted"
            });
        }

        res.status(200).json({
            message: "Successfully Deleted!",
            deletedPost
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error!"
        });
    }
};

// SHOW ALL JOB POSTS (public)
const showAllPost = async (req, res) => {
    try {
        const allJobPosting = await jobModel.find({}).populate('user', 'username email');
        res.status(200).json({ message: "All Job Posting", allJobPosting });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error!" });
    }
};

// MY JOBS — only jobs posted by the logged-in recruiter
const getMyJobs = async (req, res) => {
    try {
        const user_id = req.user_id;
        const myJobs = await jobModel
            .find({ user: user_id })
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json({ jobs: myJobs });
    } catch (err) {
        console.error('getMyJobs error:', err.message);
        res.status(500).json({ message: 'Server Side Error!' });
    }
};

// GET JOB BY ID
const getJobById = async (req, res) => {
    try {
        const job = await jobModel.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ job });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export default {
    createJobPost,
    updatedJobPost,
    deletedJobPost,
    showAllPost,
    getJobById
};
export { getMyJobs };
