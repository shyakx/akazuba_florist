# 🔐 Real Values Guide for Akazuba Florist

This guide will help you replace all placeholders with real, working values.

## 🚀 **Generated Secrets (Use These!)**

### **JWT Configuration**
```bash
JWT_SECRET=ePEjU/59G45QozOIFHr1k/C+iPDkoVKT61QbZxYtqEQ=
JWT_REFRESH_SECRET=Xoan1HrOMCvIaPm0OxDKpzML/wAoPfo54iqFu/cn6gg=
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### **Payment Configuration (Local Payment)**
```bash
# No API keys needed - users pay locally and upload proof
# Payment methods: MoMo (0784586110), Bank Transfer (100161182448)
# Users upload screenshot/photo of payment confirmation
```

### **SendGrid (Email Service)**
```bash
SENDGRID_API_KEY=fe64608c0325e89e27562ded5bb26046b28d044f8688cea1053e375f3b27cd57
SENDGRID_FROM_EMAIL=info.akazubaflorist@gmail.com
SENDGRID_FROM_NAME=Akazuba Florist
```

## 🌐 **3. Get Real Service URLs**

### **Redis (Choose One Option)**

#### **Option A: Free Redis Cloud (Recommended for Start)**
1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Create free account
3. Create database
4. Get connection string like:
```bash
REDIS_URL=redis://default:YF7BaUSjbRCq8xKYWOFrbGZ8k6ylyRka@redis-14974.c9.us-east-1-4.ec2.redns.redis-cloud.com:14974
```

#### **Option B: Render Redis (Paid)**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create new Redis service
3. Get connection string

#### **Option C: Local Redis (Development Only)**
```bash
REDIS_URL=redis://localhost:6379
```

### **Cloudinary (Image Storage)**

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Get credentials from dashboard:
```bash
CLOUDINARY_CLOUD_NAME=dkhac7xh2
CLOUDINARY_API_KEY=194878579547962
CLOUDINARY_API_SECRET=wZbXGj1VgByURl-VxRJ25CPcVVs
```

### **Email Service (Choose One)**

#### **Option A: Gmail SMTP (Free)**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info.akazubaflorist@gmail.com
SMTP_PASS=jugo hasc bepe zdeh
```
**Note**: You need to generate an "App Password" in Gmail settings

#### **Option B: SendGrid (Free Tier)**
```bash
SENDGRID_API_KEY=SG.your-api-key-here
SENDGRID_FROM_EMAIL=info.akazubaflorist@gmail.com
SENDGRID_FROM_NAME=Akazuba Florist
```

## 🔧 **4. Update Environment Files**

### **Backend .env.production.example**
Replace all placeholders with real values from above.

### **Frontend Environment Variables**
```bash
NEXT_PUBLIC_API_URL=https://akazuba-backend-api.onrender.com/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dkhac7xh2
# No payment API keys needed - local payment only
```

## 📱 **5. Local Payment Setup**

### **Payment Methods**
- **MoMo**: 0784586110 (Umwali Diane)
- **Bank Transfer**: 100161182448 (Umwali Diane - BK Bank)

### **Payment Proof Upload**
Users will:
1. Make payment locally via MoMo or bank transfer
2. Take screenshot/photo of payment confirmation
3. Upload proof during checkout
4. Order processed after payment verification

### **No API Integration Needed**
- Simple file upload for payment proof
- Manual verification by admin
- No complex payment gateway setup required

## 🧪 **6. Testing Real Values**

### **Test Redis Connection**
```bash
redis-cli -u "your-redis-url" ping
```

### **Test Cloudinary**
Upload a test image to verify credentials work.

### **Test Email Service**
Send a test email to verify SMTP/SendGrid works.

## ⚠️ **Security Notes**

1. **Never commit real secrets to Git**
2. **Use environment variables in production**
3. **Rotate secrets regularly**
4. **Monitor API usage and costs**
5. **Start with free tiers, upgrade as needed**

## 🚀 **Next Steps**

1. Update your environment files with real values
2. Test all services work correctly
3. Deploy with real credentials
4. Monitor for any errors
5. Set up proper monitoring and alerts

---

**Need Help?** Contact the service providers directly for support with their APIs.
