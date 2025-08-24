"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
router.post('/initiate', paymentController_1.paymentController.initiatePayment);
router.get('/verify/:transactionId', paymentController_1.paymentController.verifyPayment);
router.get('/transfer/:transactionId', paymentController_1.paymentController.getBankTransferDetails);
router.post('/webhook', paymentController_1.paymentController.handleWebhook);
exports.default = router;
//# sourceMappingURL=payments.js.map