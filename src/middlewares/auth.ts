import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';
import { UnauthorizedError, ForbiddenError } from '../err/UnauthorizedError'; // Importe o erro correto
import  logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

const jwtKey = process.env.JWT_KEY;
if (!jwtKey) {
    logger.error("JWT_KEY não definida nas variáveis de ambiente.");
    throw new Error('JWT_KEY não definida nas variáveis de ambiente.'); // Lança um erro na inicialização
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return next(new UnauthorizedError('Token de autenticação não fornecido.'));
    }

    try {
        const decoded = jwt.verify(token, jwtKey) as TokenPayload; // Usa a variável jwtKey
        req.user = decoded;
        next();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        logger.warn(`Token inválido: ${errorMessage}`);
        return next(new UnauthorizedError('Token de autenticação inválido.'));
    }
};

export const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new UnauthorizedError('Usuário não autenticado.'));
    }

    if (!req.user.is_admin) {
        return next(new ForbiddenError('Acesso negado: Permissão de administrador necessária.'));
    }

    next();
};

export const authorizeRoles = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthorizedError('Usuário não autenticado.'));
        }

        const userHasRequiredRole = req.user.is_admin || roles.some(role => req.user?.is_admin);

        if (!userHasRequiredRole) {
            return next(new ForbiddenError(`Acesso negado: Permissão para ${roles.join(', ')} necessária.`));
        }

        next();
    };
};