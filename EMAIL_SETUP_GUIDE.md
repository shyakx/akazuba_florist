# 📧 Email Notification Setup Guide

## 🚀 **OVERVIEW**

The Akazuba Florist system now includes automatic email notifications for admin when new orders are placed. The system sends beautiful HTML emails with product images and order details.

## ⚙️ **EMAIL CONFIGURATION**

### **1. Environment Variables**

Create a `.env.local` file in your project root with the following variables:

```bash
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info.akazubaflorist@gmail.com
SMTP_PASS=your-app-password

# Admin Email
ADMIN_EMAIL=info.akazubaflorist@gmail.com

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
BACKEND_API_URL=http://localhost:5000/api/v1
```

### **2. Gmail Setup (Recommended)**

**Step 1: Enable 2-Factor Authentication**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to Security → 2-Step Verification
3. Enable 2-Factor Authentication

**Step 2: Generate App Password**
1. Go to Security → App passwords
2. Select "Mail" and "Other (custom name)"
3. Enter "Akazuba Florist" as the name
4. Copy the generated 16-character password
5. Use this password in `SMTP_PASS`

**Step 3: Update Environment Variables**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info.akazubaflorist@gmail.com
SMTP_PASS=your-16-character-app-password
ADMIN_EMAIL=info.akazubaflorist@gmail.com
```

### **3. Alternative Email Providers**

**Outlook/Hotmail:**
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**Yahoo:**
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

**Custom SMTP:**
```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password
```

## 📧 **EMAIL FEATURES**

### **What's Included in Order Emails:**

✅ **Order Information:**
- Order number and date
- Customer details (name, email, phone)
- Delivery address
- Payment method
- Order status

✅ **Product Details:**
- Product images (with fallback)
- Product names and prices
- Quantities ordered
- Individual and total pricing

✅ **Professional Design:**
- Responsive HTML template
- Akazuba Florist branding
- Mobile-friendly layout
- Status badges and visual indicators

✅ **Admin Actions:**
- Direct link to admin panel
- Order management instructions
- Quick access to order details

## 🔧 **TESTING EMAIL CONFIGURATION**

### **1. Test Email Setup**

Visit: `http://localhost:3000/api/admin/orders/notify`

**GET Request** - Check configuration status:
```bash
curl http://localhost:3000/api/admin/orders/notify
```

**Expected Response:**
```json
{
  "success": true,
  "emailConfigured": true,
  "emailTestPassed": true,
  "message": "Email service is configured and working"
}
```

### **2. Send Test Email**

**POST Request** - Send test notification:
```bash
curl -X POST http://localhost:3000/api/admin/orders/notify \
  -H "Content-Type: application/json" \
  -d '{
    "orderData": {
      "orderNumber": "TEST-001",
      "customerName": "Test Customer",
      "customerEmail": "test@example.com",
      "customerPhone": "0781234567",
      "total": 50000,
      "items": [
        {
          "id": "1",
          "name": "Red Rose Bouquet",
          "price": 25000,
          "quantity": 2,
          "image": "https://example.com/rose-bouquet.jpg"
        }
      ],
      "orderDate": "2024-01-15T10:00:00Z",
      "deliveryAddress": "Kigali, Rwanda",
      "paymentMethod": "MoMo",
      "orderStatus": "Pending"
    }
  }'
```

## 🎯 **AUTOMATIC EMAIL TRIGGERS**

### **When Emails Are Sent:**

1. **New Order Creation** - Automatically sent when:
   - Customer places an order
   - Admin creates an order manually
   - Order is created via API

2. **Order Status Updates** - Can be configured to send when:
   - Order status changes to "Confirmed"
   - Order status changes to "Shipped"
   - Order status changes to "Delivered"

### **Email Recipients:**

- **Primary:** Admin email (configured in `ADMIN_EMAIL`)
- **Secondary:** Can be extended to include multiple admins
- **Customer:** Can be added for order confirmations

## 🛠️ **TROUBLESHOOTING**

### **Common Issues:**

**1. "Email service not configured"**
- Check if `.env.local` file exists
- Verify all SMTP variables are set
- Ensure no typos in variable names

**2. "Authentication failed"**
- Verify email and password are correct
- For Gmail, use App Password (not regular password)
- Check if 2FA is enabled for Gmail

**3. "Connection timeout"**
- Check SMTP host and port
- Verify firewall settings
- Try different SMTP port (465 for SSL)

**4. "Emails not received"**
- Check spam/junk folder
- Verify admin email address
- Test with different email provider

### **Debug Steps:**

1. **Check Environment Variables:**
```bash
# In your terminal
echo $SMTP_USER
echo $SMTP_PASS
```

2. **Test SMTP Connection:**
```bash
# Test with telnet
telnet smtp.gmail.com 587
```

3. **Check Application Logs:**
```bash
# Look for email-related logs
npm run dev
# Check console for email service messages
```

## 📱 **MOBILE EMAIL COMPATIBILITY**

The email templates are fully responsive and work on:
- ✅ Gmail (mobile and web)
- ✅ Outlook (mobile and web)
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Other email clients

## 🔒 **SECURITY CONSIDERATIONS**

1. **Never commit `.env.local` to version control**
2. **Use App Passwords for Gmail (not regular passwords)**
3. **Consider using environment-specific email accounts**
4. **Regularly rotate SMTP credentials**
5. **Monitor email sending limits and quotas**

## 📊 **EMAIL ANALYTICS**

Future enhancements can include:
- Email open tracking
- Click tracking
- Delivery status monitoring
- Email template A/B testing

## 🎨 **CUSTOMIZING EMAIL TEMPLATES**

The email template is located in `lib/emailService.ts`. You can customize:
- Colors and branding
- Layout and structure
- Additional information
- Call-to-action buttons
- Footer content

---

**Need Help?** Contact the development team or check the application logs for detailed error messages.
