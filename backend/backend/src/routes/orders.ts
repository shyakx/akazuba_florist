import express from 'express'
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateDeliveryStatus,
  updatePaymentStatus,
  uploadPaymentProof,
  getOrderStatistics,
  deleteOrder
} from '../controllers/orderController'
import { verifyToken, requireAdmin } from '../middleware/auth'

const router = express.Router()

// Public routes
router.post('/', createOrder)
router.post('/:orderId/payment-proof', uploadPaymentProof)

// Admin routes (protected)
router.get('/', verifyToken, requireAdmin, getAllOrders)
router.get('/statistics', verifyToken, requireAdmin, getOrderStatistics)
router.get('/:id', verifyToken, requireAdmin, getOrderById)
router.patch('/:id/status', verifyToken, requireAdmin, updateOrderStatus)
router.patch('/:id/delivery', verifyToken, requireAdmin, updateDeliveryStatus)
router.patch('/:id/payment', verifyToken, requireAdmin, updatePaymentStatus)
router.delete('/:id', verifyToken, requireAdmin, deleteOrder)

export default router 