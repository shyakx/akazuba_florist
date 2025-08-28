# 🚀 Akazuba Florist Deployment Guide

This guide will help you deploy the Akazuba Florist application using:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Render PostgreSQL

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - [vercel.com](https://vercel.com)
3. **Render Account** - [render.com](https://render.com)
4. **Cloudinary Account** (for image uploads) - [cloudinary.com](https://cloudinary.com)
5. **Email Service** (Gmail or other SMTP provider)

## 🗄️ Step 1: Deploy Database on Render

### 1.1 Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `akazuba-database`
   - **Database**: `akazuba_florist`
   - **User**: `akazuba_user`
   - **Region**: Choose closest to your users
   - **Plan**: Start with **Starter** (free tier)

### 1.2 Save Database Credentials
After creation, note down:
- **Internal Database URL** (for backend)
- **External Database URL** (for local development)

## 🔧 Step 2: Deploy Backend on Render

### 2.1 Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

```yaml
Name: akazuba-backend
Root Directory: backend
Environment: Node
Build Command: npm install && npm run build
Start Command: npm start
```

### 2.2 Set Environment Variables
Add these environment variables in Render:

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=<your-render-postgresql-internal-url>
JWT_SECRET=akazuba-jwt-secret-2024-production-super-secure
CORS_ORIGIN=https://online-shopping-by-diane.vercel.app

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=akazuba-florist
CLOUDINARY_API_KEY=your-cloudinary-api-key-here
CLOUDINARY_API_SECRET=your-cloudinary-api-secret-here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=akazuba.florist@gmail.com
SMTP_PASS=your-gmail-app-password-here

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
```

### 2.3 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for the build to complete
3. Note the service URL (e.g., `https://akazuba-backend.onrender.com`)

## 🌐 Step 3: Deploy Frontend on Vercel

### 3.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `/` (root of your project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3.2 Set Environment Variables
Add these environment variables in Vercel:

```bash
NEXT_PUBLIC_API_URL=https://akazuba-backend.onrender.com/api/v1
NEXT_PUBLIC_JWT_SECRET=akazuba-jwt-secret-2024-production-super-secure
NEXT_PUBLIC_PAYMENT_PUBLIC_KEY=akazuba-payment-public-key-2024
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=akazuba-florist
```

### 3.3 Deploy Frontend
1. Click **"Deploy"**
2. Wait for the build to complete
3. Note your frontend URL (e.g., `https://akazuba-florist.vercel.app`)

## 🔄 Step 4: Update CORS Configuration

### 4.1 Update Backend CORS
In your Render backend service, update the `CORS_ORIGIN` environment variable:
```bash
CORS_ORIGIN=https://online-shopping-by-diane.vercel.app
```

### 4.2 Redeploy Backend
Trigger a new deployment in Render to apply the CORS changes.

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Backend
Visit your backend health endpoint:
```
https://akazuba-backend.onrender.com/health
```

### 5.2 Test Frontend
Visit your frontend URL and test:
- User registration/login
- Product browsing
- Cart functionality
- Checkout process

### 5.3 Test Database Connection
The backend should automatically connect to the PostgreSQL database.

## 🔧 Step 6: Setup Admin User

### 6.1 Create Admin Account
Visit your backend admin setup endpoint:
```
https://akazuba-backend.onrender.com/api/v1/admin/setup
```

This will create an admin user with:
- **Email**: `admin@akazubaflorist.com`
- **Password**: `akazuba2024`

### 6.2 Access Admin Panel
1. Go to your frontend URL
2. Navigate to `/admin/login`
3. Use the admin credentials above

## 🔒 Step 7: Security Configuration

### 7.1 Update Default Passwords
1. Login to admin panel
2. Change the default admin password
3. Update any other default credentials

### 7.2 Configure SSL
Both Vercel and Render provide SSL certificates automatically.

### 7.3 Set Up Monitoring
Consider setting up:
- Error monitoring (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (UptimeRobot)

## 📊 Step 8: Performance Optimization

### 8.1 Enable Caching
- Configure Redis for session storage
- Enable CDN for static assets
- Implement API response caching

### 8.2 Database Optimization
- Set up database indexes
- Configure connection pooling
- Monitor query performance

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` is set correctly
   - Check that the frontend URL is exact (including protocol)

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible from backend

3. **Build Failures**
   - Check build logs in Vercel/Render
   - Ensure all dependencies are in `package.json`

4. **Environment Variables**
   - Verify all required variables are set
   - Check variable names are correct

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 📈 Monitoring and Maintenance

### Regular Tasks
1. Monitor application logs
2. Check database performance
3. Update dependencies
4. Backup database regularly
5. Monitor costs and usage

### Scaling Considerations
- Upgrade Render plan as needed
- Consider using Vercel Pro for advanced features
- Implement proper caching strategies
- Monitor database connection limits

---

## 🎉 Congratulations!

Your Akazuba Florist application is now deployed and ready to serve customers!

**Frontend**: https://online-shopping-by-diane.vercel.app
**Backend**: https://akazuba-backend.onrender.com
**Database**: Render PostgreSQL (managed)

Remember to:
- Test all functionality thoroughly
- Set up proper monitoring
- Keep your dependencies updated
- Monitor your application's performance
