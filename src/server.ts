import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

import app from './app'; // Importa a configuração do app
import { setupSwagger } from './swagger'; // Configurações do Swagger

const PORT = process.env.PORT || 3333;

// Configura a documentação Swagger
setupSwagger(app);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação da API disponível em http://localhost:${PORT}/api-docs`);
});
