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
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Public routes
router.post('/', verifyToken, createOrder)
router.post('/:orderId/payment-proof', uploadPaymentProof)

// Customer routes (protected)
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id

    const order = await prisma.orders.findMany({
      where: { userId },
      include: {
        order_items: {
          include: { products: {
              include: { category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: order
    })
  } catch (error) {
    console.error('Error getting users orders:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders'
    })
  }
})

router.get('/my-orders/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const order = await prisma.orders.findFirst({
      where: {
        id,
        userId
      },
      include: {
        order_items: {
          include: { products: {
              include: { category: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    })
  } catch (error) {
    console.error('Error getting users order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order'
    })
  }
})

// Admin routes (protected)
router.get('/', verifyToken, requireAdmin, getAllOrders)
router.get('/statistics', verifyToken, requireAdmin, getOrderStatistics)
router.get('/:id', verifyToken, requireAdmin, getOrderById)
router.patch('/:id/status', verifyToken, requireAdmin, updateOrderStatus)
router.patch('/:id/delivery', verifyToken, requireAdmin, updateDeliveryStatus)
router.patch('/:id/payment', verifyToken, requireAdmin, updatePaymentStatus)
router.delete('/:id', verifyToken, requireAdmin, deleteOrder)

export default router 