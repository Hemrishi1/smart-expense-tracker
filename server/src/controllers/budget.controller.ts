import { Request, Response, NextFunction } from 'express';
import Budget from '../models/Budget';

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month, year } = req.query;
    
    let query: any = { user: (req as any).user._id };
    
    if (month && year) {
      query.month = Number(month);
      query.year = Number(year);
    }
    
    const budgets = await Budget.find(query).sort({ createdAt: -1 });
    res.status(200).json(budgets);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, limit, month, year } = req.body;

    // Check if budget already exists for this category, month, and year
    const existingBudget = await Budget.findOne({
      user: (req as any).user._id,
      category,
      month,
      year
    });

    if (existingBudget) {
      res.status(400);
      throw new Error(`Budget already exists for ${category} in ${month}/${year}`);
    }

    const budget = await Budget.create({
      user: (req as any).user._id,
      category,
      limit,
      month,
      year
    });

    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    // Check for user
    if (budget.user.toString() !== (req as any).user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedBudget);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    // Check for user
    if (budget.user.toString() !== (req as any).user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await budget.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Budget deleted' });
  } catch (error) {
    next(error);
  }
};
