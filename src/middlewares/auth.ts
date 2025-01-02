import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = 'sua_chave_secreta';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  return new Promise<void>((resolve) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Token não fornecido' });
      return resolve();
    }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        res.status(403).json({ message: 'Token inválido' });
        return resolve();
      }

      req.user = user;
      next();
      resolve();
    });
  });
};

export const authorizeRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (!roles.includes(req.user?.role)) {
        res.status(403).json({ message: 'Acesso negado: Permissão insuficiente' });
        return resolve();
      }

      next();
      resolve();
    });
  };
};
