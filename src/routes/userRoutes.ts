import { Router, Request, Response, NextFunction } from "express";
import Joi from "joi";
import { authenticateToken, authorizeAdmin } from "../middlewares/auth";
import { validate } from "../middlewares/validation";
import { UserService } from "../services/UserService";
import { UserDatabase } from "../config/UserDataBase";
import { IdGenerator } from "../middlewares/IdGenerator";
import { TokenManager } from "../middlewares/TokenManager";
import { HashManager } from "../middlewares/hashmanager";
import { SignUpDTO } from "../dtos/userDTO";
import { NotFoundError } from "../err/NotFoundError";
import logger from "../utils/logger";

const router = Router();

const userDatabase = new UserDatabase();
const idGenerator = new IdGenerator();
const tokenManager = new TokenManager();
const hashManager = new HashManager();

const userService = new UserService(
  userDatabase,
  idGenerator,
  tokenManager,
  hashManager
);

const idSchema = Joi.number().integer().positive().required();

// Validação para criar usuário
router.post(
  "/users",
  validate({
    body: Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      phone: Joi.string().allow("").optional(),
      document_type: Joi.string().valid("CPF", "CNPJ").required(),
      document_number: Joi.string().required(),
      is_admin: Joi.boolean().optional(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: SignUpDTO = req.body;

      // Verificação de duplicidade de e-mail
      const existingUser = await userService.getUserByEmail(input.email);
      if (existingUser) {
        logger.warn(`Email já cadastrado: ${input.email}`);
        res.status(400).json({
          message: "Este e-mail já está em uso. Tente outro e-mail.",
        });
        return;
      }

      // Hash da senha antes de salvar
      const hashedPassword = await hashManager.hash(input.password);
      input.password = hashedPassword;

      logger.info("Iniciando cadastro de usuário.");
      const newUser = await userService.signUp(input);
      logger.info(`Usuário criado com ID: ${newUser.message}`);

      res.status(201).header("Location", `/users/${newUser.message}`).json({
        message: "Usuário cadastrado com sucesso!",
        userId: newUser.message,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Erro ao cadastrar usuário: ${error.message}`, error);
        next(error);
      } else {
        logger.error("Erro desconhecido ao cadastrar usuário");
        next(new Error("Erro desconhecido ao cadastrar usuário"));
      }
    }
  }
);
// Rota de buscar usuário por ID
router.get(
  "/users/:id",
  authenticateToken,
  authorizeAdmin,
  validate({ params: Joi.object({ id: idSchema }) }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      logger.info(`Buscando usuário com ID: ${id}`);

      const user = await userService.getUserById(id);
      if (!user) {
        logger.warn(`Usuário com ID ${id} não encontrado.`);
        throw new NotFoundError("Usuário não encontrado.");
      }

      // Evitar expor senha ou dados sensíveis
      const { password_hash, ...userWithoutPassword } = user;
      logger.info(`Usuário com ID ${id} encontrado.`);
      res.status(200).json({
        message: "Usuário encontrado com sucesso",
        user: userWithoutPassword,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Erro ao buscar usuário: ${error.message}`, error);
      } else {
        logger.error("Erro desconhecido ao buscar usuário");
      }
      next(error);
    }
  }
);
// Rota de atualizar usuário
router.put(
  "/users/:id",
  authenticateToken,
  authorizeAdmin,
  validate({
    params: Joi.object({ id: idSchema }),
    body: Joi.object({
      name: Joi.string().min(3).max(30).optional().allow(""),
      email: Joi.string().email().optional().allow(""),
      password: Joi.string().min(6).optional().allow(""),
      phone: Joi.string().optional().allow(""),
      document_type: Joi.string().valid("CPF", "CNPJ").optional().allow(""),
      document_number: Joi.string().optional().allow(""),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const input = req.body;

      // Se a senha foi fornecida, deve ser rehashada
      if (input.password) {
        input.password = await hashManager.hash(input.password);
      }

      logger.info(`Atualizando usuário com ID: ${id}`);
      const updatedUser = await userService.updateUser(id, input);

      // Evitar expor senha
      const { password_hash, ...updatedUserWithoutPassword } = updatedUser;
      logger.info(`Usuário com ID ${id} atualizado.`);
      res.json(updatedUserWithoutPassword);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Erro ao atualizar usuário: ${error.message}`, error);
      } else {
        logger.error("Erro desconhecido ao atualizar usuário");
      }
      next(error);
    }
  }
);
// Rota de deletar usuário
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeAdmin,
  validate({ params: Joi.object({ id: idSchema }) }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

      // Verificar se é possível deletar o usuário (por exemplo, evitar deletar admin)
      const user = await userService.getUserById(id);
      if (user?.is_admin) {
        res.status(403).json({
          message: "Você não pode deletar um usuário admin.",
        });
        return;
      }

      logger.info(`Deletando usuário com ID: ${id}`);
      await userService.deleteUserById(id);
      logger.info(`Usuário com ID ${id} deletado.`);

      res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Erro ao deletar usuário: ${error.message}`, error);
      } else {
        logger.error("Erro desconhecido ao deletar usuário");
      }
      next(error);
    }
  }
  
);

// ... (Swagger documentation)
  /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       required:
   *         - name
   *         - email
   *         - password
   *         - document_type
   *         - document_number
   *       properties:
   *         id:
   *           type: integer
   *           description: ID do usuário
   *         name:
   *           type: string
   *           description: Nome do usuário
   *         email:
   *           type: string
   *           format: email
   *           description: Email do usuário
   *         password:
   *           type: string
   *           description: Senha do usuário (não retornada nas respostas, apenas no request de criação)
   *         phone:
   *           type: string
   *           description: Telefone do usuário
   *         document_type:
   *           type: string
   *           enum: [CPF, CNPJ]
   *           description: Tipo de documento (CPF ou CNPJ)
   *         document_number:
   *           type: string
   *           description: Número do documento
   *         is_admin:
   *           type: boolean
   *           description: Indica se o usuário é administrador
   *         created_at:
   *           type: string
   *           format: date-time
   *           description: Data de criação do usuário
   *         updated_at:
   *           type: string
   *           format: date-time
   *           description: Data da última atualização do usuário
   *       example:
   *         id: 1
   *         name: João da Silva
   *         email: joao@example.com
   *         phone: 11999999999
   *         document_type: CPF
   *         document_number: 123.456.789-00
   *         is_admin: false
   *         created_at: '2024-10-27T10:00:00Z'
   *         updated_at: '2024-10-27T10:00:00Z'
   */

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Cria um novo usuário
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Erro de validação
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erros de validação encontrados."
   *                 errors:
   *                   type: object
   *                   example: { body: [{message: '"name" is required'}] }
   *       500:
   *          description: Erro interno do servidor
   */

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Cria um novo usuário
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Erro de validação
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erros de validação encontrados."
   *                 errors:
   *                   type: object
   *                   example: { body: [{message: '"name" is required'}] }
   *       500:
   *          description: Erro interno do servidor
   */

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Obtém um usuário pelo ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID do usuário
   *     responses:
   *       200:
   *         description: Usuário encontrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *          description: Não autorizado
   *       403:
   *          description: Acesso Proibido
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *          description: Erro interno do servidor
   */

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Atualiza um usuário pelo ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID do usuário
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: Usuário atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Erro de validação
   *       401:
   *          description: Não autorizado
   *       403:
   *          description: Acesso Proibido
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *          description: Erro interno do servidor
   */

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Deleta um usuário pelo ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID do usuário
   *     responses:
   *       204:
   *         description: Usuário deletado com sucesso (No Content)
   *       401:
   *          description: Não autorizado
   *       403:
   *          description: Acesso Proibido
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *          description: Erro interno do servidor
   */
export default router;
