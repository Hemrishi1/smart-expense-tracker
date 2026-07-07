"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemStats = exports.deleteUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const Expense_1 = __importDefault(require("../models/Expense"));
const Income_1 = __importDefault(require("../models/Income"));
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete an admin user directly');
        }
        // Optionally delete all associated expenses, incomes, etc.
        await Expense_1.default.deleteMany({ user: user._id });
        await Income_1.default.deleteMany({ user: user._id });
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
// @desc    Get system wide statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res, next) => {
    try {
        const totalUsers = await User_1.default.countDocuments();
        const totalExpensesCount = await Expense_1.default.countDocuments();
        const totalIncomeCount = await Income_1.default.countDocuments();
        const expensesSumAgg = await Expense_1.default.aggregate([
            { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
        ]);
        const totalExpensesSum = expensesSumAgg.length > 0 ? expensesSumAgg[0].totalAmount : 0;
        const incomeSumAgg = await Income_1.default.aggregate([
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
    }
    catch (error) {
        next(error);
    }
};
exports.getSystemStats = getSystemStats;
