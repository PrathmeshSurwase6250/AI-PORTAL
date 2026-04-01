import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobListing",
        required: true
    },

    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ResumeInformation",
        required: true
    },

    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
        required: false
    },

    status: {
        type: String,
        enum: ["applied", "shortlisted", "rejected"],
        default: "applied"
    }

}, { timestamps: true });


applicationSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);