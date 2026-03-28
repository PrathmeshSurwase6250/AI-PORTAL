import mongoose from "mongoose";
import ApplicationModel from "../models/application_Model.js";

/* Apply Job */
const applyJob = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { job_id, resume_id } = req.body;

        if (!mongoose.Types.ObjectId.isValid(job_id)) {
            return res.status(400).json({
                message: "Invalid Job ID"
            });
        }

        const alreadyApplied = await ApplicationModel.findOne({
            user: user_id,
            job: job_id
        });

        if (alreadyApplied) {
            return res.status(409).json({
                message: "You have already applied for this job"
            });
        }

        const application = await ApplicationModel.create({
            user: user_id,
            job: job_id,
            resume: resume_id
        });

        res.status(201).json({
            message: "Applied Successfully",
            application
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
};

/* My Applications */
const myApplications = async (req, res) => {
    try {
        const user_id = req.user_id;

        const myApplications = await ApplicationModel
            .find({ user: user_id })
            .populate("job")
            .populate("resume");

        if (myApplications.length === 0) {
            return res.status(404).json({
                message: "Not Applied For Any Job!"
            });
        }

        res.status(200).json({
            message: "Your Applications",
            myApplications
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
};

/* All Application infor For Job */
const jobApplications = async (req, res) => {
    try {
        const { job_id } = req.params;

        const applications = await ApplicationModel
            .find({ job: job_id })
            .populate("user")
            .populate("resume");

        if (applications.length === 0) {
            return res.status(404).json({
                message: "No Applications Yet"
            });
        }

        res.status(200).json({
            message: "Applicants For This Job",
            applications
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
};

/* Update Application Status */
const updateApplicationStatus = async (req, res) => {
    try {
        const { application_id } = req.params;
        const { status } = req.body;

        const updated = await ApplicationModel.findByIdAndUpdate(
            application_id,
            { status },
            { new: true }
        );

        res.status(200).json({
            message: "Status Updated",
            updated
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
};

export {
    applyJob,
    myApplications,
    jobApplications,
    updateApplicationStatus
};