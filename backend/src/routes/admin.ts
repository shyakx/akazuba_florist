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
        customer: o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest User',
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
          select: { customerAddress: true, customerCity: true }
        })

        return {
          ...customer,
          totalOrders,
          totalSpent,
          status: totalSpent > 100000 ? 'vip' : 'active',
          joinedDate: customer.createdAt.toISOString().split('T')[0],
          address: recentOrder ? 
            `${recentOrder.customerCity}, ${recentOrder.customerAddress}` : 
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
      customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
      customerEmail: order.user?.email || 'guest@akazubaflorist.com',
      status: order.status,
      subtotal: order.subtotal,
      taxAmount: 0, // Not in current schema
      shippingAmount: Number(order.deliveryFee),
      discountAmount: 0, // Not in current schema
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      shippingAddress: {
        address: order.customerAddress,
        city: order.customerCity
      },
      items: order.orderItems.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.unitPrice),
        productImage: item.productImage
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

    // Get total revenue
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      }
    })

    const stats = {
      newOrders,
      totalProducts,
      totalCustomers,
      lowStockProducts,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      averageOrderValue: totalOrders > 0 ? Number(totalRevenue._sum.totalAmount || 0) / totalOrders : 0
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
      orderNumber: order.orderNumber || `ORD-${order.id.slice(-6)}`,
      customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
      totalAmount: Number(order.totalAmount),
      status: order.status.toUpperCase(),
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
    // Get recent orders for activity feed
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

    // Get recent user registrations
    const recentUsers = await prisma.user.findMany({
      take: 3,
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      select: {
        firstName: true,
        lastName: true,
        createdAt: true
      }
    })

    const activities = [
      ...recentOrders.map(order => ({
        type: 'order',
        title: 'New order received',
        description: `Order #${order.orderNumber || `ORD-${order.id.slice(-6)}`} from ${order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User'}`,
        timestamp: order.createdAt,
        status: 'success'
      })),
      ...recentUsers.map(user => ({
        type: 'customer',
        title: 'New customer registered',
        description: `${user.firstName} ${user.lastName} joined the platform`,
        timestamp: user.createdAt,
        status: 'info'
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

    res.json({
      success: true,
      message: 'Recent activity retrieved successfully',
      data: activities
    })
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity'
    })
  }
})

/**
 * @swagger
 * /admin/dashboard/analytics:
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
router.get('/dashboard/analytics', async (req, res) => {
  try {
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
      
      // Customer growth (new customers per month)
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

    const analytics = {
      overview: {
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
        totalCustomers,
        totalProducts,
        averageOrderValue: totalOrders > 0 ? Number(totalRevenue._sum.totalAmount || 0) / totalOrders : 0
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber || `ORD-${order.id.slice(-6)}`,
        customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
        totalAmount: Number(order.totalAmount),
        status: order.status,
        createdAt: order.createdAt
      })),
      topProducts,
      monthlyRevenue: monthlyRevenue.map(item => ({
        month: item.createdAt,
        revenue: Number(item._sum.totalAmount)
      })),
      customerGrowth: customerGrowth.map(item => ({
        month: item.createdAt,
        newCustomers: item._count.id
      }))
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

// Admin product management routes
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query
    
    const skip = (Number(page) - 1) * Number(limit)
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ]
    }
    
    if (category && category !== 'all') {
      where.categoryId = category
    }
    
    if (status && status !== 'all') {
      if (status === 'active') where.isActive = true
      else if (status === 'inactive') where.isActive = false
      else if (status === 'featured') where.isFeatured = true
    }
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])
    
    const pages = Math.ceil(total / Number(limit))
    
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        total,
        pages
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    })
  }
})

router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true
      }
    })
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    
    return res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    })
  }
})

router.post('/products', async (req, res) => {
  try {
    const productData = req.body
    
    const product = await prisma.product.create({
      data: productData,
      include: {
        category: true
      }
    })
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    })
  }
})

router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    })
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    })
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    })
  }
})

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.product.delete({
      where: { id }
    })
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    })
  }
})

/**
 * @swagger
 * /admin/products/bulk:
 *   post:
 *     summary: Perform bulk operations on products
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               operation:
 *                 type: string
 *                 enum: [delete, activate, deactivate, feature, unfeature, updateStock]
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Bulk operation completed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/products/bulk', async (req, res) => {
  try {
    const { productIds, operation, data } = req.body
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs are required'
      })
    }
    
    if (!operation) {
      return res.status(400).json({
        success: false,
        message: 'Operation is required'
      })
    }
    
    let result: any
    
    switch (operation) {
      case 'delete':
        result = await prisma.product.deleteMany({
          where: {
            id: { in: productIds }
          }
        })
        break
        
      case 'activate':
        result = await prisma.product.updateMany({
          where: {
            id: { in: productIds }
          },
          data: {
            isActive: true
          }
        })
        break
        
      case 'deactivate':
        result = await prisma.product.updateMany({
          where: {
            id: { in: productIds }
          },
          data: {
            isActive: false
          }
        })
        break
        
      case 'feature':
        result = await prisma.product.updateMany({
          where: {
            id: { in: productIds }
          },
          data: {
            isFeatured: true
          }
        })
        break
        
      case 'unfeature':
        result = await prisma.product.updateMany({
          where: {
            id: { in: productIds }
          },
          data: {
            isFeatured: false
          }
        })
        break
        
      case 'updateStock':
        if (!data || !data.operation || !data.quantity) {
          return res.status(400).json({
            success: false,
            message: 'Stock operation and quantity are required'
          })
        }
        
        const products = await prisma.product.findMany({
          where: {
            id: { in: productIds }
          },
          select: {
            id: true,
            stockQuantity: true
          }
        })
        
        const updatePromises = products.map(product => {
          let newQuantity: number
          
          switch (data.operation) {
            case 'add':
              newQuantity = product.stockQuantity + data.quantity
              break
            case 'subtract':
              newQuantity = Math.max(0, product.stockQuantity - data.quantity)
              break
            case 'set':
              newQuantity = Math.max(0, data.quantity)
              break
            default:
              throw new Error('Invalid stock operation')
          }
          
          return prisma.product.update({
            where: { id: product.id },
            data: { stockQuantity: newQuantity }
          })
        })
        
        result = await Promise.all(updatePromises)
        break
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation'
        })
    }
    
    res.json({
      success: true,
      message: `Bulk operation '${operation}' completed successfully`,
      data: result
    })
  } catch (error) {
    console.error('Error performing bulk operation:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk operation'
    })
  }
})

/**
 * @swagger
 * /admin/export/{type}:
 *   post:
 *     summary: Export data as CSV
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [orders, customers, products, analytics]
 *     responses:
 *       200:
 *         description: Data exported successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/export/:type', async (req, res) => {
  try {
    const { type } = req.params
    
    let data: any[] = []
    let headers: string[] = []
    
    switch (type) {
      case 'orders':
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
                    price: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
        
        headers = ['Order ID', 'Order Number', 'Customer Name', 'Customer Email', 'Status', 'Total Amount', 'Payment Method', 'Payment Status', 'Created Date']
        data = orders.map(order => [
          order.id,
          order.orderNumber || `ORD-${order.id.slice(-6)}`,
          order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
          order.user?.email || 'guest@akazubaflorist.com',
          order.status,
          order.totalAmount,
          order.paymentMethod,
          order.paymentStatus,
          order.createdAt.toISOString()
        ])
        break
        
      case 'customers':
        const customers = await prisma.user.findMany({
          where: { role: 'CUSTOMER' },
          orderBy: { createdAt: 'desc' }
        })
        
        headers = ['Customer ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Registration Date', 'Total Orders', 'Total Spent']
        data = await Promise.all(customers.map(async (customer) => {
          const customerOrders = await prisma.order.findMany({
            where: { userId: customer.id }
          })
          const totalSpent = customerOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
          
          return [
            customer.id,
            customer.firstName,
            customer.lastName,
            customer.email,
            customer.phone || 'N/A',
            customer.createdAt.toISOString(),
            customerOrders.length,
            totalSpent
          ]
        }))
        break
        
      case 'products':
        const products = await prisma.product.findMany({
          include: {
            category: true
          },
          orderBy: { createdAt: 'desc' }
        })
        
        headers = ['Product ID', 'Name', 'Category', 'Price', 'Stock Quantity', 'Status', 'Created Date']
        data = products.map(product => [
          product.id,
          product.name,
          product.category?.name || 'Uncategorized',
          product.price,
          product.stockQuantity,
          product.isActive ? 'Active' : 'Inactive',
          product.createdAt.toISOString()
        ])
        break
        
      case 'analytics':
        const [
          totalOrders,
          totalRevenue,
          totalCustomers,
          totalProducts,
          monthlyRevenue,
          customerGrowth
        ] = await Promise.all([
          prisma.order.count(),
          prisma.order.aggregate({
            _sum: { totalAmount: true }
          }),
          prisma.user.count({ where: { role: 'CUSTOMER' } }),
          prisma.product.count(),
          prisma.order.groupBy({
            by: ['createdAt'],
            _sum: { totalAmount: true },
            where: {
              createdAt: {
                gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
              }
            }
          }),
          prisma.user.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            where: {
              role: 'CUSTOMER',
              createdAt: {
                gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
              }
            }
          })
        ])
        
        headers = ['Metric', 'Value', 'Date']
        data = [
          ['Total Orders', totalOrders, new Date().toISOString()],
          ['Total Revenue', Number(totalRevenue._sum.totalAmount || 0), new Date().toISOString()],
          ['Total Customers', totalCustomers, new Date().toISOString()],
          ['Total Products', totalProducts, new Date().toISOString()],
          ['Average Order Value', totalOrders > 0 ? Number(totalRevenue._sum.totalAmount || 0) / totalOrders : 0, new Date().toISOString()],
          ...monthlyRevenue.map(item => ['Monthly Revenue', Number(item._sum.totalAmount), item.createdAt.toISOString()]),
          ...customerGrowth.map(item => ['New Customers', item._count.id, item.createdAt.toISOString()])
        ]
        break
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        })
    }
    
    // Generate CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${type}-export-${new Date().toISOString().split('T')[0]}.csv"`)
    
    res.send(csvContent)
  } catch (error) {
    console.error('Error exporting data:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to export data'
    })
  }
})

export default router 