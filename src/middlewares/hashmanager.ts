import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export class HashManager {
    private readonly cost: number;

    constructor() {
        const costString = process.env.BCRYPT_COST;
        if (!costString || isNaN(Number(costString))) {
            throw new Error('BCRYPT_COST precisa ser um número inteiro positivo no arquivo .env');
        }
        this.cost = Number(costString);
    }

    public async hash(plaintext: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.cost);
        const hash = await bcrypt.hash(plaintext, salt);
        return hash;
    }

    public async compare(plaintext: string, hash: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(plaintext, hash);
            return isMatch;
        } catch (error) {
            // Tratar erros de comparação (ex: hash inválido)
            console.error('Erro ao comparar hash:', error);
            return false; // Ou lance um erro específico
        }
    }
}