# 📧 Email Notification Setup Guide

## Overview
This guide explains how to set up email notifications for the Akazuba Florist application. When customers place orders, the admin will receive detailed email notifications.

## Required Environment Variables

Add these variables to your `.env` file in the backend directory:

```env
# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Admin Configuration
ADMIN_EMAIL="info.akazubaflorist@gmail.com"
ADMIN_PANEL_URL="http://localhost:3000/admin/orders"
```

## Gmail Setup (Recommended)

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication

### 2. Generate App Password
- Go to Google Account → Security → App passwords
- Generate a new app password for "Mail"
- Use this password as `SMTP_PASS` (not your regular Gmail password)

### 3. Configure Environment Variables
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-16-character-app-password"
ADMIN_EMAIL="info.akazubaflorist@gmail.com"
```

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

### Yahoo Mail
```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@yahoo.com"
SMTP_PASS="your-app-password"
```

### Custom SMTP Server
```env
SMTP_HOST="your-smtp-server.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-username"
SMTP_PASS="your-password"
```

## Features

### 📧 Admin Order Notifications
- **Trigger**: When a customer places an order
- **Recipient**: Admin email address
- **Content**: 
  - Order details (number, date, total)
  - Customer information
  - Itemized product list
  - Payment method
  - Delivery address
  - Direct link to admin panel

### 📧 Customer Status Updates
- **Trigger**: When admin updates order status
- **Recipient**: Customer email
- **Content**: Order status change notification

## Email Templates

### Admin Order Notification
- Beautiful HTML template with Akazuba branding
- Responsive design for mobile and desktop
- Complete order details in table format
- Direct link to admin panel for order processing

### Customer Status Update
- Simple, clean design
- Order number and new status
- Professional Akazuba branding

## Testing

### 1. Verify Email Configuration
The system will automatically verify the email connection on startup. Check the console for:
```
✅ Email service connection verified
```

### 2. Test Order Notification
1. Place a test order through the frontend
2. Check the admin email inbox
3. Verify the email contains all order details

### 3. Test Status Update
1. Update an order status in the admin panel
2. Check the customer's email inbox
3. Verify the status update notification

## Troubleshooting

### Common Issues

#### "Connection failed" Error
- Verify SMTP credentials are correct
- Check if 2FA is enabled and app password is used
- Ensure SMTP server allows connections from your IP

#### "Authentication failed" Error
- Use app password instead of regular password for Gmail
- Verify username is the full email address
- Check if "Less secure app access" is enabled (not recommended)

#### Emails not being sent
- Check console logs for error messages
- Verify `ADMIN_EMAIL` is set correctly
- Ensure SMTP server is not blocking your requests

### Debug Mode
Add this to your `.env` for detailed logging:
```env
DEBUG_EMAIL="true"
```

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use app passwords** instead of regular passwords
3. **Enable 2FA** on your email account
4. **Use environment-specific** email addresses for testing

## Production Deployment

For production deployment:

1. **Use a dedicated email service** like SendGrid, Mailgun, or AWS SES
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Monitor email delivery** and bounce rates
4. **Implement rate limiting** to prevent abuse

## Example Production Configuration (SendGrid)

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
ADMIN_EMAIL="info.akazubaflorist@gmail.com"
ADMIN_PANEL_URL="https://yourdomain.com/admin/orders"
```

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Test with a simple email client first
4. Contact support with specific error messages
