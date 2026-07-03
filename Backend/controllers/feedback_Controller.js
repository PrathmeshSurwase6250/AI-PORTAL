import feedbackFrom from "../models/feedback_Model.js";

const feedbackReciver = async (req, res) => {
    try {
        const user_id = req.user_id;
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Fill the Form!" });
        }
        // FIXED: was `username: user_id` — now correctly `user: user_id`
        const feedback = await feedbackFrom.create({ ...req.body, user: user_id });
        res.status(201).json({ message: "Successfully Sent Feedback!", feedback });
    } catch (err) {
        res.status(500).json({ message: "Server Error!", error: err.message });
    }
};

export default feedbackReciver;
