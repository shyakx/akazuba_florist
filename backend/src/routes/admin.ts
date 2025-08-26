import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get admin analytics data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics', async (req, res) => {
  try {
    // Get counts from database
    const [totalOrders, totalProducts, totalCustomers, totalRevenue] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      })
    ])

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true
      }
    })

    // Get top products by stock
    const topProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { stockQuantity: 'desc' },
      select: {
        id: true,
        name: true,
        stockQuantity: true
      }
    })

    // Calculate analytics
    const totalRevenueAmount = totalRevenue._sum.totalAmount ? Number(totalRevenue._sum.totalAmount) : 0
    const analytics = {
      totalOrders,
      totalRevenue: totalRevenueAmount,
      newCustomers: totalCustomers, // Simplified - could be calculated by date
      uniqueCustomers: totalCustomers,
      totalProducts,
      avgOrderValue: totalOrders > 0 ? Math.round(totalRevenueAmount / totalOrders) : 0,
      conversionRate: 3.2, // Mock value
      revenueGrowth: 23.5, // Mock value
      orderGrowth: 18.2, // Mock value
      customerGrowth: 12.8, // Mock value
      productGrowth: 5.2, // Mock value
      avgOrderGrowth: 8.7, // Mock value
      conversionGrowth: 2.1, // Mock value
      topProducts: topProducts.map(p => ({ name: p.name, sales: p.stockQuantity })),
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        customer: o.customerName,
        amount: Number(o.totalAmount),
        status: o.status.toLowerCase(),
        date: o.createdAt.toISOString().split('T')[0]
      })),
      monthlyRevenue: [1200000, 1350000, 1420000, 1500000], // Mock data
      customerGrowthTrend: [120, 135, 142, 150], // Mock data
      topCategories: [
        { name: 'Roses', sales: 45 },
        { name: 'Tulips', sales: 32 },
        { name: 'Lilies', sales: 28 }
      ] // Mock data
    }

    res.json({
      success: true,
      message: 'Analytics data retrieved successfully',
      data: analytics
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    })
  }
})

/**
 * @swagger
 * /admin/customers:
 *   get:
 *     summary: Get all customers (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Get order counts and totals for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orders = await prisma.order.findMany({
          where: { userId: customer.id }
        })

        const totalOrders = orders.length
        const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
        const wishlistItems = await prisma.wishlist.count({
          where: { userId: customer.id }
        })

        return {
          ...customer,
          totalOrders,
          totalSpent,
          status: totalSpent > 100000 ? 'vip' : 'active',
          joinedDate: customer.createdAt.toISOString().split('T')[0],
          address: 'Kigali, Rwanda', // Mock address
          wishlistItems
        }
      })
    )

    res.json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customersWithStats
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers'
    })
  }
})

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      status: order.status,
      subtotal: Number(order.subtotal),
      taxAmount: 0, // Not in schema
      shippingAmount: Number(order.deliveryFee),
      discountAmount: 0, // Not in schema
      totalAmount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: {
        street: order.customerAddress,
        city: order.customerCity,
        country: 'Rwanda'
      },
      items: order.orderItems.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: Number(item.unitPrice)
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }))

    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: formattedOrders
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    })
  }
})

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    })

    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: Number(product.price),
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId,
      category: product.category.name,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      images: Array.isArray(product.images) ? product.images : [],
      status: product.isActive ? 'active' : 'inactive',
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }))

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: formattedProducts
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    })
  }
})

/**
 * @swagger
 * /admin/wishlists:
 *   get:
 *     summary: Get all wishlists (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlists retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/wishlists', async (req, res) => {
  try {
    const wishlists = await prisma.wishlist.findMany({
      include: {
        user: true,
        product: true
      }
    })

    // Group wishlists by user
    const wishlistsByUser = wishlists.reduce((acc, wishlist) => {
      const userId = wishlist.userId
      if (!acc[userId]) {
        acc[userId] = {
          id: `wishlist-${userId}`,
          customerId: userId,
          customerName: `${wishlist.user.firstName} ${wishlist.user.lastName}`,
          customerEmail: wishlist.user.email,
          items: [],
          totalItems: 0,
          totalValue: 0,
          createdAt: wishlist.createdAt.toISOString(),
          updatedAt: wishlist.createdAt.toISOString() // Use createdAt as updatedAt since wishlist doesn't have updatedAt
        }
      }

      acc[userId].items.push({
        productId: wishlist.productId,
        productName: wishlist.product.name,
        price: Number(wishlist.product.price),
        addedAt: wishlist.createdAt.toISOString()
      })

      acc[userId].totalItems += 1
      acc[userId].totalValue += Number(wishlist.product.price)

      return acc
    }, {} as Record<string, any>)

    const formattedWishlists = Object.values(wishlistsByUser)

    res.json({
      success: true,
      message: 'Wishlists retrieved successfully',
      data: formattedWishlists
    })
  } catch (error) {
    console.error('Error fetching wishlists:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlists'
    })
  }
})

/**
 * @swagger
 * /admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get counts from database
    const [totalOrders, totalProducts, totalCustomers, lowStockProducts] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { stockQuantity: { lte: 10 } } })
    ])

    // Get new orders (orders created in the last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const newOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    })

    const stats = {
      newOrders,
      totalProducts,
      totalCustomers,
      lowStockProducts
    }

    res.json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    })
  }
})

/**
 * @swagger
 * /admin/dashboard/recent-orders:
 *   get:
 *     summary: Get recent orders for dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent orders retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard/recent-orders', async (req, res) => {
  try {
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true
      }
    })

    const formattedOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      createdAt: order.createdAt.toISOString()
    }))

    res.json({
      success: true,
      message: 'Recent orders retrieved successfully',
      data: formattedOrders
    })
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent orders'
    })
  }
})

export default router 