"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const categories_1 = __importDefault(require("./routes/categories"));
const cart_1 = __importDefault(require("./routes/cart"));
const orders_1 = __importDefault(require("./routes/orders"));
const wishlist_1 = __importDefault(require("./routes/wishlist"));
const admin_1 = __importDefault(require("./routes/admin"));
const payments_1 = __importDefault(require("./routes/payments"));
// MoMo routes removed - using simplified payment methods
const errorHandler_1 = require("./middleware/errorHandler");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Log environment variables for debugging
console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_PORT:', process.env.DB_PORT);
console.log('- DB_NAME:', process.env.DB_NAME);
console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
// Initialize Prisma with error handling
let prisma;
try {
    prisma = new client_1.PrismaClient();
    console.log('Prisma client initialized successfully');
}
catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    process.exit(1);
}
// Test database connection
async function testDatabaseConnection() {
    try {
        await prisma.$connect();
        console.log('Database connection successful');
    }
    catch (error) {
        console.error('Database connection failed:', error);
        // Don't exit, let the app start but log the error
    }
}
// Swagger configuration
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
    apis: ['./src/routes/*.ts'], // Path to the API routes
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'https://online-shopping-by-diane.vercel.app',
        'https://akazuba-florist.vercel.app',
        process.env.FRONTEND_URL
    ].filter((url) => Boolean(url)),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));
app.use((0, compression_1.default)());
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files for uploaded payment proofs
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Swagger documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Akazuba Florist API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: 'connected', // We'll update this based on actual connection status
    });
});
// API Routes
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/products', products_1.default);
app.use('/api/v1/categories', categories_1.default);
app.use('/api/v1/cart', cart_1.default);
app.use('/api/v1/orders', orders_1.default);
app.use('/api/v1/wishlist', wishlist_1.default);
app.use('/api/v1/admin', admin_1.default);
app.use('/api/v1/payments', payments_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Start server with error handling
async function startServer() {
    try {
        // Test database connection
        await testDatabaseConnection();
        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
            console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});
// Start the server
startServer();
