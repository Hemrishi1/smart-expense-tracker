"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const income_controller_1 = require("../controllers/income.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/')
    .get(auth_middleware_1.protect, income_controller_1.getIncomes)
    .post(auth_middleware_1.protect, income_controller_1.createIncome);
router.route('/:id')
    .put(auth_middleware_1.protect, income_controller_1.updateIncome)
    .delete(auth_middleware_1.protect, income_controller_1.deleteIncome);
exports.default = router;
