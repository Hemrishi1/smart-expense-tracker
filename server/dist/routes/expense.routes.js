"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expense_controller_1 = require("../controllers/expense.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(auth_middleware_1.protect, expense_controller_1.getExpenses)
    .post(auth_middleware_1.protect, expense_controller_1.createExpense); // Note: file upload middleware to be added later
router.route('/:id')
    .put(auth_middleware_1.protect, expense_controller_1.updateExpense)
    .delete(auth_middleware_1.protect, expense_controller_1.deleteExpense);
exports.default = router;
