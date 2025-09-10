// Email template utilities for order notifications

import { Order, formatOrderForEmail } from './orderUtils'

// Generate HTML email template for order confirmation
export const generateOrderConfirmationEmail = (order: Order): string => {
  const orderData = formatOrderForEmail(order)
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${orderData.orderNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #ddd; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
    .product-image { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #e9ecef; }
    .product-item { display: flex; align-items: center; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    .product-info { margin-left: 15px; flex: 1; }
    .product-name { font-weight: bold; margin-bottom: 5px; }
    .product-details { color: #666; font-size: 14px; }
    .order-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .total-row { border-top: 2px solid #dee2e6; padding-top: 10px; font-weight: bold; font-size: 18px; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-processing { background: #cce5ff; color: #004085; }
    .status-shipped { background: #d1ecf1; color: #0c5460; }
    .status-delivered { background: #d4edda; color: #155724; }
    .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌹 Akazuba Florist</h1>
      <h2>Order Confirmation</h2>
      <p>Thank you for your order, ${orderData.customerName}!</p>
    </div>
    
    <div class="content">
      <div style="text-align: center; margin-bottom: 30px;">
        <h3>Order #${orderData.orderNumber}</h3>
        <span class="status-badge status-${orderData.status}">${orderData.status}</span>
      </div>
      
      <h4>📦 Your Order Items</h4>
      ${orderData.items.map(item => `
        <div class="product-item">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" class="product-image">` : '<div class="product-image" style="background: #e9ecef; display: flex; align-items: center; justify-content: center; color: #666;">📦</div>'}
          <div class="product-info">
            <div class="product-name">${item.name}</div>
            <div class="product-details">
              Quantity: ${item.quantity} | Price: RWF ${item.price.toLocaleString()} | Total: RWF ${item.total.toLocaleString()}
            </div>
          </div>
        </div>
      `).join('')}
      
      <div class="order-summary">
        <h4>💰 Order Summary</h4>
        <div class="summary-row">
          <span>Items (${orderData.itemCount})</span>
          <span>RWF ${orderData.totalValue.toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span>Delivery</span>
          <span>RWF 0</span>
        </div>
        <div class="summary-row total-row">
          <span>Total</span>
          <span>RWF ${orderData.totalAmount.toLocaleString()}</span>
        </div>
      </div>
      
      <div style="margin: 30px 0;">
        <h4>📍 Delivery Information</h4>
        <p><strong>Address:</strong> ${orderData.deliveryAddress}</p>
        <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="#" class="btn">Track Your Order</a>
      </div>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing Akazuba Florist! 🌹</p>
      <p>For any questions, please contact us at info@akazubaflorist.com</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Generate text email template for order confirmation
export const generateOrderConfirmationText = (order: Order): string => {
  const orderData = formatOrderForEmail(order)
  
  return `
Order Confirmation - Akazuba Florist

Dear ${orderData.customerName},

Thank you for your order! Here are the details:

Order Number: ${orderData.orderNumber}
Status: ${orderData.status.toUpperCase()}
Order Date: ${new Date(orderData.createdAt).toLocaleDateString()}

Your Order Items:
${orderData.items.map(item => 
  `- ${item.name} (Qty: ${item.quantity}) - RWF ${item.total.toLocaleString()}`
).join('\n')}

Order Summary:
Items (${orderData.itemCount}): RWF ${orderData.totalValue.toLocaleString()}
Delivery: RWF 0
Total: RWF ${orderData.totalAmount.toLocaleString()}

Delivery Information:
Address: ${orderData.deliveryAddress}

Thank you for choosing Akazuba Florist!
For any questions, please contact us at info@akazubaflorist.com
  `.trim()
}

// Generate order update email template
export const generateOrderUpdateEmail = (order: Order, updateType: 'status' | 'delivery'): string => {
  const orderData = formatOrderForEmail(order)
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update - ${orderData.orderNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #ddd; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
    .update-highlight { background: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; }
    .product-image { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 2px solid #e9ecef; }
    .product-item { display: flex; align-items: center; margin-bottom: 15px; }
    .product-info { margin-left: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌹 Akazuba Florist</h1>
      <h2>Order Update</h2>
      <p>Your order status has been updated!</p>
    </div>
    
    <div class="content">
      <div class="update-highlight">
        <h3>📋 Order #${orderData.orderNumber}</h3>
        <p><strong>New Status:</strong> ${orderData.status.toUpperCase()}</p>
        <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <h4>Your Order Items:</h4>
      ${orderData.items.map(item => `
        <div class="product-item">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" class="product-image">` : '<div class="product-image" style="background: #e9ecef; display: flex; align-items: center; justify-content: center; color: #666;">📦</div>'}
          <div class="product-info">
            <strong>${item.name}</strong><br>
            <small>Quantity: ${item.quantity} | RWF ${item.total.toLocaleString()}</small>
          </div>
        </div>
      `).join('')}
      
      <div style="margin: 30px 0;">
        <h4>📍 Delivery Information</h4>
        <p><strong>Address:</strong> ${orderData.deliveryAddress}</p>
        <p><strong>Total Amount:</strong> RWF ${orderData.totalAmount.toLocaleString()}</p>
      </div>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing Akazuba Florist! 🌹</p>
      <p>For any questions, please contact us at info@akazubaflorist.com</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
