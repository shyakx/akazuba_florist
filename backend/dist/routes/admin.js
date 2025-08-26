"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/analytics', async (req, res) => {
    try {
        const [totalOrders, totalProducts, totalCustomers, totalRevenue] = await Promise.all([
            prisma.order.count(),
            prisma.product.count(),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.order.aggregate({
                _sum: { totalAmount: true }
            })
        ]);
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
        });
        const topProducts = await prisma.product.findMany({
            take: 5,
            orderBy: { stockQuantity: 'desc' },
            select: {
                id: true,
                name: true,
                stockQuantity: true
            }
        });
        const totalRevenueAmount = totalRevenue._sum.totalAmount ? Number(totalRevenue._sum.totalAmount) : 0;
        const analytics = {
            totalOrders,
            totalRevenue: totalRevenueAmount,
            newCustomers: totalCustomers,
            uniqueCustomers: totalCustomers,
            totalProducts,
            avgOrderValue: totalOrders > 0 ? Math.round(totalRevenueAmount / totalOrders) : 0,
            conversionRate: 3.2,
            revenueGrowth: 23.5,
            orderGrowth: 18.2,
            customerGrowth: 12.8,
            productGrowth: 5.2,
            avgOrderGrowth: 8.7,
            conversionGrowth: 2.1,
            topProducts: topProducts.map(p => ({ name: p.name, sales: p.stockQuantity })),
            recentOrders: recentOrders.map(o => ({
                id: o.id,
                customer: o.customerName,
                amount: Number(o.totalAmount),
                status: o.status.toLowerCase(),
                date: o.createdAt.toISOString().split('T')[0]
            })),
            monthlyRevenue: [1200000, 1350000, 1420000, 1500000],
            customerGrowthTrend: [120, 135, 142, 150],
            topCategories: [
                { name: 'Roses', sales: 45 },
                { name: 'Tulips', sales: 32 },
                { name: 'Lilies', sales: 28 }
            ]
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
            return {
                ...customer,
                totalOrders,
                totalSpent,
                status: totalSpent > 100000 ? 'vip' : 'active',
                joinedDate: customer.createdAt.toISOString().split('T')[0],
                address: 'Kigali, Rwanda',
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
                orderItems: true
            },
            orderBy: { createdAt: 'desc' }
        });
        const formattedOrders = orders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            status: order.status,
            subtotal: Number(order.subtotal),
            taxAmount: 0,
            shippingAmount: Number(order.deliveryFee),
            discountAmount: 0,
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
exports.default = router;
//# sourceMappingURL=admin.js.map