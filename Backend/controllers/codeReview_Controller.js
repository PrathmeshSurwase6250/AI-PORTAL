import { askAi } from "../services/openRouter.js";

export const reviewCode = async (req, res) => {
    try {
        const { code, language } = req.body;
        if (!code || !code.trim()) return res.status(400).json({ message: "Code is required" });

        const prompt = `You are an expert ${language || 'programming'} code reviewer with 10+ years of experience. Review the following code thoroughly and respond ONLY with a valid JSON object.

CODE TO REVIEW:
\`\`\`${language || ''}
${code}
\`\`\`

Respond ONLY with this exact JSON structure, no extra text or markdown:
{
  "overall_score": <integer 1-10>,
  "summary": "<2-sentence overall assessment>",
  "bugs": [
    { "line": "<line or range>", "severity": "critical|warning|info", "issue": "<description>", "fix": "<how to fix>" }
  ],
  "security_issues": [
    { "issue": "<security problem>", "fix": "<how to fix it>" }
  ],
  "improvements": [
    { "area": "<e.g. Performance, Readability>", "suggestion": "<specific improvement>" }
  ],
  "best_practices": [
    "<practice1>", "<practice2>", "<practice3>"
  ],
  "refactored_snippet": "<a short refactored version of the most critical part, or the whole code if small. Use actual code, not a placeholder.>",
  "complexity": "<Low|Medium|High>",
  "maintainability": "<Low|Medium|High>"
}`;

        const raw = await askAi([{ role: "user", content: prompt }]);
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) return res.status(500).json({ message: "AI returned unexpected format" });

        const review = JSON.parse(match[0]);
        res.status(200).json({ review });

    } catch (err) {
        console.error("Code review error:", err.message);
        res.status(500).json({ message: "Failed to review code", error: err.message });
    }
};
