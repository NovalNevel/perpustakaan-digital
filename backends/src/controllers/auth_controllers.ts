import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { generateAccessToken, generateRefreshToken, JwtPayload } from "../utils/jwt";

// Register user baru
export const register = async (req: Request, res: Response) => {
    const { username, email, password, nim, faculty, studyProgram, role = 'USER' } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }, { nim }] },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                nim,
                faculty,
                studyProgram,
                role,
            },
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                nim: user.nim,
                faculty: user.faculty,
                studyProgram: user.studyProgram,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
};

// Login
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ message: "Invalid password" });

        const payload: JwtPayload = {
            userId: user.id.toString(),
            username: user.username,
            role: user.role
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
            }
        });

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                nim: user.nim,
                faculty: user.faculty,
                studyProgram: user.studyProgram,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

    try {
        const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
        if (!storedToken || new Date() > storedToken.expiresAt) {
            return res.status(403).json({ message: "Token tidak valid atau sudah kadaluarsa" });
        }

        const user = await prisma.user.findUnique({
            where: { id: storedToken.userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const payload: JwtPayload = {
            userId: user.id.toString(),
            username: user.username,
            role: user.role,
        };

        const accessToken = generateAccessToken(payload);

        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: "Refresh token gagal", error });
    }
};

// Logout
export const logout = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Token tidak ditemukan" });
    }
    try {
        await prisma.refreshToken.deleteMany({
            where: { token }
        });
        res.json({ message: "Logout berhasil" });
    } catch (error) {
        res.status(500).json({ message: "Logout gagal", error });
    }
};
