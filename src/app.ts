import express from 'express';
import cors from 'cors';
import routes from './routes'; // Certifique-se de que este é o caminho correto para suas rotas

const app = express();

app.use(cors()); // Middleware para habilitar CORS
app.use(express.json()); // Middleware para analisar corpos de requisição JSON

// Usa as rotas definidas no arquivo index.ts da pasta routes
app.use('/api', routes);
app.use("/users", routes);


export default app;