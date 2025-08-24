import express from 'express'
import { paymentController } from '../controllers/paymentController'

const router = express.Router()

// Initialize payment (MoMo or Bank Transfer)
router.post('/initiate', paymentController.initiatePayment)

// Verify payment status
router.get('/verify/:transactionId', paymentController.verifyPayment)

// Get bank transfer details
router.get('/transfer/:transactionId', paymentController.getBankTransferDetails)

// Webhook for payment notifications
router.post('/webhook', paymentController.handleWebhook)

export default router 