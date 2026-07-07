"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const budget_controller_1 = require("../controllers/budget.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(auth_middleware_1.protect, budget_controller_1.getBudgets)
    .post(auth_middleware_1.protect, budget_controller_1.createBudget);
router.route('/:id')
    .put(auth_middleware_1.protect, budget_controller_1.updateBudget)
    .delete(auth_middleware_1.protect, budget_controller_1.deleteBudget);
exports.default = router;
