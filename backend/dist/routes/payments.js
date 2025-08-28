"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = __importDefault(require("../controllers/paymentController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get available payment methods
router.get('/methods', paymentController_1.default.getPaymentMethods);
// Initiate payment
router.post('/initiate', paymentController_1.default.initiatePayment);
// Check payment status
router.get('/status/:orderId', paymentController_1.default.checkPaymentStatus);
// Update payment status (admin only)
router.put('/status/:orderId', auth_1.verifyToken, paymentController_1.default.updatePaymentStatus);
exports.default = router;
