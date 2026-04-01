import jwt from "jsonwebtoken";

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "15d" }
    );
}

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "15d" }
    );
}

export { generateAccessToken, generateRefreshToken };