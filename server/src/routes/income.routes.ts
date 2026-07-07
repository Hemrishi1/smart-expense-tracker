import express from 'express';
import { getIncomes, createIncome, updateIncome, deleteIncome } from '../controllers/income.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(protect, getIncomes)
  .post(protect, createIncome);

router.route('/:id')
  .put(protect, updateIncome)
  .delete(protect, deleteIncome);

export default router;
