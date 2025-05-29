import jwt from "jsonwebtoken";

const jwtSecret = process.env.Access_Token || "your_secret";

// Generate JWT token
export const generateAccessToken = (payload: object) =>
    jwt.sign(payload, jwtSecret, { expiresIn: "15m" });

// Generate refresh token
export const generateRefreshToken = (payload: object) =>
    jwt.sign(payload, jwtSecret, { expiresIn: "2h" });

// Verify JWT token
export const verifyToken = (token: string) =>
    jwt.verify(token, jwtSecret);