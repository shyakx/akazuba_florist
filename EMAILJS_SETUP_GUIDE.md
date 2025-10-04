# 📧 EmailJS Setup Guide for AKAZUBA FLORIST

This guide will help you set up EmailJS to receive email notifications when customers place orders.

## 🚀 **Step 1: Create EmailJS Account**

1. **Go to [EmailJS.com](https://www.emailjs.com/)**
2. **Sign up** for a free account
3. **Verify your email** address

## 🔧 **Step 2: Create Email Service**

1. **In EmailJS Dashboard**:
   - Go to **"Email Services"**
   - Click **"Add New Service"**
   - Choose **"Gmail"** (recommended) or your preferred email provider
   - Follow the setup instructions for your email provider

2. **For Gmail**:
   - Service Name: `akazuba-florist`
   - Connect your Gmail account
   - Authorize EmailJS to send emails

## 📝 **Step 3: Create Email Template**

1. **Go to "Email Templates"** in EmailJS dashboard
2. **Click "Create New Template"**
3. **Template ID**: `template_order_notification`
4. **Template Name**: `AKAZUBA Order Notification`

### **Email Template Content:**

**Subject:**
```
New Order #{{order_number}} - AKAZUBA FLORIST
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Order - AKAZUBA FLORIST</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .order-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #16a34a; color: white; }
        .total { font-weight: bold; font-size: 18px; color: #16a34a; }
        .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌸 New Order Received - AKAZUBA FLORIST</h1>
    </div>
    
    <div class="content">
        <h2>Order Details</h2>
        <div class="order-details">
            <p><strong>Order Number:</strong> {{order_number}}</p>
            <p><strong>Order Date:</strong> {{order_date}}</p>
            <p><strong>Customer Name:</strong> {{customer_name}}</p>
            <p><strong>Customer Email:</strong> {{customer_email}}</p>
            <p><strong>Customer Phone:</strong> {{customer_phone}}</p>
            <p><strong>Delivery Address:</strong> {{delivery_address}}, {{delivery_city}}</p>
            <p><strong>Payment Method:</strong> {{payment_method}}</p>
        </div>

        <h3>Order Items</h3>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {{#each order_items}}
                <tr>
                    <td>{{this}}</td>
                </tr>
                {{/each}}
            </tbody>
        </table>

        <div class="order-details">
            <p><strong>Subtotal:</strong> {{subtotal}}</p>
            <p><strong>Delivery Fee:</strong> {{delivery_fee}}</p>
            <p class="total"><strong>Total Amount:</strong> {{total}}</p>
        </div>

        <h3>Additional Notes</h3>
        <p>{{notes}}</p>
    </div>

    <div class="footer">
        <p>This is an automated notification from AKAZUBA FLORIST</p>
        <p>Please process this order as soon as possible.</p>
    </div>
</body>
</html>
```

**Email Body (Plain Text - Alternative):**
```
🌸 NEW ORDER RECEIVED - AKAZUBA FLORIST

Order Details:
- Order Number: {{order_number}}
- Order Date: {{order_date}}
- Customer Name: {{customer_name}}
- Customer Email: {{customer_email}}
- Customer Phone: {{customer_phone}}
- Delivery Address: {{delivery_address}}, {{delivery_city}}
- Payment Method: {{payment_method}}

Order Items:
{{order_items}}

Order Summary:
- Subtotal: {{subtotal}}
- Delivery Fee: {{delivery_fee}}
- Total Amount: {{total}}

Additional Notes:
{{notes}}

---
This is an automated notification from AKAZUBA FLORIST
Please process this order as soon as possible.
```

## 🔑 **Step 4: Get Your Credentials**

1. **Go to "Account"** in EmailJS dashboard
2. **Copy your Public Key** (starts with `user_...`)
3. **Note your Service ID** (from step 2)
4. **Note your Template ID** (from step 3)

## ⚙️ **Step 5: Configure Environment Variables**

Add these to your `.env` file and Vercel environment variables:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_akazuba_florist
VITE_EMAILJS_TEMPLATE_ID=template_order_notification
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here

# Admin Email
VITE_ADMIN_EMAIL=info.akazubaflorist@gmail.com
```

## 🚀 **Step 6: Deploy and Test**

1. **Commit and push** your changes
2. **Deploy to Vercel** with the new environment variables
3. **Test by placing an order** on your live site
4. **Check your email** for the notification

## 📧 **Email Template Variables**

The following variables are available in your email template:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{order_number}}` | Order number | AKZ-2025-001 |
| `{{order_date}}` | Order date and time | January 15, 2025, 2:30 PM |
| `{{customer_name}}` | Customer's full name | John Doe |
| `{{customer_email}}` | Customer's email | john@example.com |
| `{{customer_phone}}` | Customer's phone | +250 784 586 110 |
| `{{delivery_address}}` | Delivery address | Kigali Heights, Apt 5 |
| `{{delivery_city}}` | Delivery city | Kigali |
| `{{payment_method}}` | Payment method | MTN MoMo |
| `{{subtotal}}` | Order subtotal | RWF 150,000 |
| `{{delivery_fee}}` | Delivery fee | RWF 5,000 |
| `{{total}}` | Total amount | RWF 155,000 |
| `{{notes}}` | Additional notes | Please deliver after 5 PM |
| `{{order_items}}` | List of ordered items | Rose Bouquet x2 - RWF 100,000 |

## 🔧 **Troubleshooting**

### **Email Not Sending:**
1. Check your EmailJS service is active
2. Verify your template ID is correct
3. Ensure your public key is valid
4. Check browser console for errors

### **Template Variables Not Working:**
1. Make sure variable names match exactly
2. Use double curly braces: `{{variable_name}}`
3. Test with simple variables first

### **Fallback Email:**
If EmailJS fails, the system will automatically open a mailto link with the order details.

## 📊 **EmailJS Limits (Free Plan)**

- **200 emails/month**
- **2 email services**
- **2 email templates**
- **1,000 API calls/month**

For higher limits, consider upgrading to a paid plan.

## 🎯 **Next Steps**

1. **Set up EmailJS** following this guide
2. **Create the email template** with the provided content
3. **Add environment variables** to Vercel
4. **Test the email notifications**
5. **Customize the email template** to match your brand

---

**Your AKAZUBA FLORIST will now automatically send email notifications for every new order! 🌸**
