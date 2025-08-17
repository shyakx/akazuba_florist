import { Request, Response } from 'express'
import { logger } from '../utils/logger'

interface MoMoPaymentRequest {
  amount: number
  phoneNumber: string
  reference: string
  description: string
}

interface MoMoTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface MoMoCollectionRequest {
  amount: string
  currency: string
  externalId: string
  payer: {
    partyIdType: string
    partyId: string
  }
  payerMessage: string
  payeeNote: string
}

class MoMoController {
  private baseURL: string
  private apiKey: string
  private apiUser: string
  private targetEnvironment: string
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    this.baseURL = process.env.MOMO_API_URL || 'https://sandbox.momodeveloper.mtn.com'
    this.apiKey = process.env.MOMO_API_KEY || ''
    this.apiUser = process.env.MOMO_API_USER || ''
    this.targetEnvironment = process.env.MOMO_ENVIRONMENT || 'sandbox'
  }

  // Get Access Token
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      logger.info('Attempting to get MTN MoMo access token...', {
        baseURL: this.baseURL,
        apiUser: this.apiUser,
        targetEnvironment: this.targetEnvironment
      })

      const response = await fetch(`${this.baseURL}/collection/token/`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiUser}:${this.apiKey}`).toString('base64')}`,
          'X-Reference-Id': this.generateReferenceId(),
          'X-Target-Environment': this.targetEnvironment,
          'Ocp-Apim-Subscription-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      })

      logger.info('MTN MoMo token response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        logger.error('MTN MoMo token request failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        })
        throw new Error(`Token request failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json() as MoMoTokenResponse
      
      logger.info('MTN MoMo token received successfully')
      
      this.accessToken = result.access_token
      this.tokenExpiry = Date.now() + (result.expires_in * 1000) - 60000 // Expire 1 minute early
      
      return this.accessToken
    } catch (error) {
      logger.error('Failed to get MoMo access token:', error)
      throw new Error('Failed to authenticate with MTN MoMo API')
    }
  }

  // Format Phone Number for MTN MoMo
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '')
    
    // If it starts with 0, replace with 250
    if (cleaned.startsWith('0')) {
      return '250' + cleaned.substring(1)
    }
    
    // If it starts with +250, remove the +
    if (cleaned.startsWith('250')) {
      return cleaned
    }
    
    // If it's already in the correct format, return as is
    if (cleaned.length === 12 && cleaned.startsWith('250')) {
      return cleaned
    }
    
    // Default: assume it's a local number and add 250
    return '250' + cleaned
  }

  // Generate Reference ID
  private generateReferenceId(): string {
    return `AKAZUBA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  // Initiate Payment
  initiatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const paymentData: MoMoPaymentRequest = req.body

      // Validate required fields
      if (!paymentData.amount || !paymentData.phoneNumber || !paymentData.reference) {
        res.status(400).json({
          status: 'error',
          message: 'Missing required fields: amount, phoneNumber, reference'
        })
        return
      }

      const token = await this.getAccessToken()
      const referenceId = this.generateReferenceId()

      const payload: MoMoCollectionRequest = {
        amount: paymentData.amount.toString(),
        currency: 'EUR', // MTN MoMo uses EUR for Rwanda
        externalId: paymentData.reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: this.formatPhoneNumber(paymentData.phoneNumber)
        },
        payerMessage: `Payment for ${paymentData.description}`,
        payeeNote: `Akazuba Florist - ${paymentData.reference}`
      }

      // Use v2.0 endpoint for better compatibility
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
      })

      if (!response.ok) {
        const errorData = await response.json() as any
        logger.error('MTN MoMo API error:', errorData)
        
        res.status(response.status).json({
          status: 'error',
          message: errorData.message || 'Failed to initiate MoMo payment'
        })
        return
      }

      const result = await response.json() as any
      
      logger.info('MoMo payment initiated successfully:', {
        referenceId,
        amount: paymentData.amount,
        phoneNumber: paymentData.phoneNumber
      })

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
      })
    } catch (error) {
      logger.error('MoMo payment initiation failed:', error)
      res.status(500).json({
        status: 'error',
        message: 'Failed to initiate MoMo payment'
      })
    }
  }

  // Check Payment Status
  checkPaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { referenceId } = req.params

      if (!referenceId) {
        res.status(400).json({
          status: 'error',
          message: 'Reference ID is required'
        })
        return
      }

      const token = await this.getAccessToken()

      // Use v2.0 endpoint for status check
      const response = await fetch(`${this.baseURL}/collection/v2_0/requesttopay/${referenceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Target-Environment': this.targetEnvironment,
          'Ocp-Apim-Subscription-Key': this.apiKey
        }
      })

      if (!response.ok) {
        const errorData = await response.json() as any
        logger.error('MTN MoMo status check error:', errorData)
        
        res.status(response.status).json({
          status: 'error',
          message: errorData.message || 'Failed to check payment status'
        })
        return
      }

      const result = await response.json() as any
      
      logger.info('MoMo payment status checked:', {
        referenceId,
        status: result.status
      })

      res.status(200).json(result)
    } catch (error) {
      logger.error('MoMo status check failed:', error)
      res.status(500).json({
        status: 'error',
        message: 'Failed to check payment status'
      })
    }
  }

  // Get Account Balance
  getAccountBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = await this.getAccessToken()

      // Use v2.0 endpoint for balance check
      const response = await fetch(`${this.baseURL}/collection/v2_0/account/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Target-Environment': this.targetEnvironment,
          'Ocp-Apim-Subscription-Key': this.apiKey
        }
      })

      if (!response.ok) {
        const errorData = await response.json() as any
        logger.error('MTN MoMo balance check error:', errorData)
        
        res.status(response.status).json({
          status: 'error',
          message: errorData.message || 'Failed to get account balance'
        })
        return
      }

      const result = await response.json() as any
      
      logger.info('MoMo account balance retrieved successfully')

      res.status(200).json(result)
    } catch (error) {
      logger.error('MoMo balance check failed:', error)
      res.status(500).json({
        status: 'error',
        message: 'Failed to get account balance'
      })
    }
  }
}

export const momoController = new MoMoController() 