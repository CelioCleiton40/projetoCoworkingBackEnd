# Projeto Coworking BackEnd

## Descrição
Este projeto é o backend para um sistema de gerenciamento de espaços de coworking. Ele permite a administração de usuários, reservas, espaços, produtos e serviços, utilizando um banco de dados SQLite.

## Funcionalidades
- Gerenciamento de Usuários
- Gerenciamento de Espaços
- Gerenciamento de Produtos
- Gerenciamento de Serviços
- Gerenciamento de Reservas

## Estrutura do Projeto
```plaintext
projetoCoworkingBackEnd/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── swagger.ts
│   └── app.ts
├── database.sqlite
├── package.json
└── README.md
Instalação
Para configurar e rodar o projeto localmente, siga os passos abaixo:

Clone o repositório:

git clone https://github.com/seu-usuario/projetoCoworkingBackEnd.git
cd projetoCoworkingBackEnd
Instale as dependências:


npm install
Execute a aplicação:


npm start
Endpoints da API
Aqui estão alguns dos principais endpoints da API:

Usuários
POST /api/users: Cria um novo usuário

GET /api/users/:id: Obtém um usuário pelo ID

PUT /api/users/:id: Atualiza um usuário pelo ID

DELETE /api/users/:id: Deleta um usuário pelo ID

Espaços
POST /api/spaces: Cria um novo espaço

GET /api/spaces/:id: Obtém um espaço pelo ID

PUT /api/spaces/:id: Atualiza um espaço pelo ID

DELETE /api/spaces/:id: Deleta um espaço pelo ID

Produtos
POST /api/products: Cria um novo produto

GET /api/products/:id: Obtém um produto pelo ID

PUT /api/products/:id: Atualiza um produto pelo ID

DELETE /api/products/:id: Deleta um produto pelo ID

Serviços
POST /api/services: Cria um novo serviço

GET /api/services/:id: Obtém um serviço pelo ID

PUT /api/services/:id: Atualiza um serviço pelo ID

DELETE /api/services/:id: Deleta um serviço pelo ID

Reservas
POST /api/bookings: Cria uma nova reserva

GET /api/bookings/:id: Obtém uma reserva pelo ID

PUT /api/bookings/:id: Atualiza uma reserva pelo ID

DELETE /api/bookings/:id: Deleta uma reserva pelo ID

Documentação da API
A documentação interativa da API está disponível no Swagger em:

http://localhost:3000/api-docs
Tecnologias Utilizadas
Node.js

Express

TypeScript

SQLite

Swagger

Contribuição
Se você deseja contribuir com o projeto, siga os passos abaixo:

Fork o projeto

Crie uma branch para sua feature (git checkout -b feature/nova-feature)

Commite suas alterações (git commit -am 'Adiciona nova feature')

Faça o push para a branch (git push origin feature/nova-feature)

Crie um novo Pull Request

Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Contato
Para mais informações ou dúvidas, entre em contato pelo email: cleitonfreelance@gmail.com