"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Public routes
router.post('/', orderController_1.createOrder);
router.post('/:orderId/payment-proof', orderController_1.uploadPaymentProof);
// Customer routes (protected)
router.get('/my-orders', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({
            success: true,
            message: 'Orders retrieved successfully',
            data: orders
        });
    }
    catch (error) {
        console.error('Error getting user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders'
        });
    }
});
router.get('/my-orders/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const order = await prisma.order.findFirst({
            where: {
                id,
                userId
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.json({
            success: true,
            message: 'Order retrieved successfully',
            data: order
        });
        return;
    }
    catch (error) {
        console.error('Error getting user order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve order'
        });
        return;
    }
});
// Admin routes (protected)
router.get('/', auth_1.verifyToken, auth_1.requireAdmin, orderController_1.getAllOrders);
router.get('/statistics', auth_1.verifyToken, auth_1.requireAdmin, orderController_1.getOrderStatistics);
router.get('/:id', auth_1.verifyToken, auth_1.requireAdmin, orderController_1.getOrderById);
router.patch('/:id/status', auth_1.verifyToken, auth_1.requireAdmin, orderController_1.updateOrderStatus);
router.patch('/:id/delivery', auth_1.verifyToken, auth_1.requireAdmin, orderController_1.updateDeliveryStatus);
router.patch('/:id/payment', auth_1.verifyToken, auth_1.requireAdmin, orderController_1.updatePaymentStatus);
router.delete('/:id', auth_1.verifyToken, auth_1.requireAdmin, orderController_1.deleteOrder);
exports.default = router;
