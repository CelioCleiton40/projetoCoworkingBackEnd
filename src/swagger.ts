import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import logger from './utils/logger'; // Importa o logger

export const setupSwagger = async (app: Application): Promise<void> => {
    try {
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'BackEnd Documentation',
                    version: '1.0.0',
                    description: 'Documentação da API do seu projeto',
                },
                servers: [
                    {
                        url: `http://localhost:${process.env.PORT || 3000}`, // Use variável de ambiente ou valor padrão
                    },
                ],
            },
            apis: ['./src/routes/*.ts', './src/models/*.ts'],
        };

        const swaggerSpec = swaggerJSDoc(options);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        logger.info('Documentação Swagger configurada com sucesso.');
    } catch (error) {
        logger.error('Erro ao configurar o Swagger:', error);
        throw error; // Re-lança o erro para ser tratado no server.ts
    }
};