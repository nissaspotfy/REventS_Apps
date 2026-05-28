import { Router } from 'express';
import authRoutes from './auth.route';
import eventRoutes from './event.route';
import ticketRoutes from './ticket.route';
import copilotRoutes from './copilot.route';
import uploadRoutes from './upload.route';
import teamRoutes from './team.route';
import swaggerRoutes from './swagger';

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/tickets', ticketRoutes);
router.use('/copilot', copilotRoutes);
router.use('/upload', uploadRoutes);
router.use('/team', teamRoutes);
router.use('/docs', swaggerRoutes);

export default router;
