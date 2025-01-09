import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import Joi from 'joi';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do produto
 *         name:
 *           type: string
 *           description: Nome do produto
 *         description:
 *           type: string
 *           description: Descrição do produto
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do produto
 *         stock:
 *           type: integer
 *           description: Quantidade em estoque
 *       example:
 *         id: 1
 *         name: Produto A
 *         description: Descrição do Produto A
 *         price: 99.99
 *         stock: 100
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Erro de validação
 */
router.post(
  '/products',
  authenticateToken,
  authorizeRoles(['admin']),
  validate({
    body: Joi.object({
      name: Joi.string().min(3).max(50).required(),
      description: Joi.string().optional(),
      price: Joi.number().precision(2).min(0).required(),
      stock: Joi.number().integer().min(0).required(),
    }),
  }),
  (req, res) => {
    // Lógica para criar um novo produto
    res.json({ message: 'Produto criado com sucesso', product: req.body });
  }
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtém um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/products/:id', authenticateToken, (req, res) => {
  // Lógica para obter um produto pelo ID
  const productId = req.params.id;
  res.json({ message: `Produto com ID ${productId} encontrado` });
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.put(
  '/products/:id',
  authenticateToken,
  authorizeRoles(['admin']),
  validate({
    body: Joi.object({
      name: Joi.string().min(3).max(50).optional(),
      description: Joi.string().optional(),
      price: Joi.number().precision(2).min(0).optional(),
      stock: Joi.number().integer().min(0).optional(),
    }),
  }),
  (req, res) => {
    // Lógica para atualizar um produto pelo ID
    const productId = req.params.id;
    res.json({ message: `Produto com ID ${productId} atualizado com sucesso` });
  }
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deleta um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/products/:id', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  // Lógica para deletar um produto pelo ID
  const productId = req.params.id;
  res.json({ message: `Produto com ID ${productId} deletado com sucesso` });
});

export default router;
