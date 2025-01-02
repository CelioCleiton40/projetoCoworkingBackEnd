import express from 'express';
import { setupSwagger } from './swagger'; // caminho para o arquivo swagger.ts
import routes from './routes'; // Certifique-se de que este é o caminho correto para suas rotas

const app = express();
app.use(express.json()); // Middleware para analisar corpos de requisição JSON

setupSwagger(app); // Configurações do Swagger para documentação da API

app.use('/api', routes); // Usa as rotas definidas no arquivo index.ts da pasta routes

const PORT = process.env.PORT || 3000; // Define a porta do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); // Mensagem de confirmação de que o servidor está rodando
  console.log(`Documentação da API disponível em http://localhost:${PORT}/api-docs`); // Link para a documentação da API
});
