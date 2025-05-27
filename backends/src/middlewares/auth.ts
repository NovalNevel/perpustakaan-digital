import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export interface AuthRequest extends Request {
    user?: any;
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token tidak valid' });
    }
}

export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Hanya admin yang diizinkan' });
    }
    next();
}