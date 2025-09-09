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

  // Send password reset email
  async sendPasswordResetEmail(userEmail: string, userName: string, resetLink: string): Promise<boolean> {
    try {
      // Check if email configuration is available
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ Email configuration missing, skipping password reset email')
        return false
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - Akazuba Florist</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b9d, #ff8fab); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 10px; margin-top: 20px; }
            .button { display: inline-block; background: #ff6b9d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌸 Password Reset Request</h1>
              <p>Akazuba Florist</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>We received a request to reset your password for your Akazuba Florist account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetLink}" class="button">Reset My Password</a>
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>For security, don't share this link with anyone</li>
                </ul>
              </div>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 3px;">${resetLink}</p>
              <p>Thank you for choosing Akazuba Florist!</p>
            </div>
          </div>
        </body>
        </html>
      `

      const textContent = `
Password Reset Request - Akazuba Florist

Hello ${userName}!

We received a request to reset your password for your Akazuba Florist account.

To reset your password, click the link below:
${resetLink}

⚠️ Important:
- This link will expire in 1 hour
- If you didn't request this reset, please ignore this email
- For security, don't share this link with anyone

Thank you for choosing Akazuba Florist!

---
This is an automated email from Akazuba Florist
      `.trim()

      const mailOptions = {
        from: `"Akazuba Florist" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: '🌸 Password Reset Request - Akazuba Florist',
        html: htmlContent,
        text: textContent
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('✅ Password reset email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error)
      // Don't throw the error, just return false
      return false
    }
  }

  // Support ticket notification to admin
  async sendSupportTicketNotification(ticket: any): Promise<boolean> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'info.akazubaflorist@gmail.com'
      
      const mailOptions = {
        from: `"Akazuba Florist Support" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Support Ticket: ${ticket.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">🌸 New Support Ticket</h1>
            </div>
            
            <div style="padding: 20px; background: #f8f9fa;">
              <h2 style="color: #333; margin-top: 0;">Ticket Details</h2>
              
              <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <p><strong>Subject:</strong> ${ticket.subject}</p>
                <p><strong>Customer:</strong> ${ticket.customerName}</p>
                <p><strong>Email:</strong> ${ticket.customerEmail}</p>
                <p><strong>Priority:</strong> ${ticket.priority}</p>
                <p><strong>Status:</strong> ${ticket.status}</p>
                <p><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              
              <div style="background: white; padding: 15px; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #333;">Message:</h3>
                <p style="white-space: pre-wrap;">${ticket.message}</p>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.FRONTEND_URL}/admin/support" 
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View in Admin Panel
                </a>
              </div>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; text-align: center; color: #6c757d; font-size: 12px;">
              <p>This is an automated notification from Akazuba Florist Support System</p>
            </div>
          </div>
        `
      }

      await this.transporter.sendMail(mailOptions)
      console.log('✅ Support ticket notification sent to admin')
      return true
    } catch (error) {
      console.error('❌ Failed to send support ticket notification:', error)
      return false
    }
  }

  // Support ticket status update notification to customer
  async sendSupportTicketStatusUpdate(customerEmail: string, subject: string, status: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Akazuba Florist Support" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `Support Ticket Update: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">🌸 Support Ticket Update</h1>
            </div>
            
            <div style="padding: 20px; background: #f8f9fa;">
              <h2 style="color: #333; margin-top: 0;">Your Support Ticket Has Been Updated</h2>
              
              <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>New Status:</strong> 
                  <span style="background: ${this.getStatusColor(status)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${status.replace('_', ' ')}
                  </span>
                </p>
                <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
                <p style="margin: 0; color: #1976d2;">
                  <strong>What this means:</strong><br>
                  ${this.getStatusMessage(status)}
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <p>If you have any questions, please don't hesitate to contact us.</p>
                <p><strong>Phone:</strong> +250 784 586 110<br>
                <strong>Email:</strong> info.akazubaflorist@gmail.com</p>
              </div>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; text-align: center; color: #6c757d; font-size: 12px;">
              <p>Thank you for choosing Akazuba Florist! 🌸</p>
            </div>
          </div>
        `
      }

      await this.transporter.sendMail(mailOptions)
      console.log('✅ Support ticket status update sent to customer')
      return true
    } catch (error) {
      console.error('❌ Failed to send support ticket status update:', error)
      return false
    }
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return '#ff9800'
      case 'IN_PROGRESS': return '#2196f3'
      case 'RESOLVED': return '#4caf50'
      case 'CLOSED': return '#9e9e9e'
      default: return '#6c757d'
    }
  }

  private getStatusMessage(status: string): string {
    switch (status) {
      case 'PENDING': return 'We have received your support request and it is in our queue. We will review it shortly.'
      case 'IN_PROGRESS': return 'We are currently working on your support request. You will receive updates as we progress.'
      case 'RESOLVED': return 'Your support request has been resolved! If you need further assistance, please let us know.'
      case 'CLOSED': return 'This support ticket has been closed. If you need further assistance, please create a new ticket.'
      default: return 'Your support request status has been updated.'
    }
  }
}

export const emailService = new EmailService()
