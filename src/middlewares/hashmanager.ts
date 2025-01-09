import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import logger from '../utils/logger'; // Certifique-se de importar seu logger corretamente

dotenv.config();

const costString = process.env.BCRYPT_COST;
if (!costString || isNaN(Number(costString))) {
    logger.error('BCRYPT_COST precisa ser um número inteiro positivo no arquivo .env');
    throw new Error('BCRYPT_COST precisa ser um número inteiro positivo no arquivo .env'); // Lança um erro na inicialização
}

export class HashManager {
    private readonly cost: number;

    constructor() {
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
            logger.error('Erro ao comparar hash:', error);
            return false; // Ou lance um erro específico
        }
    }
}
