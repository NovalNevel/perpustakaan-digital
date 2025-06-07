import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "your_secret";

export interface JwtPayload {
    userId: string;
    username: string;
    role: string;
}

// Generate JWT token (access token)
export const generateAccessToken = (payload: JwtPayload): string =>
    jwt.sign(payload, jwtSecret, { expiresIn: "15m" });

// Generate refresh token
export const generateRefreshToken = (payload: JwtPayload): string =>
    jwt.sign(payload, jwtSecret, { expiresIn: "30m" });

// Verify JWT token
export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, jwtSecret) as JwtPayload;
};

