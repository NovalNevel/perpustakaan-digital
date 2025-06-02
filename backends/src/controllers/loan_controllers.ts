import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/auth';

// Peminjaman Buku
export const borrowBook = async (req: Request, res: Response): Promise<void> => {
    const { bookId, userId } = req.body;

    try {
        if (!bookId || !userId) {
            res.status(400).json({ message: "Book ID and User ID are required" });
            return;
        }
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            res.status(404).json({ message: "Buku tidak ditemukan" });
            return;
        }
        const existingLoan = await prisma.bookLoan.findFirst({
            where: {
                bookId: bookId,
                returnedDate: null,
            },
        });
        if (existingLoan) {
            res.status(400).json({ message: "Buku sudah dipinjam dan belum dikembalikan" });
            return;
        }
        const loan = await prisma.bookLoan.create({
            data: {
                borrowedDate: new Date(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Tenggat dalam waktu 7 hari
                userId: parseInt(userId, 10),
                bookId,
            },
        });
        await prisma.book.update({
            where: { id: bookId },
            data: { available: false },
        });
        res.status(201).json({ message: "Buku berhasil dipinjam", loan });
    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(500).json({ message: "Gagal meminjam buku", error: error });
    }
};

// Pengembalian Buku
export const returnBook = async (req: Request, res: Response): Promise<void> => {
    const { loanId } = req.body;

    try {
        if (!loanId) {
            res.status(400).json({ message: "Loan ID is required" });
            return;
        }
        const loan = await prisma.bookLoan.findUnique({ where: { id: loanId } });
        if (!loan) {
            res.status(404).json({ message: "Peminjaman tidak ditemukan" });
            return;
        }
        if (loan.returnedDate) {
            res.status(400).json({ message: "Buku sudah dikembalikan" });
            return;
        }
        const updatedLoan = await prisma.bookLoan.update({
            where: { id: loanId },
            data: {
                returnedDate: new Date(),
                status: 'RETURNED',
            },
        });
        await prisma.book.update({
            where: { id: loan.bookId },
            data: { available: true },
        });
        res.status(200).json({ message: "Buku berhasil dikembalikan", updatedLoan });
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ message: "Gagal mengembalikan buku", error: error });
    }
};

// Mengambil data peminjaman buku dari user
export const getUserLoans = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role === 'ADMIN') {
            const loans = await prisma.bookLoan.findMany({
                include: { book: true },
                orderBy: { borrowedDate: 'desc' },
            });
            res.json(loans);
            return;
        } else {
            const userId = req.user?.userId;
            const loans = await prisma.bookLoan.findMany({
                where: { userId: Number(userId) },
                include: { book: true },
                orderBy: { borrowedDate: 'desc' },
            });
            res.json(loans);
            return;
        }
    } catch (error) {
        console.error('Error fetching user loans:', error);
        res.status(500).json({ message: "Gagal mengambil data peminjaman", error: error });
    }
};

