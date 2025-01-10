import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TokenPayload } from '../types';
import logger from '../utils/logger'; // Certifique-se de importar seu logger

dotenv.config();

export class TokenManager {
    private jwtKey: string;
    private jwtExpiresIn: string;

    constructor() {
        this.jwtKey = process.env.JWT_KEY as string;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN as string;

        if (!this.jwtKey) {
            throw new Error('JWT_KEY não definida no arquivo .env');
        }

        if (!this.jwtExpiresIn) {
            throw new Error('JWT_EXPIRES_IN não definida no arquivo .env');
        }
    }

    public createToken(payload: TokenPayload): string {
        try {
            const token = jwt.sign(payload, this.jwtKey, {
                expiresIn: this.jwtExpiresIn,
            });
            return token;
        } catch (error) {
            logger.error('Erro ao criar o token JWT:', error);
            throw new Error('Erro ao criar o token JWT');
        }
    }

    public getPayload(token: string): TokenPayload | null {
        try {
            const payload = jwt.verify(token, this.jwtKey) as TokenPayload;
            return payload;
        } catch (error) {
            logger.warn('Erro ao verificar o token JWT:', error);
            return null; // Retorna null em caso de erro, mas loga a falha
        }
    }
}
