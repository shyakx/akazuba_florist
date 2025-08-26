// MTN MoMo API Integration for Akazuba Florist
// Backend proxy integration to avoid CORS issues

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

interface MoMoCollectionResponse {
  status: string
  message: string
  data: {
    amount: string
    currency: string
    financialTransactionId: string
    externalId: string
    payer: {
      partyIdType: string
      partyId: string
    }
    status: string
    reason: string
  }
}

class MoMoAPI {
  private baseURL: string

  constructor() {
    // Route through our backend proxy to avoid CORS
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
    this.baseURL = `${apiUrl}/momo`
  }

  // Request Payment from Customer (via backend proxy)
  async requestToPay(paymentData: {
    amount: number
    phoneNumber: string
    reference: string
    description: string
  }): Promise<MoMoCollectionResponse> {
    try {
      const response = await fetch(`${this.baseURL}/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`MoMo payment request failed: ${errorData.message || response.statusText}`)
      }

      const result: MoMoCollectionResponse = await response.json()
      return result
    } catch (error) {
      console.error('MoMo payment request failed:', error)
      throw new Error('Failed to initiate MoMo payment')
    }
  }

  // Check Payment Status (via backend proxy)
  async checkPaymentStatus(referenceId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/payment-status/${referenceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('MoMo status check failed:', error)
      throw new Error('Failed to check payment status')
    }
  }

  // Validate Phone Number
  validatePhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '')
    
    // If it starts with 0, replace with 250
    if (cleaned.startsWith('0')) {
      const formatted = '250' + cleaned.substring(1)
      return /^2507[2389][0-9]{7}$/.test(formatted)
    }
    
    // If it starts with +250, remove the +
    if (cleaned.startsWith('250')) {
      return /^2507[2389][0-9]{7}$/.test(cleaned)
    }
    
    // If it's already in the correct format, return as is
    if (cleaned.length === 12 && cleaned.startsWith('250')) {
      return /^2507[2389][0-9]{7}$/.test(cleaned)
    }
    
    // Default: assume it's a local number and add 250
    const formatted = '250' + cleaned
    return /^2507[2389][0-9]{7}$/.test(formatted)
  }
}

// Export singleton instance
export const momoAPI = new MoMoAPI()

// Export types for use in components
export type { MoMoCollectionRequest, MoMoCollectionResponse } 