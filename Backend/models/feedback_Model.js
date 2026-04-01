import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    feedback_Form: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
})

export default mongoose.model("Feedback", feedbackSchema);