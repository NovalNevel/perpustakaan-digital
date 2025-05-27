import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getBooks = async (_req: Request, res: Response) => {
    const books = await prisma.book.findMany({ include: { category: true } });
    res.json(books);
};

export const createBook = async (req: Request, res: Response) => {
    const { title, author, shelf, categoryId, location } = req.body;
    const imageUrl = req.file?.path;

    const book = await prisma.book.create({
        data: {
            title,
            author,
            shelf,
            location,
            categoryId: Number(categoryId),
            imageUrl,
        },
    });

    res.status(201).json(book);
};

export const updateBook = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, author, shelf, categoryId, location } = req.body;
    const imageUrl = req.file?.path;

    const book = await prisma.book.update({
        where: { id },
        data: {
            title,
            author,
            shelf,
            location,
            categoryId: Number(categoryId),
            ...(imageUrl && { imageUrl }),
        },
    });
    res.json(book);
};

export const deleteBook = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.book.delete({ where: { id } });
    res.json({ message: 'Buku berhasil dihapus' });
};