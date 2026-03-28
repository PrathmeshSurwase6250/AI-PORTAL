import resumeModel from "../models/resume_Models.js";
import mongoose from "mongoose";

// CREATE RESUME
const createResume = async (req, res) => {
    try {
        const user_id = req.user_id;

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Enter the Details"
            });
        }

        const resume = await resumeModel.create({
            ...req.body,
            user: user_id
        }  );

        res.status(201).json({
            message: "Successfully resume created!",
            resume
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error!",
            err: err.message
        });
    }
};

// UPDATE RESUME
const updateResume = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { resume_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(resume_id)) {
            return res.status(400).json({
                message: "Invalid Resume ID!"
            });
        }

        const updatedResume = await resumeModel.findOneAndUpdate(
            { _id: resume_id, user: user_id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedResume) {
            return res.status(404).json({
                message: "Resume Not Found!"
            });
        }

        res.status(200).json({
            message: "Successfully Updated!",
            updatedResume
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error!",
            err: err.message
        });
    }
};

// SHOW SINGLE RESUME
const showSingleResume = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { resume_id } = req.params;

        const showResume = await resumeModel.findOne({
            _id: resume_id,
            user: user_id
        });

        if (!showResume) {
            return res.status(404).json({
                message: "Resume Not Found!"
            });
        }

        res.status(200).json({
            message: "Resume Found!",
            resume: showResume
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error!",
            err: err.message
        });
    }
};

// SHOW ALL RESUMES
const showAllResume = async (req, res) => {
    try {
        const user_id = req.user_id;

        const resumes = await resumeModel.find({ user: user_id });

        if (resumes.length === 0) {
            return res.status(404).json({
                message: "No Resume Found"
            });
        }

        res.status(200).json({
            message: "All Resumes",
            resumes
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error!",
            err: err.message
        });
    }
};

// DELETE RESUME
const deleteResume = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { resume_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(resume_id)) {
            return res.status(400).json({
                message: "Invalid Resume ID!"
            });
        }

        const deleted = await resumeModel.findOneAndDelete({
            _id: resume_id,
            user: user_id
        });

        if (!deleted) {
            return res.status(404).json({
                message: "Resume Not Found!"
            });
        }

        res.status(200).json({
            message: "Resume Successfully Deleted!",
            deleted
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error!",
            err: err.message
        });
    }
};

export default {
    createResume,
    deleteResume,
    showAllResume,
    showSingleResume,
    updateResume
};