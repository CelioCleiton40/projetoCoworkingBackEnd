import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import Joi from 'joi';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - customerName
 *         - roomNumber
 *         - checkInDate
 *         - checkOutDate
 *       properties:
 *         id:
 *           type: integer
 *           description: ID da reserva
 *         customerName:
 *           type: string
 *           description: Nome do cliente
 *         roomNumber:
 *           type: integer
 *           description: Número do quarto
 *         checkInDate:
 *           type: string
 *           format: date
 *           description: Data de check-in
 *         checkOutDate:
 *           type: string
 *           format: date
 *           description: Data de check-out
 *       example:
 *         id: 1
 *         customerName: João Silva
 *         roomNumber: 101
 *         checkInDate: 2025-01-01
 *         checkOutDate: 2025-01-05
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Cria uma nova reserva
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Reserva criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Erro de validação
 */
router.post(
  '/bookings',
  authenticateToken,
  authorizeRoles(['admin', 'receptionist']),
  validate({
    body: Joi.object({
      customerName: Joi.string().min(3).max(50).required(),
      roomNumber: Joi.number().integer().required(),
      checkInDate: Joi.date().required(),
      checkOutDate: Joi.date().required(),
    }),
  }),
  (req, res) => {
    // Lógica para criar uma nova reserva
    res.json({ message: 'Reserva criada com sucesso', booking: req.body });
  }
);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Obtém uma reserva pelo ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Reserva não encontrada
 */
router.get('/bookings/:id', authenticateToken, (req, res) => {
  // Lógica para obter uma reserva pelo ID
  const bookingId = req.params.id;
  res.json({ message: `Reserva com ID ${bookingId} encontrada` });
});

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Atualiza uma reserva pelo ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Reserva atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Reserva não encontrada
 */
router.put(
  '/bookings/:id',
  authenticateToken,
  authorizeRoles(['admin', 'receptionist']),
  validate({
    body: Joi.object({
      customerName: Joi.string().min(3).max(50).optional(),
      roomNumber: Joi.number().integer().optional(),
      checkInDate: Joi.date().optional(),
      checkOutDate: Joi.date().optional(),
    }),
  }),
  (req, res) => {
    // Lógica para atualizar uma reserva pelo ID
    const bookingId = req.params.id;
    res.json({ message: `Reserva com ID ${bookingId} atualizada com sucesso` });
  }
);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Deleta uma reserva pelo ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Reserva deletada com sucesso
 *       404:
 *         description: Reserva não encontrada
 */
router.delete('/bookings/:id', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  // Lógica para deletar uma reserva pelo ID
  const bookingId = req.params.id;
  res.json({ message: `Reserva com ID ${bookingId} deletada com sucesso` });
});

export default router;
