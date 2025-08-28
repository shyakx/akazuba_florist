"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.use(auth_1.authenticateToken);
router.get('/analytics', async (req, res) => {
    try {
        const [totalOrders, totalRevenue, totalCustomers, totalProducts, recentOrders, topProducts, monthlyRevenue, customerGrowth] = await Promise.all([
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: {
                    totalAmount: true
                }
            }),
            prisma.user.count({
                where: { role: 'CUSTOMER' }
            }),
            prisma.product.count(),
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
        ]);
        const totalRevenueAmount = totalRevenue._sum.totalAmount ? Number(totalRevenue._sum.totalAmount) : 0;
        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenueAmount / totalOrders) : 0;
        const topProductsWithNames = await Promise.all(topProducts.map(async (item) => {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                select: { name: true }
            });
            return {
                name: product?.name || 'Unknown Product',
                sales: item._sum.quantity || 0
            };
        }));
        const monthlyRevenueData = monthlyRevenue.reduce((acc, item) => {
            const month = new Date(item.createdAt).getMonth();
            acc[month] = (acc[month] || 0) + Number(item._sum.totalAmount || 0);
            return acc;
        }, []);
        const customerGrowthData = customerGrowth.reduce((acc, item) => {
            const month = new Date(item.createdAt).getMonth();
            acc[month] = (acc[month] || 0) + item._count.id;
            return acc;
        }, []);
        const currentMonthRevenue = monthlyRevenueData[new Date().getMonth()] || 0;
        const previousMonthRevenue = monthlyRevenueData[new Date().getMonth() - 1] || 0;
        const revenueGrowth = previousMonthRevenue > 0 ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0;
        const currentMonthOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });
        const previousMonthOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                    lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });
        const orderGrowth = previousMonthOrders > 0 ? ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100 : 0;
        const analytics = {
            totalOrders,
            totalRevenue: totalRevenueAmount,
            newCustomers: totalCustomers,
            uniqueCustomers: totalCustomers,
            totalProducts,
            avgOrderValue,
            conversionRate: 3.2,
            revenueGrowth: Math.round(revenueGrowth * 100) / 100,
            orderGrowth: Math.round(orderGrowth * 100) / 100,
            customerGrowth: 0,
            productGrowth: 0,
            avgOrderGrowth: 0,
            conversionGrowth: 0,
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
        };
        res.json({
            success: true,
            message: 'Analytics data retrieved successfully',
            data: analytics
        });
    }
    catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics data'
        });
    }
});
async function getTopCategories() {
    const categorySales = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true
        }
    });
    const categoryMap = new Map();
    for (const item of categorySales) {
        const product = await prisma.product.findUnique({
            where: { id: item.productId },
            select: { categoryId: true }
        });
        if (product?.categoryId) {
            const currentSales = categoryMap.get(product.categoryId) || 0;
            categoryMap.set(product.categoryId, currentSales + (item._sum.quantity || 0));
        }
    }
    const categories = await prisma.category.findMany({
        where: {
            id: { in: Array.from(categoryMap.keys()) }
        }
    });
    return categories.map(category => ({
        name: category.name,
        sales: categoryMap.get(category.id) || 0
    })).sort((a, b) => b.sales - a.sales).slice(0, 5);
}
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
        });
        const customersWithStats = await Promise.all(customers.map(async (customer) => {
            const orders = await prisma.order.findMany({
                where: { userId: customer.id }
            });
            const totalOrders = orders.length;
            const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
            const wishlistItems = await prisma.wishlist.count({
                where: { userId: customer.id }
            });
            const recentOrder = await prisma.order.findFirst({
                where: { userId: customer.id },
                orderBy: { createdAt: 'desc' },
                select: { customerAddress: true, customerCity: true }
            });
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
            };
        }));
        res.json({
            success: true,
            message: 'Customers retrieved successfully',
            data: customersWithStats
        });
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers'
        });
    }
});
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
        });
        const formattedOrders = orders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
            customerEmail: order.user?.email || 'guest@akazubaflorist.com',
            status: order.status,
            subtotal: order.subtotal,
            taxAmount: 0,
            shippingAmount: Number(order.deliveryFee),
            discountAmount: 0,
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
        }));
        res.json({
            success: true,
            message: 'Orders retrieved successfully',
            data: formattedOrders
        });
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
});
router.get('/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true
            }
        });
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
        }));
        res.json({
            success: true,
            message: 'Products retrieved successfully',
            data: formattedProducts
        });
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});
router.get('/wishlists', async (req, res) => {
    try {
        const wishlists = await prisma.wishlist.findMany({
            include: {
                user: true,
                product: true
            }
        });
        const wishlistsByUser = wishlists.reduce((acc, wishlist) => {
            const userId = wishlist.userId;
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
                    updatedAt: wishlist.createdAt.toISOString()
                };
            }
            acc[userId].items.push({
                productId: wishlist.productId,
                productName: wishlist.product.name,
                price: Number(wishlist.product.price),
                addedAt: wishlist.createdAt.toISOString()
            });
            acc[userId].totalItems += 1;
            acc[userId].totalValue += Number(wishlist.product.price);
            return acc;
        }, {});
        const formattedWishlists = Object.values(wishlistsByUser);
        res.json({
            success: true,
            message: 'Wishlists retrieved successfully',
            data: formattedWishlists
        });
    }
    catch (error) {
        console.error('Error fetching wishlists:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wishlists'
        });
    }
});
router.get('/dashboard/stats', async (req, res) => {
    try {
        const [totalOrders, totalProducts, totalCustomers, lowStockProducts] = await Promise.all([
            prisma.order.count(),
            prisma.product.count(),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.product.count({ where: { stockQuantity: { lte: 10 } } })
        ]);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            }
        });
        const stats = {
            newOrders,
            totalProducts,
            totalCustomers,
            lowStockProducts
        };
        res.json({
            success: true,
            message: 'Dashboard stats retrieved successfully',
            data: stats
        });
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats'
        });
    }
});
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
        });
        const formattedOrders = recentOrders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User',
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt
        }));
        res.json({
            success: true,
            message: 'Recent orders retrieved successfully',
            data: formattedOrders
        });
    }
    catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent orders'
        });
    }
});
router.get('/dashboard/activity', async (req, res) => {
    try {
        const [recentOrders, recentCustomers, lowStockProducts] = await Promise.all([
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
            prisma.product.findMany({
                where: { stockQuantity: { lte: 5 } },
                take: 2,
                select: {
                    name: true,
                    stockQuantity: true,
                    updatedAt: true
                }
            })
        ]);
        const activities = [];
        recentOrders.forEach(order => {
            activities.push({
                type: 'order',
                title: 'New order received',
                description: `Order #${order.orderNumber} from ${order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User'}`,
                timestamp: order.createdAt,
                status: 'success'
            });
        });
        recentCustomers.forEach(customer => {
            activities.push({
                type: 'customer',
                title: 'New customer registered',
                description: `${customer.firstName} ${customer.lastName} joined the platform`,
                timestamp: customer.createdAt,
                status: 'info'
            });
        });
        lowStockProducts.forEach(product => {
            activities.push({
                type: 'stock',
                title: 'Low stock alert',
                description: `${product.name} running low (${product.stockQuantity} units left)`,
                timestamp: product.updatedAt,
                status: 'warning'
            });
        });
        activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const recentActivities = activities.slice(0, 10);
        res.json({
            success: true,
            message: 'Recent activity retrieved successfully',
            data: recentActivities
        });
    }
    catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent activity'
        });
    }
});
router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, status } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (category && category !== 'all') {
            where.categoryId = category;
        }
        if (status && status !== 'all') {
            if (status === 'active')
                where.isActive = true;
            else if (status === 'inactive')
                where.isActive = false;
            else if (status === 'featured')
                where.isFeatured = true;
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
        ]);
        const pages = Math.ceil(total / Number(limit));
        res.json({
            success: true,
            message: 'Products retrieved successfully',
            data: {
                products,
                total,
                pages
            }
        });
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});
router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true
            }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        return res.json({
            success: true,
            message: 'Product retrieved successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch product'
        });
    }
});
router.post('/products', async (req, res) => {
    try {
        const productData = req.body;
        const product = await prisma.product.create({
            data: productData,
            include: {
                category: true
            }
        });
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product'
        });
    }
});
router.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
        });
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
});
router.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
        });
    }
});
router.post('/products/bulk', async (req, res) => {
    try {
        const { operation, productIds } = req.body;
        switch (operation) {
            case 'delete':
                await prisma.product.deleteMany({
                    where: { id: { in: productIds } }
                });
                break;
            case 'activate':
                await prisma.product.updateMany({
                    where: { id: { in: productIds } },
                    data: { isActive: true }
                });
                break;
            case 'deactivate':
                await prisma.product.updateMany({
                    where: { id: { in: productIds } },
                    data: { isActive: false }
                });
                break;
            case 'feature':
                await prisma.product.updateMany({
                    where: { id: { in: productIds } },
                    data: { isFeatured: true }
                });
                break;
            case 'unfeature':
                await prisma.product.updateMany({
                    where: { id: { in: productIds } },
                    data: { isFeatured: false }
                });
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid operation'
                });
        }
        return res.json({
            success: true,
            message: `Bulk ${operation} completed successfully`
        });
    }
    catch (error) {
        console.error('Error performing bulk operation:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to perform bulk operation'
        });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map