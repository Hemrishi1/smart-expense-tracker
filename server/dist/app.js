"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const income_routes_1 = __importDefault(require("./routes/income.routes"));
const budget_routes_1 = __importDefault(require("./routes/budget.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const insights_routes_1 = __importDefault(require("./routes/insights.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
// Security headers
app.use((0, helmet_1.default)());
// Logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Basic Route for health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running' });
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/expenses', expense_routes_1.default);
app.use('/api/income', income_routes_1.default);
app.use('/api/budgets', budget_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/insights', insights_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
// Error Handling Middleware
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
exports.default = app;
