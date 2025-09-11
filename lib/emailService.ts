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

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  total: number
  items: OrderItem[]
  orderDate: string
  deliveryAddress?: string
  paymentMethod: string
  orderStatus: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private isConfigured = false

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    try {
      // Email configuration - you can set these as environment variables
      const emailConfig: EmailConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || 'shyakasteven2023@gmail.com',
          pass: process.env.SMTP_PASS || 'vpts dacf vzqu yixy'
        }
      }

      // Only create transporter if we have valid credentials
      if (emailConfig.auth.user && emailConfig.auth.pass) {
        this.transporter = nodemailer.createTransport(emailConfig)
        this.isConfigured = true
        console.log('✅ Email service configured successfully')
      } else {
        console.warn('⚠️ Email service not configured - missing SMTP credentials')
        this.isConfigured = false
      }
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error)
      this.isConfigured = false
    }
  }

  // Generate HTML email template for order notifications
  private generateOrderEmailHTML(data: OrderEmailData): string {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('en-RW', {
        style: 'currency',
        currency: 'RWF',
        minimumFractionDigits: 0,
      }).format(price)
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification - Akazuba Florist</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #ec4899, #be185d);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
            }
            .header p {
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 16px;
            }
            .content {
                padding: 30px;
            }
            .order-summary {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .order-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
            }
            .info-item {
                background-color: white;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #ec4899;
            }
            .info-label {
                font-weight: bold;
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
                margin-bottom: 5px;
            }
            .info-value {
                font-size: 16px;
                color: #333;
            }
            .items-section {
                margin: 30px 0;
            }
            .items-title {
                font-size: 20px;
                font-weight: bold;
                color: #333;
                margin-bottom: 20px;
                border-bottom: 2px solid #ec4899;
                padding-bottom: 10px;
            }
            .item {
                display: flex;
                align-items: center;
                background-color: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            .item-image {
                width: 80px;
                height: 80px;
                border-radius: 8px;
                object-fit: cover;
                margin-right: 15px;
                border: 2px solid #f3f4f6;
            }
            .item-details {
                flex: 1;
            }
            .item-name {
                font-weight: bold;
                font-size: 16px;
                color: #333;
                margin-bottom: 5px;
            }
            .item-price {
                color: #ec4899;
                font-weight: bold;
                font-size: 14px;
            }
            .item-quantity {
                color: #666;
                font-size: 14px;
            }
            .total-section {
                background: linear-gradient(135deg, #ec4899, #be185d);
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin: 20px 0;
            }
            .total-label {
                font-size: 16px;
                opacity: 0.9;
                margin-bottom: 5px;
            }
            .total-amount {
                font-size: 32px;
                font-weight: bold;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .footer a {
                color: #ec4899;
                text-decoration: none;
            }
            .status-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .status-pending {
                background-color: #fef3c7;
                color: #92400e;
            }
            .status-confirmed {
                background-color: #d1fae5;
                color: #065f46;
            }
            .status-processing {
                background-color: #dbeafe;
                color: #1e40af;
            }
            .status-shipped {
                background-color: #e0e7ff;
                color: #3730a3;
            }
            .status-delivered {
                background-color: #d1fae5;
                color: #065f46;
            }
            .status-cancelled {
                background-color: #fee2e2;
                color: #991b1b;
            }
            @media (max-width: 600px) {
                .order-info {
                    grid-template-columns: 1fr;
                }
                .item {
                    flex-direction: column;
                    text-align: center;
                }
                .item-image {
                    margin-right: 0;
                    margin-bottom: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌹 New Order Received</h1>
                <p>Akazuba Florist - Order Management System</p>
            </div>
            
            <div class="content">
                <div class="order-summary">
                    <div class="order-info">
                        <div class="info-item">
                            <div class="info-label">Order Number</div>
                            <div class="info-value">#${data.orderNumber}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Order Date</div>
                            <div class="info-value">${formatDate(data.orderDate)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Customer Name</div>
                            <div class="info-value">${data.customerName}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Customer Email</div>
                            <div class="info-value">${data.customerEmail}</div>
                        </div>
                        ${data.customerPhone ? `
                        <div class="info-item">
                            <div class="info-label">Phone Number</div>
                            <div class="info-value">${data.customerPhone}</div>
                        </div>
                        ` : ''}
                        <div class="info-item">
                            <div class="info-label">Payment Method</div>
                            <div class="info-value">${data.paymentMethod}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Order Status</div>
                            <div class="info-value">
                                <span class="status-badge status-${data.orderStatus.toLowerCase()}">
                                    ${data.orderStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    ${data.deliveryAddress ? `
                    <div class="info-item">
                        <div class="info-label">Delivery Address</div>
                        <div class="info-value">${data.deliveryAddress}</div>
                    </div>
                    ` : ''}
                </div>

                <div class="items-section">
                    <h2 class="items-title">📦 Ordered Items</h2>
                    ${data.items.map(item => `
                    <div class="item">
                        <img src="${item.image || '/images/placeholder-product.jpg'}" 
                             alt="${item.name}" 
                             class="item-image"
                             onerror="this.src='/images/placeholder-product.jpg'">
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-price">${formatPrice(item.price)} each</div>
                            <div class="item-quantity">Quantity: ${item.quantity}</div>
                        </div>
                    </div>
                    `).join('')}
                </div>

                <div class="total-section">
                    <div class="total-label">Total Order Value</div>
                    <div class="total-amount">${formatPrice(data.total)}</div>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated notification from Akazuba Florist Admin System.</p>
                <p>Please log in to your admin panel to manage this order.</p>
                <p><a href="https://akazubaflorist.com/admin/orders">View Order Details</a></p>
            </div>
        </div>
    </body>
    </html>
    `
  }

  // Send order notification email to admin
  async sendOrderNotificationEmail(orderData: OrderEmailData): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.warn('⚠️ Email service not configured, skipping email notification')
      return false
    }

    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'info.akazubaflorist@gmail.com'
      
      const mailOptions = {
        from: `"Akazuba Florist" <${process.env.SMTP_USER || 'info.akazubaflorist@gmail.com'}>`,
        to: adminEmail,
        subject: `🌹 New Order #${orderData.orderNumber} - ${orderData.customerName}`,
        html: this.generateOrderEmailHTML(orderData),
        // Also include a plain text version
        text: `
New Order Received - Akazuba Florist

Order Number: #${orderData.orderNumber}
Customer: ${orderData.customerName}
Email: ${orderData.customerEmail}
Phone: ${orderData.customerPhone || 'Not provided'}
Total: ${new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(orderData.total)}
Payment Method: ${orderData.paymentMethod}
Order Status: ${orderData.orderStatus}
Order Date: ${new Date(orderData.orderDate).toLocaleString()}

Items Ordered:
${orderData.items.map(item => `- ${item.name} (${item.quantity}x) - ${new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(item.price)} each`).join('\n')}

${orderData.deliveryAddress ? `Delivery Address: ${orderData.deliveryAddress}` : ''}

Please log in to your admin panel to manage this order.
        `
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('✅ Order notification email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('❌ Failed to send order notification email:', error)
      return false
    }
  }

  // Test email configuration
  async testEmailConfiguration(): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      return false
    }

    try {
      await this.transporter.verify()
      console.log('✅ Email configuration test successful')
      return true
    } catch (error) {
      console.error('❌ Email configuration test failed:', error)
      return false
    }
  }

  // Get configuration status
  isEmailConfigured(): boolean {
    return this.isConfigured
  }
}

// Create singleton instance
export const emailService = new EmailService()

// Export types for use in other files
export type { OrderEmailData, OrderItem }
