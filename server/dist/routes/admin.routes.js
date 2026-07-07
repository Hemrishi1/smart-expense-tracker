"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Apply protect and admin middleware to all routes in this file
router.use(auth_middleware_1.protect, auth_middleware_1.admin);
router.route('/users').get(admin_controller_1.getAllUsers);
router.route('/users/:id').delete(admin_controller_1.deleteUser);
router.route('/stats').get(admin_controller_1.getSystemStats);
exports.default = router;
