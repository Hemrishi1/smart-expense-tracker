import express from 'express';
import { getDashboardSummary } from '../controllers/analytics.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/dashboard', protect, getDashboardSummary);

export default router;
