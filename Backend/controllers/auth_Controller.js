import User from "../models/auth_Model.js";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ResetRequest from '../models/resetRequest_Model.js';
import crypto from "crypto";
import sendEmail from "../util/email.js";

// Shared cookie config — secure in production, relaxed in development
const cookieOptions = () => {
    const isProd = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
};

// LOGIN
const userlogin = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) return res.status(400).json({ message: "Enter the Details" });
        const { email, password } = req.body;
        const findOne = await User.findOne({ email });
        if (!findOne) return res.status(400).json({ message: "User Not Exists!" });
        if (!findOne.password) return res.status(401).json({ message: "This account was registered via Google. Please sign in with Google." });
        const isMatched = await bcrypt.compare(password, findOne.password);
        if (!isMatched) return res.status(401).json({ message: "Invalid password" });
        const accessToken = generateAccessToken(findOne._id);
        const refreshToken = generateRefreshToken(findOne._id);
        res.cookie("refreshToken", refreshToken, cookieOptions());
        res.json({ accessToken });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error!" });
    }
};

// SIGNUP
const signUp = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) return res.status(400).json({ message: "Enter the Details" });
        const { username, email, password, role } = req.body;
        const find = await User.findOne({ email });
        if (find) return res.status(409).json({ message: "User already exists!" });
        let hashedPassword;
        if (password) hashedPassword = await bcrypt.hash(password, 10);
        const allowedRoles = ["jobseeker", "recruiter"];
        const newUser = await User.create({
            username, email,
            password: hashedPassword,
            role: allowedRoles.includes(role) ? role : "jobseeker"
        });
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);
        res.cookie("refreshToken", refreshToken, cookieOptions());
        res.status(201).json({ message: "User registered successfully", accessToken });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });
        const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        res.json({ accessToken: newAccessToken });
    });
};

// LOGOUT
const logout = async (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("refreshToken", { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "strict" });
    res.json({ message: "Logged out successfully" });
};

// GOOGLE AUTH
const googleAuth = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email) return res.status(400).json({ message: "Email required" });
        let user = await User.findOne({ email });
        if (!user) user = await User.create({ username: username || email.split("@")[0], email, role: "jobseeker" });
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        res.cookie("refreshToken", refreshToken, cookieOptions());
        res.status(200).json({ message: "Google Auth successful", accessToken });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

// ADMIN LOGIN — credentials from environment variables (NOT hardcoded)
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminEmail    = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminEmail || !adminPassword) return res.status(500).json({ message: "Admin credentials not configured on server." });
        if (email !== adminEmail || password !== adminPassword) return res.status(401).json({ message: "Invalid admin credentials" });
        let user = await User.findOne({ email });
        if (!user) {
            const hashed = await bcrypt.hash(password, 10);
            user = await User.create({ username: "Admin", email, password: hashed, role: "admin" });
        }
        if (user.role !== "admin") { user.role = "admin"; await user.save(); }
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        res.cookie("refreshToken", refreshToken, cookieOptions());
        res.status(200).json({ accessToken });
    } catch (err) {
        console.error("Admin login error:", err.message);
        res.status(500).json({ message: "Server Side Error" });
    }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "No account found with that email." });
        const resetToken  = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordToken   = hashedToken;
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
        await user.save();
        const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",")[0].trim() : "http://localhost:5173";
        const resetUrl  = `${clientUrl}/reset-password/${resetToken}`;
        try {
            await sendEmail({ email: user.email, subject: "AI Portal — Password Reset", message: `Reset your password:\n\n${resetUrl}\n\nExpires in 30 minutes.` });
            res.status(200).json({ message: "Password reset link sent to your email." });
        } catch (emailErr) {
            console.error("Email send failed:", emailErr.message);
            if (process.env.NODE_ENV !== "production") {
                res.status(200).json({ message: "Email failed (dev). Reset link below.", devUrl: resetUrl });
            } else {
                res.status(500).json({ message: "Failed to send reset email. Please try again." });
            }
        }
    } catch (err) {
        console.error("Forgot password error:", err.message);
        res.status(500).json({ message: "Server Side Error" });
    }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Reset token is invalid or has expired." });
        user.password             = await bcrypt.hash(password, 10);
        user.resetPasswordToken   = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successful! You can now login." });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user_id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.password) return res.status(400).json({ message: "Accounts registered with Google must use Google Sign-in." });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect current password." });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

// ADMIN-APPROVED FORGOT PASSWORD
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "No account found with that email." });
        const existingRequest = await ResetRequest.findOne({ email, status: { $in: ["pending", "approved"] }, expiresAt: { $gt: Date.now() } });
        if (existingRequest) return res.status(200).json({ message: "You already have a request. Status: " + existingRequest.status, status: existingRequest.status });
        const token = crypto.randomBytes(32).toString('hex');
        await ResetRequest.create({ user: user._id, email: user.email, token, status: "pending" });
        res.status(200).json({ message: "Reset request sent to Admin! Please wait for approval.", status: "pending" });
    } catch (err) {
        console.error("Request reset error:", err.message);
        res.status(500).json({ message: "Server Side Error" });
    }
};

const checkRequestStatus = async (req, res) => {
    try {
        const { email } = req.body;
        const request = await ResetRequest.findOne({ email, expiresAt: { $gt: Date.now() } }).sort({ createdAt: -1 });
        if (!request) return res.status(404).json({ message: "No active request found." });
        res.status(200).json({ status: request.status, token: request.status === "approved" ? request.token : undefined });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

const resetPasswordManual = async (req, res) => {
    try {
        const { token, password } = req.body;
        const request = await ResetRequest.findOne({ token, status: "approved", expiresAt: { $gt: Date.now() } });
        if (!request) return res.status(400).json({ message: "Invalid or expired approval." });
        const user = await User.findById(request.user);
        if (!user) return res.status(404).json({ message: "User not found." });
        user.password   = await bcrypt.hash(password, 10);
        await user.save();
        request.status = "completed";
        await request.save();
        res.status(200).json({ message: "Password reset successful! You can now login." });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

export { userlogin, signUp, logout, refreshToken, googleAuth, adminLogin, forgotPassword, resetPassword, changePassword, requestPasswordReset, checkRequestStatus, resetPasswordManual };
