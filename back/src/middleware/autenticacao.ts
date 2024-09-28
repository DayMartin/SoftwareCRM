import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = "83JDINBD$#@%SSA";

interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload; 
}

// Middleware para autenticar o token JWT
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

	try {
		jwt.verify(token, JWT_SECRET)
	} catch (error) {
		console.error(error);
		res.status(500).json({
			statusCode: 500,
			message: "Token inválido"
		})
	}
};
