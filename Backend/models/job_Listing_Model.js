import mongoose from "mongoose";

const jobListingSchema = new mongoose.Schema({
    company_logo: {
        filename: {
            type: String,
            default: "job"
        },
        url: {
            type: String,
            default: "https://img.freepik.com/premium-vector/creative-elegant-minimalistic-logo-design-vector-any-brand-business-company_1253202-134378.jpg"
        }
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    company_name: {
        type: String,
        required: true,
        trim: true
    },

    job_title: {
        type: String,
        required: true,
        trim: true
    },

    company_type: {
        type: String
    },

    company_location: {
        type: String
    },

    company_information: [{
        type: String
    }],

    salary: {
        type: String
    },

    experience: {
        type: String
    },

    required_skills: [{
        type: String
    }],

    job_type: {
        type: String,
        enum: ["full-time", "part-time", "internship", "contract"]
    },

    role_about: {
        type: String
    },

    job_position: {
        type: String
    },

    role_responsibilities: {
        type: String
    },

    educational_qualification: [{
        type: String
    }],

    numberOfOpening: {
        type: Number,
        min: 1,
        default: 1
    }

}, { timestamps: true });

export default mongoose.model("JobListing", jobListingSchema);