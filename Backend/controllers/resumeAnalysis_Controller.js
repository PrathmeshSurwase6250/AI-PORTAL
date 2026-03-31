import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { askAi } from "../services/openRouter.js";

const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(404).json({
                message: "Input The Resume!"
            });
        }

        const filePath = req.file.path;
        const data = await fs.readFile(filePath);

        const uint8Array = new Uint8Array(data);
        const pdf = await pdfjsLib.getDocument(uint8Array).promise;

        let resumeText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            resumeText += pageText + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();

        const messages = [
            {
                role: "system",
                content: `You are a professional HR recruiter and resume reviewer.

Analyze the following resume and evaluate it professionally.

Resume Text:
${resumeText}

Evaluate the resume on:
- Overall Resume Quality
- Skills Relevance
- Experience Level
- Projects Quality
- Resume Formatting
- Communication
- ATS Compatibility

Give score from 0 to 10 for each.

Return response ONLY in JSON format:
{
  "overall_score": "",
  "skills_score": "",
  "experience_score": "",
  "projects_score": "",
  "formatting_score": "",
  "communication_score": "",
  "ats_score": "",
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}`
            }
        ];

        const askAiResponse = await askAi(messages);

        if (!askAiResponse) {
            return res.status(500).json({ message: "AI returned empty response." });
        }

        res.status(200).json({
            askAiResponse
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error!"
        });
    }
};

export { analyzeResume };