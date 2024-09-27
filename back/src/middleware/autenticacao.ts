import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = "seuSegredoSuperSecreto";

interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload; 
}

// Middleware para autenticar o token JWT
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido ou expirado" });
        }

        req.user = user;
        next();
    });
};
