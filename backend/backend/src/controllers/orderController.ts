import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { smsService } from '../utils/smsService'

const prisma = new PrismaClient()

// Generate AKZ-001 format order number
const generateOrderNumber = async (): Promise<string> => {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { orderNumber: 'desc' }
  })

  if (!lastOrder) {
    return 'AKZ-001'
  }

  const lastNumber = parseInt(lastOrder.orderNumber.replace('AKZ-', ''))
  const nextNumber = lastNumber + 1
  return `AKZ-${nextNumber.toString().padStart(3, '0')}`
}

// Calculate delivery fee based on city and order amount
const calculateDeliveryFee = (customerCity: string, subtotal: number): number => {
  const city = customerCity.toLowerCase()
  
  // Free delivery conditions
  if (city === 'kigali') return 0
  if (subtotal >= 50000) return 0  // Events (weddings, proposals, funerals)
  if (subtotal >= 25000) return 0  // Large orders
  
  // Standard delivery fees
  if (['butare', 'gisenyi', 'ruhengeri'].includes(city)) return 3000
  return 5000  // Other provinces
}

// Create new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      items,
      paymentMethod,
      notes
    } = req.body

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !customerCity || !items || !paymentMethod) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
      return
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    // Calculate delivery fee
    const deliveryFee = calculateDeliveryFee(customerCity, subtotal)
    const totalAmount = subtotal + deliveryFee

    // Generate order number
    const orderNumber = await generateOrderNumber()

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        customerCity,
        subtotal: new Decimal(subtotal),
        deliveryFee: new Decimal(deliveryFee),
        totalAmount: new Decimal(totalAmount),
        paymentMethod,
        notes,
        userId: req.user?.id || null
      }
    })

    // Create order items
    const orderItems = await Promise.all(
      items.map((item: any) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            productSku: item.sku,
            quantity: item.quantity,
            unitPrice: new Decimal(item.price),
            totalPrice: new Decimal(item.price * item.quantity),
            color: item.color,
            type: item.type
          }
        })
      )
    )

    // Send admin notification
    await smsService.sendOrderNotification(orderNumber, customerName, totalAmount)

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          ...order,
          items: orderItems
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
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          paymentProofs: true,
          user: {
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
      prisma.order.count({ where })
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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        paymentProofs: true,
        user: {
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

    const order = await prisma.order.update({
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

    const order = await prisma.order.update({
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

    const order = await prisma.order.update({
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

    const paymentProof = await prisma.paymentProof.create({
      data: {
        orderId,
        proofImage
      }
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
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalAmount: true }
      }),
      prisma.order.aggregate({
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

    await prisma.order.delete({
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