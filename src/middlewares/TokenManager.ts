import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TokenPayload } from '../types';

dotenv.config();

export class TokenManager {
    private jwtKey: string;
    private jwtExpiresIn: string | undefined;

    constructor() {
        this.jwtKey = process.env.JWT_KEY as string;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN;

        if (!this.jwtKey) {
            throw new Error('JWT_KEY não definida no arquivo .env');
        }
    }

    public createToken(payload: TokenPayload): string {
        const token = jwt.sign(
            payload,
            this.jwtKey,
            {
                expiresIn: this.jwtExpiresIn // Deixa o jwt inferir o tipo
            }
        );
        return token;
    }

    public getPayload(token: string): TokenPayload | null {
        try {
            const payload = jwt.verify(token, this.jwtKey) as TokenPayload;
            return payload;
        } catch (error) {
            return null;
        }
    }
}