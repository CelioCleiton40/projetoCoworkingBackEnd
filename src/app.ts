import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes'; // Certifique-se de que este é o caminho correto para suas rotas
import logger from './utils/logger'; // Logger para registro de erros

const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Middleware para analisar corpos de requisição JSON
app.use(express.json());

// Middleware global de tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message); // Loga o erro
    res.status(500).json({ message: 'Algo deu errado, tente novamente mais tarde.' });
    next(err); // Propaga o erro para o próximo middleware
});

// Usa as rotas definidas no arquivo routes.ts
app.use('/api', routes);
app.use('/users', routes);

export default app;
