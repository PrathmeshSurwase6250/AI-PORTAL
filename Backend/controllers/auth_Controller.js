import User from "../models/auth_Model.js";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



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

        const { username, email, password , role } = req.body;

        const find = await User.findOne({ email });

        if (find) {
            return res.status(409).json({
                message: "User already exists!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const allowedRoles = ["jobseeker", "recruiter"];

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword , 
            role : allowedRoles.includes(role) ? role : "jobseeker"
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

export default {
    userlogin,
    signUp,
    refreshToken
};