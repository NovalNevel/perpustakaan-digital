import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getBooks = async (_req: Request, res: Response) => {
    try {
        const books = await prisma.book.findMany({
            include: { category: true }
        });
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books' });
    }
};

export const createBook = async (req: Request, res: Response) => {
    const { title, author, shelf, categoryName, location } = req.body;
    const imageUrl = req.file?.path;

    try {
        let categoryId = null;
        if (categoryName && categoryName.trim() !== '') {
            let category = await prisma.category.findUnique({
                where: { name: categoryName.trim() }
            });
            if (!category) {
                category = await prisma.category.create({
                    data: { name: categoryName.trim() }
                });
                console.log('Created new category:', category);
            }
            categoryId = category.id;
        }
        const book = await prisma.book.create({
            data: {
                title,
                author,
                shelf,
                location,
                categoryId,
                imageUrl,
            },
            include: {
                category: true
            }
        });
        res.status(201).json(book);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: "Gagal menambahkan buku", error: error });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, author, shelf, categoryName, location } = req.body;
    const imageUrl = req.file?.path;

    try {
        let categoryId = null;
        if (categoryName && categoryName.trim() !== '') {
            let category = await prisma.category.findUnique({
                where: { name: categoryName.trim() }
            });
            if (!category) {
                category = await prisma.category.create({
                    data: { name: categoryName.trim() }
                });
            }
            categoryId = category.id;
        }
        const book = await prisma.book.update({
            where: { id },
            data: {
                title,
                author,
                shelf,
                location,
                categoryId,
                ...(imageUrl && { imageUrl }),
            },
            include: {
                category: true
            }
        });
        res.json(book);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: "Gagal mengupdate buku", error: error });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.book.delete({ where: { id } });
        res.json({ message: 'Buku berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: "Gagal menghapus buku", error: error });
    }
};

export const getCategories = async (_req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Gagal mengambil data kategori', error: error });
    }
};
