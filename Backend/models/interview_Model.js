import mongoose from ("mongoose");

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

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true
  },

  domain: {
    type: String,
    required: true
  },

  questions: [
    {
      question: { type: String, required: true },
      answer: { type: String },
      aiRating: { type: Number }
    }
  ],

  aiScore: Number,

  feedback: String,

  strengths: [String],

  weaknesses: [String],

  status: {
    type: String,
    enum: ["started", "completed"],
    default: "started"
  },

  duration: Number

}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);