import express from 'express'
import { momoController } from '../controllers/momoController'

const router = express.Router()

// MTN MoMo payment routes
router.post('/initiate-payment', momoController.initiatePayment)
router.get('/payment-status/:referenceId', momoController.checkPaymentStatus)
router.get('/account-balance', momoController.getAccountBalance)

export default router 