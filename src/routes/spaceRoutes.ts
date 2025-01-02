import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import Joi from 'joi';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Space:
 *       type: object
 *       required:
 *         - name
 *         - capacity
 *         - hourly_rate
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do espaço
 *         name:
 *           type: string
 *           description: Nome do espaço
 *         capacity:
 *           type: integer
 *           description: Capacidade do espaço
 *         hourly_rate:
 *           type: number
 *           format: float
 *           description: Taxa horária do espaço
 *         description:
 *           type: string
 *           description: Descrição do espaço
 *         amenities:
 *           type: string
 *           description: Comodidades do espaço
 *         status:
 *           type: string
 *           description: Status do espaço
 *       example:
 *         id: 1
 *         name: Sala de Reuniões
 *         capacity: 10
 *         hourly_rate: 50.00
 *         description: Espaço ideal para reuniões empresariais
 *         amenities: Wi-Fi, Projetor, Ar condicionado
 *         status: available
 */

/**
 * @swagger
 * /spaces:
 *   post:
 *     summary: Cria um novo espaço
 *     tags: [Spaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Space'
 *     responses:
 *       200:
 *         description: Espaço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Space'
 *       400:
 *         description: Erro de validação
 */
router.post(
  '/spaces',
  authenticateToken,
  authorizeRole(['admin']),
  validate({
    body: Joi.object({
      name: Joi.string().min(3).max(50).required(),
      capacity: Joi.number().integer().min(1).required(),
      hourly_rate: Joi.number().precision(2).min(0).required(),
      description: Joi.string().optional(),
      amenities: Joi.string().optional(),
      status: Joi.string().valid('available', 'maintenance', 'reserved').default('available'),
    }),
  }),
  (req, res) => {
    // Lógica para criar um novo espaço
    res.json({ message: 'Espaço criado com sucesso', space: req.body });
  }
);

/**
 * @swagger
 * /spaces/{id}:
 *   get:
 *     summary: Obtém um espaço pelo ID
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do espaço
 *     responses:
 *       200:
 *         description: Espaço encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Space'
 *       404:
 *         description: Espaço não encontrado
 */
router.get('/spaces/:id', authenticateToken, (req, res) => {
  // Lógica para obter um espaço pelo ID
  const spaceId = req.params.id;
  res.json({ message: `Espaço com ID ${spaceId} encontrado` });
});

/**
 * @swagger
 * /spaces/{id}:
 *   put:
 *     summary: Atualiza um espaço pelo ID
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do espaço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Space'
 *     responses:
 *       200:
 *         description: Espaço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Space'
 *       404:
 *         description: Espaço não encontrado
 */
router.put(
  '/spaces/:id',
  authenticateToken,
  authorizeRole(['admin']),
  validate({
    body: Joi.object({
      name: Joi.string().min(3).max(50).optional(),
      capacity: Joi.number().integer().min(1).optional(),
      hourly_rate: Joi.number().precision(2).min(0).optional(),
      description: Joi.string().optional(),
      amenities: Joi.string().optional(),
      status: Joi.string().valid('available', 'maintenance', 'reserved').optional(),
    }),
  }),
  (req, res) => {
    // Lógica para atualizar um espaço pelo ID
    const spaceId = req.params.id;
    res.json({ message: `Espaço com ID ${spaceId} atualizado com sucesso` });
  }
);

/**
 * @swagger
 * /spaces/{id}:
 *   delete:
 *     summary: Deleta um espaço pelo ID
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do espaço
 *     responses:
 *       200:
 *         description: Espaço deletado com sucesso
 *       404:
 *         description: Espaço não encontrado
 */
router.delete('/spaces/:id', authenticateToken, authorizeRole(['admin']), (req, res) => {
  // Lógica para deletar um espaço pelo ID
  const spaceId = req.params.id;
  res.json({ message: `Espaço com ID ${spaceId} deletado com sucesso` });
});

export default router;
