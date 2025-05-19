import jwt from "jsonwebtoken";

const jwtSecret = process.env.Access_Token || "your_secret";
// Generate JWT token
export const generateToken = (payload: object) =>
    jwt.sign(payload, jwtSecret, { expiresIn: "1d" });

// Verify JWT token
export const verifyToken = (token: string) =>
    jwt.verify(token, jwtSecret);
