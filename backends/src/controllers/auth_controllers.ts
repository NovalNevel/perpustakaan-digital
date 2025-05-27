import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const jwtSecret = process.env.Access_Token || "your_secret";


// Register user baru
export const register = async (req: Request, res: Response) => {
    const { username, email, password, faculty, studyProgram, nim } = req.body;

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
                faculty,
                studyProgram,
                nim,
            },
        });

        res.status(201).json({ message: "User registered successfully", user: { id: user.id, username: user.username, email: user.email } });
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

        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role},
            jwtSecret,
            { expiresIn: "1d" }
        );

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};
