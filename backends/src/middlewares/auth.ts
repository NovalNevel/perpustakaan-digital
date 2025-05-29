import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.Access_Token || 'your_secret';

export interface AuthRequest extends Request {
    user?: any;
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token tidak ditemukan' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        res.status(403).json({ message: 'Token tidak valid' });
        return;
    }
}

export function isAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ message: 'Hanya admin yang diizinkan' });
        return;
    }
    return next();
}

