import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import Joi from 'joi';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do serviço
 *         name:
 *           type: string
 *           description: Nome do serviço
 *         description:
 *           type: string
 *           description: Descrição do serviço
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do serviço
 *         duration_minutes:
 *           type: integer
 *           description: Duração do serviço em minutos
 *         available:
 *           type: integer
 *           description: Disponibilidade do serviço
 *       example:
 *         id: 1
 *         name: Serviço de Limpeza
 *         description: Limpeza completa do espaço
 *         price: 100.00
 *         duration_minutes: 60
 *         available: 1
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Cria um novo serviço
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Serviço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Erro de validação
 */
router.post(
  '/services',
  authenticateToken,
  authorizeRoles(['admin']),
  validate({
    body: Joi.object({
      name: Joi.string().min(3).max(50).required(),
      description: Joi.string().optional(),
      price: Joi.number().precision(2).min(0).required(),
      duration_minutes: Joi.number().integer().min(0).optional(),
      available: Joi.number().integer().valid(0, 1).default(1),
    }),
  }),
  (req, res) => {
    // Lógica para criar um novo serviço
    res.json({ message: 'Serviço criado com sucesso', service: req.body });
  }
);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Obtém um serviço pelo ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do serviço
 *     responses:
 *       200:
 *         description: Serviço encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Serviço não encontrado
 */
router.get('/services/:id', authenticateToken, (req, res) => {
  // Lógica para obter um serviço pelo ID
  const serviceId = req.params.id;
  res.json({ message: `Serviço com ID ${serviceId} encontrado` });
});

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Atualiza um serviço pelo ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do serviço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Serviço não encontrado
 */
router.put(
  '/services/:id',
  authenticateToken,
  authorizeRoles(['admin']),
  validate({
    body: Joi.object({
      name: Joi.string().min(3).max(50).optional(),
      description: Joi.string().optional(),
      price: Joi.number().precision(2).min(0).optional(),
      duration_minutes: Joi.number().integer().min(0).optional(),
      available: Joi.number().integer().valid(0, 1).optional(),
    }),
  }),
  (req, res) => {
    // Lógica para atualizar um serviço pelo ID
    const serviceId = req.params.id;
    res.json({ message: `Serviço com ID ${serviceId} atualizado com sucesso` });
  }
);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Deleta um serviço pelo ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do serviço
 *     responses:
 *       200:
 *         description: Serviço deletado com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
router.delete('/services/:id', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  // Lógica para deletar um serviço pelo ID
  const serviceId = req.params.id;
  res.json({ message: `Serviço com ID ${serviceId} deletado com sucesso` });
});

export default router;
