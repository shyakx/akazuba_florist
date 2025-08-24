"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.momoController = void 0;
const logger_1 = require("../utils/logger");
class MoMoController {
    constructor() {
        this.accessToken = null;
        this.tokenExpiry = 0;
        this.initiatePayment = async (req, res) => {
            try {
                const paymentData = req.body;
                if (!paymentData.amount || !paymentData.phoneNumber || !paymentData.reference) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Missing required fields: amount, phoneNumber, reference'
                    });
                    return;
                }
                const token = await this.getAccessToken();
                const referenceId = this.generateReferenceId();
                const payload = {
                    amount: paymentData.amount.toString(),
                    currency: 'EUR',
                    externalId: paymentData.reference,
                    payer: {
                        partyIdType: 'MSISDN',
                        partyId: this.formatPhoneNumber(paymentData.phoneNumber)
                    },
                    payerMessage: `Payment for ${paymentData.description}`,
                    payeeNote: `Akazuba Florist - ${paymentData.reference}`
                };
                const response = await fetch(`${this.baseURL}/collection/v2_0/requesttopay`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Reference-Id': referenceId,
                        'X-Target-Environment': this.targetEnvironment,
                        'Ocp-Apim-Subscription-Key': this.apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    logger_1.logger.error('MTN MoMo API error:', errorData);
                    res.status(response.status).json({
                        status: 'error',
                        message: errorData.message || 'Failed to initiate MoMo payment'
                    });
                    return;
                }
                const result = await response.json();
                logger_1.logger.info('MoMo payment initiated successfully:', {
                    referenceId,
                    amount: paymentData.amount,
                    phoneNumber: paymentData.phoneNumber
                });
                res.status(200).json({
                    status: 'SUCCESSFUL',
                    message: 'Payment request sent successfully',
                    data: {
                        amount: paymentData.amount.toString(),
                        currency: 'EUR',
                        financialTransactionId: referenceId,
                        externalId: paymentData.reference,
                        payer: {
                            partyIdType: 'MSISDN',
                            partyId: this.formatPhoneNumber(paymentData.phoneNumber)
                        },
                        status: 'PENDING',
                        reason: 'Payment request sent to customer'
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('MoMo payment initiation failed:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to initiate MoMo payment'
                });
            }
        };
        this.checkPaymentStatus = async (req, res) => {
            try {
                const { referenceId } = req.params;
                if (!referenceId) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Reference ID is required'
                    });
                    return;
                }
                const token = await this.getAccessToken();
                const response = await fetch(`${this.baseURL}/collection/v2_0/requesttopay/${referenceId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Target-Environment': this.targetEnvironment,
                        'Ocp-Apim-Subscription-Key': this.apiKey
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    logger_1.logger.error('MTN MoMo status check error:', errorData);
                    res.status(response.status).json({
                        status: 'error',
                        message: errorData.message || 'Failed to check payment status'
                    });
                    return;
                }
                const result = await response.json();
                logger_1.logger.info('MoMo payment status checked:', {
                    referenceId,
                    status: result.status
                });
                res.status(200).json(result);
            }
            catch (error) {
                logger_1.logger.error('MoMo status check failed:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to check payment status'
                });
            }
        };
        this.getAccountBalance = async (req, res) => {
            try {
                const token = await this.getAccessToken();
                const response = await fetch(`${this.baseURL}/collection/v2_0/account/balance`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Target-Environment': this.targetEnvironment,
                        'Ocp-Apim-Subscription-Key': this.apiKey
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    logger_1.logger.error('MTN MoMo balance check error:', errorData);
                    res.status(response.status).json({
                        status: 'error',
                        message: errorData.message || 'Failed to get account balance'
                    });
                    return;
                }
                const result = await response.json();
                logger_1.logger.info('MoMo account balance retrieved successfully');
                res.status(200).json(result);
            }
            catch (error) {
                logger_1.logger.error('MoMo balance check failed:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to get account balance'
                });
            }
        };
        this.baseURL = process.env.MOMO_API_URL || 'https://sandbox.momodeveloper.mtn.com';
        this.apiKey = process.env.MOMO_API_KEY || '';
        this.apiUser = process.env.MOMO_API_USER || '';
        this.targetEnvironment = process.env.MOMO_ENVIRONMENT || 'sandbox';
    }
    async getAccessToken() {
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }
        try {
            logger_1.logger.info('Attempting to get MTN MoMo access token...', {
                baseURL: this.baseURL,
                apiUser: this.apiUser,
                targetEnvironment: this.targetEnvironment
            });
            const response = await fetch(`${this.baseURL}/collection/token/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${this.apiUser}:${this.apiKey}`).toString('base64')}`,
                    'X-Reference-Id': this.generateReferenceId(),
                    'X-Target-Environment': this.targetEnvironment,
                    'Ocp-Apim-Subscription-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });
            logger_1.logger.info('MTN MoMo token response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                logger_1.logger.error('MTN MoMo token request failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText: errorText
                });
                throw new Error(`Token request failed: ${response.status} - ${errorText}`);
            }
            const result = await response.json();
            logger_1.logger.info('MTN MoMo token received successfully');
            this.accessToken = result.access_token;
            this.tokenExpiry = Date.now() + (result.expires_in * 1000) - 60000;
            return this.accessToken;
        }
        catch (error) {
            logger_1.logger.error('Failed to get MoMo access token:', error);
            throw new Error('Failed to authenticate with MTN MoMo API');
        }
    }
    formatPhoneNumber(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            return '250' + cleaned.substring(1);
        }
        if (cleaned.startsWith('250')) {
            return cleaned;
        }
        if (cleaned.length === 12 && cleaned.startsWith('250')) {
            return cleaned;
        }
        return '250' + cleaned;
    }
    generateReferenceId() {
        return `AKAZUBA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
}
exports.momoController = new MoMoController();
//# sourceMappingURL=momoController.js.map