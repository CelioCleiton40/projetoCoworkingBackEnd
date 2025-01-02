import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

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
        url: 'http://localhost:3000', // URL do servidor da API
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Caminho para os arquivos de rota e modelos
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
