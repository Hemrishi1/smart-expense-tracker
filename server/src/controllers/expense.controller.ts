import { Request, Response, NextFunction } from 'express';
import Expense from '../models/Expense';

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expenses = await Expense.find({ user: (req as any).user._id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, amount, category, date, description, paymentMethod, location, priority, status, tags, isRecurring } = req.body;
    
    // Check if receipt file was uploaded
    let receiptUrl = '';
    if ((req as any).file && (req as any).file.path) {
      receiptUrl = (req as any).file.path; // Cloudinary URL if using multer-storage-cloudinary
    }

    const expense = await Expense.create({
      user: (req as any).user._id,
      title,
      amount,
      category,
      date: date || Date.now(),
      description,
      paymentMethod,
      location,
      receipt: receiptUrl,
      priority,
      status,
      tags,
      isRecurring
    });

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    // Check for user
    if (expense.user.toString() !== (req as any).user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    let updateData = { ...req.body };
    if ((req as any).file && (req as any).file.path) {
      updateData.receipt = (req as any).file.path;
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    // Check for user
    if (expense.user.toString() !== (req as any).user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await expense.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Expense deleted' });
  } catch (error) {
    next(error);
  }
};
