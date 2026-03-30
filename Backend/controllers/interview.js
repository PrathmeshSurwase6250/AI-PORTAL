import interview_Model  from "../models/interview_Model";
import fs from "fs" ;
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import { askAi } from "../services/openRouter.js";
import User from "../models/user.js";

const analyzeResume = async (req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({ error: "No file uploaded" });
        }
        const filepath = req.file.path; 


        const fileBuffer = await fs.promises.readFile(filepath)

        const uint8Array = new Uint8Array(fileBuffer);

        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        let resumeText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

            const page = await pdf.getPage(pageNum);

            const textContent = await page.getTextContent();

            const pageText = textContent.items.map(item => item.str).join(" ");

            resumeText += pageText + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, ' ').trim();

        const messages =  [
            {role : "String" ,content : `Extract Structured data from resume . 
                
                return strictly JSON : 
                {
                role : "String" ,
                experience : "String" ,
                projects : ["project1" , "project2"] ,
                skills : ["skill1" , "skill2"] ,
                }` },
            {role : "user" , content : resumeText } 
        ]

        const askAiResponse = await askAi(messages);

        const parsed = JSON.parse(askAiResponse);

        fs.unlinkSync(filepath);

        res.status(200).json(
            { 
                role : parsed.role ,
                experience : parsed.experience , 
                projects : parsed.projects , 
                skills : parsed.skills  , 
                resumeText
            }
        );


    } catch (error) {
        console.error("Error in analyzeResume function:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const generateQuestions = async (req, res) => {
    try{
        let { role , experience , projects , skills , mode , resumeText } = req.body;

        if(!role || !experience || !projects || !skills || !mode){
            return res.status(400).json({ error: "Missing required fields" });
        }

        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();


        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({ error: "User not found" });
        } 

        const projectText = Array.isArray(projects) ? projects.join(", ") : "none";
        const skillText = Array.isArray(skills) ? skills.join(", ") : "none";
        const safeResumeText = resumeText?.trim() || "No resume text provided";

        const userPrompt = `
            Role: ${role} ,
            Experience: ${experience} 
            interview mode : ${mode}
            Projects: ${projectText}
            Skills: ${skillText}
            Resume Text: ${safeResumeText}
             ` ;
     

        if(!userPrompt.trim()){
            return res.status(400).json({ error: "Invalid input for AI" });
        }

        const message = [
            {
                role : "system" ,
                content : `You are a professional interviewer conducting a real job interview.

Communicate in simple, clear, and natural English, as if you are speaking directly to a candidate during a live interview.

Your task is to generate exactly 5 interview questions based on the candidate's role, experience, interview mode, projects, skills, and resume details.

Strict Instructions:

* Generate exactly 5 questions.
* Each question must contain between 15 and 25 words.
* Each question must be one complete sentence.
* Do not number the questions.
* Do not add explanations.
* Do not add any text before or after the questions.
* Output only the questions.
* Write one question per line.
* Keep the language simple, professional, and conversational.
* Questions must feel realistic and practical, like a real interview.
* Avoid overly theoretical or textbook-style questions.

Difficulty Order:

* Question 1: Easy
* Question 2: Easy
* Question 3: Medium
* Question 4: Medium
* Question 5: Hard

Ensure the questions are personalized using the candidate’s provided role, experience, interview mode, projects, skills, and resume information.
Here is the candidate's information to use for generating the questions:`
            },

            {role : "user" , content : userPrompt }
        ]

    const aiResponse = await askAi(message);

    if (!aiResponse) {
          return res.status(500).json({
            message: "AI returned empty response."
        });
        }

    const questionsArray = aiResponse.split("\n").map(q => q.trim()).filter(q => q.length > 0).slice(0, 5);

    if (questionsArray.length === 0) {
      return res.status(500).json({
        message: "AI failed to generate questions."
      });
    }

    const interview = await interview_Model.create({
        user : req.user.id ,
        role ,
        experience ,
        mode ,     
        resumeText : safeResumeText ,
        questions : questionsArray.map((q, index) => ({
            question : q ,
            difficulty : index < 2 ? "easy" : index < 4 ? "medium" : "hard" ,
            timelimit : index < 2 ? 60 : index < 4 ? 120 : 180
        }))
    })

    res.status(200).json({ interviewId : interview._id  , questions : interview.questions  });



    }catch(error){
        console.error("Error in generateQuestions function:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


const submitAnswer = async (req, res) => {
    try{
        const { interviewId , questionId , answer , timelimit } = req.body;

        if(!interviewId || !questionId || !answer){
            return res.status(400).json({ error: "Missing required fields" });
        }

        const interview = await interview_Model.findById(interviewId);

        if(!interview){
            return res.status(404).json({ error: "Interview not found" });
        }
        
        const question = interview.questions.id(questionId);

        if(!answer){
            question.score = 0 ;
            question.feedback = "No answer provided"
            question.answered = "" ;

            await interview.save();

            return res.status(200).json({ message: "Answer submitted successfully", score: question.score, feedback: question.feedback });
        }

        if(timelimit >question.timelimit){
            question.score = 0 ;
            question.feedback = "Time limit exceeded"
            question.answered = answer ;
            
            await interview.save();
            return res.status(200).json({ message: "Answer submitted successfully", score: question.score, feedback: question.feedback });
        }

        const message = [{
            role : "system" ,
            content : 
`You are a professional interviewer evaluating a candidate’s answer in a real job interview.

Evaluate the answer naturally, fairly, and objectively, as a real interviewer would. Your evaluation should reflect the actual quality of the answer, not random or overly generous scoring.

Evaluate the answer on the following criteria, scoring each from 0 to 10:

Confidence:
Does the answer sound confident, clear, and well-presented?

Communication:
Is the answer easy to understand, well-structured, and written in clear, simple language?

Correctness:
Is the answer technically accurate, relevant to the question, and reasonably complete?

Scoring Guidelines:
Give low scores for vague, incorrect, very short, or irrelevant answers.
Give medium scores for partially correct or average answers.
Give high scores for clear, correct, well-structured, and detailed answers.
Be realistic and unbiased in scoring.

Final Score:
finalScore = average of confidence, communication, and correctness, rounded to the nearest whole number.

Feedback Instructions:
Write short, natural interview-style feedback.
Feedback must be between 10 and 15 words.
Sound like real interview feedback from a human interviewer.
You may include a short suggestion for improvement if needed.
Do not repeat the question.
Do not explain the scoring.
Keep the tone professional, honest, and constructive.

Output Rules:
Return ONLY valid JSON.
Do not add any text before or after the JSON.

Return JSON in exactly this format:

{
"confidence": number,
"communication": number,
"correctness": number,
"finalScore": number,
"feedback": "short professional feedback"
}`
        },
    {
        role: "user",
        content: `
        Question: ${question.question}
        Answer: ${answer} `
    }]


    const aiResponse = await askAi(messages);

    const parsed = JSON.parse(aiResponse);

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;

    await interview.save();

    return res.status(200).json({ message: "Answer submitted successfully", feedback: question.feedback });
    }
    catch(error){
        console.error("Error in submitAnswer function:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }}


const finishInterview = async (req, res) => {
    try{
        const { interviewId } = req.body;

        const interview = await interview_Model.findById(interviewId);

        if(!interview){
            return res.status(404).json({ error: "Interview not found" });
        }

        interview.completed = true ;
        await interview.save();

        res.status(200).json({ message: "Interview marked as completed" });

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

        interview.status = "completed";

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
            correctness: q.correctness || 0,
      })),
    });

    }catch(error){
        console.error("Error in finishInterview function:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}  


const getMyInterviews = async (req, res) => {
    try{
        const interviews = await interview_Model.find({ user : req.user.id }).sort({ createdAt : -1 }).select("role experience mode createdAt status finalScore");

        res.status(200).json({ interviews });

    }catch(error){
        console.error("Error in getMyInterviews function:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getReport = async (req, res) => {
    try{
        const { interviewId } = req.params;

        const interview = await interview_Model.findById(interviewId);

        if(!interview){
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
          correctness: Number(avgCorrectness.toFixed(1)),
        });

    }catch(error){
        console.error("Error in getReport function:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export { analyzeResume , generateQuestions , submitAnswer , finishInterview , getMyInterviews , getReport } ;