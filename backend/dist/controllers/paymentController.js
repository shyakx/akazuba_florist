"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
class PaymentController {
    constructor() {
        // Initiate Payment (Simplified - no external API calls)
        this.initiatePayment = async (req, res) => {
            try {
                const paymentData = req.body;
                // Validate required fields
                if (!paymentData.orderId || !paymentData.amount || !paymentData.paymentMethod) {
                    res.status(400).json({
                        success: false,
                        message: 'Missing required fields: orderId, amount, paymentMethod'
                    });
                    return;
                }
                // Validate payment method
                const validMethods = ['bank_transfer', 'cash_on_delivery', 'payment_proof'];
                if (!validMethods.includes(paymentData.paymentMethod)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid payment method. Supported methods: bank_transfer, cash_on_delivery, payment_proof'
                    });
                    return;
                }
                // Check if order exists
                const order = await prisma.order.findUnique({
                    where: { id: paymentData.orderId }
                });
                if (!order) {
                    res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                    return;
                }
                // Generate payment reference
                const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                // Update order with payment method and status
                const updatedOrder = await prisma.order.update({
                    where: { id: paymentData.orderId },
                    data: {
                        paymentMethod: paymentData.paymentMethod.toUpperCase(),
                        paymentStatus: 'PENDING',
                        notes: paymentData.description || `Payment initiated via ${paymentData.paymentMethod}`
                    }
                });
                logger_1.logger.info('Payment initiated successfully:', {
                    orderId: paymentData.orderId,
                    amount: paymentData.amount,
                    method: paymentData.paymentMethod,
                    reference: paymentReference
                });
                // Return payment instructions based on method
                let instructions = '';
                switch (paymentData.paymentMethod) {
                    case 'bank_transfer':
                        instructions = 'Please transfer the amount to our bank account. Account details will be provided separately.';
                        break;
                    case 'cash_on_delivery':
                        instructions = 'Payment will be collected upon delivery.';
                        break;
                    case 'payment_proof':
                        instructions = 'Please upload your payment proof (screenshot/receipt) after making the payment.';
                        break;
                }
                res.status(200).json({
                    success: true,
                    message: 'Payment initiated successfully',
                    data: {
                        orderId: paymentData.orderId,
                        reference: paymentReference,
                        amount: paymentData.amount,
                        paymentMethod: paymentData.paymentMethod,
                        status: 'PENDING',
                        instructions: instructions
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Payment initiation failed:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to initiate payment'
                });
            }
        };
        // Check Payment Status
        this.checkPaymentStatus = async (req, res) => {
            try {
                const { orderId } = req.params;
                const order = await prisma.order.findUnique({
                    where: { id: orderId }
                });
                if (!order) {
                    res.status(404).json({
                        success: false,
                        message: 'Order not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: {
                        orderId: order.id,
                        orderNumber: order.orderNumber,
                        amount: order.totalAmount,
                        paymentMethod: order.paymentMethod,
                        paymentStatus: order.paymentStatus,
                        status: order.status
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Payment status check failed:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to check payment status'
                });
            }
        };
        // Update Payment Status (for admin)
        this.updatePaymentStatus = async (req, res) => {
            try {
                const { orderId } = req.params;
                const { paymentStatus, notes } = req.body;
                const validStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
                if (!validStatuses.includes(paymentStatus)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid status. Valid statuses: PENDING, PAID, FAILED, REFUNDED'
                    });
                    return;
                }
                const order = await prisma.order.update({
                    where: { id: orderId },
                    data: {
                        paymentStatus: paymentStatus,
                        adminNotes: notes,
                        updatedAt: new Date()
                    }
                });
                logger_1.logger.info('Payment status updated:', {
                    orderId,
                    paymentStatus,
                    orderNumber: order.orderNumber
                });
                res.status(200).json({
                    success: true,
                    message: 'Payment status updated successfully',
                    data: {
                        orderId: order.id,
                        orderNumber: order.orderNumber,
                        paymentStatus: order.paymentStatus
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Payment status update failed:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to update payment status'
                });
            }
        };
        // Get Payment Methods
        this.getPaymentMethods = async (req, res) => {
            try {
                const paymentMethods = [
                    {
                        id: 'bank_transfer',
                        name: 'Bank Transfer',
                        description: 'Transfer money directly to our bank account',
                        icon: '🏦'
                    },
                    {
                        id: 'cash_on_delivery',
                        name: 'Cash on Delivery',
                        description: 'Pay with cash when your order is delivered',
                        icon: '💵'
                    },
                    {
                        id: 'payment_proof',
                        name: 'Payment Proof',
                        description: 'Upload proof of payment (screenshot/receipt)',
                        icon: '📸'
                    }
                ];
                res.status(200).json({
                    success: true,
                    data: paymentMethods
                });
            }
            catch (error) {
                logger_1.logger.error('Failed to get payment methods:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to get payment methods'
                });
            }
        };
    }
}
exports.default = new PaymentController();
