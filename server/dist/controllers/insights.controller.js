"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsights = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
// @desc    Get AI spending insights (mock implementation based on aggregates)
// @route   GET /api/insights
// @access  Private
const getInsights = async (req, res, next) => {
    try {
        const userId = req.user._id;
        // Get current and previous month start and end dates
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const currentMonthExpenses = await Expense_1.default.aggregate([
            { $match: { user: userId, date: { $gte: startOfCurrentMonth } } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } }
        ]);
        const previousMonthExpenses = await Expense_1.default.aggregate([
            { $match: { user: userId, date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth } } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } }
        ]);
        let insights = [];
        // Simple rule-based ML generation
        currentMonthExpenses.forEach(current => {
            const previous = previousMonthExpenses.find(p => p._id === current._id);
            if (previous) {
                if (current.total > previous.total) {
                    const increasePercentage = (((current.total - previous.total) / previous.total) * 100).toFixed(0);
                    insights.push(`You spent ${increasePercentage}% more on ${current._id} this month compared to last month.`);
                }
                else if (current.total < previous.total) {
                    const saving = (previous.total - current.total).toFixed(2);
                    insights.push(`Great job! You saved ${saving} on ${current._id} compared to last month.`);
                }
            }
        });
        if (insights.length === 0) {
            insights.push('Not enough data to generate insights yet. Keep tracking your expenses!');
        }
        res.json({ insights });
    }
    catch (error) {
        next(error);
    }
};
exports.getInsights = getInsights;
