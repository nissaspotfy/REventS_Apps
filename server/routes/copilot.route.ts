import { Router } from 'express';
import { CopilotController } from '../controllers/copilot.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', authMiddleware, CopilotController.generateDraft);
router.post('/chat', optionalAuthMiddleware, CopilotController.chat);
router.post('/recommend', authMiddleware, CopilotController.recommend);

export default router;
