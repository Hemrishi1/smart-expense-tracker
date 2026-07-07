"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIncome = exports.updateIncome = exports.createIncome = exports.getIncomes = void 0;
const Income_1 = __importDefault(require("../models/Income"));
// @desc    Get all incomes for user
// @route   GET /api/income
// @access  Private
const getIncomes = async (req, res, next) => {
    try {
        const incomes = await Income_1.default.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json(incomes);
    }
    catch (error) {
        next(error);
    }
};
exports.getIncomes = getIncomes;
// @desc    Create new income
// @route   POST /api/income
// @access  Private
const createIncome = async (req, res, next) => {
    try {
        const { source, amount, date, description } = req.body;
        const income = await Income_1.default.create({
            user: req.user._id,
            source,
            amount,
            date: date || Date.now(),
            description,
        });
        res.status(201).json(income);
    }
    catch (error) {
        next(error);
    }
};
exports.createIncome = createIncome;
// @desc    Update income
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = async (req, res, next) => {
    try {
        let income = await Income_1.default.findById(req.params.id);
        if (!income) {
            res.status(404);
            throw new Error('Income not found');
        }
        // Check for user
        if (income.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }
        const updatedIncome = await Income_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedIncome);
    }
    catch (error) {
        next(error);
    }
};
exports.updateIncome = updateIncome;
// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = async (req, res, next) => {
    try {
        const income = await Income_1.default.findById(req.params.id);
        if (!income) {
            res.status(404);
            throw new Error('Income not found');
        }
        // Check for user
        if (income.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }
        await income.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Income deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteIncome = deleteIncome;
