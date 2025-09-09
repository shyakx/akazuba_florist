import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface OrderNotificationData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  totalAmount: number
  items: Array<{
    name: string
    quantity: number
    price: number
    image?: string
  }>
  paymentMethod: string
  notes?: string
  createdAt: string
  paymentProof?: {
    filename: string
    uploadedAt: string
  }
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    })
  }

  // Verify email configuration
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log('✅ Email service connection verified')
      return true
    } catch (error) {
      console.error('❌ Email service connection failed:', error)
      return false
    }
  }

  // Send order notification to admin
  async sendOrderNotification(orderData: OrderNotificationData): Promise<boolean> {
    try {
      // Check if email configuration is available
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ Email configuration missing, skipping email notification')
        return false
      }

      const adminEmail = process.env.ADMIN_EMAIL || 'info.akazubaflorist@gmail.com'
      
      const htmlContent = this.generateOrderNotificationHTML(orderData)
      const textContent = this.generateOrderNotificationText(orderData)

      const mailOptions: any = {
        from: `"Akazuba Florist" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `🌸 New Order #${orderData.orderNumber} - ${orderData.customerName}`,
        text: textContent,
        html: htmlContent
      }

      // Add payment proof as attachment if available
      if (orderData.paymentProof) {
        const fs = require('fs')
        const path = require('path')
        const uploadDir = process.env.UPLOAD_DIR || 'uploads'
        const paymentProofPath = path.join(uploadDir, 'payment-proofs', orderData.paymentProof.filename)
        
        // Check if file exists before attaching
        if (fs.existsSync(paymentProofPath)) {
          mailOptions.attachments = [
            {
              filename: `payment-proof-${orderData.orderNumber}.jpg`,
              path: paymentProofPath,
              cid: 'payment-proof-image' // Content ID for embedding in HTML
            }
          ]
          console.log('📎 Payment proof attached to email:', orderData.paymentProof.filename)
        } else {
          console.warn('⚠️ Payment proof file not found:', paymentProofPath)
        }
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('✅ Order notification email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('❌ Failed to send order notification email:', error)
      // Don't throw the error, just return false
      return false
    }
  }

  // Generate HTML content for order notification
  private generateOrderNotificationHTML(orderData: OrderNotificationData): string {
    const itemsHTML = orderData.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          RWF ${item.price.toLocaleString()}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          RWF ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('')

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b9d, #ff8fab); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-info { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .items-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .items-table th { background: #ff6b9d; color: white; padding: 15px; text-align: left; }
          .total-section { background: #ff6b9d; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px; }
          .customer-info { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 New Order Received!</h1>
            <p>Order #${orderData.orderNumber}</p>
          </div>
          
          <div class="content">
            <div class="order-info">
              <h2>📋 Order Details</h2>
              <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
              <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
              ${orderData.paymentProof ? `
                <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #4caf50;">
                  <h3 style="margin: 0 0 10px 0; color: #2e7d32;">💳 Payment Proof</h3>
                  <p><strong>File:</strong> ${orderData.paymentProof.filename}</p>
                  <p><strong>Uploaded:</strong> ${new Date(orderData.paymentProof.uploadedAt).toLocaleString()}</p>
                  <p><strong>Image Preview:</strong></p>
                  <img src="cid:payment-proof-image" alt="Payment Proof" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; margin-top: 10px;" />
                  <p style="font-size: 12px; color: #666; margin-top: 10px;"><em>📎 Full resolution image is attached to this email</em></p>
                </div>
              ` : ''}
              ${orderData.notes ? `<p><strong>Notes:</strong> ${orderData.notes}</p>` : ''}
            </div>

            <div class="customer-info">
              <h2>👤 Customer Information</h2>
              <p><strong>Name:</strong> ${orderData.customerName}</p>
              <p><strong>Email:</strong> ${orderData.customerEmail}</p>
              <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
              <p><strong>Address:</strong> ${orderData.customerAddress}, ${orderData.customerCity}</p>
            </div>

            <h2>🛍️ Order Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <div class="total-section">
              <h2>💰 Total Amount: RWF ${orderData.totalAmount.toLocaleString()}</h2>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.ADMIN_PANEL_URL || 'http://localhost:3000/admin/orders'}" 
                 style="background: #ff6b9d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                View Order in Admin Panel
              </a>
            </div>
          </div>

          <div class="footer">
            <p>This is an automated notification from Akazuba Florist</p>
            <p>Please check the admin panel for more details and to process this order.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate text content for order notification
  private generateOrderNotificationText(orderData: OrderNotificationData): string {
    const itemsText = orderData.items.map(item => 
      `- ${item.name} (Qty: ${item.quantity}) - RWF ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n')

    return `
🌸 NEW ORDER NOTIFICATION - Akazuba Florist

Order Number: ${orderData.orderNumber}
Order Date: ${new Date(orderData.createdAt).toLocaleString()}

CUSTOMER INFORMATION:
Name: ${orderData.customerName}
Email: ${orderData.customerEmail}
Phone: ${orderData.customerPhone}
Address: ${orderData.customerAddress}, ${orderData.customerCity}

ORDER ITEMS:
${itemsText}

Payment Method: ${orderData.paymentMethod}
${orderData.paymentProof ? `Payment Proof: ${orderData.paymentProof.filename}` : ''}
${orderData.paymentProof ? `Proof Uploaded: ${new Date(orderData.paymentProof.uploadedAt).toLocaleString()}` : ''}
${orderData.notes ? `Notes: ${orderData.notes}` : ''}

TOTAL AMOUNT: RWF ${orderData.totalAmount.toLocaleString()}

Please check the admin panel to process this order:
${process.env.ADMIN_PANEL_URL || 'http://localhost:3000/admin/orders'}

---
This is an automated notification from Akazuba Florist
    `.trim()
  }

  // Send order status update notification
  async sendOrderStatusUpdate(orderNumber: string, customerEmail: string, status: string): Promise<boolean> {
    try {
      // Check if email configuration is available
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ Email configuration missing, skipping status update email')
        return false
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b9d, #ff8fab); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌸 Order Status Update</h1>
              <p>Order #${orderNumber}</p>
            </div>
            <div class="content">
              <h2>Your order status has been updated to: <strong>${status}</strong></h2>
              <p>Thank you for choosing Akazuba Florist!</p>
            </div>
          </div>
        </body>
        </html>
      `

      const mailOptions = {
        from: `"Akazuba Florist" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `🌸 Order #${orderNumber} Status Update - ${status}`,
        html: htmlContent
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('✅ Order status update email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('❌ Failed to send order status update email:', error)
      // Don't throw the error, just return false
      return false
    }
  }
}

export const emailService = new EmailService()
