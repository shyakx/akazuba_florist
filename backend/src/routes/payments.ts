import express from 'express'
import PaymentController from '../controllers/paymentController'
import { verifyToken } from '../middleware/auth'

const router = express.Router()

// Get available payment methods
router.get('/methods', PaymentController.getPaymentMethods)

// Initiate payment
router.post('/initiate', PaymentController.initiatePayment)

// Check payment status
router.get('/status/:orderId', PaymentController.checkPaymentStatus)

// Update payment status (admin only)
router.put('/status/:orderId', verifyToken, PaymentController.updatePaymentStatus)

export default router 