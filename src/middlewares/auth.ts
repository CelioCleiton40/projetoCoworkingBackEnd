import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';
import { UnauthorizedError, ForbiddenError } from '../err/UnauthorizedError';
import logger from '../utils/logger';

// Interface para adicionar o usuário no request
interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

// Verifica se a chave JWT está configurada corretamente
const jwtKey = process.env.JWT_KEY;
if (!jwtKey) {
    logger.error("JWT_KEY não definida nas variáveis de ambiente.");
    throw new Error('JWT_KEY não definida nas variáveis de ambiente.');
}

// Middleware de autenticação do token
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return next(new UnauthorizedError('Token de autenticação não fornecido.'));
    }

    try {
        const decoded = jwt.verify(token, jwtKey) as TokenPayload; // Decodifica o token
        req.user = decoded; // Armazena os dados decodificados no request
        next(); // Chama o próximo middleware
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        logger.warn(`Token inválido: ${errorMessage}`);
        return next(new UnauthorizedError('Token de autenticação inválido.'));
    }
};

// Middleware de autorização para administradores
export const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new UnauthorizedError('Usuário não autenticado.'));
    }

    if (!req.user.is_admin) {
        return next(new ForbiddenError('Acesso negado: Permissão de administrador necessária.'));
    }

    next();
};

// Middleware de autorização para roles específicas
export const authorizeRoles = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthorizedError('Usuário não autenticado.'));
        }

        // Verifica se o usuário tem o papel adequado ou é admin
        const userHasRequiredRole = req.user.is_admin || roles.some(role => req.user?.roles?.includes(role));

        if (!userHasRequiredRole) {
            return next(new ForbiddenError(`Acesso negado: Permissão para ${roles.join(', ')} necessária.`));
        }

        next();
    };
};
