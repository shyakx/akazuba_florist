"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const logger_1 = require("../utils/logger");
class PaymentController {
    constructor() {
        this.initiatePayment = async (req, res) => {
            try {
                const paymentData = req.body;
                if (!paymentData.amount || !paymentData.email || !paymentData.reference) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Missing required fields: amount, email, reference'
                    });
                    return;
                }
                const flutterwavePayload = {
                    amount: paymentData.amount,
                    currency: paymentData.currency || 'RWF',
                    email: paymentData.email,
                    tx_ref: paymentData.reference,
                    redirect_url: paymentData.redirectUrl,
                    customer: {
                        email: paymentData.email
                    },
                    customizations: {
                        title: 'Akazuba Florist',
                        description: 'Payment for your flower order',
                        logo: 'https://akazuba-florist.com/logo.png'
                    }
                };
                if (paymentData.paymentType === 'momo') {
                    if (!paymentData.phoneNumber || !paymentData.customerName) {
                        res.status(400).json({
                            status: 'error',
                            message: 'Missing required fields for MoMo payment: phoneNumber, customerName'
                        });
                        return;
                    }
                    flutterwavePayload.phone_number = paymentData.phoneNumber;
                    flutterwavePayload.customer.phone_number = paymentData.phoneNumber;
                    flutterwavePayload.customer.name = paymentData.customerName;
                }
                else if (paymentData.paymentType === 'bank_transfer') {
                    if (!paymentData.accountNumber || !paymentData.accountName) {
                        res.status(400).json({
                            status: 'error',
                            message: 'Missing required fields for bank transfer: accountNumber, accountName'
                        });
                        return;
                    }
                    flutterwavePayload.payment_options = 'banktransfer';
                    flutterwavePayload.bank_transfer_options = {
                        expires: 30
                    };
                    flutterwavePayload.customer.name = paymentData.accountName;
                }
                const response = await fetch(`${this.baseURL}/payments`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.secretKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(flutterwavePayload)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    logger_1.logger.error('Flutterwave API error:', errorData);
                    res.status(response.status).json({
                        status: 'error',
                        message: errorData.message || 'Failed to initiate payment with Flutterwave'
                    });
                    return;
                }
                const result = await response.json();
                logger_1.logger.info('Payment initiated successfully:', {
                    reference: paymentData.reference,
                    amount: paymentData.amount,
                    type: paymentData.paymentType
                });
                res.status(200).json(result);
            }
            catch (error) {
                logger_1.logger.error('Payment initiation failed:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Internal server error during payment initiation'
                });
            }
        };
        this.verifyPayment = async (req, res) => {
            try {
                const { transactionId } = req.params;
                if (!transactionId) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Transaction ID is required'
                    });
                    return;
                }
                const response = await fetch(`${this.baseURL}/transactions/${transactionId}/verify`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.secretKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    logger_1.logger.error('Flutterwave verification error:', errorData);
                    res.status(response.status).json({
                        status: 'error',
                        message: errorData.message || 'Failed to verify payment with Flutterwave'
                    });
                    return;
                }
                const result = await response.json();
                logger_1.logger.info('Payment verification completed:', {
                    transactionId,
                    status: result.data?.status
                });
                res.status(200).json(result);
            }
            catch (error) {
                logger_1.logger.error('Payment verification failed:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Internal server error during payment verification'
                });
            }
        };
        this.getBankTransferDetails = async (req, res) => {
            try {
                const { transactionId } = req.params;
                if (!transactionId) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Transaction ID is required'
                    });
                    return;
                }
                const response = await fetch(`${this.baseURL}/transfers/${transactionId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.secretKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    logger_1.logger.error('Flutterwave transfer details error:', errorData);
                    res.status(response.status).json({
                        status: 'error',
                        message: errorData.message || 'Failed to get transfer details from Flutterwave'
                    });
                    return;
                }
                const result = await response.json();
                logger_1.logger.info('Bank transfer details retrieved:', {
                    transactionId,
                    status: result.data?.status
                });
                res.status(200).json(result);
            }
            catch (error) {
                logger_1.logger.error('Bank transfer details fetch failed:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Internal server error during transfer details fetch'
                });
            }
        };
        this.handleWebhook = async (req, res) => {
            try {
                const webhookData = req.body;
                logger_1.logger.info('Payment webhook received:', {
                    event: webhookData.event,
                    transactionId: webhookData.data?.tx_ref,
                    status: webhookData.data?.status
                });
                switch (webhookData.event) {
                    case 'charge.completed':
                        await this.handlePaymentSuccess(webhookData.data);
                        break;
                    case 'charge.failed':
                        await this.handlePaymentFailure(webhookData.data);
                        break;
                    case 'transfer.completed':
                        await this.handleTransferSuccess(webhookData.data);
                        break;
                    default:
                        logger_1.logger.info('Unhandled webhook event:', webhookData.event);
                }
                res.status(200).json({ status: 'success', message: 'Webhook processed' });
            }
            catch (error) {
                logger_1.logger.error('Webhook processing failed:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Internal server error during webhook processing'
                });
            }
        };
        this.baseURL = 'https://api.flutterwave.com/v3';
        this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || '';
    }
    async handlePaymentSuccess(paymentData) {
        try {
            logger_1.logger.info('Payment successful:', {
                transactionId: paymentData.tx_ref,
                amount: paymentData.amount,
                customer: paymentData.customer?.email
            });
            logger_1.logger.info('Order processing completed for payment:', paymentData.tx_ref);
        }
        catch (error) {
            logger_1.logger.error('Error handling payment success:', error);
        }
    }
    async handlePaymentFailure(paymentData) {
        try {
            logger_1.logger.warn('Payment failed:', {
                transactionId: paymentData.tx_ref,
                reason: paymentData.failure_reason
            });
            logger_1.logger.info('Payment failure processed for:', paymentData.tx_ref);
        }
        catch (error) {
            logger_1.logger.error('Error handling payment failure:', error);
        }
    }
    async handleTransferSuccess(transferData) {
        try {
            logger_1.logger.info('Bank transfer successful:', {
                transactionId: transferData.reference,
                amount: transferData.amount,
                bank: transferData.bank_name
            });
            logger_1.logger.info('Bank transfer processing completed for:', transferData.reference);
        }
        catch (error) {
            logger_1.logger.error('Error handling transfer success:', error);
        }
    }
    verifyWebhookSignature(signature, payload) {
        return true;
    }
}
exports.paymentController = new PaymentController();
//# sourceMappingURL=paymentController.js.map