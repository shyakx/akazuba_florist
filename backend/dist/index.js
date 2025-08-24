"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const categories_1 = __importDefault(require("./routes/categories"));
const cart_1 = __importDefault(require("./routes/cart"));
const orders_1 = __importDefault(require("./routes/orders"));
const admin_1 = __importDefault(require("./routes/admin"));
const payments_1 = __importDefault(require("./routes/payments"));
const momo_1 = __importDefault(require("./routes/momo"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 5000;
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Akazuba Florist API',
            version: '1.0.0',
            description: 'API documentation for Akazuba Florist e-commerce platform',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        process.env.FRONTEND_URL
    ].filter((url) => Boolean(url)),
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Akazuba Florist API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/products', products_1.default);
app.use('/api/v1/categories', categories_1.default);
app.use('/api/v1/cart', cart_1.default);
app.use('/api/v1/orders', orders_1.default);
app.use('/api/v1/admin', admin_1.default);
app.use('/api/v1/payments', payments_1.default);
app.use('/api/v1/momo', momo_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
    });
});
app.use(errorHandler_1.errorHandler);
process.on('SIGTERM', async () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});
const startServer = async () => {
    try {
        await prisma.$connect();
        logger_1.logger.info('Database connected successfully');
        app.listen(PORT, () => {
            logger_1.logger.info(`🚀 Akazuba Florist API server running on port ${PORT}`);
            logger_1.logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
            logger_1.logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map