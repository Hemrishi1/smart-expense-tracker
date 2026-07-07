import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Expense from '../models/Expense';
import Income from '../models/Income';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete an admin user directly');
    }

    // Optionally delete all associated expenses, incomes, etc.
    await Expense.deleteMany({ user: user._id });
    await Income.deleteMany({ user: user._id });
    
    await user.deleteOne();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system wide statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getSystemStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalExpensesCount = await Expense.countDocuments();
    const totalIncomeCount = await Income.countDocuments();
    
    const expensesSumAgg = await Expense.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const totalExpensesSum = expensesSumAgg.length > 0 ? expensesSumAgg[0].totalAmount : 0;

    const incomeSumAgg = await Income.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const totalIncomeSum = incomeSumAgg.length > 0 ? incomeSumAgg[0].totalAmount : 0;

    res.status(200).json({
      totalUsers,
      totalExpensesCount,
      totalIncomeCount,
      totalExpensesSum,
      totalIncomeSum
    });
  } catch (error) {
    next(error);
  }
};
