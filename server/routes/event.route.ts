import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuthMiddleware, EventController.getEvents);
router.get('/:id', EventController.getEventById);
router.post('/', authMiddleware, EventController.createEvent);
router.put('/:id', authMiddleware, EventController.updateEvent);
router.delete('/:id', authMiddleware, EventController.deleteEvent);

router.post('/:id/distribute-certificates', authMiddleware, EventController.distributeCertificates);

export default router;
