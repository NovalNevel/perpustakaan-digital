import { Request, Response, NextFunction } from 'express';
import { verifyToken as verifyJwtToken, JwtPayload } from '../utils/jwt';

interface CustomRequest extends Request {
    headers: {
        authorization?: string;
    };
}

export interface AuthRequest extends CustomRequest {
    user?: JwtPayload;
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token tidak ditemukan' });
        return;
    }
    try {
        const decoded = verifyJwtToken(token);
        req.user = decoded;
        return next();
    } catch (err) {
        res.status(403).json({ message: 'Token tidak valid' });
        return;
    }
}

export function isAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
    if (!req.user) {
        res.status(401).json({ message: 'User tidak terautentikasi' });
        return;
    }

    if (req.user.role !== 'ADMIN') {
        res.status(403).json({ message: 'Hanya admin yang diizinkan' });
        return;
    }
    return next();
}
