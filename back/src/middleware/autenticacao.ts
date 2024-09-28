import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();
const JWT_SECRET = process.env.HASH || "UHSUDHK38DSUHDSKJDUSBCBUUH3";
const base64Secret = Buffer.from(JWT_SECRET).toString('base64');
interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload; 
}

// Middleware para autenticar o token JWT
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

	const cleanToken = token ? token.replace(/"/g, '') : null;
    if (!cleanToken) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

	try {
		jwt.verify(cleanToken, JWT_SECRET)
		next()
	} catch (error) {
		console.error(error);
		res.status(500).json({
			statusCode: 500,
			message: "Token inválido"
		})
	}
};
