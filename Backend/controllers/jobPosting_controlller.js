import jobModel from "../models/job_Listing_Model.js";
import mongoose from "mongoose";

// CREATE JOB POST
const createJobPost = async (req, res) => {
    try {
        const user_id = req.user_id;

        // Handle File Upload for Company Logo
        let logoData = {};
        if (req.file) {
            logoData = {
                filename: req.file.filename,
                url: `/public/logos/${req.file.filename}`
            };
        }

        // Parse any fields that might come as JSON strings from FormData
        const bodyData = { ...req.body };
        ['required_skills', 'company_information', 'educational_qualification'].forEach(field => {
            if (typeof bodyData[field] === 'string' && bodyData[field].startsWith('[')) {
                try { bodyData[field] = JSON.parse(bodyData[field]); } catch (e) {}
            }
        });

        const jobData = {
            user: user_id,
            ...bodyData
        };

        if (req.file) {
            jobData.company_logo = logoData;
        }

        const createPost = await jobModel.create(jobData);

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

        // Handle File Upload if present
        const bodyData = { ...req.body };
        if (req.file) {
            bodyData.company_logo = {
                filename: req.file.filename,
                url: `/public/logos/${req.file.filename}`
            };
        }

        // Parse list fields if they come as JSON strings
        ['required_skills', 'company_information', 'educational_qualification'].forEach(field => {
            if (typeof bodyData[field] === 'string' && bodyData[field].startsWith('[')) {
                try { bodyData[field] = JSON.parse(bodyData[field]); } catch (e) {}
            }
        });

        const updatedPost = await jobModel.findOneAndUpdate(
            { _id: post_id, user: user_id },
            bodyData,
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
