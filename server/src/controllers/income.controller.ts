import { Request, Response, NextFunction } from 'express';
import Income from '../models/Income';

// @desc    Get all incomes for user
// @route   GET /api/income
// @access  Private
export const getIncomes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const incomes = await Income.find({ user: (req as any).user._id }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new income
// @route   POST /api/income
// @access  Private
export const createIncome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { source, amount, date, description } = req.body;

    const income = await Income.create({
      user: (req as any).user._id,
      source,
      amount,
      date: date || Date.now(),
      description,
    });

    res.status(201).json(income);
  } catch (error) {
    next(error);
  }
};

// @desc    Update income
// @route   PUT /api/income/:id
// @access  Private
export const updateIncome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      res.status(404);
      throw new Error('Income not found');
    }

    // Check for user
    if (income.user.toString() !== (req as any).user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedIncome);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
export const deleteIncome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      res.status(404);
      throw new Error('Income not found');
    }

    // Check for user
    if (income.user.toString() !== (req as any).user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await income.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Income deleted' });
  } catch (error) {
    next(error);
  }
};
