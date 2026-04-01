import mongoose from "mongoose";


const questionSchema = new mongoose.Schema({
  question:      { type: String },
  difficulty:    { type: String },
  timelimit:     { type: Number },
  answer:        { type: String, default: '' },
  feedback:      { type: String, default: '' },
  score:         { type: Number, default: 0 },
  confidence:    { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  correctness:   { type: Number, default: 0 },
});

const interviewSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  role: {
    type: String,
    required: true
  },

  mode: {
    type: String,
    enum: ["HR", "Technical", "technical", "behavioral", "system design"],
    required: true
  },

  experience: {
    type: String,
    required: true
  },

  resumeText: {
    type: String,
  },
  questions: [questionSchema],

  finalScore: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["Completed", "Incomplete", "completed", "incomplete"],
    default: "Incomplete"
  }

}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);