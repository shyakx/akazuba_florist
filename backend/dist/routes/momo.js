"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const momoController_1 = require("../controllers/momoController");
const router = express_1.default.Router();
router.post('/initiate-payment', momoController_1.momoController.initiatePayment);
router.get('/payment-status/:referenceId', momoController_1.momoController.checkPaymentStatus);
router.get('/account-balance', momoController_1.momoController.getAccountBalance);
exports.default = router;
//# sourceMappingURL=momo.js.map