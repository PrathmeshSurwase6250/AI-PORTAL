import mongoose from "mongoose";

const resumeInformation = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    personal_Information: {
        full_Name: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true
        },
        email: {
            type: String
        },
        linkedin_Profile: {
            url: {
                type: String
            }
        },
        github: {
            url: {
                type: String
            }
        },
        city: {
            type: String
        }
    },

    career_Objective: {
        type: String,
        required: true
    },

    technical_skills: {
        programming_language: [String],
        frontend: [String],
        backend: [String],
        database: [String],
        tools: [String]
    },

    education: [
        {
            degree: {
                type: String,
                required: true
            },
            college: {
                type: String,
                required: true
            },
            year: {
                type: String
            }
        }
    ],

    project: [
        {
            project_Title: String,
            technologies: [String],
            project_Live_Url: String,
            project_Github_Link: String,
            project_Description: String
        }
    ],

    experience: [
        {
            role: String,
            company_Name: String,
            duration: String,
            work_description: String
        }
    ],

    certifications: [
        {
            title: String,
            organization: String,
            year: String,
            url: String
        }
    ],

    achievements: [String],
    softSkills: [String],
    languages: [String],

    createdAt: {
        type: Date,
        default: Date.now
    }

});

export default mongoose.model("ResumeInformation", resumeInformation);