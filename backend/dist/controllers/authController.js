"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = exports.refreshToken = exports.logout = exports.adminLogin = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const auth_1 = require("../middleware/auth");
const prisma = new client_1.PrismaClient();
// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'akazuba-jwt-secret-2024-development';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
// Generate JWT tokens
const generateTokens = (userId, role) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, role, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
    return { accessToken, refreshToken };
};
// Register new customer
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        // Validation
        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({
                success: false,
                message: 'Email, password, first name, and last name are required'
            });
            return;
        }
        if (!(0, auth_1.validateEmail)(email)) {
            res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
            return;
        }
        const passwordValidation = (0, auth_1.validatePassword)(password);
        if (!passwordValidation.isValid) {
            res.status(400).json({
                success: false,
                message: passwordValidation.message
            });
            return;
        }
        if (phone && !(0, auth_1.validatePhone)(phone)) {
            res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
            return;
        }
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
            return;
        }
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Create user
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                passwordHash: hashedPassword,
                firstName,
                lastName,
                phone: phone || null,
                role: 'CUSTOMER',
                isActive: true,
                emailVerified: false
            },
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
        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.register = register;
// Customer login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }
        // Find user with password hash
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
                id: true,
                email: true,
                passwordHash: true,
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
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        });
        // Remove password from response
        const { passwordHash, ...userWithoutPassword } = user;
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.login = login;
// Admin login
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validation
        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
            return;
        }
        // Find admin user with password hash
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: username.toLowerCase() },
                    { firstName: username }
                ],
                role: 'ADMIN',
                isActive: true
            },
            select: {
                id: true,
                email: true,
                passwordHash: true,
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
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        });
        // Remove password from response
        const { passwordHash, ...userWithoutPassword } = user;
        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: {
                user: userWithoutPassword,
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.adminLogin = adminLogin;
// Logout
const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            // Invalidate refresh token
            await prisma.refreshToken.deleteMany({
                where: {
                    userId: req.user.id
                }
            });
        }
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    }
    catch (error) {
        logger_1.logger.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.logout = logout;
// Refresh token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
            return;
        }
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
        if (decoded.type !== 'refresh') {
            res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
            return;
        }
        // Check if refresh token exists in database
        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                token: refreshToken,
                userId: decoded.userId,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                user: {
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
                }
            }
        });
        if (!storedToken || !storedToken.user.isActive) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
            return;
        }
        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(storedToken.user.id, storedToken.user.role);
        // Delete old refresh token and store new one
        await prisma.refreshToken.delete({
            where: { id: storedToken.id }
        });
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: storedToken.user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        });
        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                user: storedToken.user,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Token refresh error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
};
exports.refreshToken = refreshToken;
// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
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
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: { user }
        });
    }
    catch (error) {
        logger_1.logger.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getProfile = getProfile;
// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;
        // Validation
        if (phone && !(0, auth_1.validatePhone)(phone)) {
            res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
            return;
        }
        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(phone !== undefined && { phone })
            },
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
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: updatedUser }
        });
    }
    catch (error) {
        logger_1.logger.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateProfile = updateProfile;
// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        // Validation
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
            return;
        }
        const passwordValidation = (0, auth_1.validatePassword)(newPassword);
        if (!passwordValidation.isValid) {
            res.status(400).json({
                success: false,
                message: passwordValidation.message
            });
            return;
        }
        // Get user with password
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Verify current password
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
            return;
        }
        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, saltRounds);
        // Update password
        await prisma.user.update({
            where: { id: req.user.id },
            data: { passwordHash: hashedNewPassword }
        });
        // Invalidate all refresh tokens
        await prisma.refreshToken.deleteMany({
            where: { userId: req.user.id }
        });
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        logger_1.logger.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.changePassword = changePassword;
