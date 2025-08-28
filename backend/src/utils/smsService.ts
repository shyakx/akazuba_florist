import axios from 'axios'

interface SMSConfig {
  apiUrl: string
  apiKey: string
  apiUser: string
  environment: 'sandbox' | 'production'
}

class SMSService {
  private config: SMSConfig

  constructor() {
    this.config = {
      apiUrl: process.env.MOMO_API_URL || 'https://sandbox.momodeveloper.mtn.com',
      apiKey: process.env.MOMO_API_KEY || '',
      apiUser: process.env.MOMO_API_USER || '',
      environment: (process.env.MOMO_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
    }
  }

  // Send SMS notification to admin
  async sendAdminNotification(message: string): Promise<boolean> {
    try {
      const adminPhone = '+250784586110'
      
      // For now, we'll log the message since MTN integration requires proper setup
      console.log('📱 SMS Notification to Admin:')
      console.log('📞 Phone:', adminPhone)
      console.log('💬 Message:', message)
      console.log('⏰ Time:', new Date().toISOString())
      
      // TODO: Implement actual MTN SMS API call when MTN API credentials are available
      // This would require proper MTN API credentials and setup
      
      return true
    } catch (error) {
      console.error('Failed to send SMS notification:', error)
      return false
    }
  }

  // Send order notification
  async sendOrderNotification(orderNumber: string, customerName: string, total: number): Promise<boolean> {
    const message = `🌸 New Order ${orderNumber}: ${customerName} - RWF ${total.toLocaleString()}`
    return this.sendAdminNotification(message)
  }

  // Send status update notification
  async sendStatusUpdateNotification(orderNumber: string, status: string): Promise<boolean> {
    const message = `📦 Order ${orderNumber} status updated to: ${status}`
    return this.sendAdminNotification(message)
  }

  // Send payment notification
  async sendPaymentNotification(orderNumber: string, paymentStatus: string): Promise<boolean> {
    const message = `💳 Order ${orderNumber} payment status: ${paymentStatus}`
    return this.sendAdminNotification(message)
  }

  // Send delivery notification
  async sendDeliveryNotification(orderNumber: string, deliveryStatus: string): Promise<boolean> {
    const message = `🚚 Order ${orderNumber} delivery status: ${deliveryStatus}`
    return this.sendAdminNotification(message)
  }
}

export const smsService = new SMSService() 