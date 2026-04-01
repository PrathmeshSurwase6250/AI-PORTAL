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

// GET AI SUGGESTIONS
const getAiSuggestions = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { resume_id } = req.params;

        const resume = await resumeModel.findOne({ _id: resume_id, user: user_id });
        if (!resume) return res.status(404).json({ message: "Resume not found!" });

        const pi = resume.personal_Information || {};
        const skills = resume.technical_skills || {};
        const allSkills = [
            ...(skills.programming_language || []),
            ...(skills.frontend || []),
            ...(skills.backend || []),
            ...(skills.database || []),
            ...(skills.tools || []),
        ];

        const prompt = `
You are a professional resume coach and ATS (Applicant Tracking System) expert. Analyze the following resume data and provide specific, actionable improvement suggestions.

RESUME DATA:
- Name: ${pi.full_Name || 'Not provided'}
- Career Objective/Summary: "${resume.career_Objective || 'Not provided'}"
- Technical Skills: ${allSkills.join(', ') || 'None listed'}
- Education Count: ${resume.education?.length || 0} entries
- Work Experience Count: ${resume.experience?.length || 0} entries
- Projects Count: ${resume.project?.length || 0} entries
- Certifications: ${resume.certifications?.length || 0}
- Achievements: ${resume.achievements?.join(', ') || 'None'}
- Soft Skills: ${resume.softSkills?.join(', ') || 'None'}
- Languages: ${resume.languages?.join(', ') || 'None'}

Respond ONLY with a valid JSON object in exactly this format, no extra text:
{
  "overall_score": <number 1-10>,
  "ats_score": <number 1-100>,
  "summary_tip": "<one specific tip to improve the career objective/summary, max 2 sentences>",
  "skills_to_add": ["<skill1>", "<skill2>", "<skill3>", "<skill4>", "<skill5>"],
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "improvements": [
    { "area": "<area name>", "tip": "<specific actionable improvement>" },
    { "area": "<area name>", "tip": "<specific actionable improvement>" },
    { "area": "<area name>", "tip": "<specific actionable improvement>" }
  ],
  "missing_sections": ["<section1>", "<section2>"],
  "action_verbs": ["<verb1>", "<verb2>", "<verb3>", "<verb4>", "<verb5>"]
}
`;

        const { askAi } = await import("../services/openRouter.js");
        const rawResponse = await askAi([{ role: "user", content: prompt }]);

        // Extract JSON from the response (strip any markdown fences if present)
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(500).json({ message: "AI returned an unexpected format. Please try again." });
        }

        const suggestions = JSON.parse(jsonMatch[0]);

        res.status(200).json({
            message: "AI Suggestions Generated",
            suggestions
        });

    } catch (err) {
        console.error("AI Suggestion error:", err.message);
        res.status(500).json({ message: "Failed to generate AI suggestions.", error: err.message });
    }
};

// REALTIME SUGGESTIONS (from builder — no saved resume needed)
const getRealtimeSuggestions = async (req, res) => {
    try {
        const { formData } = req.body;
        if (!formData) return res.status(400).json({ message: "formData is required" });

        const pi     = formData.personal_Information || {};
        const skills = formData.technical_skills     || {};
        const allSkills = [
            ...(skills.programming_language || []),
            ...(skills.frontend || []),
            ...(skills.backend  || []),
            ...(skills.database || []),
            ...(skills.tools    || []),
        ];

        const prompt = `You are a professional resume coach. Analyze this resume data and give quick, real-time suggestions.

Resume Data:
- Name: ${pi.full_Name || 'Not provided'}
- Summary: "${formData.career_Objective || 'Not provided'}"
- Skills: ${allSkills.join(', ') || 'None'}
- Education entries: ${formData.education?.length || 0}
- Experience entries: ${formData.experience?.length || 0}
- Projects: ${formData.project?.length || 0}
- Achievements: ${formData.achievements?.length || 0}

Respond ONLY with valid JSON, no extra text:
{
  "score": <1-10>,
  "ats": <1-100>,
  "quick_wins": ["<tip1>","<tip2>","<tip3>"],
  "missing": ["<item1>","<item2>"],
  "skills_to_add": ["<skill1>","<skill2>","<skill3>"]
}`;

        const { askAi } = await import("../services/openRouter.js");
        const raw   = await askAi([{ role: "user", content: prompt }]);
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) return res.status(500).json({ message: "AI returned unexpected format" });

        res.status(200).json({ suggestions: JSON.parse(match[0]) });

    } catch (err) {
        console.error("Realtime suggestion error:", err.message);
        res.status(500).json({ message: "Failed to generate suggestions", error: err.message });
    }
};

// GENERATE CONTENT FOR A SPECIFIC FIELD
const generateFieldContent = async (req, res) => {
    try {
        const { field, context } = req.body;
        if (!field) return res.status(400).json({ message: "field is required" });

        const prompts = {
            summary: `Write a concise, professional 2-3 sentence resume summary for someone with the following profile. 
Name: ${context.name || 'the candidate'}
Job Title / Role: ${context.role || 'Software Developer'}
Skills: ${context.skills || 'Not specified'}
Experience: ${context.experience || 'Not specified'}
Return ONLY the summary text, no labels or extra text.`,

            work_description: `Write 3-4 strong bullet-point resume work descriptions (using action verbs) for this job:
Role: ${context.role || 'Developer'}
Company: ${context.company || 'a tech company'}
Duration: ${context.duration || ''}
Context clues: ${context.extra || ''}
Return ONLY the bullet points, one per line starting with "•". No labels or extra text.`,

            achievements: `Suggest 4 strong, quantified resume achievements for a ${context.role || 'Software Developer'} with skills in ${context.skills || 'programming'}.
Format: comma-separated list. Return ONLY the achievements, no labels or intro text.`,

            skills: `Suggest the top 10 most in-demand technical skills for a ${context.role || 'Software Developer'}.
Return ONLY a comma-separated list of skill names, no explanations.`,

            career_objective: `Write a 2-line career objective statement for a fresher/junior ${context.role || 'Software Developer'} skilled in ${context.skills || 'programming'}.
Return ONLY the objective text.`,
        };

        const prompt = prompts[field];
        if (!prompt) return res.status(400).json({ message: `Unknown field: ${field}` });

        const { askAi } = await import("../services/openRouter.js");
        const content = await askAi([{ role: "user", content: prompt }]);

        res.status(200).json({ content: content.trim() });

    } catch (err) {
        console.error("Field generation error:", err.message);
        res.status(500).json({ message: "Failed to generate content", error: err.message });
    }
};

export default {
    createResume,
    deleteResume,
    showAllResume,
    showSingleResume,
    updateResume,
    getAiSuggestions,
    getRealtimeSuggestions,
    generateFieldContent
};