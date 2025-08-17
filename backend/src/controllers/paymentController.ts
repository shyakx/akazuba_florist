import { Request, Response } from 'express'
import { logger } from '../utils/logger'

interface PaymentRequest {
  amount: number
  currency: string
  email: string
  phoneNumber?: string
  customerName?: string
  accountNumber?: string
  accountName?: string
  reference: string
  redirectUrl: string
  paymentType: 'momo' | 'bank_transfer'
}

interface FlutterwavePaymentRequest {
  amount: number
  currency: string
  email: string
  phone_number?: string
  tx_ref: string
  redirect_url: string
  customer: {
    email: string
    phone_number?: string
    name?: string
  }
  customizations: {
    title: string
    description: string
    logo: string
  }
  payment_options?: string
  bank_transfer_options?: {
    expires: number
  }
}

interface PaymentResponse {
  status: string
  message: string
  data: {
    link: string
    reference: string
    status: string
  }
}

interface PaymentVerification {
  status: string
  message: string
  data: {
    id: number
    tx_ref: string
    flw_ref: string
    amount: number
    currency: string
    charged_amount: number
    app_fee: number
    merchant_fee: number
    processor_response: string
    auth_model: string
    ip: string
    narration: string
    status: string
    payment_type: string
    created_at: string
    account_id: number
    customer: {
      id: number
      phone_number: string
      name: string
      email: string
      created_at: string
    }
    meta: any
    amount_settled: number
    subaccounts: any[]
    charge_response: any
  }
}

class PaymentController {
  private baseURL: string
  private secretKey: string

  constructor() {
    this.baseURL = 'https://api.flutterwave.com/v3'
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || ''
  }

  // Initialize payment (MoMo or Bank Transfer)
  initiatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const paymentData: PaymentRequest = req.body

      // Validate required fields
      if (!paymentData.amount || !paymentData.email || !paymentData.reference) {
        res.status(400).json({
          status: 'error',
          message: 'Missing required fields: amount, email, reference'
        })
        return
      }

      // Prepare Flutterwave payload
      const flutterwavePayload: FlutterwavePaymentRequest = {
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
      }

      // Add payment-specific data
      if (paymentData.paymentType === 'momo') {
        if (!paymentData.phoneNumber || !paymentData.customerName) {
          res.status(400).json({
            status: 'error',
            message: 'Missing required fields for MoMo payment: phoneNumber, customerName'
          })
          return
        }

        flutterwavePayload.phone_number = paymentData.phoneNumber
        flutterwavePayload.customer.phone_number = paymentData.phoneNumber
        flutterwavePayload.customer.name = paymentData.customerName
      } else if (paymentData.paymentType === 'bank_transfer') {
        if (!paymentData.accountNumber || !paymentData.accountName) {
          res.status(400).json({
            status: 'error',
            message: 'Missing required fields for bank transfer: accountNumber, accountName'
          })
          return
        }

        flutterwavePayload.payment_options = 'banktransfer'
        flutterwavePayload.bank_transfer_options = {
          expires: 30 // 30 minutes
        }
        flutterwavePayload.customer.name = paymentData.accountName
      }

      // Call Flutterwave API
      const response = await fetch(`${this.baseURL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(flutterwavePayload)
      })

      if (!response.ok) {
        const errorData = await response.json() as any
        logger.error('Flutterwave API error:', errorData)
        
        res.status(response.status).json({
          status: 'error',
          message: errorData.message || 'Failed to initiate payment with Flutterwave'
        })
        return
      }

      const result = await response.json() as PaymentResponse
      
      logger.info('Payment initiated successfully:', {
        reference: paymentData.reference,
        amount: paymentData.amount,
        type: paymentData.paymentType
      })

      res.status(200).json(result)
    } catch (error) {
      logger.error('Payment initiation failed:', error)
      res.status(500).json({
        status: 'error',
        message: 'Internal server error during payment initiation'
      })
    }
  }

  // Verify payment status
  verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { transactionId } = req.params

      if (!transactionId) {
        res.status(400).json({
          status: 'error',
          message: 'Transaction ID is required'
        })
        return
      }

      // Call Flutterwave verification API
      const response = await fetch(`${this.baseURL}/transactions/${transactionId}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json() as any
        logger.error('Flutterwave verification error:', errorData)
        
        res.status(response.status).json({
          status: 'error',
          message: errorData.message || 'Failed to verify payment with Flutterwave'
        })
        return
      }

      const result = await response.json() as PaymentVerification
      
      logger.info('Payment verification completed:', {
        transactionId,
        status: result.data?.status
      })

      res.status(200).json(result)
    } catch (error) {
      logger.error('Payment verification failed:', error)
      res.status(500).json({
        status: 'error',
        message: 'Internal server error during payment verification'
      })
    }
  }

  // Get bank transfer details
  getBankTransferDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { transactionId } = req.params

      if (!transactionId) {
        res.status(400).json({
          status: 'error',
          message: 'Transaction ID is required'
        })
        return
      }

      // Call Flutterwave transfer details API
      const response = await fetch(`${this.baseURL}/transfers/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json() as any
        logger.error('Flutterwave transfer details error:', errorData)
        
        res.status(response.status).json({
          status: 'error',
          message: errorData.message || 'Failed to get transfer details from Flutterwave'
        })
        return
      }

      const result = await response.json() as any
      
      logger.info('Bank transfer details retrieved:', {
        transactionId,
        status: result.data?.status
      })

      res.status(200).json(result)
    } catch (error) {
      logger.error('Bank transfer details fetch failed:', error)
      res.status(500).json({
        status: 'error',
        message: 'Internal server error during transfer details fetch'
      })
    }
  }

  // Handle webhook notifications from Flutterwave
  handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const webhookData = req.body

      logger.info('Payment webhook received:', {
        event: webhookData.event,
        transactionId: webhookData.data?.tx_ref,
        status: webhookData.data?.status
      })

      // Verify webhook signature (recommended for production)
      // const signature = req.headers['verif-hash']
      // if (!this.verifyWebhookSignature(signature, req.body)) {
      //   res.status(401).json({ status: 'error', message: 'Invalid webhook signature' })
      //   return
      // }

      // Process webhook based on event type
      switch (webhookData.event) {
        case 'charge.completed':
          // Payment completed successfully
          await this.handlePaymentSuccess(webhookData.data)
          break
        case 'charge.failed':
          // Payment failed
          await this.handlePaymentFailure(webhookData.data)
          break
        case 'transfer.completed':
          // Bank transfer completed
          await this.handleTransferSuccess(webhookData.data)
          break
        default:
          logger.info('Unhandled webhook event:', webhookData.event)
      }

      res.status(200).json({ status: 'success', message: 'Webhook processed' })
    } catch (error) {
      logger.error('Webhook processing failed:', error)
      res.status(500).json({
        status: 'error',
        message: 'Internal server error during webhook processing'
      })
    }
  }

  // Handle successful payment
  private async handlePaymentSuccess(paymentData: any): Promise<void> {
    try {
      logger.info('Payment successful:', {
        transactionId: paymentData.tx_ref,
        amount: paymentData.amount,
        customer: paymentData.customer?.email
      })

      // Here you would:
      // 1. Update order status in database
      // 2. Send confirmation email to customer
      // 3. Send notification to admin
      // 4. Update inventory
      // 5. Generate invoice

      // For now, just log the success
      logger.info('Order processing completed for payment:', paymentData.tx_ref)
    } catch (error) {
      logger.error('Error handling payment success:', error)
    }
  }

  // Handle failed payment
  private async handlePaymentFailure(paymentData: any): Promise<void> {
    try {
      logger.warn('Payment failed:', {
        transactionId: paymentData.tx_ref,
        reason: paymentData.failure_reason
      })

      // Here you would:
      // 1. Update order status to failed
      // 2. Send failure notification to customer
      // 3. Restore cart items
      // 4. Log the failure for analysis

      logger.info('Payment failure processed for:', paymentData.tx_ref)
    } catch (error) {
      logger.error('Error handling payment failure:', error)
    }
  }

  // Handle successful bank transfer
  private async handleTransferSuccess(transferData: any): Promise<void> {
    try {
      logger.info('Bank transfer successful:', {
        transactionId: transferData.reference,
        amount: transferData.amount,
        bank: transferData.bank_name
      })

      // Process similar to payment success
      logger.info('Bank transfer processing completed for:', transferData.reference)
    } catch (error) {
      logger.error('Error handling transfer success:', error)
    }
  }

  // Verify webhook signature (for production)
  private verifyWebhookSignature(signature: string | undefined, payload: any): boolean {
    // Implement webhook signature verification
    // This is important for security in production
    return true // Placeholder
  }
}

export const paymentController = new PaymentController() 