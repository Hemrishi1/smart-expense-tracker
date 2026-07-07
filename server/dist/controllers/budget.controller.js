"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudget = exports.updateBudget = exports.createBudget = exports.getBudgets = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
    try {
        const { month, year } = req.query;
        let query = { user: req.user._id };
        if (month && year) {
            query.month = Number(month);
            query.year = Number(year);
        }
        const budgets = await Budget_1.default.find(query).sort({ createdAt: -1 });
        res.status(200).json(budgets);
    }
    catch (error) {
        next(error);
    }
};
exports.getBudgets = getBudgets;
// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res, next) => {
    try {
        const { category, limit, month, year } = req.body;
        // Check if budget already exists for this category, month, and year
        const existingBudget = await Budget_1.default.findOne({
            user: req.user._id,
            category,
            month,
            year
        });
        if (existingBudget) {
            res.status(400);
            throw new Error(`Budget already exists for ${category} in ${month}/${year}`);
        }
        const budget = await Budget_1.default.create({
            user: req.user._id,
            category,
            limit,
            month,
            year
        });
        res.status(201).json(budget);
    }
    catch (error) {
        next(error);
    }
};
exports.createBudget = createBudget;
// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res, next) => {
    try {
        let budget = await Budget_1.default.findById(req.params.id);
        if (!budget) {
            res.status(404);
            throw new Error('Budget not found');
        }
        // Check for user
        if (budget.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }
        const updatedBudget = await Budget_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedBudget);
    }
    catch (error) {
        next(error);
    }
};
exports.updateBudget = updateBudget;
// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
    try {
        const budget = await Budget_1.default.findById(req.params.id);
        if (!budget) {
            res.status(404);
            throw new Error('Budget not found');
        }
        // Check for user
        if (budget.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }
        await budget.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Budget deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBudget = deleteBudget;
