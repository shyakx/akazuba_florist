"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhone = exports.validateEmail = exports.validatePassword = exports.authRateLimit = exports.optionalAuth = exports.requireAdmin = exports.authenticateToken = exports.requireAuth = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
// Verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Access token required' });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Check if user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                isActive: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'User not found or inactive' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.logger.error('Token verification failed:', error);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.verifyToken = verifyToken;
// Require authentication
exports.requireAuth = exports.verifyToken;
// Alias for authenticateToken (used in admin routes)
exports.authenticateToken = exports.verifyToken;
// Require admin role
const requireAdmin = async (req, res, next) => {
    try {
        await (0, exports.verifyToken)(req, res, () => {
            if (req.user && req.user.role === 'ADMIN') {
                next();
            }
            else {
                res.status(403).json({ success: false, message: 'Admin access required' });
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Admin verification failed:', error);
        res.status(403).json({ success: false, message: 'Admin access required' });
    }
};
exports.requireAdmin = requireAdmin;
// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                isActive: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (user && user.isActive) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        // Don't fail on token errors for optional auth
        next();
    }
};
exports.optionalAuth = optionalAuth;
// Rate limiting configuration for auth endpoints
exports.authRateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
};
// Validation utilities
const validatePassword = (password) => {
    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
    }
    return { isValid: true, message: 'Password is strong' };
};
exports.validatePassword = validatePassword;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePhone = (phone) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's a valid Rwandan phone number (10 digits starting with 07 or 25)
    if (cleanPhone.length === 10 && (cleanPhone.startsWith('07') || cleanPhone.startsWith('25'))) {
        return true;
    }
    // Check if it's a valid international Rwandan number (12 digits starting with 250)
    if (cleanPhone.length === 12 && cleanPhone.startsWith('250')) {
        return true;
    }
    return false;
};
exports.validatePhone = validatePhone;
