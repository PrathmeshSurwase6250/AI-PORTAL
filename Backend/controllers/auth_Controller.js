import User from "../models/auth_Model.js";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from 'axios';
import ResetRequest from '../models/resetRequest_Model.js';
import crypto from "crypto";
import sendEmail from "../util/email.js";



// LOGIN
const userlogin = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Enter the Details"
            });
        }

        const { email, password } = req.body;

        const findOne = await User.findOne({ email });

        if (!findOne) {
            return res.status(400).json({
                message: "User Not Exists!"
            });
        }

        if (!findOne.password) {
            return res.status(401).json({
                message: "This account was registered via Google. Please sign in with Google."
            });
        }

        const isMatched = await bcrypt.compare(password, findOne.password);

        if (!isMatched) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        let accessToken = generateAccessToken(findOne._id);

        let refreshToken = generateRefreshToken(findOne._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            accessToken
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error!"
        });
    }
};

// SIGNUP
const signUp = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Enter the Details"
            });
        }

        const { username, email, password, role } = req.body;

        const find = await User.findOne({ email });

        if (find) {
            return res.status(409).json({
                message: "User already exists!"
            });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const allowedRoles = ["jobseeker", "recruiter"];

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: allowedRoles.includes(role) ? role : "jobseeker"
        });

        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User registered successfully",
            accessToken
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Side Error"
        });
    }
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({
            message: "No refresh token"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        const newAccessToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({
            accessToken: newAccessToken
        });
    });
};

const logout = async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    });

    res.json({
        message: "Logged out successfully"
    });
};

// GOOGLE AUTH
const googleAuth = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email) return res.status(400).json({ message: "Email required" });

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                username: username || email.split("@")[0],
                email,
                role: "jobseeker"
            });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Google Auth successful",
            accessToken
        });

    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

// ADMIN QUICK LOGIN — works even for Google-registered accounts
const ADMIN_EMAIL    = "prathameshsurwase6250@gmail.com";
const ADMIN_PASSWORD = "9322124068@p";

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        // Find or create the admin user
        let user = await User.findOne({ email });
        if (!user) {
            const hashed = await bcrypt.hash(password, 10);
            user = await User.create({ username: "Admin", email, password: hashed, role: "admin" });
        }

        // Ensure admin role is set
        if (user.role !== "admin") {
            user.role = "admin";
            await user.save();
        }

        const accessToken  = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, secure: false, sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken });
    } catch (err) {
        console.error("Admin login error:", err.message);
        res.status(500).json({ message: "Server Side Error" });
    }
};

// ── FORGOT PASSWORD ──
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No account found with that email." });
        }

        // Generate Token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 mins
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        
        // Log to console for development (Bypassing real email sending as requested)
        console.log("--------------------------------------------------");
        console.log(`[DEV] Password Reset link for ${user.email}:`);
        console.log(resetUrl);
        console.log("--------------------------------------------------");

        res.status(200).json({ 
            message: "Development Mode: Reset link logged to server console!",
            devUrl: resetUrl // Optional: providing it in response for even easier testing
        });

    } catch (err) {
        console.error("Forgot password error:", err.message);
        res.status(500).json({ message: "Server Side Error" });
    }
};

// ── RESET PASSWORD ──
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Reset token is invalid or has expired." });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful! You can now login." });

    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

// ── CHANGE PASSWORD (while logged in) ──
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user_id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // If user registered with Google, they might not have a password
        if (!user.password) {
            return res.status(400).json({ message: "Accounts registered with Google must use Google Sign-in and do not have a separate password." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password." });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

// ── ADMIN-APPROVED FORGOT PASSWORD ──

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No account found with that email." });
        }

        // Check if there's already a pending or approved request
        const existingRequest = await ResetRequest.findOne({ 
            email, 
            status: { $in: ["pending", "approved"] },
            expiresAt: { $gt: Date.now() }
        });

        if (existingRequest) {
            return res.status(200).json({ 
                message: "You already have a request. Status: " + existingRequest.status,
                status: existingRequest.status 
            });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const resetRequest = await ResetRequest.create({
            user: user._id,
            email: user.email,
            token,
            status: "pending"
        });

        res.status(200).json({ 
            message: "Reset request sent to Admin! Please wait for approval.",
            status: "pending"
        });

    } catch (err) {
        console.error("Request reset error:", err.message);
        res.status(500).json({ message: "Server Side Error" });
    }
};

const checkRequestStatus = async (req, res) => {
    try {
        const { email } = req.body;
        const request = await ResetRequest.findOne({ 
            email, 
            expiresAt: { $gt: Date.now() }
        }).sort({ createdAt: -1 });

        if (!request) {
            return res.status(404).json({ message: "No active request found." });
        }

        res.status(200).json({ 
            status: request.status,
            token: request.status === "approved" ? request.token : undefined
        });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

const resetPasswordManual = async (req, res) => {
    try {
        const { token, password } = req.body;
        const request = await ResetRequest.findOne({ 
            token, 
            status: "approved",
            expiresAt: { $gt: Date.now() }
        });

        if (!request) {
            return res.status(400).json({ message: "Invalid or expired approval." });
        }

        const user = await User.findById(request.user);
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        request.status = "completed";
        await request.save();

        res.status(200).json({ message: "Password reset successful! You can now login." });
    } catch (err) {
        res.status(500).json({ message: "Server Side Error" });
    }
};

export { 
    userlogin, 
    signUp, 
    logout, 
    refreshToken, 
    googleAuth, 
    adminLogin, 
    forgotPassword, 
    resetPassword, 
    changePassword,
    requestPasswordReset,
    checkRequestStatus,
    resetPasswordManual
};