import { Request, Response } from "express";
import { prisma } from "../prisma";
import { AuthRequest } from "../middlewares/auth";

// Update user
export const updateUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { username, email, nim, faculty, studyProgram, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) }
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        const duplicateUser = await prisma.user.findFirst({
            where: {
                AND: [
                    { id: { not: parseInt(id, 10) } },
                    {
                        OR: [
                            { email },
                            { username },
                            { nim }
                        ]
                    }
                ]
            }
        });
        if (duplicateUser) {
            return res.status(400).json({
                message: "Email, username, atau NIM sudah digunakan oleh user lain"
            });
        }
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id, 10) },
            data: {
                username,
                email,
                nim,
                faculty,
                studyProgram,
                role,
            },
            select: {
                id: true,
                username: true,
                email: true,
                nim: true,
                faculty: true,
                studyProgram: true,
                role: true,
                createdAt: true
            }
        });
        res.json({
            message: "User berhasil diupdate",
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: "Gagal mengupdate user", error });
    }
};

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) }
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        if (req.user?.userId === id) {
            return res.status(400).json({
                message: "Tidak dapat menghapus akun sendiri"
            });
        }
        const activeLoans = await prisma.bookLoan.findMany({
            where: {
                userId: parseInt(id, 10),
                returnedDate: null
            }
        });
        if (activeLoans.length > 0) {
            return res.status(400).json({
                message: "Tidak dapat menghapus user yang masih memiliki pinjaman aktif"
            });
        }
        await prisma.refreshToken.deleteMany({
            where: { userId: parseInt(id, 10) }
        });

        await prisma.user.delete({
            where: { id: parseInt(id, 10) }
        });
        res.json({ message: "User berhasil dihapus" });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: "Gagal menghapus user", error });
    }
};

// Mengambil semua data user
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                faculty: true,
                studyProgram: true,
                nim: true,
                role: true,
                createdAt: true
            },
            orderBy: { id: 'asc' },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data users", error });
    }
};

// Mengambil data user berdasarkan ID
export const getUserById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) },
            select: {
                id: true,
                username: true,
                email: true,
                nim: true,
                faculty: true,
                studyProgram: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: "Gagal mengambil data user", error });
    }
};

// Mengambil statistik user
export const getUserStatistics = async (req: AuthRequest, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();
        const adminUsers = await prisma.user.count({
            where: { role: 'ADMIN' }
        });
        const regularUsers = await prisma.user.count({
            where: { role: 'USER' }
        });
        const usersWithActiveLoans = await prisma.user.count({
            where: {
                loans: {
                    some: {
                        returnedDate: null
                    }
                }
            }
        });
        res.json({
            totalUsers,
            adminUsers,
            regularUsers,
            usersWithActiveLoans
        });
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        res.status(500).json({ message: "Gagal mengambil statistik user", error });
    }
};

