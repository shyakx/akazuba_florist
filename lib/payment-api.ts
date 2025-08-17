// Real Payment API Integration for Akazuba Florist
// Using Flutterwave for MoMo and Bank transfers in Rwanda
// Routes through backend to avoid CORS issues

interface PaymentRequest {
  amount: number
  currency: string
  email: string
  phone_number: string
  tx_ref: string
  redirect_url: string
  customer: {
    email: string
    phone_number: string
    name: string
  }
  customizations: {
    title: string
    description: string
    logo: string
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

class PaymentAPI {
  private baseURL: string

  constructor() {
    // Use our backend as proxy to avoid CORS issues
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
  }

  // Initialize MoMo Payment
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
        currency: 'RWF',
        email: paymentData.email,
        phoneNumber: paymentData.phoneNumber,
        customerName: paymentData.customerName,
        reference: paymentData.reference,
        redirectUrl: `${window.location.origin}/payment/callback`,
        paymentType: 'momo'
      }

      const response = await fetch(`${this.baseURL}/payments/initiate`, {
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
      console.error('MoMo payment initiation failed:', error)
      throw new Error('Failed to initiate MoMo payment')
    }
  }

  // Initialize Bank Transfer Payment
  async initiateBankTransfer(paymentData: {
    amount: number
    accountNumber: string
    accountName: string
    email: string
    reference: string
  }): Promise<PaymentResponse> {
    try {
      const payload = {
        amount: paymentData.amount,
        currency: 'RWF',
        email: paymentData.email,
        accountNumber: paymentData.accountNumber,
        accountName: paymentData.accountName,
        reference: paymentData.reference,
        redirectUrl: `${window.location.origin}/payment/callback`,
        paymentType: 'bank_transfer'
      }

      const response = await fetch(`${this.baseURL}/payments/initiate`, {
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
      console.error('Bank transfer initiation failed:', error)
      throw new Error('Failed to initiate bank transfer')
    }
  }

  // Verify Payment Status
  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    try {
      const response = await fetch(`${this.baseURL}/payments/verify/${transactionId}`, {
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
      console.error('Payment verification failed:', error)
      throw new Error('Failed to verify payment')
    }
  }

  // Get Bank Transfer Details
  async getBankTransferDetails(transactionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/payments/transfer/${transactionId}`, {
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
      console.error('Bank transfer details fetch failed:', error)
      throw new Error('Failed to get bank transfer details')
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