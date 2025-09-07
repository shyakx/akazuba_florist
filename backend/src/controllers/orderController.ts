/// <reference types="node" />
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { smsService } from '../utils/smsService'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/payment-proofs'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'payment-proof-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Generate order number
const generateOrderNumber = async (): Promise<string> => {
  const count = await prisma.orders.count()
  const orderNumber = `AKZ-${String(count + 1).padStart(3, '0')}`
  return orderNumber
}

// Calculate delivery fee
const calculateDeliveryFee = (city: string, subtotal: number): number => {
  if (city === 'Kigali') {
    return subtotal >= 50000 ? 0 : 2000  // Free delivery for orders over RWF 50,000
  }
  return 5000  // Other provinces
}

// Create new order with payment proof
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    // Handle file upload
    upload.single('paymentProof')(req, res, async (err) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: err.message || 'File upload error'
        })
        return
      }

      try {
        const orderData = JSON.parse(req.body.orderData)
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      items,
      paymentMethod,
      notes
        } = orderData

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !customerCity || !items || !paymentMethod) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
      return
    }

        // Check if payment proof was uploaded
        if (!req.file) {
          res.status(400).json({
            success: false,
            message: 'Payment proof is required'
      })
      return
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.unitPrice * item.quantity)
    }, 0)

    // Calculate delivery fee
    const deliveryFee = calculateDeliveryFee(customerCity, subtotal)
    const totalAmount = subtotal + deliveryFee

    // Generate order number
    const orderNumber = await generateOrderNumber()

    // Create order
    const order = await prisma.orders.create({
      data: {
        id: crypto.randomUUID(),
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerCity,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod as 'MOMO' | 'BK' | 'CASH',
        notes,
        userId: req.user?.id || null,
        status: 'PENDING' as 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
        paymentStatus: 'PENDING' as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED',
        updatedAt: new Date()
      }
    })

    // Create order items
    const order_items = await Promise.all(
      items.map((item: any) =>
        prisma.order_items.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            productSku: item.sku,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            color: item.color,
            type: item.type
          } as any
        })
      )
    )

        // Create payment proof record
        const paymentProof = await prisma.payment_proofs.create({
          data: {
            orderId: order.id,
            proofImage: req.file.filename
          } as any
        })

    // Send admin notification
    await smsService.sendOrderNotification(orderNumber, customerName, totalAmount)

    res.status(201).json({
      success: true,
          message: 'Order created successfully with payment proof',
      data: {
        order: {
          ...order,
              items: order_items,
              paymentProof
        }
      }
    })
  } catch (error) {
    console.error('Error creating order:', error)
        res.status(500).json({
          success: false,
          message: 'Failed to create order'
        })
      }
    })
  } catch (error) {
    console.error('Error in createOrder:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Required fields')) {
        res.status(400).json({
          success: false,
          message: error.message
        })
        return
      }
      
      if (error.message.includes('Payment proof')) {
        res.status(400).json({
          success: false,
          message: error.message
        })
        return
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create order. Please try again.'
    })
  }
}

// Get all orders (admin)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus, search } = req.query

    const skip = (Number(page) - 1) * Number(limit)

    // Build where clause
    const where: any = {}
    if (status) where.status = status
    if (paymentStatus) where.paymentStatus = paymentStatus
    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
        { customerEmail: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        include: {
          order_items: {
            include: { products: true
            }
          },
          payment_proofs: true,
          users: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.orders.count({ where })
    ])

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    })
  }
}

// Get order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        order_items: {
          include: { products: true
          }
        },
        payment_proofs: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found'
      })
      return
    }

    res.json({
      success: true,
      data: { order }
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    })
  }
}

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status, adminNotes } = req.body

    const order = await prisma.orders.update({
      where: { id },
      data: {
        status,
        adminNotes,
        updatedAt: new Date()
      }
    })

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    })
  }
}

// Update delivery status
export const updateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { deliveryStatus, trackingNumber, estimatedDelivery } = req.body

    const updateData: any = {
      deliveryStatus,
      updatedAt: new Date()
    }

    if (trackingNumber) updateData.trackingNumber = trackingNumber
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery)
    if (deliveryStatus === 'DELIVERED') updateData.deliveredAt = new Date()

    const order = await prisma.orders.update({
      where: { id },
      data: updateData
    })

    res.json({
      success: true,
      message: 'Delivery status updated successfully',
      data: { order }
    })
  } catch (error) {
    console.error('Error updating delivery status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update delivery status'
    })
  }
}

// Update payment status
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { paymentStatus } = req.body

    const order = await prisma.orders.update({
      where: { id },
      data: {
        paymentStatus,
        updatedAt: new Date()
      }
    })

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: { order }
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    })
  }
}

// Upload payment proof
export const uploadPaymentProof = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params
    const { proofImage } = req.body

    if (!proofImage) {
      res.status(400).json({
        success: false,
        message: 'Payment proof image is required'
      })
      return
    }

    const paymentProof = await prisma.payment_proofs.create({
      data: {
        orderId,
        proofImage
      } as any
    })

    res.status(201).json({
      success: true,
      message: 'Payment proof uploaded successfully',
      data: { paymentProof }
    })
  } catch (error) {
    console.error('Error uploading payment proof:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to upload payment proof'
    })
  }
}

// Get order statistics
export const getOrderStatistics = async (req: Request, res: Response) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      totalRevenue,
      monthlyRevenue
    ] = await Promise.all([
      prisma.orders.count(),
      prisma.orders.count({ where: { status: 'PENDING' } }),
      prisma.orders.count({ where: { status: 'PROCESSING' } }),
      prisma.orders.count({ where: { status: 'DELIVERED' } }),
      prisma.orders.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalAmount: true }
      }),
      prisma.orders.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { totalAmount: true }
      })
    ])

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        monthlyRevenue: monthlyRevenue._sum.totalAmount || 0
      }
    })
  } catch (error) {
    console.error('Error fetching order statistics:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    })
  }
}

// Delete order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.orders.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Order deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete order'
    })
  }
} 