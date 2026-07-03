import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema({
    // FIXED: was `username` (ObjectId in wrong field) — now `user` with proper ref
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    feedback_Form: { type: String },
    rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });
export default mongoose.model("Feedback", feedbackSchema);
