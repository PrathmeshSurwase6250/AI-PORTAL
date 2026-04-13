import resume_Model from "../models/resume_Models.js";
import jobModel from "../models/job_Listing_Model.js";
import { askAi } from "../services/openRouter.js";

const getSuggestedJobs = async (req, res) => {
    try {
        const userId = req.user_id;

        // 1. Get the latest resume for this user
        const latestResume = await resume_Model.findOne({ user: userId }).sort({ createdAt: -1 });

        if (!latestResume) {
            return res.status(200).json({ 
                success: false, 
                message: "No resume found. Please create or upload a resume to get tailored job suggestions.",
                jobs: [] 
            });
        }

        // 2. Fetch recent jobs (limiting to 20 for performance in search)
        const allJobs = await jobModel.find({}).sort({ createdAt: -1 }).limit(20).populate('user', 'username email');

        if (allJobs.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: "No jobs available at the moment.", 
                jobs: [] 
            });
        }

        // 3. Prepare data for AI matching
        const resumeSummary = {
            skills: [
                ...(latestResume.technical_skills.programming_language || []),
                ...(latestResume.technical_skills.frontend || []),
                ...(latestResume.technical_skills.backend || []),
                ...(latestResume.technical_skills.database || []),
                ...(latestResume.technical_skills.tools || [])
            ].join(", "),
            objective: latestResume.career_Objective,
            experience: latestResume.experience.map(exp => exp.role).join(", ")
        };

        const jobSummaries = allJobs.map(job => ({
            id: job._id,
            title: job.job_title,
            skills: job.required_skills?.join(", ") || "",
            company: job.company_name
        }));

        const messages = [
            {
                role: "system",
                content: `You are an AI Job Matching Assistant. 
                Your goal is to compare a user's resume skills and objective with a list of available jobs.
                Rank the top 5 most relevant jobs.
                
                For each match, provide:
                1. Job ID
                2. Match Score (0-100)
                3. A short reasoning (why it matches)

                Return response ONLY in JSON format:
                {
                  "matches": [
                    { "id": "job_id_here", "score": 95, "reason": "Reason here" },
                    ...
                  ]
                }`
            },
            {
                role: "user",
                content: `Resume Skills: ${resumeSummary.skills}
                Resume Objective: ${resumeSummary.objective}
                Experience Roles: ${resumeSummary.experience}

                Available Jobs:
                ${JSON.stringify(jobSummaries, null, 2)}`
            }
        ];

        // 4. Call AI for matching
        const aiResponseRaw = await askAi(messages);
        let aiData;
        try {
            // Clean AI response if it contains markdown blocks
            const jsonStr = aiResponseRaw.replace(/```json/g, "").replace(/```/g, "").trim();
            aiData = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("AI Parsing Error:", parseError, aiResponseRaw);
            return res.status(500).json({ message: "AI response parsing failed" });
        }

        // 5. Combine AI matching data with Job details
        const suggestedJobs = aiData.matches.map(match => {
            const jobDetails = allJobs.find(j => j._id.toString() === match.id);
            if (!jobDetails) return null;
            return {
                ...jobDetails.toObject(),
                matchScore: match.score,
                matchReason: match.reason
            };
        }).filter(j => j !== null);

        res.status(200).json({
            success: true,
            suggestedJobs
        });

    } catch (err) {
        console.error("getSuggestedJobs Error:", err);
        res.status(500).json({
            message: "Server Side Error!",
            error: err.message
        });
    }
};

export default { getSuggestedJobs };
