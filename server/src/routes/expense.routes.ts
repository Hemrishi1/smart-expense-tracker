import express from 'express';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../controllers/expense.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(protect, getExpenses)
  .post(protect, createExpense); // Note: file upload middleware to be added later

router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

export default router;
