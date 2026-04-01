import interview_Model from "../models/interview_Model.js";
import fs from "fs";
import { createRequire } from "module";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.js";
import User from "../models/auth_Model.js";

// pdfjs-dist v5 requires workerSrc in Node.js — path is relative to this file's directory
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url
).href;


const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filepath = req.file.path;

    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

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
        content: `Extract structured data from the resume.
Return strictly JSON:
{
  "role": "String",
  "experience": "String",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}`
      },
      {
        role: "user",
        content: resumeText
      }
    ];

    const askAiResponse = await askAi(messages);

    let parsed;
    try {
      // Strip markdown fences the AI sometimes adds around JSON
      const cleaned = askAiResponse.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found in AI response');
      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.log("AI JSON Parse Error:", askAiResponse);
      return res.status(500).json({ error: "AI returned invalid JSON for resume analysis" });
    }

    fs.unlinkSync(filepath);

    res.status(200).json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText
    });

  } catch (error) {
    console.error("Error in analyzeResume:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const generateQuestions = async (req, res) => {
  try {
    let { role, experience, projects, skills, mode, resumeText } = req.body;

    if (!role || !experience || !projects || !skills || !mode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    role = role.trim();
    experience = experience.trim();
    mode = mode.trim();

    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const projectText = Array.isArray(projects) ? projects.join(", ") : "none";
    const skillText = Array.isArray(skills) ? skills.join(", ") : "none";
    const safeResumeText = resumeText?.trim() || "No resume text provided";

    const userPrompt = `
Role: ${role}
Experience: ${experience}
Interview Mode: ${mode}
Projects: ${projectText}
Skills: ${skillText}
Resume Text: ${safeResumeText}
`;

    const message = [
      {
        role: "system",
        content: `You are a professional interviewer conducting a real job interview.

Generate exactly 5 interview questions.

Strict Instructions:
* Each question must contain 15–25 words.
* One sentence per question.
* Do not number questions.
* No explanations.
* Output only questions.
* One question per line.
* Difficulty order: Easy, Easy, Medium, Medium, Hard.
If you do not follow instructions exactly, the interview system will fail.`
      },
      { role: "user", content: userPrompt }
    ];

    const aiResponse = await askAi(message);

    if (!aiResponse) {
      return res.status(500).json({ message: "AI returned empty response." });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .slice(0, 5);

    if (questionsArray.length === 0) {
      return res.status(500).json({ message: "AI failed to generate questions." });
    }

    const interview = await interview_Model.create({
      user: req.user_id,
      role,
      experience,
      mode,
      resumeText: safeResumeText,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: index < 2 ? "easy" : index < 4 ? "medium" : "hard",
        timelimit: index < 2 ? 60 : index < 4 ? 120 : 180
      }))
    });

    res.status(200).json({
      interviewId: interview._id,
      questions: interview.questions
    });

  } catch (error) {
    console.error("Error in generateQuestions:", error.message, error.stack);
    res.status(500).json({ error: error.message || "Internal server error in generateQuestions" });
  }
};


const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionId, answer, timelimit } = req.body;

    if (!interviewId || !questionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const interview = await interview_Model.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    const question = interview.questions.id(questionId);

    if (!answer) {
      question.score = 0;
      question.feedback = "No answer provided";
      await interview.save();

      return res.status(200).json({
        score: question.score,
        feedback: question.feedback
      });
    }

    if (timelimit > question.timelimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded";
      question.answer = answer;
      await interview.save();

      return res.status(200).json({
        score: question.score,
        feedback: question.feedback
      });
    }

    const message = [
      {
        role: "system",
        content: `Evaluate the candidate answer.

Score 0–10:
Confidence
Communication
Correctness

FinalScore = average

Return ONLY JSON:
{
 "confidence": number,
 "communication": number,
 "correctness": number,
 "finalScore": number,
 "feedback": "short feedback"
}`
      },
      {
        role: "user",
        content: `Question: ${question.question}
Answer: ${answer}`
      }
    ];

    const aiResponse = await askAi(message);

    let parsed;
    try {
      const cleaned = aiResponse.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in AI evaluation response');
      parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.log("AI JSON Parse Error (submitAnswer):", aiResponse);
      return res.status(500).json({ error: "AI returned invalid JSON during evaluation" });
    }

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;

    await interview.save();

    return res.status(200).json({
      feedback: question.feedback,
      score: question.score
    });

  } catch (error) {
    console.error("Error in submitAnswer:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await interview_Model.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    interview.completed = true;
    interview.status = "completed";

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

    interview.finalScore = Number(finalScore.toFixed(1));
    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0
      }))
    });

  } catch (error) {
    console.error("Error in finishInterview:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getMyInterviews = async (req, res) => {
  try {
    const interviews = await interview_Model
      .find({ user: req.user_id })
      .sort({ createdAt: -1 })
      .select("role experience mode createdAt status finalScore");

    res.status(200).json({ interviews });

  } catch (error) {
    console.error("Error in getMyInterviews:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getReport = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await interview_Model.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1))
    });

  } catch (error) {
    console.error("Error in getReport:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFullInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interview = await interview_Model.findById(interviewId);
    if (!interview) return res.status(404).json({ error: "Interview not found" });

    // Verify this interview belongs to this user
    if (interview.user.toString() !== req.user_id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const totalQ = interview.questions.length || 1;
    const avgScore         = (interview.questions.reduce((s, q) => s + (q.score         || 0), 0) / totalQ).toFixed(1);
    const avgConfidence    = (interview.questions.reduce((s, q) => s + (q.confidence    || 0), 0) / totalQ).toFixed(1);
    const avgCommunication = (interview.questions.reduce((s, q) => s + (q.communication || 0), 0) / totalQ).toFixed(1);
    const avgCorrectness   = (interview.questions.reduce((s, q) => s + (q.correctness   || 0), 0) / totalQ).toFixed(1);

    res.status(200).json({
      _id:           interview._id,
      role:          interview.role,
      experience:    interview.experience,
      mode:          interview.mode,
      status:        interview.status,
      finalScore:    interview.finalScore,
      createdAt:     interview.createdAt,
      avgConfidence:    Number(avgConfidence),
      avgCommunication: Number(avgCommunication),
      avgCorrectness:   Number(avgCorrectness),
      questions: interview.questions.map((q) => ({
        _id:           q._id,
        question:      q.question,
        difficulty:    q.difficulty,
        timelimit:     q.timelimit,
        answer:        q.answer   || '',
        feedback:      q.feedback || '',
        score:         q.score         || 0,
        confidence:    q.confidence    || 0,
        communication: q.communication || 0,
        correctness:   q.correctness   || 0,
      }))
    });
  } catch (error) {
    console.error("Error in getFullInterview:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ── Recruiter: view a candidate's full interview history ─────────────────────
const getCandidateInterviews = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const interviews = await interview_Model
      .find({ user: candidateId })
      .sort({ createdAt: -1 });

    const formatted = interviews.map(iv => {
      const totalQ = iv.questions.length || 1;
      return {
        _id:              iv._id,
        role:             iv.role,
        experience:       iv.experience,
        mode:             iv.mode,
        status:           iv.status,
        finalScore:       iv.finalScore || 0,
        createdAt:        iv.createdAt,
        avgConfidence:    Number((iv.questions.reduce((s, q) => s + (q.confidence    || 0), 0) / totalQ).toFixed(1)),
        avgCommunication: Number((iv.questions.reduce((s, q) => s + (q.communication || 0), 0) / totalQ).toFixed(1)),
        avgCorrectness:   Number((iv.questions.reduce((s, q) => s + (q.correctness   || 0), 0) / totalQ).toFixed(1)),
        questions: iv.questions.map(q => ({
          _id:           q._id,
          question:      q.question,
          difficulty:    q.difficulty,
          timelimit:     q.timelimit,
          answer:        q.answer        || '',
          feedback:      q.feedback      || '',
          score:         q.score         || 0,
          confidence:    q.confidence    || 0,
          communication: q.communication || 0,
          correctness:   q.correctness   || 0,
        }))
      };
    });

    res.status(200).json({ interviews: formatted });
  } catch (error) {
    console.error("Error in getCandidateInterviews:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  analyzeResume,
  generateQuestions,
  submitAnswer,
  finishInterview,
  getMyInterviews,
  getReport,
  getFullInterview,
  getCandidateInterviews
};