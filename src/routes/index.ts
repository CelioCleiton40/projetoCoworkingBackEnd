import { Router } from 'express';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';
import spaceRoutes from './spaceRoutes';
import bookingRoutes from './bookingsRoutes';
import serviceRoutes from './serviceRoutes';
import swaggerRoutes from './swagger';

const router = Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/spaces', spaceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/services', serviceRoutes);
router.use('/swagger', swaggerRoutes);

export default router;
