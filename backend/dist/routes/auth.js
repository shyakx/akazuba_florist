"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const authLimiter = (0, express_rate_limit_1.default)(auth_1.authRateLimit);
router.post('/register', authLimiter, authController_1.register);
router.post('/login', authLimiter, authController_1.login);
router.post('/admin/login', authLimiter, authController_1.adminLogin);
router.post('/logout', auth_1.requireAuth, authController_1.logout);
router.post('/refresh', authController_1.refreshToken);
router.get('/profile', auth_1.requireAuth, authController_1.getProfile);
router.put('/profile', auth_1.requireAuth, authController_1.updateProfile);
router.post('/change-password', auth_1.requireAuth, authController_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.js.map