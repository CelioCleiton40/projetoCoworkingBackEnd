import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { setupSwagger } from './swagger';
import logger from './utils/logger'; // Importa o logger

const PORT = process.env.PORT || 3333;

async function startServer() { // Função assíncrona para lidar com erros
    try {
        // Configura a documentação Swagger
        await setupSwagger(app); // Aguarda a configuração do Swagger

        // Inicia o servidor
        app.listen(PORT, () => {
            logger.info(`Servidor iniciado na porta ${PORT}`); // Log mais informativo
            logger.info(`Documentação da API disponível em http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        const err = error as Error;
        logger.error(`Erro ao iniciar o servidor: ${err.message}`, err); // Log de erro detalhado
        process.exit(1); // Encerra o processo com código de erro
    }
}

startServer(); // Chama a função para iniciar o servidor