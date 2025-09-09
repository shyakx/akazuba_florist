"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.updateProfile = exports.getProfile = exports.refreshToken = exports.logout = exports.adminLogin = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const auth_1 = require("../middleware/auth");
const prisma = new client_1.PrismaClient();
// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'akazuba-jwt-secret-2024-development-super-secure-key-for-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
// Ensure JWT_SECRET is defined
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}
// Log JWT configuration for debugging
console.log('🔐 JWT Configuration:');
console.log('  - JWT_SECRET:', JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  - JWT_EXPIRES_IN:', JWT_EXPIRES_IN);
console.log('  - REFRESH_TOKEN_EXPIRES_IN:', REFRESH_TOKEN_EXPIRES_IN);
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
        await prisma.refresh_tokens.create({
            data: {
                id: crypto.randomUUID(),
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
        await prisma.refresh_tokens.create({
            data: {
                id: crypto.randomUUID(),
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
        await prisma.refresh_tokens.create({
            data: {
                id: crypto.randomUUID(),
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
            await prisma.refresh_tokens.deleteMany({
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
        const storedToken = await prisma.refresh_tokens.findFirst({
            where: {
                token: refreshToken,
                userId: decoded.userId,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: { users: {
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
        if (!storedToken || !storedToken.users.isActive) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
            return;
        }
        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(storedToken.users.id, storedToken.users.role);
        // Delete old refresh token and store new one
        await prisma.refresh_tokens.delete({
            where: { id: storedToken.id }
        });
        await prisma.refresh_tokens.create({
            data: {
                id: crypto.randomUUID(),
                token: newRefreshToken,
                userId: storedToken.users.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        });
        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                user: storedToken.users,
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
// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Validation
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
            }
        });
        // Always return success to prevent email enumeration
        if (!user) {
            res.status(200).json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
            return;
        }
        // Generate reset token
        const resetToken = jsonwebtoken_1.default.sign({ userId: user.id, type: 'password_reset' }, JWT_SECRET, { expiresIn: '1h' });
        // Store reset token in database (you might want to create a separate table for this)
        // For now, we'll use a simple approach
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        // TODO: Send email with reset link
        // For now, we'll just log it (in production, use a service like SendGrid, Nodemailer, etc.)
        console.log(`Password reset link for ${user.email}: ${resetLink}`);
        res.status(200).json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.',
            // In development, include the reset link for testing
            ...(process.env.NODE_ENV === 'development' && { resetLink })
        });
    }
    catch (error) {
        logger_1.logger.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.forgotPassword = forgotPassword;
// Reset password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        // Validation
        if (!token || !newPassword) {
            res.status(400).json({
                success: false,
                message: 'Token and new password are required'
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
        // Verify reset token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.type !== 'password_reset') {
            res.status(401).json({
                success: false,
                message: 'Invalid reset token'
            });
            return;
        }
        // Find user
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, saltRounds);
        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: hashedNewPassword }
        });
        // Invalidate all refresh tokens
        await prisma.refresh_tokens.deleteMany({
            where: { userId: user.id }
        });
        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
            return;
        }
        logger_1.logger.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.resetPassword = resetPassword;
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
        await prisma.refresh_tokens.deleteMany({
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
