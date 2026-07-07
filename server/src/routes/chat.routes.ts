import { Router } from 'express';
import { chatWithAI } from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/', protect, chatWithAI);

export default router;
