// MTN MoMo Payment API Integration for Akazuba Florist
// Direct MTN MoMo integration for Rwanda
// Routes through backend to avoid CORS issues

interface PaymentRequest {
  amount: number
  phoneNumber: string
  reference: string
  description: string
}

interface PaymentResponse {
  status: string
  message: string
  data: {
    financialTransactionId: string
    externalId: string
    amount: string
    currency: string
    status: string
  }
}

interface PaymentVerification {
  status: string
  message: string
  data: {
    financialTransactionId: string
    externalId: string
    amount: string
    currency: string
    status: string
    reason?: string
  }
}

class PaymentAPI {
  private baseURL: string

  constructor() {
    // Use our backend as proxy to avoid CORS issues
    this.baseURL = (() => {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        // Server-side rendering - use environment variable
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      }

      // Client-side - check current hostname
      const hostname = window.location.hostname
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
      
      if (isLocalhost) {
        // Development - use localhost
        console.log('🔧 Payment API: Using localhost for development')
        return 'http://localhost:5000/api/v1'
      } else {
        // Production - use environment variable or production URL
        const productionUrl = process.env.NEXT_PUBLIC_API_URL || 'https://akazuba-backend-api.onrender.com/api/v1'
        console.log('🔧 Payment API: Using production API:', productionUrl)
        return productionUrl
      }
    })()
  }

  // Initialize MTN MoMo Payment
  async initiateMoMoPayment(paymentData: {
    amount: number
    phoneNumber: string
    email: string
    customerName: string
    reference: string
  }): Promise<PaymentResponse> {
    try {
      const payload = {
        amount: paymentData.amount,
        phoneNumber: paymentData.phoneNumber,
        reference: paymentData.reference,
        description: `Payment for ${paymentData.customerName}`
      }

      const response = await fetch(`${this.baseURL}/momo/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('MTN MoMo payment initiation failed:', error)
      throw new Error('Failed to initiate MTN MoMo payment')
    }
  }

  // Verify MTN MoMo Payment Status
  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    try {
      const response = await fetch(`${this.baseURL}/momo/payment-status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('MTN MoMo payment verification failed:', error)
      throw new Error('Failed to verify MTN MoMo payment')
    }
  }

  // Generate Payment Reference
  generatePaymentReference(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    return `AKAZUBA-${timestamp}-${random.toUpperCase()}`
  }

  // Format Phone Number for Rwanda
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '')
    
    // If it starts with 0, replace with +250
    if (cleaned.startsWith('0')) {
      return '+250' + cleaned.substring(1)
    }
    
    // If it starts with 250, add +
    if (cleaned.startsWith('250')) {
      return '+' + cleaned
    }
    
    // If it's already in international format, return as is
    if (cleaned.startsWith('250')) {
      return '+' + cleaned
    }
    
    // Default: assume it's a local number and add +250
    return '+250' + cleaned
  }
}

// Export singleton instance
export const paymentAPI = new PaymentAPI()

// Export types for use in components
export type { PaymentRequest, PaymentResponse, PaymentVerification } 