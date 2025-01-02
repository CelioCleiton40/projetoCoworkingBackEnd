import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import Joi from 'joi';

const router = Router();

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
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 *       example:
 *         id: 1
 *         name: João da Silva
 *         email: joao@example.com
 *         password: secret
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
 *       200:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro de validação
 */
router.post(
  '/users',
  validate({
    body: Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      phone: Joi.string().optional(),
      document_type: Joi.string().valid('CPF', 'CNPJ').required(),
      document_number: Joi.string().required(),
    }),
  }),
  (req, res) => {
    // Lógica para criar um novo usuário
    res.json({ message: 'Usuário criado com sucesso', user: req.body });
  }
);

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
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/users/:id', authenticateToken, (req, res) => {
  // Lógica para obter um usuário pelo ID
  const userId = req.params.id;
  res.json({ message: `Usuário com ID ${userId} encontrado` });
});

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
 *       404:
 *         description: Usuário não encontrado
 */
router.put(
  '/users/:id',
  authenticateToken,
  validate({
    body: Joi.object({
      name: Joi.string().min(3).max(30).optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).optional(),
      phone: Joi.string().optional(),
      document_type: Joi.string().valid('CPF', 'CNPJ').optional(),
      document_number: Joi.string().optional(),
    }),
  }),
  (req, res) => {
    // Lógica para atualizar um usuário pelo ID
    const userId = req.params.id;
    res.json({ message: `Usuário com ID ${userId} atualizado com sucesso` });
  }
);

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
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/users/:id', authenticateToken, (req, res) => {
  // Lógica para deletar um usuário pelo ID
  const userId = req.params.id;
  res.json({ message: `Usuário com ID ${userId} deletado com sucesso` });
});

export default router;
