import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { setupSwagger } from './swagger';
import logger from './utils/logger'; // Importa o logger

const PORT = process.env.PORT || 3333;

async function startServer() {
    try {
        // Verificação para garantir que a variável PORT esteja configurada corretamente
        if (!process.env.PORT) {
            throw new Error("A variável de ambiente PORT não está definida.");
        }

        // Configura a documentação Swagger
        await setupSwagger(app); // Aguarda a configuração do Swagger

        // Inicia o servidor
        app.listen(PORT, () => {
            logger.info(`Servidor iniciado na porta ${PORT}`);
            logger.info(`Documentação da API disponível em http://localhost:${PORT}/api-docs`);
        });
    } catch (error: any) {
        // Tipagem explícita para garantir que 'error' seja tratado como um objeto Error
        if (error instanceof Error) {
            logger.error(`Erro ao iniciar o servidor: ${error.message}`, { stack: error.stack });
        } else {
            logger.error("Erro desconhecido ao iniciar o servidor.");
        }
        process.exit(1); // Encerra o processo com código de erro
    }
}

startServer(); // Chama a função para iniciar o servidor
