# 💰 Local Payment Setup Guide

## Overview
Akazuba Florist uses a simple local payment system where customers pay directly via MoMo or bank transfer, then upload proof of payment during checkout.

## 🏦 **Payment Methods**

### **1. Mobile Money (MoMo)**
- **Number**: 0784586110
- **Account Name**: Umwali Diane
- **Network**: MTN/Airtel
- **Instructions**: Customer sends money and takes screenshot

### **2. Bank Transfer**
- **Bank**: BK Bank
- **Account Number**: 100161182448
- **Account Name**: Umwali Diane
- **Instructions**: Customer transfers money and takes screenshot

## 📱 **Payment Flow**

### **Customer Side:**
1. **Select Products** → Add to cart
2. **Checkout** → Choose payment method
3. **Make Payment** → Send money via MoMo or bank transfer
4. **Upload Proof** → Take screenshot/photo of payment confirmation
5. **Submit Order** → Wait for admin verification

### **Admin Side:**
1. **Receive Order** → With payment proof attached
2. **Verify Payment** → Check payment proof against order
3. **Confirm Order** → Mark as paid and process
4. **Update Status** → Notify customer

## 🔧 **Technical Implementation**

### **File Upload for Payment Proof**
- **Supported Formats**: JPG, PNG, PDF
- **Max Size**: 5MB
- **Storage**: Cloudinary (cloud storage)
- **Security**: File type validation, size limits

### **Order Status Flow**
```
Pending → Payment Proof Uploaded → Payment Verified → Processing → Shipped → Delivered
```

## 📋 **Required Environment Variables**

### **File Upload (Cloudinary)**
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### **Email Notifications**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info.akazubaflorist@gmail.com
SMTP_PASS=your-gmail-app-password
```

## 🚫 **What's NOT Needed**

- ❌ Payment gateway APIs
- ❌ MoMo API integration
- ❌ Bank transfer APIs
- ❌ Payment processing fees
- ❌ Complex payment workflows
- ❌ PCI compliance
- ❌ Payment security certificates

## ✅ **Benefits of Local Payment**

1. **Simple Setup** - No complex API integration
2. **No Fees** - No payment processing charges
3. **Instant** - Money received immediately
4. **Familiar** - Customers know how to use MoMo/bank
5. **Secure** - No card details stored
6. **Reliable** - Works even with internet issues

## 📱 **Customer Instructions**

### **MoMo Payment:**
1. Open MoMo app
2. Send money to 0784586110
3. Add reference: "Your Name + Order ID"
4. Take screenshot of confirmation
5. Upload during checkout

### **Bank Transfer:**
1. Use your bank app/website
2. Transfer to account 100161182448
3. Add reference: "Your Name + Order ID"
4. Take screenshot of confirmation
5. Upload during checkout

## 🔍 **Payment Verification Tips**

### **Admin Checklist:**
- [ ] Payment amount matches order total
- [ ] Reference includes customer name
- [ ] Payment timestamp is recent
- [ ] Screenshot is clear and readable
- [ ] Payment method matches order selection

### **Common Issues:**
- **Wrong Amount**: Contact customer for adjustment
- **Missing Reference**: Ask customer to add reference
- **Unclear Screenshot**: Request better quality image
- **Wrong Payment Method**: Verify customer's choice

## 🚀 **Deployment Notes**

1. **No Payment API Keys** - Remove all payment-related environment variables
2. **File Upload Only** - Ensure Cloudinary is configured for payment proof storage
3. **Email Notifications** - Set up email alerts for new orders with payment proof
4. **Admin Training** - Train staff on payment verification process

---

**This approach simplifies your payment system while maintaining security and reliability!** 🎉
