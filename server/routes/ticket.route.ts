import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/purchase', optionalAuthMiddleware, TicketController.purchaseTicket);
router.post('/check-duplicate', optionalAuthMiddleware, TicketController.checkDuplicateTicket);
router.get('/user', authMiddleware, TicketController.getUserTickets);
router.get('/organizer', authMiddleware, TicketController.getOrganizerTickets);
router.post('/checkin-qr', authMiddleware, TicketController.checkInTicketByQr);
router.post('/:id/checkin', authMiddleware, TicketController.checkInTicket);
router.get('/invoice/:transactionId', optionalAuthMiddleware, TicketController.downloadInvoice);

export default router;
