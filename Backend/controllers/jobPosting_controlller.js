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
        res.status(500).json({
            message: "Server Side Error!"
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

// SHOW ALL JOB POSTS
const showAllPost = async (req, res) => {
    try {
        const allJobPosting = await jobModel.find({});

        if (allJobPosting.length === 0) {
            return res.status(404).json({
                message: "No Job Posts Found"
            });
        }

        res.status(200).json({
            message: "All Job Posting",
            allJobPosting
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error!"
        });
    }
};

export default {
    createJobPost,
    updatedJobPost,
    deletedJobPost,
    showAllPost
};