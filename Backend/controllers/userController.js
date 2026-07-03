import User from "../models/auth_Model.js";

export const getCurrentUser = async (req, res) => {
  try {
    // FIX: authMiddleware sets req.user_id explicitly — use that instead of req.user.id
    const user = await User.findById(req.user_id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};