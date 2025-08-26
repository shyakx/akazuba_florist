import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

// Apply authentication middleware to all admin routes
router.use(authenticateToken)

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get comprehensive analytics data
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
    // Get real data from database
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts,
      monthlyRevenue,
      customerGrowth
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),
      
      // Total revenue
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        }
      }),
      
      // Total customers
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      }),
      
      // Total products
      prisma.product.count(),
      
      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true
                }
              }
            }
          }
        }
      }),
      
      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      }),
      
      // Monthly revenue for last 6 months
      prisma.order.groupBy({
        by: ['createdAt'],
        _sum: {
          totalAmount: true
        },
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      }),
      
      // Customer growth for last 6 months
      prisma.user.groupBy({
        by: ['createdAt'],
        _count: {
          id: true
        },
        where: {
          role: 'CUSTOMER',
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      })
    ])

    // Calculate real analytics
    const totalRevenueAmount = totalRevenue._sum.totalAmount ? Number(totalRevenue._sum.totalAmount) : 0
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenueAmount / totalOrders) : 0
    
    // Get top products with names
    const topProductsWithNames = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        })
        return {
          name: product?.name || 'Unknown Product',
          sales: item._sum.quantity || 0
        }
      })
    )

    // Process monthly revenue data
    const monthlyRevenueData = monthlyRevenue.reduce((acc: number[], item) => {
      const month = new Date(item.createdAt).getMonth()
      acc[month] = (acc[month] || 0) + Number(item._sum.totalAmount || 0)
      return acc
    }, [])

    // Process customer growth data
    const customerGrowthData = customerGrowth.reduce((acc: number[], item) => {
      const month = new Date(item.createdAt).getMonth()
      acc[month] = (acc[month] || 0) + item._count.id
      return acc
    }, [])

    // Calculate growth percentages (comparing current month to previous month)
    const currentMonthRevenue = monthlyRevenueData[new Date().getMonth()] || 0
    const previousMonthRevenue = monthlyRevenueData[new Date().getMonth() - 1] || 0
    const revenueGrowth = previousMonthRevenue > 0 ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0

    const currentMonthOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
    
    const previousMonthOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
    
    const orderGrowth = previousMonthOrders > 0 ? ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100 : 0

    const analytics = {
      totalOrders,
      totalRevenue: totalRevenueAmount,
      newCustomers: totalCustomers, // Could be calculated by date if needed
      uniqueCustomers: totalCustomers,
      totalProducts,
      avgOrderValue,
      conversionRate: 3.2, // This would need to be calculated from actual visitor data
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      orderGrowth: Math.round(orderGrowth * 100) / 100,
      customerGrowth: 0, // Would need to calculate from actual data
      productGrowth: 0, // Would need to calculate from actual data
      avgOrderGrowth: 0, // Would need to calculate from actual data
      conversionGrowth: 0, // Would need to calculate from actual data
      topProducts: topProductsWithNames,
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        customer: `${o.user.firstName} ${o.user.lastName}`,
        amount: Number(o.totalAmount),
        status: o.status.toLowerCase(),
        date: o.createdAt.toISOString().split('T')[0]
      })),
      monthlyRevenue: monthlyRevenueData,
      customerGrowthTrend: customerGrowthData,
      topCategories: await getTopCategories()
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

// Helper function to get top categories
async function getTopCategories() {
  const categorySales = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true
    }
  })

  const categoryMap = new Map<string, number>()
  
  for (const item of categorySales) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { categoryId: true }
    })
    
    if (product?.categoryId) {
      const currentSales = categoryMap.get(product.categoryId) || 0
      categoryMap.set(product.categoryId, currentSales + (item._sum.quantity || 0))
    }
  }

  // Get category names
  const categories = await prisma.category.findMany({
    where: {
      id: { in: Array.from(categoryMap.keys()) }
    }
  })

  return categories.map(category => ({
    name: category.name,
    sales: categoryMap.get(category.id) || 0
  })).sort((a, b) => b.sales - a.sales).slice(0, 5)
}

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

    // Get real order counts and totals for each customer
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

        // Get customer's address from their most recent order
        const recentOrder = await prisma.order.findFirst({
          where: { userId: customer.id },
          orderBy: { createdAt: 'desc' },
          select: { shippingAddress: true }
        })

        return {
          ...customer,
          totalOrders,
          totalSpent,
          status: totalSpent > 100000 ? 'vip' : 'active',
          joinedDate: customer.createdAt.toISOString().split('T')[0],
          address: recentOrder?.shippingAddress?.city ? 
            `${recentOrder.shippingAddress.city}, ${recentOrder.shippingAddress.country}` : 
            'Address not available',
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
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      customerEmail: order.user.email,
      status: order.status,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingAmount: order.shippingAmount,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      items: order.orderItems.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        productImage: item.product.images[0] || null
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
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
    // Get real counts from database
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
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    const formattedOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt
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

/**
 * @swagger
 * /admin/dashboard/activity:
 *   get:
 *     summary: Get recent activity for dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard/activity', async (req, res) => {
  try {
    const [recentOrders, recentCustomers, lowStockProducts] = await Promise.all([
      // Recent orders
      prisma.order.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      
      // Recent customers
      prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
          firstName: true,
          lastName: true,
          createdAt: true
        }
      }),
      
      // Low stock products
      prisma.product.findMany({
        where: { stockQuantity: { lte: 5 } },
        take: 2,
        select: {
          name: true,
          stockQuantity: true,
          updatedAt: true
        }
      })
    ])

    const activities = []

    // Add order activities
    recentOrders.forEach(order => {
      activities.push({
        type: 'order',
        title: 'New order received',
        description: `Order #${order.orderNumber} from ${order.user.firstName} ${order.user.lastName}`,
        timestamp: order.createdAt,
        status: 'success'
      })
    })

    // Add customer activities
    recentCustomers.forEach(customer => {
      activities.push({
        type: 'customer',
        title: 'New customer registered',
        description: `${customer.firstName} ${customer.lastName} joined the platform`,
        timestamp: customer.createdAt,
        status: 'info'
      })
    })

    // Add low stock activities
    lowStockProducts.forEach(product => {
      activities.push({
        type: 'stock',
        title: 'Low stock alert',
        description: `${product.name} running low (${product.stockQuantity} units left)`,
        timestamp: product.updatedAt,
        status: 'warning'
      })
    })

    // Sort by timestamp and take latest 10
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const recentActivities = activities.slice(0, 10)

    res.json({
      success: true,
      message: 'Recent activity retrieved successfully',
      data: recentActivities
    })
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity'
    })
  }
})

export default router 