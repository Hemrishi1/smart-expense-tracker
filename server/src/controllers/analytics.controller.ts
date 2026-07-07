import { Request, Response, NextFunction } from 'express';
import Expense from '../models/Expense';
import Income from '../models/Income';
import mongoose from 'mongoose';

// @desc    Get dashboard summary
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user._id;

    // Get current month start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Calculate total income for current month
    const incomeAgg = await Income.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, totalIncome: { $sum: '$amount' } } }
    ]);

    // Calculate total expense for current month
    const expenseAgg = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, totalExpense: { $sum: '$amount' } } }
    ]);

    const totalIncome = incomeAgg.length > 0 ? incomeAgg[0].totalIncome : 0;
    const totalExpense = expenseAgg.length > 0 ? expenseAgg[0].totalExpense : 0;
    const currentBalance = totalIncome - totalExpense;
    
    // Savings percentage
    const savings = totalIncome > 0 ? ((currentBalance / totalIncome) * 100).toFixed(2) : 0;

    // Last 10 transactions (mixed incomes and expenses)
    const recentExpenses = await Expense.find({ user: userId }).sort({ date: -1 }).limit(10).lean();
    const recentIncomes = await Income.find({ user: userId }).sort({ date: -1 }).limit(10).lean();
    
    let allTransactions = [
      ...recentExpenses.map(e => ({ ...e, type: 'expense' })),
      ...recentIncomes.map(i => ({ ...i, type: 'income' }))
    ];
    
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastTransactions = allTransactions.slice(0, 10);

    // Expenses by category
    const expensesByCategory = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalIncome,
      totalExpense,
      currentBalance,
      savings,
      expensesByCategory,
      lastTransactions
    });
  } catch (error) {
    next(error);
  }
};
